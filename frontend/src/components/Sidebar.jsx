import React from "react";
import { NavLink } from "react-router-dom";
import {
  Bot,
  BarChart3,
} from "lucide-react";

export default function Sidebar() {

  return (

    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 border-r border-white/10 bg-[#07090a] lg:block">

      <div className="px-7 py-8">

        <div className="flex items-center gap-3">

          <Bot
            size={17}
            className="text-gray-500"
          />

          <span className="text-xs tracking-[0.25em] text-gray-400">
            FLEETMIND
          </span>

        </div>

        <nav className="mt-12 space-y-2">

          <NavItem
            to="/"
            icon={<Bot size={16} />}
            label="Agent"
          />

          <NavItem
            to="/analytics"
            icon={<BarChart3 size={16} />}
            label="Analytics"
          />

        </nav>

      </div>

    </aside>
  );
}


function NavItem({
  to,
  icon,
  label,
}) {

  return (

    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
          isActive
            ? "bg-white/[0.06] text-gray-100"
            : "text-gray-600 hover:bg-white/[0.03] hover:text-gray-300"
        }`
      }
    >

      {icon}

      {label}

    </NavLink>
  );
}