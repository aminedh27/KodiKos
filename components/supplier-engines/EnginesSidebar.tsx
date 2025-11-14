'use client';
import Link from 'next/link';
import { Home, Truck, Calendar, Settings } from 'lucide-react';

export default function EnginesSidebar() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center gap-3 border-b">
        <div className="w-10 h-10 rounded bg-amber-500 text-white grid place-items-center font-bold">
          E
        </div>
        <div>
          <div className="text-sm font-semibold">Fournisseur</div>
          <div className="text-xs text-slate-500">Engins</div>
        </div>
      </div>

      <nav className="p-3 flex-1">
        <ul className="space-y-1">
          <li>
            <Link
              href="/supplier-engines"
              className="flex items-center gap-3 p-2 rounded hover:bg-slate-50"
            >
              <Home className="w-4 h-4" /> Tableau de bord
            </Link>
          </li>
          <li>
            <Link
              href="/supplier-engines/fleet"
              className="flex items-center gap-3 p-2 rounded hover:bg-slate-50"
            >
              <Truck className="w-4 h-4" /> Flotte
            </Link>
          </li>
          <li>
            <Link
              href="/supplier-engines/missions"
              className="flex items-center gap-3 p-2 rounded hover:bg-slate-50"
            >
              <Calendar className="w-4 h-4" /> Missions
            </Link>
          </li>
          <li>
            <Link
              href="/supplier-engines/settings"
              className="flex items-center gap-3 p-2 rounded hover:bg-slate-50"
            >
              <Settings className="w-4 h-4" /> Paramètres
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-3 border-t">
        <button className="w-full text-sm p-2 rounded bg-white hover:bg-slate-50">
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
