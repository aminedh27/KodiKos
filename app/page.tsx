'use client';
import Link from 'next/link';
import { Package, Wrench, Building2 } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const routes = [
    {
      title: 'Fournisseur de Matériaux',
      description: 'Gérez vos matériaux de construction',
      href: '/supplier-materials',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
    },
    {
      title: "Fournisseur d'Engins",
      description: 'Gérez vos engins et équipements',
      href: '/supplier-engines',
      icon: Wrench,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
    },
    {
      title: 'Promoteur',
      description: 'Gérez vos projets immobiliers',
      href: '/promoter',
      icon: Building2,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Logo Section */}
      <div className="pt-12 pb-8">
        <div className="flex justify-center">
          <Image src="/image.png" alt="Logo" width={100} height={100} />
        </div>
        <p className="text-center text-slate-600 dark:text-slate-400 mt-2 text-lg">
          Choisissez votre espace
        </p>
      </div>

      {/* Route Cards */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {routes.map((route) => {
            const Icon = route.icon;
            return (
              <Link key={route.href} href={route.href} className="group">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden h-full">
                  {/* Icon Header */}
                  <div
                    className={`bg-gradient-to-br ${route.color} ${route.hoverColor} p-8 transition-all duration-300`}
                  >
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 text-center mb-3">
                      {route.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-center text-sm">
                      {route.description}
                    </p>

                    {/* Arrow Indicator */}
                    <div className="mt-6 flex justify-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors duration-300">
                        <svg
                          className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
