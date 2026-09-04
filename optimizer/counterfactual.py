import pandas as pd

from optimizer.financial_engine import (
    calculate_failure_risk,
    calculate_action_profit,
)


# ============================================================
# FIND HEALTHY RELOCATION CANDIDATES
# ============================================================

def find_relocation_candidates(
    fleet,
    target_zone
):
    """
    Find healthy scooters that can be safely relocated.

    Risky scooters are deliberately excluded from deployment.
    """

    candidates = fleet[
        (fleet["zone"] != target_zone)
        &
        (fleet["battery"] >= 50)
        &
        (fleet["health_score"] >= 80)
    ].copy()

    candidates["failure_risk"] = candidates.apply(
        calculate_failure_risk,
        axis=1
    )

    candidates = candidates[
        candidates["failure_risk"] < 0.30
    ].copy()

    candidates["deployment_score"] = (
        candidates["battery"] * 0.45
        +
        candidates["health_score"] * 0.55
    )

    candidates = candidates.sort_values(
        "deployment_score",
        ascending=False
    )

    return candidates


# ============================================================
# EXPECTED TRIPS
# ============================================================

def calculate_expected_trips(
    current_supply,
    scooters_moved,
    predicted_demand
):
    """
    Estimate scooter trips for the next hour.

    The model deliberately uses diminishing returns:
    each additional scooter contributes less incremental
    capacity as the target zone becomes saturated.

    Metro ridership is a demand proxy, so only a small
    serviceable fraction is converted into scooter demand.
    """

    # Existing fleet capacity
    base_capacity = current_supply * 3.0

    additional_capacity = 0.0

    for i in range(1, scooters_moved + 1):

        # Diminishing marginal utilization
        marginal_rides = max(
            1.0,
            5.5 - (0.55 * i)
        )

        additional_capacity += marginal_rides

    total_capacity = (
        base_capacity
        +
        additional_capacity
    )

    # Bengaluru metro ridership -> scooter demand proxy
    serviceable_demand = (
        predicted_demand * 0.04
    )

    expected_trips = min(
        total_capacity,
        serviceable_demand
    )

    return round(
        expected_trips,
        2
    )


# ============================================================
# COUNTERFACTUAL SIMULATOR
# ============================================================

def simulate_counterfactuals(
    fleet,
    target_zone,
    predicted_demand,
    max_scooters=10
):
    """
    Evaluate multiple possible fleet actions.

    Example:

        Move 0 scooters
        Move 1 scooter
        Move 2 scooters
        ...
        Move 10 scooters

    Each scenario is evaluated financially.
    """

    candidates = find_relocation_candidates(
        fleet,
        target_zone
    )

    current_supply = len(
        fleet[
            fleet["zone"] == target_zone
        ]
    )

    max_possible = min(
        max_scooters,
        len(candidates)
    )

    # Convert DataFrame rows into dictionaries.
    #
    # This is important because calculate_action_profit()
    # expects scooter records, not DataFrame column names.
    scooter_records = fleet.to_dict(
        orient="records"
    )

    scenarios = []

    for scooters_moved in range(
        max_possible + 1
    ):

        expected_trips = calculate_expected_trips(
            current_supply=current_supply,
            scooters_moved=scooters_moved,
            predicted_demand=predicted_demand
        )

        # ----------------------------------------------------
        # Base financial calculation
        # ----------------------------------------------------

        result = calculate_action_profit(
            scooters=scooter_records,
            expected_trips=expected_trips,
            payment_success_rate=0.94,
            scooters_moved=scooters_moved
        )

        # ----------------------------------------------------
        # Increasing operational friction
        # ----------------------------------------------------
        #
        # Moving the first few scooters is easy.
        # Moving many at once creates:
        #
        # - driver/logistics coordination
        # - pickup/drop-off time
        # - battery depletion during relocation
        # - operational disruption
        #
        # This gives the optimizer a realistic tradeoff.
        # ----------------------------------------------------

        coordination_cost = (
            10
            * scooters_moved
            * max(
                0,
                scooters_moved - 1
            )
        )

        total_cost = (
            result["total_cost"]
            +
            coordination_cost
        )

        contribution_margin = (
            result["revenue"]
            -
            total_cost
        )

        scenarios.append(
            {
                "scooters_moved": scooters_moved,

                "expected_trips": expected_trips,

                "revenue": round(
                    result["revenue"],
                    2
                ),

                "energy_cost": round(
                    result["energy_cost"],
                    2
                ),

                "relocation_cost": round(
                    result["relocation_cost"],
                    2
                ),

                "coordination_cost": round(
                    coordination_cost,
                    2
                ),

                "risk_cost": round(
                    result["risk_cost"],
                    2
                ),

                "total_cost": round(
                    total_cost,
                    2
                ),

                "contribution_margin": round(
                    contribution_margin,
                    2
                )
            }
        )

    return scenarios, candidates


