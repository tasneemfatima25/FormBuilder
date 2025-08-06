import React from 'react'
import { Menu } from 'lucide-react'

export default function Topbar({ onToggleSidebar }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md">
      <button onClick={onToggleSidebar} className="text-gray-700">
        <Menu size={24} />
      </button>
      <h2 className="text-xl font-semibold text-[#189ab4]">FormSpark</h2>
      <div></div> {/* placeholder to center title */}
    </div>
  )
}
