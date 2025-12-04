'use client'

import { useState, useEffect } from 'react'
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, Handshake, Star, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description?: string
  category: string
  location?: string
  startDate: string
  endDate: string
  organizerName?: string
  maxParticipants?: number
  currentParticipants: number
  fee?: number
  isPartnered: boolean
  campus: {
    id: string
    name: string
    city: string
    state: string
  }
}

export default function EventPartnershipsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [partnershipData, setPartnershipData] = useState({
    sponsorshipLevel: '',
    benefitsOffered: ''
  })
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const sponsorshipLevels = [
    { value: 'PLATINUM', label: 'Platinum Sponsor', fee: 5000, benefits: ['Prime logo placement', 'Stage presence', 'Booth space', 'Social media mentions'] },
    { value: 'GOLD', label: 'Gold Sponsor', fee: 3000, benefits: ['Logo placement', 'Booth space', 'Program mentions'] },
    { value: 'SILVER', label: 'Silver Sponsor', fee: 1500, benefits: ['Logo in program', 'Small booth space'] },
    { value: 'BRONZE', label: 'Bronze Sponsor', fee: 500, benefits: ['Name mention in program'] }
  ]

  const eventCategories = [
    { value: 'TECH_FEST', label: 'Tech Fest', icon: '💻' },
    { value: 'CULTURAL_FEST', label: 'Cultural Fest', icon: '🎵' },
    { value: 'SPORTS', label: 'Sports', icon: '⚽' },
    { value: 'WORKSHOP', label: 'Workshop', icon: '🔧' },
    { value: 'SEMINAR', label: 'Seminar', icon: '📚' },
    { value: 'OTHER', label: 'Other', icon: '📅' }
  ]

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events?seekingPartners=true')
      const data = await response.json()
      
      if (data.success) {
        setEvents(data.events)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePartnershipSubmit = async () => {
    if (!selectedEvent || !partnershipData.sponsorshipLevel) {
      setError('Please select an event and sponsorship level')
      return
    }

    setProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/events/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          userId: user?.id,
          sponsorshipLevel: partnershipData.sponsorshipLevel,
          benefitsOffered: partnershipData.benefitsOffered
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        // Refresh events list
        fetchEvents()
      } else {
        setError(data.message || 'Failed to create partnership')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    const cat = eventCategories.find(c => c.value === category)
    return cat ? cat.icon : '📅'
  }

  const getCategoryLabel = (category: string) => {
    const cat = eventCategories.find(c => c.value === category)
    return cat ? cat.label : category
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to partner with events</CardDescription>
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
              <Handshake className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Partnership Created!</CardTitle>
            <CardDescription>Your event partnership is now active</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                Thank you for partnering with {selectedEvent?.title}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">Back to Home</Button>
              </Link>
              <Link href="/events" className="flex-1">
                <Button className="w-full">View More Events</Button>
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

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <Badge className="bg-indigo-100 text-indigo-800">
              <Handshake className="w-4 h-4 mr-2" />
              EVENT PARTNERSHIPS
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Partner with
            <span className="text-indigo-600"> Campus Events</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Connect with your target audience through event sponsorships and partnerships
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Events List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Events Seeking Partners
                </CardTitle>
                <CardDescription>
                  Select an event to partner with
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading events...</p>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No events seeking partners</h3>
                    <p className="text-gray-600">Check back later for new partnership opportunities</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedEvent?.id === event.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getCategoryIcon(event.category)}</span>
                            <Badge variant="outline" className="text-xs">
                              {getCategoryLabel(event.category)}
                            </Badge>
                          </div>
                          {event.isPartnered && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              <Handshake className="w-3 h-3 mr-1" />
                              Partnered
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="font-semibold mb-2">{event.title}</h3>
                        
                        {event.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(event.startDate)}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          {event.maxParticipants && (
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{event.currentParticipants}/{event.maxParticipants}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-sm text-gray-600">
                            {event.campus.name}, {event.campus.city}
                          </div>
                          {event.fee && (
                            <div className="text-sm font-semibold text-green-600">
                              ₹{event.fee}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Partnership Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Handshake className="w-5 h-5" />
                  Become a Partner
                </CardTitle>
                <CardDescription>
                  Select your sponsorship level
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selectedEvent ? (
                  <div className="text-center py-8">
                    <Handshake className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Select an event to continue</p>
                  </div>
                ) : (
                  <>
                    {/* Selected Event Info */}
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm mb-1">{selectedEvent.title}</h4>
                      <p className="text-xs text-gray-600">
                        {formatDate(selectedEvent.startDate)} • {selectedEvent.campus.name}
                      </p>
                    </div>

                    {/* Sponsorship Levels */}
                    <div className="space-y-2">
                      <Label>Sponsorship Level *</Label>
                      <Select onValueChange={(value) => setPartnershipData(prev => ({ ...prev, sponsorshipLevel: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sponsorship level" />
                        </SelectTrigger>
                        <SelectContent>
                          {sponsorshipLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label} - ₹{level.fee.toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Benefits Preview */}
                    {partnershipData.sponsorshipLevel && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h5 className="font-semibold text-sm mb-2 flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          Benefits Include:
                        </h5>
                        <ul className="text-xs space-y-1">
                          {sponsorshipLevels.find(l => l.value === partnershipData.sponsorshipLevel)?.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span className="text-blue-600 mt-0.5">•</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Additional Benefits */}
                    <div className="space-y-2">
                      <Label htmlFor="benefits">Additional Benefits (Optional)</Label>
                      <Textarea
                        id="benefits"
                        placeholder="Describe any additional benefits you can offer..."
                        value={partnershipData.benefitsOffered}
                        onChange={(e) => setPartnershipData(prev => ({ ...prev, benefitsOffered: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    {/* Pricing Summary */}
                    {partnershipData.sponsorshipLevel && (
                      <div className="bg-indigo-50 p-3 rounded-lg">
                        <h5 className="font-semibold text-sm mb-2 flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          Investment Summary
                        </h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Sponsorship Level:</span>
                            <span className="font-semibold">
                              {sponsorshipLevels.find(l => l.value === partnershipData.sponsorshipLevel)?.label}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Partnership Fee:</span>
                            <span className="font-semibold text-indigo-600">
                              ₹{sponsorshipLevels.find(l => l.value === partnershipData.sponsorshipLevel)?.fee.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between pt-1 border-t font-semibold">
                            <span>Total Investment:</span>
                            <span className="text-indigo-600">
                              ₹{sponsorshipLevels.find(l => l.value === partnershipData.sponsorshipLevel)?.fee.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={handlePartnershipSubmit} 
                      disabled={processing || !partnershipData.sponsorshipLevel}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      {processing ? 'Processing...' : (
                        <>
                          <Handshake className="w-4 h-4 mr-2" />
                          Become a Partner
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}