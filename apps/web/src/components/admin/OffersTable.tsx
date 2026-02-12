import { toast } from 'sonner';
import { Edit } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Offer } from '@/types';
import { Button } from '@/components/ui/button';
import { OfferService } from '@/services/offer.service';

const OffersTable = ({
  onEdit,
  offers,
}: {
  onEdit: (offer: Offer) => void;
  offers: Offer[];
}) => {
  const handleEdit = (offer: Offer) => {
    onEdit(offer);
  };

  const handleDelete = async (offerId: string) => {
    const { error } = await OfferService.deactivateOffer(offerId);

    if (error) {
      toast.error('Error deleting offer');
    }

    toast.success('Offer deleted successfully');
  };

  return (
    <div>
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
            <TableRow key={offer.id}>
              <TableCell>{offer.name}</TableCell>
              <TableCell>{offer.discount}%</TableCell>
              <TableCell>
                {new Date(offer.startDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(offer.endDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    offer.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {offer.isActive ? 'Active' : 'Inactive'}
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
                  onClick={() => handleDelete(offer.id)}
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

export default OffersTable;
