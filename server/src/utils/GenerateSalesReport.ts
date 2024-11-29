import orderModel from '@models/orderModel';

const fetchSalesReport = async (
  timeFrame: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined,
  sellerId?: string
) => {
  const defaultStartDate = '2020-01-01';

  const start = startDate ? new Date(startDate) : new Date(defaultStartDate);
  const end = endDate ? new Date(endDate) : new Date();

  switch (timeFrame) {
    case 'daily':
      end.setHours(23, 59, 59, 999);
      break;
    case 'weekly':
      end.setDate(end.getDate() + (7 - end.getDay()));
      end.setHours(23, 59, 59, 999);
      break;
    case 'monthly':
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'yearly':
      end.setFullYear(end.getFullYear(), 11, 31);
      end.setHours(23, 59, 59, 999);
      break;
    default:
      throw new Error('Invalid time frame');
  }

  const groupBy = (timeFrame: string) => {
    switch (timeFrame) {
      case 'daily':
        return { $dateToString: { format: '%Y-%m-%d', date: '$orderDate' } };
      case 'weekly':
        return { $week: '$orderDate' };
      case 'monthly':
        return { $dateToString: { format: '%Y-%m', date: '$orderDate' } };
      case 'yearly':
        return { $year: '$orderDate' };
      default:
        throw new Error('Invalid time frame');
    }
  };

  return orderModel.aggregate([
    {
      $match: {
        'items.seller': sellerId,
        status: { $nin: ['Payment Pending', 'Cancelled'] },
        orderDate: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: groupBy(timeFrame),
        totalOrders: { $sum: 1 },
        totalSales: { $sum: '$price' },
        totalDiscountApplied: { $sum: '$discount' },
        deliveryCharges: { $sum: '$deliveryCharge' },
        netSales: {
          $sum: {
            $subtract: ['$price', '$discount'],
          },
        },
        totalItemsSold: {
          $sum: {
            $reduce: {
              input: '$items',
              initialValue: 0,
              in: { $add: ['$$value', '$$this.quantity'] },
            },
          },
        },
      },
    },
    {
      $project: {
        date: '$_id',
        totalOrders: 1,
        totalSales: 1,
        totalDiscountApplied: 1,
        deliveryCharges: 1,
        netSales: 1,
        totalItemsSold: 1,
      },
    },
    // {
    //   $sort: { date: -1 },
    // },
  ]);
};
export default fetchSalesReport;
