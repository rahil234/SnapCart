import {
  Ban,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Search,
} from 'lucide-react';
import React from 'react';

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

import { User } from '@/types';
import { useGetUsers } from '@/hooks/users/get-users.hook';
import { useUpdateUserStatus } from '@/hooks/users/use-update-user-status';
import { Button } from '@/components/ui/button';

const AdminUsers = () => {
  const { data: users, isLoading, isError } = useGetUsers();
  const { mutate: updateStatus, isPending } = useUpdateUserStatus();

  const getNextStatus = (status: User['status']) =>
    status === 'active' ? 'suspended' : 'active';

  const toggleStatus = (id: string, status: User['status']) => {
    updateStatus({
      id,
      status: getNextStatus(status),
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !users) return <div>Error loading users.</div>;
  if (users.length === 0) return <div>No users found.</div>;

  return (
    <div className="bg-gray-50 h-full p-8">
      {/* Search */}
      <div className="flex justify-end mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search user details"
            className="pl-10 pr-4 py-2 rounded-lg border"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase">
              <th className="px-6 py-3">EMAIL</th>
              <th className="px-6 py-3">PHONE</th>
              <th className="px-6 py-3">ROLE</th>
              <th className="px-6 py-3">STATUS</th>
              <th className="px-6 py-3">ACTIONS</th>
            </tr>
          </thead>

          <tbody className="divide-y text-center">
            {users.map(user => {
              const isSuspended = user.status === 'suspended';

              return (
                <tr key={user.id}>
                  <td className="px-6 py-4">{user.email || 'NA'}</td>
                  <td className="px-6 py-4">{user.phone || 'NA'}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        isSuspended
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isPending}
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                {isSuspended ? (
                                  <CircleCheck className="w-5 h-5 text-green-500" />
                                ) : (
                                  <Ban className="w-5 h-5 text-red-500" />
                                )}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {isSuspended ? 'Allow user' : 'Block user'}
                            </TooltipContent>
                          </Tooltip>
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Do you want to{' '}
                            <strong>{isSuspended ? 'allow' : 'block'}</strong>{' '}
                            this user?
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => toggleStatus(user.id, user.status)}
                            disabled={isPending}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-700">Showing 1–09 of 78</span>
        <div className="flex gap-2">
          <button className="p-2 bg-white shadow rounded">
            <ChevronLeft />
          </button>
          <button className="p-2 bg-white shadow rounded">
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
