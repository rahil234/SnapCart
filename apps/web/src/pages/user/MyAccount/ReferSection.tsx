import React, { useState } from 'react';
import { Check, Gift, Share2, Users } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGetReferralCode } from '@/hooks/users/use-get-referral-code.hook';

const ReferSection = () => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { toast } = useToast();

  const { data: referralCode, isLoading } = useGetReferralCode();

  const referralLink = import.meta.env.VITE_REFERRAL_LINK + referralCode;

  console.log(referralLink);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setIsCopied(true);
      toast({
        title: 'Copied!',
        description: 'Referral link copied to clipboard',
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-100 to-indigo-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Refer & Earn Rewards!
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-2xl font-semibold text-gray-800">You Get</h2>
            <p className="text-4xl font-bold text-green-600">₹250</p>
            <p className="text-gray-600">for each referral</p>
          </div>
          <div className="text-center md:text-right">
            <h2 className="text-2xl font-semibold text-gray-800">
              Your Friend Gets
            </h2>
            <p className="text-4xl font-bold text-blue-600">₹50</p>
            <p className="text-gray-600">signup bonus</p>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4">
            How it works
          </h3>
          <ul className="space-y-4">
            <li className="flex items-center">
              <Share2 className="text-indigo-600 mr-3" />
              <span>Share your unique referral link with friends</span>
            </li>
            <li className="flex items-center">
              <Users className="text-indigo-600 mr-3" />
              <span>Your friend signs up using your link</span>
            </li>
            <li className="flex items-center">
              <Gift className="text-indigo-600 mr-3" />
              <span>Both of you receive your rewards!</span>
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Your Referral Link
          </h3>
          <div className="flex">
            <Input
              type="text"
              value={isLoading ? 'Loading...' : referralLink}
              readOnly
              className="flex-grow"
            />
            <Button className="ml-2" onClick={handleCopy} disabled={isLoading}>
              {isCopied ? <Check className="h-4 w-4" /> : 'Copy'}
            </Button>
          </div>
        </div>

        <div className="text-center">
          <Button className="w-full md:w-auto">Invite Friends Now</Button>
        </div>
      </div>
    </div>
  );
};

export default ReferSection;
