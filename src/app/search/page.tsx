'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Star, 
  MessageCircle, 
  Phone, 
  Eye, 
  ArrowLeft,
  X,
  SlidersHorizontal,
  Grid,
  List
} from "lucide-react"
import Link from "next/link"

interface Listing {
  id: string
  title: string
  description?: string
  price: number
  category: string
  condition?: string
  location?: string
  isAvailable: boolean
  views: number
  contactUnlocked: boolean
  createdAt: string
  user: {
    id: string
    name: string
    isVerified: boolean
    isPremium: boolean
  }
  categoryData?: {
    name: string
    icon: string
    color: string
  }
}

interface SearchFacets {
  categories: Array<{ value: string; label: string; count: number }>
  conditions: Array<{ value: string; label: string; count: number }>
  priceRange: { min: number; max: number; average: number }
  locations: Array<{ value: string; label: string; count: number }>
}

interface SearchQuery {
  q: string
  category?: string
  minPrice?: string
  maxPrice?: string
  condition?: string
  location?: string
  sortBy: string
}

export default function SearchPage() {
  const { user } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [facets, setFacets] = useState<SearchFacets>({
    categories: [],
    conditions: [],
    priceRange: { min: 0, max: 0, average: 0 },
    locations: []
  })
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<SearchQuery>({
    q: '',
    sortBy: 'relevance'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false
  })

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'NOTES', label: 'Notes' },
    { value: 'BOOKS', label: 'Books' },
    { value: 'BIKES', label: 'Bikes' },
    { value: 'FOOD_TOKENS', label: 'Food Tokens' },
    { value: 'ROOM_RENTALS', label: 'Room Rentals' }
  ]

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Viewed' }
  ]

  const conditions = [
    { value: 'all', label: 'Any Condition' },
    { value: 'NEW', label: 'New' },
    { value: 'LIKE_NEW', label: 'Like New' },
    { value: 'GOOD', label: 'Good' },
    { value: 'FAIR', label: 'Fair' },
    { value: 'POOR', label: 'Poor' }
  ]

  // Simple debounce implementation
  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: SearchQuery) => {
      performSearch(query)
    }, 300),
    []
  )

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const initialQuery = urlParams.get('q') || ''
    setSearchQuery(initialQuery)
    setFilters(prev => ({ ...prev, q: initialQuery }))
    
    if (initialQuery) {
      performSearch({ ...filters, q: initialQuery })
    }
  }, [])

  useEffect(() => {
    if (filters.q) {
      debouncedSearch(filters)
    }
  }, [filters, debouncedSearch])

  const performSearch = async (query: SearchQuery) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(query).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, value.toString())
        }
      })
      params.append('limit', pagination.limit.toString())
      params.append('offset', pagination.offset.toString())

      const response = await fetch(`/api/search?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        setListings(data.listings)
        setFacets(data.facets)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const newFilters = { ...filters, q: searchQuery, offset: 0 }
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, offset: 0 }))
    
    // Update URL
    const url = new URL(window.location.href)
    if (searchQuery) {
      url.searchParams.set('q', searchQuery)
    } else {
      url.searchParams.delete('q')
    }
    window.history.pushState({}, '', url.toString())
  }

  const updateFilter = (key: keyof SearchQuery, value: string) => {
    const newFilters = { ...filters, [key]: value, offset: 0 }
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, offset: 0 }))
  }

  const clearFilters = () => {
    const newFilters = { q: searchQuery, sortBy: 'relevance' }
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, offset: 0 }))
  }

  const loadMore = () => {
    const newOffset = pagination.offset + pagination.limit
    setPagination(prev => ({ ...prev, offset: newOffset }))
    
    const newFilters = { ...filters, offset: newOffset }
    performSearch(newFilters)
  }

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

  const hasActiveFilters = () => {
    return filters.category && filters.category !== 'all' ||
           filters.minPrice ||
           filters.maxPrice ||
           filters.condition && filters.condition !== 'all' ||
           filters.location
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
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

      {/* Search Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for notes, books, bikes, rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-lg py-3"
              />
            </div>
            <Button type="submit" className="px-8">
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <div className="flex items-center gap-2">
                  {hasActiveFilters() && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Accordion type="multiple" defaultValue={['category', 'price', 'condition']} className="w-full">
                <AccordionItem value="category">
                  <AccordionTrigger className="text-sm">Category</AccordionTrigger>
                  <AccordionContent>
                    <Select value={filters.category || 'all'} onValueChange={(value) => updateFilter('category', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center justify-between w-full">
                              <span>{category.label}</span>
                              {category.value !== 'all' && (
                                <span className="text-xs text-gray-500 ml-2">
                                  ({facets.categories.find(c => c.value === category.value)?.count || 0})
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="price">
                  <AccordionTrigger className="text-sm">Price Range</AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-600">Min Price</label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={filters.minPrice || ''}
                          onChange={(e) => updateFilter('minPrice', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Max Price</label>
                        <Input
                          type="number"
                          placeholder={facets.priceRange.max.toString()}
                          value={filters.maxPrice || ''}
                          onChange={(e) => updateFilter('maxPrice', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Average: ₹{facets.priceRange.average}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="condition">
                  <AccordionTrigger className="text-sm">Condition</AccordionTrigger>
                  <AccordionContent>
                    <Select value={filters.condition || 'all'} onValueChange={(value) => updateFilter('condition', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((condition) => (
                          <SelectItem key={condition.value} value={condition.value}>
                            <div className="flex items-center justify-between w-full">
                              <span>{condition.label}</span>
                              {condition.value !== 'all' && (
                                <span className="text-xs text-gray-500 ml-2">
                                  ({facets.conditions.find(c => c.value === condition.value)?.count || 0})
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="location">
                  <AccordionTrigger className="text-sm">Location</AccordionTrigger>
                  <AccordionContent>
                    <Input
                      placeholder="Enter location..."
                      value={filters.location || ''}
                      onChange={(e) => updateFilter('location', e.target.value)}
                    />
                    <div className="mt-2 space-y-1">
                      {facets.locations.slice(0, 5).map((location) => (
                        <div key={location.value} className="flex items-center gap-2">
                          <Checkbox
                            id={`location-${location.value}`}
                            checked={filters.location === location.value}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFilter('location', location.value)
                              } else {
                                updateFilter('location', '')
                              }
                            }}
                          />
                          <label htmlFor={`location-${location.value}`} className="text-sm cursor-pointer flex-1">
                            {location.label}
                          </label>
                          <span className="text-xs text-gray-500">({location.count})</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  {filters.q ? `Search results for "${filters.q}"` : 'All Listings'}
                </h1>
                <p className="text-gray-600">
                  {pagination.total} {pagination.total === 1 ? 'result' : 'results'} found
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-r-none ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-l-none ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                  <SelectTrigger className="w-40">
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

            {/* Loading State */}
            {loading && listings.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Searching...</p>
                </div>
              </div>
            )}

            {/* Results Grid/List */}
            {!loading && listings.length > 0 && (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                      <Card key={listing.id} className="hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <Badge className={`${getCategoryColor(listing.category)} border-0`}>
                              <span className="mr-1">{getCategoryIcon(listing.category)}</span>
                              {listing.category.replace('_', ' ')}
                            </Badge>
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
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {listings.map((listing) => (
                      <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                {getCategoryIcon(listing.category)}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-lg font-semibold">{listing.title}</h3>
                                  <p className="text-gray-600 text-sm line-clamp-2">
                                    {listing.description || 'No description provided'}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="text-xl font-bold text-green-600">₹{listing.price}</div>
                                  <div className="text-xs text-gray-500">{formatTimeAgo(listing.createdAt)}</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  {listing.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      <span>{listing.location}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                                      <span className="text-xs text-gray-600">
                                        {listing.user.name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <span>{listing.user.name}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Eye className="w-3 h-3" />
                                    <span>{listing.views}</span>
                                  </div>
                                  <Button size="sm" variant="outline">
                                    <MessageCircle className="w-4 h-4 mr-1" />
                                    Chat
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Load More */}
                {pagination.hasMore && (
                  <div className="text-center mt-8">
                    <Button onClick={loadMore} disabled={loading}>
                      {loading ? 'Loading...' : 'Load More'}
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* No Results */}
            {!loading && listings.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-gray-600 mb-4">
                  {filters.q 
                    ? 'Try adjusting your search terms or filters'
                    : 'No listings available at the moment'
                  }
                </p>
                {hasActiveFilters() && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}