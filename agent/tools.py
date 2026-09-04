from pathlib import Path
from typing import Any, Dict, List, Optional

import joblib
import numpy as np
import pandas as pd


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "data"
MODEL_DIR = BASE_DIR / "models"

FLEET_PATH = DATA_DIR / "fleet.csv"
DEMAND_PATH = DATA_DIR / "bengaluru_demand.csv"
MODEL_PATH = MODEL_DIR / "demand_model.pkl"


# ============================================================
# CONSTANTS
# ============================================================

DEFAULT_SCENARIO_HOUR = 17

ZONES = [
    "Indiranagar",
    "Benniganahalli",
    "Krishnarajapura",
    "Mahatma Gandhi Road",
    "Nadaprabhu Kempegowda Station, Majestic",
]

FEATURE_COLUMNS = [
    "hour",
    "day_of_week",
    "is_weekend",
    "is_peak",
    "previous_hour_demand",
    "previous_day_demand",
    "hour_sin",
    "hour_cos",
    "day_sin",
    "day_cos",
    "demand_change",
    "rolling_3hr_demand",
    "station",
]


# ============================================================
# LOAD DATA
# ============================================================

def _load_fleet() -> pd.DataFrame:
    if not FLEET_PATH.exists():
        raise FileNotFoundError(
            f"Fleet dataset not found: {FLEET_PATH}"
        )

    df = pd.read_csv(FLEET_PATH)

    required = [
        "scooter_id",
        "zone",
        "battery",
        "health_score",
        "trips_today",
        "age_months",
    ]

    missing = [
        col for col in required
        if col not in df.columns
    ]

    if missing:
        raise ValueError(
            f"fleet.csv is missing columns: {missing}"
        )

    df["battery"] = pd.to_numeric(
        df["battery"],
        errors="coerce",
    ).fillna(0)

    df["health_score"] = pd.to_numeric(
        df["health_score"],
        errors="coerce",
    ).fillna(0)

    df["trips_today"] = pd.to_numeric(
        df["trips_today"],
        errors="coerce",
    ).fillna(0)

    df["age_months"] = pd.to_numeric(
        df["age_months"],
        errors="coerce",
    ).fillna(0)

    return df


def _load_demand() -> pd.DataFrame:
    if not DEMAND_PATH.exists():
        raise FileNotFoundError(
            f"Demand dataset not found: {DEMAND_PATH}"
        )

    df = pd.read_csv(DEMAND_PATH)

    required = [
        "date",
        "hour",
        "station",
        "ridership",
        "day_of_week",
        "is_weekend",
        "is_peak",
        "previous_hour_demand",
        "previous_day_demand",
        "rolling_3hr_demand",
        "demand_change",
        "hour_sin",
        "hour_cos",
        "day_sin",
        "day_cos",
    ]

    missing = [
        col for col in required
        if col not in df.columns
    ]

    if missing:
        raise ValueError(
            f"bengaluru_demand.csv is missing columns: {missing}"
        )

    df["date"] = pd.to_datetime(
        df["date"],
        errors="coerce",
    )

    numeric_columns = [
        "hour",
        "ridership",
        "day_of_week",
        "is_weekend",
        "is_peak",
        "previous_hour_demand",
        "previous_day_demand",
        "rolling_3hr_demand",
        "demand_change",
        "hour_sin",
        "hour_cos",
        "day_sin",
        "day_cos",
    ]

    for column in numeric_columns:
        df[column] = pd.to_numeric(
            df[column],
            errors="coerce",
        )

    df = df.dropna(
        subset=[
            "date",
            "hour",
            "station",
            "ridership",
        ]
    ).copy()

    df["hour"] = df["hour"].astype(int)

    return df.sort_values(
        ["station", "date", "hour"]
    ).reset_index(drop=True)


def _load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Demand model not found: {MODEL_PATH}"
        )

    return joblib.load(MODEL_PATH)


