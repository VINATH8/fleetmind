import { useEffect, useState } from "react";
import {
  Activity,
  ShieldCheck,
  BrainCircuit,
  Search,
  Calculator,
  TrendingUp,
  Check,
} from "lucide-react";

const STEPS = [
  {
    label: "Fleet state",
    detail: "Reading live vehicle positions, battery and health",
    icon: Activity,
  },
  {
    label: "Vehicle risk",
    detail: "Screening fleet for deployment risk",
    icon: ShieldCheck,
  },
  {
    label: "Demand forecast",
    detail: "Predicting next-hour zone demand",
    icon: BrainCircuit,
  },
  {
    label: "Candidate selection",
    detail: "Filtering deployable scooters",
    icon: Search,
  },
  {
    label: "Financial simulation",
    detail: "Calculating revenue and operational cost",
    icon: Calculator,
  },
  {
    label: "Counterfactual optimization",
    detail: "Testing alternative fleet actions",
    icon: TrendingUp,
  },
];

export default function ExecutionPanel({ loading = false }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!loading) {
      setActiveStep(STEPS.length);
      return;
    }

    setActiveStep(0);

    const timers = STEPS.map((_, index) =>
      setTimeout(() => {
        setActiveStep(index + 1);
      }, 650 * (index + 1))
    );

    return () => timers.forEach(clearTimeout);
  }, [loading]);

  return (
    <div className="rounded-[16px] border border-white/[0.07] bg-[#0a0d10]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
        <div>
          <div className="flex items-center gap-2 text-[9px] tracking-[0.2em] text-[#596671]">
            <Activity size={11} />
            AGENT EXECUTION
          </div>

          <div className="mt-1 text-[12px] text-[#7c8790]">
            FleetMind decision pipeline
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[9px] text-[#596671]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400/70" />
          {activeStep >= STEPS.length ? "COMPLETE" : "PROCESSING"}
        </div>
      </div>

      <div className="divide-y divide-white/[0.045]">
        {STEPS.map((step, index) => {
          const Icon = step.icon;

          const complete = activeStep > index;
          const active = activeStep === index;

          return (
            <div
              key={step.label}
              className={`flex items-center gap-4 px-5 py-4 transition ${
                active
                  ? "bg-white/[0.025]"
                  : "bg-transparent"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border ${
                  complete
                    ? "border-emerald-300/[0.12] bg-emerald-300/[0.025] text-emerald-200/60"
                    : active
                    ? "border-white/[0.13] bg-white/[0.035] text-white/65"
                    : "border-white/[0.06] text-white/20"
                }`}
              >
                {complete ? (
                  <Check size={13} />
                ) : (
                  <Icon size={13} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div
                  className={`text-[12px] ${
                    complete || active
                      ? "text-[#aeb6bd]"
                      : "text-[#56616b]"
                  }`}
                >
                  {step.label}
                </div>

                <div className="mt-1 text-[10px] text-[#414c55]">
                  {step.detail}
                </div>
              </div>

              <div className="font-mono text-[8px] tracking-[0.12em]">
                {complete ? (
                  <span className="text-emerald-200/45">
                    DONE
                  </span>
                ) : active ? (
                  <span className="animate-pulse text-white/45">
                    RUNNING
                  </span>
                ) : (
                  <span className="text-white/15">
                    WAIT
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-white/[0.06] px-5 py-3">
        <div className="flex items-center justify-between font-mono text-[8px] tracking-[0.12em] text-[#39434b]">
          <span>
            PREDICT → DETECT → DECIDE → OPTIMIZE
          </span>

          <span>
            {Math.min(activeStep, STEPS.length)}/{STEPS.length}
          </span>
        </div>
      </div>
    </div>
  );
}