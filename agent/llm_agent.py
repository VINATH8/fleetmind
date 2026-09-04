# import json
# import re
# from openai import OpenAI

# from agent import tools


# # =========================================================
# # CONFIG
# # =========================================================

# MODEL = "llama3.2"

# client = OpenAI(
#     base_url="http://localhost:11434/v1",
#     api_key="ollama",
# )


# # =========================================================
# # ZONES
# # =========================================================

# ZONES = {
#     "majestic": "Nadaprabhu Kempegowda Station, Majestic",
#     "kempegowda": "Nadaprabhu Kempegowda Station, Majestic",
#     "nadaprabhu": "Nadaprabhu Kempegowda Station, Majestic",

#     "benniganahalli": "Benniganahalli",

#     "indiranagar": "Indiranagar",

#     "mg road": "Mahatma Gandhi Road",
#     "mgroad": "Mahatma Gandhi Road",
#     "mahatma gandhi road": "Mahatma Gandhi Road",

#     "kr puram": "Krishnarajapura",
#     "krishnarajapura": "Krishnarajapura",
# }


# # =========================================================
# # HELPERS
# # =========================================================

# def normalize_zone(text):
#     if not text:
#         return None

#     text = str(text).lower().strip()

#     for alias, zone in ZONES.items():
#         if alias in text:
#             return zone

#     return None


# def extract_zone(message):
#     return normalize_zone(message)


# def extract_hour(message):
#     text = message.lower()

#     # Explicit 24-hour time
#     match = re.search(
#         r"\b([01]?\d|2[0-3])(?::[0-5]\d)?\s*(?:hrs?|hours?)?\b",
#         text
#     )

#     if match:
#         hour = int(match.group(1))

#         # Don't interpret scooter counts as hours
#         if 0 <= hour <= 23:
#             return hour

#     if "morning" in text:
#         return 9

#     if "afternoon" in text:
#         return 14

#     if "evening" in text:
#         return 18

#     if "night" in text:
#         return 21

#     return None


# def extract_scooter_count(message):
#     patterns = [
#         r"move\s+(\d+)",
#         r"(\d+)\s+scooters?",
#         r"deploy\s+(\d+)",
#         r"send\s+(\d+)",
#     ]

#     for pattern in patterns:
#         match = re.search(pattern, message.lower())

#         if match:
#             return int(match.group(1))

#     return None


# # =========================================================
# # OLLAMA INTENT ROUTER
# # =========================================================

# def understand_request(user_message):

#     prompt = f"""
# You are the intent router for FleetMind, an EV fleet operations agent.

# Classify the user request into ONE of these:

# fleet_decision
# fleet_status
# risk_analysis
# demand_forecast
# counterfactual
# charge_recommendation
# zone_comparison
# explanation
# general

# Return ONLY JSON.

# JSON format:

# {{
#   "request_type": "...",
#   "target_zone": null,
#   "hour": null,
#   "scooter_count": null
# }}

# Rules:

# - fleet_decision = asking what FleetMind should do
# - fleet_status = asking about fleet health/status
# - risk_analysis = asking which scooters are risky
# - demand_forecast = asking about predicted demand
# - counterfactual = asking "what if I move X scooters"
# - charge_recommendation = asking which scooters need charging
# - zone_comparison = asking which zone is best/profitable
# - explanation = asking why FleetMind made a decision
# - general = unrelated/general question

# User:
# {user_message}
# """

#     try:
#         response = client.chat.completions.create(
#             model=MODEL,
#             messages=[
#                 {
#                     "role": "system",
#                     "content": "Return ONLY valid JSON."
#                 },
#                 {
#                     "role": "user",
#                     "content": prompt
#                 }
#             ],
#             temperature=0,
#             max_tokens=200,
#         )

#         content = response.choices[0].message.content.strip()

#         content = content.replace("```json", "")
#         content = content.replace("```", "")
#         content = content.strip()

#         result = json.loads(content)

#     except Exception:
#         # Deterministic fallback
#         text = user_message.lower()

#         if any(word in text for word in [
#             "risk",
#             "risky",
#             "danger",
#             "health"
#         ]):
#             request_type = "risk_analysis"

#         elif any(word in text for word in [
#             "demand",
#             "forecast",
#             "predict"
#         ]):
#             request_type = "demand_forecast"

#         elif any(word in text for word in [
#             "charge",
#             "charging",
#             "battery"
#         ]):
#             request_type = "charge_recommendation"

#         elif any(word in text for word in [
#             "what if",
#             "scenario"
#         ]):
#             request_type = "counterfactual"

#         elif any(word in text for word in [
#             "why",
#             "explain"
#         ]):
#             request_type = "explanation"

#         elif any(word in text for word in [
#             "status",
#             "fleet",
#             "how is"
#         ]):
#             request_type = "fleet_status"

#         elif any(word in text for word in [
#             "which zone",
#             "best zone",
#             "most money",
#             "profitable"
#         ]):
#             request_type = "zone_comparison"

