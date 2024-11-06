import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from 'sonner'
import { IOrder } from 'shared/types'
import orderEndpoints from '@/api/orderEndpoints'

const { getAdminOrders, updateOrderStatus } = orderEndpoints

interface UpdateOrderData {
  orderId: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
}

const OrdersTable: React.FC<{ orders: IOrder[] }> = ({ orders }) => {
    const queryClient = useQueryClient()

    const updateOrderMutation = useMutation<unknown, Error, UpdateOrderData>({
        mutationFn: (data: UpdateOrderData) => updateOrderStatus(data),
        onSuccess: () => {
            toast.success('Order status updated successfully')
            queryClient.invalidateQueries(['adminOrders'])
        },
        onError: () => {
            toast.error('Failed to update order status')
        },
    })

    const handleStatusChange = (orderId: string, newStatus: 'Pending' | 'Processing' | 'Completed' | 'Cancelled') => {
        updateOrderMutation.mutate({ orderId, status: newStatus })
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {['Order ID', 'Customer', 'Price', 'Status', 'Date', 'Actions'].map((header) => (
                        <TableHead key={header} className="text-center">{header}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order.orderId}>
                        <TableCell className="text-center">{order.orderId}</TableCell>
                        <TableCell className="text-center">{order.customerName}</TableCell>
                        <TableCell className="text-center">₹{order.price.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                'bg-red-100 text-red-800'
                            }`}>
                                {order.status}
                            </span>
                        </TableCell>
                        <TableCell className="text-center">{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-center">
                            <div className="flex justify-center space-x-2">
                                <Select
                                    onValueChange={(value) => handleStatusChange(order.orderId, value as UpdateOrderData['status'])}
                                    defaultValue={order.status}
                                >
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue placeholder="Update Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Processing">Processing</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default function AdminOrders() {
    const { data: orders, isLoading, isError } = useQuery<IOrder[]>({
        queryKey: ['adminOrders'],
        queryFn: getAdminOrders,
    })

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    if (isError) {
        return <div className="text-center text-red-600">Error loading orders. Please try again later.</div>
    }

    return (
        <main className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="status">Status</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="price">Price</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <Input type="text" placeholder="Search order" className="pl-10" />
                    </div>
                </div>
            </div>

            {orders && orders.length > 0 ? (
                <>
                    <OrdersTable orders={orders} />
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Showing 1-{orders.length} of {orders.length}</span>
                        <div className="flex space-x-2">
                            <Button variant="outline" size="icon">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500">No orders available.</p>
                </div>
            )}
        </main>
    )
}