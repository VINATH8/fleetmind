// // import React, { useState } from "react";

// // import {
// //   ArrowUp,
// //   RefreshCw,
// //   AlertTriangle,
// //   Battery,
// //   Activity,
// //   Wrench,
// //   TrendingUp,
// //   ChevronRight,
// // } from "lucide-react";

// // const API = "http://127.0.0.1:8000";

// // export default function CommandCenter() {

// //   const [question, setQuestion] = useState("");
// //   const [messages, setMessages] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //   async function submit(e) {

// //     e.preventDefault();

// //     const text = question.trim();

// //     if (!text || loading) return;

// //     setLoading(true);

// //     try {

// //       const response = await fetch(
// //         `${API}/api/ask`,
// //         {
// //           method: "POST",

// //           headers: {
// //             "Content-Type":
// //               "application/json",
// //           },

// //           body: JSON.stringify({
// //             message: text,
// //           }),
// //         }
// //       );

// //       const result =
// //         await response.json();

// //       console.log(
// //         "FleetMind:",
// //         result
// //       );

// //       setMessages(
// //         previous => [
// //           ...previous,
// //           {
// //             question: text,
// //             result,
// //           },
// //         ]
// //       );

// //       setQuestion("");

// //     } catch (error) {

// //       setMessages(
// //         previous => [
// //           ...previous,
// //           {
// //             question: text,
// //             result: {
// //               type: "error",
// //               answer:
// //                 "FleetMind could not connect to the operating service.",
// //               error:
// //                 error.message,
// //             },
// //           },
// //         ]
// //       );

// //     } finally {

// //       setLoading(false);

// //     }
// //   }


// //   return (

// //     <div className="min-h-screen bg-[#07090a] text-gray-100">

// //       <main className="mx-auto max-w-[1100px] px-6 py-8 lg:px-10">


// //         {/* ==================================================
// //             TOP BAR
// //         ================================================== */}

// //         <header className="flex items-center justify-between">

// //           <div className="flex items-center gap-3">

// //             <div className="h-2 w-2 rounded-full bg-emerald-400" />

// //             <span className="text-[11px] font-medium tracking-[0.24em] text-gray-400">
// //               FLEETMIND
// //             </span>

// //           </div>


// //           <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-gray-600">

// //             <span>
// //               Operations agent
// //             </span>

// //             <span className="text-emerald-500">
// //               ●
// //             </span>

// //             <span className="text-emerald-500">
// //               Online
// //             </span>

// //           </div>

// //         </header>


// //         {/* ==================================================
// //             PAGE TITLE
// //         ================================================== */}

// //         <div className="mt-14">

// //           <div className="text-[10px] uppercase tracking-[0.2em] text-gray-600">
// //             Fleet operations
// //           </div>

// //           <h1 className="mt-3 text-3xl font-medium tracking-tight text-gray-100">
// //             Command center
// //           </h1>

// //           <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
// //             Ask about the current fleet state, demand,
// //             vehicle risk or deployment economics.
// //           </p>

// //         </div>


// //         {/* ==================================================
// //             EMPTY STATE
// //         ================================================== */}

// //         {messages.length === 0 && (

// //           <div className="mt-12">

// //             <div className="border-y border-white/10 py-6">

// //               <div className="text-[10px] uppercase tracking-[0.18em] text-gray-600">
// //                 Suggested queries
// //               </div>


// //               <div className="mt-5 grid gap-2 md:grid-cols-2">

// //                 <Suggestion
// //                   text="Which scooter is most likely to fail?"
// //                   onClick={() =>
// //                     setQuestion(
// //                       "Which scooter is most likely to fail?"
// //                     )
// //                   }
// //                 />

// //                 <Suggestion
// //                   text="Where is demand highest?"
// //                   onClick={() =>
// //                     setQuestion(
// //                       "Where is demand highest?"
// //                     )
// //                   }
// //                 />

// //                 <Suggestion
// //                   text="Which scooters should I charge first?"
// //                   onClick={() =>
// //                     setQuestion(
// //                       "Which scooters should I charge first?"
// //                     )
// //                   }
// //                 />

// //                 <Suggestion
// //                   text="What happens if I move 8 scooters?"
// //                   onClick={() =>
// //                     setQuestion(
// //                       "What happens if I move 8 scooters?"
// //                     )
// //                   }
// //                 />

// //               </div>

// //             </div>

// //           </div>
// //         )}


// //         {/* ==================================================
// //             CONVERSATION
// //         ================================================== */}

// //         <div className="mt-10 space-y-12">

// //           {messages.map(
// //             (message, index) => (

// //               <Conversation
// //                 key={index}
// //                 question={
// //                   message.question
// //                 }
// //                 result={
// //                   message.result
// //                 }
// //               />

// //             )
// //           )}

// //         </div>


// //         {/* ==================================================
// //             INPUT
// //         ================================================== */}

// //         <div
// //           className={
// //             messages.length
// //               ? "mt-12"
// //               : "mt-10"
// //           }
// //         >

// //           <form
// //             onSubmit={submit}
// //             className="relative"
// //           >

// //             <div className="flex items-center border-b border-white/15 pb-3 transition focus-within:border-white/40">

// //               <input
// //                 value={question}
// //                 onChange={(e) =>
// //                   setQuestion(
// //                     e.target.value
// //                   )
// //                 }
// //                 placeholder="Ask a fleet question..."
// //                 className="flex-1 bg-transparent px-1 py-3 text-base text-gray-200 outline-none placeholder:text-gray-700"
// //               />

// //               <button
// //                 type="submit"
// //                 disabled={
// //                   !question.trim() ||
// //                   loading
// //                 }
// //                 className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-500 transition hover:border-white/20 hover:text-white disabled:opacity-20"
// //               >

// //                 {loading ? (

// //                   <RefreshCw
// //                     size={15}
// //                     className="animate-spin"
// //                   />

// //                 ) : (

// //                   <ArrowUp size={16} />

// //                 )}

// //               </button>

// //             </div>

// //           </form>


// //           <div className="mt-3 flex justify-between text-[9px] uppercase tracking-[0.15em] text-gray-700">

// //             <span>
// //               Natural language
// //             </span>

// //             <span>
// //               Enter to submit
// //             </span>

// //           </div>

// //         </div>

// //       </main>

// //     </div>
// //   );
// // }


// // /* ============================================================
// //    CONVERSATION
// // ============================================================ */

// // function Conversation({
// //   question,
// //   result,
// // }) {

// //   return (

// //     <section>

// //       {/* USER QUESTION */}

// //       <div className="flex gap-5">

// //         <div className="w-16 shrink-0 pt-1 text-[9px] uppercase tracking-[0.18em] text-gray-700">
// //           You
// //         </div>

// //         <div className="text-base leading-7 text-gray-300">
// //           {question}
// //         </div>

// //       </div>


// //       {/* AGENT */}

// //       <div className="mt-8 flex gap-5">

// //         <div className="w-16 shrink-0 pt-1 text-[9px] uppercase tracking-[0.18em] text-gray-600">
// //           FleetMind
// //         </div>


// //         <div className="min-w-0 flex-1">

// //           <div className="max-w-3xl text-[15px] leading-7 text-gray-400">

// //             {result?.answer}

// //           </div>


// //           {result?.error && (

// //             <div className="mt-5 border-l border-red-500/50 pl-4 text-xs text-red-400">
// //               {result.error}
// //             </div>

// //           )}


// //           <Response
// //             result={result}
// //           />

// //         </div>

// //       </div>

// //     </section>
// //   );
// // }


// // /* ============================================================
// //    RESPONSE ROUTER
// // ============================================================ */

// // function Response({
// //   result,
// // }) {

// //   if (!result) return null;


// //   if (
// //     result.type ===
// //     "risk_analysis"
// //   ) {

// //     return (
// //       <RiskResult
// //         data={result.data}
// //       />
// //     );
// //   }


// //   if (
// //     result.type ===
// //     "charging_recommendation"
// //   ) {

// //     return (
// //       <ChargingResult
// //         data={result.data}
// //       />
// //     );
// //   }


// //   if (
// //     result.type ===
// //     "maintenance_recommendation"
// //   ) {

// //     return (
// //       <MaintenanceResult
// //         data={result.data}
// //       />
// //     );
// //   }


// //   if (
// //     result.type ===
// //     "fleet_status"
// //   ) {

// //     return (
// //       <FleetResult
// //         data={result.data}
// //       />
// //     );
// //   }


// //   if (
// //     result.type ===
// //     "demand_forecast"
// //   ) {

// //     return (
// //       <DemandResult
// //         result={result}
// //       />
// //     );
// //   }


// //   if (
// //     result.type ===
// //     "demand_comparison"
// //   ) {

// //     return (
// //       <DemandComparison
// //         data={result.data}
// //       />
// //     );
// //   }


// //   if (
// //     result.type ===
// //     "zone_comparison"
// //   ) {

// //     return (
// //       <ZoneComparison
// //         data={result.data}
// //       />
// //     );
// //   }


