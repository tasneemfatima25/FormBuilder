import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ListTodo, FilePlus2, X } from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Form List', icon: ListTodo, path: '/formlist' },
  { label: 'Create Form', icon: FilePlus2, path: '/builder/new' }
]

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  return (
    <>
      <div
        className={clsx(
          'fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden',
          { hidden: !isOpen }
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed z-40 md:relative top-0 left-0 w-64 h-full bg-gradient-to-br from-[#d8f3f7] to-[#c7eafc] backdrop-blur-2xl shadow-3xl p-6 text-gray-800 border-r border-white/30 transform transition-transform duration-300',
          {
            '-translate-x-full': !isOpen,
            'translate-x-0': isOpen,
            'md:translate-x-0': true
          }
        )}
      >
        {/* Close button on mobile */}
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <h2 className="text-4xl font-bold mb-8 text-center">
          Form<span className="text-[#189ab4]">Spark</span>
        </h2>

        <nav className="space-y-3">
          {navItems.map(({ label, icon: Icon, path }) => (
            <Link
              key={path}
              to={path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition duration-200 hover:bg-[#189ab4]/20 hover:text-[#189ab4] ${
                location.pathname === path ? 'bg-[#189ab4]/10 text-[#189ab4] font-semibold' : ''
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}
