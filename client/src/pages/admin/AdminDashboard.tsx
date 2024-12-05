import React, { useState } from 'react';
import { Users, Package, DollarSign, Clock } from 'lucide-react';
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
import MetricCard from '@/components/ui/MetricCard';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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

interface IChartData {
  labels: [];
  datasets: {
    fill: boolean;
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

const SalesChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('October');

  const {
    data: chartData,
    isLoading,
    isError,
  } = useQuery<IChartData>({
    queryKey: ['sales', selectedPeriod],
    queryFn: async () =>
      (await axios.get(`/api/sales?period=${selectedPeriod}`)).data,
  });

  if (isLoading) return <p>Loading chart...</p>;
  if (isError) return <p>Error loading chart data.</p>;

  const data = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
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
        <select
          className="border rounded px-2 py-1"
          value={selectedPeriod}
          onChange={e => setSelectedPeriod(e.target.value)}
        >
          <option value="October">October</option>
          <option value="September">September</option>
          <option value="August">August</option>
        </select>
      </div>
      <Line options={options} data={data} />
    </div>
  );
};
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
          value="₹89,000"
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
    </main>
  );
}
