# ============================================================
# FLEETMIND API SERVER
# ============================================================

import os
import sys
import math
import re
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# ============================================================
# PROJECT PATH
# ============================================================

PROJECT_ROOT = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="FleetMind API",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# REQUEST MODEL
# ============================================================

class AskRequest(BaseModel):
    message: str


# ============================================================
# JSON CLEANER
# ============================================================

def clean_data(value: Any):

    if value is None:
        return None

    if isinstance(value, (str, int, bool)):
        return value

    if isinstance(value, float):

        if math.isnan(value) or math.isinf(value):
            return None

        return value

    if isinstance(value, dict):

        return {
            str(k): clean_data(v)
            for k, v in value.items()
        }

    if isinstance(value, (list, tuple)):

        return [
            clean_data(v)
            for v in value
        ]

    if hasattr(value, "item"):

        try:
            return clean_data(value.item())
        except Exception:
            pass

    if hasattr(value, "isoformat"):

        try:
            return value.isoformat()
        except Exception:
            pass

    return str(value)


# ============================================================
# IMPORT FLEET TOOLS
# ============================================================

try:

    from agent import tools

    print(
        "[FleetMind] Fleet tools loaded:",
        tools.__file__
    )

except Exception as e:

    tools = None

    print(
        "[FleetMind] Fleet tools import failed:",
        repr(e)
    )


# ============================================================
# IMPORT AGENT
# ============================================================

try:

    from agent.fleetmind_agent import ask_fleetmind

    print(
        "[FleetMind] Agent loaded successfully."
    )

except Exception as e:

    ask_fleetmind = None

    print(
        "[FleetMind] Agent import failed:",
        repr(e)
    )


# ============================================================
# GLOBAL SETTINGS
# ============================================================

DEFAULT_HOUR = 17

ZONES = [
    "Benniganahalli",
    "Indiranagar",
    "Mahatma Gandhi Road",
    "Nadaprabhu Kempegowda Station, Majestic",
    "Krishnarajapura",
]


ZONE_ALIASES = {

    "majestic":
        "Nadaprabhu Kempegowda Station, Majestic",

    "nadaprabhu":
        "Nadaprabhu Kempegowda Station, Majestic",

    "mg road":
        "Mahatma Gandhi Road",

    "mgroad":
        "Mahatma Gandhi Road",

    "mahatma gandhi road":
        "Mahatma Gandhi Road",

    "kr puram":
        "Krishnarajapura",

    "krpuram":
        "Krishnarajapura",

    "krishnarajapura":
        "Krishnarajapura",

    "benniganahalli":
        "Benniganahalli",

    "indiranagar":
        "Indiranagar",
}


# ============================================================
# FINANCIAL CONSTANTS
# ============================================================

FARE_PER_RIDE = 110

ENERGY_COST_PER_RIDE = 12

RELOCATION_COST_PER_SCOOTER = 45

SWAP_COST = 35

MAINTENANCE_COST = 180

FAILURE_COST = 700


# ============================================================
# VERIFIED COUNTERFACTUAL MODEL
# ============================================================

COUNTERFACTUAL = [

    {
        "scooters": 0,
        "trips": 15.00,
        "revenue": 1551.00,
        "cost": 180.00,
        "margin": 1371.00,
    },

    {
        "scooters": 1,
        "trips": 19.95,
        "revenue": 2062.83,
        "cost": 293.15,
        "margin": 1769.68,
    },

    {
        "scooters": 2,
        "trips": 24.35,
        "revenue": 2517.79,
        "cost": 419.70,
        "margin": 2098.09,
    },

    {
        "scooters": 3,
        "trips": 28.20,
        "revenue": 2915.88,
        "cost": 559.65,
        "margin": 2356.23,
    },

    {
        "scooters": 4,
        "trips": 31.50,
        "revenue": 3257.10,
        "cost": 713.00,
        "margin": 2544.10,
    },

    {
        "scooters": 5,
        "trips": 34.25,
        "revenue": 3541.45,
        "cost": 879.75,
        "margin": 2661.70,
    },

    {
        "scooters": 6,
        "trips": 36.45,
        "revenue": 3768.93,
        "cost": 1059.90,
        "margin": 2709.03,
    },

    {
        "scooters": 7,
        "trips": 38.10,
        "revenue": 3939.54,
        "cost": 1253.45,
        "margin": 2686.09,
    },

    {
        "scooters": 8,
        "trips": 39.20,
        "revenue": 4053.28,
        "cost": 1460.40,
        "margin": 2592.88,
    },

    {
        "scooters": 9,
        "trips": 40.20,
        "revenue": 4156.68,
        "cost": 1686.15,
        "margin": 2470.53,
    },

    {
        "scooters": 10,
        "trips": 41.20,
        "revenue": 4260.08,
        "cost": 1931.90,
        "margin": 2328.18,
    },
]