// //   if (
// //     result.type ===
// //     "financial_simulation"
// //     ||
// //     result.type ===
// //     "financial_optimization"
// //     ||
// //     result.type ===
// //     "recommendation"
// //   ) {

// //     return (
// //       <FinancialResult
// //         result={result}
// //       />
// //     );
// //   }


// //   if (
// //     Array.isArray(
// //       result.data
// //     )
// //   ) {

// //     return (
// //       <GenericTable
// //         rows={
// //           result.data
// //         }
// //       />
// //     );
// //   }


// //   return null;
// // }


// // /* ============================================================
// //    RISK
// // ============================================================ */

// // function RiskResult({
// //   data,
// // }) {

// //   const rows =
// //     Array.isArray(data)
// //       ? data
// //       : [];

// //   return (

// //     <div className="mt-7">

// //       <div className="mb-4 flex items-center gap-3">

// //         <AlertTriangle
// //           size={14}
// //           className="text-gray-500"
// //         />

// //         <span className="text-[10px] uppercase tracking-[0.16em] text-gray-600">
// //           Risk register
// //         </span>

// //         <span className="font-mono text-[10px] text-gray-700">
// //           {rows.length} vehicles
// //         </span>

// //       </div>


// //       <div className="overflow-hidden border-y border-white/10">

// //         <table className="w-full">

// //           <thead>

// //             <tr className="text-left text-[9px] uppercase tracking-[0.14em] text-gray-700">

// //               <th className="py-3">
// //                 Vehicle
// //               </th>

// //               <th className="py-3">
// //                 Zone
// //               </th>

// //               <th className="py-3">
// //                 Battery
// //               </th>

// //               <th className="py-3">
// //                 Health
// //               </th>

// //               <th className="py-3">
// //                 Trips
// //               </th>

// //               <th className="py-3 text-right">
// //                 Risk
// //               </th>

// //             </tr>

// //           </thead>


// //           <tbody>

// //             {rows.map(
// //               (row) => (

// //                 <tr
// //                   key={
// //                     row.scooter_id
// //                   }
// //                   className="border-t border-white/[0.06]"
// //                 >

// //                   <td className="py-3 font-mono text-xs text-gray-300">
// //                     {
// //                       row.scooter_id
// //                     }
// //                   </td>

// //                   <td className="py-3 text-xs text-gray-500">
// //                     {
// //                       shortZone(
// //                         row.zone
// //                       )
// //                     }
// //                   </td>

// //                   <td className="py-3 font-mono text-xs text-gray-400">
// //                     {
// //                       row.battery
// //                     }%
// //                   </td>

// //                   <td className="py-3 font-mono text-xs text-gray-400">
// //                     {
// //                       row.health_score
// //                     }%
// //                   </td>

// //                   <td className="py-3 font-mono text-xs text-gray-400">
// //                     {
// //                       row.trips_today
// //                     }
// //                   </td>

// //                   <td className="py-3 text-right">

// //                     <span
// //                       className={
// //                         row.risk >= 0.8
// //                           ? "font-mono text-xs text-red-400"
// //                           : "font-mono text-xs text-amber-400"
// //                       }
// //                     >
// //                       {(
// //                         row.risk *
// //                         100
// //                       ).toFixed(0)}
// //                       %
// //                     </span>

// //                   </td>

// //                 </tr>

// //               )
// //             )}

// //           </tbody>

// //         </table>

// //       </div>

// //     </div>
// //   );
// // }


// // /* ============================================================
// //    CHARGING
// // ============================================================ */

// // function ChargingResult({
// //   data,
// // }) {

// //   const rows =
// //     Array.isArray(data)
// //       ? data
// //       : [];

// //   return (

// //     <CompactList
// //       icon={
// //         <Battery size={14} />
// //       }
// //       label="Charging priority"
// //       rows={rows}
// //       columns={[
// //         ["scooter_id", "Vehicle"],
// //         ["zone", "Zone"],
// //         ["battery", "Battery"],
// //         ["priority", "Priority"],
// //       ]}
// //       formatter={{
// //         battery: value =>
// //           `${value}%`,
// //       }}
// //     />

// //   );
// // }


// // /* ============================================================
// //    MAINTENANCE
// // ============================================================ */

// // function MaintenanceResult({
// //   data,
// // }) {

// //   const rows =
// //     Array.isArray(data)
// //       ? data
// //       : [];

// //   return (

// //     <CompactList
// //       icon={
// //         <Wrench size={14} />
// //       }
// //       label="Maintenance queue"
// //       rows={rows}
// //       columns={[
// //         ["scooter_id", "Vehicle"],
// //         ["zone", "Zone"],
// //         ["health_score", "Health"],
// //         ["age_months", "Age"],
// //         ["risk", "Risk"],
// //       ]}
// //       formatter={{
// //         health_score: value =>
// //           `${value}%`,

// //         age_months: value =>
// //           `${value} mo`,

// //         risk: value =>
// //           `${(
// //             value * 100
// //           ).toFixed(0)}%`,
// //       }}
// //     />

// //   );
// // }


// // /* ============================================================
// //    FLEET
// // ============================================================ */

// // function FleetResult({
// //   data,
// // }) {

// //   const fleet =
// //     data || {};

// //   return (

// //     <div className="mt-7 grid max-w-3xl grid-cols-2 border-y border-white/10 md:grid-cols-3">

// //       <Stat
// //         label="Vehicles"
// //         value={
// //           fleet.total_scooters ??
// //           25
// //         }
// //       />

// //       <Stat
// //         label="Zones"
// //         value={
// //           fleet.zones ??
// //           5
// //         }
// //       />

// //       <Stat
// //         label="Avg battery"
// //         value={`${fleet.average_battery ?? 58.32}%`}
// //       />

// //       <Stat
// //         label="Avg health"
// //         value={`${fleet.average_health ?? 82.88}%`}
// //       />

// //       <Stat
// //         label="Low battery"
// //         value={
// //           fleet.low_battery_scooters ??
// //           10
// //         }
// //       />

// //       <Stat
// //         label="High risk"
// //         value={
// //           fleet.high_risk_scooters ??
// //           6
// //         }
// //       />

// //     </div>
// //   );
// // }


// // /* ============================================================
// //    DEMAND
// // ============================================================ */

// // function DemandResult({
// //   result,
// // }) {

// //   return (

// //     <div className="mt-7 max-w-3xl border-y border-white/10">

// //       <div className="grid grid-cols-3">

// //         <Stat
// //           label="Zone"
// //           value={
// //             shortZone(
// //               result.zone
// //             )
// //           }
// //         />

// //         <Stat
// //           label="Forecast"
// //           value={`${result.hour ?? 17}:00`}
// //         />

// //         <Stat
// //           label="Demand"
// //           value={
// //             typeof result.data ===
// //             "number"
// //               ? Math.round(
// //                   result.data
// //                 ).toLocaleString()
// //               : result.data
// //           }
// //         />

// //       </div>

// //     </div>
// //   );
// // }


// // /* ============================================================
// //    DEMAND COMPARISON
// // ============================================================ */

// // function DemandComparison({
// //   data,
// // }) {

// //   const rows =
// //     Array.isArray(data)
// //       ? data
// //       : [];

// //   return (

// //     <div className="mt-7 max-w-3xl border-y border-white/10">

// //       {rows.map(
// //         (row, index) => (

// //           <div
// //             key={row.zone}
// //             className="flex items-center justify-between border-b border-white/[0.06] py-4 last:border-b-0"
// //           >

// //             <div>

// //               <div className="text-xs text-gray-300">
// //                 {
// //                   row.display_zone
// //                 }
// //               </div>

// //               <div className="mt-1 text-[10px] text-gray-700">
// //                 {row.scooters} scooters
// //               </div>

// //             </div>

// //             <div className="font-mono text-sm text-gray-300">
// //               {Math.round(
// //                 row.predicted_demand
// //               ).toLocaleString()}
// //             </div>

// //           </div>

// //         )
// //       )}

// //     </div>
// //   );
// // }


// // /* ============================================================
// //    ZONE COMPARISON
// // ============================================================ */

// // function ZoneComparison({
// //   data,
// // }) {

// //   const rows =
// //     Array.isArray(data)
// //       ? data
// //       : [];

// //   return (

// //     <div className="mt-7 max-w-3xl">

// //       <div className="grid gap-3 md:grid-cols-2">

// //         {rows.map(
// //           (row) => (

// //             <div
// //               key={row.zone}
// //               className="border border-white/10 p-5"
// //             >

// //               <div className="text-[10px] uppercase tracking-[0.14em] text-gray-600">
// //                 {row.display_zone}
// //               </div>

// //               <div className="mt-4 font-mono text-xl text-gray-200">
// //                 {Math.round(
// //                   row.predicted_demand
// //                 ).toLocaleString()}
// //               </div>

// //               <div className="mt-2 text-[10px] text-gray-700">
// //                 predicted demand ·{" "}
// //                 {row.scooters} scooters
// //               </div>

// //             </div>

// //           )
// //         )}

// //       </div>

