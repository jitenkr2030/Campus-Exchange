'use client'

import { useState } from 'react'
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  Target, 
  Lightbulb, 
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  DollarSign,
  Tag,
  Eye,
  Zap
} from "lucide-react"
import Link from "next/link"

interface PriceSuggestion {
  price: number
  range: { min: number; max: number; average: number }
  confidence: number
  reasoning: string
  similarListingsCount: number
}

interface CategoryDetection {
  recommendedCategory: string
  confidence: number
  reasoning: string
  allCategories: Array<{
    category: string
    confidence: number
    isRecommended: boolean
  }>
}

interface FraudAnalysis {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  riskScore: number
  flags: string[]
  reasoning: string
  recommendation: string
}

export default function AIFeaturesPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('price-suggestion')
  
  // Price suggestion state
  const [priceData, setPriceData] = useState({ title: '', category: '', description: '' })
  const [priceSuggestion, setPriceSuggestion] = useState<PriceSuggestion | null>(null)
  const [priceLoading, setPriceLoading] = useState(false)
  
  // Category detection state
  const [categoryData, setCategoryData] = useState({ title: '', description: '' })
  const [categoryDetection, setCategoryDetection] = useState<CategoryDetection | null>(null)
  const [categoryLoading, setCategoryLoading] = useState(false)
  
  // Fraud detection state
  const [fraudData, setFraudData] = useState({ title: '', description: '', price: '', category: '' })
  const [fraudAnalysis, setFraudAnalysis] = useState<FraudAnalysis | null>(null)
  const [fraudLoading, setFraudLoading] = useState(false)

  const handlePriceSuggestion = async () => {
    if (!priceData.title || !priceData.category) return

    setPriceLoading(true)
    try {
      const response = await fetch('/api/ai/price-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(priceData)
      })

      const data = await response.json()
      if (data.success) {
        setPriceSuggestion(data.suggestion)
      }
    } catch (error) {
      console.error('Error getting price suggestion:', error)
    } finally {
      setPriceLoading(false)
    }
  }

  const handleCategoryDetection = async () => {
    if (!categoryData.title) return

    setCategoryLoading(true)
    try {
      const response = await fetch('/api/ai/category-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      })

      const data = await response.json()
      if (data.success) {
        setCategoryDetection(data.detection)
      }
    } catch (error) {
      console.error('Error detecting category:', error)
    } finally {
      setCategoryLoading(false)
    }
  }

  const handleFraudDetection = async () => {
    if (!fraudData.title || !fraudData.price || !fraudData.category) return

    setFraudLoading(true)
    try {
      const response = await fetch('/api/ai/fraud-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fraudData,
          userId: user?.id || 'demo-user'
        })
      })

      const data = await response.json()
      if (data.success) {
        setFraudAnalysis(data.fraudAnalysis)
      }
    } catch (error) {
      console.error('Error detecting fraud:', error)
    } finally {
      setFraudLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HIGH': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const categories = [
    'NOTES',
    'BOOKS',
    'BIKES',
    'FOOD_TOKENS',
    'ROOM_RENTALS'
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access AI features</CardDescription>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">CE</span>
                </div>
                <span className="font-semibold">Campus Exchange</span>
              </Link>
            </div>
            <h1 className="text-xl font-semibold">AI Features</h1>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-4 py-2 rounded-full mb-4">
            <Brain className="w-4 h-4" />
            <span className="font-semibold">Powered by Artificial Intelligence</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Smart Marketplace Intelligence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI helps you price smarter, categorize better, and stay safe from fraud
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
            <TabsTrigger value="price-suggestion" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Price AI
            </TabsTrigger>
            <TabsTrigger value="category-detection" className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Category AI
            </TabsTrigger>
            <TabsTrigger value="fraud-detection" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Safety AI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="price-suggestion" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    AI Price Suggestion
                  </CardTitle>
                  <CardDescription>
                    Get intelligent price recommendations based on market data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Listing Title *</label>
                    <Input
                      placeholder="e.g., Engineering Mathematics Textbook"
                      value={priceData.title}
                      onChange={(e) => setPriceData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category *</label>
                    <Select value={priceData.category} onValueChange={(value) => setPriceData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description (Optional)</label>
                    <Textarea
                      placeholder="Describe your item in detail..."
                      value={priceData.description}
                      onChange={(e) => setPriceData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  
                  <Button 
                    onClick={handlePriceSuggestion} 
                    disabled={!priceData.title || !priceData.category || priceLoading}
                    className="w-full"
                  >
                    {priceLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </div>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Get Price Suggestion
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              {priceSuggestion && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      AI Recommendation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {formatCurrency(priceSuggestion.price)}
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {priceSuggestion.confidence}% confidence
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">Price Range</h4>
                      <div className="flex justify-between text-sm">
                        <span>Min: {formatCurrency(priceSuggestion.range.min)}</span>
                        <span>Avg: {formatCurrency(priceSuggestion.range.average)}</span>
                        <span>Max: {formatCurrency(priceSuggestion.range.max)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">AI Reasoning</h4>
                      <p className="text-sm text-gray-600">{priceSuggestion.reasoning}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Based on {priceSuggestion.similarListingsCount} similar listings</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>How Price AI Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Eye className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold mb-1">Market Analysis</h4>
                    <p className="text-sm text-gray-600">Analyzes thousands of similar listings</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Target className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-1">Smart Detection</h4>
                    <p className="text-sm text-gray-600">Identifies key features and condition</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold mb-1">Trend Analysis</h4>
                    <p className="text-sm text-gray-600">Considers current market trends</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="category-detection" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    AI Category Detection
                  </CardTitle>
                  <CardDescription>
                    Automatically detect the best category for your listing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Listing Title *</label>
                    <Input
                      placeholder="e.g., Hero Cycle in good condition"
                      value={categoryData.title}
                      onChange={(e) => setCategoryData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description (Optional)</label>
                    <Textarea
                      placeholder="Add more details about your item..."
                      value={categoryData.description}
                      onChange={(e) => setCategoryData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleCategoryDetection} 
                    disabled={!categoryData.title || categoryLoading}
                    className="w-full"
                  >
                    {categoryLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </div>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Detect Category
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              {categoryDetection && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      AI Detection Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {categoryDetection.recommendedCategory.replace('_', ' ')}
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {categoryDetection.confidence}% confidence
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">All Categories</h4>
                      <div className="space-y-2">
                        {categoryDetection.allCategories.map((cat) => (
                          <div key={cat.category} className="flex items-center justify-between">
                            <span className="text-sm">{cat.category.replace('_', ' ')}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${cat.confidence}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600">{cat.confidence}%</span>
                              {cat.isRecommended && (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">AI Reasoning</h4>
                      <p className="text-sm text-gray-600">{categoryDetection.reasoning}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>How Category AI Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold mb-1">Keyword Analysis</h4>
                    <p className="text-sm text-gray-600">Scans for category-specific keywords</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Brain className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-1">Context Understanding</h4>
                    <p className="text-sm text-gray-600">Understands item context and usage</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold mb-1">Confidence Scoring</h4>
                    <p className="text-sm text-gray-600">Provides confidence levels</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fraud-detection" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    AI Fraud Detection
                  </CardTitle>
                  <CardDescription>
                    Keep the marketplace safe with AI-powered fraud detection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Listing Title *</label>
                    <Input
                      placeholder="e.g., iPhone 13 Pro Max - Urgent Sale"
                      value={fraudData.title}
                      onChange={(e) => setFraudData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price *</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={fraudData.price}
                      onChange={(e) => setFraudData(prev => ({ ...prev, price: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category *</label>
                    <Select value={fraudData.category} onValueChange={(value) => setFraudData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="Describe your listing..."
                      value={fraudData.description}
                      onChange={(e) => setFraudData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleFraudDetection} 
                    disabled={!fraudData.title || !fraudData.price || !fraudData.category || fraudLoading}
                    className="w-full"
                  >
                    {fraudLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </div>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Check for Fraud
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              {fraudAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Safety Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <Badge className={getRiskColor(fraudAnalysis.riskLevel)}>
                        {fraudAnalysis.riskLevel} RISK
                      </Badge>
                      <div className="text-2xl font-bold mt-2 mb-2">
                        Risk Score: {fraudAnalysis.riskScore}/100
                      </div>
                    </div>
                    
                    {fraudAnalysis.flags.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">Detected Flags</h4>
                        <div className="space-y-1">
                          {fraudAnalysis.flags.map((flag, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">{flag}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">AI Analysis</h4>
                      <p className="text-sm text-gray-600">{fraudAnalysis.reasoning}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">Recommendation</h4>
                      <p className="text-sm text-gray-600">{fraudAnalysis.recommendation}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>How Safety AI Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <h4 className="font-semibold mb-1">Pattern Detection</h4>
                    <p className="text-sm text-gray-600">Identifies suspicious patterns</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Brain className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h4 className="font-semibold mb-1">User Behavior</h4>
                    <p className="text-sm text-gray-600">Analyzes user history</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-1">Risk Scoring</h4>
                    <p className="text-sm text-gray-600">Provides risk assessment</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Why AI Matters</CardTitle>
            <CardDescription>How artificial intelligence enhances your marketplace experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Maximize Value</h3>
                <p className="text-sm text-gray-600">Get the best price for your items with AI-powered suggestions</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tag className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Perfect Categorization</h3>
                <p className="text-sm text-gray-600">Ensure your items reach the right audience</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">Stay Safe</h3>
                <p className="text-sm text-gray-600">Protect yourself from fraud and scams</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Save Time</h3>
                <p className="text-sm text-gray-600">Get instant insights and recommendations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}