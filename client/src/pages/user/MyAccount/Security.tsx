import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { KeyRound } from 'lucide-react'

function SecuritySection() {
    const navigate = useNavigate()

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Security Settings</h2>
            <Button
                variant="secondary"
                onClick={() => navigate('/change-password')}
                className="w-full"
            >
                <KeyRound className="w-4 h-4 mr-2" />
                Change Password
            </Button>
        </div>
    )
}

export default SecuritySection;
