import { useEffect, useState } from "react";
import {
  BatteryCharging,
  Wrench,
  ShieldAlert,
  Activity,
  Zap,
  RefreshCw,
} from "lucide-react";

const API = "/api/api/operations";

export default function Operations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Operations request failed");
      }

      setData(await response.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const health = data?.health || {};
  const charging = data?.charging || [];
  const maintenance = data?.maintenance || [];
  const zones = data?.zones || [];

  return (
    <div className="min-h-screen bg-[#080a0c] text-[#e7ebef]">
      <main className="mx-auto max-w-[1450px] px-7 pb-16 pt-9 lg:px-12">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] text-[#56636e]">
              <Activity size={12} />
              OPERATIONS
            </div>

            <h1 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-white">
              Fleet health
            </h1>

            <p className="mt-2 text-sm text-[#5e6a75]">
              Charging, maintenance and zone-level operating
              conditions.
            </p>
          </div>

          <button
            onClick={load}
            className="flex items-center gap-2 rounded-full border border-white/[0.08] px-4 py-2 text-[10px] text-[#69757f]"
          >
            <RefreshCw
              size={12}
              className={loading ? "animate-spin" : ""}
            />
            REFRESH
          </button>
        </div>

        {/* HEALTH METRICS */}
        <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric
            icon={<Activity size={14} />}
            label="FLEET"
            value={health.total_vehicles ?? 25}
          />

          <Metric
            icon={<BatteryCharging size={14} />}
            label="LOW BATTERY"
            value={health.low_battery ?? 0}
          />

          <Metric
            icon={<Wrench size={14} />}
            label="MAINTENANCE"
            value={
              (health.critical_maintenance ?? 0) +
              (health.high_maintenance ?? 0)
            }
          />

          <Metric
            icon={<ShieldAlert size={14} />}
            label="CRITICAL CHARGE"
            value={health.critical_charging ?? 0}
          />
        </div>

        <div className="grid grid-cols-1 gap-7 xl:grid-cols-2">
          {/* CHARGING */}
          <section className="overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#0b0e11]">
            <Header
              icon={<BatteryCharging size={12} />}
              title="CHARGING PRIORITY"
            />

            <div className="divide-y divide-white/[0.045]">
              {charging.slice(0, 7).map((item) => (
                <div
                  key={item.scooter_id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div>
                    <div className="font-mono text-[11px] text-[#aeb6bd]">
                      {item.scooter_id}
                    </div>

                    <div className="mt-1 text-[10px] text-[#596671]">
                      {shorten(item.zone)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-[11px] text-[#9ca5ac]">
                      {item.battery}%
                    </div>

                    <div className="mt-1 text-[8px] tracking-[0.12em] text-[#596671]">
                      {item.urgency}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* MAINTENANCE */}
          <section className="overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#0b0e11]">
            <Header
              icon={<Wrench size={12} />}
              title="MAINTENANCE PRIORITY"
            />

            <div className="divide-y divide-white/[0.045]">
              {maintenance.slice(0, 7).map((item) => (
                <div
                  key={item.scooter_id}
                  className="px-6 py-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-[11px] text-[#aeb6bd]">
                      {item.scooter_id}
                    </div>

                    <div className="font-mono text-[9px] text-[#7e8991]">
                      {item.priority}
                    </div>
                  </div>

                  <div className="mt-1 flex justify-between">
                    <span className="text-[10px] text-[#596671]">
                      {shorten(item.zone)}
                    </span>

                    <span className="text-[9px] text-[#4d5963]">
                      {item.reasons?.join(" · ") || "No immediate issue"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ZONE OPPORTUNITY */}
        <section className="mt-7 overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#0b0e11]">
          <Header
            icon={<Zap size={12} />}
            title="ZONE OPPORTUNITY"
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-white/[0.06] text-left">
                  {[
                    "ZONE",
                    "DEMAND",
                    "VEHICLES",
                    "DEMAND / VEHICLE",
                    "BATTERY",
                    "HEALTH",
                    "RISK",
                  ].map((label) => (
                    <th
                      key={label}
                      className="px-6 py-4 text-[8px] tracking-[0.13em] text-[#46515a]"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {zones.map((zone) => (
                  <tr
                    key={zone.zone}
                    className="border-b border-white/[0.045] last:border-0"
                  >
                    <td className="px-6 py-4 text-[11px] text-[#9da6ad]">
                      {shorten(zone.zone)}
                    </td>

                    <td className="px-6 py-4 font-mono text-[10px] text-[#89939a]">
                      {Math.round(zone.predicted_demand)}
                    </td>

                    <td className="px-6 py-4 font-mono text-[10px] text-[#89939a]">
                      {zone.vehicles}
                    </td>

                    <td className="px-6 py-4 font-mono text-[10px] text-[#aeb6bd]">
                      {zone.demand_per_vehicle}
                    </td>

                    <td className="px-6 py-4 font-mono text-[10px] text-[#89939a]">
                      {zone.avg_battery}%
                    </td>

                    <td className="px-6 py-4 font-mono text-[10px] text-[#89939a]">
                      {zone.avg_health}
                    </td>

                    <td className="px-6 py-4 font-mono text-[10px] text-[#89939a]">
                      {zone.high_risk}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function Metric({ icon, label, value }) {
  return (
    <div className="rounded-[16px] border border-white/[0.07] bg-[#0b0e11] p-5">
      <div className="text-[#515d67]">{icon}</div>

      <div className="mt-5 font-mono text-2xl text-[#d5dade]">
        {value}
      </div>

      <div className="mt-2 text-[8px] tracking-[0.16em] text-[#414c55]">
        {label}
      </div>
    </div>
  );
}

function Header({ icon, title }) {
  return (
    <div className="flex items-center gap-2 border-b border-white/[0.06] px-6 py-4 text-[9px] tracking-[0.18em] text-[#596671]">
      {icon}
      {title}
    </div>
  );
}

function shorten(zone) {
  if (!zone) return "—";

  if (
    zone.toLowerCase().includes("majestic") ||
    zone.toLowerCase().includes("kempegowda")
  ) {
    return "Majestic";
  }

  if (zone === "Mahatma Gandhi Road") return "MG Road";
  if (zone === "Krishnarajapura") return "KR Puram";

  return zone;
}
