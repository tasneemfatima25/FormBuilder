import React from 'react'
import { Menu } from 'lucide-react'

export default function Topbar({ onToggleSidebar }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md">
      <button onClick={onToggleSidebar} className="text-gray-700">
        <Menu size={28} />
      </button>
      <h2 className="text-4xl font-bold text-center p-2">
          Form<span className="text-[#189ab4]">Spark</span>
        </h2>
      <div></div>
    </div>
  )
}
