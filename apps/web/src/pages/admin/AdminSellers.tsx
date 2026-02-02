import {
  Ban,
  ChevronLeft,
  ChevronRight,
  Search,
  CircleCheck,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { SellerService } from '@/services/seller.service';
import AddSellerCard from '@/components/admin/AddSellerCard';

interface Seller {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'blocked';
}

const AdminSellers = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedUser, setSelectedUser] = useState<Seller | null>(null);
  const [actionType, setActionType] = useState<'block' | 'allow' | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await SellerService.getSellers();

      if (result.error) {
        console.error('Failed to fetch sellers:', result.error);
        return;
      }

      if (result.data) {
        setSellers(result.data);
      }
    })();
  }, []);

  const handleBlockUser = async (userId: string) => {
    try {
      await SellerService.blockSeller(userId);
      setSellers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, status: 'blocked' } : user
        )
      );
    } catch (error) {
      console.error('Failed to block user:', error);
    }
  };

  const handleAllowUser = async (userId: string) => {
    try {
      await SellerService.allowSeller(userId);
      setSellers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, status: 'active' } : user
        )
      );
    } catch (error) {
      console.error('Failed to allow user:', error);
    }
  };

  const handleAction = () => {
    if (selectedUser && actionType) {
      if (actionType === 'block') {
        handleBlockUser(selectedUser.id);
      } else if (actionType === 'allow') {
        handleAllowUser(selectedUser.id);
      }
      setSelectedUser(null);
      setActionType(null);
    }
  };

  return (
    <div className="bg-gray-50 h-full p-8">
      <div className="flex justify-end items-center mb-6">
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search seller details"
              className="pl-10 pr-4 py-2 rounded-lg border"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Seller
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-6 py-3 text-xs text-center font-medium text-gray-500 uppercase tracking-wider">
                NAME
              </th>
              <th className="px-6 py-3 text-xs text-center font-medium text-gray-500 uppercase tracking-wider">
                EMAIL
              </th>
              <th className="px-6 py-3 text-xs text-center font-medium text-gray-500 uppercase tracking-wider">
                STATUS
              </th>
              <th className="px-6 py-3 text-xs text-center font-medium text-gray-500 uppercase tracking-wider">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y text-center divide-gray-200">
            {sellers.map((seller, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{seller.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{seller.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      seller.status === 'blocked'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {seller.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span
                            className={`${
                              seller.status === 'blocked'
                                ? 'text-green-600 hover:text-green-900'
                                : 'text-red-600 hover:text-red-900'
                            } cursor-pointer`}
                            onClick={() => {
                              setSelectedUser(seller);
                              setActionType(
                                seller.status === 'active' ? 'block' : 'allow'
                              );
                            }}
                          >
                            {seller.status === 'blocked' ? (
                              <CircleCheck className="w-5 h-5 text-green-500" />
                            ) : (
                              <Ban className="w-5 h-5 text-red-500" />
                            )}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black shadow-lg">
                          <p>
                            {seller.status === 'blocked'
                              ? 'Allow user'
                              : 'Block user'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-100">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600">
                          Are you sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-700">
                          Do you want to{' '}
                          {actionType === 'block' ? 'block' : 'allow'} the
                          seller.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-200 text-gray-700">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-400 text-white"
                          onClick={handleAction}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-700">Showing 1-09 of 78</span>
        <div className="flex space-x-2">
          <button className="p-2 rounded bg-white shadow">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded bg-white shadow">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      {isDialogOpen && <AddSellerCard onClose={() => setIsDialogOpen(false)} />}
    </div>
  );
};

export default AdminSellers;
