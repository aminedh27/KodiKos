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
import { Engine } from '@/types/engine';
import {
  Truck,
  TrendingUp,
  Calendar,
  DollarSign,
  Wrench,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  MapPin,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function EnginesOverview() {
  const [engines, setEngines] = useState<Engine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/engines')
      .then((r) => r.json())
      .then((data) => {
        setEngines(data);
        setLoading(false);
      })
      .catch(() => {
        setEngines([]);
        setLoading(false);
      });
  }, []);

  const total = engines.length;
  const inUse = engines.filter((e) => !e.available).length;
  const available = total - inUse;
  const utilizationRate = total > 0 ? (inUse / total) * 100 : 0;
  const totalRevenue = engines.reduce((sum, e) => sum + e.dayRate * 20, 0); // Mock: 20 days/month avg

  const stats = [
    {
      title: 'Total Engins',
      value: total,
      change: '+2',
      trend: 'up',
      icon: Truck,
      color: 'amber',
      description: 'Dans la flotte',
    },
    {
      title: 'En Service',
      value: inUse,
      change: `${utilizationRate.toFixed(0)}%`,
      trend: 'neutral',
      icon: Activity,
      color: 'green',
      description: 'Taux utilisation',
    },
    {
      title: 'Disponibles',
      value: available,
      change: 'Maintenant',
      trend: 'neutral',
      icon: CheckCircle,
      color: 'blue',
      description: 'Prêts à louer',
    },
    {
      title: 'Revenus Mensuels',
      value: `${(totalRevenue / 1000000).toFixed(1)}M`,
      change: '+15%',
      trend: 'up',
      icon: DollarSign,
      color: 'emerald',
      description: 'DA estimés',
    },
  ];

  const activeMissions = [
    {
      id: 1,
      engine: 'Excavatrice CAT 320',
      client: 'Promoteur Nord',
      location: 'Alger Centre',
      startDate: '15 Nov',
      endDate: '20 Nov',
      status: 'active',
      progress: 60,
    },
    {
      id: 2,
      engine: 'Bulldozer D6',
      client: 'Construction ABC',
      location: 'Oran',
      startDate: '14 Nov',
      endDate: '18 Nov',
      status: 'active',
      progress: 80,
    },
    {
      id: 3,
      engine: 'Grue Mobile',
      client: 'BTP Solutions',
      location: 'Constantine',
      startDate: '16 Nov',
      endDate: '25 Nov',
      status: 'scheduled',
      progress: 0,
    },
  ];

  const maintenanceNeeded = engines.filter((_, i) => i % 3 === 0).slice(0, 2); // Mock maintenance needs

  const categoryBreakdown = engines.reduce((acc, e) => {
    if (!acc[e.category]) {
      acc[e.category] = { count: 0, inUse: 0 };
    }
    acc[e.category].count += 1;
    if (!e.available) acc[e.category].inUse += 1;
    return acc;
  }, {} as Record<string, { count: number; inUse: number }>);

  const categories = Object.entries(categoryBreakdown);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';

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
                        {isPositive && <TrendingUp className="w-3 h-3 mr-1" />}
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
        {/* Active Missions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Missions Actives</CardTitle>
                <CardDescription>Engins actuellement déployés</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Planning
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeMissions.map((mission) => (
                <div
                  key={mission.id}
                  className="p-4 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-amber-100">
                        <Truck className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900">
                          {mission.engine}
                        </h4>
                        <p className="text-xs text-slate-600">
                          {mission.client}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                          <MapPin className="w-3 h-3" />
                          {mission.location}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        mission.status === 'active' ? 'default' : 'secondary'
                      }
                      className={
                        mission.status === 'active'
                          ? 'bg-green-100 text-green-700 hover:bg-green-100'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                      }
                    >
                      {mission.status === 'active' ? 'En cours' : 'Planifié'}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">
                        Période: {mission.startDate} - {mission.endDate}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {mission.progress}%
                      </span>
                    </div>
                    <Progress value={mission.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fleet Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">État de la Flotte</CardTitle>
            <CardDescription>Par catégorie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map(([category, data]) => {
                const utilizationPercentage = (data.inUse / data.count) * 100;

                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">
                        {category}
                      </span>
                      <span className="text-xs text-slate-500">
                        {data.inUse}/{data.count} en service
                      </span>
                    </div>
                    <Progress value={utilizationPercentage} className="h-2" />
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-3 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-amber-900">
                  Taux d'utilisation
                </span>
              </div>
              <div className="text-2xl font-bold text-amber-900">
                {utilizationRate.toFixed(1)}%
              </div>
              <p className="text-xs text-amber-700 mt-1">
                Performance mensuelle
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Alert */}
      {maintenanceNeeded.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Wrench className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-amber-900">
                  Maintenance Requise
                </CardTitle>
                <CardDescription className="text-amber-700">
                  {maintenanceNeeded.length} engin
                  {maintenanceNeeded.length > 1 ? 's' : ''} nécessite
                  {maintenanceNeeded.length > 1 ? 'nt' : ''} une révision
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {maintenanceNeeded.map((engine) => (
                <div
                  key={engine.id}
                  className="flex items-center gap-3 p-4 rounded-lg bg-white border border-amber-200"
                >
                  <div className="p-3 rounded-lg bg-amber-100">
                    <Truck className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-slate-900">
                      {engine.name}
                    </h4>
                    <p className="text-xs text-slate-600">{engine.category}</p>
                    <Badge
                      variant="outline"
                      className="mt-2 text-[10px] border-amber-300 text-amber-700"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Dans 5 jours
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-amber-600 hover:bg-amber-700">
              <Wrench className="w-4 h-4 mr-2" />
              Planifier maintenance
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              onClick={() => (location.href = '/supplier-engines/fleet')}
              className="h-auto py-4 flex-col gap-2 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            >
              <Plus className="w-5 h-5" />
              <span>Ajouter Engin</span>
            </Button>
            <Button
              onClick={() => (location.href = '/supplier-engines/missions')}
              variant="outline"
              className="h-auto py-4 flex-col gap-2 border-2 hover:bg-amber-50 hover:border-amber-300"
            >
              <Calendar className="w-5 h-5 text-amber-600" />
              <span className="text-amber-700">Nouvelle Mission</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2 border-2 hover:bg-slate-50"
            >
              <Wrench className="w-5 h-5" />
              <span>Maintenance</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2 border-2 hover:bg-slate-50"
            >
              <DollarSign className="w-5 h-5" />
              <span>Facturation</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fleet Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Aperçu de la Flotte</CardTitle>
              <CardDescription>Tous les engins disponibles</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              Voir tout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {engines.slice(0, 8).map((engine) => (
              <div
                key={engine.id}
                className="p-4 rounded-lg border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100">
                    <Truck className="w-5 h-5 text-amber-600" />
                  </div>
                  <Badge
                    variant={engine.available ? 'default' : 'secondary'}
                    className={
                      engine.available
                        ? 'bg-green-100 text-green-700 hover:bg-green-100 text-[10px]'
                        : 'bg-slate-100 text-slate-700 text-[10px]'
                    }
                  >
                    {engine.available ? 'Disponible' : 'En service'}
                  </Badge>
                </div>
                <h4 className="font-semibold text-sm text-slate-900 mb-1">
                  {engine.name}
                </h4>
                <p className="text-xs text-slate-500 mb-3">{engine.category}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-amber-600">
                    {engine.dayRate.toLocaleString()} DA
                  </p>
                  <p className="text-xs text-slate-500">/jour</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
