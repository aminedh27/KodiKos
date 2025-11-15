'use client';
import React from 'react';
import { Plus, Calendar, TrendingUp, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export default function EnginesHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-4 gap-4">
          {/* Title Section */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 bg-gradient-to-br from-primary-500 to-mariner-600 rounded-xl shadow-lg shadow-primary-500/20">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-bold text-slate-900 truncate">
                Tableau Fournisseur Engins
              </h1>
              <p className="text-xs md:text-sm text-slate-600 truncate">
                Gérez votre flotte, missions et facturation
              </p>
            </div>
          </div>

          {/* Actions & Stats */}
          <div className="flex items-center gap-3">
            {/* Quick Stats */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-green-700">
                    8 actifs
                  </span>
                </div>
              </div>
              <div className="px-3 py-1.5 bg-mariner-50 rounded-lg border border-mariner-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-mariner-600" />
                  <span className="text-xs font-semibold text-mariner-700">
                    +12% ce mois
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Planifier</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Nouvelle mission</DropdownMenuItem>
                <DropdownMenuItem>Voir planning</DropdownMenuItem>
                <DropdownMenuItem>Disponibilités</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="lg"
              className=" bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all flex justify-center items-center"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Ajouter engin</span>
              <span className="sm:hidden">Nouveau</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
