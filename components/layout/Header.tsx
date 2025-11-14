'use client';
import { Menu, Search, Bell, User } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

export default function Header({
  onToggleSidebar,
  collapsed,
}: {
  onToggleSidebar: () => void;
  collapsed: boolean;
}) {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40 w-full px-6">
      <div className="flex items-center gap-4 py-3 md:py-4 w-full px-0">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>

        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative group">
            <input
              type="search"
              placeholder="Rechercher produit, engin, fournisseur..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 group">
            <Bell className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors duration-200" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="hidden md:block text-right">
              <div className="text-sm font-semibold text-slate-800">Amine</div>
              <div className="text-xs text-slate-500">Administrateur</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold text-sm shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
