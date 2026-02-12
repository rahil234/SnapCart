import React, { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Offer } from '@/types/offer';
import { Button } from '@/components/ui/button';
import OfferForm from '@/components/admin/OfferForm';
import { Card, CardContent } from '@/components/ui/card';
import OffersTable from '@/components/admin/OffersTable';
import { useGetOffers } from '@/hooks/offers/use-get-offers.hook';

function OfferManagement() {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: offers, isLoading, isError } = useGetOffers();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !offers) return <div>Error loading offers</div>;

  if (offers.length === 0) {
    return (
      <Card className="m-4">
        <CardContent className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Offer Management</h1>
          <p className="mb-6">No offers found. Please add a new offer.</p>
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
        </CardContent>
      </Card>
    );
  }

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
        />
      </CardContent>
    </Card>
  );
}

export default OfferManagement;