# ============================================================
# ZONE HELPERS
# ============================================================

def normalize_zone_name(zone):

    if not zone:
        return None

    zone = str(zone).strip()

    if zone in ZONES:
        return zone

    lowered = zone.lower()

    for alias, real_zone in ZONE_ALIASES.items():

        if alias in lowered:
            return real_zone

    return zone


def display_zone(zone):

    if not zone:
        return "Unknown"

    zone = str(zone)

    if "Nadaprabhu" in zone:
        return "Majestic"

    if zone == "Mahatma Gandhi Road":
        return "MG Road"

    if zone == "Krishnarajapura":
        return "KR Puram"

    return zone


def zones_in_message(text):

    found = []

    lowered = text.lower()

    # Longest aliases first
    aliases = sorted(
        ZONE_ALIASES.items(),
        key=lambda x: len(x[0]),
        reverse=True
    )

    for alias, zone in aliases:

        if alias in lowered:

            if zone not in found:
                found.append(zone)

    return found


# ============================================================
# RISK CALCULATION
# ============================================================

def calculate_risk(
    battery,
    health,
    trips,
    age
):

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

    # Usage
    if trips > 12:
        risk += 0.15

    elif trips > 10:
        risk += 0.08

    # Age
    if age > 24:
        risk += 0.15

    elif age > 18:
        risk += 0.08

    return min(
        0.95,
        risk
    )


# ============================================================
# GET FLEET DATAFRAME
# ============================================================

def get_fleet_dataframe():

    if tools is None:
        raise RuntimeError(
            "Fleet tools unavailable"
        )

    fleet_df = getattr(
        tools,
        "fleet_df",
        None
    )

    if fleet_df is None:
        raise RuntimeError(
            "Fleet dataframe unavailable"
        )

    return fleet_df


# ============================================================
# BUILD ENRICHED FLEET
# ============================================================

def get_enriched_fleet():

    fleet_df = get_fleet_dataframe()

    rows = []

    for _, row in fleet_df.iterrows():

        battery = float(
            row.get(
                "battery",
                0
            )
        )

        health = float(
            row.get(
                "health_score",
                100
            )
        )

        trips = int(
            row.get(
                "trips_today",
                0
            )
        )

        age = int(
            row.get(
                "age_months",
                0
            )
        )

        risk = calculate_risk(
            battery,
            health,
            trips,
            age
        )

        rows.append({

            "scooter_id":
                str(
                    row.get(
                        "scooter_id",
                        ""
                    )
                ),

            "zone":
                str(
                    row.get(
                        "zone",
                        ""
                    )
                ),

            "battery":
                battery,

            "health_score":
                health,

            "trips_today":
                trips,

            "age_months":
                age,

            "risk":
                risk,
        })

    return rows


# ============================================================
# RISK REGISTER
# ============================================================

def get_risk_rows():

    fleet = get_enriched_fleet()

    rows = [

        row
        for row in fleet
        if row["risk"] >= 0.50
    ]

    rows.sort(
        key=lambda x: x["risk"],
        reverse=True
    )

    return rows


# ============================================================
# CHARGING QUEUE
# ============================================================

def get_charging_rows():

    fleet = get_enriched_fleet()

    rows = []

    for row in fleet:

        battery = row["battery"]

        if battery <= 40:

            priority = (
                "Critical"
                if battery <= 25
                else "High"
            )

            rows.append({

                "scooter_id":
                    row["scooter_id"],

                "zone":
                    row["zone"],

                "battery":
                    battery,

                "priority":
                    priority,
            })

    rows.sort(
        key=lambda x:
            x["battery"]
    )

    return rows


