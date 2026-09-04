// // // import React, { useEffect, useState } from "react";

// // // import {
// // //   TrendingUp,
// // //   Battery,
// // //   AlertTriangle,
// // //   Activity,
// // //   Zap,
// // //   RefreshCw,
// // // } from "lucide-react";

// // // import FleetMap from "../components/FleetMap";

// // // const API = "http://127.0.0.1:8000";

// // // export default function Analytics() {

// // //   const [data, setData] = useState(null);
// // //   const [loading, setLoading] = useState(true);

// // //   async function loadAnalytics() {

// // //     try {

// // //       setLoading(true);

// // //       const response =
// // //         await fetch(`${API}/api/analytics`);

// // //       const result =
// // //         await response.json();

// // //       console.log(
// // //         "FleetMind analytics:",
// // //         result
// // //       );

// // //       setData(
// // //         result?.data || {}
// // //       );

// // //     } catch (error) {

// // //       console.error(
// // //         "Analytics error:",
// // //         error
// // //       );

// // //     } finally {

// // //       setLoading(false);

// // //     }
// // //   }

// // //   useEffect(() => {
// // //     loadAnalytics();
// // //   }, []);

// // //   if (loading) {

// // //     return (
// // //       <div className="min-h-screen bg-[#07090a] p-10 text-gray-500">
// // //         <div className="flex items-center gap-3">
// // //           <RefreshCw
// // //             size={16}
// // //             className="animate-spin"
// // //           />
// // //           Loading FleetMind analytics...
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   const fleet =
// // //     data?.fleet || {};

// // //   const zoneDemand =
// // //     data?.zone_demand || [];

// // //   const battery =
// // //     data?.battery_distribution || {};

// // //   const risk =
// // //     data?.risk_distribution || {};

// // //   const counterfactual =
// // //     data?.counterfactual || [];

// // //   const recommendation =
// // //     data?.recommendation || {};

// // //   const zoneDistribution =
// // //     data?.zone_distribution || {};

// // //   return (

// // //     <div className="min-h-screen bg-[#07090a] text-gray-100">

// // //       <main className="mx-auto max-w-[1350px] px-6 py-10 lg:px-10">

// // //         {/* HEADER */}

// // //         <div className="flex items-end justify-between">

// // //           <div>

// // //             <div className="text-xs tracking-[0.25em] text-gray-500">
// // //               FLEETMIND
// // //             </div>

// // //             <h1 className="mt-7 text-4xl font-medium tracking-tight">
// // //               Analytics
// // //             </h1>

// // //             <p className="mt-3 text-sm text-gray-600">
// // //               Fleet state, demand intelligence,
// // //               risk and financial optimization.
// // //             </p>

// // //           </div>

// // //           <button
// // //             onClick={loadAnalytics}
// // //             className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs text-gray-500 hover:text-gray-200"
// // //           >
// // //             <RefreshCw size={13} />
// // //             Refresh
// // //           </button>

// // //         </div>


// // //         {/* ==================================================
// // //             FLEET OVERVIEW
// // //         ================================================== */}

// // //         <section className="mt-12">

// // //           <SectionTitle title="Fleet overview" />

// // //           <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">

// // //             <Metric
// // //               label="Scooters"
// // //               value={
// // //                 fleet.total_scooters ??
// // //                 25
// // //               }
// // //             />

// // //             <Metric
// // //               label="Zones"
// // //               value={
// // //                 fleet.zones ??
// // //                 5
// // //               }
// // //             />

// // //             <Metric
// // //               label="Average battery"
// // //               value={`${fleet.average_battery ?? 58.32}%`}
// // //             />

// // //             <Metric
// // //               label="Average health"
// // //               value={`${fleet.average_health ?? 82.88}%`}
// // //             />

// // //             <Metric
// // //               label="Low battery"
// // //               value={
// // //                 fleet.low_battery_scooters ??
// // //                 10
// // //               }
// // //             />

// // //             <Metric
// // //               label="High risk"
// // //               value={
// // //                 fleet.high_risk_scooters ??
// // //                 6
// // //               }
// // //             />

// // //           </div>

// // //         </section>


// // //         {/* ==================================================
// // //             ANALYTICS GRID
// // //         ================================================== */}

// // //         <section className="mt-12 grid gap-4 lg:grid-cols-2">


// // //           {/* DEMAND */}

// // //           <Panel
// // //             title="Predicted demand by zone"
// // //             icon={
// // //               <TrendingUp size={15} />
// // //             }
// // //           >

// // //             <div className="space-y-6">

// // //               {zoneDemand.map(
// // //                 (item) => {

// // //                   const width =
// // //                     Math.min(
// // //                       100,
// // //                       (item.value / 5000) *
// // //                         100
// // //                     );

// // //                   return (

// // //                     <div
// // //                       key={item.name}
// // //                     >

// // //                       <div className="mb-2 flex justify-between">

// // //                         <span className="text-xs text-gray-400">
// // //                           {shortZone(
// // //                             item.name
// // //                           )}
// // //                         </span>

// // //                         <span className="font-mono text-xs text-gray-300">
// // //                           {Math.round(
// // //                             item.value
// // //                           ).toLocaleString()}
// // //                         </span>

// // //                       </div>

// // //                       <div className="h-2 overflow-hidden rounded-full bg-white/5">

// // //                         <div
// // //                           className="h-full rounded-full bg-gray-300 transition-all"
// // //                           style={{
// // //                             width:
// // //                               `${width}%`,
// // //                           }}
// // //                         />

// // //                       </div>

// // //                     </div>

// // //                   );
// // //                 }
// // //               )}

// // //             </div>

// // //           </Panel>


// // //           {/* RISK */}

// // //           <Panel
// // //             title="Fleet risk distribution"
// // //             icon={
// // //               <AlertTriangle
// // //                 size={15}
// // //               />
// // //             }
// // //           >

// // //             <div className="flex h-[240px] items-end justify-center gap-14">

// // //               <Bar
// // //                 label="Critical"
// // //                 value={
// // //                   risk.critical ??
// // //                   4
// // //                 }
// // //                 total={25}
// // //               />

// // //               <Bar
// // //                 label="Elevated"
// // //                 value={
// // //                   risk.elevated ??
// // //                   2
// // //                 }
// // //                 total={25}
// // //               />

// // //               <Bar
// // //                 label="Normal"
// // //                 value={
// // //                   risk.normal ??
// // //                   19
// // //                 }
// // //                 total={25}
// // //               />

// // //             </div>

// // //             <p className="mt-6 text-xs leading-6 text-gray-600">
// // //               Risk combines battery, vehicle health,
// // //               utilization and vehicle age.
// // //             </p>

// // //           </Panel>


// // //           {/* BATTERY */}

// // //           <Panel
// // //             title="Battery distribution"
// // //             icon={
// // //               <Battery size={15} />
// // //             }
// // //           >

// // //             <div className="flex h-[240px] items-end justify-center gap-8">

// // //               <Bar
// // //                 label="0–30%"
// // //                 value={
// // //                   battery["0-30"] ??
// // //                   10
// // //                 }
// // //                 total={25}
// // //               />

// // //               <Bar
// // //                 label="31–60%"
// // //                 value={
// // //                   battery["31-60"] ??
// // //                   5
// // //                 }
// // //                 total={25}
// // //               />

// // //               <Bar
// // //                 label="61–80%"
// // //                 value={
// // //                   battery["61-80"] ??
// // //                   5
// // //                 }
// // //                 total={25}
// // //               />

// // //               <Bar
// // //                 label="81–100%"
// // //                 value={
// // //                   battery["81-100"] ??
// // //                   5
// // //                 }
// // //                 total={25}
// // //               />

// // //             </div>

// // //           </Panel>


// // //           {/* ECONOMICS */}

// // //           <Panel
// // //             title="Contribution margin"
// // //             icon={
// // //               <Zap size={15} />
// // //             }
// // //           >

// // //             <div className="grid grid-cols-2 gap-3">

// // //               <Economic
// // //                 label="Baseline"
// // //                 value="₹1,371"
// // //               />

// // //               <Economic
// // //                 label="Optimized"
// // //                 value="₹2,709"
// // //               />

// // //               <Economic
// // //                 label="Improvement"
// // //                 value="+₹1,338"
// // //               />

// // //               <Economic
// // //                 label="Optimal move"
// // //                 value="6 scooters"
// // //               />

// // //             </div>

// // //             <p className="mt-6 text-xs leading-6 text-gray-600">
// // //               FleetMind optimizes contribution margin,
// // //               accounting for revenue, energy,
// // //               relocation and deployment risk.
// // //             </p>

// // //           </Panel>

// // //         </section>


// // //         {/* ==================================================
// // //             COUNTERFACTUAL
// // //         ================================================== */}

// // //         <section className="mt-12">

// // //           <SectionTitle
// // //             title="Deployment counterfactual"
// // //           />

// // //           <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.015] p-7">

// // //             <div className="flex items-end justify-between">

// // //               <div>

// // //                 <div className="text-[10px] uppercase tracking-[0.18em] text-gray-600">
// // //                   Contribution margin by deployment level
// // //                 </div>

// // //                 <div className="mt-2 text-sm text-gray-400">
// // //                   The optimum occurs where additional
// // //                   rides no longer justify additional cost.
// // //                 </div>

// // //               </div>

// // //               <div className="font-mono text-2xl text-gray-200">
// // //                 ₹2,709
// // //               </div>

// // //             </div>


// // //             <div className="mt-10 flex h-[300px] items-end gap-2">

// // //               {counterfactual.map(
// // //                 (item) => {

// // //                   const height =
// // //                     Math.max(
// // //                       5,
// // //                       (item.margin /
// // //                         3000) *
// // //                         100
// // //                     );

// // //                   const optimal =
// // //                     item.scooters === 6;

// // //                   return (

// // //                     <div
// // //                       key={
// // //                         item.scooters
// // //                       }
// // //                       className="flex h-full flex-1 flex-col items-center justify-end"
// // //                     >

