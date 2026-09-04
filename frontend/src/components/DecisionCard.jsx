import {
  ArrowRight,
  TrendingUp,
  IndianRupee,
  Activity,
  ShieldCheck,
  Zap,
} from "lucide-react";

function number(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function money(value) {
  return `₹${Math.round(number(value)).toLocaleString("en-IN")}`;
}

function first(...values) {
  return values.find(
    (value) =>
      value !== undefined &&
      value !== null &&
      value !== ""
  );
}

export default function DecisionCard({ decision }) {
  if (!decision) return null;

  const moved = number(
    first(
      decision.scooters_moved,
      decision.scootersMoved,
      decision.optimal_scooters,
      decision.best_scooters,
      decision.num_scooters
    )
  );

  const revenue = number(
    first(
      decision.revenue,
      decision.expected_revenue
    )
  );

  const cost = number(
    first(
      decision.total_cost,
      decision.cost,
      decision.expected_cost
    )
  );

  const contribution = number(
    first(
      decision.contribution_margin,
      decision.contribution,
      decision.profit
    )
  );

  const improvement = number(
    first(
      decision.margin_improvement,
      decision.improvement,
      decision.improvement_vs_baseline
    )
  );

  const trips = number(
    first(
      decision.expected_trips,
      decision.trips
    )
  );

  const target =
    decision.target_zone ||
    decision.targetZone ||
    "Target zone";

  const action =
    moved > 0
      ? `Move ${moved} healthy scooters`
      : "Keep current allocation";

  return (
    <section className="overflow-hidden rounded-[18px] border border-white/[0.09] bg-[#0b0e11]">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/[0.06] px-6 py-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-[9px] tracking-[0.2em] text-[#596671]">
            <Zap size={11} />
            OPTIMIZED FLEET ACTION
          </div>

          <div className="mt-2 text-xl font-medium tracking-[-0.025em] text-[#e1e5e8]">
            {action}
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-emerald-300/[0.12] bg-emerald-300/[0.025] px-3 py-2 text-[8px] tracking-[0.14em] text-emerald-200/50">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
          FINANCIAL OPTIMUM
        </div>
      </div>

      {/* TARGET */}
      <div className="border-b border-white/[0.06] px-6 py-5">
        <div className="text-[8px] tracking-[0.18em] text-[#48545e]">
          TARGET ZONE
        </div>

        <div className="mt-2 flex items-center gap-3">
          <span className="text-[14px] text-[#9da7ae]">
            Fleet
          </span>

          <ArrowRight
            size={14}
            className="text-[#4f5a64]"
          />

          <span className="text-[14px] font-medium text-[#d0d6da]">
            {shortenZone(target)}
          </span>
        </div>
      </div>

      {/* FINANCIAL METRICS */}
      <div className="grid grid-cols-2 border-b border-white/[0.06] lg:grid-cols-4">
        <Metric
          icon={<IndianRupee size={13} />}
          label="EXPECTED REVENUE"
          value={money(revenue)}
        />

        <Metric
          icon={<Activity size={13} />}
          label="EXPECTED COST"
          value={money(cost)}
        />

        <Metric
          icon={<TrendingUp size={13} />}
          label="CONTRIBUTION"
          value={money(contribution)}
          emphasis
        />

        <Metric
          icon={<TrendingUp size={13} />}
          label="VS BASELINE"
          value={improvement >= 0 ? `+${money(improvement)}` : money(improvement)}
          emphasis={improvement > 0}
        />
      </div>

      {/* OPERATIONAL STATS */}
      <div className="flex flex-wrap gap-8 px-6 py-5">
        <SmallStat
          label="SCOOTERS MOVED"
          value={moved}
        />

        <SmallStat
          label="EXPECTED RIDES"
          value={trips.toFixed(1)}
        />

        <SmallStat
          label="RISK POLICY"
          value="HEALTHY ONLY"
        />

        <SmallStat
          label="OBJECTIVE"
          value="CONTRIBUTION"
        />
      </div>

      {/* WHY */}
      <div className="border-t border-white/[0.06] bg-white/[0.012] px-6 py-5">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={14}
            className="mt-0.5 shrink-0 text-[#58656f]"
          />

          <div>
            <div className="text-[9px] tracking-[0.18em] text-[#53606a]">
              WHY THIS ACTION
            </div>

            <p className="mt-2 max-w-4xl text-[12px] leading-6 text-[#68747e]">
              FleetMind evaluates multiple deployment
              levels and selects the scenario with the
              highest expected contribution margin. More
              scooters can increase rides, but relocation,
              operational and vehicle-risk costs eventually
              outweigh the additional revenue.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
  emphasis = false,
}) {
  return (
    <div className="border-r border-white/[0.06] px-5 py-6 last:border-r-0">
      <div className="flex items-center gap-2 text-[#4f5b65]">
        {icon}

        <span className="text-[8px] tracking-[0.13em]">
          {label}
        </span>
      </div>

      <div
        className={`mt-4 font-mono text-[18px] ${
          emphasis
            ? "text-[#d4dade]"
            : "text-[#9aa3aa]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function SmallStat({ label, value }) {
  return (
    <div>
      <div className="text-[8px] tracking-[0.14em] text-[#414c55]">
        {label}
      </div>

      <div className="mt-1 font-mono text-[10px] text-[#7c8790]">
        {value}
      </div>
    </div>
  );
}

function shortenZone(zone) {
  if (!zone) return "—";

  if (
    zone.toLowerCase().includes("majestic") ||
    zone.toLowerCase().includes("kempegowda")
  ) {
    return "Majestic";
  }

  if (zone === "Mahatma Gandhi Road") {
    return "MG Road";
  }

  if (zone === "Krishnarajapura") {
    return "KR Puram";
  }

  return zone;
}