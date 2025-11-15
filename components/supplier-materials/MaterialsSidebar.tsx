'use client';
import Link from 'next/link';
import {
  Home,
  Box,
  Layers,
  FileText,
  Settings,
  LogOut,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const navigationItems = [
  {
    href: '/supplier-materials',
    icon: Home,
    label: 'Tableau de bord',
    badge: null,
  },
  {
    href: '/supplier-materials/products',
    icon: Box,
    label: 'Produits',
    badge: '24',
  },
  {
    href: '/supplier-materials/stock',
    icon: Layers,
    label: 'Stock',
    badge: null,
  },
  {
    href: '/supplier-materials/devis',
    icon: FileText,
    label: 'Devis',
    badge: '5',
  },
];

export default function MaterialsSidebar() {
  const pathname = '/supplier-materials'; // Mock - use usePathname() in actual implementation

  const isActive = (href: string) => {
    if (href === '/supplier-materials') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Profile Section */}
      {/* <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white grid place-items-center font-bold shadow-lg shadow-indigo-500/30">
            <Image src="/asset_13.png" alt="Logo" width={50} height={50} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-slate-900">Fournisseur</div>
            <div className="text-xs text-indigo-600 font-medium">Matériaux</div>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      </div> */}

      <div className="px-4 py-5 border-b border-slate-200 flex justify-center items-center">
        <Image src="/image.png" alt="Logo" width={160} height={160} />
      </div>

      {/* Stats Card */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-100">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-700">
              Performance
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Devis ce mois</span>
              <span className="font-bold text-slate-900">12</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Taux conversion</span>
              <span className="font-bold text-green-600">68%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    active
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100'
                      : 'text-slate-700 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-all duration-200 ${
                      active
                        ? 'text-indigo-600'
                        : 'text-slate-500 group-hover:text-indigo-600'
                    }`}
                  />
                  <span
                    className={`text-sm flex-1 ${
                      active ? 'font-semibold' : 'font-medium'
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 ${
                        active
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <Separator className="my-4" />

        {/* Settings */}
        <Link
          href="/supplier-materials/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-white hover:shadow-sm transition-all duration-200 group"
        >
          <Settings className="w-4 h-4 text-slate-500 group-hover:text-slate-700 group-hover:rotate-90 transition-all duration-200" />
          <span className="text-sm font-medium">Paramètres</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Se déconnecter</span>
        </Button>
      </div>
    </div>
  );
}
