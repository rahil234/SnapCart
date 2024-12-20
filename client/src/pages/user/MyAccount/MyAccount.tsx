import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { User, MapPin, ShoppingBag, Shield, Wallet, HandCoins } from 'lucide-react';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthState } from '@/features/auth/authSlice'
import OrdersSection from '@/pages/user/MyAccount/Orders'
import WalletSection from '@/pages/user/MyAccount/Wallet'
import AddressesSection from '@/pages/user/MyAccount/Address'
import SecuritySection from '@/pages/user/MyAccount/Security'
import ReferSection from '@/pages/user/MyAccount/ReferSection'
import ProfileSection from '@/pages/user/MyAccount/Profile'


function AccountPage() {
  const { user } = useSelector((state: { auth: AuthState }) => state.auth)
  const [activeSection, setActiveSection] = useState("profile")

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (['profile', 'addresses', 'orders', 'security', 'wallet','refer'].includes(hash)) {
        setActiveSection(hash)
      }
    }
    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
    window.history.replaceState(null, '', `#${section}`)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection user={user} />
        case 'wallet':
          return <WalletSection />
      case 'addresses':
        return <AddressesSection addresses={user.addresses} />
      case 'orders':
        return <OrdersSection />
      case 'security':
        return <SecuritySection />
      case 'refer':
        return <ReferSection />
      default:
        return <ProfileSection user={user} />
    }
  }

  return (
    <div className="mx-auto p-6">
      <div className="flex gap-6">
        <Card className="w-64 h-fit sticky top-5">
          <CardHeader>
            <CardTitle>My Account</CardTitle>
            <CardDescription>Manage your account</CardDescription>
          </CardHeader>
          <CardContent>
            <nav className="flex flex-col space-y-1">
              <Button
                variant={activeSection === 'profile' ? 'secondary' : 'ghost'}
                className="justify-start"
                onClick={() => handleSectionChange('profile')}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button
                variant={activeSection === 'wallet' ? 'secondary' : 'ghost'}
                className="justify-start"
                onClick={() => handleSectionChange('wallet')}
              >
                <Wallet className="mr-2 h-4 w-4" />
                Wallet
              </Button>
              <Button
                variant={activeSection === 'addresses' ? 'secondary' : 'ghost'}
                className="justify-start"
                onClick={() => handleSectionChange('addresses')}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Addresses
              </Button>
              <Button
                variant={activeSection === 'orders' ? 'secondary' : 'ghost'}
                className="justify-start"
                onClick={() => handleSectionChange('orders')}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Orders
              </Button>
              <Button
                variant={activeSection === 'security' ? 'secondary' : 'ghost'}
                className="justify-start"
                onClick={() => handleSectionChange('security')}
              >
                <Shield className="mr-2 h-4 w-4" />
                Security
              </Button>
              <Button
                variant={activeSection === 'refer' ? 'secondary' : 'ghost'}
                className="justify-start"
                onClick={() => handleSectionChange('refer')}
              >
                <HandCoins className="mr-2 h-4 w-4" />
                Refer a Friend
              </Button>
            </nav>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="pt-6">
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AccountPage;
