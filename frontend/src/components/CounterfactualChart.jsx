import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CounterfactualChart({
  scenarios = [],
}) {

  const data = scenarios
    .map((item) => ({
      scooters:
        item.scooters_moved ??
        item.scootersMoved ??
        item.scooters ??
        0,

      margin:
        item.contribution_margin ??
        item.contributionMargin ??
        item.margin ??
        0,
    }))
    .sort(
      (a, b) =>
        a.scooters - b.scooters,
    );

  if (!data.length) {

    return (
      <div className="flex h-full items-center justify-center text-xs text-[#555d64]">
        No optimization data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 10,
          bottom: 5,
        }}
      >

        <CartesianGrid
          stroke="#1b1f23"
          vertical={false}
        />

        <XAxis
          dataKey="scooters"
          tick={{
            fill: "#626a71",
            fontSize: 10,
          }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{
            fill: "#626a71",
            fontSize: 10,
          }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) =>
            `₹${Math.round(v / 1000)}k`
          }
        />

        <Tooltip
          contentStyle={{
            background: "#101316",
            border: "1px solid #262b30",
            borderRadius: "9px",
            color: "#e5e8eb",
            fontSize: "11px",
          }}
          formatter={(value) => [
            `₹${Number(value).toLocaleString(
              "en-IN",
            )}`,
            "Contribution",
          ]}
          labelFormatter={(label) =>
            `${label} scooters moved`
          }
        />

        <Line
          type="monotone"
          dataKey="margin"
          stroke="#e3e7e9"
          strokeWidth={2}
          dot={{
            r: 3,
            fill: "#0b0e10",
            stroke: "#dce1e4",
            strokeWidth: 1.5,
          }}
          activeDot={{
            r: 5,
          }}
        />

      </LineChart>
    </ResponsiveContainer>
  );
}