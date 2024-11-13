import React from 'react'
// import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ImportMeta, IOrder } from 'shared/types'

const imageUrl = (import.meta as unknown as ImportMeta).env.VITE_imageUrl

interface OrderDetailsModalProps {
  order: IOrder | null
  isOpen: boolean
  onClose: () => void
  onUpdateStatus: (orderId: string, newStatus: string) => void
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose, onUpdateStatus }) => {
  if (!order) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order Details - {order.orderId}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
            <p><strong>Name:</strong> {order.customerName}</p>
            {/* <p><strong>Email:</strong> {order.customerEmail}</p>
            <p><strong>Phone:</strong> {order.customerPhone}</p>
            <p><strong>Address:</strong> {order.shippingAddress}</p> */}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Order Information</h3>
            <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
            <p><strong>Total:</strong> ₹{order.price.toFixed(2)}</p>
            <p><strong>Status:</strong> 
              <Select
                onValueChange={(value) => onUpdateStatus(order.orderId, value)}
                defaultValue={order.status}
              >
                <SelectTrigger className="w-[180px] ml-2">
                  <SelectValue placeholder={order.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Order Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <img src={imageUrl+item.image} alt={item.name} width={50} height={50} className="rounded-md" />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>₹{item.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OrderDetailsModal