#         else:
#             request_type = "fleet_decision"

#         result = {
#             "request_type": request_type,
#             "target_zone": None,
#             "hour": None,
#             "scooter_count": None,
#         }

#     # Normalize extracted values
#     zone = normalize_zone(
#         result.get("target_zone")
#     )

#     if zone is None:
#         zone = extract_zone(user_message)

#     hour = result.get("hour")

#     if hour is None:
#         hour = extract_hour(user_message)

#     try:
#         if hour is not None:
#             hour = int(hour)
#             if hour < 0 or hour > 23:
#                 hour = None
#     except Exception:
#         hour = None

#     scooter_count = result.get("scooter_count")

#     if scooter_count is None:
#         scooter_count = extract_scooter_count(
#             user_message
#         )

#     try:
#         if scooter_count is not None:
#             scooter_count = int(scooter_count)
#     except Exception:
#         scooter_count = None

#     return {
#         "request_type": result.get(
#             "request_type",
#             "general"
#         ),
#         "target_zone": zone,
#         "hour": hour,
#         "scooter_count": scooter_count,
#     }


# # =========================================================
# # CORE FLEET WORKFLOW
# # =========================================================

# def run_fleet_workflow(target_zone=None, hour=None):

#     if target_zone is None:
#         target_zone = (
#             "Nadaprabhu Kempegowda Station, Majestic"
#         )

#     # -----------------------------------------------------
#     # Get verified fleet information
#     # -----------------------------------------------------

#     fleet = tools.get_fleet_status()

#     risks = tools.get_high_risk_scooters()

#     demand = tools.predict_demand(
#         target_zone,
#         hour=hour
#     )

#     candidates = tools.get_relocation_candidates(
#         target_zone
#     )

#     # -----------------------------------------------------
#     # IMPORTANT:
#     #
#     # We intentionally DO NOT call generate_decision()
#     # directly here because your existing working
#     # fleetmind_agent already contains the correct
#     # optimizer integration.
#     #
#     # Instead, import its decision function dynamically
#     # and inspect the available interface.
#     # -----------------------------------------------------

#     from agent import fleetmind_agent

#     decision = None

#     # Try the existing agent's workflow function first.
#     possible_functions = [
#         "run_agent",
#         "run_fleetmind",
#         "run_workflow",
#         "analyze_fleet",
#     ]

#     for function_name in possible_functions:

#         function = getattr(
#             fleetmind_agent,
#             function_name,
#             None
#         )

#         if callable(function):

#             try:

#                 result = function(
#                     target_zone,
#                     hour
#                 )

#                 if isinstance(result, dict):

#                     decision = (
#                         result.get("decision")
#                         or result.get("recommendation")
#                         or result
#                     )

#                     break

#             except TypeError:
#                 try:

#                     result = function(
#                         target_zone
#                     )

#                     if isinstance(result, dict):

#                         decision = (
#                             result.get("decision")
#                             or result.get("recommendation")
#                             or result
#                         )

#                         break

#                 except Exception:
#                     pass

#             except Exception:
#                 pass

#     # -----------------------------------------------------
#     # Fallback: import optimizer and inspect signature
#     # -----------------------------------------------------

#     if decision is None:

#         try:

#             import inspect
#             from optimizer import decision_engine

#             generate_decision = getattr(
#                 decision_engine,
#                 "generate_decision"
#             )

#             signature = inspect.signature(
#                 generate_decision
#             )

#             params = list(
#                 signature.parameters.keys()
#             )

#             kwargs = {}

#             available = {
#                 "target_zone": target_zone,
#                 "zone": target_zone,
#                 "hour": hour,
#                 "demand": demand,
#                 "candidates": candidates,
#                 "fleet": fleet,
#                 "fleet_status": fleet,
#                 "risks": risks,
#                 "risk_analysis": risks,
#             }

#             for param in params:

#                 if param in available:
#                     kwargs[param] = available[param]

#             decision = generate_decision(
#                 **kwargs
#             )

#         except Exception as e:

#             decision = {
#                 "error": str(e),
#                 "target_zone": target_zone,
#                 "candidates": candidates,
#             }

#     return {
#         "target_zone": target_zone,
#         "hour": hour,
#         "fleet": fleet,
#         "risk_analysis": risks,
#         "demand": demand,
#         "candidates": candidates,
#         "decision": decision,
#     }


# # =========================================================
# # FLEET STATUS
# # =========================================================

# def fleet_status():

#     return {
#         "type": "fleet_status",
#         "data": tools.get_fleet_status(),
#     }


# # =========================================================
# # RISK ANALYSIS
# # =========================================================

# def risk_analysis():

#     return {
#         "type": "risk_analysis",
#         "data": tools.get_high_risk_scooters(),
#     }


# # =========================================================
# # DEMAND FORECAST
# # =========================================================

# def demand_forecast(zone=None, hour=None):

