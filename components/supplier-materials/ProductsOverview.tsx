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
import { Product } from '@/types/product';
import { searchProducts } from '@/app/services/products';
import { listDevis } from '@/app/services/devis';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  FileText,
  DollarSign,
  ShoppingCart,
  ArrowRight,
  BarChart3,
  Plus,
  Eye,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function ProductsOverview() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [devisCount, setDevisCount] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await searchProducts('');
        setProducts(data);
      } catch (e) {
        setProducts([]);
      } finally {
        setLoading(false);
      }

      // load devis count (non-blocking)
      try {
        const rows = await listDevis();
        setDevisCount(rows.length);
      } catch (e) {
        setDevisCount(0);
      }
    }
    load();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
        <span className="text-sm text-slate-600">Chargement...</span>
      </div>
    );

  const total = products.length;
  const lowStock = products.filter((p) => Number(p.quantity) <= 10).length;
  const totalValue = products.reduce(
    (sum, p) => sum + Number(p.price) * Number(p.quantity),
    0
  );
  const avgPrice =
    products.length > 0
      ? products.reduce((sum, p) => sum + p.price, 0) / products.length
      : 0;

  const stats = [
    {
      title: 'Total Produits',
      value: total,
      change: '+5',
      trend: 'up',
      icon: Package,
      color: 'indigo',
      description: 'Ce mois',
    },
    {
      title: 'Valeur Stock',
      value: `${(totalValue / 1000000).toFixed(1)}M`,
      change: '+12%',
      trend: 'up',
      icon: DollarSign,
      color: 'emerald',
      description: 'DA total',
    },
    {
      title: 'Devis Générés',
      value: devisCount,
      change: '+8',
      trend: 'up',
      icon: FileText,
      color: 'blue',
      description: 'Ce mois',
    },
    {
      title: 'Stock Faible',
      value: lowStock,
      change: 'Urgent',
      trend: 'warning',
      icon: AlertTriangle,
      color: 'amber',
      description: 'À réapprovisionner',
    },
  ];

  const topProducts = products
    .sort(
      (a, b) =>
        Number(b.price) * Number(b.quantity) -
        Number(a.price) * Number(a.quantity)
    )
    .slice(0, 5);

  const categoryStats = products.reduce((acc, p) => {
    if (!acc[p.category]) {
      acc[p.category] = { count: 0, value: 0 };
    }
    acc[p.category].count += 1;
    acc[p.category].value += Number(p.price) * Number(p.quantity);
    return acc;
  }, {} as Record<string, { count: number; value: number }>);

  const categories = Object.entries(categoryStats)
    .sort((a, b) => b[1].value - a[1].value)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';
          const isWarning = stat.trend === 'warning';

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
                            : isWarning
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isPositive && <TrendingUp className="w-3 h-3 mr-1" />}
                        {isWarning && (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        )}
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
        {/* Top Products by Value */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  Top Produits par Valeur
                </CardTitle>
                <CardDescription>
                  Basé sur prix × quantité en stock
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Voir tout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => {
                const stockValue =
                  Number(product.price) * Number(product.quantity);
                const stockPercentage = (Number(product.quantity) / 100) * 100; // placeholder
                const isLowStock = Number(product.quantity) <= 10;

                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {product.name}
                        </p>
                        {isLowStock && (
                          <Badge
                            variant="outline"
                            className="text-[10px] border-amber-300 text-amber-700"
                          >
                            Stock faible
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {product.category}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress
                          value={Math.min(stockPercentage, 100)}
                          className="flex-1 h-1.5"
                        />
                        <span className="text-xs text-slate-600 font-medium">
                          {product.quantity} unités
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Valeur stock</p>
                      <p className="text-sm font-bold text-slate-900">
                        {stockValue.toLocaleString()} DA
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {Number(product.price).toLocaleString()} DA/u
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Par Catégorie</CardTitle>
            <CardDescription>Distribution des produits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map(([category, data]) => {
                const percentage = (data.count / total) * 100;
                const colors = [
                  'bg-indigo-500',
                  'bg-purple-500',
                  'bg-blue-500',
                  'bg-teal-500',
                  'bg-emerald-500',
                ];
                const color =
                  colors[
                    categories.findIndex((c) => c[0] === category) %
                      colors.length
                  ];

                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${color}`} />
                        <span className="text-sm font-medium text-slate-700">
                          {category}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">
                        {data.count}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <p className="text-xs text-slate-500">
                      Valeur: {(data.value / 1000).toFixed(0)}K DA
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStock > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-amber-900">
                  Alerte Stock
                </CardTitle>
                <CardDescription className="text-amber-700">
                  {lowStock} produit{lowStock > 1 ? 's' : ''} nécessite
                  {lowStock > 1 ? 'nt' : ''} un réapprovisionnement
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {products
                .filter((p) => Number(p.quantity) <= 10)
                .slice(0, 6)
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white border border-amber-200"
                  >
                    <Package className="w-8 h-8 text-amber-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {product.category}
                      </p>
                      <Badge
                        variant="outline"
                        className="mt-1 text-[10px] border-amber-300 text-amber-700"
                      >
                        {product.quantity} restant
                        {Number(product.quantity) > 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
            <Button className="w-full mt-4 bg-amber-600 hover:bg-amber-700">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Commander des produits
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
              onClick={() => (location.href = '/supplier-materials/products')}
              className="h-auto py-4 flex-col gap-2 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              <Plus className="w-5 h-5" />
              <span>Ajouter Produit</span>
            </Button>
            <Button
              onClick={() => (location.href = '/supplier-materials/stock')}
              variant="outline"
              className="h-auto py-4 flex-col gap-2 border-2 hover:bg-indigo-50 hover:border-indigo-300"
            >
              <Package className="w-5 h-5 text-indigo-600" />
              <span className="text-indigo-700">Gérer Stock</span>
            </Button>
            <Button
              onClick={() => (location.href = '/supplier-materials/devis')}
              variant="outline"
              className="h-auto py-4 flex-col gap-2 border-2 hover:bg-slate-50"
            >
              <FileText className="w-5 h-5" />
              <span>Créer Devis</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2 border-2 hover:bg-slate-50"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Voir Stats</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Products */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Produits Récents</CardTitle>
              <CardDescription>Derniers ajouts au catalogue</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              Voir tout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {products.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100 mb-3">
                  <Package className="w-6 h-6 text-indigo-600" />
                </div>
                <h4 className="font-semibold text-sm text-slate-900 mb-1 truncate">
                  {product.name}
                </h4>
                <p className="text-xs text-slate-500 mb-2">
                  {product.category}
                </p>
                <p className="text-sm font-bold text-indigo-600">
                  {Number(product.price).toLocaleString()} DA
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Stock: {product.quantity}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
