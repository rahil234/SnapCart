import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import orderEndpoints from '@/api/orderEndpoints'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package } from 'lucide-react'
import { AuthState } from '@/features/auth/authSlice'
import RetryPaymentButton from "@/components/user/RetryPaymentButton"
import { toast } from "sonner"
import { ImportMeta } from "shared/types"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const imageUrl = (import.meta as unknown as ImportMeta).env.VITE_imageUrl

interface IOrder {
    orderId: string
    status: string
    price: number
    createdAt: string
    address: Array<string>
    items: {
        _id: string
        name: string
        image: string
        price: number
        quantity: number
        status: string
    }[]
    shippingAddress: {
        address: string
        city: string
        state: string
        postalCode: string
        country: string
    }
    paymentMethod: string
    trackingNumber?: string
}

function OrdersSection() {
    const [orders, setOrders] = useState<IOrder[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const user = useSelector((state: { auth: AuthState }) => state.auth.user)

    useEffect(() => {
        if (!user) {
            return
        }

        async function fetchOrders() {
            try {
                setIsLoading(true)
                const response = await orderEndpoints.getOrders()
                setOrders(response.data)
                setIsLoading(false)
            } catch (error) {
                console.error('Failed to fetch orders:', error)
                setError('Failed to fetch orders. Please try again later.')
                setIsLoading(false)
            }
        }
        fetchOrders()
    }, [user])

    function getStatusColor(status: string) {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-500'
            case 'Payment Pending':
                return 'bg-red-500'
            case 'Processing':
                return 'bg-blue-500'
            case 'Shipped':
                return 'bg-purple-500'
            case 'Delivered':
                return 'bg-green-500'
            case 'Cancelled':
                return 'bg-gray-500'
            default:
                return 'bg-gray-500'
        }
    }

    const handleCancelItem = async (orderId: string, itemId: string) => {
        try {
            await orderEndpoints.cancelOrderItem(orderId, itemId)
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.orderId === orderId
                        ? {
                            ...order,
                            items: order.items.map(item =>
                                item._id === itemId
                                    ? { ...item, status: 'Cancelled' }
                                    : item
                            )
                        }
                        : order
                )
            )
            toast.success("Item cancelled successfully")
        } catch (error) {
            console.error('Failed to cancel item:', error)
            toast.error("Failed to cancel item. Please try again.")
        }
    }

    if (isLoading) {
        return <div className="text-center">Loading orders...</div>
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Order History</h2>
            {orders.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center text-gray-500">
                            <Package className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2">You have no recent orders.</p>
                            <Button className="mt-4" onClick={() => window.location.href = '/'}>Start Shopping</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Card key={order.orderId}>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center w-full">
                                    <span className="text-sm">#{order.orderId}</span>
                                    <Badge className={getStatusColor(order.status)}>
                                        {order.status}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.items.map((item) => (
                                            <TableRow key={item._id}>
                                                <TableCell>
                                                    <img src={imageUrl + item.image} alt={item.name} className="w-16 h-16 object-cover" />
                                                </TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>₹{item.price.toFixed(2)}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(item.status)}>
                                                        {item.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleCancelItem(order.orderId, item._id)}
                                                        disabled={item.status === 'Delivered' || item.status === 'Shipped' || item.status === 'Cancelled'}
                                                    >
                                                        Cancel Item
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="mt-4 space-y-2">
                                    <p>
                                        <strong>Date:</strong>{' '}
                                        {new Intl.DateTimeFormat('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric'
                                        }).format(new Date(order.createdAt))}
                                    </p>
                                    <p><strong>Total:</strong> ₹{order.price.toFixed(2)}</p>
                                    <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                                    <div>
                                        <strong>Shipping Address:</strong>
                                        {/* <p>{order.shippingAddress.address}</p>
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                                        <p>{order.shippingAddress.country}</p> */}
                                        {order.address.map((address, index) => <p key={index}>{address}</p>)}
                                    </div>
                                    {order.trackingNumber && (
                                        <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>
                                    )}
                                    {order.status === 'Payment Pending' &&
                                        <div className='flex justify-end'>
                                            <RetryPaymentButton orderId={order.orderId}>
                                                Retry Payment
                                            </RetryPaymentButton>
                                        </div>
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default OrdersSection;