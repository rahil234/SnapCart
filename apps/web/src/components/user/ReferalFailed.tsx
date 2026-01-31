import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, X } from 'lucide-react';

interface ReferralInvalidCardProps {
  onClose: () => void;
}

function ReferralInvalidCard({ onClose }: ReferralInvalidCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Invalid Referral</CardTitle>
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
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <p className="text-center text-muted-foreground">
          We&#39;re sorry, but the referral code you entered is invalid or has
          already been used.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="outline" onClick={onClose} className="w-full">
          Close
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ReferralInvalidCard;
