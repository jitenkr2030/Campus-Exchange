'use client'

import { useState } from 'react'
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Star, Crown, Shield, Zap, Gift, CheckCircle, IndianRupee } from "lucide-react"
import Link from "next/link"

export default function PremiumPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubscribe = async () => {
    if (!user) {
      setError('Please log in to subscribe to premium')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/premium/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        // Refresh the page to update user status
        setTimeout(() => window.location.reload(), 2000)
      } else {
        setError(data.message || 'Failed to subscribe to premium')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    {
      icon: CheckCircle,
      title: "Unlimited Free Listings",
      description: "Create as many listings as you want without any fees"
    },
    {
      icon: CheckCircle,
      title: "Free Contact Unlock",
      description: "Unlock seller contact information without paying ₹5 each time"
    },
    {
      icon: Crown,
      title: "Premium Badge",
      description: "Get a verified premium badge on your profile and listings"
    },
    {
      icon: Zap,
      title: "Early Access",
      description: "Be the first to access new features and marketplace updates"
    },
    {
      icon: Star,
      title: "Priority Support",
      description: "Get faster customer support and issue resolution"
    },
    {
      icon: Gift,
      title: "Exclusive Deals",
      description: "Access special premium-only deals and discounts"
    }
  ]

  const savings = [
    { regular: 50, premium: 0, description: "Listing Fees (5 listings)" },
    { regular: 25, premium: 0, description: "Contact Unlocks (5 contacts)" },
    { regular: 75, premium: 99, description: "Total Monthly Cost" }
  ]

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Welcome to Premium!</CardTitle>
            <CardDescription>Your premium subscription is now active</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>₹99</strong> premium subscription has been activated successfully
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">Back to Home</Button>
              </Link>
              <Link href="/create-listing" className="flex-1">
                <Button className="w-full">Create Free Listing</Button>
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="mb-6">
            <Badge className="mb-4 bg-yellow-100 text-yellow-800">
              <Crown className="w-4 h-4 mr-2" />
              PREMIUM MEMBERSHIP
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Upgrade to
            <span className="text-yellow-500"> Campus Premium</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Unlock unlimited listings, free contact unlocks, and exclusive benefits for just ₹99/month
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="text-3xl font-bold text-yellow-600">₹99</div>
            <div className="text-gray-500">per month</div>
          </div>
          <Button 
            onClick={handleSubscribe} 
            disabled={loading}
            size="lg"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-lg px-8 py-4"
          >
            {loading ? 'Processing...' : (
              <>
                <Crown className="w-5 h-5 mr-2" />
                Get Premium Now
              </>
            )}
          </Button>
        </section>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Benefits Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Premium Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index} className="border-2 border-yellow-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-yellow-600" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Savings Calculator */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">How Much You Save</h2>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Monthly Savings Comparison</CardTitle>
              <CardDescription>See how much you save with premium membership</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savings.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{item.description}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 line-through">₹{item.regular}</span>
                      <span className="text-green-600 font-bold">₹{item.premium}</span>
                      {item.premium < item.regular && (
                        <Badge className="bg-green-100 text-green-700">
                          Save ₹{item.regular - item.premium}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="font-bold">Total Savings</span>
                    <span className="text-2xl font-bold text-green-600">Save ₹50/month</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Testimonials */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">What Premium Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">A</span>
                  </div>
                  <div>
                    <div className="font-semibold">Amit Kumar</div>
                    <div className="text-sm text-gray-500">Engineering Student</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Premium membership saved me so much money! I create 10-15 listings per month and the contact unlock feature is a game-changer."
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-pink-600 font-bold">P</span>
                  </div>
                  <div>
                    <div className="font-semibold">Priya Singh</div>
                    <div className="text-sm text-gray-500">MBA Student</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The premium badge makes my listings stand out. I get more inquiries and sell faster. Worth every penny!"
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="max-w-2xl mx-auto border-2 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Save Money?</CardTitle>
              <CardDescription>
                Join thousands of students who are already saving with Campus Premium
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleSubscribe} 
                disabled={loading}
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-lg px-8 py-4 w-full"
              >
                {loading ? 'Processing...' : (
                  <>
                    <Crown className="w-5 h-5 mr-2" />
                    Subscribe to Premium - ₹99/month
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Cancel anytime. No hidden fees.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}