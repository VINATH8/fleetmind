import pandas as pd

from agent.tools import (
    get_fleet_status,
    get_high_risk_scooters,
    predict_demand,
)

from optimizer.counterfactual import (
    generate_decision,
)


TARGET_ZONE = (
    "Nadaprabhu Kempegowda Station, Majestic"
)


def run_agent(
    target_zone=TARGET_ZONE,
    hour=None
):

    print("\n")
    print("=" * 65)
    print("                    FLEETMIND AI AGENT")
    print("=" * 65)

    # ========================================================
    # STEP 1 — OBSERVE FLEET
    # ========================================================

    print("\n[1] OBSERVING FLEET...")

    fleet_status = get_fleet_status()

    print(fleet_status)

    # ========================================================
    # STEP 2 — RISK ANALYSIS
    # ========================================================

    print("\n[2] ANALYZING VEHICLE RISK...")

    risks = get_high_risk_scooters()

    print(
        f"High-risk scooters: {len(risks)}"
    )

    print("\nTop risks:")

    for _, row in risks.head(5).iterrows():

        print(
            f"  {row['scooter_id']} | "
            f"{row['zone']} | "
            f"battery={row['battery']}% | "
            f"risk={row['failure_risk']:.2f}"
        )

    # ========================================================
    # STEP 3 — DEMAND PREDICTION
    # ========================================================

    print("\n[3] PREDICTING DEMAND...")

    demand_result = predict_demand(
        target_zone,
        hour=hour
    )

    predicted_demand = demand_result[
        "predicted_demand"
    ]

    print(
        f"Scenario hour: "
        f"{demand_result['hour']}:00"
    )

    print(
        f"Previous hour demand: "
        f"{demand_result['previous_hour_demand']:.0f}"
    )

    print(
        f"Predicted next-hour demand: "
        f"{predicted_demand:.0f}"
    )

    # ========================================================
    # STEP 4 — COUNTERFACTUAL OPTIMIZATION
    # ========================================================

    print("\n[4] SIMULATING FLEET INTERVENTIONS...")

    fleet = pd.read_csv(
        "data/fleet.csv"
    )

    decision = generate_decision(
        fleet=fleet,
        target_zone=target_zone,
        predicted_demand=predicted_demand
    )

    # ========================================================
    # STEP 5 — AGENT DECISION
    # ========================================================

    print("\n[5] AGENT RECOMMENDATION")
    print()

    print(
        decision["action"]
    )

    print("\nFinancial impact:")

    # The financial engine uses these names
    revenue = decision.get(
        "revenue",
        decision.get(
            "expected_revenue",
            0
        )
    )

    total_cost = decision.get(
        "total_cost",
        decision.get(
            "expected_cost",
            0
        )
    )

    contribution = decision.get(
        "expected_margin",
        decision.get(
            "contribution_margin",
            0
        )
    )

    margin_gain = decision.get(
        "margin_gain",
        decision.get(
            "improvement",
            0
        )
    )

    print(
        f"Expected revenue: "
        f"₹{revenue:,.0f}"
    )

    print(
        f"Expected cost: "
        f"₹{total_cost:,.0f}"
    )

    print(
        f"Expected contribution: "
        f"₹{contribution:,.0f}"
    )

    print(
        f"Improvement vs baseline: "
        f"₹{margin_gain:,.0f}"
    )

    # ========================================================
    # STEP 6 — COUNTERFACTUAL ANALYSIS
    # ========================================================

    print("\n[6] COUNTERFACTUAL ANALYSIS")

    scenarios = pd.DataFrame(
        decision["scenarios"]
    )

    columns_to_show = [
        "scooters_moved",
        "expected_trips",
        "revenue",
        "total_cost",
        "contribution_margin"
    ]

    available_columns = [
        column
        for column in columns_to_show
        if column in scenarios.columns
    ]

    print(
        scenarios[
            available_columns
        ].to_string(
            index=False
        )
    )

    # ========================================================
    # DECISION SUMMARY
    # ========================================================

    print("\n[7] DECISION SUMMARY")

    print(
        f"Target zone: {target_zone}"
    )

    print(
        f"Predicted demand: "
        f"{predicted_demand:.0f}"
    )

    print(
        f"Scooters moved: "
        f"{decision.get('scooters_moved', 'N/A')}"
    )

    print(
        f"Expected contribution: "
        f"₹{contribution:,.0f}"
    )

    print(
        f"Margin improvement: "
        f"₹{margin_gain:,.0f}"
    )

    print("\n")
    print("=" * 65)
    print("              FLEETMIND DECISION COMPLETE")
    print("=" * 65)
    print()


if __name__ == "__main__":

    run_agent()