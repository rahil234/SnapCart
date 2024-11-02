import React, { useState, useRef } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Loader2, Upload, User, KeyRound, Plus, Trash2, Edit2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AuthState } from '@/features/auth/authSlice'
import userEndpoints from '@/api/userEndpoints'
import { ImportMeta } from 'shared/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Address {
    id?: string
    street: string
    city: string
    state: string
    zipCode: string
}

interface ProfileFormValues {
    name: string
    profilePicture: FileList
    addresses: Address[]
}

const imageUrl = (import.meta as unknown as ImportMeta).env.VITE_imageUrl

export default function ProfileEditPage() {
    const { user } = useSelector((state: { auth: AuthState }) => state.auth)

    const [isLoading, setIsLoading] = useState(false)
    const [avatarSrc, setAvatarSrc] = useState(imageUrl + user?.profilePicture || '')
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
    const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)

    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<ProfileFormValues>({
        defaultValues: {
            name: user?.firstName || '',
            addresses: user?.addresses || [],
        },
    })

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: 'addresses',
    })

    async function onSubmit(data: ProfileFormValues) {
        try {
            setIsLoading(true)
            console.log(data);
            const response = await userEndpoints.updateUserProfile(data)
            console.log(response);
            setIsLoading(false)
            toast.success('Profile updated successfully')
        }catch (error) {
            console.error('Failed to update profile:', error)
            toast.error('Failed to update profile')
            setIsLoading(false)
        }
    }

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setAvatarSrc(e.target?.result as string)
            }
            userEndpoints.uploadProfilePicture(file)
            console.log(file)
            reader.readAsDataURL(file)
        }
    }

    const handleAvatarButtonClick = () => {
        fileInputRef.current?.click()
    }

    const handleAddAddress = (address: Address) => {
        append(address)
        setIsAddressDialogOpen(false)
    }

    const handleEditAddress = (index: number, address: Address) => {
        update(index, address)
        setEditingAddressIndex(null)
        setIsAddressDialogOpen(false)
    }

    return (
        <div className="container mx-auto p-6">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>Update your name, profile picture, and addresses</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="flex items-center space-x-4">
                            <Avatar className="w-24 h-24">
                                <AvatarImage src={avatarSrc} alt="Profile picture" />
                                <AvatarFallback><User className="w-12 h-12" /></AvatarFallback>
                            </Avatar>
                            <div>
                                <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
                                <div className="mt-2">
                                    <Button type="button" variant="outline" className="cursor-pointer" onClick={handleAvatarButtonClick}>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Change Avatar
                                    </Button>
                                    <Input
                                        id="profilePicture"
                                        type="file"
                                        accept="image/*"
                                        {...register('profilePicture', {
                                            onChange: handleAvatarChange
                                        })}
                                        ref={fileInputRef}
                                        className="sr-only"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <Input
                                id="name"
                                {...register('name', {
                                    required: 'Name is required',
                                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                                })}
                                placeholder="Your name"
                                className="mt-1"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-2">Addresses</h3>
                            {fields.map((field, index) => (
                                <Card key={field.id} className="mb-4">
                                    <CardContent className="pt-4">
                                        <p><strong>Street:</strong> {field.street}</p>
                                        <p><strong>City:</strong> {field.city}</p>
                                        <p><strong>State:</strong> {field.state}</p>
                                        <p><strong>Zip Code:</strong> {field.zipCode}</p>
                                        <div className="mt-2 flex justify-end space-x-2">
                                            <Button type="button" variant="outline" size="sm" onClick={() => {
                                                setEditingAddressIndex(index)
                                                setIsAddressDialogOpen(true)
                                            }}>
                                                <Edit2 className="w-4 h-4 mr-2" />
                                                Edit
                                            </Button>
                                            <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button type="button" variant="outline" className="mt-2">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Address
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{editingAddressIndex !== null ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                                    </DialogHeader>
                                    <AddressForm
                                        onSubmit={editingAddressIndex !== null ?
                                            (address) => handleEditAddress(editingAddressIndex, address) :
                                            handleAddAddress
                                        }
                                        initialData={editingAddressIndex !== null ? fields[editingAddressIndex] : undefined}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating Profile
                                </>
                            ) : (
                                'Update Profile'
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => reset()}>Reset</Button>
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/change-password')}
                    >
                        <KeyRound className="w-4 h-4 mr-2" />
                        Change Password
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

interface AddressFormProps {
    onSubmit: (address: Address) => void
    initialData?: Address
}

function AddressForm({ onSubmit, initialData }: AddressFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<Address>({
        defaultValues: initialData,
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street</label>
                <Input
                    id="street"
                    {...register('street', { required: 'Street is required' })}
                    className="mt-1"
                />
                {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>}
            </div>
            <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <Input
                    id="city"
                    {...register('city', { required: 'City is required' })}
                    className="mt-1"
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
            </div>
            <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                <Input
                    id="state"
                    {...register('state', { required: 'State is required' })}
                    className="mt-1"
                />
                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
            </div>
            <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Zip Code</label>
                <Input
                    id="zipCode"
                    {...register('zipCode', { required: 'Zip Code is required' })}
                    className="mt-1"
                />
                {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>}
            </div>
            <Button type="submit" className="w-full" onClick={(e) => e.stopPropagation()}>
                {initialData ? 'Update Address' : 'Add Address'}
            </Button>
        </form>
    )
}