import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Gift, Wallet, X } from 'lucide-react';

interface ReferralSuccessCardProps {
  onClose: () => void;
}

function ReferralSuccessCard({
  onClose,
}: ReferralSuccessCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          Referral Offer Success!
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-4">
          <Gift className="h-12 w-12 text-green-500" />
        </div>
        <p className="text-center text-muted-foreground">
          Congratulations! Your referral offer has been successfully applied to
          your account.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button className="w-full">
          <Wallet className="mr-2 h-4 w-4" /> Go to Wallet
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ReferralSuccessCard;