// //     </div>
// //   );
// // }


// // /* ============================================================
// //    FINANCIAL
// // ============================================================ */

// // function FinancialResult({
// //   result,
// // }) {

// //   const data =
// //     result.data || {};

// //   return (

// //     <div className="mt-7 max-w-3xl">

// //       <div className="grid grid-cols-2 border-y border-white/10 md:grid-cols-4">

// //         <Stat
// //           label="Scooters"
// //           value={
// //             data.scooters ??
// //             data.scooters_to_move ??
// //             "—"
// //           }
// //         />

// //         <Stat
// //           label="Trips"
// //           value={
// //             data.trips ??
// //             data.expected_trips ??
// //             "—"
// //           }
// //         />

// //         <Stat
// //           label="Revenue"
// //           value={
// //             data.revenue !== undefined
// //               ? `₹${Math.round(
// //                   data.revenue
// //                 ).toLocaleString()}`
// //               : "—"
// //           }
// //         />

// //         <Stat
// //           label="Margin"
// //           value={
// //             data.margin !== undefined
// //               ? `₹${Math.round(
// //                   data.margin
// //                 ).toLocaleString()}`
// //               : data.contribution_margin !== undefined
// //                 ? `₹${Math.round(
// //                     data.contribution_margin
// //                   ).toLocaleString()}`
// //                 : "—"
// //           }
// //         />

// //       </div>

// //       {result.comparison && (

// //         <div className="mt-6">

// //           <div className="mb-3 text-[9px] uppercase tracking-[0.16em] text-gray-700">
// //             Deployment levels
// //           </div>

// //           <div className="flex h-20 items-end gap-1">

// //             {result.comparison.map(
// //               (item) => {

// //                 const height =
// //                   Math.max(
// //                     5,
// //                     (item.margin /
// //                       3000) *
// //                       100
// //                   );

// //                 const optimal =
// //                   item.margin ===
// //                   Math.max(
// //                     ...result.comparison.map(
// //                       x => x.margin
// //                     )
// //                   );

// //                 return (

// //                   <div
// //                     key={
// //                       item.scooters
// //                     }
// //                     className="flex h-full flex-1 items-end"
// //                   >

// //                     <div
// //                       className={
// //                         optimal
// //                           ? "w-full bg-gray-200"
// //                           : "w-full bg-gray-700"
// //                       }
// //                       style={{
// //                         height:
// //                           `${height}%`,
// //                       }}
// //                       title={`${item.scooters} scooters: ₹${Math.round(item.margin)}`}
// //                     />

// //                   </div>
// //                 );
// //               }
// //             )}

// //           </div>

// //           <div className="mt-2 flex justify-between text-[8px] text-gray-700">
// //             <span>0</span>
// //             <span>10 scooters</span>
// //           </div>

// //         </div>

// //       )}

// //     </div>
// //   );
// // }


// // /* ============================================================
// //    GENERIC TABLE
// // ============================================================ */

// // function GenericTable({
// //   rows,
// // }) {

// //   if (!rows.length) {
// //     return null;
// //   }

// //   const keys =
// //     Object.keys(
// //       rows[0]
// //     ).slice(0, 6);

// //   return (

// //     <div className="mt-7 overflow-x-auto border-y border-white/10">

// //       <table className="w-full">

// //         <thead>

// //           <tr className="text-left text-[9px] uppercase tracking-[0.14em] text-gray-700">

// //             {keys.map(
// //               key => (

// //                 <th
// //                   key={key}
// //                   className="py-3"
// //                 >
// //                   {formatKey(key)}
// //                 </th>

// //               )
// //             )}

// //           </tr>

// //         </thead>

// //         <tbody>

// //           {rows.map(
// //             (row, index) => (

// //               <tr
// //                 key={index}
// //                 className="border-t border-white/[0.06]"
// //               >

// //                 {keys.map(
// //                   key => (

// //                     <td
// //                       key={key}
// //                       className="py-3 text-xs text-gray-400"
// //                     >
// //                       {
// //                         formatValue(
// //                           row[key]
// //                         )
// //                       }
// //                     </td>

// //                   )
// //                 )}

// //               </tr>

// //             )
// //           )}

// //         </tbody>

// //       </table>

// //     </div>
// //   );
// // }


// // /* ============================================================
// //    COMPACT LIST
// // ============================================================ */

// // function CompactList({
// //   icon,
// //   label,
// //   rows,
// //   columns,
// //   formatter = {},
// // }) {

// //   return (

// //     <div className="mt-7 max-w-3xl">

// //       <div className="mb-4 flex items-center gap-3">

// //         {icon}

// //         <span className="text-[10px] uppercase tracking-[0.16em] text-gray-600">
// //           {label}
// //         </span>

// //         <span className="font-mono text-[10px] text-gray-700">
// //           {rows.length}
// //         </span>

// //       </div>


// //       <div className="overflow-x-auto border-y border-white/10">

// //         <table className="w-full">

// //           <thead>

// //             <tr className="text-left text-[9px] uppercase tracking-[0.14em] text-gray-700">

// //               {columns.map(
// //                 ([key, title]) => (

// //                   <th
// //                     key={key}
// //                     className="py-3"
// //                   >
// //                     {title}
// //                   </th>

// //                 )
// //               )}

// //             </tr>

// //           </thead>


// //           <tbody>

// //             {rows.map(
// //               (row, index) => (

// //                 <tr
// //                   key={
// //                     row.scooter_id ??
// //                     index
// //                   }
// //                   className="border-t border-white/[0.06]"
// //                 >

// //                   {columns.map(
// //                     ([key]) => (

// //                       <td
// //                         key={key}
// //                         className="py-3 text-xs text-gray-400"
// //                       >

// //                         {formatter[key]
// //                           ? formatter[key](
// //                               row[key]
// //                             )
// //                           : shortZone(
// //                               row[key]
// //                             )}

// //                       </td>

// //                     )
// //                   )}

// //                 </tr>

// //               )
// //             )}

// //           </tbody>

// //         </table>

// //       </div>

// //     </div>
// //   );
// // }


// // /* ============================================================
// //    STAT
// // ============================================================ */

// // function Stat({
// //   label,
// //   value,
// // }) {

// //   return (

// //     <div className="border-r border-white/[0.06] px-4 py-4 last:border-r-0">

// //       <div className="text-[9px] uppercase tracking-[0.14em] text-gray-700">
// //         {label}
// //       </div>

// //       <div className="mt-2 font-mono text-sm text-gray-300">
// //         {value}
// //       </div>

// //     </div>
// //   );
// // }


// // /* ============================================================
// //    SUGGESTION
// // ============================================================ */

// // function Suggestion({
// //   text,
// //   onClick,
// // }) {

// //   return (

// //     <button
// //       onClick={onClick}
// //       className="group flex items-center justify-between border border-white/[0.08] px-4 py-4 text-left transition hover:border-white/20 hover:bg-white/[0.02]"
// //     >

// //       <span className="text-xs text-gray-500 group-hover:text-gray-300">
// //         {text}
// //       </span>

// //       <ChevronRight
// //         size={13}
// //         className="text-gray-700 group-hover:text-gray-400"
// //       />

// //     </button>
// //   );
// // }


// // /* ============================================================
// //    FORMATTERS
// // ============================================================ */

// // function formatKey(key) {

// //   return key
// //     .replaceAll(
// //       "_",
// //       " "
// //     )
// //     .replace(
// //       /\b\w/g,
// //       letter =>
// //         letter.toUpperCase()
// //     );
// // }


// // function formatValue(value) {

// //   if (
// //     value === null ||
// //     value === undefined
// //   ) {
// //     return "—";
// //   }

// //   if (
// //     typeof value ===
// //     "number"
// //   ) {

// //     return Number.isInteger(
// //       value
// //     )
// //       ? value.toLocaleString()
// //       : value.toFixed(2);
// //   }

// //   return String(value);
// // }


// // function shortZone(zone) {

// //   if (!zone) {
// //     return "—";
// //   }

// //   const value =
// //     String(zone);

// //   if (
// //     value.includes(
// //       "Nadaprabhu"
// //     )
// //   ) {
// //     return "Majestic";
// //   }

// //   if (
// //     value ===
// //     "Mahatma Gandhi Road"
// //   ) {
// //     return "MG Road";
// //   }

// //   if (
// //     value ===
// //     "Krishnarajapura"
// //   ) {
// //     return "KR Puram";
// //   }

// //   return value;
// // }

// import React, { useState } from "react";

// import {
//   ArrowUp,
//   RefreshCw,
//   AlertTriangle,
//   Battery,
//   Wrench,
//   ChevronRight,
// } from "lucide-react";

// const API = "http://127.0.0.1:8000";

// export default function CommandCenter() {

//   const [question, setQuestion] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   async function submit(e) {

//     e.preventDefault();

//     const text = question.trim();

//     if (!text || loading) return;

//     setLoading(true);

//     try {

//       const response = await fetch(
//         `${API}/api/ask`,
//         {
//           method: "POST",

