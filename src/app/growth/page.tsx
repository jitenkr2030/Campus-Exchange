'use client'

import { useState, useEffect } from 'react'
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Share2, 
  Gift, 
  Trophy, 
  Star, 
  Users, 
  Copy, 
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  Crown,
  Target,
  Zap,
  Shield,
  MessageCircle,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

interface ReferralData {
  code: string
  totalReferrals: number
  successfulReferrals: number
  pendingReferrals: number
  totalEarnings: number
  referrals: Array<{
    id: string
    status: string
    reward: number
    completedAt?: string
    referredUser: {
      id: string
      name: string
      createdAt: string
    }
  }>
}

interface BadgeData {
  id: string
  name: string
  description: string
  icon: string
  color: string
  earnedAt: string
}

interface LeaderboardData {
  position: number
  totalReferrals: number
}

interface LeaderboardEntry {
  position: number
  name: string
  referrals: number
  earnings: number
  isCurrentUser: boolean
}

export default function GrowthPage() {
  const { user } = useAuth()
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [badges, setBadges] = useState<BadgeData[]>([])
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      fetchGrowthData()
    }
  }, [user])

  const fetchGrowthData = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/referrals/create?userId=${user.id}`)
      const data = await response.json()
      
      if (data.success) {
        setReferralData(data.referralData)
        setBadges(data.badges)
        setLeaderboardData(data.leaderboard)
        
        // Generate mock leaderboard data
        const mockLeaderboard: LeaderboardEntry[] = [
          { position: 1, name: 'Rahul Sharma', referrals: 25, earnings: 1250, isCurrentUser: false },
          { position: 2, name: 'Priya Patel', referrals: 18, earnings: 900, isCurrentUser: false },
          { position: 3, name: 'Amit Kumar', referrals: 15, earnings: 750, isCurrentUser: false },
          { position: 4, name: 'Neha Singh', referrals: 12, earnings: 600, isCurrentUser: false },
          { position: 5, name: 'Vikas Gupta', referrals: 10, earnings: 500, isCurrentUser: false },
          { position: data.leaderboard.position, name: user.name, referrals: data.leaderboard.totalReferrals, earnings: data.leaderboard.totalReferrals * 50, isCurrentUser: true }
        ].sort((a, b) => b.referrals - a.referrals)
        .map((entry, index) => ({ ...entry, position: index + 1 }))

        setLeaderboard(mockLeaderboard)
      }
    } catch (error) {
      console.error('Error fetching growth data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyReferralCode = async () => {
    if (!referralData?.code) return

    try {
      await navigator.clipboard.writeText(referralData.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      setError('Failed to copy referral code')
    }
  }

  const shareReferralCode = async () => {
    if (!referralData?.code) return

    const shareText = `Join Campus Exchange using my referral code: ${referralData.code} and get started! Use this link: ${window.location.origin}?ref=${referralData.code}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Campus Exchange',
          text: shareText
        })
      } catch (error) {
        copyToClipboard(shareText)
      }
    } else {
      copyToClipboard(shareText)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      setError('Failed to copy to clipboard')
    }
  }

  const getBadgeIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'Star': Star,
      'Trophy': Trophy,
      'Crown': Crown,
      'Target': Target,
      'Zap': Zap,
      'Shield': Shield,
      'MessageCircle': MessageCircle,
      'Users': Users
    }
    const Icon = iconMap[iconName] || Star
    return <Icon className="w-6 h-6" />
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access growth features</CardDescription>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading growth features...</p>
        </div>
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
            <h1 className="text-xl font-semibold">Growth Center</h1>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-2 rounded-full mb-4">
            <TrendingUp className="w-4 h-4" />
            <span className="font-semibold">Growth & Rewards</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Grow Your Campus Network
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Invite friends, earn rewards, collect badges, and climb the leaderboard
          </p>
        </div>

        <Tabs defaultValue="referrals" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="referrals" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Referrals
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="referrals" className="space-y-6">
            {/* Referral Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                      <p className="text-2xl font-bold">{referralData?.totalReferrals || 0}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Successful</p>
                      <p className="text-2xl font-bold text-green-600">{referralData?.successfulReferrals || 0}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">{referralData?.pendingReferrals || 0}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                      <p className="text-2xl font-bold text-purple-600">{formatCurrency(referralData?.totalEarnings || 0)}</p>
                    </div>
                    <Gift className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Referral Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Your Referral Code
                </CardTitle>
                <CardDescription>
                  Share this code with friends and earn ₹50 for each successful referral
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={referralData?.code || ''}
                      readOnly
                      className="text-center font-mono text-lg font-bold"
                    />
                  </div>
                  <Button onClick={copyReferralCode} variant="outline">
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button onClick={shareReferralCode}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <Alert>
                  <Gift className="w-4 h-4" />
                  <AlertDescription>
                    <strong>How it works:</strong> When someone signs up using your referral code and completes their first transaction, you'll earn ₹50. They get a warm welcome too!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Referral History */}
            {referralData?.referrals && referralData.referrals.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Referral History</CardTitle>
                  <CardDescription>Track your referral progress and earnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {referralData.referrals.map((referral) => (
                      <div key={referral.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs text-gray-600">
                              {referral.referredUser.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{referral.referredUser.name}</p>
                            <p className="text-sm text-gray-600">
                              Joined {new Date(referral.referredUser.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={
                            referral.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            referral.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {referral.status}
                          </Badge>
                          {referral.status === 'COMPLETED' && (
                            <p className="text-sm font-semibold text-green-600 mt-1">
                              +{formatCurrency(referral.reward)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            {/* Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.length > 0 ? (
                badges.map((badge) => (
                  <Card key={badge.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        badge.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                        badge.color === 'green' ? 'bg-green-100 text-green-600' :
                        badge.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                        badge.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {getBadgeIcon(badge.icon)}
                      </div>
                      <CardTitle className="text-lg">{badge.name}</CardTitle>
                      <CardDescription>{badge.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-gray-600">
                        Earned on {new Date(badge.earnedAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Badges Yet</h3>
                  <p className="text-gray-600">Start referring friends and creating listings to earn badges!</p>
                </div>
              )}
            </div>

            {/* Available Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Available Badges</CardTitle>
                <CardDescription>Complete these actions to earn more badges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">First Listing</p>
                      <p className="text-sm text-gray-600">Create your first marketplace listing</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">Social Butterfly</p>
                      <p className="text-sm text-gray-600">Complete 10 successful transactions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">Verified Seller</p>
                      <p className="text-sm text-gray-600">Get verified by campus admin</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">Top Referrer</p>
                      <p className="text-sm text-gray-600">Refer 10+ friends to the platform</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            {/* Your Position */}
            {leaderboardData && (
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-600" />
                    Your Leaderboard Position
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        #{leaderboardData.position}
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{user.name}</p>
                        <p className="text-gray-600">{leaderboardData.totalReferrals} referrals</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(leaderboardData.totalReferrals * 50)}
                      </p>
                      <p className="text-sm text-gray-600">Total Earnings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Top Referrers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Top Referrers This Month
                </CardTitle>
                <CardDescription>See who's leading the referral game</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.slice(0, 10).map((entry, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.isCurrentUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          entry.position === 1 ? 'bg-yellow-400 text-white' :
                          entry.position === 2 ? 'bg-gray-400 text-white' :
                          entry.position === 3 ? 'bg-orange-400 text-white' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {entry.position}
                        </div>
                        <div>
                          <p className="font-medium">
                            {entry.name}
                            {entry.isCurrentUser && (
                              <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">You</Badge>
                            )}
                          </p>
                          <p className="text-sm text-gray-600">{entry.referrals} referrals</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {formatCurrency(entry.earnings)}
                        </p>
                        <p className="text-xs text-gray-500">earned</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rewards Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Referral Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">How to Earn</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Share your referral code with friends</li>
                      <li>• Friends sign up using your code</li>
                      <li>• They complete their first transaction</li>
                      <li>• You earn ₹50 per successful referral</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Reward Tiers</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 5+ referrals: Exclusive badge</li>
                      <li>• 10+ referrals: Premium features</li>
                      <li>• 25+ referrals: Campus ambassador</li>
                      <li>• 50+ referrals: Special recognition</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}