#     if zone is None:
#         zone = (
#             "Nadaprabhu Kempegowda Station, Majestic"
#         )

#     return {
#         "type": "demand_forecast",
#         "zone": zone,
#         "hour": hour,
#         "data": tools.predict_demand(
#             zone,
#             hour=hour
#         ),
#     }


# # =========================================================
# # CHARGING
# # =========================================================

# def charge_recommendation():

#     fleet_df = tools.fleet_df.copy()

#     urgent = fleet_df[
#         fleet_df["battery"] < 30
#     ]

#     soon = fleet_df[
#         (fleet_df["battery"] >= 30)
#         &
#         (fleet_df["battery"] < 50)
#     ]

#     return {
#         "type": "charge_recommendation",
#         "urgent": urgent.to_dict(
#             orient="records"
#         ),
#         "charge_soon": soon.to_dict(
#             orient="records"
#         ),
#     }


# # =========================================================
# # COUNTERFACTUAL
# # =========================================================

# def counterfactual(
#     zone=None,
#     hour=None,
#     scooter_count=None
# ):

#     workflow = run_fleet_workflow(
#         zone,
#         hour
#     )

#     decision = workflow.get(
#         "decision",
#         {}
#     )

#     if not isinstance(decision, dict):
#         decision = {}

#     scenarios = (
#         decision.get("scenarios")
#         or decision.get("counterfactual")
#         or []
#     )

#     if hasattr(scenarios, "to_dict"):
#         scenarios = scenarios.to_dict(
#             orient="records"
#         )

#     selected = None

#     if scooter_count is not None:

#         for scenario in scenarios:

#             count = scenario.get(
#                 "scooters_moved",
#                 scenario.get(
#                     "scootersMoved",
#                     scenario.get("scooters")
#                 )
#             )

#             try:

#                 if int(count) == int(
#                     scooter_count
#                 ):
#                     selected = scenario
#                     break

#             except Exception:
#                 continue

#     return {
#         "type": "counterfactual",
#         "workflow": workflow,
#         "scenarios": scenarios,
#         "selected_scenario": selected,
#         "requested_count": scooter_count,
#     }


# # =========================================================
# # LLM EXPLANATION
# # =========================================================

# def generate_explanation(
#     user_message,
#     workflow
# ):

#     decision = workflow.get(
#         "decision",
#         {}
#     )

#     verified = {
#         "target_zone": workflow.get(
#             "target_zone"
#         ),
#         "hour": workflow.get(
#             "hour"
#         ),
#         "fleet": workflow.get(
#             "fleet"
#         ),
#         "demand": workflow.get(
#             "demand"
#         ),
#         "decision": decision,
#     }

#     prompt = f"""
# You are FleetMind, an autonomous EV fleet operations agent.

# Answer the operator's question using ONLY the verified data.

# Do not invent numbers.

# Do not claim scooters were physically moved.

# Use "recommendation", "recommended", or "plan".

# Explain the business reasoning clearly.

# If the decision contains financial values, use those exact values.

# Operator question:
# {user_message}

# Verified FleetMind data:
# {json.dumps(verified, default=str)}

# Give a concise operational answer.

# Prefer this structure:

# Recommendation
# Financial impact
# Why
# """

#     try:

#         response = client.chat.completions.create(
#             model=MODEL,
#             messages=[
#                 {
#                     "role": "system",
#                     "content": (
#                         "You are FleetMind. "
#                         "Never invent financial numbers."
#                     ),
#                 },
#                 {
#                     "role": "user",
#                     "content": prompt,
#                 },
#             ],
#             temperature=0.2,
#             max_tokens=450,
#         )

#         return response.choices[0].message.content.strip()

#     except Exception:

#         return (
#             "FleetMind generated the following "
#             "verified recommendation:\n\n"
#             + str(decision)
#         )


# # =========================================================
# # ZONE COMPARISON
# # =========================================================

# def zone_comparison(hour=None):

#     zones = [
#         "Indiranagar",
#         "Benniganahalli",
#         "Krishnarajapura",
#         "Mahatma Gandhi Road",
#         "Nadaprabhu Kempegowda Station, Majestic",
#     ]

#     results = []

#     for zone in zones:

#         try:

#             workflow = run_fleet_workflow(
#                 zone,
#                 hour
#             )

#             decision = workflow.get(
#                 "decision",
#                 {}
#             )

#             if not isinstance(decision, dict):
#                 decision = {}

#             margin = (
#                 decision.get(
#                     "contribution_margin"
#                 )
#                 or decision.get(
#                     "contribution"
#                 )
#                 or decision.get(
#                     "profit"
#                 )
#                 or 0
#             )

#             results.append({
#                 "zone": zone,
#                 "contribution_margin": margin,
#                 "decision": decision,
#             })

#         except Exception as e:

#             results.append({
#                 "zone": zone,
#                 "contribution_margin": 0,
#                 "error": str(e),
#             })

