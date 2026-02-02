import React, { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { IProduct } from '@/types/product';
import { ICategory } from '@/types/category';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/user/ProductCard';
import { SalesService } from '@/services/sales.service';
import { ProductService } from '@/services/product.service';
import { CategoryService } from '@/services/category.service';

interface SalesReport {
  _id: number;
  totalOrders: number;
  totalSales: number;
  totalDiscountApplied: number;
  deliveryCharges: number;
  netSales: number;
  totalItemsSold: number;
  date: number;
}

function SellerDashboard() {
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>(
    'daily'
  );

  const { data: salesData, isLoading } = useQuery<SalesReport[]>({
    queryKey: ['sales', timeFrame],
    queryFn: () =>
      SalesService.fetchSalesData(timeFrame, '2021-01-01', '2024-12-31'),
  });

  const { data: topProducts, isLoading: isProductLoading } = useQuery<
    IProduct[]
  >({
    queryKey: ['topProducts'],
    queryFn: () => ProductService.getTopProducts(),
  });

  const { data: topCategories, isLoading: isCatLoading } = useQuery<
    ICategory[]
  >({
    queryKey: ['topCategories'],
    queryFn: () => CategoryService.getTopCategories(),
  });

  useEffect(() => {
    console.log(topCategories);
  }, [topCategories]);

  if (isLoading || isProductLoading || isCatLoading) {
    return <div>Loading...</div>;
  }

  if (!salesData || salesData.length === 0) {
    return <div>No data available</div>;
  }

  const latestReport = salesData[salesData.length - 1];

  const revenueData = salesData.map(report => ({
    date: new Date(report.date).toLocaleDateString(),
    sales: report.totalSales,
    profit: report.netSales,
  }));

  const customerData = [
    { name: 'Total Orders', value: latestReport.totalOrders, color: '#4CAF50' },
    {
      name: 'Total Items Sold',
      value: latestReport.totalItemsSold,
      color: '#2196F3',
    },
  ];

  return (
    <div className="flex flex-col">
      <main className="flex-1 p-4 sm:p-6 bg-gray-100 overflow-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
          Dashboard
        </h1>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4 sm:mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                ₹{latestReport.totalSales.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Latest total sales
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Sales</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                ₹{latestReport.netSales.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Latest net sales</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {latestReport.totalOrders}
              </div>
              <p className="text-xs text-muted-foreground">
                Latest total orders
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Discount
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                ₹{latestReport.totalDiscountApplied.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Latest total discount applied
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="mb-4 sm:mb-6">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={timeFrame}
              onValueChange={value =>
                setTimeFrame(value as 'daily' | 'weekly' | 'monthly')
              }
              className="space-y-10"
            >
              <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
              <TabsContent value={timeFrame} className="space-y-4">
                <ChartContainer
                  config={{
                    sales: {
                      label: 'Sales',
                      color: 'hsl(var(--chart-3))',
                    },
                    profit: {
                      label: 'Profit',
                      color: 'hsl(var(--chart-2))',
                    },
                  }}
                  className="h-[300px] w-full sm:h-[350px]"
                >
                  <AreaChart data={revenueData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="var(--color-sales)"
                      fill="var(--color-sales)"
                      fillOpacity={0.2}
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke="var(--color-profit)"
                      fill="var(--color-profit)"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ChartContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  customers: {
                    label: 'Orders',
                    color: 'hsl(var(--chart-3))',
                  },
                }}
                className="h-[200px] w-full"
              >
                <PieChart>
                  <Pie
                    data={customerData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {customerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-2 sm:mb-0">
                <p className="text-sm font-medium">Total Orders</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {latestReport.totalOrders}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Items Sold</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {latestReport.totalItemsSold}
                </p>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sales: {
                    label: 'Sales',
                    color: 'hsl(var(--chart-1))',
                  },
                  profit: {
                    label: 'Net Sales',
                    color: 'hsl(var(--chart-2))',
                  },
                }}
                className="h-[300px] w-full"
              >
                <BarChart data={revenueData.slice(-5)}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" fill="var(--color-sales)" />
                  <Bar dataKey="profit" fill="var(--color-profit)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <div>
            <h1 className="text-xl font-bold mb-4">Top Products</h1>
            <div className="grid grid-cols-2 place-items-end gap-1">
              {topProducts &&
                topProducts.map((product: IProduct, index) => (
                  <div key={product._id} className="flex gap-2 pe-10">
                    <h2 className="text-4xl font-bold">{index + 1}</h2>
                    <ProductCard product={product} />
                  </div>
                ))}
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold mb-4">Top Category</h1>
            <div className="grid grid-cols-2 gap-5">
              {topCategories &&
                topCategories.map((category: ICategory, index) => (
                  <div key={category._id} className="flex gap-5 pe-10">
                    <h2 className="text-4xl font-bold">{index + 1}</h2>
                    <span className="text-xl">{category.name}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SellerDashboard;
