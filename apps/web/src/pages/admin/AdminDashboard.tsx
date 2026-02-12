import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';

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
import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '@/services/analytics.service';

import {
  AdminDashboardResponseDto,
  RecentOrderDto,
  TopProductDto,
} from '@/api/generated';

export default function AdminDashboard() {
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery<AdminDashboardResponseDto>({
    queryKey: ['admin-dashboard'],
    queryFn: () => AnalyticsService.getAdminDashboard(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-500">
          Error loading dashboard: {String(error)}
        </div>
      </div>
    );
  }

  const { stats, recentOrders, topProducts } = dashboardData;

  // Prepare chart data from recent orders
  const revenueData = recentOrders
    .slice(0, 10)
    .map((order: RecentOrderDto) => ({
      date: new Date(order.placedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      sales: order.total,
    }));

  // Prepare pie chart data
  const orderOverviewData = [
    {
      name: 'Total Orders',
      value: stats.totalOrders,
      color: '#4CAF50',
    },
    {
      name: 'Products Sold',
      value: stats.totalProductsSold,
      color: '#2196F3',
    },
  ];

  return (
    <div className="flex flex-col">
      <main className="flex-1 p-4 sm:p-6 bg-gray-100 overflow-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
          Admin Dashboard
        </h1>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mb-4 sm:mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                ₹{stats.totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Platform total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Order Value
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                ₹{stats.averageOrderValue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Per order</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {stats.totalOrders}
              </div>
              <p className="text-xs text-muted-foreground">All orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {stats.totalCustomers || 0}
              </div>
              <p className="text-xs text-muted-foreground">Registered users</p>
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
                ₹{stats.totalDiscount.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Given to customers
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="mb-4 sm:mb-6">
          <CardHeader>
            <CardTitle>Recent Orders Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sales: {
                  label: 'Sales',
                  color: 'hsl(var(--chart-3))',
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
              </AreaChart>
            </ChartContainer>
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
                  orders: {
                    label: 'Orders',
                    color: 'hsl(var(--chart-3))',
                  },
                }}
                className="h-[200px] w-full"
              >
                <PieChart>
                  <Pie
                    data={orderOverviewData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({
                      name,
                      percent,
                    }: {
                      name: string;
                      percent: number;
                    }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {orderOverviewData.map((entry, index) => (
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
                  {stats.totalOrders}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Items Sold</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {stats.totalProductsSold}
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
                }}
                className="h-[300px] w-full"
              >
                <BarChart data={revenueData.slice(-5)}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" fill="var(--color-sales)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.length > 0 ? (
                  topProducts.map((product: TopProductDto, index: number) => (
                    <div
                      key={product.productId}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-muted-foreground">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{product.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.totalSold} units sold
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          ₹{product.revenue.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No products sold yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.slice(0, 5).map((order: RecentOrderDto) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">#{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.customerName
                            ? String(order.customerName)
                            : 'Customer'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.placedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{order.total.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.orderStatus}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No orders yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
