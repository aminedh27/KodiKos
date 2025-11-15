'use client';
import Link from 'next/link';
import {
  Home,
  Truck,
  Calendar,
  Settings,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navigationItems = [
  {
    href: '/supplier-engines',
    icon: Home,
    label: 'Tableau de bord',
    badge: null,
  },
  {
    href: '/supplier-engines/fleet',
    icon: Truck,
    label: 'Flotte',
    badge: '12',
  },
  {
    href: '/supplier-engines/missions',
    icon: Calendar,
    label: 'Missions',
    badge: '3',
  },
];

export default function EnginesSidebar() {
  const pathname = usePathname(); // Mock - use usePathname() in actual implementation

  const isActive = (href: string) => {
    if (href === '/supplier-engines') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white via-amber-50/30 to-white">
      {/* Profile Section */}
      <div className="px-4 py-5 border-b-2 border-slate-200 flex justify-center items-center">
        <Image src="/image.png" alt="Logo" width={160} height={160} />
      </div>

      {/* Alert Card */}
      <div className="p-4">
        <Alert className="border-danger-200 bg-danger-50">
          <AlertCircle className="h-4 w-4 text-danger-600" />
          <AlertDescription className="text-xs text-danger-800">
            <strong>2 engins</strong> nécessitent une maintenance
          </AlertDescription>
        </Alert>
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
                      ? 'bg-primary-50 text-primary-700 shadow-sm border border-primary-100'
                      : 'text-slate-700 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-all duration-200 ${
                      active
                        ? 'text-primary-600'
                        : 'text-slate-500 group-hover:text-primary-600'
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
                          ? 'bg-primary-100 text-primary-700'
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
          href="/supplier-engines/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-white hover:shadow-sm transition-all duration-200 group"
        >
          <Settings className="w-4 h-4 text-slate-500 group-hover:text-slate-700 group-hover:rotate-90 transition-all duration-200" />
          <span className="text-sm font-medium">Paramètres</span>
        </Link>
      </nav>

      {/* Quick Actions */}
      <div className="p-4 space-y-2 border-t border-slate-200 bg-gradient-to-b from-white to-amber-50/20">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 text-xs border-amber-200 hover:bg-amber-50 hover:border-amber-300"
        >
          <Calendar className="w-3.5 h-3.5" />
          Voir planning complet
        </Button>

        <Separator className="my-2" />

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
