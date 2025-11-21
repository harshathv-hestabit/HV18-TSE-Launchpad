"use client";

import { useState } from "react";
import Sidebar from "@/components/ui/Sidebar";
import Navbar from "@/components/ui/Navbar";

export default function ClientLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex overflow-scroll">

      {sidebarOpen && <Sidebar />}

      <div
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"
          }`}
      >
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="min-h-screen bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