#     results.sort(
#         key=lambda x: float(
#             x.get(
#                 "contribution_margin",
#                 0
#             ) or 0
#         ),
#         reverse=True
#     )

#     return {
#         "type": "zone_comparison",
#         "zones": results,
#     }


# # =========================================================
# # GENERAL QUESTION
# # =========================================================

# def general_question(message):

#     try:

#         response = client.chat.completions.create(
#             model=MODEL,
#             messages=[
#                 {
#                     "role": "system",
#                     "content": """
# You are FleetMind, an EV fleet operations assistant.

# You help fleet operators with:
# - demand
# - scooters
# - batteries
# - vehicle health
# - risk
# - relocation
# - deployment
# - utilization
# - contribution margin

# Be concise.

# If the user asks for numerical fleet analysis,
# do not invent numbers.
# """,
#                 },
#                 {
#                     "role": "user",
#                     "content": message,
#                 },
#             ],
#             temperature=0.3,
#             max_tokens=300,
#         )

#         return response.choices[0].message.content.strip()

#     except Exception as e:

#         return (
#             "I couldn't process that request: "
#             + str(e)
#         )


# # =========================================================
# # MAIN FLEETMIND AGENT
# # =========================================================

# def ask_fleetmind(
#     user_message,
#     verbose=True
# ):

#     intent = understand_request(
#         user_message
#     )

#     request_type = intent.get(
#         "request_type",
#         "general"
#     )

#     zone = intent.get(
#         "target_zone"
#     )

#     hour = intent.get(
#         "hour"
#     )

#     scooter_count = intent.get(
#         "scooter_count"
#     )

#     # -----------------------------------------------------
#     # DECISION / EXPLANATION
#     # -----------------------------------------------------

#     if request_type in [
#         "fleet_decision",
#         "explanation",
#     ]:

#         workflow = run_fleet_workflow(
#             zone,
#             hour
#         )

#         answer = generate_explanation(
#             user_message,
#             workflow
#         )

#         return {
#             "answer": answer,
#             "intent": request_type,
#             "workflow": workflow,
#         }

#     # -----------------------------------------------------
#     # STATUS
#     # -----------------------------------------------------

#     if request_type == "fleet_status":

#         result = fleet_status()

#         return {
#             "answer": (
#                 "Here is the current FleetMind "
#                 "fleet status."
#             ),
#             **result,
#         }

#     # -----------------------------------------------------
#     # RISK
#     # -----------------------------------------------------

#     if request_type == "risk_analysis":

#         result = risk_analysis()

#         return {
#             "answer": (
#                 "I identified the current "
#                 "high-risk scooters."
#             ),
#             **result,
#         }

#     # -----------------------------------------------------
#     # DEMAND
#     # -----------------------------------------------------

#     if request_type == "demand_forecast":

#         result = demand_forecast(
#             zone,
#             hour
#         )

#         return {
#             "answer": (
#                 "Here is the verified demand "
#                 "forecast."
#             ),
#             **result,
#         }

#     # -----------------------------------------------------
#     # CHARGING
#     # -----------------------------------------------------

#     if request_type == "charge_recommendation":

#         result = charge_recommendation()

#         return {
#             "answer": (
#                 "These scooters should be "
#                 "prioritized for charging."
#             ),
#             **result,
#         }

#     # -----------------------------------------------------
#     # COUNTERFACTUAL
#     # -----------------------------------------------------

#     if request_type == "counterfactual":

#         result = counterfactual(
#             zone,
#             hour,
#             scooter_count
#         )

#         workflow = result.get(
#             "workflow",
#             {}
#         )

#         result["answer"] = generate_explanation(
#             user_message,
#             workflow
#         )

#         return result

#     # -----------------------------------------------------
#     # ZONE COMPARISON
#     # -----------------------------------------------------

#     if request_type == "zone_comparison":

#         result = zone_comparison(
#             hour
#         )

#         result["answer"] = (
#             "I compared the operating zones "
#             "using FleetMind's fleet economics."
#         )

#         return result

#     # -----------------------------------------------------
#     # GENERAL
#     # -----------------------------------------------------

#     return {
#         "answer": general_question(
#             user_message
#         ),
#         "intent": "general",
#     }


import json
import re
from openai import OpenAI

from agent import tools


# =========================================================
# CONFIG
# =========================================================

MODEL = "llama3.2"

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",
)


# =========================================================
# ZONES
# =========================================================

ZONES = {
    "majestic": "Nadaprabhu Kempegowda Station, Majestic",
    "kempegowda": "Nadaprabhu Kempegowda Station, Majestic",
    "nadaprabhu": "Nadaprabhu Kempegowda Station, Majestic",

    "benniganahalli": "Benniganahalli",

    "indiranagar": "Indiranagar",

    "mg road": "Mahatma Gandhi Road",
    "mgroad": "Mahatma Gandhi Road",
    "mahatma gandhi road": "Mahatma Gandhi Road",

    "kr puram": "Krishnarajapura",
    "krishnarajapura": "Krishnarajapura",
}


