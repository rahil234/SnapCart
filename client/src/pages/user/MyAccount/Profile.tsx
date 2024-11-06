import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { Loader2, Upload, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { changeProfilePicture } from '@/features/auth/authSlice'
import userEndpoints from '@/api/userEndpoints'
import { Address } from '@/pages/user/MyAccount/Address'
import { User, ImportMeta } from 'shared/types'

const imageUrl = (import.meta as unknown as ImportMeta).env.VITE_imageUrl

export interface ProfileFormValues {
    name: string
    profilePicture: FileList
    addresses: Address[]
  }

function ProfileSection({ user }: { user: User }) {
    const [isLoading, setIsLoading] = useState(false)
    const [avatarSrc, setAvatarSrc] = useState(imageUrl + user?.profilePicture || '')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const dispatch = useDispatch()

    const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
        defaultValues: {
            name: user?.firstName || '',
        },
    })

    async function onSubmit(data: ProfileFormValues) {
        try {
            setIsLoading(true)
            const response = await userEndpoints.updateUserProfile(data)
            console.log(response)
            setIsLoading(false)
            toast.success('Profile updated successfully')
        } catch (error) {
            console.error('Failed to update profile:', error)
            toast.error('Failed to update profile')
            setIsLoading(false)
        }
    }

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setAvatarSrc(e.target?.result as string)
            }
            const response = await userEndpoints.uploadProfilePicture(file)
            dispatch(changeProfilePicture(response.data.profilePicture))
            reader.readAsDataURL(file)
        }
    }

    const handleAvatarButtonClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex items-center space-x-4">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={avatarSrc} alt="Profile picture" />
                        <AvatarFallback><UserIcon className="w-12 h-12" /></AvatarFallback>
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
                                className="hidden"
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
        </div>
    )
}

export default ProfileSection;
