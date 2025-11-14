'use client';
import Link from 'next/link';
import { Home, Box, Layers, FileText, Settings } from 'lucide-react';

export default function MaterialsSidebar() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center gap-3 border-b">
        <div className="w-10 h-10 rounded bg-indigo-600 text-white grid place-items-center font-bold">
          M
        </div>
        <div>
          <div className="text-sm font-semibold">Fournisseur</div>
          <div className="text-xs text-slate-500">Matériaux</div>
        </div>
      </div>

      <nav className="p-3 flex-1">
        <ul className="space-y-1">
          <li>
            <Link
              href="/supplier-materials"
              className="flex items-center gap-3 p-2 rounded hover:bg-slate-50"
            >
              <Home className="w-4 h-4" /> Tableau de bord
            </Link>
          </li>
          <li>
            <Link
              href="/supplier-materials/products"
              className="flex items-center gap-3 p-2 rounded hover:bg-slate-50"
            >
              <Box className="w-4 h-4" /> Produits
            </Link>
          </li>
          <li>
            <Link
              href="/supplier-materials/stock"
              className="flex items-center gap-3 p-2 rounded hover:bg-slate-50"
            >
              <Layers className="w-4 h-4" /> Stock
            </Link>
          </li>
          <li>
            <Link
              href="/supplier-materials/devis"
              className="flex items-center gap-3 p-2 rounded hover:bg-slate-50"
            >
              <FileText className="w-4 h-4" /> Devis
            </Link>
          </li>
          <li>
            <Link
              href="/supplier-materials/settings"
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
