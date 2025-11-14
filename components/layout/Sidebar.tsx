'use client';
import Link from 'next/link';
import {
  Home,
  Box,
  Truck,
  List,
  Settings,
  LogOut,
  ChevronLeft,
} from 'lucide-react';

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

function NavItem({
  href,
  icon: Icon,
  label,
  collapsed,
}: {
  href: string;
  icon: any;
  label: string;
  collapsed: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
        <Icon className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors duration-200 relative z-10" />
        {!collapsed && (
          <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700 transition-colors duration-200 relative z-10">
            {label}
          </span>
        )}
      </Link>
    </li>
  );
}

export default function Sidebar({ collapsed, onToggle }: Props) {
  return (
    <div className="h-screen flex flex-col justify-between bg-white border-r border-slate-200 shadow-sm">
      <div>
        {/* Logo Section */}
        <div className="px-4 py-6 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg">
            B
          </div>
          {!collapsed && (
            <div>
              <div className="font-bold text-slate-800 text-lg">BTP Market</div>
              <div className="text-xs text-slate-500">Gestion complète</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="px-3 mt-6">
          <ul className="space-y-2">
            <NavItem
              href="/"
              icon={Home}
              label="Tableau de bord"
              collapsed={collapsed}
            />
            <NavItem
              href="/supplier/materials"
              icon={Box}
              label="Fournisseurs - Matériaux"
              collapsed={collapsed}
            />
            <NavItem
              href="/supplier/engines"
              icon={Truck}
              label="Fournisseurs - Engins"
              collapsed={collapsed}
            />
            <NavItem
              href="/promoter/index"
              icon={List}
              label="Promoteur - Index"
              collapsed={collapsed}
            />
            <NavItem
              href="/inventory"
              icon={Truck}
              label="Stock & Flotte"
              collapsed={collapsed}
            />
          </ul>

          {/* Collapse Toggle */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <button
              onClick={onToggle}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-all duration-200 group"
            >
              <ChevronLeft
                className={`w-5 h-5 text-slate-600 transition-transform duration-300 ${
                  collapsed ? 'rotate-180' : ''
                }`}
              />
              {!collapsed && (
                <span className="text-sm font-medium text-slate-700">
                  Réduire
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="px-4 py-4 border-t border-slate-100">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-red-50 text-slate-700 hover:text-red-600 transition-all duration-200 group">
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Se déconnecter</span>}
        </button>
      </div>
    </div>
  );
}