# ============================================================
# GENERATE BEST DECISION
# ============================================================

def generate_decision(
    fleet,
    target_zone,
    predicted_demand
):

    scenarios, candidates = (
        simulate_counterfactuals(
            fleet=fleet,
            target_zone=target_zone,
            predicted_demand=predicted_demand
        )
    )

    scenario_df = pd.DataFrame(
        scenarios
    )

    # --------------------------------------------------------
    # Select financially optimal scenario
    # --------------------------------------------------------

    best = scenario_df.loc[
        scenario_df[
            "contribution_margin"
        ].idxmax()
    ]

    baseline = scenario_df[
        scenario_df[
            "scooters_moved"
        ] == 0
    ].iloc[0]

    scooters_moved = int(
        best["scooters_moved"]
    )

    baseline_margin = float(
        baseline["contribution_margin"]
    )

    optimized_margin = float(
        best["contribution_margin"]
    )

    margin_gain = (
        optimized_margin
        -
        baseline_margin
    )

    # --------------------------------------------------------
    # Natural-language action
    # --------------------------------------------------------

    if scooters_moved == 0:

        action = (
            f"Do not relocate scooters. "
            f"The current fleet allocation produces "
            f"the highest contribution margin for "
            f"{target_zone}."
        )

    else:

        action = (
            f"Move {scooters_moved} healthy scooters "
            f"into {target_zone}."
        )

    # --------------------------------------------------------
    # Identify selected scooters
    # --------------------------------------------------------

    selected_candidates = candidates.head(
        scooters_moved
    )

    selected_scooters = (
        selected_candidates[
            "scooter_id"
        ].tolist()
    )

    source_distribution = {}

    if scooters_moved > 0:

        source_distribution = (
            selected_candidates[
                "zone"
            ]
            .value_counts()
            .to_dict()
        )

    # --------------------------------------------------------
    # Return structured decision
    # --------------------------------------------------------

    return {

        "action": action,

        "target_zone": target_zone,

        "predicted_demand": round(
            float(predicted_demand),
            2
        ),

        "scooters_moved": scooters_moved,

        "expected_trips": float(
            best["expected_trips"]
        ),

        "revenue": float(
            best["revenue"]
        ),

        "total_cost": float(
            best["total_cost"]
        ),

        "expected_margin": optimized_margin,

        "baseline_margin": baseline_margin,

        "margin_gain": margin_gain,

        "scenarios": scenarios,

        "selected_scooters":
            selected_scooters,

        "source_distribution":
            source_distribution
    }


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    print()
    print("=" * 65)
    print("             FLEETMIND COUNTERFACTUAL TEST")
    print("=" * 65)

    fleet = pd.read_csv(
        "data/fleet.csv"
    )

    target_zone = (
        "Nadaprabhu Kempegowda Station, Majestic"
    )

    predicted_demand = 1855

    decision = generate_decision(
        fleet=fleet,
        target_zone=target_zone,
        predicted_demand=predicted_demand
    )

    print("\nRecommendation:")
    print(
        decision["action"]
    )

    print(
        f"\nExpected trips: "
        f"{decision['expected_trips']:.2f}"
    )

    print(
        f"Revenue: "
        f"₹{decision['revenue']:,.0f}"
    )

    print(
        f"Total cost: "
        f"₹{decision['total_cost']:,.0f}"
    )

    print(
        f"Contribution margin: "
        f"₹{decision['expected_margin']:,.0f}"
    )

    print(
        f"Margin improvement: "
        f"₹{decision['margin_gain']:,.0f}"
    )

    print("\nSelected scooters:")

    for scooter in decision[
        "selected_scooters"
    ]:

        print(
            f"  - {scooter}"
        )

    print("\nCounterfactual scenarios:")

    print(
        pd.DataFrame(
            decision["scenarios"]
        ).to_string(
            index=False
        )
    )

    print()