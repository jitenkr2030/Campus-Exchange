'use client'

import { useState, useEffect } from 'react'
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Search, ShoppingBag, Star, MapPin, Package, IndianRupee, Filter } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description?: string
  imageUrl?: string
  category: string
  price: number
  stockQuantity: number
  sku?: string
  isDigital: boolean
  digitalUrl?: string
}

interface CartItem {
  product: Product
  quantity: number
}

export default function CampusStorePage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [error, setError] = useState('')
  const [orderSuccess, setOrderSuccess] = useState(false)

  const categories = [
    { value: 'ALL', label: 'All Products' },
    { value: 'MERCHANDISE', label: 'Merchandise' },
    { value: 'ELECTRONICS', label: 'Electronics' },
    { value: 'STATIONERY', label: 'Stationery' },
    { value: 'ACCESSORIES', label: 'Accessories' },
    { value: 'BOOKS', label: 'Books' },
    { value: 'OTHER', label: 'Other' }
  ]

  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [user])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/store/products?campusId=${user?.campusId}&category=${selectedCategory === 'ALL' ? '' : selectedCategory}`)
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [selectedCategory, user])

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id)
      if (existingItem) {
        if (existingItem.quantity < product.stockQuantity) {
          return prev.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      } else {
        return [...prev, { product, quantity: 1 }]
      }
      return prev
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return
    setCart(prev => 
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stockQuantity) }
          : item
      )
    )
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Your cart is empty')
      return
    }

    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        shippingAddress: user?.name, // For campus pickup/delivery
        notes: '',
        campusId: user?.campusId,
        userId: user?.id
      }

      const response = await fetch('/api/store/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()

      if (data.success) {
        setCart([])
        setShowCart(false)
        setOrderSuccess(true)
        fetchProducts() // Refresh products to update stock
      } else {
        setError(data.message || 'Failed to place order')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'MERCHANDISE': '👕',
      'ELECTRONICS': '📱',
      'STATIONERY': '✏️',
      'ACCESSORIES': '🎒',
      'BOOKS': '📚',
      'OTHER': '📦'
    }
    return icons[category] || '📦'
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access the campus store</CardDescription>
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

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Order Placed!</CardTitle>
            <CardDescription>Your order has been placed successfully</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                You will receive a confirmation email shortly. Your order will be ready for campus pickup/delivery.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">Back to Home</Button>
              </Link>
              <Link href="/store" className="flex-1">
                <Button className="w-full">Continue Shopping</Button>
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
              <Badge className="bg-green-100 text-green-800">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Campus Store
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowCart(true)}
                className="relative"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Cart
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center p-0">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
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
                placeholder="Search products..."
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
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'ALL' 
                  ? 'Try adjusting your search or filters'
                  : 'No products available in your campus store yet'
                }
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow border-2 hover:border-green-200">
                <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <span className="text-4xl">{getCategoryIcon(product.category)}</span>
                  )}
                </div>
                
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge className={`${product.stockQuantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} text-xs`}>
                      {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                    </Badge>
                    {product.isDigital && (
                      <Badge className="bg-blue-100 text-blue-700 text-xs">Digital</Badge>
                    )}
                  </div>
                  
                  <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                  
                  {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-green-600">
                      ₹{product.price}
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => addToCart(product)}
                      disabled={product.stockQuantity === 0}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <ShoppingBag className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Shopping Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Shopping Cart ({getTotalItems()})
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Your cart is empty</p>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-lg">{getCategoryIcon(item.product.category)}</span>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        <div className="text-green-600 font-semibold">₹{item.product.price}</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stockQuantity}
                        >
                          +
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-green-600">₹{getTotalAmount()}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Place Order
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}