'use client'

import { useState, useEffect } from 'react'
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Shield, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Eye,
  Ban,
  Check,
  TrendingUp,
  DollarSign,
  Activity,
  Settings,
  LogOut
} from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalUsers: number
  totalListings: number
  totalRevenue: number
  activeListings: number
  pendingReports: number
  premiumUsers: number
}

interface User {
  id: string
  name: string
  phone: string
  email?: string
  isVerified: boolean
  isPremium: boolean
  createdAt: string
  listingsCount: number
}

interface Listing {
  id: string
  title: string
  price: number
  category: string
  isAvailable: boolean
  isFeatured: boolean
  views: number
  createdAt: string
  user: {
    name: string
    isVerified: boolean
  }
  reportsCount: number
}

interface Report {
  id: string
  type: string
  description: string
  status: string
  createdAt: string
  reporter: {
    name: string
  }
  reported: {
    name: string
    type: 'user' | 'listing'
  }
}

export default function AdminPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalListings: 0,
    totalRevenue: 0,
    activeListings: 0,
    pendingReports: 0,
    premiumUsers: 0
  })
  const [users, setUsers] = useState<User[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock data for demo
  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setStats({
        totalUsers: 1247,
        totalListings: 3421,
        totalRevenue: 48560,
        activeListings: 2890,
        pendingReports: 23,
        premiumUsers: 156
      })

      setUsers([
        {
          id: '1',
          name: 'Rahul Sharma',
          phone: '+919876543210',
          email: 'rahul@example.com',
          isVerified: true,
          isPremium: true,
          createdAt: '2024-01-15',
          listingsCount: 12
        },
        {
          id: '2',
          name: 'Priya Patel',
          phone: '+919876543211',
          email: 'priya@example.com',
          isVerified: true,
          isPremium: false,
          createdAt: '2024-02-20',
          listingsCount: 8
        },
        {
          id: '3',
          name: 'Amit Kumar',
          phone: '+919876543212',
          email: 'amit@example.com',
          isVerified: false,
          isPremium: false,
          createdAt: '2024-03-10',
          listingsCount: 3
        }
      ])

      setListings([
        {
          id: '1',
          title: 'Engineering Mathematics Textbook',
          price: 450,
          category: 'BOOKS',
          isAvailable: true,
          isFeatured: true,
          views: 234,
          createdAt: '2024-03-15',
          user: { name: 'Rahul Sharma', isVerified: true },
          reportsCount: 0
        },
        {
          id: '2',
          title: 'Physics Notes Semester 1',
          price: 200,
          category: 'NOTES',
          isAvailable: true,
          isFeatured: false,
          views: 156,
          createdAt: '2024-03-18',
          user: { name: 'Priya Patel', isVerified: true },
          reportsCount: 1
        },
        {
          id: '3',
          title: 'Hero Cycle in good condition',
          price: 3500,
          category: 'BIKES',
          isAvailable: false,
          isFeatured: false,
          views: 89,
          createdAt: '2024-03-20',
          user: { name: 'Amit Kumar', isVerified: false },
          reportsCount: 2
        }
      ])

      setReports([
        {
          id: '1',
          type: 'SPAM',
          description: 'User is sending spam messages to multiple people',
          status: 'PENDING',
          createdAt: '2024-03-21',
          reporter: { name: 'Rahul Sharma' },
          reported: { name: 'Amit Kumar', type: 'user' }
        },
        {
          id: '2',
          type: 'INAPPROPRIATE_CONTENT',
          description: 'Listing contains inappropriate language',
          status: 'PENDING',
          createdAt: '2024-03-21',
          reporter: { name: 'Priya Patel' },
          reported: { name: 'Physics Notes Semester 1', type: 'listing' }
        },
        {
          id: '3',
          type: 'FRAUD',
          description: 'User asking for advance payment and not delivering',
          status: 'UNDER_REVIEW',
          createdAt: '2024-03-20',
          reporter: { name: 'Rahul Sharma' },
          reported: { name: 'Hero Cycle in good condition', type: 'listing' }
        }
      ])

      setLoading(false)
    }, 1000)
  }, [])

  const handleUserAction = async (userId: string, action: 'verify' | 'ban' | 'premium') => {
    // In a real implementation, this would call an API
    console.log(`User ${action}:`, userId)
    
    // Update local state for demo
    if (action === 'verify') {
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isVerified: true } : u
      ))
    } else if (action === 'ban') {
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isVerified: false } : u
      ))
    } else if (action === 'premium') {
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isPremium: !u.isPremium } : u
      ))
    }
  }

  const handleListingAction = async (listingId: string, action: 'feature' | 'remove' | 'approve') => {
    // In a real implementation, this would call an API
    console.log(`Listing ${action}:`, listingId)
    
    // Update local state for demo
    if (action === 'feature') {
      setListings(prev => prev.map(l => 
        l.id === listingId ? { ...l, isFeatured: !l.isFeatured } : l
      ))
    } else if (action === 'remove') {
      setListings(prev => prev.map(l => 
        l.id === listingId ? { ...l, isAvailable: false } : l
      ))
    }
  }

  const handleReportAction = async (reportId: string, action: 'resolve' | 'dismiss') => {
    // In a real implementation, this would call an API
    console.log(`Report ${action}:`, reportId)
    
    // Update local state for demo
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: action === 'resolve' ? 'RESOLVED' : 'DISMISSED' } : r
    ))
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'active' && listing.isAvailable) ||
                          (filterStatus === 'inactive' && !listing.isAvailable)
    return matchesSearch && matchesStatus
  })

  const filteredReports = reports.filter(report => 
    filterStatus === 'all' || report.status === filterStatus.toUpperCase()
  )

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access admin panel</CardDescription>
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

  // For demo purposes, we'll assume the first user is an admin
  // In a real app, you'd check for admin role/permissions
  const isAdmin = true

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this area</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Back to Home</Button>
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
          <p className="text-gray-600">Loading admin panel...</p>
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
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">CE</span>
                </div>
                <span className="font-semibold">Campus Exchange</span>
              </Link>
              <div className="flex items-center gap-2 pl-4 border-l">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Admin Panel</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-1" />
                  Exit Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Listings</p>
                  <p className="text-2xl font-bold">{stats.totalListings.toLocaleString()}</p>
                </div>
                <FileText className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold">{stats.activeListings.toLocaleString()}</p>
                </div>
                <Activity className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Premium Users</p>
                  <p className="text-2xl font-bold">{stats.premiumUsers}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                  <p className="text-2xl font-bold text-red-600">{stats.pendingReports}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts, verification, and premium status</CardDescription>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Listings</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-xs text-gray-600">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-500">ID: {user.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{user.phone}</p>
                            {user.email && (
                              <p className="text-xs text-gray-500">{user.email}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {user.isVerified && (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            {user.isPremium && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                Premium
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{user.listingsCount}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {!user.isVerified && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUserAction(user.id, 'verify')}
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant={user.isPremium ? "outline" : "default"}
                              onClick={() => handleUserAction(user.id, 'premium')}
                            >
                              {user.isPremium ? "Remove" : "Add"} Premium
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleUserAction(user.id, 'ban')}
                            >
                              <Ban className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Listing Management</CardTitle>
                <CardDescription>Manage marketplace listings, featured items, and content moderation</CardDescription>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search listings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Listing</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredListings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{listing.title}</p>
                            <p className="text-xs text-gray-500">ID: {listing.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-green-600">₹{listing.price}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800">
                            {listing.category.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{listing.user.name}</span>
                            {listing.user.isVerified && (
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3 text-gray-500" />
                            <span className="text-sm">{listing.views}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {listing.isAvailable && (
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                            )}
                            {listing.isFeatured && (
                              <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                            )}
                            {listing.reportsCount > 0 && (
                              <Badge className="bg-red-100 text-red-800">
                                {listing.reportsCount} Reports
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant={listing.isFeatured ? "outline" : "default"}
                              onClick={() => handleListingAction(listing.id, 'feature')}
                            >
                              {listing.isFeatured ? "Unfeature" : "Feature"}
                            </Button>
                            {listing.isAvailable ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleListingAction(listing.id, 'remove')}
                              >
                                <XCircle className="w-3 h-3" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleListingAction(listing.id, 'approve')}
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Management</CardTitle>
                <CardDescription>Review and handle user reports and content violations</CardDescription>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="dismissed">Dismissed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Reported</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <Badge className={
                            report.type === 'SPAM' ? 'bg-orange-100 text-orange-800' :
                            report.type === 'INAPPROPRIATE_CONTENT' ? 'bg-red-100 text-red-800' :
                            report.type === 'FRAUD' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {report.type.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm max-w-xs truncate">{report.description}</p>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{report.reporter.name}</span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{report.reported.name}</p>
                            <p className="text-xs text-gray-500">{report.reported.type}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            report.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' :
                            report.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {report.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {report.status === 'PENDING' || report.status === 'UNDER_REVIEW' ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleReportAction(report.id, 'resolve')}
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReportAction(report.id, 'dismiss')}
                                >
                                  <XCircle className="w-3 h-3" />
                                </Button>
                              </>
                            ) : (
                              <span className="text-xs text-gray-500">
                                {report.status === 'RESOLVED' ? 'Resolved' : 'Dismissed'}
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Platform Settings
                  </CardTitle>
                  <CardDescription>Configure platform-wide settings and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Listing Fee (₹)</label>
                    <Input type="number" defaultValue="5" min="0" max="100" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">WhatsApp Lead Fee (₹)</label>
                    <Input type="number" defaultValue="2" min="0" max="50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Premium Subscription (₹/month)</label>
                    <Input type="number" defaultValue="49" min="0" max="1000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">High-Value Commission (%)</label>
                    <Input type="number" defaultValue="5" min="0" max="20" step="0.5" />
                  </div>
                  <Button>Save Settings</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Manage security and moderation settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Auto-verification threshold</label>
                    <Input type="number" defaultValue="3" min="1" max="10" />
                    <p className="text-xs text-gray-500">Number of successful transactions before auto-verification</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Report action threshold</label>
                    <Input type="number" defaultValue="3" min="1" max="10" />
                    <p className="text-xs text-gray-500">Number of reports before automatic action</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Listing expiration (days)</label>
                    <Input type="number" defaultValue="30" min="1" max="365" />
                    <p className="text-xs text-gray-500">Days after which inactive listings are archived</p>
                  </div>
                  <Button>Update Security</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}