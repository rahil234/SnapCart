import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { IndianRupee } from 'lucide-react'

interface AddFundsProps { onAddFunds: (amount: number) => void }

function AddFundsComponent({ onAddFunds }: AddFundsProps) {
    const [amount, setAmount] = useState('')
    const [error, setError] = useState('')

    const handleNumberClick = (num: number) => {
        if (amount.length < 4) {
            setAmount(prev => {
                const newAmount = prev + num
                return newAmount.length > 4 ? prev : newAmount
            })
        }
    }

    const handleDelete = () => {
        setAmount(prev => prev.slice(0, -1))
    }

    const handleSubmit = () => {
        const numAmount = Number(amount)
        if (numAmount < 50 || numAmount > 5000) {
            setError('Amount must be between ₹50 and ₹5000')
        } else {
            onAddFunds(numAmount)
        }
    }

    useEffect(() => {
        if (amount) {
            setError('')
        }
    }, [amount])

    const numberPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center justify-between">
                    Add Funds to Wallet
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center mb-6">
                    <div className="text-4xl font-bold flex items-center justify-center">
                        <IndianRupee className="h-8 w-8 mr-2" />
                        <AnimatePresence mode="popLayout">
                            {amount.split('').map((digit, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {digit}
                                </motion.span>
                            ))}
                        </AnimatePresence>
                        {!amount && <span className="text-gray-400">0</span>}
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {numberPad.map((num) => (
                        <Button
                            key={num}
                            variant="outline"
                            className="text-2xl font-bold h-16"
                            onClick={() => handleNumberClick(num)}
                        >
                            {num}
                        </Button>
                    ))}
                    <Button variant="outline" className="text-2xl font-bold h-16" onClick={handleDelete}>
                        Del
                    </Button>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full text-lg" onClick={handleSubmit} disabled={!amount}>
                    Add ₹{amount || '0'} to Wallet
                </Button>
            </CardFooter>
        </Card>
    )
}

export default AddFundsComponent;