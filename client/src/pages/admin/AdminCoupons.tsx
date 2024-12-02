import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  ChevronDown,
  Edit,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import couponEndpoints from '@/api/couponEndpoints';
import { ICoupon } from 'shared/types';
import CouponForm from '@/components/admin/CouponForm';

function CouponManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | null>(null);
  const queryClient = useQueryClient();

  const {
    data: coupons,
    isLoading,
    isError,
  } = useQuery<ICoupon[]>({
    queryKey: ['coupons'],
    queryFn: couponEndpoints.getCoupons,
  });

  const addCouponMutation = useMutation({
    mutationFn: couponEndpoints.addCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Coupon added successfully');
      setIsAddModalOpen(false);
    },
    onError: () => toast.error('Failed to add coupon'),
  });

  const updateCouponMutation = useMutation({
    mutationFn: couponEndpoints.updateCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Coupon updated successfully');
      setIsEditModalOpen(false);
    },
    onError: () => toast.error('Failed to update coupon'),
  });

  const handleAddCoupon = (coupon: Omit<ICoupon, 'id'>) => {
    addCouponMutation.mutate(coupon);
  };

  const handleUpdateCoupon = (coupon: ICoupon) => {
    updateCouponMutation.mutate(coupon);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading coupons</div>;

  return (
    <Card className="m-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Coupon Management</h1>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>Add Coupon</Button>
            </DialogTrigger>
            <DialogContent>
              <CouponForm onSubmit={handleAddCoupon} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
          <div className="relative">
            <Input type="text" placeholder="Search coupons" className="pl-10" />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  'Code',
                  'Discount',
                  'Valid From',
                  'Valid To',
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
                  <TableRow key={coupon._id}>
                    <TableCell>{coupon.code}</TableCell>
                    <TableCell>
                      {coupon.discount}
                      {coupon.type === 'percentage' ? '%' : ' ₹'}
                    </TableCell>
                    <TableCell>
                      {new Date(coupon.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(coupon.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          coupon.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {coupon.status}
                      </span>
                    </TableCell>
                    <TableCell>{coupon.applicableTo}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog
                          open={isEditModalOpen}
                          onOpenChange={setIsEditModalOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedCoupon(coupon)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            {selectedCoupon && (
                              <CouponForm
                                coupon={selectedCoupon}
                                onSubmit={handleUpdateCoupon}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          {coupons && (
            <span className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">{coupons.length}</span> of{' '}
              <span className="font-medium">{coupons.length}</span> results
            </span>
          )}
          <div className="flex space-x-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CouponManagement;
