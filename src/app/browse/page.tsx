'use client'

import { useState, useEffect } from 'react'
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MapPin, Clock, Star, MessageCircle, Phone, Eye, Rocket } from "lucide-react"
import Link from "next/link"
import SponsorListingModal from "@/components/SponsorListingModal"

interface Listing {
  id: string
  title: string
  description?: string
  price: number
  category: string
  condition?: string
  location?: string
  isAvailable: boolean
  isFeatured: boolean
  views: number
  contactUnlocked: boolean
  createdAt: string
  user: {
    id: string
    name: string
    isVerified: boolean
    isPremium: boolean
  }
}

export default function BrowsePage() {
  const { user } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'NOTES', label: 'Notes' },
    { value: 'BOOKS', label: 'Books' },
    { value: 'BIKES', label: 'Bikes' },
    { value: 'FOOD_TOKENS', label: 'Food Tokens' },
    { value: 'ROOM_RENTALS', label: 'Room Rentals' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Viewed' }
  ]

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const response = await fetch('/api/listings')
      const data = await response.json()
      
      if (data.success) {
        setListings(data.listings)
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredListings = listings
    .filter(listing => {
      const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           listing.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price - b.price
        case 'price_high':
          return b.price - a.price
        case 'popular':
          return b.views - a.views
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'NOTES': '📝',
      'BOOKS': '📚',
      'BIKES': '🚲',
      'FOOD_TOKENS': '🍽️',
      'ROOM_RENTALS': '🏠'
    }
    return icons[category] || '📦'
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'NOTES': 'bg-blue-100 text-blue-700',
      'BOOKS': 'bg-green-100 text-green-700',
      'BIKES': 'bg-purple-100 text-purple-700',
      'FOOD_TOKENS': 'bg-orange-100 text-orange-700',
      'ROOM_RENTALS': 'bg-pink-100 text-pink-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">CE</span>
                </div>
                <span className="font-semibold">Campus Exchange</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/create-listing">
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
                  Create Listing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Browse Listings</h1>
          <p className="text-gray-600">
            {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'} found
          </p>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className={`hover:shadow-lg transition-shadow border-2 ${listing.isFeatured ? 'border-purple-300 bg-purple-50' : 'hover:border-blue-200'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={`${getCategoryColor(listing.category)} border-0`}>
                      <span className="mr-1">{getCategoryIcon(listing.category)}</span>
                      {listing.category.replace('_', ' ')}
                    </Badge>
                    {listing.isFeatured && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <Rocket className="w-3 h-3 mr-1" />
                        Sponsored
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {listing.user.isVerified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    {listing.user.isPremium && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">Premium</Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">{listing.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {listing.description || 'No description provided'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-green-600">₹{listing.price}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(listing.createdAt)}</span>
                  </div>
                </div>

                {listing.location && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span>{listing.location}</span>
                  </div>
                )}

                {listing.condition && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Condition:</span>
                    <Badge variant="outline" className="text-xs">
                      {listing.condition.replace('_', ' ')}
                    </Badge>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-600">
                        {listing.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">{listing.user.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Eye className="w-3 h-3" />
                    <span>{listing.views}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Phone className="w-4 h-4 mr-1" />
                    Contact
                  </Button>
                  {user && user.id === listing.user.id && !listing.isFeatured && (
                    <SponsorListingModal listing={listing}>
                      <Button size="sm" variant="outline" className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300">
                        <Rocket className="w-4 h-4 mr-1" />
                        Boost
                      </Button>
                    </SponsorListingModal>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No listings found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a listing!'
              }
            </p>
            {(!searchTerm && selectedCategory === 'all') && (
              <Link href="/create-listing">
                <Button>Create First Listing</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}