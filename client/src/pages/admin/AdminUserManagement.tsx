import React from 'react';
import {
  Ban,
  ChevronLeft,
  ChevronRight,
  Search,
  CircleCheck,
} from 'lucide-react';

interface User {
  name: string;
  email: string;
  phone: string;
  gender: string;
  status: 'Active' | 'Blocked';
}

const users: User[] = [
  {
    name: 'Christine Brooks',
    email: '123@gmail.com',
    phone: '9897969591',
    gender: 'Male',
    status: 'Active',
  },
  {
    name: 'Christine Brooks',
    email: '123@gmail.com',
    phone: '9897969591',
    gender: 'Male',
    status: 'Active',
  },
  {
    name: 'Christine Brooks',
    email: '123@gmail.com',
    phone: '9897969591',
    gender: 'Male',
    status: 'Active',
  },
  {
    name: 'Christine Brooks',
    email: '123@gmail.com',
    phone: '9897969591',
    gender: 'Male',
    status: 'Blocked',
  },
  {
    name: 'Christine Brooks',
    email: '123@gmail.com',
    phone: '9897969591',
    gender: 'Male',
    status: 'Active',
  },
  {
    name: 'Christine Brooks',
    email: '123@gmail.com',
    phone: '9897969591',
    gender: 'Male',
    status: 'Active',
  },
];

export default function UserManagement() {
  return (
    <div className="bg-gray-50 h-full p-8">
      <div className="flex justify-between items-center mb-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Add Products
        </button>
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
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                NAME
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                EMAIL
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                PHONE
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                GENDER
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                STATUS
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y text-center divide-gray-200">
            {users.map((user, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.gender}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'Active'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    className={`${user.status === 'Active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                  >
                    {user.status === 'Active' ? (
                      <Ban className="w-5 h-5" />
                    ) : (
                      <CircleCheck className="w-5 h-5" />
                    )}
                  </button>
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
}
