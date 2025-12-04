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
import { Rocket, Star, IndianRupee, Crown, TrendingUp } from "lucide-react"

interface SponsorListingModalProps {
  listing: {
    id: string
    title: string
    price: number
    isFeatured: boolean
    user: {
      id: string
      isPremium: boolean
    }
  }
  children: React.ReactNode
}

export default function SponsorListingModal({ listing, children }: SponsorListingModalProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSponsorListing = async () => {
    if (!user) {
      setError('Please log in to sponsor a listing')
      return
    }

    if (user.id !== listing.user.id) {
      setError('You can only sponsor your own listings')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/listings/sponsor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          userId: user.id
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setError(data.message || 'Failed to sponsor listing')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isOwnListing = user && user.id === listing.user.id
  const boostFee = user?.isPremium ? 15 : 25

  if (listing.isFeatured) {
    return (
      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <Rocket className="w-3 h-3 mr-1" />
        Sponsored
      </Badge>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-purple-600" />
            Boost Your Listing
          </DialogTitle>
          <DialogDescription>
            Get more visibility and sell faster with sponsored placement
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Listing Info */}
          <Card className="border-2 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{listing.title}</CardTitle>
              <CardDescription>
                Listed at ₹{listing.price.toLocaleString()}
              </CardDescription>
            </CardHeader>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                <strong>Success!</strong> Your listing has been sponsored and will get premium placement.
              </AlertDescription>
            </Alert>
          )}

          {/* Benefits */}
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Sponsorship Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Featured placement at top of search results</li>
                <li>• Prominent "Sponsored" badge</li>
                <li>• 3x more visibility than regular listings</li>
                <li>• Higher priority in category browsing</li>
                <li>• 30-day sponsorship period</li>
              </ul>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-600 flex items-center gap-2">
                <IndianRupee className="w-5 h-5" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user?.isPremium && (
                <Alert>
                  <AlertDescription className="text-yellow-800">
                    <Crown className="w-4 h-4 inline mr-1" />
                    <strong>Premium Discount:</strong> You save 40% on boost fees!
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span>One-time Boost Fee:</span>
                  <span className="font-semibold text-purple-600">
                    ₹{boostFee}.00
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Valid for 30 days from activation
                </div>
              </div>

              {user?.isPremium && (
                <div className="bg-green-50 p-2 rounded text-xs text-green-700">
                  You're saving ₹10 with your premium membership!
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Button */}
          {!success && (
            <Button 
              onClick={handleSponsorListing} 
              disabled={loading || !isOwnListing}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'Processing...' : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Boost Listing - ₹{boostFee}
                </>
              )}
            </Button>
          )}

          {!isOwnListing && !success && (
            <p className="text-sm text-gray-500 text-center">
              You can only sponsor your own listings
            </p>
          )}

          {/* Close Button */}
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="w-full"
          >
            {success ? 'Done' : 'Cancel'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}