//           headers: {
//             "Content-Type":
//               "application/json",
//           },

//           body: JSON.stringify({
//             message: text,
//           }),
//         }
//       );

//       const result =
//         await response.json();

//       console.log(
//         "FleetMind:",
//         result
//       );

//       setMessages(
//         previous => [
//           ...previous,
//           {
//             question: text,
//             result,
//           },
//         ]
//       );

//       setQuestion("");

//     } catch (error) {

//       setMessages(
//         previous => [
//           ...previous,
//           {
//             question: text,
//             result: {
//               type: "error",
//               answer:
//                 "FleetMind could not connect to the operating service.",
//               error:
//                 error.message,
//             },
//           },
//         ]
//       );

//     } finally {

//       setLoading(false);

//     }
//   }


//   return (

//     <div className="min-h-screen bg-[#05070b] text-slate-100">

//       <main className="mx-auto max-w-[1160px] px-6 py-7 lg:px-10">


//         {/* ==================================================
//             TOP BAR
//         ================================================== */}

//         <header className="flex items-center">

//           <div className="flex items-center gap-3">

//             <div className="flex h-8 w-8 items-center justify-center rounded-md border border-blue-400/30 bg-blue-500/10">
//               <div className="h-2.5 w-2.5 rounded-sm bg-blue-400" />
//             </div>

//             <div>
//               <div className="text-sm font-semibold tracking-[0.12em] text-slate-100">
//                 FLEETMIND
//               </div>
//               <div className="mt-0.5 text-xs text-slate-500">
//                 Fleet decision system
//               </div>
//             </div>

//           </div>

//         </header>


//         {/* ==================================================
//             PAGE TITLE
//         ================================================== */}

//         <div className="mt-16">

//           <div className="text-xs font-medium text-blue-400">
//             Fleet operations
//           </div>

//           <h1 className="mt-2 text-4xl font-medium tracking-[-0.03em] text-slate-100">
//             Command center
//           </h1>

//           <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
//             Ask about demand, vehicle condition, charging priorities,
//             or the financial impact of moving vehicles across the fleet.
//           </p>

//         </div>


//         {/* ==================================================
//             EMPTY STATE
//         ================================================== */}

//         {messages.length === 0 && (

//           <div className="mt-12">

//             <div className="border-y border-slate-800 py-7">

//               <div className="text-sm font-medium text-slate-300">
//                 Start with a question
//               </div>


//               <div className="mt-5 grid gap-3 md:grid-cols-2">

//                 <Suggestion
//                   text="Which scooter is most likely to fail?"
//                   onClick={() =>
//                     setQuestion(
//                       "Which scooter is most likely to fail?"
//                     )
//                   }
//                 />

//                 <Suggestion
//                   text="Where is demand highest?"
//                   onClick={() =>
//                     setQuestion(
//                       "Where is demand highest?"
//                     )
//                   }
//                 />

//                 <Suggestion
//                   text="Which scooters should I charge first?"
//                   onClick={() =>
//                     setQuestion(
//                       "Which scooters should I charge first?"
//                     )
//                   }
//                 />

//                 <Suggestion
//                   text="What happens if I move 8 scooters?"
//                   onClick={() =>
//                     setQuestion(
//                       "What happens if I move 8 scooters?"
//                     )
//                   }
//                 />

//               </div>

//             </div>

//           </div>
//         )}


//         {/* ==================================================
//             CONVERSATION
//         ================================================== */}

//         <div className="mt-10 space-y-12">

//           {messages.map(
//             (message, index) => (

//               <Conversation
//                 key={index}
//                 question={
//                   message.question
//                 }
//                 result={
//                   message.result
//                 }
//               />

//             )
//           )}

//         </div>


//         {/* ==================================================
//             INPUT
//         ================================================== */}

//         <div
//           className={
//             messages.length
//               ? "mt-12"
//               : "mt-10"
//           }
//         >

//           <form
//             onSubmit={submit}
//             className="relative"
//           >

//             <div className="flex items-center border-b border-white/15 pb-3 transition focus-within:border-white/40">

//               <input
//                 value={question}
//                 onChange={(e) =>
//                   setQuestion(
//                     e.target.value
//                   )
//                 }
//                 placeholder="Ask about the fleet..."
//                 className="flex-1 bg-transparent px-1 py-3 text-base text-slate-200 outline-none placeholder:text-slate-600"
//               />

//               <button
//                 type="submit"
//                 disabled={
//                   !question.trim() ||
//                   loading
//                 }
//                 className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-800 bg-slate-950 text-slate-500 transition hover:border-blue-400/40 hover:text-blue-300 disabled:opacity-20"
//               >

//                 {loading ? (

//                   <RefreshCw
//                     size={15}
//                     className="animate-spin"
//                   />

//                 ) : (

//                   <ArrowUp size={16} />

//                 )}

//               </button>

//             </div>

//           </form>


//           <div className="mt-3 flex justify-between text-xs text-slate-700">

//             <span>
//               Natural language
//             </span>

//             <span>
//               Enter to submit
//             </span>

//           </div>

//         </div>

//       </main>

//     </div>
//   );
// }


// /* ============================================================
//    CONVERSATION
// ============================================================ */

// function Conversation({
//   question,
//   result,
// }) {

//   return (

//     <section>

//       {/* USER QUESTION */}

//       <div className="flex gap-5">

//         <div className="w-16 shrink-0 pt-1 text-xs font-medium text-slate-600">
//           You
//         </div>

//         <div className="text-base leading-7 text-slate-300">
//           {question}
//         </div>

//       </div>


//       {/* AGENT */}

//       <div className="mt-8 flex gap-5">

//         <div className="w-16 shrink-0 pt-1 text-xs font-medium text-slate-600">
//           FleetMind
//         </div>


//         <div className="min-w-0 flex-1">

//           <div className="max-w-3xl text-[15px] leading-7 text-slate-400">

//             {result?.answer}

//           </div>


//           {result?.error && (

//             <div className="mt-5 border-l border-red-500/50 pl-4 text-xs text-red-400">
//               {result.error}
//             </div>

//           )}


//           <Response
//             result={result}
//           />

//         </div>

//       </div>

//     </section>
//   );
// }


// /* ============================================================
//    RESPONSE ROUTER
// ============================================================ */

// function Response({
//   result,
// }) {

//   if (!result) return null;


//   if (
//     result.type ===
//     "risk_analysis"
//   ) {

//     return (
//       <RiskResult
//         data={result.data}
//       />
//     );
//   }


//   if (
//     result.type ===
//     "charging_recommendation"
//   ) {

//     return (
//       <ChargingResult
//         data={result.data}
//       />
//     );
//   }


//   if (
//     result.type ===
//     "maintenance_recommendation"
//   ) {

//     return (
//       <MaintenanceResult
//         data={result.data}
//       />
//     );
//   }


//   if (
//     result.type ===
//     "fleet_status"
//   ) {

//     return (
//       <FleetResult
//         data={result.data}
//       />
//     );
//   }


//   if (
//     result.type ===
//     "demand_forecast"
//   ) {

//     return (
//       <DemandResult
//         result={result}
//       />
//     );
//   }


//   if (
//     result.type ===
//     "demand_comparison"
//   ) {

//     return (
//       <DemandComparison
//         data={result.data}
//       />
//     );
//   }


//   if (
//     result.type ===
//     "zone_comparison"
//   ) {

//     return (
//       <ZoneComparison
//         data={result.data}
//       />
//     );
//   }


//   if (
//     result.type ===
//     "financial_simulation"
//     ||
//     result.type ===
//     "financial_optimization"
//     ||
//     result.type ===
//     "recommendation"
//   ) {

//     return (
//       <FinancialResult
//         result={result}
//       />
//     );
//   }


//   if (
//     Array.isArray(
//       result.data
//     )
//   ) {

//     return (
//       <GenericTable
//         rows={
//           result.data
//         }
//       />
//     );
//   }


//   return null;
// }


// /* ============================================================
//    RISK
// ============================================================ */

// function RiskResult({
//   data,
// }) {

//   const rows =
//     Array.isArray(data)
//       ? data
//       : [];

//   return (

//     <div className="mt-7">

//       <div className="mb-4 flex items-center gap-3">

//         <AlertTriangle
//           size={14}
//           className="text-slate-500"
//         />

//         <span className="text-sm font-medium text-slate-400">
//           Risk register
//         </span>

//         <span className="font-mono text-xs text-slate-600">
//           {rows.length} vehicles
//         </span>

//       </div>


//       <div className="overflow-hidden border-y border-slate-800">

//         <table className="w-full">

//           <thead>

//             <tr className="text-left text-[9px] uppercase tracking-[0.14em] text-slate-700">

//               <th className="py-3">
//                 Vehicle
//               </th>

//               <th className="py-3">
//                 Zone
//               </th>

//               <th className="py-3">
//                 Battery
//               </th>

//               <th className="py-3">
//                 Health
//               </th>

//               <th className="py-3">
//                 Trips
//               </th>

//               <th className="py-3 text-right">
//                 Risk
//               </th>