fleet_df = _load_fleet()
demand_df = _load_demand()
demand_model = _load_model()


# ============================================================
# NORMALIZATION HELPERS
# ============================================================

def _python_value(value):
    """
    Convert numpy/pandas values into normal Python values
    so FastAPI JSON serialization never receives np.int64,
    np.float64, Timestamp, etc.
    """

    if isinstance(value, dict):
        return {
            str(k): _python_value(v)
            for k, v in value.items()
        }

    if isinstance(value, (list, tuple)):
        return [
            _python_value(v)
            for v in value
        ]

    if isinstance(value, np.ndarray):
        return [
            _python_value(v)
            for v in value.tolist()
        ]

    if isinstance(value, np.generic):
        return value.item()

    if isinstance(value, pd.Timestamp):
        return value.isoformat()

    if isinstance(value, float):
        if np.isnan(value) or np.isinf(value):
            return None

    return value


def _safe_float(value, default=0.0):
    try:
        result = float(value)

        if not np.isfinite(result):
            return default

        return result

    except Exception:
        return default


def _safe_int(value, default=0):
    try:
        return int(float(value))
    except Exception:
        return default


# ============================================================
# RISK ENGINE
# ============================================================

def calculate_vehicle_risk(row: Any) -> float:
    """
    Rule-based operational risk score.

    IMPORTANT:
    This is NOT a trained ML maintenance model.
    It is a deterministic fleet-risk policy.
    """

    battery = _safe_float(
        row.get("battery", 0)
    )

    health = _safe_float(
        row.get("health_score", 0)
    )

    trips = _safe_float(
        row.get("trips_today", 0)
    )

    age = _safe_float(
        row.get("age_months", 0)
    )

    risk = 0.05

    # Battery
    if battery < 30:
        risk += 0.25
    elif battery < 50:
        risk += 0.10

    # Health
    if health < 70:
        risk += 0.25
    elif health < 80:
        risk += 0.12

    # Utilization
    if trips > 12:
        risk += 0.15
    elif trips > 10:
        risk += 0.08

    # Age
    if age > 24:
        risk += 0.15
    elif age > 18:
        risk += 0.08

    return round(
        min(risk, 0.95),
        2,
    )


def get_vehicle_risk(scooter_id: str) -> Optional[Dict]:
    matches = fleet_df[
        fleet_df["scooter_id"] == scooter_id
    ]

    if matches.empty:
        return None

    row = matches.iloc[0].to_dict()

    result = {
        "scooter_id": row["scooter_id"],
        "zone": row["zone"],
        "battery": _safe_float(row["battery"]),
        "health_score": _safe_float(
            row["health_score"]
        ),
        "trips_today": _safe_int(
            row["trips_today"]
        ),
        "age_months": _safe_int(
            row["age_months"]
        ),
        "risk": calculate_vehicle_risk(row),
    }

    return _python_value(result)


def get_high_risk_scooters(
    threshold: float = 0.50,
) -> List[Dict]:
    """
    High-risk means risk >= 0.50.

    With the current 25-scooter fleet this gives the
    expected 6 high-risk vehicles.
    """

    results = []

    for _, row in fleet_df.iterrows():
        row_dict = row.to_dict()

        risk = calculate_vehicle_risk(
            row_dict
        )

        if risk >= threshold:
            results.append(
                {
                    "scooter_id": row["scooter_id"],
                    "zone": row["zone"],
                    "battery": _safe_float(
                        row["battery"]
                    ),
                    "health_score": _safe_float(
                        row["health_score"]
                    ),
                    "trips_today": _safe_int(
                        row["trips_today"]
                    ),
                    "age_months": _safe_int(
                        row["age_months"]
                    ),
                    "risk": risk,
                }
            )

    results.sort(
        key=lambda x: x["risk"],
        reverse=True,
    )

    return _python_value(results)


# ============================================================
# FLEET STATE
# ============================================================

