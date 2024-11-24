import orderModel from '@models/orderModel';

const fetchSalesReport = async (
  sellerId: string,
  timeFrame: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined
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
      end.setMonth(end.getMonth() + 1, 0); // Last day of the current month
      end.setHours(23, 59, 59, 999);
      break;

    case 'yearly':
      end.setFullYear(end.getFullYear(), 11, 31); // December 31st
      end.setHours(23, 59, 59, 999);
      break;

    default:
      throw new Error('Invalid time frame');
  }

  const groupBy = (timeFrame: string) => {
    switch (timeFrame) {
      case 'daily':
        return {
          $dateToString: { format: '%Y-%m-%d', date: '$dateOrdered' },
        };
      case 'weekly':
        return {
          $dateToString: {
            format: '%Y-%m-%d',
            date: {
              $subtract: [
                '$dateOrdered',
                {
                  $multiply: [
                    { $dayOfWeek: '$dateOrdered' },
                    24 * 60 * 60 * 1000,
                  ],
                },
              ],
            },
          },
        };
      case 'monthly':
        return { $dateToString: { format: '%Y-%m', date: '$dateOrdered' } };
      case 'yearly':
        return { $year: '$dateOrdered' };
      default:
        throw new Error('Invalid time frame');
    }
  };

  return orderModel.aggregate([
    {
      $match: {
        sellerId,
        paymentMethod: { $ne: 'pending' },
        orderDate: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: groupBy(timeFrame),
        totalOrders: { $sum: 1 },
        totalSales: { $sum: '$totalAmount' },
        totalDiscountApplied: { $sum: '$discountApplied' },
        netSales: { $sum: '$finalAmount' },
        totalItemsSold: {
          $sum: {
            $reduce: {
              input: '$items',
              initialValue: 0,
              in: { $add: ['$$value', '$$this.quantity'] },
            },
          },
        },
        // totalCouponDiscount: {
        //   $sum: {
        //     $reduce: {
        //       input: '$couponsApplied',
        //       initialValue: 0,
        //       in: { $add: ['$$value', '$$this.discountAmount'] },
        //     },
        //   },
        // },
      },
    },
    {
      $project: {
        date: '$_id',
        totalOrders: 1,
        totalSales: 1,
        totalDiscountApplied: 1,
        netSales: 1,
        totalItemsSold: 1,
        // totalCouponDiscount: 1,
        startDate:
          timeFrame === 'yearly'
            ? {
                $dateFromString: {
                  dateString: { $concat: [{ $toString: '$_id' }, '-01-01'] },
                },
              }
            : {
                $dateFromString: {
                  dateString: {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: {
                        $subtract: [
                          { $dateFromString: { dateString: '$_id' } },
                          {
                            $dayOfWeek: {
                              $dateFromString: { dateString: '$_id' },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
        endDate:
          timeFrame === 'yearly'
            ? {
                $dateFromString: {
                  dateString: { $concat: [{ $toString: '$_id' }, '-12-31'] },
                },
              }
            : {
                $dateFromString: {
                  dateString: {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: {
                        $add: [
                          { $dateFromString: { dateString: '$_id' } },
                          { $multiply: [6, 24 * 60 * 60 * 1000] },
                        ],
                      },
                    },
                  },
                },
              },
      },
    },
    {
      $sort: { date: -1 },
    },
  ]);
};

export default fetchSalesReport;
