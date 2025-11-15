'use client';
import Link from 'next/link';
import {
  Home,
  Layers,
  Sliders,
  Settings,
  FileText,
  Building2,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const navigationItems = [
  { href: '/promoter', icon: Home, label: 'Dashboard', badge: null },
  {
    href: '/promoter/index-materials',
    icon: Layers,
    label: 'Index Matériaux',
    badge: 'Nouveau',
  },
  {
    href: '/promoter/index-materials/compare',
    icon: Sliders,
    label: 'Comparer Matériaux',
    badge: null,
  },
  {
    href: '/promoter/index-engines',
    icon: FileText,
    label: 'Index Engins',
    badge: null,
  },
  { href: '/promoter/projects', icon: Building2, label: 'Projets', badge: '3' },
];

export default function PromoterSidebar() {
  // You can add pathname hook in your actual implementation
  // const pathname = usePathname();
  const pathname = '/promoter'; // Mock for demo

  const isActive = (href: string) => {
    if (href === '/promoter') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Profile Section */}
      <div className="p-5 border-b border-slate-200/60 bg-white">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 via-emerald-600 to-teal-600 text-white grid place-items-center font-bold text-lg shadow-lg shadow-teal-500/20 group-hover:shadow-xl group-hover:shadow-teal-500/30 transition-all duration-300">
              P
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-slate-900">Promoteur</div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              <span>Entrepreneur</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 flex-1 overflow-y-auto">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  active
                    ? 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 shadow-sm'
                    : 'text-slate-700 hover:bg-white hover:shadow-sm'
                }`}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-teal-500 to-emerald-600 rounded-r-full" />
                )}
                <Icon
                  className={`w-5 h-5 transition-all duration-200 ${
                    active
                      ? 'text-teal-600 scale-110'
                      : 'text-slate-500 group-hover:text-teal-600 group-hover:scale-105'
                  }`}
                />
                <span
                  className={`text-sm font-medium flex-1 transition-colors duration-200 ${
                    active ? 'font-semibold' : 'group-hover:text-teal-700'
                  }`}
                >
                  {item.label}
                </span>
                {item.badge && (
                  <Badge
                    variant={active ? 'default' : 'secondary'}
                    className={`text-[10px] px-1.5 py-0 ${
                      active
                        ? 'bg-teal-600 hover:bg-teal-600'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>

        <Separator className="my-4" />

        {/* Settings */}
        <Link
          href="/promoter/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
            pathname === '/promoter/settings'
              ? 'bg-slate-100 text-slate-900'
              : 'text-slate-600 hover:bg-white hover:shadow-sm'
          }`}
        >
          <Settings
            className={`w-5 h-5 transition-all duration-200 ${
              pathname === '/promoter/settings'
                ? 'text-slate-700'
                : 'text-slate-500 group-hover:text-slate-700 group-hover:rotate-90'
            }`}
          />
          <span className="text-sm font-medium">Paramètres</span>
        </Link>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-200/60 bg-white">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Se déconnecter</span>
        </Button>
      </div>
    </div>
  );
}
