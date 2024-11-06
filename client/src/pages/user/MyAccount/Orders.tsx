import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import orderEndpoints from '@/api/orderEndpoints'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package } from 'lucide-react'
import { AuthState } from '@/features/auth/authSlice'
import { IOrder } from 'shared/types'

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

    function calculateTotal(order: IOrder) {
        return order.items.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    function getStatusColor(status: IOrder['status']) {
        switch (status) {
            case 'pending':
                return 'text-yellow-500'
            case 'processing':
                return 'text-blue-500'
            case 'shipped':
                return 'text-purple-500'
            case 'delivered':
                return 'text-green-500'
            default:
                return 'text-gray-500'
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
                <Accordion type="single" collapsible className="space-y-4">
                    {orders.map((order) => (
                        <AccordionItem key={order.orderId} value={order.orderId}>
                            <Card>
                                <CardHeader>
                                    <AccordionTrigger>
                                        <CardTitle className="flex justify-between items-center w-full">
                                            <span>Order #{order.orderId}</span>
                                            <span className={`text-sm font-normal ${getStatusColor(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </CardTitle>
                                    </AccordionTrigger>
                                </CardHeader>
                                <AccordionContent>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <p><strong>Date:</strong>{String(new Date(order.date))}</p>
                                            <p><strong>Total:</strong> ₹{calculateTotal(order).toFixed(2)}</p>
                                            <h4 className="font-semibold mt-4">Items:</h4>
                                            <ul className="list-disc list-inside space-y-1">
                                                {order.items.map((item, index) => (
                                                    <li key={index}>
                                                        {item.name} - ₹{item.price.toFixed(2)} x {item.quantity}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </div>
    )
}

export default OrdersSection;
