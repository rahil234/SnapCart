import {
  Clock,
  DollarSign,
  LucideIcon,
  Package,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
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

export default MetricCard;