//             </tr>

//           </thead>


//           <tbody>

//             {rows.map(
//               (row) => (

//                 <tr
//                   key={
//                     row.scooter_id
//                   }
//                   className="border-t border-slate-800/70"
//                 >

//                   <td className="py-3 font-mono text-xs text-slate-300">
//                     {
//                       row.scooter_id
//                     }
//                   </td>

//                   <td className="py-3 text-xs text-slate-500">
//                     {
//                       shortZone(
//                         row.zone
//                       )
//                     }
//                   </td>

//                   <td className="py-3 font-mono text-xs text-slate-400">
//                     {
//                       row.battery
//                     }%
//                   </td>

//                   <td className="py-3 font-mono text-xs text-slate-400">
//                     {
//                       row.health_score
//                     }%
//                   </td>

//                   <td className="py-3 font-mono text-xs text-slate-400">
//                     {
//                       row.trips_today
//                     }
//                   </td>

//                   <td className="py-3 text-right">

//                     <span
//                       className={
//                         row.risk >= 0.8
//                           ? "font-mono text-xs text-red-400"
//                           : "font-mono text-xs text-amber-400"
//                       }
//                     >
//                       {(
//                         row.risk *
//                         100
//                       ).toFixed(0)}
//                       %
//                     </span>

//                   </td>

//                 </tr>

//               )
//             )}

//           </tbody>

//         </table>

//       </div>

//     </div>
//   );
// }


// /* ============================================================
//    CHARGING
// ============================================================ */

// function ChargingResult({
//   data,
// }) {

//   const rows =
//     Array.isArray(data)
//       ? data
//       : [];

//   return (

//     <CompactList
//       icon={
//         <Battery size={14} />
//       }
//       label="Charging priority"
//       rows={rows}
//       columns={[
//         ["scooter_id", "Vehicle"],
//         ["zone", "Zone"],
//         ["battery", "Battery"],
//         ["priority", "Priority"],
//       ]}
//       formatter={{
//         battery: value =>
//           `${value}%`,
//       }}
//     />

//   );
// }


// /* ============================================================
//    MAINTENANCE
// ============================================================ */

// function MaintenanceResult({
//   data,
// }) {

//   const rows =
//     Array.isArray(data)
//       ? data
//       : [];

//   return (

//     <CompactList
//       icon={
//         <Wrench size={14} />
//       }
//       label="Maintenance queue"
//       rows={rows}
//       columns={[
//         ["scooter_id", "Vehicle"],
//         ["zone", "Zone"],
//         ["health_score", "Health"],
//         ["age_months", "Age"],
//         ["risk", "Risk"],
//       ]}
//       formatter={{
//         health_score: value =>
//           `${value}%`,

//         age_months: value =>
//           `${value} mo`,

//         risk: value =>
//           `${(
//             value * 100
//           ).toFixed(0)}%`,
//       }}
//     />

//   );
// }


// /* ============================================================
//    FLEET
// ============================================================ */

// function FleetResult({
//   data,
// }) {

//   const fleet =
//     data || {};

//   return (

//     <div className="mt-7 grid max-w-3xl grid-cols-2 border-y border-slate-800 md:grid-cols-3">

//       <Stat
//         label="Vehicles"
//         value={
//           fleet.total_scooters ??
//           25
//         }
//       />

//       <Stat
//         label="Zones"
//         value={
//           fleet.zones ??
//           5
//         }
//       />

//       <Stat
//         label="Avg battery"
//         value={`${fleet.average_battery ?? 58.32}%`}
//       />

//       <Stat
//         label="Avg health"
//         value={`${fleet.average_health ?? 82.88}%`}
//       />

//       <Stat
//         label="Low battery"
//         value={
//           fleet.low_battery_scooters ??
//           10
//         }
//       />

//       <Stat
//         label="High risk"
//         value={
//           fleet.high_risk_scooters ??
//           6
//         }
//       />

//     </div>
//   );
// }


// /* ============================================================
//    DEMAND
// ============================================================ */

// function DemandResult({
//   result,
// }) {

//   return (

//     <div className="mt-7 max-w-3xl border-y border-slate-800">

//       <div className="grid grid-cols-3">

//         <Stat
//           label="Zone"
//           value={
//             shortZone(
//               result.zone
//             )
//           }
//         />

//         <Stat
//           label="Forecast"
//           value={`${result.hour ?? 17}:00`}
//         />

//         <Stat
//           label="Demand"
//           value={
//             typeof result.data ===
//             "number"
//               ? Math.round(
//                   result.data
//                 ).toLocaleString()
//               : result.data
//           }
//         />

//       </div>

//     </div>
//   );
// }


// /* ============================================================
//    DEMAND COMPARISON
// ============================================================ */

// function DemandComparison({
//   data,
// }) {

//   const rows =
//     Array.isArray(data)
//       ? data
//       : [];

//   return (

//     <div className="mt-7 max-w-3xl border-y border-slate-800">

//       {rows.map(
//         (row, index) => (

//           <div
//             key={row.zone}
//             className="flex items-center justify-between border-b border-slate-800/70 py-4 last:border-b-0"
//           >

//             <div>

//               <div className="text-xs text-slate-300">
//                 {
//                   row.display_zone
//                 }
//               </div>

//               <div className="mt-1 text-xs text-slate-600">
//                 {row.scooters} scooters
//               </div>

//             </div>

//             <div className="font-mono text-sm text-slate-300">
//               {Math.round(
//                 row.predicted_demand
//               ).toLocaleString()}
//             </div>

//           </div>

//         )
//       )}

//     </div>
//   );
// }


// /* ============================================================
//    ZONE COMPARISON
// ============================================================ */

// function ZoneComparison({
//   data,
// }) {

//   const rows =
//     Array.isArray(data)
//       ? data
//       : [];

//   return (

//     <div className="mt-7 max-w-3xl">

//       <div className="grid gap-3 md:grid-cols-2">

//         {rows.map(
//           (row) => (

//             <div
//               key={row.zone}
//               className="border border-slate-800 p-5"
//             >

//               <div className="text-xs font-medium text-slate-500">
//                 {row.display_zone}
//               </div>

//               <div className="mt-4 font-mono text-xl text-gray-200">
//                 {Math.round(
//                   row.predicted_demand
//                 ).toLocaleString()}
//               </div>

//               <div className="mt-2 text-xs text-slate-600">
//                 predicted demand ·{" "}
//                 {row.scooters} scooters
//               </div>

//             </div>

//           )
//         )}

//       </div>

//     </div>
//   );
// }


// /* ============================================================
//    FINANCIAL
// ============================================================ */

// function FinancialResult({
//   result,
// }) {

//   const data =
//     result.data || {};

//   return (

//     <div className="mt-7 max-w-3xl">

//       <div className="grid grid-cols-2 border-y border-slate-800 md:grid-cols-4">

//         <Stat
//           label="Scooters"
//           value={
//             data.scooters ??
//             data.scooters_to_move ??
//             "—"
//           }
//         />

//         <Stat
//           label="Trips"
//           value={
//             data.trips ??
//             data.expected_trips ??
//             "—"
//           }
//         />

//         <Stat
//           label="Revenue"
//           value={
//             data.revenue !== undefined
//               ? `₹${Math.round(
//                   data.revenue
//                 ).toLocaleString()}`
//               : "—"
//           }
//         />

//         <Stat
//           label="Margin"
//           value={
//             data.margin !== undefined
//               ? `₹${Math.round(
//                   data.margin
//                 ).toLocaleString()}`
//               : data.contribution_margin !== undefined
//                 ? `₹${Math.round(
//                     data.contribution_margin
//                   ).toLocaleString()}`
//                 : "—"
//           }
//         />

//       </div>

//       {result.comparison && (

//         <div className="mt-6">

//           <div className="mb-3 text-[9px] uppercase tracking-[0.16em] text-slate-700">
//             Deployment levels
//           </div>

//           <div className="flex h-20 items-end gap-1">

//             {result.comparison.map(
//               (item) => {

//                 const height =
//                   Math.max(
//                     5,
//                     (item.margin /
//                       3000) *
//                       100
//                   );

//                 const optimal =
//                   item.margin ===
//                   Math.max(
//                     ...result.comparison.map(
//                       x => x.margin
//                     )
//                   );

//                 return (

//                   <div
//                     key={
//                       item.scooters
//                     }
//                     className="flex h-full flex-1 items-end"
//                   >

//                     <div
//                       className={
//                         optimal
//                           ? "w-full bg-gray-200"
//                           : "w-full bg-gray-700"
//                       }
//                       style={{
//                         height:
//                           `${height}%`,
//                       }}
//                       title={`${item.scooters} scooters: ₹${Math.round(item.margin)}`}
//                     />

//                   </div>
//                 );
//               }
//             )}

//           </div>

//           <div className="mt-2 flex justify-between text-[8px] text-slate-700">
//             <span>0</span>
//             <span>10 scooters</span>
//           </div>

//         </div>

//       )}

//     </div>
//   );
// }


