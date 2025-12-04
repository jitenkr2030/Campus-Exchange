'use client'

import { useState, useEffect } from 'react'
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Wallet, IndianRupee, CreditCard, Smartphone, TrendingUp, Clock, CheckCircle, Plus } from "lucide-react"
import Link from "next/link"

interface WalletTransaction {
  id: string
  type: string
  amount: number
  balance: number
  description: string
  referenceType?: string
  status: string
  createdAt: string
}

interface WalletData {
  id: string
  balance: number
  currency: string
  isActive: boolean
  transactions: WalletTransaction[]
}

export default function WalletPage() {
  const { user } = useAuth()
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [addMoneyAmount, setAddMoneyAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const paymentMethods = [
    { value: 'UPI', label: 'UPI', icon: '📱' },
    { value: 'CARD', label: 'Credit/Debit Card', icon: '💳' },
    { value: 'NET_BANKING', label: 'Net Banking', icon: '🏦' },
    { value: 'WALLET', label: 'Digital Wallet', icon: '👛' }
  ]

  useEffect(() => {
    if (user) {
      fetchWallet()
    }
  }, [user])

  const fetchWallet = async () => {
    try {
      const response = await fetch(`/api/wallet?userId=${user?.id}`)
      const data = await response.json()
      
      if (data.success) {
        setWallet(data.wallet)
      }
    } catch (error) {
      console.error('Error fetching wallet:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMoney = async () => {
    if (!addMoneyAmount || !paymentMethod) {
      setError('Please enter amount and select payment method')
      return
    }

    const amount = parseFloat(addMoneyAmount)
    if (amount <= 0) {
      setError('Amount must be greater than 0')
      return
    }

    if (amount > 50000) {
      setError('Maximum amount per transaction is ₹50,000')
      return
    }

    setProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/wallet/add-money', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          amount: addMoneyAmount,
          paymentMethod: paymentMethod
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setAddMoneyAmount('')
        setPaymentMethod('')
        fetchWallet()
      } else {
        setError(data.message || 'Failed to add money')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'CREDIT':
        return <Plus className="w-4 h-4 text-green-600" />
      case 'DEBIT':
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
      case 'REFUND':
        return <CheckCircle className="w-4 h-4 text-blue-600" />
      default:
        return <Wallet className="w-4 h-4 text-gray-600" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'CREDIT':
        return 'text-green-600'
      case 'DEBIT':
        return 'text-red-600'
      case 'REFUND':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access your wallet</CardDescription>
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
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <Badge className="bg-blue-100 text-blue-800">
              <Wallet className="w-4 h-4 mr-2" />
              DIGITAL WALLET
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Your Campus
            <span className="text-blue-600"> Wallet</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Manage your money for seamless marketplace transactions
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              Money added to your wallet successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Wallet Balance Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Wallet Balance
            </CardTitle>
            <CardDescription className="text-blue-100">
              Available for marketplace transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-blue-500 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-blue-400 rounded w-1/2"></div>
              </div>
            ) : (
              <>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {wallet ? formatAmount(wallet.balance) : '₹0'}
                </div>
                <div className="text-blue-100">
                  Campus Exchange Wallet
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Money Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-green-600" />
                Add Money
              </CardTitle>
              <CardDescription>
                Add funds to your wallet for marketplace transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (₹)</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={addMoneyAmount}
                  onChange={(e) => setAddMoneyAmount(e.target.value)}
                  min="1"
                  max="50000"
                />
                <div className="flex gap-2 flex-wrap">
                  {[100, 500, 1000, 2000, 5000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setAddMoneyAmount(amount.toString())}
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <Select onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        <div className="flex items-center gap-2">
                          <span>{method.icon}</span>
                          {method.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleAddMoney}
                disabled={processing || !addMoneyAmount || !paymentMethod}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {processing ? 'Processing...' : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Money
                  </>
                )}
              </Button>

              <div className="text-xs text-gray-500 space-y-1">
                <p>• Minimum amount: ₹1</p>
                <p>• Maximum amount: ₹50,000 per transaction</p>
                <p>• No fees for adding money</p>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Transaction History
              </CardTitle>
              <CardDescription>
                Recent wallet transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="animate-pulse flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div>
                          <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : wallet && wallet.transactions.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {wallet.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <div className="font-medium text-sm">{transaction.description}</div>
                          <div className="text-xs text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === 'CREDIT' || transaction.type === 'REFUND' ? '+' : '-'}
                          {formatAmount(transaction.amount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatAmount(transaction.balance)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No transactions yet</p>
                  <p className="text-sm text-gray-500 mt-1">Add money to see your transaction history</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Benefits</CardTitle>
              <CardDescription>
                Why use your Campus Exchange wallet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Instant Transactions</h3>
                  <p className="text-sm text-gray-600">Pay for listings and services instantly</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Mobile Friendly</h3>
                  <p className="text-sm text-gray-600">Manage your wallet on any device</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Multiple Payment Options</h3>
                  <p className="text-sm text-gray-600">Add money using UPI, cards, or net banking</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}