# =========================================================
# HELPERS
# =========================================================

def normalize_zone(text):
    if not text:
        return None

    text = str(text).lower().strip()

    for alias, zone in ZONES.items():
        if alias in text:
            return zone

    return None


def extract_zone(message):
    return normalize_zone(message)


def extract_hour(message):
    text = message.lower()

    # Only treat a number as an hour when it is explicitly
    # associated with a time expression.
    patterns = [
        r"\b([01]?\d|2[0-3]):[0-5]\d\b",
        r"\b([01]?\d|2[0-3])\s*(?:am|pm)\b",
        r"\b([01]?\d|2[0-3])\s*(?:hrs?|hours?)\b",
    ]

    for pattern in patterns:

        match = re.search(pattern, text)

        if match:
            hour = int(match.group(1))

            # Convert PM
            if "pm" in match.group(0).lower() and hour < 12:
                hour += 12

            # Convert 12 AM
            if "am" in match.group(0).lower() and hour == 12:
                hour = 0

            return hour

    if "morning" in text:
        return 9

    if "afternoon" in text:
        return 14

    if "evening" in text:
        return 18

    if "night" in text:
        return 21

    return None


def extract_scooter_count(message):
    patterns = [
        r"move\s+(\d+)",
        r"(\d+)\s+scooters?",
        r"deploy\s+(\d+)",
        r"send\s+(\d+)",
    ]

    for pattern in patterns:

        match = re.search(
            pattern,
            message.lower()
        )

        if match:
            return int(match.group(1))

    return None


# =========================================================
# OLLAMA INTENT ROUTER
# =========================================================

def understand_request(user_message):

    prompt = f"""
You are the intent router for FleetMind, an EV fleet operations agent.

Classify the user's request into EXACTLY ONE:

fleet_decision
fleet_status
risk_analysis
demand_forecast
counterfactual
charge_recommendation
zone_comparison
explanation
general

Return ONLY valid JSON.

Format:

{{
  "request_type": "...",
  "target_zone": null,
  "hour": null,
  "scooter_count": null
}}

Rules:

fleet_decision:
User asks what FleetMind should do.

fleet_status:
User asks about current fleet status, utilization, health or battery.

risk_analysis:
User asks about risky, unhealthy or unsafe scooters.

demand_forecast:
User asks about predicted demand.

counterfactual:
User asks what happens if a different number of scooters are moved/deployed.

charge_recommendation:
User asks which scooters should be charged.

zone_comparison:
User asks which zone is best, needs scooters, or is most profitable.

explanation:
User asks why FleetMind selected a particular decision.

general:
Anything unrelated to fleet operations.

User:
{user_message}
"""

    try:

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "Return ONLY valid JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0,
            max_tokens=200,
        )

        content = response.choices[0].message.content.strip()

        content = content.replace(
            "```json",
            ""
        )

        content = content.replace(
            "```",
            ""
        )

        content = content.strip()

        result = json.loads(content)

    except Exception:

        text = user_message.lower()

        if any(word in text for word in [
            "risk",
            "risky",
            "danger",
            "health",
            "unsafe",
        ]):

            request_type = "risk_analysis"

        elif any(word in text for word in [
            "demand",
            "forecast",
            "predict",
        ]):

            request_type = "demand_forecast"

        elif any(word in text for word in [
            "charge",
            "charging",
            "battery",
        ]):

            request_type = "charge_recommendation"

        elif any(word in text for word in [
            "what if",
            "scenario",
            "move 10",
            "move 8",
            "move 7",
            "move 6",
            "move 5",
        ]):

            request_type = "counterfactual"

        elif any(word in text for word in [
            "why",
            "explain",
        ]):

            request_type = "explanation"

        elif any(word in text for word in [
            "status",
            "fleet",
            "how is",
        ]):

            request_type = "fleet_status"

        elif any(word in text for word in [
            "which zone",
            "best zone",
            "most money",
            "profitable",
            "needs scooters",
            "under supplied",
        ]):

            request_type = "zone_comparison"

        else:

            request_type = "fleet_decision"

        result = {
            "request_type": request_type,
            "target_zone": None,
            "hour": None,
            "scooter_count": None,
        }

    # -----------------------------------------------------
    # Normalize zone
    # -----------------------------------------------------

    zone = normalize_zone(
        result.get("target_zone")
    )

    if zone is None:
        zone = extract_zone(user_message)

    # -----------------------------------------------------
    # Normalize hour
    # -----------------------------------------------------

    hour = result.get("hour")

    if hour is None:
        hour = extract_hour(user_message)

    try:

        if hour is not None:

            hour = int(hour)

            if hour < 0 or hour > 23:
                hour = None

    except Exception:

        hour = None

    # -----------------------------------------------------
    # Normalize scooter count
    # -----------------------------------------------------

    scooter_count = result.get(
        "scooter_count"
    )

    if scooter_count is None:
        scooter_count = extract_scooter_count(
            user_message
        )

    try:

        if scooter_count is not None:
            scooter_count = int(scooter_count)

    except Exception:

        scooter_count = None

    return {
        "request_type": result.get(
            "request_type",
            "general"
        ),
        "target_zone": zone,
        "hour": hour,
        "scooter_count": scooter_count,
    }


