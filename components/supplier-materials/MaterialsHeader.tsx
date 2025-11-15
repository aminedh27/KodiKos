'use client';
import React from 'react';
import { Plus, Download, Filter, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export default function MaterialsHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-4 gap-4">
          {/* Title Section */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-bold text-slate-900 truncate">
                Tableau Fournisseur Matériaux
              </h1>
              <p className="text-xs md:text-sm text-slate-600 truncate">
                Gérez produits, stock et devis
              </p>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-2">
            {/* Filter Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 hidden sm:flex"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filtrer</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Tous les produits</DropdownMenuItem>
                <DropdownMenuItem>En stock</DropdownMenuItem>
                <DropdownMenuItem>Stock faible</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Par catégorie</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export Button */}
            <Button
              variant="outline"
              size="sm"
              className="gap-2 hidden md:flex"
            >
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </Button>

            {/* Add Product Button */}
            <Button
              size="sm"
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nouveau produit</span>
              <span className="sm:hidden">Nouveau</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
