import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, ChevronDown, Edit, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from 'sonner'
import productEndpoints from '@/api/productEndpoints'
import categoryEndpoints from '@/api/categoryEndpoints'
import { Category, Product } from 'shared/types'

interface ICoupon {
    id: string
    code: string
    discount: number
    type: 'percentage' | 'fixed'
    validFrom: string
    validTo: string
    status: 'Active' | 'Inactive'
    applicableTo: 'All' | 'Products' | 'Categories'
    products: string[]
    categories: string[]
}

const getCoupons = async (): Promise<ICoupon[]> => {
    // Replace this with your actual API call
    return [
        { id: '1', code: 'SUMMER10', discount: 10, type: 'percentage', validFrom: '2023-06-01', validTo: '2023-08-31', status: 'Active', applicableTo: 'All', products: [], categories: [] },
        { id: '2', code: 'NEWUSER20', discount: 20, type: 'percentage', validFrom: '2023-01-01', validTo: '2023-12-31', status: 'Active', applicableTo: 'Products', products: ['1', '2'], categories: [] },
        { id: '3', code: 'FLASH5', discount: 5, type: 'fixed', validFrom: '2023-07-01', validTo: '2023-07-07', status: 'Inactive', applicableTo: 'Categories', products: [], categories: ['1'] },
    ]
}

const addCoupon = async (coupon: Omit<ICoupon, 'id'>): Promise<ICoupon> => {
    console.log('Adding coupon:', coupon)
    return { ...coupon, id: Date.now().toString() }
}

const updateCoupon = async (coupon: ICoupon): Promise<ICoupon> => {
    console.log('Updating coupon:', coupon)
    return coupon
}


function CouponManagement() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | null>(null)
    const queryClient = useQueryClient()

    const { data: coupons, isLoading, isError } = useQuery<ICoupon[]>({
        queryKey: ['coupons'],
        queryFn: getCoupons,
    })

    const addCouponMutation = useMutation({
        mutationFn: addCoupon,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] })
            toast.success('Coupon added successfully')
            setIsAddModalOpen(false)
        },
        onError: () => toast.error('Failed to add coupon'),
    })

    const updateCouponMutation = useMutation({
        mutationFn: updateCoupon,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] })
            toast.success('Coupon updated successfully')
            setIsEditModalOpen(false)
        },
        onError: () => toast.error('Failed to update coupon'),
    })

    const handleAddCoupon = (coupon: Omit<ICoupon, 'id'>) => {
        addCouponMutation.mutate(coupon)
    }

    const handleUpdateCoupon = (coupon: ICoupon) => {
        updateCouponMutation.mutate(coupon)
    }

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error loading coupons</div>

    return (
        <Card className="m-4">
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Coupon Management</h1>
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button>Add Coupon</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <CouponForm onSubmit={handleAddCoupon} />
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <div className="relative">
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                    <div className="relative">
                        <Input type="text" placeholder="Search coupons" className="pl-10" />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {['Code', 'Discount', 'Valid From', 'Valid To', 'Status', 'Applicable To', 'Actions'].map((header) => (
                                    <TableHead key={header}>{header}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {coupons && coupons.map((coupon) => (
                                <TableRow key={coupon.id}>
                                    <TableCell>{coupon.code}</TableCell>
                                    <TableCell>{coupon.discount}{coupon.type === 'percentage' ? '%' : ' ₹'}</TableCell>
                                    <TableCell>{coupon.validFrom}</TableCell>
                                    <TableCell>{coupon.validTo}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${coupon.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {coupon.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{coupon.applicableTo}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" onClick={() => setSelectedCoupon(coupon)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    {selectedCoupon && (
                                                        <CouponForm coupon={selectedCoupon} onSubmit={handleUpdateCoupon} />
                                                    )}
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    {coupons && <span className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">{coupons.length}</span> of{' '}
                        <span className="font-medium">{coupons.length}</span> results
                    </span>}
                    <div className="flex space-x-2">
                        <Button variant="outline" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

interface CouponFormProps {
    coupon?: ICoupon
    onSubmit: (coupon: ICoupon | Omit<ICoupon, 'id'>) => void
}

function CouponForm({ coupon, onSubmit }: CouponFormProps) {
    const { data: products } = useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: productEndpoints.getAdminProducts,
    })

    const { data: categories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: categoryEndpoints.getCategories,
    })

    const [formData, setFormData] = useState<Omit<ICoupon, 'id'>>({
        code: coupon?.code || '',
        discount: coupon?.discount || 0,
        type: coupon?.type || 'percentage',
        validFrom: coupon?.validFrom || '',
        validTo: coupon?.validTo || '',
        status: coupon?.status || 'Active',
        applicableTo: coupon?.applicableTo || 'All',
        products: coupon?.products || [],
        categories: coupon?.categories || [],
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleCheckboxChange = (name: 'products' | 'categories', id: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: prev[name].includes(id)
                ? prev[name].filter(item => item !== id)
                : [...prev[name], id]
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(coupon ? { ...formData, id: coupon.id } : formData)
    }

    return (
        <form onSubmit={handleSubmit}>
            <DialogHeader>
                <DialogTitle>{coupon ? 'Edit Coupon' : 'Add New Coupon'}</DialogTitle>
                <DialogDescription>
                    {coupon ? 'Make changes to your coupon here.' : 'Create a new coupon to add to your store.'}
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">
                        Code
                    </Label>
                    <Input
                        id="code"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="discount" className="text-right">
                        Discount
                    </Label>
                    <Input
                        id="discount"
                        name="discount"
                        type="number"
                        value={formData.discount}
                        onChange={handleChange}
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                        Type
                    </Label>
                    <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="validFrom" className="text-right">
                        Valid From
                    </Label>
                    <Input
                        id="validFrom"
                        name="validFrom"
                        type="date"
                        value={formData.validFrom}
                        onChange={handleChange}
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="validTo" className="text-right">
                        Valid To
                    </Label>
                    <Input
                        id="validTo"
                        name="validTo"
                        type="date"
                        value={formData.validTo}
                        onChange={handleChange}
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                        Status
                    </Label>
                    <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value as 'Active' | 'Inactive')}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="applicableTo" className="text-right">
                        Applicable To
                    </Label>
                    <Select name="applicableTo" value={formData.applicableTo} onValueChange={(value) => handleSelectChange('applicableTo', value as 'All' | 'Products' | 'Categories')}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select applicability" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Products</SelectItem>
                            <SelectItem value="Products">Specific Products</SelectItem>
                            <SelectItem value="Categories">Specific Categories</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {formData.applicableTo === 'Products' && products && (
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right">Products</Label>
                        <div className="col-span-3 space-y-2">
                            {products.map((product) => (
                                <div key={product._id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`product-${product._id}`}
                                        checked={formData.products.includes(product._id)}
                                        onCheckedChange={() => handleCheckboxChange('products', product._id)}
                                    />
                                    <label htmlFor={`product-${product._id}`}>{product.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {formData.applicableTo === 'Categories' && categories && (
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right">Categories</Label>
                        <div className="col-span-3 space-y-2">
                            {categories.map((category) => (
                                <div key={category._id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`category-${category._id}`}
                                        checked={formData.categories.includes(category._id)}
                                        onCheckedChange={() => handleCheckboxChange('categories', category._id)}
                                    />
                                    <label htmlFor={`category-${category._id}`}>{category.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <DialogFooter>
                <Button type="submit">{coupon ? 'Save changes' : 'Add coupon'}</Button>
            </DialogFooter>
        </form>
    )
}

export default CouponManagement;