# =========================================================
# CORE FLEET WORKFLOW
# =========================================================

def run_fleet_workflow(
    target_zone=None,
    hour=None
):

    if target_zone is None:

        target_zone = (
            "Nadaprabhu Kempegowda Station, Majestic"
        )

    # -----------------------------------------------------
    # VERIFIED DATA
    # -----------------------------------------------------

    fleet = tools.get_fleet_status()

    risks = tools.get_high_risk_scooters()

    demand = tools.predict_demand(
        target_zone,
        hour=hour
    )

    candidates = tools.get_relocation_candidates(
        target_zone
    )

    # -----------------------------------------------------
    # IMPORTANT
    #
    # Your existing fleetmind_agent already contains
    # the working optimizer pipeline.
    #
    # We use it when available.
    # -----------------------------------------------------

    from agent import fleetmind_agent

    decision = None

    possible_functions = [
        "run_agent",
        "run_fleetmind",
        "run_workflow",
        "analyze_fleet",
    ]

    for function_name in possible_functions:

        function = getattr(
            fleetmind_agent,
            function_name,
            None
        )

        if not callable(function):
            continue

        try:

            result = function(
                target_zone,
                hour
            )

            if isinstance(result, dict):

                decision = (
                    result.get("decision")
                    or result.get("recommendation")
                    or result
                )

                break

        except TypeError:

            try:

                result = function(
                    target_zone
                )

                if isinstance(result, dict):

                    decision = (
                        result.get("decision")
                        or result.get("recommendation")
                        or result
                    )

                    break

            except Exception:
                pass

        except Exception:
            pass

    # -----------------------------------------------------
    # FALLBACK TO DECISION ENGINE
    # -----------------------------------------------------

    if decision is None:

        try:

            import inspect

            from optimizer import decision_engine

            generate_decision = getattr(
                decision_engine,
                "generate_decision"
            )

            signature = inspect.signature(
                generate_decision
            )

            params = list(
                signature.parameters.keys()
            )

            available = {
                "target_zone": target_zone,
                "zone": target_zone,
                "hour": hour,
                "demand": demand,
                "candidates": candidates,
                "fleet": fleet,
                "fleet_status": fleet,
                "risks": risks,
                "risk_analysis": risks,
            }

            kwargs = {}

            for param in params:

                if param in available:

                    kwargs[param] = available[param]

            decision = generate_decision(
                **kwargs
            )

        except Exception as e:

            decision = {
                "error": str(e),
                "target_zone": target_zone,
                "candidates": candidates,
            }

    # -----------------------------------------------------
    # Normalize common decision fields
    # -----------------------------------------------------

    if isinstance(decision, dict):

        # Preserve the selected scooters when available.
        selected = (
            decision.get("selected_scooters")
            or decision.get("selectedScooters")
            or decision.get("scooters_selected")
        )

        if selected is not None:
            decision["selected_scooters"] = selected

    return {
        "target_zone": target_zone,
        "hour": hour,
        "fleet": fleet,
        "risk_analysis": risks,
        "demand": demand,
        "candidates": candidates,
        "decision": decision,
    }


# =========================================================
# FLEET STATUS
# =========================================================

def fleet_status():

    return {
        "type": "fleet_status",
        "data": tools.get_fleet_status(),
    }


# =========================================================
# RISK ANALYSIS
# =========================================================

def risk_analysis():

    return {
        "type": "risk_analysis",
        "data": tools.get_high_risk_scooters(),
    }


# =========================================================
# DEMAND FORECAST
# =========================================================

def demand_forecast(
    zone=None,
    hour=None
):

    if zone is None:

        zone = (
            "Nadaprabhu Kempegowda Station, Majestic"
        )

    return {
        "type": "demand_forecast",
        "zone": zone,
        "hour": hour,
        "data": tools.predict_demand(
            zone,
            hour=hour
        ),
    }


# =========================================================
# CHARGING
# =========================================================

def charge_recommendation():

    fleet_df = tools.fleet_df.copy()

    urgent = fleet_df[
        fleet_df["battery"] < 30
    ]

    soon = fleet_df[
        (fleet_df["battery"] >= 30)
        &
        (fleet_df["battery"] < 50)
    ]

    return {
        "type": "charge_recommendation",
        "urgent": urgent.to_dict(
            orient="records"
        ),
        "charge_soon": soon.to_dict(
            orient="records"
        ),
    }


# =========================================================
# COUNTERFACTUAL
# =========================================================

