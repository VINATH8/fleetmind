import pandas as pd


# ============================================================
# FLEETMIND FINANCIAL ASSUMPTIONS
# ============================================================

FARE_PER_RIDE = 110

ENERGY_COST_PER_RIDE = 12

RELOCATION_COST_PER_SCOOTER = 45

SWAP_COST = 35

MAINTENANCE_COST = 180

FAILURE_COST = 700


REQUIRED_COLUMNS = [
    "scooter_id",
    "zone",
    "battery",
    "health_score",
    "trips_today",
    "age_months",
]


# ============================================================
# DATA VALIDATION
# ============================================================

def validate_fleet_data(fleet):

    missing = [
        column
        for column in REQUIRED_COLUMNS
        if column not in fleet.columns
    ]

    if missing:
        raise ValueError(
            f"Missing fleet columns: {missing}"
        )

    if fleet.empty:
        raise ValueError(
            "Fleet dataset is empty."
        )

    return True


# ============================================================
# FAILURE RISK
# ============================================================

def calculate_failure_risk(row):

    risk = 0.05

    battery = float(
        row["battery"]
    )

    health = float(
        row["health_score"]
    )

    trips = float(
        row["trips_today"]
    )

    age = float(
        row["age_months"]
    )

    if battery < 30:
        risk += 0.25

    elif battery < 50:
        risk += 0.10

    if health < 70:
        risk += 0.25

    elif health < 80:
        risk += 0.12

    if trips > 12:
        risk += 0.15

    elif trips > 10:
        risk += 0.08

    if age > 24:
        risk += 0.15

    elif age > 18:
        risk += 0.08

    return min(
        risk,
        0.95
    )


# ============================================================
# SCOOTER RISK VALUE
# ============================================================

def calculate_scooter_value(row):

    failure_probability = (
        calculate_failure_risk(row)
    )

    expected_failure_cost = (
        failure_probability
        *
        FAILURE_COST
    )

    battery_cost = 0

    if row["battery"] < 40:
        battery_cost = SWAP_COST

    health = float(
        row["health_score"]
    )

    if health < 70:
        expected_maintenance_cost = (
            MAINTENANCE_COST
        )

    elif health < 80:
        expected_maintenance_cost = (
            MAINTENANCE_COST * 0.5
        )

    else:
        expected_maintenance_cost = 0

    total_risk_cost = (
        expected_failure_cost
        +
        battery_cost
        +
        expected_maintenance_cost
    )

    return {
        "failure_probability":
            failure_probability,

        "expected_failure_cost":
            expected_failure_cost,

        "battery_cost":
            battery_cost,

        "expected_maintenance_cost":
            expected_maintenance_cost,

        "total_risk_cost":
            total_risk_cost,
    }


# ============================================================
# ACTION PROFIT
# ============================================================

def calculate_action_profit(
    scooters,
    expected_trips,
    payment_success_rate,
    scooters_moved
):
    """
    Calculate financial outcome of an action.

    IMPORTANT:
    Risk cost is applied only to scooters being moved,
    because we are evaluating the incremental relocation
    decision rather than charging the same fleet-wide risk
    cost to every scenario.
    """

    if isinstance(
        scooters,
        pd.DataFrame
    ):

        scooter_records = scooters.to_dict(
            orient="records"
        )

    else:

        scooter_records = list(
            scooters
        )

    # --------------------------------------------------------
    # Expected successful transactions
    # --------------------------------------------------------

    expected_transactions = (
        expected_trips
        *
        payment_success_rate
    )

    # --------------------------------------------------------
    # Revenue
    # --------------------------------------------------------

    revenue = (
        expected_transactions
        *
        FARE_PER_RIDE
    )

    # --------------------------------------------------------
    # Energy
    # --------------------------------------------------------

    energy_cost = (
        expected_trips
        *
        ENERGY_COST_PER_RIDE
    )

    # --------------------------------------------------------
    # Relocation
    # --------------------------------------------------------

    relocation_cost = (
        scooters_moved
        *
        RELOCATION_COST_PER_SCOOTER
    )

    # --------------------------------------------------------
    # Risk cost
    # --------------------------------------------------------
    #
    # Only the scooters being deployed are exposed to
    # additional relocation/deployment risk.
    #
    # We therefore calculate risk on the best available
    # healthy candidates.
    # --------------------------------------------------------

    candidates = []

    for scooter in scooter_records:

        risk = calculate_failure_risk(
            scooter
        )

        if (
            scooter["battery"] >= 50
            and
            scooter["health_score"] >= 80
            and
            risk < 0.30
        ):

            candidates.append(
                scooter
            )

    candidates = sorted(
        candidates,
        key=lambda x: (
            float(x["battery"]) * 0.45
            +
            float(x["health_score"]) * 0.55
        ),
        reverse=True
    )

    selected = candidates[
        :scooters_moved
    ]

    risk_cost = 0

    for scooter in selected:

        value = calculate_scooter_value(
            scooter
        )

        # Only a fraction of the scooter's theoretical
        # failure exposure is treated as incremental
        # deployment risk.
        risk_cost += (
            value["expected_failure_cost"]
            * 0.25
        )

    # --------------------------------------------------------
    # Total cost
    # --------------------------------------------------------

    total_cost = (
        energy_cost
        +
        relocation_cost
        +
        risk_cost
    )

    # --------------------------------------------------------
    # Contribution margin
    # --------------------------------------------------------

    contribution_margin = (
        revenue
        -
        total_cost
    )

    return {
        "expected_transactions":
            expected_transactions,

        "revenue":
            revenue,

        "energy_cost":
            energy_cost,

        "relocation_cost":
            relocation_cost,

        "risk_cost":
            risk_cost,

        "total_cost":
            total_cost,

        "contribution_margin":
            contribution_margin,
    }


# ============================================================
# FLEET SUMMARY
# ============================================================

def get_fleet_summary(
    fleet
):

    validate_fleet_data(
        fleet
    )

    fleet = fleet.copy()

    fleet["failure_risk"] = fleet.apply(
        calculate_failure_risk,
        axis=1
    )

    return {
        "total_scooters":
            int(len(fleet)),

        "average_battery":
            round(
                fleet["battery"].mean(),
                2
            ),

        "average_health":
            round(
                fleet["health_score"].mean(),
                2
            ),

        "low_battery_scooters":
            int(
                (fleet["battery"] < 40).sum()
            ),

        "high_risk_scooters":
            int(
                (fleet["failure_risk"] >= 0.50).sum()
            ),

        "zones":
            int(
                fleet["zone"].nunique()
            ),
    }


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    fleet = pd.read_csv(
        "data/fleet.csv"
    )

    print("\nFleet summary:")
    print(
        get_fleet_summary(
            fleet
        )
    )

    print("\nFinancial test:")

    result = calculate_action_profit(
        scooters=fleet,
        expected_trips=36.45,
        payment_success_rate=0.94,
        scooters_moved=6
    )

    for key, value in result.items():

        if isinstance(
            value,
            (int, float)
        ):

            print(
                f"{key}: "
                f"{value:.2f}"
            )

        else:

            print(
                f"{key}: "
                f"{value}"
            )