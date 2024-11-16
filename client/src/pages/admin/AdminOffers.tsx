import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Edit } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import offerEndpoints from '@/api/offerEndpoints'
import productEndpoints from '@/api/productEndpoints'
import categoryEndpoints from '@/api/categoryEndpoints'
import { toast } from 'sonner'
import { Offer, Product, Category } from 'shared/types'

function OfferManagement() {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: offers, isLoading, isError } = useQuery<Offer[]>({
    queryKey: ['offers'],
    queryFn: async () => {
      const { data } = await offerEndpoints.getOffers()
      return data
    },
  })

  const { data: products } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      return await productEndpoints.getAdminProducts()
    },
  })

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const data = await categoryEndpoints.getCategories()
      return data
    },
  })

  const addOfferMutation = useMutation({
    mutationFn: offerEndpoints.addOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] })
      setIsAddModalOpen(false)
      toast.success('Offer added successfully')
    },
    onError: () => toast.error('Failed to add offer'),
  })

  const editOfferMutation = useMutation({
    mutationFn: ({ id, updatedOffer }: { id: string; updatedOffer: Omit<Offer, 'id'> }) =>
      offerEndpoints.updateOffer(id, updatedOffer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] })
      setIsEditModalOpen(false)
      toast.success('Offer updated successfully')
    },
    onError: () => toast.error('Failed to update offer'),
  })

  const handleAddOffer = (newOffer: Omit<Offer, 'id'>) => {
    addOfferMutation.mutate(newOffer)
  }

  const handleEditOffer = (updatedOffer: Offer) => {
    editOfferMutation.mutate({ id: updatedOffer._id, updatedOffer: { ...updatedOffer } })
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading offers</div>

  return (
    <Card className="m-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Offer Management</h1>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>Add Offer</Button>
            </DialogTrigger>
            <DialogContent>
              <OfferForm onSubmit={handleAddOffer} products={products} categories={categories} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Offer Name', 'Discount', 'Start Date', 'End Date', 'Status', 'Actions'].map(header => (
                  <th key={header} className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {offers && offers.map(offer => (
                <tr key={offer._id}>
                  <td className="whitespace-nowrap">{offer.title}</td>
                  <td className="whitespace-nowrap">{offer.discount}%</td>
                  <td className="whitespace-nowrap">{new Date(offer.startDate).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap">{new Date(offer.endDate).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${offer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {offer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="mr-2" onClick={() => setSelectedOffer(offer)}>
                          <Edit size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        {selectedOffer && (
                          <OfferForm offer={selectedOffer} onSubmit={handleEditOffer} products={products} categories={categories} />
                        )}
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

interface OfferFormProps {
  offer?: Offer
  onSubmit: (offer: Offer | Omit<Offer, 'id'>) => void
  products?: Product[]
  categories?: Category[]
}

function OfferForm({ offer, onSubmit, products, categories }: OfferFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<Omit<Offer, 'id'>>({
    defaultValues: {
      title: offer?.title || '',
      discount: offer?.discount || 0,
      startDate: offer?.startDate ? new Date(offer.startDate).toISOString().split('T')[0] : '',
      endDate: offer?.endDate ? new Date(offer.endDate).toISOString().split('T')[0] : '',
      status: offer?.status || 'Inactive',
      productIds: offer?.productIds || [],
      categoryIds: offer?.categoryIds || [],
    },
  })

  const watchProductIds = watch('productIds')
  const watchCategoryIds = watch('categoryIds')

  const onSubmitForm = (data: Omit<Offer, 'id'>) => {
    onSubmit(offer ? { ...data, _id: offer._id } : data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <DialogHeader>
        <DialogTitle>{offer ? 'Edit Offer' : 'Add New Offer'}</DialogTitle>
        <DialogDescription>
          {offer ? 'Make changes to your offer here.' : 'Create a new offer to add to your store.'}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input
            id="title"
            className="col-span-3"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="discount" className="text-right">
            Discount (%)
          </Label>
          <Input
            id="discount"
            type="number"
            className="col-span-3"
            {...register('discount', {
              required: 'Discount is required',
              min: { value: 0, message: 'Discount must be at least 0' },
              max: { value: 100, message: 'Discount must be at most 100' }
            })}
          />
          {errors.discount && <p className="text-red-500 text-sm">{errors.discount.message}</p>}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="startDate" className="text-right">
            Start Date
          </Label>
          <Input
            id="startDate"
            type="date"
            className="col-span-3"
            {...register('startDate', { required: 'Start date is required' })}
          />
          {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="endDate" className="text-right">
            End Date
          </Label>
          <Input
            id="endDate"
            type="date"
            className="col-span-3"
            {...register('endDate', { required: 'End date is required' })}
          />
          {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <Select onValueChange={(value) => setValue('status', value)} defaultValue={offer?.status || 'Inactive'}>
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
          <Label htmlFor="products" className="text-right">
            Products
          </Label>
          <Select
            onValueChange={(value) => setValue('productIds', [...watchProductIds, value])}
            value={watchProductIds}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select products" />
            </SelectTrigger>
            <SelectContent>
              {products?.map((product) => (
                <SelectItem key={product._id} value={product._id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="categories" className="text-right">
            Categories
          </Label>
          <Select
            onValueChange={(value) => setValue('categoryIds', [...watchCategoryIds, value])}
            value={watchCategoryIds}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select categories" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">{offer ? 'Save changes' : 'Add offer'}</Button>
      </DialogFooter>
    </form>
  )
}

export default OfferManagement;