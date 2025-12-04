'use client'

import { useState, useEffect } from 'react'
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Bike, Utensils, Home, FileText, Star, Zap, Shield, Users, LogOut, Crown, Building2, Calendar, ShoppingBag, Wallet } from "lucide-react"
import AuthForm from "@/components/auth/AuthForm"
import Link from "next/link"

function MarketplaceContent() {
  const { user, logout } = useAuth()

  const categoryGroups = [
    {
      title: "Notes Marketplace",
      description: "Academic notes and study materials",
      icon: FileText,
      color: "bg-blue-100 text-blue-700",
      categories: [
        { name: "Handwritten Notes", description: "Student handwritten notes from lectures" },
        { name: "PDF Notes", description: "Digital PDF notes and study materials" },
        { name: "Semester Toppers' Notes", description: "Notes from top performing students" },
        { name: "Lab Experiment Observations", description: "Lab records and experiment observations" },
        { name: "Assignment Templates", description: "Templates and formats for assignments" },
        { name: "Previous Year Question Banks", description: "Collection of previous exam papers" },
        { name: "Mind Maps & Cheat Sheets", description: "Visual learning aids and quick references" },
        { name: "Practical Viva Prep Guides", description: "Guides for practical exams and viva voce" }
      ]
    },
    {
      title: "Used Books",
      description: "Textbooks and academic materials",
      icon: BookOpen,
      color: "bg-green-100 text-green-700",
      categories: [
        { name: "Textbooks", description: "Course textbooks and reference materials" },
        { name: "Competitive Exam Books", description: "Books for competitive exams and entrance tests" },
        { name: "Lab Manuals", description: "Laboratory manuals and practical guides" },
        { name: "International Edition Books", description: "International edition textbooks" },
        { name: "Language Learning Books", description: "Books for learning new languages" },
        { name: "Rare/Out-of-Print Academic Books", description: "Hard to find academic books" }
      ]
    },
    {
      title: "Cycles / Bikes / Scooters",
      description: "Transportation and mobility solutions",
      icon: Bike,
      color: "bg-purple-100 text-purple-700",
      categories: [
        { name: "Normal Bicycles", description: "Standard bicycles for campus commute" },
        { name: "Gear Cycles", description: "Multi-speed gear bicycles" },
        { name: "Electric Cycles", description: "Electric bicycles and e-bikes" },
        { name: "Scooters & Two-wheelers", description: "Motorized scooters and two-wheelers" },
        { name: "Repair Services Listing", description: "Bike repair and maintenance services" },
        { name: "Cycle Accessory Marketplace", description: "Bike accessories and parts" }
      ]
    },
    {
      title: "Mess / Canteen Food Tokens",
      description: "Food and meal exchanges",
      icon: Utensils,
      color: "bg-orange-100 text-orange-700",
      categories: [
        { name: "Daily Mess Tokens", description: "Regular mess meal tokens" },
        { name: "Extra Meal Tokens", description: "Additional meal tokens for special occasions" },
        { name: "Breakfast/Lunch/Dinner Swaps", description: "Exchange meal tokens for different times" },
        { name: "Canteen Coupon Exchange", description: "Canteen coupons and vouchers" },
        { name: "Special Event Food Tickets", description: "Food tickets for college events" }
      ]
    },
    {
      title: "Room Rentals + Shared Spaces",
      description: "Accommodation and living spaces",
      icon: Home,
      color: "bg-pink-100 text-pink-700",
      categories: [
        { name: "PG Rooms", description: "Paying guest accommodations" },
        { name: "Flats/Apartments", description: "Apartments and flat rentals" },
        { name: "Temporary Stay (1-7 days)", description: "Short-term accommodation" },
        { name: "Hostel Room Swaps", description: "Exchange hostel rooms with other students" },
        { name: "Roommate Finder", description: "Find roommates for shared accommodations" },
        { name: "Guest Stay for Parents", description: "Accommodation for visiting parents" },
        { name: "College Fest Accommodation", description: "Accommodation during college festivals" }
      ]
    },
    {
      title: "Academic Tools",
      description: "Equipment and tools for studies",
      icon: Star,
      color: "bg-yellow-100 text-yellow-700",
      categories: [
        { name: "Engineering Drawing Kits", description: "Drawing instruments and kits" },
        { name: "Lab Toolkits", description: "Laboratory equipment and tools" },
        { name: "Sports Kits", description: "Sports equipment and gear" },
        { name: "Calculator Rental", description: "Scientific and graphing calculators" },
        { name: "DSLR Cameras for Project Shoots", description: "Camera rental for projects and events" }
      ]
    },
    {
      title: "Services Marketplace",
      description: "Student services and skills",
      icon: Zap,
      color: "bg-indigo-100 text-indigo-700",
      categories: [
        { name: "Assignments Typing", description: "Typing and formatting services for assignments" },
        { name: "Tutoring", description: "Private tutoring and academic help" },
        { name: "Graphic Design", description: "Graphic design services for projects" },
        { name: "Video Editing", description: "Video editing and production services" },
        { name: "Resume Building", description: "Professional resume writing services" },
        { name: "Event Photography", description: "Photography services for events" },
        { name: "Notes Summarization", description: "Summarizing lengthy notes and materials" },
        { name: "Coding/Debugging Help", description: "Programming assistance and debugging" }
      ]
    },
    {
      title: "Event Tickets",
      description: "College event tickets and passes",
      icon: Shield,
      color: "bg-red-100 text-red-700",
      categories: [
        { name: "Tech Fest Passes", description: "Technology festival tickets and passes" },
        { name: "Cultural Fest Passes", description: "Cultural festival tickets" },
        { name: "Sponsored Events", description: "Sponsored event tickets" },
        { name: "After-party Tickets", description: "Party and social event tickets" },
        { name: "Workshop/Certificate Events", description: "Workshop and certification event tickets" }
      ]
    },
    {
      title: "Project Materials",
      description: "Materials for projects and innovation",
      icon: Users,
      color: "bg-teal-100 text-teal-700",
      categories: [
        { name: "Electronic Components", description: "Electronic parts and components" },
        { name: "Arduino/ESP Boards", description: "Microcontroller boards and kits" },
        { name: "3D Printer Time Sharing", description: "3D printing time and services" },
        { name: "Robotics Parts", description: "Robotics components and parts" },
        { name: "Data Sets", description: "Datasets for research and projects" },
        { name: "Code Snippets", description: "Reusable code and algorithms" }
      ]
    },
    {
      title: "Internship & Campus Gigs",
      description: "Work opportunities for students",
      icon: Star,
      color: "bg-cyan-100 text-cyan-700",
      categories: [
        { name: "Part-time Gigs", description: "Part-time job opportunities" },
        { name: "Internships", description: "Internship opportunities for students" },
        { name: "Paid Campus Work", description: "On-campus job opportunities" },
        { name: "Micro Tasks for Seniors", description: "Small tasks and errands for senior students" }
      ]
    },
    {
      title: "Campus Club Marketplace",
      description: "Club-related items and services",
      icon: Shield,
      color: "bg-violet-100 text-violet-700",
      categories: [
        { name: "Club Merchandise", description: "Merchandise from campus clubs" },
        { name: "Event Kits", description: "Kits for club events and activities" },
        { name: "Registration Fees", description: "Club membership and event registration" },
        { name: "Workshop Materials", description: "Materials for club workshops" }
      ]
    },
    {
      title: "Science / Lab Material Exchange",
      description: "Laboratory and science equipment",
      icon: Zap,
      color: "bg-emerald-100 text-emerald-700",
      categories: [
        { name: "Lab Coats", description: "Laboratory coats and aprons" },
        { name: "Goggles", description: "Safety goggles and eye protection" },
        { name: "Gloves", description: "Laboratory gloves and safety equipment" },
        { name: "Experiment Kits", description: "Complete experiment kits and setups" }
      ]
    },
    {
      title: "Creative Exchange",
      description: "Art and creative items",
      icon: Users,
      color: "bg-rose-100 text-rose-700",
      categories: [
        { name: "Handmade Crafts", description: "Handmade crafts and artwork" },
        { name: "Art Supplies", description: "Art materials and supplies" },
        { name: "Paintings", description: "Original paintings and artwork" },
        { name: "DIY Kits", description: "Do-it-yourself craft kits" }
      ]
    },
    {
      title: "Career & Skills",
      description: "Career development resources",
      icon: Star,
      color: "bg-amber-100 text-amber-700",
      categories: [
        { name: "Used Interview Preparation Books", description: "Books for interview preparation" },
        { name: "Mock Interview Services", description: "Mock interview practice sessions" },
        { name: "Resume Templates", description: "Professional resume templates" },
        { name: "Skill Course Subscriptions Resell", description: "Resell skill development course subscriptions" }
      ]
    },
    {
      title: "Document & Admin Support",
      description: "Document and administrative services",
      icon: Shield,
      color: "bg-lime-100 text-lime-700",
      categories: [
        { name: "Printouts", description: "Printing and document services" },
        { name: "Xerox", description: "Photocopying and duplication services" },
        { name: "Lamination", description: "Document lamination services" },
        { name: "ID Card Holders", description: "ID card holders and accessories" },
        { name: "Stationery Bundles", description: "Stationery sets and bundles" }
      ]
    },
    {
      title: "Music & Performance",
      description: "Musical instruments and equipment",
      icon: Zap,
      color: "bg-fuchsia-100 text-fuchsia-700",
      categories: [
        { name: "Guitars", description: "Acoustic and electric guitars" },
        { name: "Keyboards", description: "Musical keyboards and pianos" },
        { name: "Microphones", description: "Microphones and audio equipment" },
        { name: "DJ Equipment Rentals", description: "DJ equipment and sound systems" }
      ]
    },
    {
      title: "Student Startups Section",
      description: "Entrepreneurship and student businesses",
      icon: Users,
      color: "bg-sky-100 text-sky-700",
      categories: [
        { name: "Sell Products Made by Students", description: "Products created by student entrepreneurs" },
        { name: "Promote Campus Entrepreneurs", description: "Promotion services for student startups" },
        { name: "Small D2C Brands", description: "Direct-to-consumer brands by students" }
      ]
    }
  ]

  const features = [
    {
      icon: Zap,
      title: "Instant Listings",
      description: "List anything in seconds with our AI-powered flow"
    },
    {
      icon: Shield,
      title: "Safe Transactions",
      description: "Verified users, in-app chat, and secure meetups"
    },
    {
      icon: Users,
      title: "Campus-Only",
      description: "Trust your campus community more than OLX"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Campus Exchange</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Welcome, <span className="font-semibold text-gray-900">{user?.name}</span>
              {user?.isPremium && (
                <Badge className="ml-2 bg-yellow-100 text-yellow-800">Premium</Badge>
              )}
            </div>
            <Link href="/premium">
              <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-600 hover:bg-yellow-50">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade
              </Button>
            </Link>
            <Link href="/business-ads">
              <Button variant="outline" size="sm" className="text-purple-600 border-purple-600 hover:bg-purple-50">
                <Building2 className="w-4 h-4 mr-2" />
                Business Ads
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-600 hover:bg-indigo-50">
                <Calendar className="w-4 h-4 mr-2" />
                Events
              </Button>
            </Link>
            <Link href="/store">
              <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Store
              </Button>
            </Link>
            <Link href="/wallet">
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                <Wallet className="w-4 h-4 mr-2" />
                Wallet
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mb-6">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              🎓 Welcome to Your Campus Marketplace
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Start Trading Today
            <span className="block text-yellow-300">Listings from ₹10</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Buy, sell, and trade everything you need on campus. From notes to bikes, 
            food tokens to rooms - all in one trusted place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create-listing">
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-lg px-8 py-4">
                Create Listing - ₹10
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold text-lg px-8 py-4">
                Browse Listings
              </Button>
            </Link>
          </div>
          
          {/* Premium Promotion Banner */}
          <div className="mt-8 bg-yellow-400/20 backdrop-blur-sm border border-yellow-300 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3">
              <Crown className="w-6 h-6 text-yellow-600" />
              <span className="text-yellow-800 font-semibold">
                Limited Time: Get Premium for ₹99/month and save ₹50+ on fees!
              </span>
              <Link href="/premium">
                <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-black">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What You Can Exchange</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything a student needs, all in one comprehensive marketplace
            </p>
          </div>
          
          {/* Category Groups */}
          <div className="space-y-12 max-w-7xl mx-auto">
            {categoryGroups.map((group, groupIndex) => {
              const GroupIcon = group.icon
              return (
                <div key={groupIndex} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  {/* Group Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-lg ${group.color} flex items-center justify-center`}>
                      <GroupIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{group.title}</h3>
                      <p className="text-gray-600">{group.description}</p>
                    </div>
                  </div>
                  
                  {/* Subcategories Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {group.categories.map((category, categoryIndex) => (
                      <Link 
                        key={categoryIndex} 
                        href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}`}
                      >
                        <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-200 h-full">
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">{category.name}</h4>
                            <p className="text-sm text-gray-600">{category.description}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Revenue Model Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-green-100 text-green-700">
              💸 Simple & Transparent
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              No hidden fees, just simple micro-transactions that make sense
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="text-center border-2 border-green-200">
              <CardHeader>
                <div className="text-3xl font-bold text-green-600 mb-2">₹10</div>
                <CardTitle className="text-lg">Per Listing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  List anything for just ₹10. Students don't mind paying for convenience.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center border-2 border-blue-200">
              <CardHeader>
                <div className="text-3xl font-bold text-blue-600 mb-2">₹99</div>
                <CardTitle className="text-lg">Premium/Month</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Zero listing fees, early access, verified seller badge.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center border-2 border-purple-200">
              <CardHeader>
                <div className="text-3xl font-bold text-purple-600 mb-2">₹5</div>
                <CardTitle className="text-lg">Buyer Contact Unlock</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Unlock seller contact instantly for just ₹5.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center border-2 border-orange-200">
              <CardHeader>
                <div className="text-3xl font-bold text-orange-600 mb-2">2-5%</div>
                <CardTitle className="text-lg">High-Value Commission</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Small commission on bikes, electronics, and room rentals.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Students Love Us</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Built for students, by students who understand campus life
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">₹5</div>
              <div className="text-gray-600">Starting Price</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function Home() {
  const { user, loading } = useAuth()

  // Add a timeout to prevent infinite loading
  const [showContent, setShowContent] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  if (loading && !showContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm onAuthSuccess={(userData) => {
      // The AuthContext will handle the login
      window.location.reload()
    }} />
  }

  return <MarketplaceContent />
}