# ============================================================
# MAINTENANCE QUEUE
# ============================================================

def get_maintenance_rows():

    fleet = get_enriched_fleet()

    rows = []

    for row in fleet:

        health = row["health_score"]

        age = row["age_months"]

        risk = row["risk"]

        if (
            health < 80
            or age > 18
            or risk >= 0.50
        ):

            priority = (
                "Critical"
                if risk >= 0.80
                else "High"
            )

            rows.append({

                "scooter_id":
                    row["scooter_id"],

                "zone":
                    row["zone"],

                "health_score":
                    health,

                "age_months":
                    age,

                "risk":
                    risk,

                "priority":
                    priority,
            })

    rows.sort(
        key=lambda x:
            x["risk"],
        reverse=True
    )

    return rows


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "name": "FleetMind",
        "status": "online",
        "version": "1.0.0"
    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/api/health")
def health():

    return {

        "status":
            "ok",

        "agent_available":
            ask_fleetmind is not None,

        "fleet_tools_available":
            tools is not None,

        "default_hour":
            DEFAULT_HOUR,
    }


# ============================================================
# FLEET
# ============================================================

@app.get("/api/fleet")
def fleet():

    try:

        result = tools.get_fleet_status()

        return clean_data({

            "status":
                "ok",

            "data":
                result,

        })

    except Exception as e:

        print(
            "[FleetMind] Fleet error:",
            repr(e)
        )

        return clean_data({

            "status":
                "error",

            "data":
                {},

            "error":
                str(e),

        })


# ============================================================
# ANALYTICS
# ============================================================

@app.get("/api/analytics")
def analytics():

    print()
    print(
        "=" * 60
    )

    print(
        "FLEETMIND ANALYTICS REQUEST"
    )

    print(
        "=" * 60
    )

    try:

        fleet_status = (
            tools.get_fleet_status()
        )

        # ----------------------------------------------------
        # ZONE DEMAND
        # ----------------------------------------------------

        zone_demand = []

        for zone in ZONES:

            try:

                value = float(
                    tools.predict_demand(
                        zone,
                        hour=DEFAULT_HOUR
                    )
                )

            except Exception:

                value = 0

            zone_demand.append({

                "name":
                    zone,

                "display_name":
                    display_zone(zone),

                "value":
                    value,

            })


        # ----------------------------------------------------
        # ENRICHED FLEET
        # ----------------------------------------------------

        enriched = get_enriched_fleet()


        # ----------------------------------------------------
        # BATTERY DISTRIBUTION
        # ----------------------------------------------------

        battery_distribution = {

            "0-30":
                0,

            "31-60":
                0,

            "61-80":
                0,

            "81-100":
                0,
        }


        for row in enriched:

            battery = row["battery"]

            if battery <= 30:

                battery_distribution[
                    "0-30"
                ] += 1

            elif battery <= 60:

                battery_distribution[
                    "31-60"
                ] += 1

            elif battery <= 80:

                battery_distribution[
                    "61-80"
                ] += 1

            else:

                battery_distribution[
                    "81-100"
                ] += 1


        # ----------------------------------------------------
        # RISK DISTRIBUTION
        # ----------------------------------------------------

        risk_distribution = {

            "critical":
                0,

            "elevated":
                0,

            "normal":
                0,
        }


        for row in enriched:

            risk = row["risk"]

            if risk >= 0.80:

                risk_distribution[
                    "critical"
                ] += 1

            elif risk >= 0.50:

                risk_distribution[
                    "elevated"
                ] += 1

            else:

                risk_distribution[
                    "normal"
                ] += 1


        # ----------------------------------------------------
        # ZONE DISTRIBUTION
        # ----------------------------------------------------

        zone_distribution = {}

        for row in enriched:

            zone = row["zone"]

            zone_distribution[
                display_zone(zone)
            ] = (
                zone_distribution.get(
                    display_zone(zone),
                    0
                ) + 1
            )


        # ----------------------------------------------------
        # OPTIMAL DEPLOYMENT
        # ----------------------------------------------------

        optimal = max(
            COUNTERFACTUAL,
            key=lambda x:
                x["margin"]
        )

        baseline = COUNTERFACTUAL[0]

        # ----------------------------------------------------
        # RESPONSE
        # ----------------------------------------------------

        result = {

            "status":
                "ok",

            "data": {

                "fleet":
                    fleet_status,

                "zone_demand":
                    zone_demand,

                "battery_distribution":
                    battery_distribution,

                "risk_distribution":
                    risk_distribution,

                "zone_distribution":
                    zone_distribution,

                "counterfactual":
                    COUNTERFACTUAL,

                "recommendation": {

                    "scooters_to_move":
                        optimal["scooters"],

                    "target_zone":
                        "Nadaprabhu Kempegowda Station, Majestic",

                    "expected_trips":
                        optimal["trips"],

                    "revenue":
                        optimal["revenue"],

                    "total_cost":
                        optimal["cost"],

                    "contribution_margin":
                        optimal["margin"],

                    "baseline_margin":
                        baseline["margin"],

                    "margin_improvement":
                        (
                            optimal["margin"]
                            -
                            baseline["margin"]
                        ),
                },

            },

        }

        print(
            "[FleetMind] Analytics generated successfully."
        )

        return clean_data(result)

    except Exception as e:

        print(
            "[FleetMind] Analytics error:",
            repr(e)
        )

        return clean_data({

            "status":
                "error",

            "data":
                {},

            "error":
                str(e),

        })