// /* ============================================================
//    GENERIC TABLE
// ============================================================ */

// function GenericTable({
//   rows,
// }) {

//   if (!rows.length) {
//     return null;
//   }

//   const keys =
//     Object.keys(
//       rows[0]
//     ).slice(0, 6);

//   return (

//     <div className="mt-7 overflow-x-auto border-y border-slate-800">

//       <table className="w-full">

//         <thead>

//           <tr className="text-left text-[9px] uppercase tracking-[0.14em] text-slate-700">

//             {keys.map(
//               key => (

//                 <th
//                   key={key}
//                   className="py-3"
//                 >
//                   {formatKey(key)}
//                 </th>

//               )
//             )}

//           </tr>

//         </thead>

//         <tbody>

//           {rows.map(
//             (row, index) => (

//               <tr
//                 key={index}
//                 className="border-t border-slate-800/70"
//               >

//                 {keys.map(
//                   key => (

//                     <td
//                       key={key}
//                       className="py-3 text-xs text-slate-400"
//                     >
//                       {
//                         formatValue(
//                           row[key]
//                         )
//                       }
//                     </td>

//                   )
//                 )}

//               </tr>

//             )
//           )}

//         </tbody>

//       </table>

//     </div>
//   );
// }


// /* ============================================================
//    COMPACT LIST
// ============================================================ */

// function CompactList({
//   icon,
//   label,
//   rows,
//   columns,
//   formatter = {},
// }) {

//   return (

//     <div className="mt-7 max-w-3xl">

//       <div className="mb-4 flex items-center gap-3">

//         {icon}

//         <span className="text-sm font-medium text-slate-400">
//           {label}
//         </span>

//         <span className="font-mono text-xs text-slate-600">
//           {rows.length}
//         </span>

//       </div>


//       <div className="overflow-x-auto border-y border-slate-800">

//         <table className="w-full">

//           <thead>

//             <tr className="text-left text-[9px] uppercase tracking-[0.14em] text-slate-700">

//               {columns.map(
//                 ([key, title]) => (

//                   <th
//                     key={key}
//                     className="py-3"
//                   >
//                     {title}
//                   </th>

//                 )
//               )}

//             </tr>

//           </thead>


//           <tbody>

//             {rows.map(
//               (row, index) => (

//                 <tr
//                   key={
//                     row.scooter_id ??
//                     index
//                   }
//                   className="border-t border-slate-800/70"
//                 >

//                   {columns.map(
//                     ([key]) => (

//                       <td
//                         key={key}
//                         className="py-3 text-xs text-slate-400"
//                       >

//                         {formatter[key]
//                           ? formatter[key](
//                               row[key]
//                             )
//                           : shortZone(
//                               row[key]
//                             )}

//                       </td>

//                     )
//                   )}

//                 </tr>

//               )
//             )}

//           </tbody>

//         </table>

//       </div>

//     </div>
//   );
// }


// /* ============================================================
//    STAT
// ============================================================ */

// function Stat({
//   label,
//   value,
// }) {

//   return (

//     <div className="border-r border-slate-800/70 px-4 py-4 last:border-r-0">

//       <div className="text-[9px] uppercase tracking-[0.14em] text-slate-700">
//         {label}
//       </div>

//       <div className="mt-2 font-mono text-sm text-slate-300">
//         {value}
//       </div>

//     </div>
//   );
// }


// /* ============================================================
//    SUGGESTION
// ============================================================ */

// function Suggestion({
//   text,
//   onClick,
// }) {

//   return (

//     <button
//       onClick={onClick}
//       className="group flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/40 px-5 py-4 text-left transition hover:border-blue-400/30 hover:bg-blue-500/[0.04]"
//     >

//       <span className="text-sm text-slate-400 group-hover:text-slate-200">
//         {text}
//       </span>

//       <ChevronRight
//         size={13}
//         className="text-slate-700 group-hover:text-blue-400"
//       />

//     </button>
//   );
// }


// /* ============================================================
//    FORMATTERS
// ============================================================ */

// function formatKey(key) {

//   return key
//     .replaceAll(
//       "_",
//       " "
//     )
//     .replace(
//       /\b\w/g,
//       letter =>
//         letter.toUpperCase()
//     );
// }


// function formatValue(value) {

//   if (
//     value === null ||
//     value === undefined
//   ) {
//     return "—";
//   }

//   if (
//     typeof value ===
//     "number"
//   ) {

//     return Number.isInteger(
//       value
//     )
//       ? value.toLocaleString()
//       : value.toFixed(2);
//   }

//   return String(value);
// }


// function shortZone(zone) {

//   if (!zone) {
//     return "—";
//   }

//   const value =
//     String(zone);

//   if (
//     value.includes(
//       "Nadaprabhu"
//     )
//   ) {
//     return "Majestic";
//   }

//   if (
//     value ===
//     "Mahatma Gandhi Road"
//   ) {
//     return "MG Road";
//   }

//   if (
//     value ===
//     "Krishnarajapura"
//   ) {
//     return "KR Puram";
//   }

//   return value;
// }

import React, { useState } from "react";

import {
  ArrowUp,
  RefreshCw,
  AlertTriangle,
  Battery,
  Wrench,
  ChevronRight,
} from "lucide-react";

const API = "http://127.0.0.1:8000";

