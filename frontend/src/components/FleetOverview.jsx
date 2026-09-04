import { Battery, ShieldCheck, Truck } from "lucide-react";

export default function FleetOverview() {
  const zones = [
    { name: "Majestic", count: 5 },
    { name: "Indiranagar", count: 5 },
    { name: "Benniganahalli", count: 5 },
    { name: "KR Puram", count: 5 },
    { name: "MG Road", count: 5 },
  ];

  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#0b0e10]">
      <div className="border-b border-white/[0.07] px-5 py-4">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#626a71]">
          Fleet overview
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-white/[0.07]">
        <Stat icon={Truck} value="25" label="Vehicles" />
        <Stat icon={Battery} value="58%" label="Avg battery" />
        <Stat icon={ShieldCheck} value="83" label="Avg health" />
      </div>

      <div className="border-t border-white/[0.07] p-5">
        <div className="mb-4 text-[9px] uppercase tracking-[0.17em] text-[#596168]">
          Zone distribution
        </div>

        <div className="space-y-3">
          {zones.map((zone) => (
            <div
              key={zone.name}
              className="flex items-center justify-between"
            >
              <span className="text-xs text-[#8c949a]">
                {zone.name}
              </span>

              <span className="font-mono text-xs text-[#c1c7cb]">
                {zone.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="px-4 py-5">
      <Icon
        size={15}
        className="mb-3 text-[#646c73]"
        strokeWidth={1.5}
      />

      <div className="text-lg font-medium">{value}</div>

      <div className="mt-1 text-[9px] uppercase tracking-[0.12em] text-[#555d64]">
        {label}
      </div>
    </div>
  );
}