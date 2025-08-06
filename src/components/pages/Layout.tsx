import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - always shown on md+, toggled on mobile */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        {/* Topbar only visible on mobile (sm, md) */}
        <div className="md:hidden">
          <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-12 bg-gradient-to-br from-[#d8f3f7] to-[#c7eafc] backdrop-blur-xl overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
