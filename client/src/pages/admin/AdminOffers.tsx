import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import offerEndpoints from '@/api/offerEndpoints';
import productEndpoints from '@/api/productEndpoints';
import categoryEndpoints from '@/api/categoryEndpoints';
import { toast } from 'sonner';
import { Offer, Product, Category } from 'shared/types';
import AddOfferCard from '@/components/admin/AddOfferCard';
import EditOfferCard from '@/components/admin/EditOfferCard';

function OfferManagement() {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: offers,
    isLoading,
    isError,
  } = useQuery<Offer[]>({
    queryKey: ['offers'],
    queryFn: async () => {
      const { data } = await offerEndpoints.getOffers();
      return data;
    },
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      return await productEndpoints.getAdminProducts();
    },
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      return await categoryEndpoints.getCategories();
    },
  });

  const editOfferMutation = useMutation({
    mutationFn: ({
      id,
      updatedOffer,
    }: {
      id: string;
      updatedOffer: Omit<Offer, 'id'>;
    }) => offerEndpoints.updateOffer(id, updatedOffer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      setIsEditModalOpen(false);
      toast.success('Offer updated successfully');
    },
    onError: () => toast.error('Failed to update offer'),
  });

  const handleEditOffer = (updatedOffer: Offer) => {
    editOfferMutation.mutate({
      id: updatedOffer._id,
      updatedOffer: { ...updatedOffer },
    });
  };

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
              <AddOfferCard />
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Dialog
                        open={isEditModalOpen}
                        onOpenChange={setIsEditModalOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="mr-2"
                            onClick={() => setSelectedOffer(offer)}
                          >
                            <Edit size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          {selectedOffer && (
                            <EditOfferCard
                              offer={selectedOffer}
                              onSubmit={handleEditOffer}
                              products={products}
                              categories={categories}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
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