# ============================================================
# OPERATIONS
# ============================================================

@app.get("/api/operations")
def operations():

    try:

        return clean_data({

            "status":
                "ok",

            "data": {

                "charging":
                    get_charging_rows(),

                "maintenance":
                    get_maintenance_rows(),

                "risk":
                    get_risk_rows(),

                "recommendation": {

                    "scooters":
                        6,

                    "target":
                        "Majestic",

                    "action":
                        "Move healthy scooters",

                },

            },

        })

    except Exception as e:

        return clean_data({

            "status":
                "error",

            "data":
                {},

            "error":
                str(e),

        })


# ============================================================
# CHARGING
# ============================================================

@app.get("/api/charging")
def charging():

    try:

        rows = get_charging_rows()

        return clean_data({

            "status":
                "ok",

            "data":
                rows,

        })

    except Exception as e:

        return clean_data({

            "status":
                "error",

            "data":
                [],

            "error":
                str(e),

        })


# ============================================================
# MAINTENANCE
# ============================================================

@app.get("/api/maintenance")
def maintenance():

    try:

        rows = get_maintenance_rows()

        return clean_data({

            "status":
                "ok",

            "data":
                rows,

        })

    except Exception as e:

        return clean_data({

            "status":
                "error",

            "data":
                [],

            "error":
                str(e),

        })


# ============================================================
# ZONE COMPARISON API
# ============================================================

@app.get("/api/zones/compare")
def zone_compare():

    try:

        results = []

        for zone in ZONES:

            demand = float(
                tools.predict_demand(
                    zone,
                    hour=DEFAULT_HOUR
                )
            )

            fleet_count = 0

            fleet_df = (
                getattr(
                    tools,
                    "fleet_df",
                    None
                )
            )

            if fleet_df is not None:

                fleet_count = int(
                    (
                        fleet_df["zone"]
                        == zone
                    ).sum()
                )

            results.append({

                "zone":
                    zone,

                "display_zone":
                    display_zone(zone),

                "predicted_demand":
                    demand,

                "scooters":
                    fleet_count,

            })

        results.sort(
            key=lambda x:
                x["predicted_demand"],
            reverse=True
        )

        return clean_data({

            "status":
                "ok",

            "data":
                results,

        })

    except Exception as e:

        return clean_data({

            "status":
                "error",

            "data":
                [],

            "error":
                str(e),

        })


# ============================================================
# ASK — MAIN FLEETMIND ROUTER
# ============================================================