// // //                       <div className="mb-2 text-[9px] font-mono text-gray-600">
// // //                         ₹
// // //                         {Math.round(
// // //                           item.margin
// // //                         ).toLocaleString()}
// // //                       </div>

// // //                       <div
// // //                         className={
// // //                           optimal
// // //                             ? "w-full rounded-t-lg bg-gray-200"
// // //                             : "w-full rounded-t-lg bg-gray-600/60"
// // //                         }
// // //                         style={{
// // //                           height:
// // //                             `${height}%`,
// // //                         }}
// // //                       />

// // //                       <div
// // //                         className={
// // //                           optimal
// // //                             ? "mt-3 text-[10px] font-mono text-gray-200"
// // //                             : "mt-3 text-[10px] font-mono text-gray-600"
// // //                         }
// // //                       >
// // //                         {item.scooters}
// // //                       </div>

// // //                     </div>

// // //                   );
// // //                 }
// // //               )}

// // //             </div>

// // //           </div>

// // //         </section>


// // //         {/* ==================================================
// // //             RECOMMENDATION
// // //         ================================================== */}

// // //         <section className="mt-12">

// // //           <SectionTitle
// // //             title="Current recommendation"
// // //           />

// // //           <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.015] p-7">

// // //             <div className="grid gap-7 md:grid-cols-4">

// // //               <Recommendation
// // //                 label="Move"
// // //                 value={`${recommendation.scooters_to_move ?? 6} scooters`}
// // //               />

// // //               <Recommendation
// // //                 label="Target zone"
// // //                 value="Majestic"
// // //               />

// // //               <Recommendation
// // //                 label="Expected trips"
// // //                 value={
// // //                   recommendation.expected_trips ??
// // //                   36.45
// // //                 }
// // //               />

// // //               <Recommendation
// // //                 label="Margin"
// // //                 value={`₹${Math.round(
// // //                   recommendation.contribution_margin ??
// // //                   2709
// // //                 ).toLocaleString()}`}
// // //               />

// // //             </div>

// // //             <div className="mt-7 border-t border-white/10 pt-5">

// // //               <p className="text-sm leading-7 text-gray-400">

// // //                 Moving more scooters initially increases
// // //                 expected rides, but diminishing utilization
// // //                 and additional operating costs eventually
// // //                 reduce contribution margin. FleetMind selects
// // //                 six scooters as the financial optimum.

// // //               </p>

// // //             </div>

// // //           </div>

// // //         </section>


// // //         {/* ==================================================
// // //             REAL MAP
// // //         ================================================== */}

// // //         <section className="mt-12 pb-16">

// // //           <SectionTitle
// // //             title="Fleet zone map"
// // //           />

// // //           <div className="mt-4">

// // //             <FleetMap
// // //               zoneDistribution={
// // //                 zoneDistribution
// // //               }
// // //             />

// // //           </div>

// // //         </section>

// // //       </main>

// // //     </div>
// // //   );
// // // }


// // // /* ============================================================
// // //    COMPONENTS
// // // ============================================================ */

// // // function SectionTitle({
// // //   title,
// // // }) {

// // //   return (
// // //     <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500">
// // //       {title}
// // //     </h2>
// // //   );
// // // }


// // // function Metric({
// // //   label,
// // //   value,
// // // }) {

// // //   return (

// // //     <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">

// // //       <div className="text-[10px] uppercase tracking-[0.16em] text-gray-600">
// // //         {label}
// // //       </div>

// // //       <div className="mt-3 font-mono text-xl text-gray-200">
// // //         {value}
// // //       </div>

// // //     </div>
// // //   );
// // // }


// // // function Panel({
// // //   title,
// // //   icon,
// // //   children,
// // // }) {

// // //   return (

// // //     <div className="rounded-3xl border border-white/10 bg-white/[0.015] p-6">

// // //       <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-gray-500">

// // //         {icon}

// // //         {title}

// // //       </div>

// // //       <div className="mt-7">
// // //         {children}
// // //       </div>

// // //     </div>
// // //   );
// // // }


// // // function Bar({
// // //   label,
// // //   value,
// // //   total,
// // // }) {

// // //   const height =
// // //     Math.max(
// // //       8,
// // //       (value / total) * 100
// // //     );

// // //   return (

// // //     <div className="flex h-full w-16 flex-col items-center justify-end">

// // //       <div className="mb-2 font-mono text-xs text-gray-400">
// // //         {value}
// // //       </div>

// // //       <div
// // //         className="w-10 rounded-t-lg bg-gray-400/70"
// // //         style={{
// // //           height:
// // //             `${height}%`,
// // //         }}
// // //       />

// // //       <div className="mt-3 whitespace-nowrap text-[9px] text-gray-600">
// // //         {label}
// // //       </div>

// // //     </div>
// // //   );
// // // }


// // // function Economic({
// // //   label,
// // //   value,
// // // }) {

// // //   return (

// // //     <div className="rounded-2xl border border-white/10 p-5">

// // //       <div className="text-[9px] uppercase tracking-[0.16em] text-gray-600">
// // //         {label}
// // //       </div>

// // //       <div className="mt-3 font-mono text-xl text-gray-200">
// // //         {value}
// // //       </div>

// // //     </div>
// // //   );
// // // }


// // // function Recommendation({
// // //   label,
// // //   value,
// // // }) {

// // //   return (

// // //     <div>

// // //       <div className="text-[9px] uppercase tracking-[0.16em] text-gray-600">
// // //         {label}
// // //       </div>

// // //       <div className="mt-2 font-mono text-lg text-gray-200">
// // //         {value}
// // //       </div>

// // //     </div>
// // //   );
// // // }


// // // function shortZone(zone) {

// // //   if (!zone) return "Fleet";

// // //   if (
// // //     zone.includes("Nadaprabhu")
// // //   ) {
// // //     return "Majestic";
// // //   }

// // //   if (
// // //     zone === "Mahatma Gandhi Road"
// // //   ) {
// // //     return "MG Road";
// // //   }

// // //   if (
// // //     zone === "Krishnarajapura"
// // //   ) {
// // //     return "KR Puram";
// // //   }

// // //   return zone;
// // // }

// // import React, { useEffect, useState } from "react";

// // import {
// //   TrendingUp,
// //   Battery,
// //   AlertTriangle,
// //   Zap,
// //   RefreshCw,
// // } from "lucide-react";

// // import FleetMap from "../components/FleetMap";

// // const API = "http://127.0.0.1:8000";

// // export default function Analytics() {
// //   const [data, setData] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   async function loadAnalytics() {
// //     try {
// //       setLoading(true);

// //       const response =
// //         await fetch(`${API}/api/analytics`);

// //       const result =
// //         await response.json();

// //       console.log(
// //         "FleetMind analytics:",
// //         result
// //       );

