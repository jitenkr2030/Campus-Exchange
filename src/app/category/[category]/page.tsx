'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MapPin, Clock, Star, MessageCircle, Phone, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"
import ContactUnlockModal from "@/components/ContactUnlockModal"

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
}

const categoryInfo: { [key: string]: { title: string; description: string; icon: string; color: string } } = {
  // Notes Marketplace
  'handwritten-notes': {
    title: 'Handwritten Notes',
    description: 'Student handwritten notes from lectures and classes',
    icon: '📝',
    color: 'bg-blue-100 text-blue-700'
  },
  'pdf-notes': {
    title: 'PDF Notes',
    description: 'Digital PDF notes and study materials',
    icon: '📄',
    color: 'bg-blue-200 text-blue-800'
  },
  'semester-toppers-notes': {
    title: 'Semester Toppers\' Notes',
    description: 'Notes from top performing students',
    icon: '🏆',
    color: 'bg-yellow-100 text-yellow-700'
  },
  'lab-experiment-observations': {
    title: 'Lab Experiment Observations',
    description: 'Lab records and experiment observations',
    icon: '🧪',
    color: 'bg-green-100 text-green-700'
  },
  'assignment-templates': {
    title: 'Assignment Templates',
    description: 'Templates and formats for assignments',
    icon: '📋',
    color: 'bg-purple-100 text-purple-700'
  },
  'previous-year-question-banks': {
    title: 'Previous Year Question Banks',
    description: 'Collection of previous exam papers',
    icon: '📚',
    color: 'bg-orange-100 text-orange-700'
  },
  'mind-maps-cheat-sheets': {
    title: 'Mind Maps & Cheat Sheets',
    description: 'Visual learning aids and quick references',
    icon: '🧠',
    color: 'bg-pink-100 text-pink-700'
  },
  'practical-viva-prep-guides': {
    title: 'Practical Viva Prep Guides',
    description: 'Guides for practical exams and viva voce',
    icon: '🎓',
    color: 'bg-indigo-100 text-indigo-700'
  },

  // Used Books
  'textbooks': {
    title: 'Textbooks',
    description: 'Course textbooks and reference materials',
    icon: '📖',
    color: 'bg-green-100 text-green-700'
  },
  'competitive-exam-books': {
    title: 'Competitive Exam Books',
    description: 'Books for competitive exams and entrance tests',
    icon: '🎯',
    color: 'bg-red-100 text-red-700'
  },
  'lab-manuals': {
    title: 'Lab Manuals',
    description: 'Laboratory manuals and practical guides',
    icon: '🔧',
    color: 'bg-gray-100 text-gray-700'
  },
  'international-edition-books': {
    title: 'International Edition Books',
    description: 'International edition textbooks',
    icon: '🌍',
    color: 'bg-blue-100 text-blue-700'
  },
  'language-learning-books': {
    title: 'Language Learning Books',
    description: 'Books for learning new languages',
    icon: '🗣️',
    color: 'bg-purple-100 text-purple-700'
  },
  'rare-out-of-print-academic-books': {
    title: 'Rare/Out-of-Print Academic Books',
    description: 'Hard to find academic books',
    icon: '⭐',
    color: 'bg-yellow-100 text-yellow-700'
  },

  // Cycles / Bikes / Scooters
  'normal-bicycles': {
    title: 'Normal Bicycles',
    description: 'Standard bicycles for campus commute',
    icon: '🚲',
    color: 'bg-green-100 text-green-700'
  },
  'gear-cycles': {
    title: 'Gear Cycles',
    description: 'Multi-speed gear bicycles',
    icon: '⚙️',
    color: 'bg-blue-100 text-blue-700'
  },
  'electric-cycles': {
    title: 'Electric Cycles',
    description: 'Electric bicycles and e-bikes',
    icon: '⚡',
    color: 'bg-yellow-100 text-yellow-700'
  },
  'scooters-two-wheelers': {
    title: 'Scooters & Two-wheelers',
    description: 'Motorized scooters and two-wheelers',
    icon: '🏍️',
    color: 'bg-red-100 text-red-700'
  },
  'repair-services-listing': {
    title: 'Repair Services Listing',
    description: 'Bike repair and maintenance services',
    icon: '🔧',
    color: 'bg-orange-100 text-orange-700'
  },
  'cycle-accessory-marketplace': {
    title: 'Cycle Accessory Marketplace',
    description: 'Bike accessories and parts',
    icon: '📦',
    color: 'bg-purple-100 text-purple-700'
  },

  // Mess / Canteen Food Tokens
  'daily-mess-tokens': {
    title: 'Daily Mess Tokens',
    description: 'Regular mess meal tokens',
    icon: '🍽️',
    color: 'bg-orange-100 text-orange-700'
  },
  'extra-meal-tokens': {
    title: 'Extra Meal Tokens',
    description: 'Additional meal tokens for special occasions',
    icon: '➕',
    color: 'bg-red-100 text-red-700'
  },
  'breakfast-lunch-dinner-swaps': {
    title: 'Breakfast/Lunch/Dinner Swaps',
    description: 'Exchange meal tokens for different times',
    icon: '🔄',
    color: 'bg-green-100 text-green-700'
  },
  'canteen-coupon-exchange': {
    title: 'Canteen Coupon Exchange',
    description: 'Canteen coupons and vouchers',
    icon: '🎫',
    color: 'bg-blue-100 text-blue-700'
  },
  'special-event-food-tickets': {
    title: 'Special Event Food Tickets',
    description: 'Food tickets for college events',
    icon: '📅',
    color: 'bg-purple-100 text-purple-700'
  },

  // Room Rentals + Shared Spaces
  'pg-rooms': {
    title: 'PG Rooms',
    description: 'Paying guest accommodations',
    icon: '🏠',
    color: 'bg-pink-100 text-pink-700'
  },
  'flats-apartments': {
    title: 'Flats/Apartments',
    description: 'Apartments and flat rentals',
    icon: '🏢',
    color: 'bg-blue-100 text-blue-700'
  },
  'temporary-stay-1-7-days': {
    title: 'Temporary Stay (1-7 days)',
    description: 'Short-term accommodation',
    icon: '🕒',
    color: 'bg-yellow-100 text-yellow-700'
  },
  'hostel-room-swaps': {
    title: 'Hostel Room Swaps',
    description: 'Exchange hostel rooms with other students',
    icon: '🔄',
    color: 'bg-green-100 text-green-700'
  },
  'roommate-finder': {
    title: 'Roommate Finder',
    description: 'Find roommates for shared accommodations',
    icon: '👥',
    color: 'bg-purple-100 text-purple-700'
  },
  'guest-stay-for-parents': {
    title: 'Guest Stay for Parents',
    description: 'Accommodation for visiting parents',
    icon: '👨‍👩‍👧‍👦',
    color: 'bg-orange-100 text-orange-700'
  },
  'college-fest-accommodation': {
    title: 'College Fest Accommodation',
    description: 'Accommodation during college festivals',
    icon: '🎪',
    color: 'bg-red-100 text-red-700'
  },

  // Academic Tools
  'engineering-drawing-kits': {
    title: 'Engineering Drawing Kits',
    description: 'Drawing instruments and kits',
    icon: '📐',
    color: 'bg-gray-100 text-gray-700'
  },
  'lab-toolkits': {
    title: 'Lab Toolkits',
    description: 'Laboratory equipment and tools',
    icon: '🔧',
    color: 'bg-brown-100 text-brown-700'
  },
  'sports-kits': {
    title: 'Sports Kits',
    description: 'Sports equipment and gear',
    icon: '⚽',
    color: 'bg-green-100 text-green-700'
  },
  'calculator-rental': {
    title: 'Calculator Rental',
    description: 'Scientific and graphing calculators',
    icon: '🔢',
    color: 'bg-blue-100 text-blue-700'
  },
  'dslr-cameras-for-project-shoots': {
    title: 'DSLR Cameras for Project Shoots',
    description: 'Camera rental for projects and events',
    icon: '📷',
    color: 'bg-purple-100 text-purple-700'
  },

  // Services Marketplace
  'assignments-typing': {
    title: 'Assignments Typing',
    description: 'Typing and formatting services for assignments',
    icon: '⌨️',
    color: 'bg-blue-100 text-blue-700'
  },
  'tutoring': {
    title: 'Tutoring',
    description: 'Private tutoring and academic help',
    icon: '🎓',
    color: 'bg-green-100 text-green-700'
  },
  'graphic-design': {
    title: 'Graphic Design',
    description: 'Graphic design services for projects',
    icon: '🎨',
    color: 'bg-purple-100 text-purple-700'
  },
  'video-editing': {
    title: 'Video Editing',
    description: 'Video editing and production services',
    icon: '🎬',
    color: 'bg-red-100 text-red-700'
  },
  'resume-building': {
    title: 'Resume Building',
    description: 'Professional resume writing services',
    icon: '📄',
    color: 'bg-orange-100 text-orange-700'
  },
  'event-photography': {
    title: 'Event Photography',
    description: 'Photography services for events',
    icon: '📷',
    color: 'bg-yellow-100 text-yellow-700'
  },
  'notes-summarization': {
    title: 'Notes Summarization',
    description: 'Summarizing lengthy notes and materials',
    icon: '📝',
    color: 'bg-indigo-100 text-indigo-700'
  },
  'coding-debugging-help': {
    title: 'Coding/Debugging Help',
    description: 'Programming assistance and debugging',
    icon: '💻',
    color: 'bg-gray-100 text-gray-700'
  },

  // Event Tickets
  'tech-fest-passes': {
    title: 'Tech Fest Passes',
    description: 'Technology festival tickets and passes',
    icon: '💻',
    color: 'bg-blue-100 text-blue-700'
  },
  'cultural-fest-passes': {
    title: 'Cultural Fest Passes',
    description: 'Cultural festival tickets',
    icon: '🎵',
    color: 'bg-purple-100 text-purple-700'
  },
  'sponsored-events': {
    title: 'Sponsored Events',
    description: 'Sponsored event tickets',
    icon: '⭐',
    color: 'bg-yellow-100 text-yellow-700'
  },
  'after-party-tickets': {
    title: 'After-party Tickets',
    description: 'Party and social event tickets',
    icon: '🎉',
    color: 'bg-pink-100 text-pink-700'
  },
  'workshop-certificate-events': {
    title: 'Workshop/Certificate Events',
    description: 'Workshop and certification event tickets',
    icon: '📜',
    color: 'bg-green-100 text-green-700'
  },

  // Project Materials
  'electronic-components': {
    title: 'Electronic Components',
    description: 'Electronic parts and components',
    icon: '🔌',
    color: 'bg-green-100 text-green-700'
  },
  'arduino-esp-boards': {
    title: 'Arduino/ESP Boards',
    description: 'Microcontroller boards and kits',
    icon: '🔬',
    color: 'bg-blue-100 text-blue-700'
  },
  '3d-printer-time-sharing': {
    title: '3D Printer Time Sharing',
    description: '3D printing time and services',
    icon: '📦',
    color: 'bg-purple-100 text-purple-700'
  },
  'robotics-parts': {
    title: 'Robotics Parts',
    description: 'Robotics components and parts',
    icon: '🤖',
    color: 'bg-red-100 text-red-700'
  },
  'data-sets': {
    title: 'Data Sets',
    description: 'Datasets for research and projects',
    icon: '💾',
    color: 'bg-orange-100 text-orange-700'
  },
  'code-snippets': {
    title: 'Code Snippets',
    description: 'Reusable code and algorithms',
    icon: '💻',
    color: 'bg-gray-100 text-gray-700'
  },

  // Internship & Campus Gigs
  'part-time-gigs': {
    title: 'Part-time Gigs',
    description: 'Part-time job opportunities',
    icon: '💼',
    color: 'bg-blue-100 text-blue-700'
  },
  'internships': {
    title: 'Internships',
    description: 'Internship opportunities for students',
    icon: '👤',
    color: 'bg-green-100 text-green-700'
  },
  'paid-campus-work': {
    title: 'Paid Campus Work',
    description: 'On-campus job opportunities',
    icon: '🏢',
    color: 'bg-purple-100 text-purple-700'
  },
  'micro-tasks-for-seniors': {
    title: 'Micro Tasks for Seniors',
    description: 'Small tasks and errands for senior students',
    icon: '✅',
    color: 'bg-orange-100 text-orange-700'
  },

  // Campus Club Marketplace
  'club-merchandise': {
    title: 'Club Merchandise',
    description: 'Merchandise from campus clubs',
    icon: '👕',
    color: 'bg-red-100 text-red-700'
  },
  'event-kits': {
    title: 'Event Kits',
    description: 'Kits for club events and activities',
    icon: '📦',
    color: 'bg-blue-100 text-blue-700'
  },
  'registration-fees': {
    title: 'Registration Fees',
    description: 'Club membership and event registration',
    icon: '💳',
    color: 'bg-green-100 text-green-700'
  },
  'workshop-materials': {
    title: 'Workshop Materials',
    description: 'Materials for club workshops',
    icon: '🔧',
    color: 'bg-purple-100 text-purple-700'
  },

  // Science / Lab Material Exchange
  'lab-coats': {
    title: 'Lab Coats',
    description: 'Laboratory coats and aprons',
    icon: '👤',
    color: 'bg-white-100 text-white-700 border'
  },
  'goggles': {
    title: 'Goggles',
    description: 'Safety goggles and eye protection',
    icon: '👓',
    color: 'bg-blue-100 text-blue-700'
  },
  'gloves': {
    title: 'Gloves',
    description: 'Laboratory gloves and safety equipment',
    icon: '🧤',
    color: 'bg-green-100 text-green-700'
  },
  'experiment-kits': {
    title: 'Experiment Kits',
    description: 'Complete experiment kits and setups',
    icon: '🧪',
    color: 'bg-purple-100 text-purple-700'
  },

  // Creative Exchange
  'handmade-crafts': {
    title: 'Handmade Crafts',
    description: 'Handmade crafts and artwork',
    icon: '🎨',
    color: 'bg-pink-100 text-pink-700'
  },
  'art-supplies': {
    title: 'Art Supplies',
    description: 'Art materials and supplies',
    icon: '🎨',
    color: 'bg-orange-100 text-orange-700'
  },
  'paintings': {
    title: 'Paintings',
    description: 'Original paintings and artwork',
    icon: '🖼️',
    color: 'bg-red-100 text-red-700'
  },
  'diy-kits': {
    title: 'DIY Kits',
    description: 'Do-it-yourself craft kits',
    icon: '📦',
    color: 'bg-blue-100 text-blue-700'
  },

  // Career & Skills
  'used-interview-preparation-books': {
    title: 'Used Interview Preparation Books',
    description: 'Books for interview preparation',
    icon: '📚',
    color: 'bg-green-100 text-green-700'
  },
  'mock-interview-services': {
    title: 'Mock Interview Services',
    description: 'Mock interview practice sessions',
    icon: '👤',
    color: 'bg-blue-100 text-blue-700'
  },
  'resume-templates': {
    title: 'Resume Templates',
    description: 'Professional resume templates',
    icon: '📄',
    color: 'bg-purple-100 text-purple-700'
  },
  'skill-course-subscriptions-resell': {
    title: 'Skill Course Subscriptions Resell',
    description: 'Resell skill development course subscriptions',
    icon: '🎓',
    color: 'bg-orange-100 text-orange-700'
  },

  // Document & Admin Support
  'printouts': {
    title: 'Printouts',
    description: 'Printing and document services',
    icon: '🖨️',
    color: 'bg-gray-100 text-gray-700'
  },
  'xerox': {
    title: 'Xerox',
    description: 'Photocopying and duplication services',
    icon: '📄',
    color: 'bg-blue-100 text-blue-700'
  },
  'lamination': {
    title: 'Lamination',
    description: 'Document lamination services',
    icon: '📋',
    color: 'bg-green-100 text-green-700'
  },
  'id-card-holders': {
    title: 'ID Card Holders',
    description: 'ID card holders and accessories',
    icon: '🆔',
    color: 'bg-purple-100 text-purple-700'
  },
  'stationery-bundles': {
    title: 'Stationery Bundles',
    description: 'Stationery sets and bundles',
    icon: '📦',
    color: 'bg-orange-100 text-orange-700'
  },

  // Music & Performance
  'guitars': {
    title: 'Guitars',
    description: 'Acoustic and electric guitars',
    icon: '🎸',
    color: 'bg-brown-100 text-brown-700'
  },
  'keyboards': {
    title: 'Keyboards',
    description: 'Musical keyboards and pianos',
    icon: '🎹',
    color: 'bg-black-100 text-black-700 border'
  },
  'microphones': {
    title: 'Microphones',
    description: 'Microphones and audio equipment',
    icon: '🎤',
    color: 'bg-gray-100 text-gray-700'
  },
  'dj-equipment-rentals': {
    title: 'DJ Equipment Rentals',
    description: 'DJ equipment and sound systems',
    icon: '🎧',
    color: 'bg-purple-100 text-purple-700'
  },

  // Student Startups Section
  'sell-products-made-by-students': {
    title: 'Sell Products Made by Students',
    description: 'Products created by student entrepreneurs',
    icon: '🛍️',
    color: 'bg-green-100 text-green-700'
  },
  'promote-campus-entrepreneurs': {
    title: 'Promote Campus Entrepreneurs',
    description: 'Promotion services for student startups',
    icon: '📢',
    color: 'bg-blue-100 text-blue-700'
  },
  'small-d2c-brands': {
    title: 'Small D2C Brands',
    description: 'Direct-to-consumer brands by students',
    icon: '🏪',
    color: 'bg-purple-100 text-purple-700'
  }
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const categorySlug = params.category as string
  const category = categoryInfo[categorySlug]

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Category Not Found</CardTitle>
            <CardDescription>The requested category does not exist</CardDescription>
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

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Viewed' }
  ]

  const fetchListings = async () => {
    try {
      const categoryMap: { [key: string]: string } = {
        // Notes Marketplace
        'handwritten-notes': 'NOTES_HANDWRITTEN',
        'pdf-notes': 'NOTES_PDF',
        'semester-toppers-notes': 'NOTES_TOPPERS',
        'lab-experiment-observations': 'NOTES_LAB',
        'assignment-templates': 'NOTES_ASSIGNMENTS',
        'previous-year-question-banks': 'NOTES_QUESTIONS',
        'mind-maps-cheat-sheets': 'NOTES_MINDMAPS',
        'practical-viva-prep-guides': 'NOTES_VIVA',

        // Used Books
        'textbooks': 'BOOKS_TEXTBOOKS',
        'competitive-exam-books': 'BOOKS_COMPETITIVE',
        'lab-manuals': 'BOOKS_LAB',
        'international-edition-books': 'BOOKS_INTERNATIONAL',
        'language-learning-books': 'BOOKS_LANGUAGE',
        'rare-out-of-print-academic-books': 'BOOKS_RARE',

        // Cycles / Bikes / Scooters
        'normal-bicycles': 'BIKES_BICYCLES',
        'gear-cycles': 'BIKES_GEAR',
        'electric-cycles': 'BIKES_ELECTRIC',
        'scooters-two-wheelers': 'BIKES_SCOOTERS',
        'repair-services-listing': 'BIKES_REPAIR',
        'cycle-accessory-marketplace': 'BIKES_ACCESSORIES',

        // Mess / Canteen Food Tokens
        'daily-mess-tokens': 'FOOD_DAILY',
        'extra-meal-tokens': 'FOOD_EXTRA',
        'breakfast-lunch-dinner-swaps': 'FOOD_SWAPS',
        'canteen-coupon-exchange': 'FOOD_COUPONS',
        'special-event-food-tickets': 'FOOD_EVENTS',

        // Room Rentals + Shared Spaces
        'pg-rooms': 'ROOMS_PG',
        'flats-apartments': 'ROOMS_FLATS',
        'temporary-stay-1-7-days': 'ROOMS_TEMPORARY',
        'hostel-room-swaps': 'ROOMS_HOSTEL',
        'roommate-finder': 'ROOMS_ROOMMATE',
        'guest-stay-for-parents': 'ROOMS_GUEST',
        'college-fest-accommodation': 'ROOMS_FEST',

        // Academic Tools
        'engineering-drawing-kits': 'TOOLS_DRAWING',
        'lab-toolkits': 'TOOLS_LAB',
        'sports-kits': 'TOOLS_SPORTS',
        'calculator-rental': 'TOOLS_CALCULATOR',
        'dslr-cameras-for-project-shoots': 'TOOLS_CAMERA',

        // Services Marketplace
        'assignments-typing': 'SERVICES_ASSIGNMENTS',
        'tutoring': 'SERVICES_TUTORING',
        'graphic-design': 'SERVICES_DESIGN',
        'video-editing': 'SERVICES_VIDEO',
        'resume-building': 'SERVICES_RESUME',
        'event-photography': 'SERVICES_PHOTOGRAPHY',
        'notes-summarization': 'SERVICES_SUMMARIZATION',
        'coding-debugging-help': 'SERVICES_CODING',

        // Event Tickets
        'tech-fest-passes': 'EVENTS_TECH',
        'cultural-fest-passes': 'EVENTS_CULTURAL',
        'sponsored-events': 'EVENTS_SPONSORED',
        'after-party-tickets': 'EVENTS_PARTY',
        'workshop-certificate-events': 'EVENTS_WORKSHOP',

        // Project Materials
        'electronic-components': 'PROJECTS_ELECTRONICS',
        'arduino-esp-boards': 'PROJECTS_ARDUINO',
        '3d-printer-time-sharing': 'PROJECTS_3DPRINT',
        'robotics-parts': 'PROJECTS_ROBOTICS',
        'data-sets': 'PROJECTS_DATASETS',
        'code-snippets': 'PROJECTS_CODE',

        // Internship & Campus Gigs
        'part-time-gigs': 'GIGS_PARTTIME',
        'internships': 'GIGS_INTERNSHIPS',
        'paid-campus-work': 'GIGS_CAMPUS',
        'micro-tasks-for-seniors': 'GIGS_MICRO',

        // Campus Club Marketplace
        'club-merchandise': 'CLUBS_MERCH',
        'event-kits': 'CLUBS_KITS',
        'registration-fees': 'CLUBS_REGISTRATION',
        'workshop-materials': 'CLUBS_WORKSHOP',

        // Science / Lab Material Exchange
        'lab-coats': 'LAB_COATS',
        'goggles': 'LAB_GOGGLES',
        'gloves': 'LAB_GLOVES',
        'experiment-kits': 'LAB_EXPERIMENTS',

        // Creative Exchange
        'handmade-crafts': 'CREATIVE_CRAFTS',
        'art-supplies': 'CREATIVE_ART',
        'paintings': 'CREATIVE_PAINTINGS',
        'diy-kits': 'CREATIVE_DIY',

        // Career & Skills
        'used-interview-preparation-books': 'CAREER_BOOKS',
        'mock-interview-services': 'CAREER_INTERVIEW',
        'resume-templates': 'CAREER_RESUME',
        'skill-course-subscriptions-resell': 'CAREER_SKILLS',

        // Document & Admin Support
        'printouts': 'DOCS_PRINTOUTS',
        'xerox': 'DOCS_XEROX',
        'lamination': 'DOCS_LAMINATION',
        'id-card-holders': 'DOCS_ID',
        'stationery-bundles': 'DOCS_STATIONERY',

        // Music & Performance
        'guitars': 'MUSIC_GUITARS',
        'keyboards': 'MUSIC_KEYBOARDS',
        'microphones': 'MUSIC_MICROPHONES',
        'dj-equipment-rentals': 'MUSIC_DJ',

        // Student Startups Section
        'sell-products-made-by-students': 'STARTUPS_PRODUCTS',
        'promote-campus-entrepreneurs': 'STARTUPS_PROMOTE',
        'small-d2c-brands': 'STARTUPS_D2C'
      }

      const response = await fetch(`/api/listings?category=${categoryMap[categorySlug]}`)
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchListings()
  }, [categorySlug])

  const filteredListings = listings
    .filter(listing => {
      return listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             listing.description?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getCategorySpecificFields = () => {
    switch (categorySlug) {
      // Notes Marketplace
      case 'handwritten-notes':
      case 'pdf-notes':
      case 'semester-toppers-notes':
      case 'lab-experiment-observations':
      case 'assignment-templates':
      case 'previous-year-question-banks':
      case 'mind-maps-cheat-sheets':
      case 'practical-viva-prep-guides':
        return [
          { label: 'Subject', options: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Other'] },
          { label: 'Year/Semester', options: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'All Semesters'] },
          { label: 'Type', options: ['Handwritten Notes', 'PDF Notes', 'Previous Year Papers', 'Cheat Sheets', 'Solutions', 'Mind Maps'] }
        ]

      // Used Books
      case 'textbooks':
      case 'competitive-exam-books':
      case 'lab-manuals':
      case 'international-edition-books':
      case 'language-learning-books':
      case 'rare-out-of-print-academic-books':
        return [
          { label: 'Book Type', options: ['Textbook', 'Reference Book', 'Competitive Exam', 'Lab Manual', 'Novel', 'Other'] },
          { label: 'Condition', options: ['New', 'Like New', 'Good', 'Fair', 'Poor'] },
          { label: 'Subject', options: ['Engineering', 'Medical', 'Management', 'Arts', 'Science', 'Commerce', 'Other'] }
        ]

      // Cycles / Bikes / Scooters
      case 'normal-bicycles':
      case 'gear-cycles':
      case 'electric-cycles':
      case 'scooters-two-wheelers':
        return [
          { label: 'Vehicle Type', options: ['Bicycle', 'Electric Scooter', 'Motorcycle', 'Scooter'] },
          { label: 'Condition', options: ['New', 'Like New', 'Good', 'Fair', 'Needs Repair'] },
          { label: 'Brand', options: ['Hero', 'Honda', 'TVS', 'Bajaj', 'Atlas', 'Other'] }
        ]
      case 'repair-services-listing':
        return [
          { label: 'Service Type', options: ['General Repair', 'Puncture Repair', 'Engine Service', 'Body Work', 'Maintenance'] },
          { label: 'Vehicle Type', options: ['Bicycle', 'Electric Scooter', 'Motorcycle', 'Scooter', 'All Types'] }
        ]
      case 'cycle-accessory-marketplace':
        return [
          { label: 'Accessory Type', options: ['Helmet', 'Lock', 'Lights', 'Bell', 'Mudguard', 'Carrier', 'Other'] },
          { label: 'Condition', options: ['New', 'Like New', 'Good', 'Fair'] }
        ]

      // Mess / Canteen Food Tokens
      case 'daily-mess-tokens':
      case 'extra-meal-tokens':
      case 'breakfast-lunch-dinner-swaps':
      case 'canteen-coupon-exchange':
      case 'special-event-food-tickets':
        return [
          { label: 'Token Type', options: ['Mess Token', 'Canteen Token', 'Meal Coupon', 'Food Credit'] },
          { label: 'Valid Until', options: ['Today', 'This Week', 'This Month', 'This Semester'] },
          { label: 'Meal Type', options: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'All Meals'] }
        ]

      // Room Rentals + Shared Spaces
      case 'pg-rooms':
      case 'flats-apartments':
      case 'temporary-stay-1-7-days':
      case 'hostel-room-swaps':
      case 'guest-stay-for-parents':
      case 'college-fest-accommodation':
        return [
          { label: 'Room Type', options: ['Single Room', 'Shared Room', 'PG', 'Apartment', 'Hostel'] },
          { label: 'Duration', options: ['1 Month', '3 Months', '6 Months', '1 Year', 'Flexible'] },
          { label: 'Furnishing', options: ['Fully Furnished', 'Semi Furnished', 'Unfurnished'] }
        ]
      case 'roommate-finder':
        return [
          { label: 'Room Type', options: ['Single Room', 'Shared Room', 'Apartment', 'PG'] },
          { label: 'Gender Preference', options: ['Male', 'Female', 'Any'] },
          { label: 'Budget Range', options: ['Under ₹5000', '₹5000-₹10000', '₹10000-₹15000', 'Above ₹15000'] }
        ]

      // Academic Tools
      case 'engineering-drawing-kits':
        return [
          { label: 'Kit Type', options: ['Basic Drawing Kit', 'Advanced Drawing Kit', 'Professional Kit'] },
          { label: 'Condition', options: ['New', 'Like New', 'Good', 'Fair'] }
        ]
      case 'lab-toolkits':
        return [
          { label: 'Lab Type', options: ['Physics Lab', 'Chemistry Lab', 'Electronics Lab', 'Computer Lab', 'Other'] },
          { label: 'Kit Contents', options: ['Basic Tools', 'Advanced Tools', 'Complete Set'] }
        ]
      case 'sports-kits':
        return [
          { label: 'Sport Type', options: ['Cricket', 'Football', 'Basketball', 'Badminton', 'Tennis', 'Other'] },
          { label: 'Kit Type', options: ['Basic Kit', 'Professional Kit', 'Complete Set'] }
        ]
      case 'calculator-rental':
        return [
          { label: 'Calculator Type', options: ['Scientific', 'Graphing', 'Financial', 'Basic'] },
          { label: 'Brand', options: ['Casio', 'Texas Instruments', 'HP', 'Other'] }
        ]
      case 'dslr-cameras-for-project-shoots':
        return [
          { label: 'Camera Type', options: ['DSLR', 'Mirrorless', 'Point and Shoot'] },
          { label: 'Rental Duration', options: ['1 Day', '2-3 Days', '1 Week', '2 Weeks'] }
        ]

      // Services Marketplace
      case 'assignments-typing':
        return [
          { label: 'Document Type', options: ['Assignments', 'Reports', 'Thesis', 'Projects', 'Other'] },
          { label: 'Page Count', options: ['1-10 Pages', '11-20 Pages', '21-50 Pages', '50+ Pages'] }
        ]
      case 'tutoring':
        return [
          { label: 'Subject', options: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Other'] },
          { label: 'Class Level', options: ['High School', 'Undergraduate', 'Postgraduate', 'Professional'] }
        ]
      case 'graphic-design':
        return [
          { label: 'Service Type', options: ['Logo Design', 'Poster Design', 'Presentation Design', 'Other'] },
          { label: 'Delivery Time', options: ['24 Hours', '2-3 Days', '1 Week', '2 Weeks'] }
        ]
      case 'video-editing':
        return [
          { label: 'Video Type', options: ['Event Video', 'Presentation', 'Tutorial', 'Other'] },
          { label: 'Video Length', options: ['Under 5 min', '5-15 min', '15-30 min', '30+ min'] }
        ]
      case 'resume-building':
        return [
          { label: 'Experience Level', options: ['Fresher', '1-3 Years', '3-5 Years', '5+ Years'] },
          { label: 'Industry', options: ['IT', 'Engineering', 'Management', 'Other'] }
        ]
      case 'event-photography':
        return [
          { label: 'Event Type', options: ['College Events', 'Workshops', 'Fests', 'Other'] },
          { label: 'Duration', options: ['Half Day', 'Full Day', 'Multiple Days'] }
        ]
      case 'notes-summarization':
        return [
          { label: 'Content Type', options: ['Lecture Notes', 'Textbook Chapters', 'Research Papers', 'Other'] },
          { label: 'Page Count', options: ['1-10 Pages', '11-20 Pages', '21-50 Pages', '50+ Pages'] }
        ]
      case 'coding-debugging-help':
        return [
          { label: 'Programming Language', options: ['Python', 'Java', 'C++', 'JavaScript', 'Other'] },
          { label: 'Task Type', options: ['Debugging', 'Code Review', 'Implementation', 'Optimization'] }
        ]

      // Event Tickets
      case 'tech-fest-passes':
      case 'cultural-fest-passes':
      case 'sponsored-events':
      case 'after-party-tickets':
      case 'workshop-certificate-events':
        return [
          { label: 'Event Type', options: ['Tech Fest', 'Cultural Fest', 'Workshop', 'Party', 'Other'] },
          { label: 'Ticket Type', options: ['Single Day', 'Multi Day', 'VIP Pass', 'Regular Pass'] }
        ]

      // Project Materials
      case 'electronic-components':
        return [
          { label: 'Component Type', options: ['Resistors', 'Capacitors', 'ICs', 'Sensors', 'Other'] },
          { label: 'Condition', options: ['New', 'Like New', 'Good', 'Fair'] }
        ]
      case 'arduino-esp-boards':
        return [
          { label: 'Board Type', options: ['Arduino Uno', 'Arduino Nano', 'ESP32', 'ESP8266', 'Other'] },
          { label: 'Condition', options: ['New', 'Like New', 'Good', 'Needs Testing'] }
        ]
      case '3d-printer-time-sharing':
        return [
          { label: 'Print Time', options: ['1-2 Hours', '3-5 Hours', '6-10 Hours', '10+ Hours'] },
          { label: 'Material Type', options: ['PLA', 'ABS', 'PETG', 'Other'] }
        ]
      case 'robotics-parts':
        return [
          { label: 'Part Type', options: ['Motors', 'Sensors', 'Chassis', 'Controllers', 'Other'] },
          { label: 'Compatibility', options: ['Arduino', 'Raspberry Pi', 'Other'] }
        ]
      case 'data-sets':
        return [
          { label: 'Data Type', options: ['Numerical', 'Text', 'Image', 'Mixed'] },
          { label: 'Domain', options: ['Machine Learning', 'Research', 'Business', 'Other'] }
        ]
      case 'code-snippets':
        return [
          { label: 'Language', options: ['Python', 'Java', 'C++', 'JavaScript', 'Other'] },
          { label: 'Category', options: ['Algorithms', 'Data Structures', 'Utilities', 'Other'] }
        ]

      // Internship & Campus Gigs
      case 'part-time-gigs':
      case 'internships':
      case 'paid-campus-work':
      case 'micro-tasks-for-seniors':
        return [
          { label: 'Job Type', options: ['Part Time', 'Full Time', 'Internship', 'Freelance'] },
          { label: 'Field', options: ['IT', 'Marketing', 'Content Writing', 'Other'] }
        ]

      // Campus Club Marketplace
      case 'club-merchandise':
        return [
          { label: 'Merchandise Type', options: ['T-Shirts', 'Hoodies', 'Caps', 'Other'] },
          { label: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] }
        ]
      case 'event-kits':
        return [
          { label: 'Kit Type', options: ['Workshop Kit', 'Event Kit', 'Competition Kit'] },
          { label: 'Club Type', options: ['Technical', 'Cultural', 'Sports', 'Other'] }
        ]
      case 'registration-fees':
        return [
          { label: 'Registration Type', options: ['Membership', 'Event Registration', 'Workshop Fee'] },
          { label: 'Amount Range', options: ['Under ₹100', '₹100-₹500', '₹500-₹1000', 'Above ₹1000'] }
        ]
      case 'workshop-materials':
        return [
          { label: 'Material Type', options: ['Workshop Manual', 'Tool Kit', 'Reference Material'] },
          { label: 'Workshop Type', options: ['Technical', 'Creative', 'Business', 'Other'] }
        ]

      // Science / Lab Material Exchange
      case 'lab-coats':
      case 'goggles':
      case 'gloves':
        return [
          { label: 'Condition', options: ['New', 'Like New', 'Good', 'Fair'] },
          { label: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] }
        ]
      case 'experiment-kits':
        return [
          { label: 'Kit Type', options: ['Chemistry Kit', 'Physics Kit', 'Biology Kit', 'Other'] },
          { label: 'Condition', options: ['New', 'Like New', 'Good', 'Missing Parts'] }
        ]

      // Creative Exchange
      case 'handmade-crafts':
      case 'paintings':
        return [
          { label: 'Art Type', options: ['Painting', 'Craft', 'Sculpture', 'Other'] },
          { label: 'Size', options: ['Small', 'Medium', 'Large'] }
        ]
      case 'art-supplies':
        return [
          { label: 'Supply Type', options: ['Paints', 'Brushes', 'Canvas', 'Other'] },
          { label: 'Condition', options: ['New', 'Like New', 'Good', 'Used'] }
        ]
      case 'diy-kits':
        return [
          { label: 'Kit Type', options: ['Art Kit', 'Craft Kit', 'Model Kit', 'Other'] },
          { label: 'Difficulty', options: ['Beginner', 'Intermediate', 'Advanced'] }
        ]

      // Career & Skills
      case 'used-interview-preparation-books':
        return [
          { label: 'Book Type', options: ['Technical Interview', 'HR Interview', 'Aptitude', 'Other'] },
          { label: 'Condition', options: ['New', 'Like New', 'Good', 'Fair'] }
        ]
      case 'mock-interview-services':
        return [
          { label: 'Interview Type', options: ['Technical', 'HR', 'Combined'] },
          { label: 'Experience Level', options: ['Fresher', '1-3 Years', '3-5 Years', '5+ Years'] }
        ]
      case 'resume-templates':
        return [
          { label: 'Template Type', options: ['Modern', 'Professional', 'Creative', 'Academic'] },
          { label: 'Field', options: ['IT', 'Engineering', 'Management', 'Other'] }
        ]
      case 'skill-course-subscriptions-resell':
        return [
          { label: 'Course Type', options: ['Technical', 'Business', 'Creative', 'Language'] },
          { label: 'Platform', options: ['Coursera', 'Udemy', 'edX', 'Other'] }
        ]

      // Document & Admin Support
      case 'printouts':
      case 'xerox':
        return [
          { label: 'Service Type', options: ['Black & White', 'Color', 'Scanning'] },
          { label: 'Page Count', options: ['1-10 Pages', '11-50 Pages', '51-100 Pages', '100+ Pages'] }
        ]
      case 'lamination':
        return [
          { label: 'Lamination Type', options: ['Glossy', 'Matte', 'Self-Adhesive'] },
          { label: 'Size', options: ['A4', 'A3', 'ID Card', 'Custom'] }
        ]
      case 'id-card-holders':
        return [
          { label: 'Holder Type', options: ['Vertical', 'Horizontal', 'Badge Reel'] },
          { label: 'Material', options: ['Plastic', 'Vinyl', 'Leather'] }
        ]
      case 'stationery-bundles':
        return [
          { label: 'Bundle Type', options: ['Basic Stationery', 'Exam Kit', 'Art Supplies', 'Other'] },
          { label: 'Items Count', options: ['5-10 Items', '11-20 Items', '20+ Items'] }
        ]

      // Music & Performance
      case 'guitars':
        return [
          { label: 'Guitar Type', options: ['Acoustic', 'Electric', 'Bass', 'Classical'] },
          { label: 'Condition', options: ['New', 'Like New', 'Good', 'Fair', 'Needs Repair'] }
        ]
      case 'keyboards':
        return [
          { label: 'Keyboard Type', options: ['Portable', 'Digital Piano', 'Synthesizer'] },
          { label: 'Condition', options: ['New', 'Like New', 'Good', 'Fair'] }
        ]
      case 'microphones':
        return [
          { label: 'Microphone Type', options: ['Dynamic', 'Condenser', 'USB', 'Lavalier'] },
          { label: 'Condition', options: ['New', 'Like New', 'Good', 'Fair'] }
        ]
      case 'dj-equipment-rentals':
        return [
          { label: 'Equipment Type', options: ['DJ Controller', 'Speakers', 'Mixer', 'Complete Set'] },
          { label: 'Rental Duration', options: ['1 Day', '2-3 Days', '1 Week', 'Custom'] }
        ]

      // Student Startups Section
      case 'sell-products-made-by-students':
        return [
          { label: 'Product Type', options: ['Handmade', 'Digital', 'Service', 'Other'] },
          { label: 'Category', options: ['Art & Craft', 'Technology', 'Food', 'Other'] }
        ]
      case 'promote-campus-entrepreneurs':
        return [
          { label: 'Service Type', options: ['Social Media Promotion', 'Website Design', 'Marketing', 'Other'] },
          { label: 'Duration', options: ['1 Week', '1 Month', '3 Months', 'Custom'] }
        ]
      case 'small-d2c-brands':
        return [
          { label: 'Product Category', options: ['Clothing', 'Accessories', 'Electronics', 'Other'] },
          { label: 'Brand Type', options: ['Sustainable', 'Tech', 'Fashion', 'Other'] }
        ]

      default:
        return []
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {category.title}...</p>
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

      {/* Category Hero Section */}
      <section className={`bg-gradient-to-r ${category.color.includes('blue') ? 'from-blue-600 to-blue-700' : 
        category.color.includes('green') ? 'from-green-600 to-green-700' :
        category.color.includes('purple') ? 'from-purple-600 to-purple-700' :
        category.color.includes('orange') ? 'from-orange-600 to-orange-700' :
        'from-pink-600 to-pink-700'} text-white py-12`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
              {category.icon}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{category.title}</h1>
              <p className="text-blue-100 text-lg">{category.description}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={`Search ${category.title.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
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

          {/* Category-specific filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {getCategorySpecificFields().map((field, fieldIndex) => (
              <div key={fieldIndex} className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{field.label}:</span>
                <Select>
                  <SelectTrigger className="w-40 h-8">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {field.options.map((option) => (
                      <SelectItem key={option} value={option.toLowerCase().replace(/\s+/g, '-')}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{category.title}</h2>
          <p className="text-gray-600">
            {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'} found
          </p>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge className={`${category.color} border-0`}>
                    <span className="mr-1">{category.icon}</span>
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
                  <ContactUnlockModal listing={listing}>
                    <Button size="sm" className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Contact Seller
                    </Button>
                  </ContactUnlockModal>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">{category.icon}</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">No {category.title.toLowerCase()} found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : `Be the first to list ${category.title.toLowerCase()}!`
              }
            </p>
            {!searchTerm && (
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