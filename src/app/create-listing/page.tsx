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
import { ArrowLeft, Upload, DollarSign, FileText, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CreateListingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: ''
  })

  const categories = [
    // Notes Marketplace
    { value: 'NOTES_HANDWRITTEN', label: 'Handwritten Notes', icon: '📝', group: 'Notes Marketplace' },
    { value: 'NOTES_PDF', label: 'PDF Notes', icon: '📄', group: 'Notes Marketplace' },
    { value: 'NOTES_TOPPERS', label: 'Semester Toppers\' Notes', icon: '🏆', group: 'Notes Marketplace' },
    { value: 'NOTES_LAB', label: 'Lab Experiment Observations', icon: '🧪', group: 'Notes Marketplace' },
    { value: 'NOTES_ASSIGNMENTS', label: 'Assignment Templates', icon: '📋', group: 'Notes Marketplace' },
    { value: 'NOTES_QUESTIONS', label: 'Previous Year Question Banks', icon: '📚', group: 'Notes Marketplace' },
    { value: 'NOTES_MINDMAPS', label: 'Mind Maps & Cheat Sheets', icon: '🧠', group: 'Notes Marketplace' },
    { value: 'NOTES_VIVA', label: 'Practical Viva Prep Guides', icon: '🎓', group: 'Notes Marketplace' },

    // Used Books
    { value: 'BOOKS_TEXTBOOKS', label: 'Textbooks', icon: '📖', group: 'Used Books' },
    { value: 'BOOKS_COMPETITIVE', label: 'Competitive Exam Books', icon: '🎯', group: 'Used Books' },
    { value: 'BOOKS_LAB', label: 'Lab Manuals', icon: '🔧', group: 'Used Books' },
    { value: 'BOOKS_INTERNATIONAL', label: 'International Edition Books', icon: '🌍', group: 'Used Books' },
    { value: 'BOOKS_LANGUAGE', label: 'Language Learning Books', icon: '🗣️', group: 'Used Books' },
    { value: 'BOOKS_RARE', label: 'Rare/Out-of-Print Academic Books', icon: '⭐', group: 'Used Books' },

    // Cycles / Bikes / Scooters
    { value: 'BIKES_BICYCLES', label: 'Normal Bicycles', icon: '🚲', group: 'Cycles / Bikes / Scooters' },
    { value: 'BIKES_GEAR', label: 'Gear Cycles', icon: '⚙️', group: 'Cycles / Bikes / Scooters' },
    { value: 'BIKES_ELECTRIC', label: 'Electric Cycles', icon: '⚡', group: 'Cycles / Bikes / Scooters' },
    { value: 'BIKES_SCOOTERS', label: 'Scooters & Two-wheelers', icon: '🏍️', group: 'Cycles / Bikes / Scooters' },
    { value: 'BIKES_REPAIR', label: 'Repair Services Listing', icon: '🔧', group: 'Cycles / Bikes / Scooters' },
    { value: 'BIKES_ACCESSORIES', label: 'Cycle Accessory Marketplace', icon: '📦', group: 'Cycles / Bikes / Scooters' },

    // Mess / Canteen Food Tokens
    { value: 'FOOD_DAILY', label: 'Daily Mess Tokens', icon: '🍽️', group: 'Mess / Canteen Food Tokens' },
    { value: 'FOOD_EXTRA', label: 'Extra Meal Tokens', icon: '➕', group: 'Mess / Canteen Food Tokens' },
    { value: 'FOOD_SWAPS', label: 'Breakfast/Lunch/Dinner Swaps', icon: '🔄', group: 'Mess / Canteen Food Tokens' },
    { value: 'FOOD_COUPONS', label: 'Canteen Coupon Exchange', icon: '🎫', group: 'Mess / Canteen Food Tokens' },
    { value: 'FOOD_EVENTS', label: 'Special Event Food Tickets', icon: '📅', group: 'Mess / Canteen Food Tokens' },

    // Room Rentals + Shared Spaces
    { value: 'ROOMS_PG', label: 'PG Rooms', icon: '🏠', group: 'Room Rentals + Shared Spaces' },
    { value: 'ROOMS_FLATS', label: 'Flats/Apartments', icon: '🏢', group: 'Room Rentals + Shared Spaces' },
    { value: 'ROOMS_TEMPORARY', label: 'Temporary Stay (1-7 days)', icon: '🕒', group: 'Room Rentals + Shared Spaces' },
    { value: 'ROOMS_HOSTEL', label: 'Hostel Room Swaps', icon: '🔄', group: 'Room Rentals + Shared Spaces' },
    { value: 'ROOMS_ROOMMATE', label: 'Roommate Finder', icon: '👥', group: 'Room Rentals + Shared Spaces' },
    { value: 'ROOMS_GUEST', label: 'Guest Stay for Parents', icon: '👨‍👩‍👧‍👦', group: 'Room Rentals + Shared Spaces' },
    { value: 'ROOMS_FEST', label: 'College Fest Accommodation', icon: '🎪', group: 'Room Rentals + Shared Spaces' },

    // Academic Tools
    { value: 'TOOLS_DRAWING', label: 'Engineering Drawing Kits', icon: '📐', group: 'Academic Tools' },
    { value: 'TOOLS_LAB', label: 'Lab Toolkits', icon: '🔧', group: 'Academic Tools' },
    { value: 'TOOLS_SPORTS', label: 'Sports Kits', icon: '⚽', group: 'Academic Tools' },
    { value: 'TOOLS_CALCULATOR', label: 'Calculator Rental', icon: '🔢', group: 'Academic Tools' },
    { value: 'TOOLS_CAMERA', label: 'DSLR Cameras for Project Shoots', icon: '📷', group: 'Academic Tools' },

    // Services Marketplace
    { value: 'SERVICES_ASSIGNMENTS', label: 'Assignments Typing', icon: '⌨️', group: 'Services Marketplace' },
    { value: 'SERVICES_TUTORING', label: 'Tutoring', icon: '🎓', group: 'Services Marketplace' },
    { value: 'SERVICES_DESIGN', label: 'Graphic Design', icon: '🎨', group: 'Services Marketplace' },
    { value: 'SERVICES_VIDEO', label: 'Video Editing', icon: '🎬', group: 'Services Marketplace' },
    { value: 'SERVICES_RESUME', label: 'Resume Building', icon: '📄', group: 'Services Marketplace' },
    { value: 'SERVICES_PHOTOGRAPHY', label: 'Event Photography', icon: '📷', group: 'Services Marketplace' },
    { value: 'SERVICES_SUMMARIZATION', label: 'Notes Summarization', icon: '📝', group: 'Services Marketplace' },
    { value: 'SERVICES_CODING', label: 'Coding/Debugging Help', icon: '💻', group: 'Services Marketplace' },

    // Event Tickets
    { value: 'EVENTS_TECH', label: 'Tech Fest Passes', icon: '💻', group: 'Event Tickets' },
    { value: 'EVENTS_CULTURAL', label: 'Cultural Fest Passes', icon: '🎵', group: 'Event Tickets' },
    { value: 'EVENTS_SPONSORED', label: 'Sponsored Events', icon: '⭐', group: 'Event Tickets' },
    { value: 'EVENTS_PARTY', label: 'After-party Tickets', icon: '🎉', group: 'Event Tickets' },
    { value: 'EVENTS_WORKSHOP', label: 'Workshop/Certificate Events', icon: '📜', group: 'Event Tickets' },

    // Project Materials
    { value: 'PROJECTS_ELECTRONICS', label: 'Electronic Components', icon: '🔌', group: 'Project Materials' },
    { value: 'PROJECTS_ARDUINO', label: 'Arduino/ESP Boards', icon: '🔬', group: 'Project Materials' },
    { value: 'PROJECTS_3DPRINT', label: '3D Printer Time Sharing', icon: '📦', group: 'Project Materials' },
    { value: 'PROJECTS_ROBOTICS', label: 'Robotics Parts', icon: '🤖', group: 'Project Materials' },
    { value: 'PROJECTS_DATASETS', label: 'Data Sets', icon: '💾', group: 'Project Materials' },
    { value: 'PROJECTS_CODE', label: 'Code Snippets', icon: '💻', group: 'Project Materials' },

    // Internship & Campus Gigs
    { value: 'GIGS_PARTTIME', label: 'Part-time Gigs', icon: '💼', group: 'Internship & Campus Gigs' },
    { value: 'GIGS_INTERNSHIPS', label: 'Internships', icon: '👤', group: 'Internship & Campus Gigs' },
    { value: 'GIGS_CAMPUS', label: 'Paid Campus Work', icon: '🏢', group: 'Internship & Campus Gigs' },
    { value: 'GIGS_MICRO', label: 'Micro Tasks for Seniors', icon: '✅', group: 'Internship & Campus Gigs' },

    // Campus Club Marketplace
    { value: 'CLUBS_MERCH', label: 'Club Merchandise', icon: '👕', group: 'Campus Club Marketplace' },
    { value: 'CLUBS_KITS', label: 'Event Kits', icon: '📦', group: 'Campus Club Marketplace' },
    { value: 'CLUBS_REGISTRATION', label: 'Registration Fees', icon: '💳', group: 'Campus Club Marketplace' },
    { value: 'CLUBS_WORKSHOP', label: 'Workshop Materials', icon: '🔧', group: 'Campus Club Marketplace' },

    // Science / Lab Material Exchange
    { value: 'LAB_COATS', label: 'Lab Coats', icon: '👤', group: 'Science / Lab Material Exchange' },
    { value: 'LAB_GOGGLES', label: 'Goggles', icon: '👓', group: 'Science / Lab Material Exchange' },
    { value: 'LAB_GLOVES', label: 'Gloves', icon: '🧤', group: 'Science / Lab Material Exchange' },
    { value: 'LAB_EXPERIMENTS', label: 'Experiment Kits', icon: '🧪', group: 'Science / Lab Material Exchange' },

    // Creative Exchange
    { value: 'CREATIVE_CRAFTS', label: 'Handmade Crafts', icon: '🎨', group: 'Creative Exchange' },
    { value: 'CREATIVE_ART', label: 'Art Supplies', icon: '🎨', group: 'Creative Exchange' },
    { value: 'CREATIVE_PAINTINGS', label: 'Paintings', icon: '🖼️', group: 'Creative Exchange' },
    { value: 'CREATIVE_DIY', label: 'DIY Kits', icon: '📦', group: 'Creative Exchange' },

    // Career & Skills
    { value: 'CAREER_BOOKS', label: 'Used Interview Preparation Books', icon: '📚', group: 'Career & Skills' },
    { value: 'CAREER_INTERVIEW', label: 'Mock Interview Services', icon: '👤', group: 'Career & Skills' },
    { value: 'CAREER_RESUME', label: 'Resume Templates', icon: '📄', group: 'Career & Skills' },
    { value: 'CAREER_SKILLS', label: 'Skill Course Subscriptions Resell', icon: '🎓', group: 'Career & Skills' },

    // Document & Admin Support
    { value: 'DOCS_PRINTOUTS', label: 'Printouts', icon: '🖨️', group: 'Document & Admin Support' },
    { value: 'DOCS_XEROX', label: 'Xerox', icon: '📄', group: 'Document & Admin Support' },
    { value: 'DOCS_LAMINATION', label: 'Lamination', icon: '📋', group: 'Document & Admin Support' },
    { value: 'DOCS_ID', label: 'ID Card Holders', icon: '🆔', group: 'Document & Admin Support' },
    { value: 'DOCS_STATIONERY', label: 'Stationery Bundles', icon: '📦', group: 'Document & Admin Support' },

    // Music & Performance
    { value: 'MUSIC_GUITARS', label: 'Guitars', icon: '🎸', group: 'Music & Performance' },
    { value: 'MUSIC_KEYBOARDS', label: 'Keyboards', icon: '🎹', group: 'Music & Performance' },
    { value: 'MUSIC_MICROPHONES', label: 'Microphones', icon: '🎤', group: 'Music & Performance' },
    { value: 'MUSIC_DJ', label: 'DJ Equipment Rentals', icon: '🎧', group: 'Music & Performance' },

    // Student Startups Section
    { value: 'STARTUPS_PRODUCTS', label: 'Sell Products Made by Students', icon: '🛍️', group: 'Student Startups Section' },
    { value: 'STARTUPS_PROMOTE', label: 'Promote Campus Entrepreneurs', icon: '📢', group: 'Student Startups Section' },
    { value: 'STARTUPS_D2C', label: 'Small D2C Brands', icon: '🏪', group: 'Student Startups Section' }
  ]

  const conditions = [
    { value: 'NEW', label: 'New' },
    { value: 'LIKE_NEW', label: 'Like New' },
    { value: 'GOOD', label: 'Good' },
    { value: 'FAIR', label: 'Fair' },
    { value: 'POOR', label: 'Poor' }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmitDetails = async () => {
    if (!formData.title.trim()) {
      setError('Please enter a title')
      return
    }
    if (!formData.category) {
      setError('Please select a category')
      return
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price')
      return
    }

    setError('')
    setStep('payment')
  }

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create listing
      const response = await fetch('/api/listings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          userId: user?.id
        })
      })

      const data = await response.json()

      if (data.success) {
        setStep('success')
      } else {
        setError(data.message || 'Failed to create listing')
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
            <CardDescription>Please log in to create a listing</CardDescription>
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

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Listing Created!</CardTitle>
            <CardDescription>Your listing is now live on the marketplace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>₹10</strong> listing fee has been charged successfully
              </p>
            </div>
            {/* Show commission information for high-value items */}
            {parseFloat(formData.price) > 5000 && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>Note:</strong> A {(parseFloat(formData.price) > 50000 ? '5%' : 
                    parseFloat(formData.price) > 20000 ? '4%' : 
                    parseFloat(formData.price) > 10000 ? '3%' : '2%')} commission 
                  (₹{((parseFloat(formData.price) * 
                    (parseFloat(formData.price) > 50000 ? 5 : 
                     parseFloat(formData.price) > 20000 ? 4 : 
                     parseFloat(formData.price) > 10000 ? 3 : 2)) / 100).toFixed(2)}) 
                  will be charged when your item sells
                </p>
              </div>
            )}
            {/* Show service fee information for service marketplace listings */}
            {formData.category.startsWith('SERVICES_') && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> A ₹15.00 service marketplace fee has been charged for your service listing
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">Back to Home</Button>
              </Link>
              <Link href="/browse" className="flex-1">
                <Button className="w-full">Browse Listings</Button>
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
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Create Listing</span>
            <span className="text-sm text-gray-500">Step {step === 'details' ? '1' : '2'} of 2</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: step === 'details' ? '50%' : '100%' }}
            ></div>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {step === 'details' ? 'Listing Details' : 'Payment'}
            </CardTitle>
            <CardDescription>
              {step === 'details' 
                ? 'Tell us about what you\'re selling' 
                : 'Pay ₹10 to publish your listing'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === 'details' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Engineering Mathematics Notes"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your item in detail..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(
                          categories.reduce((groups, category) => {
                            if (!groups[category.group]) {
                              groups[category.group] = []
                            }
                            groups[category.group].push(category)
                            return groups
                          }, {} as Record<string, typeof categories>)
                        ).map(([group, groupCategories]) => (
                          <div key={group}>
                            <div className="px-2 py-1 text-sm font-semibold text-gray-700 bg-gray-100">
                              {group}
                            </div>
                            {groupCategories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                <span className="mr-2">{category.icon}</span>
                                {category.label}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((condition) => (
                          <SelectItem key={condition.value} value={condition.value}>
                            {condition.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Hostel Block A"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload Images (Optional)</p>
                  <Button variant="outline" size="sm">
                    Choose Files
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 10MB each</p>
                </div>

                <Button onClick={handleSubmitDetails} className="w-full">
                  Continue to Payment
                </Button>
              </div>
            )}

            {step === 'payment' && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Listing Fee:</span>
                      <span>₹10.00</span>
                    </div>
                    {/* Show commission for high-value items */}
                    {parseFloat(formData.price) > 5000 && (
                      <>
                        <div className="flex justify-between text-orange-600">
                          <span>High-Value Commission:</span>
                          <span>
                            {parseFloat(formData.price) > 50000 ? '5%' : 
                             parseFloat(formData.price) > 20000 ? '4%' : 
                             parseFloat(formData.price) > 10000 ? '3%' : '2%'}
                          </span>
                        </div>
                        <div className="flex justify-between text-orange-600">
                          <span>Commission Amount:</span>
                          <span>₹{((parseFloat(formData.price) * 
                            (parseFloat(formData.price) > 50000 ? 5 : 
                             parseFloat(formData.price) > 20000 ? 4 : 
                             parseFloat(formData.price) > 10000 ? 3 : 2)) / 100).toFixed(2)}</span>
                        </div>
                        <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                          <strong>Note:</strong> Commission will be charged when your item is sold
                        </div>
                      </>
                    )}
                    {/* Show service fee for service marketplace listings */}
                    {formData.category.startsWith('SERVICES_') && (
                      <>
                        <div className="flex justify-between text-blue-600">
                          <span>Service Marketplace Fee:</span>
                          <span>₹15.00</span>
                        </div>
                        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                          <strong>Note:</strong> Additional fee for service-based listings
                        </div>
                      </>
                    )}
                    <div className="flex justify-between pt-2 border-t">
                      <span>Total Due Now:</span>
                      <span className="font-semibold">
                        ₹{parseFloat(formData.price) > 5000 || formData.category.startsWith('SERVICES_') ? 
                          (10 + (formData.category.startsWith('SERVICES_') ? 15 : 0)).toFixed(2) : 
                          '10.00'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="border-2 border-blue-200 bg-blue-50 p-4 rounded-lg cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">UPI</span>
                          </div>
                          <div>
                            <p className="font-medium">UPI Payment</p>
                            <p className="text-sm text-gray-600">Pay using any UPI app</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Badge className="bg-yellow-100 text-yellow-800">Premium User</Badge>
                      <div className="flex-1">
                        <p className="text-sm text-yellow-800">
                          <strong>Good news!</strong> As a premium user, you get unlimited free listings. 
                          This ₹10 fee is waived for you.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handlePayment} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Processing...' : (
                      <>
                        <DollarSign className="w-4 h-4 mr-2" />
                        Pay ₹10 & Publish Listing
                      </>
                    )}
                  </Button>

                  <Button 
                    variant="outline" 
                    onClick={() => setStep('details')}
                    className="w-full"
                  >
                    Back to Details
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}