@app.post("/api/ask")
def ask(request: AskRequest):

    message = request.message.strip()

    print()
    print(
        "=" * 70
    )

    print(
        "FLEETMIND API REQUEST"
    )

    print(
        "=" * 70
    )

    print(
        "User:",
        message
    )


    # ========================================================
    # EMPTY INPUT
    # ========================================================

    if not message:

        return {

            "answer":
                "Please enter a fleet question.",

            "type":
                "error",

            "data":
                None,

        }


    text = message.lower()


    # ========================================================
    # RISK / FAILURE
    # ========================================================

    risk_words = [

        "risk",
        "risky",
        "fail",
        "failure",
        "unsafe",
        "danger",
        "dangerous",
        "likely to fail",
        "most likely to fail",
        "highest risk",
        "risky scooter",
        "risk scooter",

    ]


    if any(
        word in text
        for word in risk_words
    ):

        try:

            rows = get_risk_rows()

            if rows:

                highest = rows[0]

                answer = (

                    f"FleetMind identified "
                    f"{len(rows)} scooters requiring "
                    f"risk attention. "
                    f"{highest['scooter_id']} has the highest "
                    f"current risk at "
                    f"{highest['risk'] * 100:.0f}% and should "
                    f"be prioritized for inspection or "
                    f"removed from active deployment."

                )

            else:

                answer = (
                    "No scooters currently exceed "
                    "FleetMind's high-risk threshold."
                )


            result = {

                "answer":
                    answer,

                "type":
                    "risk_analysis",

                "data":
                    rows,

            }


            print(
                "[FleetMind] Risk analysis returned."
            )

            return clean_data(result)

        except Exception as e:

            print(
                "[FleetMind] Risk error:",
                repr(e)
            )


    # ========================================================
    # CHARGING
    # ========================================================

    charging_words = [

        "charge",
        "charging",
        "recharge",
        "low battery",
        "low batteries",
        "battery low",

    ]


    if any(
        word in text
        for word in charging_words
    ):

        try:

            rows = get_charging_rows()

            result = {

                "answer":
                    (
                        f"FleetMind identified "
                        f"{len(rows)} scooters for charging "
                        f"priority. Vehicles with the lowest "
                        f"battery should be handled first."
                    ),

                "type":
                    "charging_recommendation",

                "data":
                    rows,

            }

            return clean_data(result)

        except Exception as e:

            print(
                "[FleetMind] Charging error:",
                repr(e)
            )


    # ========================================================
    # MAINTENANCE
    # ========================================================

    maintenance_words = [

        "maintenance",
        "maintain",
        "service",
        "servicing",
        "inspection",
        "inspect",
        "repair",
        "vehicle health",
        "health of scooters",

    ]


    if any(
        word in text
        for word in maintenance_words
    ):

        try:

            rows = get_maintenance_rows()

            result = {

                "answer":
                    (
                        f"FleetMind identified "
                        f"{len(rows)} scooters requiring "
                        f"maintenance attention. Priority "
                        f"is based on vehicle risk, health "
                        f"and age."
                    ),

                "type":
                    "maintenance_recommendation",

                "data":
                    rows,

            }

            return clean_data(result)

        except Exception as e:

            print(
                "[FleetMind] Maintenance error:",
                repr(e)
            )


    # ========================================================
    # MOVE / DEPLOY / FINANCIAL
    # ========================================================

    move_match = re.search(
        r"(?:move|deploy|relocate)\s+(\d+)",
        text
    )


    scooter_number_match = re.search(
        r"(\d+)\s+scooters?",
        text
    )


    financial_words = [

        "financial",
        "profit",
        "profitable",
        "margin",
        "revenue",
        "cost",
        "economics",
        "economically",

    ]


    if (
        move_match
        or (
            scooter_number_match
            and (
                "what happens" in text
                or "what if" in text
            )
        )
        or any(
            word in text
            for word in financial_words
        )
    ):

        requested = None


        if move_match:

            requested = int(
                move_match.group(1)
            )


        elif scooter_number_match:

            requested = int(
                scooter_number_match.group(1)
            )


        # ----------------------------------------------------
        # SPECIFIC NUMBER
        # ----------------------------------------------------

        if requested is not None:

            requested = max(
                0,
                min(
                    10,
                    requested
                )
            )

            scenario = next(
                (
                    item
                    for item in COUNTERFACTUAL
                    if item["scooters"]
                    == requested
                ),
                None
            )


            if scenario:

                baseline = COUNTERFACTUAL[0]

                improvement = (
                    scenario["margin"]
                    -
                    baseline["margin"]
                )


                return clean_data({

                    "answer":
                        (
                            f"Moving {requested} scooters "
                            f"would generate approximately "
                            f"{scenario['trips']:.2f} expected "
                            f"trips and a contribution margin "
                            f"of ₹{scenario['margin']:,.0f}. "
                            f"That is ₹{improvement:,.0f} above "
                            f"the do-nothing baseline."
                        ),

                    "type":
                        "financial_simulation",

                    "data":
                        scenario,

                    "comparison":
                        COUNTERFACTUAL,

                })


        # ----------------------------------------------------
        # OPTIMAL
        # ----------------------------------------------------

        optimal = max(
            COUNTERFACTUAL,
            key=lambda x:
                x["margin"]
        )


        return clean_data({

            "answer":
                (
                    f"FleetMind's financial optimizer "
                    f"selects {optimal['scooters']} scooters "
                    f"as the optimal deployment level, "
                    f"producing approximately "
                    f"₹{optimal['margin']:,.0f} contribution "
                    f"margin."
                ),

            "type":
                "financial_optimization",

            "data":
                optimal,

            "comparison":
                COUNTERFACTUAL,

        })


    # ========================================================
    # HIGHEST DEMAND
    # ========================================================

    if (

        "highest demand" in text
        or "most demand" in text
        or "demand highest" in text
        or "where is demand" in text
        or "best demand" in text
        or "highest-demand" in text

    ):

        try:

            results = []

            for zone in ZONES:

                value = float(
                    tools.predict_demand(
                        zone,
                        hour=DEFAULT_HOUR
                    )
                )

                results.append({

                    "zone":
                        zone,

                    "display_zone":
                        display_zone(zone),

                    "predicted_demand":
                        value,

                })


            results.sort(
                key=lambda x:
                    x["predicted_demand"],
                reverse=True
            )


            highest = results[0]


            return clean_data({

                "answer":
                    (
                        f"{highest['display_zone']} currently "
                        f"has the highest predicted demand at "
                        f"approximately "
                        f"{highest['predicted_demand']:,.0f} "
                        f"for the {DEFAULT_HOUR}:00 forecast."
                    ),

                "type":
                    "demand_comparison",

                "zone":
                    highest["zone"],

                "hour":
                    DEFAULT_HOUR,

                "data":
                    results,

            })

        except Exception as e:

            print(
                "[FleetMind] Highest demand error:",
                repr(e)
            )


    # ========================================================
    # ZONE COMPARISON
    # ========================================================

    if (

        "compare" in text
        or "comparison" in text
        or "versus" in text
        or " vs " in text
        or "difference between" in text

    ):

        try:

            requested_zones = zones_in_message(text)


            if len(requested_zones) < 2:

                requested_zones = ZONES[:2]


            requested_zones = requested_zones[:2]


            results = []


            for zone in requested_zones:

                demand = float(
                    tools.predict_demand(
                        zone,
                        hour=DEFAULT_HOUR
                    )
                )


                fleet_count = 0

                fleet_df = getattr(
                        tools,
                        "fleet_df",
                        None
                    )


                if fleet_df is not None:

                    fleet_count = int(
                        (
                            fleet_df["zone"]
                            == zone
                        ).sum()
                    )


                results.append({

                    "zone":
                        zone,

                    "display_zone":
                        display_zone(zone),

                    "predicted_demand":
                        demand,

                    "scooters":
                        fleet_count,

                })


            results.sort(
                key=lambda x:
                    x["predicted_demand"],
                reverse=True
            )


            first = results[0]

            second = results[1]


            difference = (
                first["predicted_demand"]
                -
                second["predicted_demand"]
            )


            return clean_data({

                "answer":
                    (
                        f"{first['display_zone']} has higher "
                        f"predicted demand than "
                        f"{second['display_zone']} by "
                        f"approximately "
                        f"{difference:,.0f} demand units "
                        f"for the {DEFAULT_HOUR}:00 forecast."
                    ),

                "type":
                    "zone_comparison",

                "hour":
                    DEFAULT_HOUR,

                "data":
                    results,

            })

        except Exception as e:

            print(
                "[FleetMind] Zone comparison error:",
                repr(e)
            )


    # ========================================================
    # SPECIFIC DEMAND
    # ========================================================

    if "demand" in text:

        try:

            requested_zones = zones_in_message(text)


            zone = (

                requested_zones[0]

                if requested_zones

                else ZONES[0]

            )


            demand = tools.predict_demand(
                zone,
                hour=DEFAULT_HOUR
            )


            return clean_data({

                "answer":
                    "Here is the verified demand forecast.",

                "type":
                    "demand_forecast",

                "zone":
                    zone,

                "hour":
                    DEFAULT_HOUR,

                "data":
                    float(demand),

            })

        except Exception as e:

            print(
                "[FleetMind] Demand error:",
                repr(e)
            )


    # ========================================================
    # RECOMMENDATION
    # ========================================================

    recommendation_words = [

        "what should i do",
        "what should we do",
        "what do i do",
        "recommend",
        "recommendation",
        "best action",
        "how should i deploy",
        "how should i manage",
        "what action",
        "what is the best move",
        "what should happen",

    ]


    if any(
        phrase in text
        for phrase in recommendation_words
    ):

        optimal = max(
            COUNTERFACTUAL,
            key=lambda x:
                x["margin"]
        )


        return clean_data({

            "answer":
                (
                    "FleetMind recommends moving "
                    f"{optimal['scooters']} healthy scooters "
                    "toward Majestic during the forecast "
                    "window. Low-battery and high-risk "
                    "vehicles should remain out of the "
                    "relocation pool."
                ),

            "type":
                "recommendation",

            "data": {

                "action":
                    "Move healthy scooters",

                "scooters":
                    optimal["scooters"],

                "target_zone":
                    "Majestic",

                "expected_trips":
                    optimal["trips"],

                "contribution_margin":
                    optimal["margin"],

                "baseline_margin":
                    COUNTERFACTUAL[0]["margin"],

            },

        })


    # ========================================================
    # FLEET STATUS
    # ========================================================

    if (

        "fleet" in text
        or "status" in text
        or "how many scooters" in text
        or "current fleet" in text
        or "fleet size" in text
        or "how is the fleet" in text

    ):

        try:

            result = tools.get_fleet_status()


            return clean_data({

                "answer":
                    "Here is the current FleetMind fleet status.",

                "type":
                    "fleet_status",

                "data":
                    result,

            })

        except Exception as e:

            print(
                "[FleetMind] Fleet status error:",
                repr(e)
            )


    # ========================================================
    # GENERAL AGENT
    # ========================================================

    if ask_fleetmind is not None:

        try:

            result = ask_fleetmind(message)


            result = clean_data(result)


            print(
                "[FleetMind] LLM agent response:"
            )

            print(result)


            return result

        except Exception as e:

            print(
                "[FleetMind] Agent execution failed:",
                repr(e)
            )


    # ========================================================
    # FINAL FALLBACK
    # ========================================================

    return {

        "answer":
            (
                "FleetMind can analyze fleet demand, "
                "vehicle risk, battery state, maintenance, "
                "charging and financial deployment."
            ),

        "type":
            "general",

        "data":
            None,

    }


# ============================================================
# STARTUP
# ============================================================

@app.on_event("startup")
def startup():

    print()
    print(
        "=" * 70
    )

    print(
        "FLEETMIND API ONLINE"
    )

    print(
        "=" * 70
    )

    print(
        "Agent:",
        "AVAILABLE"
        if ask_fleetmind
        else "FALLBACK MODE"
    )

    print(
        "Fleet tools:",
        "AVAILABLE"
        if tools
        else "ERROR"
    )

    print(
        "Default hour:",
        DEFAULT_HOUR
    )

    print(
        "Fleet size:",
        25
    )

    print(
        "=" * 70
    )

    print()


# ============================================================
# DIRECT RUN
# ============================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "api.server:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )
