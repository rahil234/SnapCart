import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Edit, ChevronLeft, ChevronRight } from 'lucide-react'
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
import { toast } from 'sonner'
import { Offer } from 'shared/types'

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
              <OfferForm onSubmit={handleAddOffer} />
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
          </div>
          <div className="relative">
            <Input type="text" placeholder="Search offers" className="pl-10" />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
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
                          <OfferForm offer={selectedOffer} onSubmit={handleEditOffer} />
                        )}
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{offers?.length || 0}</span> of{' '}
            <span className="font-medium">{offers?.length || 0}</span> results
          </span>
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

interface OfferFormProps {
  offer?: Offer
  onSubmit: (offer: Offer | Omit<Offer, 'id'>) => void
}

function OfferForm({ offer, onSubmit }: OfferFormProps) {
  const { control, handleSubmit } = useForm<Omit<Offer, 'id'>>({
    defaultValues: {
      title: offer?.title || '',
      discount: offer?.discount || 0,
      startDate: offer?.startDate || '',
      endDate: offer?.endDate || '',
      status: offer?.status || 'Inactive',
    },
  })

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
          <Controller
            name="title"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <Input id="title" {...field} className="col-span-3" />
            )}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="discount" className="text-right">
            Discount (%)
          </Label>
          <Controller
            name="discount"
            control={control}
            rules={{ required: 'Discount is required', min: 0, max: 100 }}
            render={({ field }) => (
              <Input id="discount" type="number" {...field} className="col-span-3" />
            )}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="startDate" className="text-right">
            Start Date
          </Label>
          <Controller
            name="startDate"
            control={control}
            rules={{ required: 'Start date is required' }}
            render={({ field }) => (
              <Input id="startDate" type="date" {...field} className="col-span-3" />
            )}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="endDate" className="text-right">
            End Date
          </Label>
          <Controller
            name="endDate"
            control={control}
            rules={{ required: 'End date is required' }}
            render={({ field }) => (
              <Input id="endDate" type="date" {...field} className="col-span-3" />
            )}
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">{offer ? 'Save changes' : 'Add offer'}</Button>
      </DialogFooter>
    </form>
  )
}

export default OfferManagement;