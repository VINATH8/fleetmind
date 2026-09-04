import pandas as pd
import numpy as np

from agent import tools


FARE_PER_RIDE = 110
ENERGY_COST_PER_RIDE = 12
SWAP_COST = 35
MAINTENANCE_COST = 180
FAILURE_COST = 700


def _risk(row):
    battery = float(row.get("battery", 0))
    health = float(row.get("health_score", 0))
    trips = float(row.get("trips_today", 0))
    age = float(row.get("age_months", 0))

    risk = 0.05

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

    return min(risk, 0.95)


def maintenance_priorities():
    fleet = tools.fleet_df.copy()

    results = []

    for _, row in fleet.iterrows():
        risk = _risk(row)

        battery = float(row["battery"])
        health = float(row["health_score"])
        trips = float(row["trips_today"])
        age = float(row["age_months"])

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
            reasons.append("high vehicle age")

        if trips > 12:
            reasons.append("high daily utilization")

        results.append(
            {
                "scooter_id": row["scooter_id"],
                "zone": row["zone"],
                "battery": battery,
                "health_score": health,
                "age_months": age,
                "risk": round(risk, 2),
                "maintenance_score": round(score, 2),
                "priority": priority,
                "reasons": reasons,
            }
        )

    results.sort(
        key=lambda x: x["maintenance_score"],
        reverse=True,
    )

    return results


def charging_recommendations():
    fleet = tools.fleet_df.copy()

    results = []

    for _, row in fleet.iterrows():
        battery = float(row["battery"])
        health = float(row["health_score"])
        trips = float(row["trips_today"])

        if battery <= 25:
            urgency = "CRITICAL"
        elif battery <= 40:
            urgency = "HIGH"
        elif battery <= 55:
            urgency = "MEDIUM"
        else:
            urgency = "LOW"

        charge_score = (
            max(0, 100 - battery)
            + max(0, 80 - health) * 0.4
            + trips * 2
        )

        if battery <= 40:
            action = "Charge immediately"
        elif battery <= 55:
            action = "Schedule charging"
        else:
            action = "No immediate charge required"

        results.append(
            {
                "scooter_id": row["scooter_id"],
                "zone": row["zone"],
                "battery": battery,
                "health_score": health,
                "trips_today": trips,
                "urgency": urgency,
                "charge_score": round(charge_score, 2),
                "action": action,
                "estimated_swap_cost": SWAP_COST
                if battery <= 40
                else 0,
            }
        )

    results.sort(
        key=lambda x: x["charge_score"],
        reverse=True,
    )

    return results


def zone_comparison(hour=17):
    zones = tools.get_zone_distribution()

    rows = []

    for zone in zones:
        try:
            state = tools.get_scenario_state(
                zone,
                hour=hour,
            )

            demand = float(
                state.get(
                    "predicted_demand",
                    state.get("demand", 0),
                )
            )
        except Exception:
            demand = 0

        zone_fleet = tools.fleet_df[
            tools.fleet_df["zone"] == zone
        ]

        vehicle_count = len(zone_fleet)

        avg_battery = (
            float(zone_fleet["battery"].mean())
            if vehicle_count
            else 0
        )

        avg_health = (
            float(zone_fleet["health_score"].mean())
            if vehicle_count
            else 0
        )

        risk_count = sum(
            _risk(row) >= 0.5
            for _, row in zone_fleet.iterrows()
        )

        capacity_pressure = (
            demand / max(vehicle_count, 1)
        )

        rows.append(
            {
                "zone": zone,
                "predicted_demand": round(demand, 2),
                "vehicles": vehicle_count,
                "avg_battery": round(avg_battery, 1),
                "avg_health": round(avg_health, 1),
                "high_risk": risk_count,
                "demand_per_vehicle": round(
                    capacity_pressure,
                    2,
                ),
            }
        )

    rows.sort(
        key=lambda x: x["predicted_demand"],
        reverse=True,
    )

    return rows


def payment_adjusted_financials(
    expected_trips,
    zone,
):
    """
    Payment success is a prototype assumption, not a live
    Razorpay API measurement.
    """

    payment_success = {
        "Nadaprabhu Kempegowda Station, Majestic": 0.97,
        "Indiranagar": 0.96,
        "Benniganahalli": 0.95,
        "Krishnarajapura": 0.94,
        "Mahatma Gandhi Road": 0.97,
    }.get(zone, 0.95)

    successful_transactions = (
        expected_trips * payment_success
    )

    gross_revenue = (
        successful_transactions * FARE_PER_RIDE
    )

    payment_loss = (
        expected_trips * FARE_PER_RIDE
        - gross_revenue
    )

    return {
        "payment_success_probability": payment_success,
        "expected_trips": round(expected_trips, 2),
        "successful_transactions": round(
            successful_transactions,
            2,
        ),
        "gross_revenue": round(
            gross_revenue,
            2,
        ),
        "payment_failure_exposure": round(
            payment_loss,
            2,
        ),
    }


def fleet_health_summary():
    fleet = tools.fleet_df.copy()

    maintenance = maintenance_priorities()
    charging = charging_recommendations()

    critical_maintenance = sum(
        x["priority"] == "CRITICAL"
        for x in maintenance
    )

    high_maintenance = sum(
        x["priority"] == "HIGH"
        for x in maintenance
    )

    critical_charge = sum(
        x["urgency"] == "CRITICAL"
        for x in charging
    )

    low_battery = sum(
        fleet["battery"] < 30
    )

    return {
        "total_vehicles": len(fleet),
        "average_battery": round(
            float(fleet["battery"].mean()),
            2,
        ),
        "average_health": round(
            float(fleet["health_score"].mean()),
            2,
        ),
        "low_battery": int(low_battery),
        "critical_maintenance": critical_maintenance,
        "high_maintenance": high_maintenance,
        "critical_charging": critical_charge,
    }