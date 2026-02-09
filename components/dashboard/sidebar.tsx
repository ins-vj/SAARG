'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Leaf,
  LayoutDashboard,
  History,
  User,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
    },
    {
      label: 'History',
      icon: History,
      href: '/dashboard/history',
    },
    {
      label: 'Profile',
      icon: User,
      href: '/dashboard/profile',
    },
    {
      label: 'About',
      icon: HelpCircle,
      href: '/dashboard/about',
    },
  ]

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 px-4 py-6 border-b border-gray-200 dark:border-gray-800">
        <Leaf className="w-6 h-6 text-green-600" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">FarmReport</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-800">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>

        {isOpen && (
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setIsOpen(false)}>
            <div
              className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
