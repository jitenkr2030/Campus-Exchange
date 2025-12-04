'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Phone, MessageCircle, Shield, CheckCircle, Zap } from "lucide-react"

interface AuthFormProps {
  onAuthSuccess: (user: any) => void
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDemoLogin = () => {
    const demoUser = {
      id: 'demo-user-1',
      name: 'Demo User',
      phone: '+1234567890',
      email: 'demo@campus.com',
      isVerified: true,
      isPremium: false
    }
    onAuthSuccess(demoUser)
  }

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      })

      const data = await response.json()

      if (data.success) {
        setStep('otp')
      } else {
        setError(data.message || 'Failed to send OTP')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp })
      })

      const data = await response.json()

      if (data.success) {
        if (data.isUserExists) {
          onAuthSuccess(data.user)
        } else {
          setStep('profile')
        }
      } else {
        setError(data.message || 'Invalid OTP')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteProfile = async () => {
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, name, email })
      })

      const data = await response.json()

      if (data.success) {
        onAuthSuccess(data.user)
      } else {
        setError(data.message || 'Failed to complete profile')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Campus Exchange</h1>
          <p className="text-gray-600 mt-2">Join your campus marketplace</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">
              {step === 'phone' && 'Enter Phone Number'}
              {step === 'otp' && 'Enter OTP'}
              {step === 'profile' && 'Complete Profile'}
            </CardTitle>
            <CardDescription>
              {step === 'phone' && 'We\'ll send you a verification code'}
              {step === 'otp' && 'Enter the 6-digit code sent to your phone'}
              {step === 'profile' && 'Tell us about yourself'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === 'phone' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
                      <span className="text-gray-600">+91</span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="1234567890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      maxLength={10}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleSendOtp} 
                  disabled={loading || phoneNumber.length !== 10}
                  className="w-full"
                >
                  {loading ? 'Sending...' : 'Send OTP via WhatsApp'}
                </Button>
              </div>
            )}

            {step === 'otp' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter 6-digit OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                  />
                </div>
                <Button 
                  onClick={handleVerifyOtp} 
                  disabled={loading || otp.length !== 6}
                  className="w-full"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setStep('phone')}
                  className="w-full"
                >
                  Change Phone Number
                </Button>
              </div>
            )}

            {step === 'profile' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleCompleteProfile} 
                  disabled={loading || !name.trim()}
                  className="w-full"
                >
                  {loading ? 'Creating Account...' : 'Complete Setup'}
                </Button>
              </div>
            )}

            {/* Security Note */}
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Your data is secure and never shared</span>
            </div>
          </CardContent>
        </Card>

        {/* Demo Login Button */}
        <div className="mt-4">
          <Button 
            onClick={handleDemoLogin}
            variant="outline"
            className="w-full border-yellow-400 text-yellow-600 hover:bg-yellow-50"
          >
            <Zap className="w-4 h-4 mr-2" />
            Quick Demo Login (Skip Phone Verification)
          </Button>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-xs text-gray-600">Verified Users</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-xs text-gray-600">Secure Chat</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-xs text-gray-600">Campus Only</span>
          </div>
        </div>
      </div>
    </div>
  )
}