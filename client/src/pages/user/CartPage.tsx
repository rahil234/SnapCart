import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import cartEndpoints from '@/api/cartEndpoints'
import CartContext from '@/context/CartContext'
import { ImportMeta } from 'shared/types'
// import orderEndpoints from '@/api/orderEndpoints'

const imageUrl = (import.meta as unknown as ImportMeta).env.VITE_imageUrl

const CartPage = () => {

  const { cartData, setCartData } = useContext(CartContext)

  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await cartEndpoints.getCart()
        setCartData(response.data.cart)
        console.log('Cart data:', response.data.cart);

      } catch (error) {
        console.error('Error fetching cart data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCartData()
  }, [])

  useEffect(() => {
    if (cartData) {
      const newTotalPrice = cartData.items.reduce((total, item) => {
        return total + item.product.price * item.quantity
      }, 0)
      setCartData({ ...cartData, totalPrice: newTotalPrice })
    }
  }, [cartData?.items])

  const handleIncreaseQuantity = async (productId: string) => {
    if (!cartData) return
    setCartData({
      ...cartData,
      items: cartData.items.map((item) =>
        item.product._id === productId ? { ...item, quantity: item.quantity + 1 } : item
      ),
    })
  }

  const handleDecreaseQuantity = async (productId: string) => {
    if (!cartData) return
    const item = cartData.items.find((item) => item.product._id === productId)
    if (item && item.quantity === 1) {
      handleRemoveItem(productId)
    } else {
      setCartData({
        ...cartData,
        items: cartData.items.map((item) =>
          item.product._id === productId ? { ...item, quantity: item.quantity - 1 } : item
        ),
      })
    }
  }

  const handleRemoveItem = async (productId: string) => {
    await cartEndpoints.removeItem(productId)
    if (!cartData) return
    setCartData({
      ...cartData,
      items: cartData.items.filter((item) => item.product._id !== productId),
    })
  }

  const handleCheckout = async () => {
    if (!cartData) return
    try {
      // const response = await orderEndpoints.createOrder(cartData)
      // console.log('Checkout response:', response.data)

      // setCartData({ items: [], totalPrice: 0 })
      navigate('/checkout')
    } catch (error) {
      console.error('Error checking out cart:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Shopping Cart</h1>
      {!cartData || cartData.items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-xl text-gray-500">Your cart is currently empty.</p>
            <Button className="mt-4" onClick={() => navigate('/')}>Continue Shopping</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <AnimatePresence>
              {cartData.items.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="mb-4">
                    <CardContent className="flex items-center p-4">
                      <img
                        src={imageUrl + item.product.images[0]}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-md mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">Price: ₹{item.product.price}</p>
                        <div className="flex items-center mt-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleDecreaseQuantity(item.product._id)}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="mx-2 min-w-[2ch] text-center">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleIncreaseQuantity(item.product._id)}
                            aria-label="Increase quantity"
                            disabled={item.quantity > 9}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">₹{item.product.price * item.quantity}</p>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="mt-2"
                          onClick={() => handleRemoveItem(item.product._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{cartData.totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{cartData.totalPrice}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full"
                  onClick={handleCheckout}>Proceed to Checkout</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage;
