// components/PromoterHeader.tsx
'use client';
import React from 'react';
import { MapPin, TrendingUp } from 'lucide-react';

export default function PromoterHeader() {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm max-h-22">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 md:p-6">
        {/* Title Section */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Promoteur — Index & Comparateur
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Consultez prix, comparez fournisseurs et planifiez votre budget
            </p>
          </div>
        </div>

        {/* Location Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
          <MapPin className="w-4 h-4 text-teal-600" />
          <div className="text-sm">
            <span className="text-slate-600">Ville: </span>
            <strong className="text-slate-800">Alger</strong>
          </div>
        </div>
      </div>
    </header>
  );
}