def counterfactual(
    zone=None,
    hour=None,
    scooter_count=None
):

    workflow = run_fleet_workflow(
        zone,
        hour
    )

    decision = workflow.get(
        "decision",
        {}
    )

    if not isinstance(decision, dict):

        decision = {}

    scenarios = (
        decision.get("scenarios")
        or decision.get("counterfactual")
        or []
    )

    if hasattr(
        scenarios,
        "to_dict"
    ):

        scenarios = scenarios.to_dict(
            orient="records"
        )

    selected = None

    if scooter_count is not None:

        for scenario in scenarios:

            count = scenario.get(
                "scooters_moved",
                scenario.get(
                    "scootersMoved",
                    scenario.get("scooters")
                )
            )

            try:

                if int(count) == int(
                    scooter_count
                ):

                    selected = scenario
                    break

            except Exception:

                continue

    return {
        "type": "counterfactual",
        "workflow": workflow,
        "scenarios": scenarios,
        "selected_scenario": selected,
        "requested_count": scooter_count,
    }


# =========================================================
# LLM EXPLANATION
# =========================================================

def generate_explanation(
    user_message,
    workflow
):

    decision = workflow.get(
        "decision",
        {}
    )

    if not isinstance(decision, dict):

        decision = {}

    # -----------------------------------------------------
    # Extract verified values
    # -----------------------------------------------------

    moved = (
        decision.get("scooters_moved")
        or decision.get("scootersMoved")
        or decision.get("optimal_scooters")
        or decision.get("best_scooters")
        or decision.get("num_scooters")
    )

    revenue = (
        decision.get("revenue")
        or decision.get("expected_revenue")
    )

    cost = (
        decision.get("total_cost")
        or decision.get("cost")
        or decision.get("expected_cost")
    )

    margin = (
        decision.get("contribution_margin")
        or decision.get("contribution")
        or decision.get("profit")
    )

    improvement = (
        decision.get("margin_improvement")
        or decision.get("improvement")
    )

    selected_scooters = (
        decision.get("selected_scooters")
        or decision.get("selectedScooters")
        or []
    )

    scenarios = (
        decision.get("scenarios")
        or decision.get("counterfactual")
        or []
    )

    if hasattr(
        scenarios,
        "to_dict"
    ):

        scenarios = scenarios.to_dict(
            orient="records"
        )

    # -----------------------------------------------------
    # Find best scenario independently
    # -----------------------------------------------------

    best_scenario = None

    if scenarios:

        try:

            best_scenario = max(
                scenarios,
                key=lambda x: float(
                    x.get(
                        "contribution_margin",
                        0
                    ) or 0
                )
            )

        except Exception:

            best_scenario = None

    # -----------------------------------------------------
    # VERIFIED EVIDENCE
    # -----------------------------------------------------

    verified = {
        "target_zone": workflow.get(
            "target_zone"
        ),
        "hour": workflow.get(
            "hour"
        ),
        "predicted_demand": workflow.get(
            "demand"
        ),
        "recommended_scooters": moved,
        "selected_scooters": selected_scooters,
        "expected_revenue": revenue,
        "expected_cost": cost,
        "expected_contribution_margin": margin,
        "margin_improvement_vs_baseline": improvement,
        "best_counterfactual_scenario": best_scenario,
        "counterfactual_scenarios": scenarios,
    }

    prompt = f"""
You are FleetMind, an autonomous EV fleet operations agent.

The operator asked:

{user_message}

Use ONLY the verified optimizer evidence below.

IMPORTANT:

The financial optimizer is the source of truth.

If explaining why a number of scooters was selected, explain
that FleetMind compared multiple deployment levels and selected
the level with the highest contribution margin.

Do NOT say the decision was made merely because demand was high.

High demand explains the opportunity.

The counterfactual financial analysis explains the optimal
deployment size.

Explain the tradeoff:

- More scooters can increase expected trips and revenue.
- More scooters also increase relocation and operating costs.
- At some point the incremental revenue is smaller than the
  incremental cost.
- The optimizer therefore chooses the contribution-margin maximum.

NEVER invent financial values.

Use exact values from the verified evidence.

NEVER claim that scooters were physically moved.

Say "recommend", "recommended", or "plan".

Keep the answer concise.

Use:

Recommendation
Financial impact
Why

Verified evidence:

{json.dumps(verified, default=str)}
"""

    try:

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are FleetMind. "
                        "The optimizer is authoritative. "
                        "Never invent numbers."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.1,
            max_tokens=450,
        )

        return response.choices[0].message.content.strip()

    except Exception:

        # Reliable fallback without LLM
        if moved is not None:

            answer = (
                f"Recommendation\n"
                f"Move {moved} scooters to "
                f"{workflow.get('target_zone')}."
            )

            if margin is not None:

                answer += (
                    f"\n\nFinancial impact\n"
                    f"Expected contribution: "
                    f"₹{float(margin):,.0f}"
                )

            if improvement is not None:

                answer += (
                    f"\nImprovement vs baseline: "
                    f"₹{float(improvement):,.0f}"
                )

            answer += (
                "\n\nWhy\n"
                f"The counterfactual optimizer evaluated "
                f"multiple deployment levels and selected "
                f"{moved} because it produced the highest "
                f"contribution margin."
            )

            return answer

        return (
            "FleetMind recommends the deployment plan "
            "selected by the financial optimizer."
        )