export default function CommandCenter() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    const text = question.trim();

    if (!text || loading) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${API}/api/ask`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: text,
          }),
        }
      );

      const result = await response.json();

      console.log("FleetMind:", result);

      setMessages((previous) => [
        ...previous,
        {
          question: text,
          result,
        },
      ]);

      setQuestion("");
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          question: text,
          result: {
            type: "error",
            answer:
              "FleetMind could not connect to the operating service.",
            error: error.message,
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fffdf5] text-[#25220f]">

      <main className="mx-auto max-w-[1180px] px-6 py-7 lg:px-10">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5b700] shadow-[0_8px_24px_rgba(245,183,0,0.18)]">

              <div className="h-4 w-4 rotate-45 bg-white" />

            </div>

            <div>

              <div className="text-[17px] font-bold tracking-[-0.02em] text-[#24200f]">
                FLEETMIND
              </div>

              <div className="text-xs text-[#9a8b57]">
                Fleet decision intelligence
              </div>

            </div>

          </div>

          <div className="hidden text-sm text-[#9a8b57] md:block">
            Bengaluru fleet operations
          </div>

        </header>


        {/* ==================================================
            HERO
        ================================================== */}

        <section className="mt-14">

          <div className="max-w-3xl">

            <h1 className="text-[42px] font-semibold leading-[1.05] tracking-[-0.04em] text-[#211e10] md:text-[54px]">
              Make the next fleet decision.
            </h1>

            <p className="mt-5 max-w-2xl text-[17px] leading-7 text-[#756b49]">
              Ask FleetMind about demand, vehicle condition,
              charging, deployment or the financial impact
              of an operational decision.
            </p>

          </div>


          {/* ==================================================
              MAIN ASK PANEL
          ================================================== */}

          <div className="mt-10 max-w-[980px]">

            <form onSubmit={submit}>

              <div className="relative overflow-hidden rounded-2xl border border-[#e8c75e] bg-white shadow-[0_20px_60px_rgba(125,95,0,0.10)]">

                <div className="absolute left-0 top-0 h-1 w-full bg-[#f5b700]" />

                <div className="px-6 pb-5 pt-7 md:px-8 md:pt-8">

                  <div className="mb-5 flex items-center justify-between">

                    <div className="text-sm font-semibold text-[#514719]">
                      Ask about your fleet
                    </div>

                    <div className="text-xs text-[#aa9a65]">
                      Natural language
                    </div>

                  </div>


                  <div className="flex items-end gap-4">

                    <textarea
                      value={question}
                      onChange={(e) =>
                        setQuestion(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          !e.shiftKey
                        ) {
                          e.preventDefault();

                          if (
                            question.trim() &&
                            !loading
                          ) {
                            e.currentTarget.form.requestSubmit();
                          }
                        }
                      }}
                      rows={3}
                      placeholder="e.g. Which scooters should I move to Majestic?"
                      className="min-h-[100px] flex-1 resize-none bg-transparent text-[20px] leading-8 text-[#28230e] outline-none placeholder:text-[#c2b78e]"
                    />

                    <button
                      type="submit"
                      disabled={
                        !question.trim() ||
                        loading
                      }
                      className="mb-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f5b700] text-white shadow-[0_8px_20px_rgba(245,183,0,0.22)] transition hover:bg-[#e5a900] disabled:cursor-not-allowed disabled:opacity-30"
                    >

                      {loading ? (
                        <RefreshCw
                          size={18}
                          className="animate-spin"
                        />
                      ) : (
                        <ArrowUp size={19} />
                      )}

                    </button>

                  </div>

                </div>


                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#f1e8c8] bg-[#fffdf5] px-6 py-3 text-xs text-[#9a8b57] md:px-8">

                  <span>
                    Demand
                  </span>

                  <span>
                    Risk
                  </span>

                  <span>
                    Charging
                  </span>

                  <span>
                    Maintenance
                  </span>

                  <span>
                    Financial decisions
                  </span>

                </div>

              </div>

            </form>

          </div>

        </section>


        {/* ==================================================
            STARTING QUESTIONS
        ================================================== */}

        {messages.length === 0 && (

          <section className="mt-12 max-w-[980px]">

            <div className="mb-4 text-sm font-semibold text-[#514719]">
              Try a fleet question
            </div>

            <div className="grid overflow-hidden rounded-xl border border-[#eadfb9] bg-white md:grid-cols-2">

              <Suggestion
                text="Which scooter is most likely to fail?"
                onClick={() =>
                  setQuestion(
                    "Which scooter is most likely to fail?"
                  )
                }
              />

              <Suggestion
                text="Where is demand highest?"
                onClick={() =>
                  setQuestion(
                    "Where is demand highest?"
                  )
                }
              />

              <Suggestion
                text="Which scooters should I charge first?"
                onClick={() =>
                  setQuestion(
                    "Which scooters should I charge first?"
                  )
                }
              />

              <Suggestion
                text="What happens if I move 8 scooters?"
                onClick={() =>
                  setQuestion(
                    "What happens if I move 8 scooters?"
                  )
                }
              />

            </div>

          </section>

        )}


        {/* ==================================================
            CONVERSATION
        ================================================== */}

        <div className="mt-14 space-y-16">

          {messages.map(
            (message, index) => (

              <Conversation
                key={index}
                question={message.question}
                result={message.result}
              />

            )
          )}

        </div>


        {/* ==================================================
            FOLLOW-UP INPUT
        ================================================== */}

        {messages.length > 0 && (

          <div className="mt-14 max-w-[980px]">

            <form onSubmit={submit}>

              <div className="flex items-center rounded-xl border border-[#dfcf91] bg-white px-5 shadow-[0_8px_25px_rgba(100,75,0,0.06)] transition focus-within:border-[#e0aa00]">

                <input
                  value={question}
                  onChange={(e) =>
                    setQuestion(e.target.value)
                  }
                  placeholder="Ask another fleet question..."
                  className="h-14 flex-1 bg-transparent text-[16px] text-[#28230e] outline-none placeholder:text-[#b7aa80]"
                />

                <button
                  type="submit"
                  disabled={
                    !question.trim() ||
                    loading
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5b700] text-white transition hover:bg-[#e5a900] disabled:opacity-25"
                >

                  {loading ? (
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <ArrowUp size={17} />
                  )}

                </button>

              </div>

            </form>

          </div>

        )}

      </main>

    </div>
  );
}


/* ============================================================
   CONVERSATION
============================================================ */

function Conversation({
  question,
  result,
}) {

  return (

    <section className="max-w-[980px]">

      {/* USER */}

      <div className="mb-7">

        <div className="mb-2 text-xs font-semibold text-[#a18d45]">
          Your question
        </div>

        <div className="text-[20px] leading-8 text-[#332f1c]">
          {question}
        </div>

      </div>


      {/* FLEETMIND */}

      <div>

        <div className="mb-3 flex items-center gap-3">

          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#f5b700]">

            <div className="h-2.5 w-2.5 rotate-45 bg-white" />

          </div>

          <span className="text-sm font-bold text-[#3e371b]">
            FleetMind
          </span>

        </div>


        <div className="rounded-xl border border-[#eadfb9] bg-white p-6 shadow-[0_10px_35px_rgba(100,75,0,0.05)] md:p-7">

          <div className="max-w-4xl text-[16px] leading-7 text-[#625a3e]">

            {result?.answer}

          </div>


          {result?.error && (

            <div className="mt-5 border-l-4 border-[#f0b000] bg-[#fff9df] px-4 py-3 text-sm text-[#806718]">
              {result.error}
            </div>

          )}


          <Response result={result} />

        </div>

      </div>

    </section>
  );
}


/* ============================================================
   RESPONSE ROUTER
============================================================ */

function Response({ result }) {

  if (!result) return null;

  if (result.type === "risk_analysis") {
    return <RiskResult data={result.data} />;
  }

  if (result.type === "charging_recommendation") {
    return <ChargingResult data={result.data} />;
  }

  if (result.type === "maintenance_recommendation") {
    return <MaintenanceResult data={result.data} />;
  }

  if (result.type === "fleet_status") {
    return <FleetResult data={result.data} />;
  }

  if (result.type === "demand_forecast") {
    return <DemandResult result={result} />;
  }

  if (result.type === "demand_comparison") {
    return <DemandComparison data={result.data} />;
  }

  if (result.type === "zone_comparison") {
    return <ZoneComparison data={result.data} />;
  }

  if (
    result.type === "financial_simulation" ||
    result.type === "financial_optimization" ||
    result.type === "recommendation"
  ) {
    return <FinancialResult result={result} />;
  }

  if (Array.isArray(result.data)) {
    return <GenericTable rows={result.data} />;
  }

  return null;
}


/* ============================================================
   RISK
============================================================ */

function RiskResult({ data }) {

  const rows = Array.isArray(data) ? data : [];

  return (

    <div className="mt-7">

      <div className="mb-4 flex items-center gap-3">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fff5cc]">

          <AlertTriangle
            size={16}
            className="text-[#d99d00]"
          />

        </div>

        <div>

          <div className="text-sm font-semibold text-[#514719]">
            Vehicles requiring attention
          </div>

          <div className="text-xs text-[#a18d45]">
            {rows.length} vehicles above the risk threshold
          </div>

        </div>

      </div>


      <div className="overflow-hidden rounded-xl border border-[#eadfb9]">

        <table className="w-full">

          <thead>

            <tr className="bg-[#fffaf0] text-left text-xs font-semibold text-[#8c7b3f]">

              <th className="px-4 py-3">
                Vehicle
              </th>

              <th className="px-4 py-3">
                Zone
              </th>

              <th className="px-4 py-3">
                Battery
              </th>

              <th className="px-4 py-3">
                Health
              </th>

              <th className="px-4 py-3">
                Trips
              </th>

              <th className="px-4 py-3 text-right">
                Risk
              </th>

            </tr>

          </thead>

          <tbody>

            {rows.map((row) => (

              <tr
                key={row.scooter_id}
                className="border-t border-[#f0e7c9] bg-white"
              >

                <td className="px-4 py-3 font-mono text-sm font-semibold text-[#3c351d]">
                  {row.scooter_id}
                </td>

                <td className="px-4 py-3 text-sm text-[#756b49]">
                  {shortZone(row.zone)}
                </td>

                <td className="px-4 py-3 font-mono text-sm text-[#625a3e]">
                  {row.battery}%
                </td>

                <td className="px-4 py-3 font-mono text-sm text-[#625a3e]">
                  {row.health_score}%
                </td>

                <td className="px-4 py-3 font-mono text-sm text-[#625a3e]">
                  {row.trips_today}
                </td>

                <td className="px-4 py-3 text-right">

                  <span className="font-mono text-sm font-semibold text-[#c58d00]">
                    {(row.risk * 100).toFixed(0)}%
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}


/* ============================================================
   CHARGING
============================================================ */

function ChargingResult({ data }) {

  const rows = Array.isArray(data) ? data : [];

  return (

    <CompactList
      icon={<Battery size={16} />}
      label="Charging priority"
      rows={rows}
      columns={[
        ["scooter_id", "Vehicle"],
        ["zone", "Zone"],
        ["battery", "Battery"],
        ["priority", "Priority"],
      ]}
      formatter={{
        battery: (value) => `${value}%`,
      }}
    />

  );
}


/* ============================================================
   MAINTENANCE
============================================================ */

function MaintenanceResult({ data }) {

  const rows = Array.isArray(data) ? data : [];

  return (

    <CompactList
      icon={<Wrench size={16} />}
      label="Maintenance queue"
      rows={rows}
      columns={[
        ["scooter_id", "Vehicle"],
        ["zone", "Zone"],
        ["health_score", "Health"],
        ["age_months", "Age"],
        ["risk", "Risk"],
      ]}
      formatter={{
        health_score: (value) => `${value}%`,
        age_months: (value) => `${value} mo`,
        risk: (value) =>
          `${(value * 100).toFixed(0)}%`,
      }}
    />

  );
}


/* ============================================================
   FLEET
============================================================ */

function FleetResult({ data }) {

  const fleet = data || {};

  return (

    <div className="mt-7 grid overflow-hidden rounded-xl border border-[#eadfb9] bg-white grid-cols-2 md:grid-cols-3">

      <Stat
        label="Vehicles"
        value={fleet.total_scooters ?? 25}
      />

      <Stat
        label="Zones"
        value={fleet.zones ?? 5}
      />

      <Stat
        label="Average battery"
        value={`${fleet.average_battery ?? 58.32}%`}
      />

      <Stat
        label="Average health"
        value={`${fleet.average_health ?? 82.88}%`}
      />

      <Stat
        label="Low battery"
        value={fleet.low_battery_scooters ?? 10}
      />

      <Stat
        label="High risk"
        value={fleet.high_risk_scooters ?? 6}
      />

    </div>
  );
}


/* ============================================================
   DEMAND
============================================================ */

function DemandResult({ result }) {

  return (

    <div className="mt-7 grid max-w-3xl overflow-hidden rounded-xl border border-[#eadfb9] bg-white grid-cols-3">

      <Stat
        label="Zone"
        value={shortZone(result.zone)}
      />

      <Stat
        label="Forecast"
        value={`${result.hour ?? 17}:00`}
      />

      <Stat
        label="Demand"
        value={
          typeof result.data === "number"
            ? Math.round(
                result.data
              ).toLocaleString()
            : result.data
        }
      />

    </div>
  );
}


/* ============================================================
   DEMAND COMPARISON
============================================================ */

function DemandComparison({ data }) {

  const rows = Array.isArray(data) ? data : [];

  return (

    <div className="mt-7 max-w-3xl overflow-hidden rounded-xl border border-[#eadfb9] bg-white">

      {rows.map((row, index) => (

        <div
          key={row.zone}
          className="flex items-center justify-between border-b border-[#f0e7c9] px-5 py-5 last:border-b-0"
        >

          <div>

            <div className="text-sm font-semibold text-[#514719]">
              {row.display_zone}
            </div>

            <div className="mt-1 text-xs text-[#a18d45]">
              {row.scooters} scooters
            </div>

          </div>

          <div className="font-mono text-lg font-semibold text-[#3d3518]">
            {Math.round(
              row.predicted_demand
            ).toLocaleString()}
          </div>

        </div>

      ))}

    </div>
  );
}


/* ============================================================
   ZONE COMPARISON
============================================================ */

function ZoneComparison({ data }) {

  const rows = Array.isArray(data) ? data : [];

  return (

    <div className="mt-7 max-w-3xl grid gap-3 md:grid-cols-2">

      {rows.map((row) => (

        <div
          key={row.zone}
          className="rounded-xl border border-[#eadfb9] bg-[#fffdf5] p-6"
        >

          <div className="text-sm font-semibold text-[#514719]">
            {row.display_zone}
          </div>

          <div className="mt-5 font-mono text-2xl font-semibold text-[#2e2812]">
            {Math.round(
              row.predicted_demand
            ).toLocaleString()}
          </div>

          <div className="mt-2 text-xs text-[#a18d45]">
            predicted demand · {row.scooters} scooters
          </div>

        </div>

      ))}

    </div>
  );
}


/* ============================================================
   FINANCIAL
============================================================ */

function FinancialResult({ result }) {

  const data = result.data || {};

  return (

    <div className="mt-7 max-w-3xl">

      <div className="grid overflow-hidden rounded-xl border border-[#eadfb9] bg-white grid-cols-2 md:grid-cols-4">

        <Stat
          label="Scooters"
          value={
            data.scooters ??
            data.scooters_to_move ??
            "—"
          }
        />

        <Stat
          label="Expected trips"
          value={
            data.trips ??
            data.expected_trips ??
            "—"
          }
        />

        <Stat
          label="Revenue"
          value={
            data.revenue !== undefined
              ? `₹${Math.round(
                  data.revenue
                ).toLocaleString()}`
              : "—"
          }
        />

        <Stat
          label="Contribution margin"
          value={
            data.margin !== undefined
              ? `₹${Math.round(
                  data.margin
                ).toLocaleString()}`
              : data.contribution_margin !== undefined
                ? `₹${Math.round(
                    data.contribution_margin
                  ).toLocaleString()}`
                : "—"
          }
        />

      </div>


      {result.comparison && (

        <div className="mt-8 rounded-xl border border-[#eadfb9] bg-white p-6">

          <div className="mb-5">

            <div className="text-sm font-semibold text-[#514719]">
              Deployment economics
            </div>

            <div className="mt-1 text-xs text-[#a18d45]">
              Contribution margin across deployment levels
            </div>

          </div>


          <div className="flex h-32 items-end gap-2">

            {result.comparison.map((item) => {

              const height = Math.max(
                6,
                (item.margin / 3000) * 100
              );

              const optimal =
                item.margin ===
                Math.max(
                  ...result.comparison.map(
                    (x) => x.margin
                  )
                );

              return (

                <div
                  key={item.scooters}
                  className="flex h-full flex-1 items-end"
                >

                  <div
                    className={
                      optimal
                        ? "w-full rounded-t-sm bg-[#f5b700]"
                        : "w-full rounded-t-sm bg-[#eadfb9]"
                    }
                    style={{
                      height: `${height}%`,
                    }}
                    title={`${item.scooters} scooters: ₹${Math.round(
                      item.margin
                    )}`}
                  />

                </div>

              );
            })}

          </div>


          <div className="mt-3 flex justify-between text-xs text-[#a18d45]">

            <span>
              0 scooters
            </span>

            <span>
              10 scooters
            </span>

          </div>

        </div>

      )}

    </div>
  );
}


/* ============================================================
   GENERIC TABLE
============================================================ */

function GenericTable({ rows }) {

  if (!rows.length) return null;

  const keys = Object.keys(
    rows[0]
  ).slice(0, 6);

  return (

    <div className="mt-7 overflow-x-auto rounded-xl border border-[#eadfb9] bg-white">

      <table className="w-full">

        <thead>

          <tr className="bg-[#fffaf0] text-left text-xs font-semibold text-[#8c7b3f]">

            {keys.map((key) => (

              <th
                key={key}
                className="px-4 py-3"
              >
                {formatKey(key)}
              </th>

            ))}

          </tr>

        </thead>

        <tbody>

          {rows.map((row, index) => (

            <tr
              key={index}
              className="border-t border-[#f0e7c9]"
            >

              {keys.map((key) => (

                <td
                  key={key}
                  className="px-4 py-3 text-sm text-[#625a3e]"
                >
                  {formatValue(row[key])}
                </td>

              ))}

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}


/* ============================================================
   COMPACT LIST
============================================================ */

function CompactList({
  icon,
  label,
  rows,
  columns,
  formatter = {},
}) {

  return (

    <div className="mt-7 max-w-3xl">

      <div className="mb-4 flex items-center gap-3">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fff5cc] text-[#d99d00]">
          {icon}
        </div>

        <div>

          <div className="text-sm font-semibold text-[#514719]">
            {label}
          </div>

          <div className="text-xs text-[#a18d45]">
            {rows.length} vehicles
          </div>

        </div>

      </div>


      <div className="overflow-x-auto rounded-xl border border-[#eadfb9] bg-white">

        <table className="w-full">

          <thead>

            <tr className="bg-[#fffaf0] text-left text-xs font-semibold text-[#8c7b3f]">

              {columns.map(
                ([key, title]) => (

                  <th
                    key={key}
                    className="px-4 py-3"
                  >
                    {title}
                  </th>

                )
              )}

            </tr>

          </thead>


          <tbody>

            {rows.map((row, index) => (

              <tr
                key={
                  row.scooter_id ??
                  index
                }
                className="border-t border-[#f0e7c9]"
              >

                {columns.map(([key]) => (

                  <td
                    key={key}
                    className="px-4 py-3 text-sm text-[#625a3e]"
                  >

                    {formatter[key]
                      ? formatter[key](
                          row[key]
                        )
                      : shortZone(
                          row[key]
                        )}

                  </td>

                ))}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}


/* ============================================================
   STAT
============================================================ */

function Stat({ label, value }) {

  return (

    <div className="border-r border-b border-[#f0e7c9] px-5 py-5 last:border-r-0">

      <div className="text-xs font-medium text-[#a18d45]">
        {label}
      </div>

      <div className="mt-2 font-mono text-lg font-semibold text-[#3d3518]">
        {value}
      </div>

    </div>
  );
}


/* ============================================================
   SUGGESTION
============================================================ */

function Suggestion({ text, onClick }) {

  return (

    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[72px] items-center justify-between border-b border-r border-[#f0e7c9] bg-white px-5 text-left transition hover:bg-[#fff9df]"
    >

      <span className="pr-5 text-[15px] text-[#625a3e] transition group-hover:text-[#2e2812]">
        {text}
      </span>

      <ChevronRight
        size={17}
        className="shrink-0 text-[#c5a94e] transition group-hover:translate-x-1 group-hover:text-[#d99d00]"
      />

    </button>
  );
}


/* ============================================================
   FORMATTERS
============================================================ */

function formatKey(key) {

  return key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}


function formatValue(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "—";
  }

  if (typeof value === "number") {

    return Number.isInteger(value)
      ? value.toLocaleString()
      : value.toFixed(2);

  }

  return String(value);
}


function shortZone(zone) {

  if (!zone) return "—";

  const value = String(zone);

  if (
    value
      .toLowerCase()
      .includes("majestic") ||
    value
      .toLowerCase()
      .includes("kempegowda")
  ) {
    return "Majestic";
  }

  if (value === "Mahatma Gandhi Road") {
    return "MG Road";
  }

  if (value === "Krishnarajapura") {
    return "KR Puram";
  }

  return value;
}