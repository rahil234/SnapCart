import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2, Upload, User, KeyRound } from 'lucide-react'
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

interface ProfileFormValues {
    name: string
    profilePicture: FileList
}

const imageUrl = (import.meta as unknown as ImportMeta).env.VITE_imageUrl

export default function ProfileEditPage() {
    const { user } = useSelector((state: { auth: AuthState }) => state.auth)

    const [isLoading, setIsLoading] = useState(false)
    const [avatarSrc, setAvatarSrc] = useState(imageUrl + user?.profilePicture || '')

    const fileInputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormValues>({
        defaultValues: {
            name: user?.firstName || '',
        },
    })

    async function onSubmit(data: ProfileFormValues) {
        setIsLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsLoading(false)
        console.log(data)
        toast.success('Profile updated successfully')
    }

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setAvatarSrc(e.target?.result as string)
            }
            userEndpoints.uploadProfilePicture(file)

            console.log(file);

            reader.readAsDataURL(file)
        }
    }

    const handleAvatarButtonClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="container mx-auto p-6">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>Update your name and profile picture</CardDescription>
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