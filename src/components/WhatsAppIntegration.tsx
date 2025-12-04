'use client'

import { useState } from 'react'
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  MessageCircle, 
  Phone, 
  Share2, 
  Copy, 
  CheckCircle,
  AlertCircle,
  ExternalLink
} from "lucide-react"

interface WhatsAppIntegrationProps {
  sellerPhone: string
  sellerName: string
  listingTitle: string
  listingPrice: number
  listingId: string
  onContactUnlocked?: () => void
}

export default function WhatsAppIntegration({
  sellerPhone,
  sellerName,
  listingTitle,
  listingPrice,
  listingId,
  onContactUnlocked
}: WhatsAppIntegrationProps) {
  const { user } = useAuth()
  const [contactUnlocked, setContactUnlocked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const unlockContact = async () => {
    if (!user) {
      setError('Please log in to unlock contact information')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Simulate payment processing for WhatsApp lead (₹2)
      await new Promise(resolve => setTimeout(resolve, 1500))

      // In a real implementation, you would process the ₹2 payment here
      // For demo, we'll just unlock the contact
      
      setContactUnlocked(true)
      onContactUnlocked?.()
      
      // Show success message
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      setError('Failed to unlock contact. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generateWhatsAppMessage = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const listingUrl = `${baseUrl}/browse#${listingId}`
    
    return `Hi ${sellerName}! I'm interested in your listing "${listingTitle}" (₹${listingPrice}) on Campus Exchange. ${listingUrl}`
  }

  const openWhatsApp = () => {
    const message = encodeURIComponent(generateWhatsAppMessage())
    const phone = sellerPhone.replace(/\D/g, '') // Remove non-digits
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  const copyContactInfo = async () => {
    const contactInfo = `Name: ${sellerName}\nPhone: ${sellerPhone}\nListing: ${listingTitle}\nPrice: ₹${listingPrice}`
    
    try {
      await navigator.clipboard.writeText(contactInfo)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      setError('Failed to copy contact information')
    }
  }

  const shareListing = async () => {
    const listingUrl = typeof window !== 'undefined' ? window.location.origin + `/browse#${listingId}` : ''
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: listingTitle,
          text: `Check out this listing on Campus Exchange: ${listingTitle} for ₹${listingPrice}`,
          url: listingUrl
        })
      } catch (error) {
        // Fallback to copying URL
        copyToClipboard(listingUrl)
      }
    } else {
      copyToClipboard(listingUrl)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      setError('Failed to copy to clipboard')
    }
  }

  if (contactUnlocked) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <CardTitle className="text-green-800">Contact Unlocked!</CardTitle>
          </div>
          <CardDescription className="text-green-700">
            You can now contact the seller directly
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <p className="font-medium">{sellerName}</p>
              </div>
              <div>
                <span className="text-gray-600">Phone:</span>
                <p className="font-medium">{sellerPhone}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={openWhatsApp}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat on WhatsApp
            </Button>
            <Button 
              variant="outline"
              onClick={copyContactInfo}
              className="flex-1"
            >
              {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy Info'}
            </Button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-green-200">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                <ExternalLink className="w-3 h-3 mr-1" />
                Direct Contact
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={shareListing}>
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Contact Seller
        </CardTitle>
        <CardDescription>
          Get in touch with {sellerName} about this listing
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">₹2</span>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Unlock Contact Information</h4>
              <p className="text-sm text-blue-700">
                Pay ₹2 to instantly view the seller's contact details and start chatting on WhatsApp.
                This helps prevent spam and ensures serious buyers only.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={unlockContact}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <>
                <span className="mr-2">🔓</span>
                Unlock Contact - ₹2
              </>
            )}
          </Button>

          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={shareListing}>
              <Share2 className="w-4 h-4 mr-1" />
              Share Listing
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>✓ Secure payment processing</p>
          <p>✓ Verified sellers only</p>
          <p>✓ Instant contact unlock</p>
        </div>
      </CardContent>
    </Card>
  )
}