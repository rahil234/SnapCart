import { Edit } from 'lucide-react';

import { Coupon } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const CouponsTable = ({
  coupons,
  onEditClick,
}: {
  coupons: Coupon[];
  onEditClick: (coupon: Coupon) => void;
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {[
              'Code',
              'Discount',
              'Valid From',
              'Valid To',
              'Min Amount',
              'Max Discount',
              'Status',
              'Applicable To',
              'Actions',
            ].map(header => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons &&
            coupons.map(coupon => (
              <TableRow key={coupon.id}>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>
                  {coupon.discount}
                  {coupon.type === 'Percentage' ? '%' : ' ₹'}
                </TableCell>
                <TableCell>
                  {new Date(coupon.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(coupon.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{coupon.minAmount}</TableCell>
                <TableCell>{coupon.maxDiscount}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      coupon.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {coupon.status}
                  </span>
                </TableCell>
                <TableCell>{coupon.applicableTo}</TableCell>
                <TableCell>
                  <div className=" space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditClick(coupon)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CouponsTable;
