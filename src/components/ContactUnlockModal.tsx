'use client'

import { useState } from 'react'
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Phone, Mail, MessageCircle, IndianRupee, Star, Shield } from "lucide-react"

interface ContactUnlockModalProps {
  listing: {
    id: string
    title: string
    user: {
      id: string
      name: string
      isVerified: boolean
      isPremium: boolean
    }
  }
  children: React.ReactNode
}

export default function ContactUnlockModal({ listing, children }: ContactUnlockModalProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [contactInfo, setContactInfo] = useState<any>(null)
  const [unlockStatus, setUnlockStatus] = useState<'locked' | 'unlocked' | 'own'>('locked')

  const handleUnlockContact = async () => {
    if (!user) {
      setError('Please log in to unlock contact information')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/listings/unlock-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          userId: user.id
        })
      })

      const data = await response.json()

      if (data.success) {
        if (data.ownListing) {
          setUnlockStatus('own')
        } else {
          setUnlockStatus('unlocked')
        }
        setContactInfo(data.contact)
      } else {
        setError(data.message || 'Failed to unlock contact')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isOwnListing = user && user.id === listing.user.id

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Contact Seller
          </DialogTitle>
          <DialogDescription>
            Get in touch with the seller to discuss the item
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Listing Info */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{listing.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <span>Seller: {listing.user.name}</span>
                {listing.user.isVerified && (
                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {listing.user.isPremium && (
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </CardDescription>
            </CardHeader>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Contact Information */}
          {contactInfo && (
            <Card className="border-2 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Contact Unlocked!
                </CardTitle>
                <CardDescription>
                  {unlockStatus === 'own' 
                    ? "This is your own listing" 
                    : "Contact information has been unlocked successfully"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <span className="font-medium">{contactInfo.phone}</span>
                </div>
                {contactInfo.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span className="font-medium">{contactInfo.email}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Payment Prompt */}
          {!contactInfo && unlockStatus === 'locked' && (
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-600 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5" />
                  Unlock Contact
                </CardTitle>
                <CardDescription>
                  Pay ₹5 to unlock the seller's contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {user?.isPremium && (
                  <Alert>
                    <AlertDescription className="text-yellow-800">
                      <strong>Premium User Benefit:</strong> Contact unlock is free for you!
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span>Contact Unlock Fee:</span>
                    <span className="font-semibold">
                      {user?.isPremium ? 'FREE' : '₹5.00'}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={handleUnlockContact} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Processing...' : (
                    <>
                      <IndianRupee className="w-4 h-4 mr-2" />
                      {user?.isPremium ? 'Unlock Contact (Free)' : 'Pay ₹5 & Unlock Contact'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {contactInfo && (
              <>
                <Button variant="outline" className="flex-1" asChild>
                  <a href={`tel:${contactInfo.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </a>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a href={`https://wa.me/${contactInfo.phone.replace(/\D/g, '')}`}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </>
            )}
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}