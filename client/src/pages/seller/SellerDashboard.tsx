import React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react"

const revenueData = [
  { month: "Jan", sales: 20, profit: 30 },
  { month: "Feb", sales: 40, profit: 35 },
  { month: "Mar", sales: 30, profit: 25 },
  { month: "Apr", sales: 70, profit: 50 },
  { month: "May", sales: 40, profit: 35 },
  { month: "Jun", sales: 60, profit: 40 },
  { month: "Jul", sales: 80, profit: 60 },
  { month: "Aug", sales: 40, profit: 30 },
  { month: "Sep", sales: 60, profit: 45 },
  { month: "Oct", sales: 80, profit: 70 },
  { month: "Nov", sales: 50, profit: 40 },
  { month: "Dec", sales: 70, profit: 55 },
]

const salesAnalyticsData = [
  { year: 2015, sales: 25, profit: 10 },
  { year: 2016, sales: 65, profit: 45 },
  { year: 2017, sales: 50, profit: 55 },
  { year: 2018, sales: 45, profit: 30 },
  { year: 2019, sales: 90, profit: 85 },
]

const customerData = [
  { name: "New Customers", value: 34249, color: "#4CAF50" },
  { name: "Repeated", value: 1420, color: "#2196F3" },
]

function SellerDashboard() {
  return (
    <div className="flex flex-col">
      <main className="flex-1 p-4 sm:p-6 bg-gray-100 overflow-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Dashboard</h1>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4 sm:mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">+19% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">+201 since last hour</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">+25.8%</div>
              <p className="text-xs text-muted-foreground">+4% from last month</p>
            </CardContent>
          </Card>
        </div>
        <Card className="mb-4 sm:mb-6">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="yearly" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
              </TabsList>
              <TabsContent value="yearly" className="space-y-4">
                  <ChartContainer
                    config={{
                      sales: {
                        label: "Sales",
                        color: "hsl(var(--chart-3))",
                      },
                      profit: {
                        label: "Profit",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px] w-full sm:h-[350px]"
                  >
                      <AreaChart data={revenueData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="sales" stroke="var(--color-sales)" fill="var(--color-sales)" fillOpacity={0.2} />
                        <Area type="monotone" dataKey="profit" stroke="var(--color-profit)" fill="var(--color-profit)" fillOpacity={0.2} />
                      </AreaChart>
                  </ChartContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  customers: {
                    label: "Customers",
                    color: "hsl(var(--chart-3))",
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
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                <p className="text-sm font-medium">New Customers</p>
                <p className="text-xl sm:text-2xl font-bold">34,249</p>
              </div>
              <div>
                <p className="text-sm font-medium">Repeated</p>
                <p className="text-xl sm:text-2xl font-bold">1,420</p>
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
                    label: "Sales",
                    color: "hsl(var(--chart-1))",
                  },
                  profit: {
                    label: "Profit",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px] w-full"
              >
                  <BarChart data={salesAnalyticsData}>
                    <XAxis dataKey="year" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sales" fill="var(--color-sales)" />
                    <Bar dataKey="profit" fill="var(--color-profit)" />
                  </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default SellerDashboard;