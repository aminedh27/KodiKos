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
import Image from 'next/image';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/promoter') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Profile Section */}
      <div className="px-4 py-5 border-b border-slate-200 flex justify-center items-center">
        <Image src="/image.png" alt="Logo" width={160} height={160} />
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
                    ? 'bg-gradient-to-r from-primary-50 to-primary-50 text-primary-700 shadow-sm'
                    : 'text-slate-700 hover:bg-white hover:shadow-sm'
                }`}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-600 rounded-r-full" />
                )}
                <Icon
                  className={`w-5 h-5 transition-all duration-200 ${
                    active
                      ? 'text-primary-600 scale-110'
                      : 'text-slate-500 group-hover:text-primary-600 group-hover:scale-105'
                  }`}
                />
                <span
                  className={`text-sm font-medium flex-1 transition-colors duration-200 ${
                    active ? 'font-semibold' : 'group-hover:text-primary-700'
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
