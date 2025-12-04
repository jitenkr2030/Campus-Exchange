'use client'

import { useState } from 'react'
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, DollarSign, Building2, Calendar, MapPin, IndianRupee, Star } from "lucide-react"
import Link from "next/link"

export default function BusinessAdsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    targetUrl: '',
    category: '',
    location: '',
    endDate: ''
  })

  const categories = [
    { value: 'RESTAURANT', label: 'Restaurant & Food' },
    { value: 'RETAIL', label: 'Retail Shopping' },
    { value: 'SERVICES', label: 'Professional Services' },
    { value: 'EDUCATION', label: 'Education & Training' },
    { value: 'HEALTHCARE', label: 'Healthcare & Wellness' },
    { value: 'TECHNOLOGY', label: 'Technology & Electronics' },
    { value: 'ENTERTAINMENT', label: 'Entertainment & Recreation' },
    { value: 'OTHER', label: 'Other' }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('Please enter an ad title')
      return
    }
    if (!formData.category) {
      setError('Please select a category')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/business-ads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user?.id,
          campusId: user?.campusId
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.message || 'Failed to create business ad')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to create business ads</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Business Ad Created!</CardTitle>
            <CardDescription>Your business ad is now live on the marketplace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>₹199</strong> monthly fee has been charged successfully
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">Back to Home</Button>
              </Link>
              <Link href="/business-ads" className="flex-1">
                <Button className="w-full">Manage Ads</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <Badge className="bg-purple-100 text-purple-800">
              <Building2 className="w-4 h-4 mr-2" />
              BUSINESS ADVERTISING
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Promote Your Business
            <span className="text-purple-600"> on Campus</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Reach thousands of students and campus members with targeted advertising
          </p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-2xl font-bold text-purple-600">₹199</div>
            <div className="text-gray-500">per month</div>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Create Business Ad
            </CardTitle>
            <CardDescription>
              Advertise your business to the campus community
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Ad Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Special Student Discount at Pizza Palace"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your offer, business, or promotion..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Business Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Near Campus Gate, Shop No. 5, Main Street"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                  <Input
                    id="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetUrl">Website URL (Optional)</Label>
                  <Input
                    id="targetUrl"
                    placeholder="https://yourbusiness.com"
                    value={formData.targetUrl}
                    onChange={(e) => handleInputChange('targetUrl', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Campaign End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Leave empty for 1-month campaign from start date
                </p>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <IndianRupee className="w-4 h-4" />
                Pricing Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monthly Advertising Fee:</span>
                  <span className="font-semibold">₹199.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>1 month</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-purple-600">₹199.00</span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                What You Get
              </h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Featured placement on campus marketplace</li>
                <li>• Targeted reach to students and campus community</li>
                <li>• Performance tracking (impressions & clicks)</li>
                <li>• Monthly renewal option</li>
                <li>• Dedicated customer support</li>
              </ul>
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              {loading ? 'Processing...' : (
                <>
                  <Building2 className="w-4 h-4 mr-2" />
                  Create Business Ad - ₹199
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}