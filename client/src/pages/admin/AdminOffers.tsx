import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import offerEndpoints from '@/api/offerEndpoints';
import EditOfferCard from '@/components/admin/EditOfferCard';
import AddOfferCard from '@/components/admin/AddOfferCard';
import { IOffer } from 'shared/types';

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
      const { data } = await offerEndpoints.getOffers();
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
              <AddOfferCard onClose={() => setIsAddModalOpen(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Offer</DialogTitle>
                <DialogDescription>Edit the offer details</DialogDescription>
              </DialogHeader>
              {selectedOffer && (
                <EditOfferCard
                  offer={selectedOffer}
                  onClose={() => setIsEditModalOpen(false)}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {[
                  'Offer Name',
                  'Discount',
                  'Start Date',
                  'End Date',
                  'Status',
                  'Actions',
                ].map(header => (
                  <th
                    key={header}
                    className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {offers &&
                offers.map(offer => (
                  <tr key={offer._id}>
                    <td className="whitespace-nowrap">{offer.title}</td>
                    <td className="whitespace-nowrap">{offer.discount}%</td>
                    <td className="whitespace-nowrap">
                      {new Date(offer.startDate).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap">
                      {new Date(offer.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          offer.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {offer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                      <Button
                        variant="ghost"
                        className="mr-2"
                        onClick={() => {
                          setIsEditModalOpen(true);
                          setSelectedOffer(offer);
                        }}
                      >
                        <Edit size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default OfferManagement;
