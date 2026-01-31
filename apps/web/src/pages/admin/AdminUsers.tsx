import React, { useEffect, useState } from 'react';
import {
  Ban,
  ChevronLeft,
  ChevronRight,
  Search,
  CircleCheck,
} from 'lucide-react';

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

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserService } from '@/api/user/user.service';

interface User {
  _id: string; // Assuming each user has a unique ID
  firstName: string;
  email: string;
  phone: string;
  gender: string;
  status: 'Active' | 'Blocked';
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'block' | 'allow' | null>(null);

  useEffect(() => {
    const request = async () => {
      const { data, meta, error } = await UserService.getUsers();

      if (error) {
        console.error('Failed to fetch users:', error);
        return;
      }

      setUsers(data);
    };
    request();
  }, []);

  const handleBlockUser = async (userId: string) => {
    try {
      await UserService.blockUser(userId);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, status: 'Blocked' } : user
        )
      );
    } catch (error) {
      console.error('Failed to block user:', error);
    }
  };

  const handleAllowUser = async (userId: string) => {
    try {
      await UserService.allowUser(userId);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, status: 'Active' } : user
        )
      );
    } catch (error) {
      console.error('Failed to allow user:', error);
    }
  };

  const handleAction = () => {
    if (selectedUser && actionType) {
      if (actionType === 'block') {
        handleBlockUser(selectedUser._id);
      } else if (actionType === 'allow') {
        handleAllowUser(selectedUser._id);
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
              placeholder="Search user details"
              className="pl-10 pr-4 py-2 rounded-lg border"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
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
                PHONE
              </th>
              <th className="px-6 py-3 text-xs text-center font-medium text-gray-500 uppercase tracking-wider">
                GENDER
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
            {users.map((user, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.firstName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.gender}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'Blocked'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span
                            className={`${
                              user.status === 'Blocked'
                                ? 'text-green-600 hover:text-green-900'
                                : 'text-red-600 hover:text-red-900'
                            } cursor-pointer`}
                            onClick={() => {
                              setSelectedUser(user);
                              setActionType(
                                user.status === 'Active' ? 'block' : 'allow'
                              );
                            }}
                          >
                            {user.status === 'Blocked' ? (
                              <CircleCheck className="w-5 h-5 text-green-500" />
                            ) : (
                              <Ban className="w-5 h-5 text-red-500" />
                            )}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black shadow-lg">
                          <p>
                            {user.status === 'Blocked'
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
                          {actionType === 'block' ? 'block' : 'allow'} the user.
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
    </div>
  );
};

export default AdminUsers;
