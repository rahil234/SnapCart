import React from 'react';
import {
  Users,
  Package,
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
  trend: 'up' | 'down';
  trendValue: string;
}

const MetricCard = ({ title, value, trend, trendValue }: MetricCardProps) => (
  <div className="bg-white rounded-lg p-6 flex items-start justify-between">
    <div>
      <h3 className="text-gray-500 text-sm mb-2">{title}</h3>
      <p className="text-3xl font-semibold">{value}</p>
      <p
        className={`text-sm mt-2 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}
      >
        {trend === 'up' ? (
          <TrendingUp size={16} className="inline mr-1" />
        ) : (
          <TrendingDown size={16} className="inline mr-1" />
        )}
        {trendValue}
      </p>
    </div>
    <div
      className={`p-3 rounded-full ${
        title === 'Total User'
          ? 'bg-purple-100'
          : title === 'Total Order'
            ? 'bg-yellow-100'
            : title === 'Total Sales'
              ? 'bg-green-100'
              : 'bg-red-100'
      }`}
    >
      {title === 'Total User' && (
        <Users className="text-purple-500" size={24} />
      )}
      {title === 'Total Order' && (
        <Package className="text-yellow-500" size={24} />
      )}
      {title === 'Total Sales' && (
        <DollarSign className="text-green-500" size={24} />
      )}
      {title === 'Total Pending' && (
        <Clock className="text-red-500" size={24} />
      )}
    </div>
  </div>
);

const SalesChart = () => {
  const data = {
    labels: [
      '5k',
      '10k',
      '15k',
      '20k',
      '25k',
      '30k',
      '35k',
      '40k',
      '45k',
      '50k',
      '55k',
      '60k',
    ],
    datasets: [
      {
        fill: true,
        label: 'Sales',
        data: [20, 40, 30, 70, 40, 60, 80, 40, 60, 80, 50, 70],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value: unknown) {
            return value + '%';
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sales Details</h2>
        <select className="border rounded px-2 py-1">
          <option>October</option>
        </select>
      </div>
      <Line options={options} data={data} />
    </div>
  );
};

const DealsTable = () => (
  <div className="bg-white rounded-lg p-6 mt-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Deals Details</h2>
      <select className="border rounded px-2 py-1">
        <option>October</option>
      </select>
    </div>
    <table className="w-full">
      <thead>
        <tr className="text-left text-gray-500">
          <th className="pb-4">Product Name</th>
          <th className="pb-4">Location</th>
          <th className="pb-4">Date - Time</th>
          <th className="pb-4">Piece</th>
          <th className="pb-4">Amount</th>
          <th className="pb-4">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-2">
            <div className="flex items-center">
              <img
                src="/placeholder.svg?height=40&width=40"
                alt="Apple Watch"
                className="w-10 h-10 rounded mr-2"
              />
              Apple Watch
            </div>
          </td>
          <td>6096 Marjolaine Landing</td>
          <td>12.09.2019 - 12:53 PM</td>
          <td>423</td>
          <td>$34,295</td>
          <td>
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
              Delivered
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default function AdminDashboard() {
  return (
    <main className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Total User"
          value="40,689"
          icon={Users}
          trend="up"
          trendValue="8.5% Up from yesterday"
        />
        <MetricCard
          title="Total Order"
          value="10293"
          icon={Package}
          trend="up"
          trendValue="1.3% Up from past week"
        />
        <MetricCard
          title="Total Sales"
          value="$89,000"
          icon={DollarSign}
          trend="down"
          trendValue="4.3% Down from yesterday"
        />
        <MetricCard
          title="Total Pending"
          value="2040"
          icon={Clock}
          trend="up"
          trendValue="1.8% Up from yesterday"
        />
      </div>
      <SalesChart />
      <DealsTable />
    </main>
  );
}
