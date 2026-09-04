import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import CommandCenter from "./pages/CommandCenter";
import Analytics from "./pages/Analytics";

export default function App() {

  return (

    <BrowserRouter>

      <div className="min-h-screen bg-[#07090a]">

        <Sidebar />

        <div className="lg:pl-64">

          <Routes>

            <Route
              path="/"
              element={<CommandCenter />}
            />

            <Route
              path="/analytics"
              element={<Analytics />}
            />

          </Routes>

        </div>

      </div>

    </BrowserRouter>
  );
}