// //       setData(
// //         result?.data || {}
// //       );
// //     } catch (error) {
// //       console.error(
// //         "Analytics error:",
// //         error
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   useEffect(() => {
// //     loadAnalytics();
// //   }, []);

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-[#fffaf0] p-10 text-[#806f3c]">

// //         <div className="flex items-center gap-3">

// //           <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff0b7]">

// //             <RefreshCw
// //               size={16}
// //               className="animate-spin text-[#d39d00]"
// //             />

// //           </div>

// //           <span className="text-sm font-medium">
// //             Loading fleet analytics...
// //           </span>

// //         </div>

// //       </div>
// //     );
// //   }

// //   const fleet =
// //     data?.fleet || {};

// //   const zoneDemand =
// //     data?.zone_demand || [];

// //   const battery =
// //     data?.battery_distribution || {};

// //   const risk =
// //     data?.risk_distribution || {};

// //   const counterfactual =
// //     data?.counterfactual || [];

// //   const recommendation =
// //     data?.recommendation || {};

// //   const zoneDistribution =
// //     data?.zone_distribution || {};

// //   return (

// //     <div className="min-h-screen bg-[#fffaf0] text-[#30270d]">

// //       <main className="mx-auto max-w-[1350px] px-6 py-9 lg:px-10">

// //         {/* ==================================================
// //             HEADER
// //         ================================================== */}

// //         <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

// //           <div>

// //             <div className="flex items-center gap-3">

// //               <div className="h-2.5 w-2.5 rounded-full bg-[#f2b900] shadow-[0_0_12px_rgba(242,185,0,0.4)]" />

// //               <span className="text-sm font-semibold tracking-[0.14em] text-[#8b711e]">
// //                 FLEETMIND
// //               </span>

// //             </div>

// //             <h1 className="mt-5 text-4xl font-semibold tracking-[-0.035em] text-[#30270d]">
// //               Fleet analytics
// //             </h1>

// //             <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#806f3c]">
// //               A live view of fleet availability, demand,
// //               vehicle risk and deployment economics.
// //             </p>

// //           </div>


// //           <button
// //             onClick={loadAnalytics}
// //             className="flex w-fit items-center gap-2 rounded-xl border border-[#e4cd83] bg-white px-4 py-2.5 text-sm font-medium text-[#806f3c] shadow-[0_6px_20px_rgba(120,90,0,0.06)] hover:border-[#d7b73e] hover:bg-[#fff9df] hover:text-[#4d401d]"
// //           >

// //             <RefreshCw size={14} />

// //             Refresh data

// //           </button>

// //         </div>


// //         {/* ==================================================
// //             FLEET OVERVIEW
// //         ================================================== */}

// //         <section className="mt-12">

// //           <SectionTitle title="Fleet overview" />

// //           <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">

// //             <Metric
// //               label="Scooters"
// //               value={
// //                 fleet.total_scooters ??
// //                 25
// //               }
// //             />

// //             <Metric
// //               label="Zones"
// //               value={
// //                 fleet.zones ??
// //                 5
// //               }
// //             />

// //             <Metric
// //               label="Average battery"
// //               value={`${fleet.average_battery ?? 58.32}%`}
// //             />

// //             <Metric
// //               label="Average health"
// //               value={`${fleet.average_health ?? 82.88}%`}
// //             />

// //             <Metric
// //               label="Low battery"
// //               value={
// //                 fleet.low_battery_scooters ??
// //                 10
// //               }
// //             />

// //             <Metric
// //               label="High risk"
// //               value={
// //                 fleet.high_risk_scooters ??
// //                 6
// //               }
// //             />

// //           </div>

// //         </section>


// //         {/* ==================================================
// //             ANALYTICS
// //         ================================================== */}

// //         <section className="mt-12 grid gap-5 lg:grid-cols-2">


// //           {/* DEMAND */}

// //           <Panel
// //             title="Predicted demand by zone"
// //             subtitle="Forecast for the current operating window"
// //             icon={<TrendingUp size={17} />}
// //           >

// //             <div className="space-y-7">

// //               {zoneDemand.map(
// //                 (item) => {

// //                   const width =
// //                     Math.min(
// //                       100,
// //                       (item.value / 5000) * 100
// //                     );

// //                   return (

// //                     <div key={item.name}>

// //                       <div className="mb-2.5 flex items-center justify-between">

// //                         <span className="text-sm font-medium text-[#514719]">
// //                           {shortZone(item.name)}
// //                         </span>

// //                         <span className="font-mono text-sm font-semibold text-[#30270d]">
// //                           {Math.round(
// //                             item.value
// //                           ).toLocaleString()}
// //                         </span>

// //                       </div>

// //                       <div className="h-3 overflow-hidden rounded-full bg-[#fff0b7]">

// //                         <div
// //                           className="h-full rounded-full bg-gradient-to-r from-[#e8a900] via-[#f5b700] to-[#ffd95a] shadow-[0_2px_8px_rgba(245,183,0,0.25)] transition-all duration-700"
// //                           style={{
// //                             width: `${width}%`,
// //                           }}
// //                         />

// //                       </div>

// //                     </div>
// //                   );
// //                 }
// //               )}

// //             </div>

// //           </Panel>


// //           {/* RISK */}

// //           <Panel
// //             title="Fleet risk distribution"
// //             subtitle="Current operational risk across the fleet"
// //             icon={<AlertTriangle size={17} />}
// //           >

// //             <div className="flex h-[250px] items-end justify-center gap-12">

// //               <Bar
// //                 label="Critical"
// //                 value={
// //                   risk.critical ??
// //                   4
// //                 }
// //                 total={25}
// //                 emphasis
// //               />

// //               <Bar
// //                 label="Elevated"
// //                 value={
// //                   risk.elevated ??
// //                   2
// //                 }
// //                 total={25}
// //               />

// //               <Bar
// //                 label="Normal"
// //                 value={
// //                   risk.normal ??
// //                   19
// //                 }
// //                 total={25}
// //                 light
// //               />

// //             </div>

// //             <p className="mt-6 text-sm leading-6 text-[#806f3c]">
// //               Risk combines battery level, vehicle health,
// //               utilization and vehicle age.
// //             </p>

// //           </Panel>


// //           {/* BATTERY */}

// //           <Panel
// //             title="Battery distribution"
// //             subtitle="Available energy across active scooters"
// //             icon={<Battery size={17} />}
// //           >

// //             <div className="flex h-[250px] items-end justify-center gap-6 md:gap-9">

// //               <Bar
// //                 label="0–30%"
// //                 value={
// //                   battery["0-30"] ??
// //                   10
// //                 }
// //                 total={25}
// //                 emphasis
// //               />

// //               <Bar
// //                 label="31–60%"
// //                 value={
// //                   battery["31-60"] ??
// //                   5
// //                 }
// //                 total={25}
// //               />

// //               <Bar
// //                 label="61–80%"
// //                 value={
// //                   battery["61-80"] ??
// //                   5
// //                 }
// //                 total={25}
// //               />

// //               <Bar
// //                 label="81–100%"
// //                 value={
// //                   battery["81-100"] ??
// //                   5
// //                 }
// //                 total={25}
// //                 light
// //               />

// //             </div>

// //           </Panel>


// //           {/* ECONOMICS */}

// //           <Panel
// //             title="Contribution margin"
// //             subtitle="Financial outcome of deployment decisions"
// //             icon={<Zap size={17} />}
// //           >

// //             <div className="grid grid-cols-2 gap-4">

// //               <Economic
// //                 label="Baseline"
// //                 value="₹1,371"
// //               />

// //               <Economic
// //                 label="Optimized"
// //                 value="₹2,709"
// //                 highlight
// //               />

// //               <Economic
// //                 label="Improvement"
// //                 value="+₹1,338"
// //                 highlight
// //               />

// //               <Economic
// //                 label="Optimal move"
// //                 value="6 scooters"
// //               />

// //             </div>

// //             <p className="mt-6 text-sm leading-6 text-[#806f3c]">
// //               Contribution margin accounts for revenue,
// //               energy, relocation and deployment risk.
// //             </p>

// //           </Panel>

// //         </section>


// //         {/* ==================================================
// //             COUNTERFACTUAL
// //         ================================================== */}

// //         <section className="mt-12">

// //           <SectionTitle title="Deployment counterfactual" />

// //           <div className="mt-5 overflow-hidden rounded-3xl border border-[#ead9a1] bg-white shadow-[0_12px_40px_rgba(120,90,0,0.07)]">

// //             <div className="border-b border-[#f0e5c1] bg-gradient-to-r from-[#fffdf7] to-[#fff7d9] px-7 py-6">

// //               <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

// //                 <div>

// //                   <div className="text-lg font-semibold text-[#30270d]">
// //                     Find the financially optimal move
// //                   </div>

// //                   <div className="mt-1.5 text-sm text-[#806f3c]">
// //                     Compare contribution margin as more scooters
// //                     are deployed.
// //                   </div>

// //                 </div>

// //                 <div className="rounded-xl bg-[#fff0b7] px-5 py-3">

// //                   <div className="text-xs font-medium text-[#8b711e]">
// //                     Best outcome
// //                   </div>

// //                   <div className="mt-1 font-mono text-2xl font-bold text-[#b47e00]">
// //                     ₹2,709
// //                   </div>

// //                 </div>

// //               </div>

// //             </div>


// //             <div className="px-7 pb-7 pt-9">

// //               <div className="flex h-[310px] items-end gap-2">

// //                 {counterfactual.map(
// //                   (item) => {

// //                     const height =
// //                       Math.max(
// //                         5,
// //                         (item.margin / 3000) * 100
// //                       );

// //                     const optimal =
// //                       item.scooters === 6;

// //                     return (

// //                       <div
// //                         key={item.scooters}
// //                         className="flex h-full flex-1 flex-col items-center justify-end"
// //                       >

// //                         <div
// //                           className={
// //                             optimal
// //                               ? "mb-2 rounded-md bg-[#fff0b7] px-1.5 py-1 text-[10px] font-mono font-semibold text-[#a87500]"
// //                               : "mb-2 text-[10px] font-mono text-[#a18d51]"
// //                           }
// //                         >
// //                           ₹
// //                           {Math.round(
// //                             item.margin
// //                           ).toLocaleString()}
// //                         </div>


// //                         <div
// //                           className={
// //                             optimal
// //                               ? "w-full rounded-t-xl bg-gradient-to-t from-[#e7a800] to-[#ffd84f] shadow-[0_5px_18px_rgba(245,183,0,0.25)]"
// //                               : "w-full rounded-t-xl bg-gradient-to-t from-[#ead9a1] to-[#f9edc3]"
// //                           }
// //                           style={{
// //                             height:
// //                               `${height}%`,
// //                           }}
// //                         />


// //                         <div
// //                           className={
// //                             optimal
// //                               ? "mt-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#f5b700] text-[10px] font-bold text-white"
// //                               : "mt-3 text-[10px] font-mono text-[#a18d51]"
// //                           }
// //                         >
// //                           {item.scooters}
// //                         </div>

// //                       </div>
// //                     );
// //                   }
// //                 )}

// //               </div>


// //               <div className="mt-4 flex justify-between text-xs text-[#a18d51]">

// //                 <span>
// //                   0 scooters
// //                 </span>

// //                 <span>
// //                   10 scooters
// //                 </span>

// //               </div>

// //             </div>

// //           </div>

// //         </section>


// //         {/* ==================================================
// //             RECOMMENDATION
// //         ================================================== */}

// //         <section className="mt-12">

// //           <SectionTitle title="Current recommendation" />

// //           <div className="mt-5 overflow-hidden rounded-3xl border border-[#dfc45f] bg-gradient-to-br from-[#fffdf7] via-[#fff9df] to-[#ffefaa] shadow-[0_14px_45px_rgba(139,105,0,0.10)]">

// //             <div className="border-b border-[#ead9a1] px-7 py-6">

// //               <div className="text-lg font-semibold text-[#30270d]">
// //                 Deploy where the economics are strongest
// //               </div>

// //               <p className="mt-2 max-w-2xl text-sm leading-6 text-[#806f3c]">
// //                 FleetMind's current optimization points toward
// //                 Majestic while keeping low-battery and high-risk
// //                 scooters out of the relocation pool.
// //               </p>

// //             </div>


// //             <div className="grid gap-px bg-[#ead9a1] md:grid-cols-4">

// //               <Recommendation
// //                 label="Move"
// //                 value={`${recommendation.scooters_to_move ?? 6} scooters`}
// //               />

// //               <Recommendation
// //                 label="Target zone"
// //                 value="Majestic"
// //               />

// //               <Recommendation
// //                 label="Expected trips"
// //                 value={
// //                   recommendation.expected_trips ??
// //                   36.45
// //                 }
// //               />

// //               <Recommendation
// //                 label="Contribution margin"
// //                 value={`₹${Math.round(
// //                   recommendation.contribution_margin ??
// //                   2709
// //                 ).toLocaleString()}`}
// //                 highlight
// //               />

// //             </div>


// //             <div className="px-7 py-6">

// //               <p className="text-sm leading-7 text-[#665a32]">

// //                 Moving more scooters initially increases expected
// //                 rides, but diminishing utilization and additional
// //                 operating costs eventually reduce contribution
// //                 margin. Six scooters is the current financial optimum.

// //               </p>

// //             </div>

// //           </div>

// //         </section>


// //         {/* ==================================================
// //             MAP
// //         ================================================== */}

// //         <section className="mt-12 pb-16">

// //           <SectionTitle title="Fleet zone map" />

// //           <div className="mt-5 overflow-hidden rounded-3xl border border-[#ead9a1] bg-white p-2 shadow-[0_12px_40px_rgba(120,90,0,0.07)]">

// //             <FleetMap
// //               zoneDistribution={
// //                 zoneDistribution
// //               }
// //             />

// //           </div>

// //         </section>

// //       </main>

// //     </div>
// //   );
// // }


// // /* ============================================================
// //    SECTION TITLE
// // ============================================================ */

// // function SectionTitle({ title }) {

// //   return (

// //     <div className="flex items-center gap-3">

// //       <div className="h-1.5 w-1.5 rounded-full bg-[#f5b700]" />

// //       <h2 className="text-sm font-semibold text-[#6f5c22]">
// //         {title}
// //       </h2>

// //     </div>
// //   );
// // }


// // /* ============================================================
// //    METRIC
// // ============================================================ */

// // function Metric({
// //   label,
// //   value,
// // }) {

// //   return (

// //     <div className="group rounded-2xl border border-[#ead9a1] bg-white p-5 shadow-[0_7px_24px_rgba(120,90,0,0.045)] transition hover:-translate-y-0.5 hover:border-[#dfc35f] hover:shadow-[0_12px_30px_rgba(120,90,0,0.09)]">

// //       <div className="text-xs font-medium text-[#a18d51]">
// //         {label}
// //       </div>

// //       <div className="mt-3 font-mono text-2xl font-semibold tracking-tight text-[#30270d]">
// //         {value}
// //       </div>

// //       <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#fff0b7]">

// //         <div className="h-full w-1/2 rounded-full bg-[#f5b700]" />

// //       </div>

// //     </div>
// //   );
// // }


// // /* ============================================================
// //    PANEL
// // ============================================================ */

// // function Panel({
// //   title,
// //   subtitle,
// //   icon,
// //   children,
// // }) {

// //   return (

// //     <div className="group rounded-3xl border border-[#ead9a1] bg-white p-6 shadow-[0_9px_32px_rgba(120,90,0,0.055)] transition hover:-translate-y-0.5 hover:border-[#dfc35f] hover:shadow-[0_15px_42px_rgba(120,90,0,0.09)] md:p-7">

// //       <div className="flex items-start gap-3">

// //         <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#fff0b7] to-[#fff9df] text-[#c18c00]">

// //           {icon}

// //         </div>

// //         <div>

// //           <div className="text-base font-semibold text-[#403716]">
// //             {title}
// //           </div>

// //           <div className="mt-1 text-xs text-[#a18d51]">
// //             {subtitle}
// //           </div>

// //         </div>

// //       </div>

// //       <div className="mt-8">
// //         {children}
// //       </div>

// //     </div>
// //   );
// // }


// // /* ============================================================
// //    BAR
// // ============================================================ */

// // function Bar({
// //   label,
// //   value,
// //   total,
// //   emphasis = false,
// //   light = false,
// // }) {

// //   const height =
// //     Math.max(
// //       8,
// //       (value / total) * 100
// //     );

// //   return (

// //     <div className="flex h-full w-16 flex-col items-center justify-end">

// //       <div className="mb-2 font-mono text-sm font-semibold text-[#514719]">
// //         {value}
// //       </div>

// //       <div
// //         className={
// //           emphasis
// //             ? "w-11 rounded-t-xl bg-gradient-to-t from-[#e3a400] to-[#ffd84f] shadow-[0_5px_18px_rgba(245,183,0,0.20)]"
// //             : light
// //               ? "w-11 rounded-t-xl bg-[#f7edc9]"
// //               : "w-11 rounded-t-xl bg-gradient-to-t from-[#e8cc75] to-[#f5df9d]"
// //         }
// //         style={{
// //           height: `${height}%`,
// //         }}
// //       />

// //       <div className="mt-3 whitespace-nowrap text-xs font-medium text-[#8b773d]">
// //         {label}
// //       </div>

// //     </div>
// //   );
// // }


// // /* ============================================================
// //    ECONOMIC
// // ============================================================ */

// // function Economic({
// //   label,
// //   value,
// //   highlight = false,
// // }) {

// //   return (

// //     <div
// //       className={
// //         highlight
// //           ? "rounded-2xl border border-[#e3c65d] bg-gradient-to-br from-[#fff7d3] to-[#ffed9f] p-5 shadow-[0_7px_20px_rgba(245,183,0,0.08)]"
// //           : "rounded-2xl border border-[#ead9a1] bg-[#fffdf8] p-5"
// //       }
// //     >

// //       <div className="text-xs font-medium text-[#9a8241]">
// //         {label}
// //       </div>

// //       <div
// //         className={
// //           highlight
// //             ? "mt-3 font-mono text-2xl font-bold text-[#ae7900]"
// //             : "mt-3 font-mono text-2xl font-semibold text-[#3b3215]"
// //         }
// //       >
// //         {value}
// //       </div>

// //     </div>
// //   );
// // }


// // /* ============================================================
// //    RECOMMENDATION
// // ============================================================ */

// // function Recommendation({
// //   label,
// //   value,
// //   highlight = false,
// // }) {

// //   return (

// //     <div
// //       className={
// //         highlight
// //           ? "bg-gradient-to-br from-[#fff0b7] to-[#ffe48b] px-6 py-5"
// //           : "bg-white px-6 py-5"
// //       }
// //     >

// //       <div className="text-xs font-medium text-[#9a8241]">
// //         {label}
// //       </div>

// //       <div
// //         className={
// //           highlight
// //             ? "mt-2 font-mono text-xl font-bold text-[#aa7500]"
// //             : "mt-2 font-mono text-xl font-semibold text-[#3b3215]"
// //         }
// //       >
// //         {value}
// //       </div>

// //     </div>
// //   );
// // }


// // /* ============================================================
// //    ZONE
// // ============================================================ */

// // function shortZone(zone) {

// //   if (!zone) return "Fleet";

// //   if (
// //     zone.includes("Nadaprabhu")
// //   ) {
// //     return "Majestic";
// //   }

// //   if (
// //     zone === "Mahatma Gandhi Road"
// //   ) {
// //     return "MG Road";
// //   }

// //   if (
// //     zone === "Krishnarajapura"
// //   ) {
// //     return "KR Puram";
// //   }

// //   return zone;
// // }

// import React, { useEffect, useState } from "react";

// import {
//   TrendingUp,
//   Battery,
//   AlertTriangle,
//   Zap,
//   RefreshCw,
// } from "lucide-react";

// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
// } from "recharts";

// import FleetMap from "../components/FleetMap";

// const API = "http://127.0.0.1:8000";

// export default function Analytics() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   async function loadAnalytics() {
//     try {
//       setLoading(true);

//       const response = await fetch(`${API}/api/analytics`);
//       const result = await response.json();

//       console.log("FleetMind analytics:", result);

//       setData(result?.data || {});
//     } catch (error) {
//       console.error("Analytics error:", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadAnalytics();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#fffaf0] p-10 text-[#806f3c]">
//         <div className="flex items-center gap-3">
//           <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff0b7]">
//             <RefreshCw
//               size={16}
//               className="animate-spin text-[#d39d00]"
//             />
//           </div>

//           <span className="text-sm font-medium">
//             Loading fleet analytics...
//           </span>
//         </div>
//       </div>
//     );
//   }

//   const fleet = data?.fleet || {};
//   const zoneDemand = data?.zone_demand || [];
//   const battery = data?.battery_distribution || {};
//   const risk = data?.risk_distribution || {};
//   const counterfactual = data?.counterfactual || [];
//   const recommendation = data?.recommendation || {};
//   const zoneDistribution = data?.zone_distribution || {};

//   /*
//    * ---------------------------------------------------------
//    * CHART DATA
//    * ---------------------------------------------------------
//    */

//   const demandChartData = zoneDemand.map((item) => ({
//     zone: shortZone(item.name),
//     demand: Math.round(item.value || 0),
//   }));

//   const riskChartData = [
//     {
//       level: "Critical",
//       scooters: risk.critical ?? 4,
//     },
//     {
//       level: "Elevated",
//       scooters: risk.elevated ?? 2,
//     },
//     {
//       level: "Normal",
//       scooters: risk.normal ?? 19,
//     },
//   ];

//   const batteryChartData = [
//     {
//       range: "0–30%",
//       scooters: battery["0-30"] ?? 10,
//     },
//     {
//       range: "31–60%",
//       scooters: battery["31-60"] ?? 5,
//     },
//     {
//       range: "61–80%",
//       scooters: battery["61-80"] ?? 5,
//     },
//     {
//       range: "81–100%",
//       scooters: battery["81-100"] ?? 5,
//     },
//   ];

//   const counterfactualChartData = counterfactual.map((item) => ({
//     scooters: item.scooters,
//     margin: Math.round(item.margin || 0),
//   }));

//   return (
//     <div className="min-h-screen bg-[#fffaf0] text-[#30270d]">
//       <main className="mx-auto max-w-[1350px] px-6 py-9 lg:px-10">

//         {/* ==================================================
//             HEADER
//         ================================================== */}

//         <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
//           <div>
//             <div className="flex items-center gap-3">
//               <div className="h-2.5 w-2.5 rounded-full bg-[#f2b900] shadow-[0_0_12px_rgba(242,185,0,0.4)]" />

//               <span className="text-sm font-semibold tracking-[0.14em] text-[#8b711e]">
//                 FLEETMIND
//               </span>
//             </div>

//             <h1 className="mt-5 text-4xl font-semibold tracking-[-0.035em] text-[#30270d]">
//               Fleet analytics
//             </h1>

//             <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#806f3c]">
//               A live view of fleet availability, demand,
//               vehicle risk and deployment economics.
//             </p>
//           </div>

//           <button
//             onClick={loadAnalytics}
//             className="flex w-fit items-center gap-2 rounded-xl border border-[#e4cd83] bg-white px-4 py-2.5 text-sm font-medium text-[#806f3c] shadow-[0_6px_20px_rgba(120,90,0,0.06)] transition hover:-translate-y-0.5 hover:border-[#d7b73e] hover:bg-[#fff9df] hover:text-[#4d401d]"
//           >
//             <RefreshCw size={14} />
//             Refresh data
//           </button>
//         </div>

//         {/* ==================================================
//             FLEET OVERVIEW
//         ================================================== */}

//         <section className="mt-12">
//           <SectionTitle title="Fleet overview" />

//           <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
//             <Metric
//               label="Scooters"
//               value={fleet.total_scooters ?? 25}
//             />

//             <Metric
//               label="Zones"
//               value={fleet.zones ?? 5}
//             />

//             <Metric
//               label="Average battery"
//               value={`${fleet.average_battery ?? 58.32}%`}
//             />

//             <Metric
//               label="Average health"
//               value={`${fleet.average_health ?? 82.88}%`}
//             />

//             <Metric
//               label="Low battery"
//               value={fleet.low_battery_scooters ?? 10}
//             />

//             <Metric
//               label="High risk"
//               value={fleet.high_risk_scooters ?? 6}
//             />
//           </div>
//         </section>

//         {/* ==================================================
//             ANALYTICS GRID
//         ================================================== */}

//         <section className="mt-12 grid gap-5 lg:grid-cols-2">

//           {/* ==================================================
//               DEMAND
//           ================================================== */}

//           <Panel
//             title="Predicted demand by zone"
//             subtitle="Forecast for the current operating window"
//             icon={<TrendingUp size={17} />}
//           >
//             <div className="h-[340px] w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={demandChartData}
//                   margin={{
//                     top: 10,
//                     right: 15,
//                     left: 15,
//                     bottom: 35,
//                   }}
//                 >
//                   <CartesianGrid
//                     stroke="#eee4c7"
//                     strokeDasharray="3 3"
//                     vertical={false}
//                   />

//                   <XAxis
//                     dataKey="zone"
//                     tick={{
//                       fill: "#806f3c",
//                       fontSize: 11,
//                     }}
//                     axisLine={{
//                       stroke: "#dfd2ad",
//                     }}
//                     tickLine={false}
//                     label={{
//                       value: "Zone",
//                       position: "insideBottom",
//                       offset: -20,
//                       fill: "#6f5c22",
//                       fontSize: 12,
//                       fontWeight: 600,
//                     }}
//                   />

//                   <YAxis
//                     tick={{
//                       fill: "#806f3c",
//                       fontSize: 11,
//                     }}
//                     axisLine={false}
//                     tickLine={false}
//                     label={{
//                       value: "Predicted Demand",
//                       angle: -90,
//                       position: "insideLeft",
//                       offset: 0,
//                       fill: "#6f5c22",
//                       fontSize: 12,
//                       fontWeight: 600,
//                     }}
//                   />

//                   <Tooltip
//                     cursor={{
//                       fill: "#fff8dc",
//                     }}
//                     content={<ChartTooltip suffix=" rides" />}
//                   />

//                   <Bar
//                     dataKey="demand"
//                     name="Predicted Demand"
//                     radius={[10, 10, 0, 0]}
//                     fill="#f5b700"
//                     activeBar={{
//                       fill: "#d99d00",
//                     }}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>

//           {/* ==================================================
//               RISK
//           ================================================== */}

//           <Panel
//             title="Fleet risk distribution"
//             subtitle="Current operational risk across the fleet"
//             icon={<AlertTriangle size={17} />}
//           >
//             <div className="h-[340px] w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={riskChartData}
//                   margin={{
//                     top: 10,
//                     right: 15,
//                     left: 15,
//                     bottom: 35,
//                   }}
//                 >
//                   <CartesianGrid
//                     stroke="#eee4c7"
//                     strokeDasharray="3 3"
//                     vertical={false}
//                   />

//                   <XAxis
//                     dataKey="level"
//                     tick={{
//                       fill: "#806f3c",
//                       fontSize: 11,
//                     }}
//                     axisLine={{
//                       stroke: "#dfd2ad",
//                     }}
//                     tickLine={false}
//                     label={{
//                       value: "Risk Level",
//                       position: "insideBottom",
//                       offset: -20,
//                       fill: "#6f5c22",
//                       fontSize: 12,
//                       fontWeight: 600,
//                     }}
//                   />

//                   <YAxis
//                     allowDecimals={false}
//                     tick={{
//                       fill: "#806f3c",
//                       fontSize: 11,
//                     }}
//                     axisLine={false}
//                     tickLine={false}
//                     label={{
//                       value: "Number of Scooters",
//                       angle: -90,
//                       position: "insideLeft",
//                       offset: 0,
//                       fill: "#6f5c22",
//                       fontSize: 12,
//                       fontWeight: 600,
//                     }}
//                   />

//                   <Tooltip
//                     cursor={{
//                       fill: "#fff8dc",
//                     }}
//                     content={<ChartTooltip suffix=" scooters" />}
//                   />

//                   <Bar
//                     dataKey="scooters"
//                     name="Scooters"
//                     radius={[10, 10, 0, 0]}
//                     fill="#e6ad16"
//                     activeBar={{
//                       fill: "#c99100",
//                     }}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>

//             <p className="mt-4 text-sm leading-6 text-[#806f3c]">
//               Risk combines battery level, vehicle health,
//               utilization and vehicle age.
//             </p>
//           </Panel>

//           {/* ==================================================
//               BATTERY
//           ================================================== */}

//           <Panel
//             title="Battery distribution"
//             subtitle="Available energy across active scooters"
//             icon={<Battery size={17} />}
//           >
//             <div className="h-[340px] w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={batteryChartData}
//                   margin={{
//                     top: 10,
//                     right: 15,
//                     left: 15,
//                     bottom: 35,
//                   }}
//                 >
//                   <CartesianGrid
//                     stroke="#eee4c7"
//                     strokeDasharray="3 3"
//                     vertical={false}
//                   />

//                   <XAxis
//                     dataKey="range"
//                     tick={{
//                       fill: "#806f3c",
//                       fontSize: 11,
//                     }}
//                     axisLine={{
//                       stroke: "#dfd2ad",
//                     }}
//                     tickLine={false}
//                     label={{
//                       value: "Battery Level (%)",
//                       position: "insideBottom",
//                       offset: -20,
//                       fill: "#6f5c22",
//                       fontSize: 12,
//                       fontWeight: 600,
//                     }}
//                   />

//                   <YAxis
//                     allowDecimals={false}
//                     tick={{
//                       fill: "#806f3c",
//                       fontSize: 11,
//                     }}
//                     axisLine={false}
//                     tickLine={false}
//                     label={{
//                       value: "Number of Scooters",
//                       angle: -90,
//                       position: "insideLeft",
//                       offset: 0,
//                       fill: "#6f5c22",
//                       fontSize: 12,
//                       fontWeight: 600,
//                     }}
//                   />

//                   <Tooltip
//                     cursor={{
//                       fill: "#fff8dc",
//                     }}
//                     content={<ChartTooltip suffix=" scooters" />}
//                   />

//                   <Bar
//                     dataKey="scooters"
//                     name="Scooters"
//                     radius={[10, 10, 0, 0]}
//                     fill="#e8c75e"
//                     activeBar={{
//                       fill: "#d3a824",
//                     }}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>

//           {/* ==================================================
//               ECONOMICS
//           ================================================== */}

//           <Panel
//             title="Contribution margin"
//             subtitle="Financial outcome of deployment decisions"
//             icon={<Zap size={17} />}
//           >
//             <div className="grid grid-cols-2 gap-4">
//               <Economic
//                 label="Baseline"
//                 value="₹1,371"
//               />

//               <Economic
//                 label="Optimized"
//                 value="₹2,709"
//                 highlight
//               />

//               <Economic
//                 label="Improvement"
//                 value="+₹1,338"
//                 highlight
//               />

//               <Economic
//                 label="Optimal move"
//                 value="6 scooters"
//               />
//             </div>

//             <p className="mt-6 text-sm leading-6 text-[#806f3c]">
//               Contribution margin accounts for revenue,
//               energy, relocation and deployment risk.
//             </p>
//           </Panel>
//         </section>

//         {/* ==================================================
//             COUNTERFACTUAL
//         ================================================== */}

//         <section className="mt-12">
//           <SectionTitle title="Deployment counterfactual" />

//           <div className="mt-5 overflow-hidden rounded-3xl border border-[#ead9a1] bg-white shadow-[0_12px_40px_rgba(120,90,0,0.07)]">

//             <div className="border-b border-[#f0e5c1] bg-gradient-to-r from-[#fffdf7] to-[#fff7d9] px-7 py-6">

//               <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

//                 <div>
//                   <div className="text-lg font-semibold text-[#30270d]">
//                     Find the financially optimal move
//                   </div>

//                   <div className="mt-1.5 text-sm text-[#806f3c]">
//                     Compare contribution margin as more
//                     scooters are deployed.
//                   </div>
//                 </div>

//                 <div className="rounded-xl bg-[#fff0b7] px-5 py-3">
//                   <div className="text-xs font-medium text-[#8b711e]">
//                     Best outcome
//                   </div>

//                   <div className="mt-1 font-mono text-2xl font-bold text-[#b47e00]">
//                     ₹2,709
//                   </div>
//                 </div>

//               </div>
//             </div>

//             <div className="px-7 pb-8 pt-8">

//               <div className="h-[360px] w-full">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart
//                     data={counterfactualChartData}
//                     margin={{
//                       top: 15,
//                       right: 20,
//                       left: 20,
//                       bottom: 45,
//                     }}
//                   >
//                     <CartesianGrid
//                       stroke="#eee4c7"
//                       strokeDasharray="3 3"
//                       vertical={false}
//                     />

//                     <XAxis
//                       dataKey="scooters"
//                       type="number"
//                       domain={[
//                         0,
//                         "dataMax",
//                       ]}
//                       allowDecimals={false}
//                       tick={{
//                         fill: "#806f3c",
//                         fontSize: 11,
//                       }}
//                       axisLine={{
//                         stroke: "#dfd2ad",
//                       }}
//                       tickLine={false}
//                       label={{
//                         value: "Scooters Moved",
//                         position: "insideBottom",
//                         offset: -28,
//                         fill: "#6f5c22",
//                         fontSize: 12,
//                         fontWeight: 600,
//                       }}
//                     />

//                     <YAxis
//                       tick={{
//                         fill: "#806f3c",
//                         fontSize: 11,
//                       }}
//                       axisLine={false}
//                       tickLine={false}
//                       tickFormatter={(value) =>
//                         `₹${value.toLocaleString()}`
//                       }
//                       label={{
//                         value: "Contribution Margin (₹)",
//                         angle: -90,
//                         position: "insideLeft",
//                         offset: 0,
//                         fill: "#6f5c22",
//                         fontSize: 12,
//                         fontWeight: 600,
//                       }}
//                     />

//                     <Tooltip
//                       content={
//                         <CounterfactualTooltip />
//                       }
//                     />

//                     <Line
//                       type="monotone"
//                       dataKey="margin"
//                       name="Contribution Margin"
//                       stroke="#e5a900"
//                       strokeWidth={4}
//                       dot={{
//                         r: 5,
//                         fill: "#f5b700",
//                         stroke: "#fff",
//                         strokeWidth: 2,
//                       }}
//                       activeDot={{
//                         r: 8,
//                         fill: "#c88f00",
//                         stroke: "#fff",
//                         strokeWidth: 3,
//                       }}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="mt-2 rounded-2xl border border-[#ead9a1] bg-[#fffdf7] px-5 py-4">
//                 <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

//                   <div>
//                     <div className="text-xs font-semibold text-[#806f3c]">
//                       Financial optimum
//                     </div>

//                     <div className="mt-1 text-sm text-[#514719]">
//                       6 scooters moved
//                     </div>
//                   </div>

//                   <div className="font-mono text-lg font-bold text-[#b47e00]">
//                     ₹2,709 margin
//                   </div>

//                 </div>
//               </div>

//             </div>
//           </div>
//         </section>

//         {/* ==================================================
//             RECOMMENDATION
//         ================================================== */}

//         <section className="mt-12">
//           <SectionTitle title="Current recommendation" />

//           <div className="mt-5 overflow-hidden rounded-3xl border border-[#dfc45f] bg-gradient-to-br from-[#fffdf7] via-[#fff9df] to-[#ffefaa] shadow-[0_14px_45px_rgba(139,105,0,0.10)]">

//             <div className="border-b border-[#ead9a1] px-7 py-6">

//               <div className="text-lg font-semibold text-[#30270d]">
//                 Deploy where the economics are strongest
//               </div>

//               <p className="mt-2 max-w-2xl text-sm leading-6 text-[#806f3c]">
//                 FleetMind's current optimization points toward
//                 Majestic while keeping low-battery and high-risk
//                 scooters out of the relocation pool.
//               </p>

//             </div>

//             <div className="grid gap-px bg-[#ead9a1] md:grid-cols-4">

//               <Recommendation
//                 label="Move"
//                 value={`${recommendation.scooters_to_move ?? 6} scooters`}
//               />

//               <Recommendation
//                 label="Target zone"
//                 value="Majestic"
//               />

//               <Recommendation
//                 label="Expected trips"
//                 value={
//                   recommendation.expected_trips ??
//                   36.45
//                 }
//               />

//               <Recommendation
//                 label="Contribution margin"
//                 value={`₹${Math.round(
//                   recommendation.contribution_margin ??
//                   2709
//                 ).toLocaleString()}`}
//                 highlight
//               />

//             </div>

//             <div className="px-7 py-6">

//               <p className="text-sm leading-7 text-[#665a32]">
//                 Moving more scooters initially increases
//                 expected rides, but diminishing utilization
//                 and additional operating costs eventually
//                 reduce contribution margin. Six scooters is
//                 the current financial optimum.
//               </p>

//             </div>
//           </div>
//         </section>

//         {/* ==================================================
//             MAP
//         ================================================== */}

//         <section className="mt-12 pb-16">
//           <SectionTitle title="Fleet zone map" />

//           <div className="mt-5 overflow-hidden rounded-3xl border border-[#ead9a1] bg-white p-2 shadow-[0_12px_40px_rgba(120,90,0,0.07)]">
//             <FleetMap
//               zoneDistribution={zoneDistribution}
//             />
//           </div>
//         </section>

//       </main>
//     </div>
//   );
// }


// /* ============================================================
//    SECTION TITLE
// ============================================================ */

// function SectionTitle({ title }) {
//   return (
//     <div className="flex items-center gap-3">
//       <div className="h-1.5 w-1.5 rounded-full bg-[#f5b700]" />

//       <h2 className="text-sm font-semibold text-[#6f5c22]">
//         {title}
//       </h2>
//     </div>
//   );
// }


// /* ============================================================
//    METRIC
// ============================================================ */

// function Metric({ label, value }) {
//   return (
//     <div className="group rounded-2xl border border-[#ead9a1] bg-white p-5 shadow-[0_7px_24px_rgba(120,90,0,0.045)] transition duration-300 hover:-translate-y-1 hover:border-[#dfc35f] hover:shadow-[0_14px_35px_rgba(120,90,0,0.10)]">

//       <div className="text-xs font-medium text-[#a18d51]">
//         {label}
//       </div>

//       <div className="mt-3 font-mono text-2xl font-semibold tracking-tight text-[#30270d]">
//         {value}
//       </div>

//       <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#fff0b7]">
//         <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#e7a900] to-[#ffd95a]" />
//       </div>

//     </div>
//   );
// }


// /* ============================================================
//    PANEL
// ============================================================ */

// function Panel({
//   title,
//   subtitle,
//   icon,
//   children,
// }) {
//   return (
//     <div className="group rounded-3xl border border-[#ead9a1] bg-white p-6 shadow-[0_9px_32px_rgba(120,90,0,0.055)] transition duration-300 hover:-translate-y-1 hover:border-[#dfc35f] hover:shadow-[0_16px_45px_rgba(120,90,0,0.10)] md:p-7">

//       <div className="flex items-start gap-3">

//         <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#fff0b7] to-[#fff9df] text-[#c18c00] shadow-sm">
//           {icon}
//         </div>

//         <div>
//           <div className="text-base font-semibold text-[#403716]">
//             {title}
//           </div>

//           <div className="mt-1 text-xs text-[#a18d51]">
//             {subtitle}
//           </div>
//         </div>

//       </div>

//       <div className="mt-7">
//         {children}
//       </div>

//     </div>
//   );
// }


// /* ============================================================
//    ECONOMIC
// ============================================================ */

// function Economic({
//   label,
//   value,
//   highlight = false,
// }) {
//   return (
//     <div
//       className={
//         highlight
//           ? "rounded-2xl border border-[#e3c65d] bg-gradient-to-br from-[#fff7d3] to-[#ffed9f] p-5 shadow-[0_7px_20px_rgba(245,183,0,0.08)] transition duration-300 hover:-translate-y-0.5"
//           : "rounded-2xl border border-[#ead9a1] bg-[#fffdf8] p-5 transition duration-300 hover:-translate-y-0.5 hover:bg-[#fffaf0]"
//       }
//     >

//       <div className="text-xs font-medium text-[#9a8241]">
//         {label}
//       </div>

//       <div
//         className={
//           highlight
//             ? "mt-3 font-mono text-2xl font-bold text-[#ae7900]"
//             : "mt-3 font-mono text-2xl font-semibold text-[#3b3215]"
//         }
//       >
//         {value}
//       </div>

//     </div>
//   );
// }


// /* ============================================================
//    RECOMMENDATION
// ============================================================ */

// function Recommendation({
//   label,
//   value,
//   highlight = false,
// }) {
//   return (
//     <div
//       className={
//         highlight
//           ? "bg-gradient-to-br from-[#fff0b7] to-[#ffe48b] px-6 py-5"
//           : "bg-white px-6 py-5"
//       }
//     >

//       <div className="text-xs font-medium text-[#9a8241]">
//         {label}
//       </div>

//       <div
//         className={
//           highlight
//             ? "mt-2 font-mono text-xl font-bold text-[#aa7500]"
//             : "mt-2 font-mono text-xl font-semibold text-[#3b3215]"
//         }
//       >
//         {value}
//       </div>

//     </div>
//   );
// }


// /* ============================================================
//    CHART TOOLTIP
// ============================================================ */

// function ChartTooltip({
//   active,
//   payload,
//   label,
//   suffix = "",
// }) {
//   if (!active || !payload || !payload.length) {
//     return null;
//   }

//   return (
//     <div className="rounded-xl border border-[#e4cd83] bg-white px-4 py-3 shadow-[0_12px_30px_rgba(100,75,0,0.14)]">

//       <div className="text-xs font-medium text-[#8b711e]">
//         {label}
//       </div>

//       <div className="mt-1 font-mono text-sm font-bold text-[#30270d]">
//         {Number(payload[0].value).toLocaleString()}
//         {suffix}
//       </div>

//     </div>
//   );
// }


// /* ============================================================
//    COUNTERFACTUAL TOOLTIP
// ============================================================ */

// function CounterfactualTooltip({
//   active,
//   payload,
// }) {
//   if (!active || !payload || !payload.length) {
//     return null;
//   }

//   const scooters =
//     payload[0]?.payload?.scooters;

//   const margin =
//     payload[0]?.payload?.margin;

//   return (
//     <div className="rounded-xl border border-[#e4cd83] bg-white px-4 py-3 shadow-[0_12px_30px_rgba(100,75,0,0.14)]">

//       <div className="text-xs font-medium text-[#8b711e]">
//         Scooters moved
//       </div>

//       <div className="font-mono text-sm font-bold text-[#30270d]">
//         {scooters}
//       </div>

//       <div className="mt-2 text-xs font-medium text-[#8b711e]">
//         Contribution margin
//       </div>

//       <div className="font-mono text-sm font-bold text-[#b47e00]">
//         ₹{Number(margin).toLocaleString()}
//       </div>

//     </div>
//   );
// }


// /* ============================================================
//    ZONE NAME
// ============================================================ */

// function shortZone(zone) {
//   if (!zone) return "Fleet";

//   if (zone.includes("Nadaprabhu")) {
//     return "Majestic";
//   }

//   if (zone === "Mahatma Gandhi Road") {
//     return "MG Road";
//   }

//   if (zone === "Krishnarajapura") {
//     return "KR Puram";
//   }

//   return zone;
// }

import React, { useEffect, useState } from "react";

import {
  TrendingUp,
  Battery,
  AlertTriangle,
  Zap,
  RefreshCw,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

import FleetMap from "../components/FleetMap";

const API = "http://127.0.0.1:8000";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadAnalytics() {
    try {
      setLoading(true);

      const response = await fetch(`${API}/api/analytics`);
      const result = await response.json();

      console.log("FleetMind analytics:", result);

      setData(result?.data || {});
    } catch (error) {
      console.error("Analytics error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffaf0] p-10 text-[#806f3c]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff0b7]">
            <RefreshCw
              size={16}
              className="animate-spin text-[#d3ad35]"
            />
          </div>

          <span className="text-sm font-medium">
            Loading fleet analytics...
          </span>
        </div>
      </div>
    );
  }

  const fleet = data?.fleet || {};
  const zoneDemand = data?.zone_demand || [];
  const battery = data?.battery_distribution || {};
  const risk = data?.risk_distribution || {};
  const counterfactual = data?.counterfactual || [];
  const recommendation = data?.recommendation || {};
  const zoneDistribution = data?.zone_distribution || {};

  /* =========================================================
     CHART DATA
  ========================================================= */

  const demandChartData = zoneDemand.map((item) => ({
    zone: shortZone(item.name),
    demand: Math.round(item.value || 0),
  }));

  const riskChartData = [
    {
      level: "Critical",
      scooters: risk.critical ?? 4,
    },
    {
      level: "Elevated",
      scooters: risk.elevated ?? 2,
    },
    {
      level: "Normal",
      scooters: risk.normal ?? 19,
    },
  ];

  const batteryChartData = [
    {
      range: "0–30%",
      scooters: battery["0-30"] ?? 10,
    },
    {
      range: "31–60%",
      scooters: battery["31-60"] ?? 5,
    },
    {
      range: "61–80%",
      scooters: battery["61-80"] ?? 5,
    },
    {
      range: "81–100%",
      scooters: battery["81-100"] ?? 5,
    },
  ];

  const counterfactualChartData = counterfactual.map((item) => ({
    scooters: item.scooters,
    margin: Math.round(item.margin || 0),
  }));

  return (
    <div className="min-h-screen bg-[#fffaf0] text-[#30270d]">
      <main className="mx-auto max-w-[1350px] px-6 py-9 lg:px-10">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-[#e8c75e] shadow-[0_0_12px_rgba(232,199,94,0.45)]" />

              <span className="text-sm font-semibold tracking-[0.14em] text-[#8b711e]">
                FLEETMIND
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.035em] text-[#30270d]">
              Fleet analytics
            </h1>

            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#806f3c]">
              A live view of fleet availability, demand,
              vehicle risk and deployment economics.
            </p>
          </div>

          <button
            onClick={loadAnalytics}
            className="flex w-fit items-center gap-2 rounded-xl border border-[#e4cd83] bg-white px-4 py-2.5 text-sm font-medium text-[#806f3c] shadow-[0_6px_20px_rgba(120,90,0,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[#d7b73e] hover:bg-[#fff9df] hover:text-[#4d401d]"
          >
            <RefreshCw size={14} />
            Refresh data
          </button>
        </div>

        {/* =====================================================
            FLEET OVERVIEW
        ===================================================== */}

        <section className="mt-12">
          <SectionTitle title="Fleet overview" />

          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <Metric
              label="Scooters"
              value={fleet.total_scooters ?? 25}
            />

            <Metric
              label="Zones"
              value={fleet.zones ?? 5}
            />

            <Metric
              label="Average battery"
              value={`${fleet.average_battery ?? 58.32}%`}
            />

            <Metric
              label="Average health"
              value={`${fleet.average_health ?? 82.88}%`}
            />

            <Metric
              label="Low battery"
              value={fleet.low_battery_scooters ?? 10}
            />

            <Metric
              label="High risk"
              value={fleet.high_risk_scooters ?? 6}
            />
          </div>
        </section>

        {/* =====================================================
            ANALYTICS GRID
        ===================================================== */}

        <section className="mt-12 grid gap-5 lg:grid-cols-2">

          {/* ===================================================
              PREDICTED DEMAND
          =================================================== */}

          <Panel
            title="Predicted demand by zone"
            subtitle="Forecast for the current operating window"
            icon={<TrendingUp size={17} />}
          >
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={demandChartData}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 25,
                    bottom: 50,
                  }}
                >
                  <CartesianGrid
                    stroke="#eee4c7"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="zone"
                    tick={{
                      fill: "#806f3c",
                      fontSize: 11,
                    }}
                    axisLine={{
                      stroke: "#dfd2ad",
                    }}
                    tickLine={false}
                    label={{
                      value: "Zone",
                      position: "insideBottom",
                      offset: -32,
                      fill: "#6f5c22",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />

                  <YAxis
                    tick={{
                      fill: "#806f3c",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    label={{
                      value: "Predicted Demand",
                      angle: -90,
                      position: "insideLeft",
                      offset: 5,
                      fill: "#6f5c22",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />

                  <Tooltip
                    cursor={{
                      fill: "#fff9df",
                    }}
                    content={
                      <ChartTooltip suffix=" rides" />
                    }
                  />

                  <Bar
                    dataKey="demand"
                    name="Predicted Demand"
                    radius={[10, 10, 0, 0]}
                    fill="#e8c75e"
                    activeBar={{
                      fill: "#d9b63f",
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          {/* ===================================================
              RISK
          =================================================== */}

          <Panel
            title="Fleet risk distribution"
            subtitle="Current operational risk across the fleet"
            icon={<AlertTriangle size={17} />}
          >
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={riskChartData}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 25,
                    bottom: 50,
                  }}
                >
                  <CartesianGrid
                    stroke="#eee4c7"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="level"
                    tick={{
                      fill: "#806f3c",
                      fontSize: 11,
                    }}
                    axisLine={{
                      stroke: "#dfd2ad",
                    }}
                    tickLine={false}
                    label={{
                      value: "Risk Level",
                      position: "insideBottom",
                      offset: -32,
                      fill: "#6f5c22",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fill: "#806f3c",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                    label={{
                      value: "Number of Scooters",
                      angle: -90,
                      position: "insideLeft",
                      offset: 5,
                      fill: "#6f5c22",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />

                  <Tooltip
                    cursor={{
                      fill: "#fff9df",
                    }}
                    content={
                      <ChartTooltip suffix=" scooters" />
                    }
                  />

                  <Bar
                    dataKey="scooters"
                    name="Scooters"
                    radius={[10, 10, 0, 0]}
                    fill="#e8c75e"
                    activeBar={{
                      fill: "#d9b63f",
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#806f3c]">
              Risk combines battery level, vehicle health,
              utilization and vehicle age.
            </p>
          </Panel>

          {/* ===================================================
              BATTERY
          =================================================== */}

          <Panel
            title="Battery distribution"
            subtitle="Available energy across active scooters"
            icon={<Battery size={17} />}
          >
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={batteryChartData}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 25,
                    bottom: 50,
                  }}
                >
                  <CartesianGrid
                    stroke="#eee4c7"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="range"
                    tick={{
                      fill: "#806f3c",
                      fontSize: 11,
                    }}
                    axisLine={{
                      stroke: "#dfd2ad",
                    }}
                    tickLine={false}
                    label={{
                      value: "Battery Level (%)",
                      position: "insideBottom",
                      offset: -32,
                      fill: "#6f5c22",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fill: "#806f3c",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                    label={{
                      value: "Number of Scooters",
                      angle: -90,
                      position: "insideLeft",
                      offset: 5,
                      fill: "#6f5c22",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />

                  <Tooltip
                    cursor={{
                      fill: "#fff9df",
                    }}
                    content={
                      <ChartTooltip suffix=" scooters" />
                    }
                  />

                  <Bar
                    dataKey="scooters"
                    name="Scooters"
                    radius={[10, 10, 0, 0]}
                    fill="#e8c75e"
                    activeBar={{
                      fill: "#d9b63f",
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          {/* ===================================================
              ECONOMICS
          =================================================== */}

          <Panel
            title="Contribution margin"
            subtitle="Financial outcome of deployment decisions"
            icon={<Zap size={17} />}
          >
            <div className="grid grid-cols-2 gap-4">
              <Economic
                label="Baseline"
                value="₹1,371"
              />

              <Economic
                label="Optimized"
                value="₹2,709"
                highlight
              />

              <Economic
                label="Improvement"
                value="+₹1,338"
                highlight
              />

              <Economic
                label="Optimal move"
                value="6 scooters"
              />
            </div>

            <p className="mt-6 text-sm leading-6 text-[#806f3c]">
              Contribution margin accounts for revenue,
              energy, relocation and deployment risk.
            </p>
          </Panel>
        </section>

        {/* =====================================================
            DEPLOYMENT COUNTERFACTUAL
        ===================================================== */}

        <section className="mt-12">
          <SectionTitle title="Deployment counterfactual" />

          <div className="mt-5 overflow-hidden rounded-3xl border border-[#ead9a1] bg-white shadow-[0_12px_40px_rgba(120,90,0,0.07)]">

            {/* HEADER */}

            <div className="border-b border-[#f0e5c1] bg-gradient-to-r from-[#fffdf7] to-[#fff7d9] px-7 py-6">

              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div>
                  <div className="text-lg font-semibold text-[#30270d]">
                    Find the financially optimal move
                  </div>

                  <div className="mt-1.5 text-sm text-[#806f3c]">
                    Compare contribution margin as more
                    scooters are deployed.
                  </div>
                </div>

                <div className="rounded-xl bg-[#fff0b7] px-5 py-3">
                  <div className="text-xs font-medium text-[#8b711e]">
                    Best outcome
                  </div>

                  <div className="mt-1 font-mono text-2xl font-bold text-[#b47e00]">
                    ₹2,709
                  </div>
                </div>

              </div>
            </div>

            {/* BAR CHART */}

            <div className="px-7 pb-8 pt-8">

              <div className="h-[370px] w-full">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={counterfactualChartData}
                    margin={{
                      top: 20,
                      right: 20,
                      left: 30,
                      bottom: 55,
                    }}
                  >

                    <CartesianGrid
                      stroke="#eee4c7"
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="scooters"
                      tick={{
                        fill: "#806f3c",
                        fontSize: 11,
                      }}
                      axisLine={{
                        stroke: "#dfd2ad",
                      }}
                      tickLine={false}
                      label={{
                        value: "Scooters Moved",
                        position: "insideBottom",
                        offset: -35,
                        fill: "#6f5c22",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    />

                    <YAxis
                      tick={{
                        fill: "#806f3c",
                        fontSize: 11,
                      }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) =>
                        `₹${value.toLocaleString()}`
                      }
                      label={{
                        value: "Contribution Margin (₹)",
                        angle: -90,
                        position: "insideLeft",
                        offset: 5,
                        fill: "#6f5c22",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    />

                    <Tooltip
                      cursor={{
                        fill: "#fff9df",
                      }}
                      content={
                        <CounterfactualTooltip />
                      }
                    />

                    <Bar
                      dataKey="margin"
                      name="Contribution Margin"
                      radius={[10, 10, 0, 0]}
                    >
                      {counterfactualChartData.map(
                        (item) => (
                          <Cell
                            key={item.scooters}
                            fill={
                              item.scooters === 6
                                ? "#d9ad32"
                                : "#e8c75e"
                            }
                          />
                        )
                      )}
                    </Bar>

                  </BarChart>

                </ResponsiveContainer>

              </div>

              {/* OPTIMUM INFORMATION */}

              <div className="mt-3 rounded-2xl border border-[#ead9a1] bg-[#fffdf7] px-5 py-4">

                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

                  <div>

                    <div className="text-xs font-semibold text-[#806f3c]">
                      Financial optimum
                    </div>

                    <div className="mt-1 text-sm text-[#514719]">
                      6 scooters moved
                    </div>

                  </div>

                  <div className="font-mono text-lg font-bold text-[#b47e00]">
                    ₹2,709 margin
                  </div>

                </div>

              </div>

            </div>
          </div>
        </section>

        {/* =====================================================
            CURRENT RECOMMENDATION
        ===================================================== */}

        <section className="mt-12">
          <SectionTitle title="Current recommendation" />

          <div className="mt-5 overflow-hidden rounded-3xl border border-[#dfc45f] bg-gradient-to-br from-[#fffdf7] via-[#fff9df] to-[#ffefaa] shadow-[0_14px_45px_rgba(139,105,0,0.10)]">

            <div className="border-b border-[#ead9a1] px-7 py-6">

              <div className="text-lg font-semibold text-[#30270d]">
                Deploy where the economics are strongest
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#806f3c]">
                FleetMind's current optimization points toward
                Majestic while keeping low-battery and high-risk
                scooters out of the relocation pool.
              </p>

            </div>

            <div className="grid gap-px bg-[#ead9a1] md:grid-cols-4">

              <Recommendation
                label="Move"
                value={`${recommendation.scooters_to_move ?? 6} scooters`}
              />

              <Recommendation
                label="Target zone"
                value="Majestic"
              />

              <Recommendation
                label="Expected trips"
                value={
                  recommendation.expected_trips ??
                  36.45
                }
              />

              <Recommendation
                label="Contribution margin"
                value={`₹${Math.round(
                  recommendation.contribution_margin ??
                  2709
                ).toLocaleString()}`}
                highlight
              />

            </div>

            <div className="px-7 py-6">

              <p className="text-sm leading-7 text-[#665a32]">
                Moving more scooters initially increases
                expected rides, but diminishing utilization
                and additional operating costs eventually
                reduce contribution margin. Six scooters is
                the current financial optimum.
              </p>

            </div>

          </div>
        </section>

        {/* =====================================================
            FLEET MAP
        ===================================================== */}

        <section className="mt-12 pb-16">

          <SectionTitle title="Fleet zone map" />

          <div className="mt-5 overflow-hidden rounded-3xl border border-[#ead9a1] bg-white p-2 shadow-[0_12px_40px_rgba(120,90,0,0.07)]">

            <FleetMap
              zoneDistribution={zoneDistribution}
            />

          </div>

        </section>

      </main>
    </div>
  );
}


/* ============================================================
   SECTION TITLE
============================================================ */

function SectionTitle({ title }) {
  return (
    <div className="flex items-center gap-3">

      <div className="h-1.5 w-1.5 rounded-full bg-[#e8c75e]" />

      <h2 className="text-sm font-semibold text-[#6f5c22]">
        {title}
      </h2>

    </div>
  );
}


/* ============================================================
   METRIC
============================================================ */

function Metric({
  label,
  value,
}) {
  return (
    <div className="group rounded-2xl border border-[#ead9a1] bg-white p-5 shadow-[0_7px_24px_rgba(120,90,0,0.045)] transition duration-300 hover:-translate-y-1 hover:border-[#dfc35f] hover:shadow-[0_14px_35px_rgba(120,90,0,0.10)]">

      <div className="text-xs font-medium text-[#a18d51]">
        {label}
      </div>

      <div className="mt-3 font-mono text-2xl font-semibold tracking-tight text-[#30270d]">
        {value}
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#fff0b7]">

        <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#e8c75e] to-[#f4d982]" />

      </div>

    </div>
  );
}


/* ============================================================
   PANEL
============================================================ */

function Panel({
  title,
  subtitle,
  icon,
  children,
}) {
  return (
    <div className="group rounded-3xl border border-[#ead9a1] bg-white p-6 shadow-[0_9px_32px_rgba(120,90,0,0.055)] transition duration-300 hover:-translate-y-1 hover:border-[#dfc35f] hover:shadow-[0_16px_45px_rgba(120,90,0,0.10)] md:p-7">

      <div className="flex items-start gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#fff0b7] to-[#fff9df] text-[#b8952d] shadow-sm">

          {icon}

        </div>

        <div>

          <div className="text-base font-semibold text-[#403716]">
            {title}
          </div>

          <div className="mt-1 text-xs text-[#a18d51]">
            {subtitle}
          </div>

        </div>

      </div>

      <div className="mt-7">
        {children}
      </div>

    </div>
  );
}


/* ============================================================
   ECONOMIC
============================================================ */

function Economic({
  label,
  value,
  highlight = false,
}) {
  return (
    <div
      className={
        highlight
          ? "rounded-2xl border border-[#e3c65d] bg-gradient-to-br from-[#fff7d3] to-[#ffed9f] p-5 shadow-[0_7px_20px_rgba(245,183,0,0.08)] transition duration-300 hover:-translate-y-0.5"
          : "rounded-2xl border border-[#ead9a1] bg-[#fffdf8] p-5 transition duration-300 hover:-translate-y-0.5 hover:bg-[#fffaf0]"
      }
    >

      <div className="text-xs font-medium text-[#9a8241]">
        {label}
      </div>

      <div
        className={
          highlight
            ? "mt-3 font-mono text-2xl font-bold text-[#ae7900]"
            : "mt-3 font-mono text-2xl font-semibold text-[#3b3215]"
        }
      >
        {value}
      </div>

    </div>
  );
}


/* ============================================================
   RECOMMENDATION
============================================================ */

function Recommendation({
  label,
  value,
  highlight = false,
}) {
  return (
    <div
      className={
        highlight
          ? "bg-gradient-to-br from-[#fff0b7] to-[#ffe48b] px-6 py-5"
          : "bg-white px-6 py-5"
      }
    >

      <div className="text-xs font-medium text-[#9a8241]">
        {label}
      </div>

      <div
        className={
          highlight
            ? "mt-2 font-mono text-xl font-bold text-[#aa7500]"
            : "mt-2 font-mono text-xl font-semibold text-[#3b3215]"
        }
      >
        {value}
      </div>

    </div>
  );
}


/* ============================================================
   CHART TOOLTIP
============================================================ */

function ChartTooltip({
  active,
  payload,
  label,
  suffix = "",
}) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-[#e4cd83] bg-white px-4 py-3 shadow-[0_12px_30px_rgba(100,75,0,0.14)]">

      <div className="text-xs font-medium text-[#8b711e]">
        {label}
      </div>

      <div className="mt-1 font-mono text-sm font-bold text-[#30270d]">
        {Number(payload[0].value).toLocaleString()}
        {suffix}
      </div>

    </div>
  );
}


/* ============================================================
   COUNTERFACTUAL TOOLTIP
============================================================ */

function CounterfactualTooltip({
  active,
  payload,
}) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const scooters =
    payload[0]?.payload?.scooters;

  const margin =
    payload[0]?.payload?.margin;

  return (
    <div className="rounded-xl border border-[#e4cd83] bg-white px-4 py-3 shadow-[0_12px_30px_rgba(100,75,0,0.14)]">

      <div className="text-xs font-medium text-[#8b711e]">
        Scooters moved
      </div>

      <div className="font-mono text-sm font-bold text-[#30270d]">
        {scooters}
      </div>

      <div className="mt-2 text-xs font-medium text-[#8b711e]">
        Contribution margin
      </div>

      <div className="font-mono text-sm font-bold text-[#b47e00]">
        ₹{Number(margin).toLocaleString()}
      </div>

    </div>
  );
}


/* ============================================================
   ZONE NAME
============================================================ */

function shortZone(zone) {
  if (!zone) return "Fleet";

  if (zone.includes("Nadaprabhu")) {
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