# =========================================================
# ZONE COMPARISON
# =========================================================

def zone_comparison(hour=None):

    zones = [
        "Indiranagar",
        "Benniganahalli",
        "Krishnarajapura",
        "Mahatma Gandhi Road",
        "Nadaprabhu Kempegowda Station, Majestic",
    ]

    results = []

    for zone in zones:

        try:

            workflow = run_fleet_workflow(
                zone,
                hour
            )

            decision = workflow.get(
                "decision",
                {}
            )

            if not isinstance(
                decision,
                dict
            ):

                decision = {}

            margin = (
                decision.get(
                    "contribution_margin"
                )
                or decision.get(
                    "contribution"
                )
                or decision.get(
                    "profit"
                )
                or 0
            )

            results.append({
                "zone": zone,
                "contribution_margin": margin,
                "decision": decision,
            })

        except Exception as e:

            results.append({
                "zone": zone,
                "contribution_margin": 0,
                "error": str(e),
            })

    results.sort(
        key=lambda x: float(
            x.get(
                "contribution_margin",
                0
            ) or 0
        ),
        reverse=True
    )

    return {
        "type": "zone_comparison",
        "zones": results,
    }


# =========================================================
# GENERAL QUESTION
# =========================================================

def general_question(message):

    try:

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": """
You are FleetMind, an EV fleet operations assistant.

You help fleet operators with:

- demand
- scooters
- batteries
- vehicle health
- risk
- relocation
- deployment
- utilization
- contribution margin

Be concise.

If the question requires actual fleet numbers,
FleetMind's Python analysis must provide those numbers.

Never invent fleet statistics.
""",
                },
                {
                    "role": "user",
                    "content": message,
                },
            ],
            temperature=0.3,
            max_tokens=300,
        )

        return response.choices[0].message.content.strip()

    except Exception as e:

        return (
            "I couldn't process that request: "
            + str(e)
        )


# =========================================================
# MAIN FLEETMIND AGENT
# =========================================================

def ask_fleetmind(
    user_message,
    verbose=True
):

    intent = understand_request(
        user_message
    )

    request_type = intent.get(
        "request_type",
        "general"
    )

    zone = intent.get(
        "target_zone"
    )

    hour = intent.get(
        "hour"
    )

    scooter_count = intent.get(
        "scooter_count"
    )

    # -----------------------------------------------------
    # DECISION / EXPLANATION
    # -----------------------------------------------------

    if request_type in [
        "fleet_decision",
        "explanation",
    ]:

        workflow = run_fleet_workflow(
            zone,
            hour
        )

        answer = generate_explanation(
            user_message,
            workflow
        )

        return {
            "answer": answer,
            "intent": request_type,
            "workflow": workflow,
        }

    # -----------------------------------------------------
    # STATUS
    # -----------------------------------------------------

    if request_type == "fleet_status":

        result = fleet_status()

        return {
            "answer": (
                "Here is the current FleetMind "
                "fleet status."
            ),
            **result,
        }

    # -----------------------------------------------------
    # RISK
    # -----------------------------------------------------

    if request_type == "risk_analysis":

        result = risk_analysis()

        return {
            "answer": (
                "I identified the current "
                "high-risk scooters."
            ),
            **result,
        }

    # -----------------------------------------------------
    # DEMAND
    # -----------------------------------------------------

    if request_type == "demand_forecast":

        result = demand_forecast(
            zone,
            hour
        )

        return {
            "answer": (
                "Here is the verified demand "
                "forecast."
            ),
            **result,
        }

    # -----------------------------------------------------
    # CHARGING
    # -----------------------------------------------------

    if request_type == "charge_recommendation":

        result = charge_recommendation()

        return {
            "answer": (
                "These scooters should be "
                "prioritized for charging."
            ),
            **result,
        }

    # -----------------------------------------------------
    # COUNTERFACTUAL
    # -----------------------------------------------------

    if request_type == "counterfactual":

        result = counterfactual(
            zone,
            hour,
            scooter_count
        )

        workflow = result.get(
            "workflow",
            {}
        )

        result["answer"] = generate_explanation(
            user_message,
            workflow
        )

        return result

    # -----------------------------------------------------
    # ZONE COMPARISON
    # -----------------------------------------------------

    if request_type == "zone_comparison":

        result = zone_comparison(
            hour
        )

        result["answer"] = (
            "I compared the operating zones "
            "using FleetMind's verified fleet economics."
        )

        return result

    # -----------------------------------------------------
    # GENERAL
    # -----------------------------------------------------

    return {
        "answer": general_question(
            user_message
        ),
        "intent": "general",
    }