def get_fleet_status() -> Dict:
    total = len(fleet_df)

    average_battery = (
        fleet_df["battery"].mean()
        if total
        else 0
    )

    average_health = (
        fleet_df["health_score"].mean()
        if total
        else 0
    )

    low_battery = int(
        (fleet_df["battery"] < 50).sum()
    )

    high_risk = len(
        get_high_risk_scooters()
    )

    zones = int(
        fleet_df["zone"].nunique()
    )

    return _python_value(
        {
            "total_scooters": total,
            "average_battery": round(
                _safe_float(average_battery),
                2,
            ),
            "average_health": round(
                _safe_float(average_health),
                2,
            ),
            "low_battery_scooters": low_battery,
            "high_risk_scooters": high_risk,
            "zones": zones,
        }
    )


def get_zone_distribution() -> List[str]:
    """
    Return zone names.

    Kept as a list because existing agent/optimizer code
    expects to iterate directly over zones.
    """

    return [
        str(zone)
        for zone in fleet_df["zone"]
        .dropna()
        .unique()
        .tolist()
    ]


def get_zone_counts() -> List[Dict]:
    results = []

    for zone in get_zone_distribution():
        count = int(
            (
                fleet_df["zone"] == zone
            ).sum()
        )

        results.append(
            {
                "zone": zone,
                "count": count,
            }
        )

    return _python_value(results)


# ============================================================
# ZONE / VEHICLE STATE
# ============================================================

def get_latest_zone_state(
    zone: str,
) -> Dict:
    zone_df = demand_df[
        demand_df["station"] == zone
    ].copy()

    if zone_df.empty:
        return {
            "zone": zone,
            "latest_date": None,
            "latest_hour": None,
            "current_demand": 0,
            "previous_hour_demand": 0,
            "previous_day_demand": 0,
        }

    latest_date = zone_df["date"].max()

    latest_rows = zone_df[
        zone_df["date"] == latest_date
    ].sort_values("hour")

    latest = latest_rows.iloc[-1]

    return _python_value(
        {
            "zone": zone,
            "latest_date": latest_date,
            "latest_hour": _safe_int(
                latest["hour"]
            ),
            "current_demand": _safe_float(
                latest["ridership"]
            ),
            "previous_hour_demand": _safe_float(
                latest["previous_hour_demand"]
            ),
            "previous_day_demand": _safe_float(
                latest["previous_day_demand"]
            ),
            "rolling_3hr_demand": _safe_float(
                latest["rolling_3hr_demand"]
            ),
        }
    )


# ============================================================
# DEMAND FEATURE CONSTRUCTION
# ============================================================

def _get_reference_row(
    zone: str,
    hour: int,
) -> Optional[pd.Series]:

    zone_df = demand_df[
        demand_df["station"] == zone
    ].copy()

    if zone_df.empty:
        return None

    # Prefer the latest available date containing
    # the requested hour.
    matching = zone_df[
        zone_df["hour"] == hour
    ].sort_values("date")

    if not matching.empty:
        return matching.iloc[-1]

    # Otherwise use the latest row for the zone.
    return zone_df.sort_values(
        ["date", "hour"]
    ).iloc[-1]


def _build_prediction_features(
    zone: str,
    hour: int,
    current_demand: Optional[float] = None,
) -> Dict:

    hour = max(
        0,
        min(23, int(hour)),
    )

    reference = _get_reference_row(
        zone,
        hour,
    )

    # --------------------------------------------------------
    # If the requested zone does not exist in the real
    # dataset, fall back to a sensible feature row.
    # --------------------------------------------------------

    if reference is None:

        reference = demand_df.iloc[-1]

        station = zone

        day_of_week = _safe_int(
            reference["day_of_week"]
        )

        is_weekend = _safe_int(
            day_of_week >= 5
        )

        is_peak = int(
            hour in [8, 9, 10, 17, 18, 19, 20]
        )

        previous_hour_demand = (
            _safe_float(current_demand)
            if current_demand is not None
            else 0.0
        )

        previous_day_demand = (
            previous_hour_demand
        )

        rolling_3hr_demand = (
            previous_hour_demand
        )

        demand_change = 0.0

    else:

        station = zone

        day_of_week = _safe_int(
            reference["day_of_week"]
        )

        is_weekend = _safe_int(
            reference["is_weekend"]
        )

        is_peak = _safe_int(
            reference["is_peak"]
        )

        previous_hour_demand = _safe_float(
            reference["previous_hour_demand"]
        )

        previous_day_demand = _safe_float(
            reference["previous_day_demand"]
        )

        rolling_3hr_demand = _safe_float(
            reference["rolling_3hr_demand"]
        )

        demand_change = _safe_float(
            reference["demand_change"]
        )

        # If caller explicitly supplies current demand,
        # use it as the current observation.
        if current_demand is not None:
            previous_hour_demand = _safe_float(
                current_demand
            )

    hour_sin = np.sin(
        2 * np.pi * hour / 24
    )

    hour_cos = np.cos(
        2 * np.pi * hour / 24
    )

    day_sin = np.sin(
        2 * np.pi * day_of_week / 7
    )

    day_cos = np.cos(
        2 * np.pi * day_of_week / 7
    )

    return {
        "hour": hour,
        "day_of_week": day_of_week,
        "is_weekend": is_weekend,
        "is_peak": is_peak,
        "previous_hour_demand": previous_hour_demand,
        "previous_day_demand": previous_day_demand,
        "hour_sin": hour_sin,
        "hour_cos": hour_cos,
        "day_sin": day_sin,
        "day_cos": day_cos,
        "demand_change": demand_change,
        "rolling_3hr_demand": rolling_3hr_demand,
        "station": station,
    }


# ============================================================
# DEMAND PREDICTION
# ============================================================

def predict_demand(
    zone: str,
    hour: Optional[int] = None,
    current_demand: Optional[float] = None,
) -> float:

    if hour is None:
        hour = DEFAULT_SCENARIO_HOUR

    hour = int(hour)

    features = _build_prediction_features(
        zone=zone,
        hour=hour,
        current_demand=current_demand,
    )

    X = pd.DataFrame(
        [features],
        columns=FEATURE_COLUMNS,
    )

    try:
        prediction = demand_model.predict(X)

        prediction = float(
            np.asarray(prediction).reshape(-1)[0]
        )

    except Exception as exc:
        print(
            f"Demand prediction error for {zone}: {exc}"
        )

        # Safe fallback based on historical demand.
        historical = demand_df[
            (
                demand_df["station"] == zone
            )
            & (
                demand_df["hour"] == hour
            )
        ]

        if historical.empty:
            historical = demand_df[
                demand_df["hour"] == hour
            ]

        if historical.empty:
            return 0.0

        prediction = float(
            historical["ridership"].mean()
        )

    return round(
        max(0.0, prediction),
        2,
    )


# ============================================================
# SCENARIO STATE
# ============================================================

def get_scenario_state(
    zone: str,
    hour: Optional[int] = None,
) -> Dict:

    # --------------------------------------------------------
    # IMPORTANT:
    # Default operational scenario is 17:00.
    # Never randomly select 1 AM.
    # --------------------------------------------------------

    if hour is None:
        hour = DEFAULT_SCENARIO_HOUR

    hour = int(hour)

    hour = max(
        0,
        min(23, hour),
    )

    reference = _get_reference_row(
        zone,
        hour,
    )

    if reference is not None:
        previous_hour_demand = _safe_float(
            reference["previous_hour_demand"]
        )

        previous_day_demand = _safe_float(
            reference["previous_day_demand"]
        )

        rolling_3hr_demand = _safe_float(
            reference["rolling_3hr_demand"]
        )

        current_demand = _safe_float(
            reference["ridership"]
        )

    else:
        latest = get_latest_zone_state(
            zone
        )

        previous_hour_demand = _safe_float(
            latest.get("previous_hour_demand")
        )

        previous_day_demand = _safe_float(
            latest.get("previous_day_demand")
        )

        rolling_3hr_demand = _safe_float(
            latest.get("rolling_3hr_demand")
        )

        current_demand = _safe_float(
            latest.get("current_demand")
        )

    predicted_demand = predict_demand(
        zone=zone,
        hour=hour,
    )

    return _python_value(
        {
            "zone": zone,
            "hour": hour,
            "current_demand": round(
                current_demand,
                2,
            ),
            "previous_hour_demand": round(
                previous_hour_demand,
                2,
            ),
            "previous_day_demand": round(
                previous_day_demand,
                2,
            ),
            "rolling_3hr_demand": round(
                rolling_3hr_demand,
                2,
            ),
            "predicted_demand": round(
                predicted_demand,
                2,
            ),
        }
    )


# ============================================================
# RELOCATION CANDIDATES
# ============================================================

def get_relocation_candidates(
    target_zone: str,
) -> List[Dict]:

    candidates = []

    for _, row in fleet_df.iterrows():

        zone = row["zone"]

        if zone == target_zone:
            continue

        battery = _safe_float(
            row["battery"]
        )

        health = _safe_float(
            row["health_score"]
        )

        risk = calculate_vehicle_risk(
            row.to_dict()
        )

        # ----------------------------------------------------
        # Healthy deployment policy
        #
        # We don't relocate vehicles that are:
        # - low battery
        # - poor health
        # - high operational risk
        # ----------------------------------------------------

        if battery < 50:
            continue

        if health < 80:
            continue

        if risk >= 0.50:
            continue

        candidates.append(
            {
                "scooter_id": row["scooter_id"],
                "source_zone": zone,
                "zone": zone,
                "target_zone": target_zone,
                "battery": battery,
                "health_score": health,
                "trips_today": _safe_int(
                    row["trips_today"]
                ),
                "age_months": _safe_int(
                    row["age_months"]
                ),
                "risk": risk,
            }
        )

    # Prefer healthier vehicles with more battery
    # and lower utilization.
    candidates.sort(
        key=lambda x: (
            x["risk"],
            -x["health_score"],
            -x["battery"],
            x["trips_today"],
        )
    )

    return _python_value(candidates)


# ============================================================
# AVAILABLE VEHICLES
# ============================================================

def get_available_vehicles(
    zone: Optional[str] = None,
) -> List[Dict]:

    df = fleet_df

    if zone:
        df = df[
            df["zone"] == zone
        ]

    results = []

    for _, row in df.iterrows():
        row_dict = row.to_dict()

        results.append(
            {
                "scooter_id": row["scooter_id"],
                "zone": row["zone"],
                "battery": _safe_float(
                    row["battery"]
                ),
                "health_score": _safe_float(
                    row["health_score"]
                ),
                "trips_today": _safe_int(
                    row["trips_today"]
                ),
                "age_months": _safe_int(
                    row["age_months"]
                ),
                "risk": calculate_vehicle_risk(
                    row_dict
                ),
            }
        )

    return _python_value(results)


# ============================================================
# CHARGING PRIORITY
# ============================================================

def get_charging_priority() -> List[Dict]:

    results = []

    for _, row in fleet_df.iterrows():

        battery = _safe_float(
            row["battery"]
        )

        if battery <= 25:
            urgency = "CRITICAL"
        elif battery <= 40:
            urgency = "HIGH"
        elif battery <= 55:
            urgency = "MEDIUM"
        else:
            urgency = "LOW"

        if battery <= 25:
            action = "Charge immediately"
        elif battery <= 40:
            action = "Charge soon"
        elif battery <= 55:
            action = "Schedule charging"
        else:
            action = "No immediate charging required"

        results.append(
            {
                "scooter_id": row["scooter_id"],
                "zone": row["zone"],
                "battery": battery,
                "health_score": _safe_float(
                    row["health_score"]
                ),
                "urgency": urgency,
                "action": action,
            }
        )

    results.sort(
        key=lambda x: x["battery"]
    )

    return _python_value(results)


# ============================================================
# MAINTENANCE PRIORITY
# ============================================================

def get_maintenance_priority() -> List[Dict]:

    results = []

    for _, row in fleet_df.iterrows():

        row_dict = row.to_dict()

        battery = _safe_float(
            row["battery"]
        )

        health = _safe_float(
            row["health_score"]
        )

        trips = _safe_int(
            row["trips_today"]
        )

        age = _safe_int(
            row["age_months"]
        )

        risk = calculate_vehicle_risk(
            row_dict
        )

        score = (
            risk * 60
            + max(0, 70 - health) * 0.25
            + max(0, 40 - battery) * 0.20
            + max(0, age - 18) * 0.8
        )

        if score >= 40:
            priority = "CRITICAL"
        elif score >= 25:
            priority = "HIGH"
        elif score >= 15:
            priority = "MEDIUM"
        else:
            priority = "LOW"

        reasons = []

        if battery < 30:
            reasons.append("low battery")

        if health < 70:
            reasons.append("low health")

        if age > 24:
            reasons.append("high age")

        if trips > 12:
            reasons.append("high utilization")

        results.append(
            {
                "scooter_id": row["scooter_id"],
                "zone": row["zone"],
                "battery": battery,
                "health_score": health,
                "trips_today": trips,
                "age_months": age,
                "risk": risk,
                "maintenance_score": round(
                    score,
                    2,
                ),
                "priority": priority,
                "reasons": reasons,
            }
        )

    results.sort(
        key=lambda x: x["maintenance_score"],
        reverse=True,
    )

    return _python_value(results)


# ============================================================
# SUMMARY FOR AGENT
# ============================================================

def get_operational_summary(
    zone: Optional[str] = None,
    hour: Optional[int] = None,
) -> Dict:

    if zone is None:
        zone = (
            "Nadaprabhu Kempegowda Station, Majestic"
        )

    if hour is None:
        hour = DEFAULT_SCENARIO_HOUR

    scenario = get_scenario_state(
        zone=zone,
        hour=hour,
    )

    return _python_value(
        {
            "fleet": get_fleet_status(),
            "target_zone": zone,
            "scenario": scenario,
            "high_risk": get_high_risk_scooters(),
            "relocation_candidates": (
                get_relocation_candidates(zone)
            ),
            "charging_priority": (
                get_charging_priority()[:10]
            ),
            "maintenance_priority": (
                get_maintenance_priority()[:10]
            ),
        }
    )


# ============================================================
# STARTUP DIAGNOSTICS
# ============================================================

def print_tool_status():
    status = get_fleet_status()

    print("\n" + "=" * 65)
    print("                    FLEETMIND TOOLS")
    print("=" * 65)

    print(
        f"Fleet: {status['total_scooters']} scooters"
    )

    print(
        f"Average battery: "
        f"{status['average_battery']}%"
    )

    print(
        f"Average health: "
        f"{status['average_health']}"
    )

    print(
        f"Low battery: "
        f"{status['low_battery_scooters']}"
    )

    print(
        f"High risk: "
        f"{status['high_risk_scooters']}"
    )

    print(
        f"Zones: {status['zones']}"
    )

    print(
        f"Default scenario: "
        f"{DEFAULT_SCENARIO_HOUR}:00"
    )

    print(
        f"Demand rows: {len(demand_df)}"
    )

    print("=" * 65)


# ============================================================
# OPTIONAL ALIASES
# ============================================================

# Existing/newer components can use either naming style.

get_risk_score = calculate_vehicle_risk

get_charging_recommendations = (
    get_charging_priority
)

get_maintenance_priorities = (
    get_maintenance_priority
)