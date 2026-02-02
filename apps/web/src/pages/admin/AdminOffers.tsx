import { toast } from 'sonner';
import { Edit } from 'lucide-react';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IOffer } from '@/types/offer';
import { Button } from '@/components/ui/button';
import OfferForm from '@/components/admin/OfferForm';
import { OfferService } from '@/services/offer.service';
import { Card, CardContent } from '@/components/ui/card';

const OffersTable = ({
  className,
  onEdit,
  onDelete,
  offers,
}: {
  className?: string;
  onEdit: (offer: IOffer) => void;
  onDelete: (offerId: string) => void;
  offers: IOffer[];
}) => {
  const handleEdit = (offer: IOffer) => {
    onEdit(offer);
  };

  const handleDelete = async (offerId: string) => {
    try {
      await OfferService.deleteOffer(offerId);
      toast.success('Offer deleted successfully');
      onDelete(offerId);
    } catch (error) {
      toast.error('Error deleting offer');
    }
  };

  return (
    <div className={className}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Offer Name</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.map(offer => (
            <TableRow key={offer._id}>
              <TableCell>{offer.title}</TableCell>
              <TableCell>{offer.discount}%</TableCell>
              <TableCell>
                {new Date(offer.startDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(offer.expiryDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    offer.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {offer.status}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  className="mr-2"
                  onClick={() => handleEdit(offer)}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(offer._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

function OfferManagement() {
  const [selectedOffer, setSelectedOffer] = useState<IOffer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: offers,
    isLoading,
    isError,
  } = useQuery<IOffer[]>({
    queryKey: ['admin-offers'],
    queryFn: async () => {
      const { data } = await OfferService.getOffers();
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading offers</div>;

  return (
    <Card className="m-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Offer Management</h1>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>Add Offer</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Offer</DialogTitle>
                <DialogDescription>Add the offer details</DialogDescription>
              </DialogHeader>
              <OfferForm onClose={() => setIsAddModalOpen(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Offer</DialogTitle>
                <DialogDescription>Edit the offer details</DialogDescription>
              </DialogHeader>
              {selectedOffer && (
                <OfferForm
                  offer={selectedOffer}
                  onClose={() => setIsEditModalOpen(false)}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>

        <OffersTable
          offers={offers}
          onEdit={offer => {
            setSelectedOffer(offer);
            setIsEditModalOpen(true);
          }}
          onDelete={() => {
            // refetch or update local state to remove deleted offer
          }}
        />
      </CardContent>
    </Card>
  );
}

export default OfferManagement;
