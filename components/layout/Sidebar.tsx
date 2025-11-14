'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Box,
  Truck,
  List,
  Settings,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { ZAxis } from 'recharts';
import { useState } from 'react';

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

interface NavItemType {
  href: string;
  icon: any;
  label: string;
  items?: NavItemType[];
  collapsed?: boolean;
}

const extendedNavItems: NavItemType[] = [
  {
    href: '/supplier-materials',
    icon: Box,
    label: 'Fournisseurs - Matériaux',
    items: [
      {
        href: '/supplier-materials/devis',
        icon: Box,
        label: 'Devis',
      },
      {
        href: '/supplier-materials/products',
        icon: Truck,
        label: 'Products',
      },
      {
        href: '/supplier-materials/settings',
        icon: Settings,
        label: 'Settings',
      },
      {
        href: '/supplier-materials/stock',
        icon: List,
        label: 'Stock',
      },
    ],
  },
  {
    href: '/supplier/engines',
    icon: Truck,
    label: 'Fournisseurs - Engins',
    items: [
      {
        href: '/supplier/engines/fleet',
        icon: Truck,
        label: 'Fleet',
      },
      {
        href: '/supplier/engines/maintenance',
        icon: Settings,
        label: 'Maintenance',
      },
    ],
  },
  {
    href: '/promoter/index',
    icon: List,
    label: 'Promoteur - Index',
    items: [
      {
        href: '/promoter/index/projects',
        icon: List,
        label: 'Projects',
      },
      {
        href: '/promoter/index/reports',
        icon: List,
        label: 'Reports',
      },
    ],
  },
];

function NavItem({
  href,
  icon: Icon,
  label,
  items,
  collapsed,
}: NavItemType & { collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  const [isExpanded, setIsExpanded] = useState(isActive);

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  return (
    <li>
      <div className="relative group">
        <Link
          href={href}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
        >
          <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-600'}`} />
          {!collapsed && (
            <span className={`text-sm font-medium ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>
              {label}
            </span>
          )}
          {items && items.length > 0 && !collapsed && (
            <ChevronLeft 
              className={`w-4 h-4 ml-auto transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          )}
        </Link>
        {items && items.length > 0 && (
          <button 
            onClick={toggleExpand}
            className="absolute inset-0 w-full"
            aria-label={`Toggle ${label}`}
          />
        )}
      </div>
      {items && items.length > 0 && isExpanded && (
        <ul className="pl-4 mt-1 space-y-1">
          {items.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              collapsed={collapsed}
            />
          ))}
        </ul>
      )}
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
            {extendedNavItems.map((item) => (
              <NavItem
                key={item.href}
                {...item}
                collapsed={collapsed}
              />
            ))}
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
