'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  Calculator,
  ArrowRight,
  Layers,
  FileText,
  Calendar,
  DollarSign,
  AlertCircle,
  Activity,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function PromoterOverview() {
  const [materialsCount, setMaterialsCount] = useState(0);
  const [enginesCount, setEnginesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const m = await fetch('/api/index/materials').then((r) => r.json());
        setMaterialsCount(Array.isArray(m) ? m.length : m?.length ?? 0);
      } catch {
        setMaterialsCount(0);
      }
      try {
        const e = await fetch('/api/index/engines').then((r) => r.json());
        setEnginesCount(Array.isArray(e) ? e.length : e?.length ?? 0);
      } catch {
        setEnginesCount(0);
      }
      setLoading(false);
    }
    fetchCounts();
  }, []);

  const stats = [
    {
      title: 'Offres Matériaux',
      value: materialsCount,
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'teal',
      description: 'vs mois dernier',
    },
    {
      title: 'Offres Engins',
      value: enginesCount,
      change: '+8%',
      trend: 'up',
      icon: Truck,
      color: 'amber',
      description: 'vs mois dernier',
    },
    {
      title: 'Comparateurs Actifs',
      value: 2,
      change: 'Nouveau',
      trend: 'neutral',
      icon: Calculator,
      color: 'emerald',
      description: 'Outils disponibles',
    },
    {
      title: 'Projets en Cours',
      value: 5,
      change: '+2',
      trend: 'up',
      icon: Layers,
      color: 'indigo',
      description: 'Cette semaine',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Nouveau devis reçu',
      supplier: 'Fournisseur A',
      time: 'Il y a 5 min',
      type: 'quote',
      amount: '2,450,000 DA',
    },
    {
      id: 2,
      action: 'Prix actualisé',
      supplier: 'Matériaux B',
      time: 'Il y a 1h',
      type: 'price',
      amount: null,
    },
    {
      id: 3,
      action: 'Comparaison créée',
      supplier: 'Ciment - 3 fournisseurs',
      time: 'Il y a 3h',
      type: 'compare',
      amount: null,
    },
  ];

  const budgetProgress = [
    {
      category: 'Matériaux',
      spent: 45000000,
      budget: 60000000,
      color: 'bg-teal-500',
    },
    {
      category: 'Engins',
      spent: 12000000,
      budget: 20000000,
      color: 'bg-amber-500',
    },
    {
      category: "Main d'œuvre",
      spent: 8000000,
      budget: 15000000,
      color: 'bg-indigo-500',
    },
  ];

  const totalSpent = budgetProgress.reduce((acc, item) => acc + item.spent, 0);
  const totalBudget = budgetProgress.reduce(
    (acc, item) => acc + item.budget,
    0
  );

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';
          const TrendIcon = isPositive
            ? TrendingUp
            : stat.trend === 'down'
            ? TrendingDown
            : Activity;

          return (
            <Card
              key={stat.title}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <h3 className="text-3xl font-bold text-slate-900">
                        {loading ? '...' : stat.value}
                      </h3>
                      <Badge
                        variant={isPositive ? 'default' : 'secondary'}
                        className={`${
                          isPositive
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <TrendIcon className="w-3 h-3 mr-1" />
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 shadow-lg shadow-${stat.color}-500/30`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Aperçu Budget</CardTitle>
                <CardDescription>
                  Suivi des dépenses par catégorie
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-slate-700">
                {((totalSpent / totalBudget) * 100).toFixed(0)}% utilisé
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Total Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-slate-700">
                  Budget Total
                </span>
                <span className="font-bold text-slate-900">
                  {totalSpent.toLocaleString()} / {totalBudget.toLocaleString()}{' '}
                  DA
                </span>
              </div>
              <Progress
                value={(totalSpent / totalBudget) * 100}
                className="h-3"
              />
            </div>

            {/* Category Breakdown */}
            <div className="space-y-4">
              {budgetProgress.map((item) => {
                const percentage = (item.spent / item.budget) * 100;
                const isWarning = percentage > 80;

                return (
                  <div key={item.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-sm font-medium text-slate-700">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {item.spent.toLocaleString()} DA
                        </span>
                        {isWarning && (
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={percentage} className="flex-1 h-2" />
                      <span className="text-xs text-slate-500 w-12 text-right">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activité Récente</CardTitle>
            <CardDescription>Dernières mises à jour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      activity.type === 'quote'
                        ? 'bg-teal-100'
                        : activity.type === 'price'
                        ? 'bg-amber-100'
                        : 'bg-indigo-100'
                    } h-fit`}
                  >
                    {activity.type === 'quote' && (
                      <FileText className="w-4 h-4 text-teal-600" />
                    )}
                    {activity.type === 'price' && (
                      <DollarSign className="w-4 h-4 text-amber-600" />
                    )}
                    {activity.type === 'compare' && (
                      <Calculator className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      {activity.action}
                    </p>
                    <p className="text-xs text-slate-600 truncate">
                      {activity.supplier}
                    </p>
                    {activity.amount && (
                      <p className="text-xs font-semibold text-teal-600 mt-1">
                        {activity.amount}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions Rapides</CardTitle>
          <CardDescription>
            Accès direct aux fonctionnalités principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              onClick={() => (location.href = '/promoter/index-materials')}
              className="h-auto py-4 flex-col gap-2 bg-gradient-to-br from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
            >
              <Package className="w-5 h-5" />
              <span>Index Matériaux</span>
            </Button>
            <Button
              onClick={() => (location.href = '/promoter/index-engines')}
              className="h-auto py-4 flex-col gap-2 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            >
              <Truck className="w-5 h-5" />
              <span>Index Engins</span>
            </Button>
            <Button
              onClick={() =>
                (location.href = '/promoter/index-materials/compare')
              }
              variant="outline"
              className="h-auto py-4 flex-col gap-2 border-2 hover:bg-indigo-50 hover:border-indigo-300"
            >
              <Calculator className="w-5 h-5 text-indigo-600" />
              <span className="text-indigo-700">Comparer Prix</span>
            </Button>
            <Button
              onClick={() => (location.href = '/promoter/projects')}
              variant="outline"
              className="h-auto py-4 flex-col gap-2 border-2 hover:bg-slate-50"
            >
              <Layers className="w-5 h-5" />
              <span>Mes Projets</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Planning Calendar Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Planning Cette Semaine</CardTitle>
              <CardDescription>
                Échéances et rendez-vous importants
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Voir tout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                day: "Aujourd'hui",
                event: 'Réunion fournisseur ciment',
                time: '14:00',
              },
              {
                day: 'Demain',
                event: 'Visite chantier site Nord',
                time: '09:00',
              },
              {
                day: 'Jeudi',
                event: 'Validation devis matériaux',
                time: '15:30',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition-colors"
              >
                <div className="text-center min-w-[60px]">
                  <div className="text-xs font-semibold text-teal-600 uppercase">
                    {item.day}
                  </div>
                  <div className="text-xs text-slate-500">{item.time}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    {item.event}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
