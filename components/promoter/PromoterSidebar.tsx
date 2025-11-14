'use client';
import Link from 'next/link';
import {
  Home,
  Layers,
  Sliders,
  Settings,
  FileText,
  Building2,
} from 'lucide-react';

export default function PromoterSidebar() {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-slate-50">
      {/* Profile Section */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-200 bg-white">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white grid place-items-center font-bold text-lg shadow-lg">
          P
        </div>
        <div>
          <div className="text-sm font-bold text-slate-800">Promoteur</div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            Entrepreneur
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              href="/promoter"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 group"
            >
              <Home className="w-5 h-5 text-slate-600 group-hover:text-teal-600 transition-colors duration-200" />
              <span className="text-sm font-medium text-slate-700 group-hover:text-teal-700 transition-colors duration-200">
                Dashboard
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/promoter/index-materials"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 group"
            >
              <Layers className="w-5 h-5 text-slate-600 group-hover:text-teal-600 transition-colors duration-200" />
              <span className="text-sm font-medium text-slate-700 group-hover:text-teal-700 transition-colors duration-200">
                Index Matériaux
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/promoter/index-materials/compare"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 group"
            >
              <Sliders className="w-5 h-5 text-slate-600 group-hover:text-teal-600 transition-colors duration-200" />
              <span className="text-sm font-medium text-slate-700 group-hover:text-teal-700 transition-colors duration-200">
                Comparer Matériaux
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/promoter/index-engines"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 group"
            >
              <FileText className="w-5 h-5 text-slate-600 group-hover:text-teal-600 transition-colors duration-200" />
              <span className="text-sm font-medium text-slate-700 group-hover:text-teal-700 transition-colors duration-200">
                Index Engins
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/promoter/projects"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 group"
            >
              <Layers className="w-5 h-5 text-slate-600 group-hover:text-teal-600 transition-colors duration-200" />
              <span className="text-sm font-medium text-slate-700 group-hover:text-teal-700 transition-colors duration-200">
                Projets
              </span>
            </Link>
          </li>
          <li className="pt-4 mt-4 border-t border-slate-200">
            <Link
              href="/promoter/settings"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 group"
            >
              <Settings className="w-5 h-5 text-slate-600 group-hover:text-slate-800 transition-colors duration-200" />
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors duration-200">
                Paramètres
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
