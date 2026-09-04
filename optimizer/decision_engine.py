import pandas as pd
import numpy as np
from optimizer import financial_engine
from optimizer.financial_engine import (
    calculate_failure_risk,
    calculate_action_profit
)


# ============================================================
# FLEETMIND DECISION ENGINE
# ============================================================

def optimize_relocation(
    fleet,
    demand_by_zone,
    target_zone,
    payment_success_rate=0.94
):

    target_demand = demand_by_zone[target_zone]

    # Current scooters in target zone
    current_supply = len(
        fleet[
            fleet["zone"] == target_zone
        ]
    )

    # Demand gap
    demand_gap = max(
        0,
        target_demand - current_supply
    )

    # Healthy scooters outside target zone
    candidates = fleet[
        fleet["zone"] != target_zone
    ].copy()

    candidates["failure_probability"] = (
        candidates.apply(
            calculate_failure_risk,
            axis=1
        )
    )

    # Don't relocate dangerous scooters
    candidates = candidates[
        candidates["failure_probability"] < 0.30
    ]

    # Prioritize healthy + high battery scooters
    candidates["selection_score"] = (
        candidates["health_score"] * 0.6
        + candidates["battery"] * 0.4
    )

    candidates = candidates.sort_values(
        "selection_score",
        ascending=False
    )

    # Test different actions
    results = []

    max_scooters = min(
        10,
        len(candidates)
    )

    for n in range(
        0,
        max_scooters + 1
    ):

        selected = candidates.head(n)

        # Each scooter can serve approximately
        # 3 incremental trips in this prototype
        additional_trips = n * 3

        expected_trips = min(
            target_demand,
            current_supply * 3
            + additional_trips
        )

        financial = calculate_action_profit(
            selected.to_dict("records"),
            expected_trips,
            payment_success_rate,
            n
        )

        results.append({
            "scooters_moved": n,
            **financial
        })

    results_df = pd.DataFrame(results)

    # Find financially optimal action
    best = results_df.loc[
        results_df["contribution_margin"].idxmax()
    ]

    return best, results_df, candidates


# ============================================================
# DEMO
# ============================================================

if __name__ == "__main__":

    fleet = pd.read_csv(
        "data/fleet.csv"
    )

    # Example predicted demand
    demand = {
        "Indiranagar": 80,
        "Benniganahalli": 65,
        "Krishnarajapura": 70,
        "Mahatma Gandhi Road": 110,
        "Nadaprabhu Kempegowda Station, Majestic": 150
    }

    target = (
        "Nadaprabhu Kempegowda Station, Majestic"
    )

    best, scenarios, candidates = (
        optimize_relocation(
            fleet,
            demand,
            target
        )
    )

    print("\n======================================")
    print("FLEETMIND OPTIMIZATION")
    print("======================================")

    print("\nTarget zone:")
    print(target)

    print("\nPredicted demand:")
    print(demand[target])

    print("\nScenarios:")
    print(
        scenarios[
            [
                "scooters_moved",
                "expected_transactions",
                "revenue",
                "total_cost",
                "contribution_margin"
            ]
        ].to_string(index=False)
    )

    print("\n======================================")
    print("OPTIMAL ACTION")
    print("======================================")

    print(
        f"Move {int(best['scooters_moved'])} scooters"
    )

    print(
        f"Expected revenue: ₹{best['revenue']:,.0f}"
    )

    print(
        f"Expected cost: ₹{best['total_cost']:,.0f}"
    )

    print(
        f"Expected contribution: "
        f"₹{best['contribution_margin']:,.0f}"
    )

    print("\nCandidate scooters:")

    print(
        candidates[
            [
                "scooter_id",
                "zone",
                "battery",
                "health_score",
                "failure_probability"
            ]
        ]
        .head(
            int(best["scooters_moved"])
        )
        .to_string(index=False)
    )