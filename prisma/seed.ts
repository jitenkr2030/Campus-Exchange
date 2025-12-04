import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding categories...')

  // Clear existing categories
  await prisma.category.deleteMany()

  // Expanded categories with all the new ones requested
  const categories = [
    // Notes Marketplace (Expanded)
    {
      id: 'notes-handwritten',
      name: 'Handwritten Notes',
      description: 'Student handwritten notes from lectures and classes',
      icon: 'FileText',
      color: 'bg-blue-100 text-blue-700',
      isActive: true
    },
    {
      id: 'notes-pdf',
      name: 'PDF Notes',
      description: 'Digital PDF notes and study materials',
      icon: 'File',
      color: 'bg-blue-200 text-blue-800',
      isActive: true
    },
    {
      id: 'notes-semester-toppers',
      name: 'Semester Toppers\' Notes',
      description: 'Notes from top performing students',
      icon: 'Trophy',
      color: 'bg-yellow-100 text-yellow-700',
      isActive: true
    },
    {
      id: 'notes-lab-observations',
      name: 'Lab Experiment Observations',
      description: 'Lab records and experiment observations',
      icon: 'Flask',
      color: 'bg-green-100 text-green-700',
      isActive: true
    },
    {
      id: 'notes-assignment-templates',
      name: 'Assignment Templates',
      description: 'Templates and formats for assignments',
      icon: 'Clipboard',
      color: 'bg-purple-100 text-purple-700',
      isActive: true
    },
    {
      id: 'notes-question-banks',
      name: 'Previous Year Question Banks',
      description: 'Collection of previous exam papers',
      icon: 'Archive',
      color: 'bg-orange-100 text-orange-700',
      isActive: true
    },
    {
      id: 'notes-mind-maps',
      name: 'Mind Maps & Cheat Sheets',
      description: 'Visual learning aids and quick references',
      icon: 'Brain',
      color: 'bg-pink-100 text-pink-700',
      isActive: true
    },
    {
      id: 'notes-viva-prep',
      name: 'Practical Viva Prep Guides',
      description: 'Guides for practical exams and viva voce',
      icon: 'GraduationCap',
      color: 'bg-indigo-100 text-indigo-700',
      isActive: true
    },

    // Used Books
    {
      id: 'books-textbooks',
      name: 'Textbooks',
      description: 'Course textbooks and reference materials',
      icon: 'BookOpen',
      color: 'bg-green-100 text-green-700',
      isActive: true
    },
    {
      id: 'books-competitive',
      name: 'Competitive Exam Books',
      description: 'Books for competitive exams and entrance tests',
      icon: 'Target',
      color: 'bg-red-100 text-red-700',
      isActive: true
    },
    {
      id: 'books-lab-manuals',
      name: 'Lab Manuals',
      description: 'Laboratory manuals and practical guides',
      icon: 'Wrench',
      color: 'bg-gray-100 text-gray-700',
      isActive: true
    },
    {
      id: 'books-international',
      name: 'International Edition Books',
      description: 'International edition textbooks',
      icon: 'Globe',
      color: 'bg-blue-100 text-blue-700',
      isActive: true
    },
    {
      id: 'books-language',
      name: 'Language Learning Books',
      description: 'Books for learning new languages',
      icon: 'Languages',
      color: 'bg-purple-100 text-purple-700',
      isActive: true
    },
    {
      id: 'books-rare',
      name: 'Rare/Out-of-Print Academic Books',
      description: 'Hard to find academic books',
      icon: 'Star',
      color: 'bg-yellow-100 text-yellow-700',
      isActive: true
    },

    // Cycles / Bikes / Scooters
    {
      id: 'bikes-bicycles',
      name: 'Normal Bicycles',
      description: 'Standard bicycles for campus commute',
      icon: 'Bike',
      color: 'bg-green-100 text-green-700',
      isActive: true
    },
    {
      id: 'bikes-gear',
      name: 'Gear Cycles',
      description: 'Multi-speed gear bicycles',
      icon: 'Settings',
      color: 'bg-blue-100 text-blue-700',
      isActive: true
    },
    {
      id: 'bikes-electric',
      name: 'Electric Cycles',
      description: 'Electric bicycles and e-bikes',
      icon: 'Zap',
      color: 'bg-yellow-100 text-yellow-700',
      isActive: true
    },
    {
      id: 'bikes-scooters',
      name: 'Scooters & Two-wheelers',
      description: 'Motorized scooters and two-wheelers',
      icon: 'Motorcycle',
      color: 'bg-red-100 text-red-700',
      isActive: true
    },
    {
      id: 'bikes-repair',
      name: 'Repair Services Listing',
      description: 'Bike repair and maintenance services',
      icon: 'Tool',
      color: 'bg-orange-100 text-orange-700',
      isActive: true
    },
    {
      id: 'bikes-accessories',
      name: 'Cycle Accessory Marketplace',
      description: 'Bike accessories and parts',
      icon: 'Package',
      color: 'bg-purple-100 text-purple-700',
      isActive: true
    },

    // Mess / Canteen Food Tokens
    {
      id: 'food-daily-mess',
      name: 'Daily Mess Tokens',
      description: 'Regular mess meal tokens',
      icon: 'Utensils',
      color: 'bg-orange-100 text-orange-700',
      isActive: true
    },
    {
      id: 'food-extra-meal',
      name: 'Extra Meal Tokens',
      description: 'Additional meal tokens for special occasions',
      icon: 'Plus',
      color: 'bg-red-100 text-red-700',
      isActive: true
    },
    {
      id: 'food-meal-swaps',
      name: 'Breakfast/Lunch/Dinner Swaps',
      description: 'Exchange meal tokens for different times',
      icon: 'RefreshCw',
      color: 'bg-green-100 text-green-700',
      isActive: true
    },
    {
      id: 'food-canteen-coupons',
      name: 'Canteen Coupon Exchange',
      description: 'Canteen coupons and vouchers',
      icon: 'Ticket',
      color: 'bg-blue-100 text-blue-700',
      isActive: true
    },
    {
      id: 'food-event-tickets',
      name: 'Special Event Food Tickets',
      description: 'Food tickets for college events',
      icon: 'Calendar',
      color: 'bg-purple-100 text-purple-700',
      isActive: true
    },

    // Room Rentals + Shared Spaces
    {
      id: 'rooms-pg',
      name: 'PG Rooms',
      description: 'Paying guest accommodations',
      icon: 'Home',
      color: 'bg-pink-100 text-pink-700',
      isActive: true
    },
    {
      id: 'rooms-flats',
      name: 'Flats/Apartments',
      description: 'Apartments and flat rentals',
      icon: 'Building',
      color: 'bg-blue-100 text-blue-700',
      isActive: true
    },
    {
      id: 'rooms-temporary',
      name: 'Temporary Stay (1-7 days)',
      description: 'Short-term accommodation',
      icon: 'Clock',
      color: 'bg-yellow-100 text-yellow-700',
      isActive: true
    },
    {
      id: 'rooms-hostel-swaps',
      name: 'Hostel Room Swaps',
      description: 'Exchange hostel rooms with other students',
      icon: 'RefreshCw',
      color: 'bg-green-100 text-green-700',
      isActive: true
    },
    {
      id: 'rooms-roommate',
      name: 'Roommate Finder',
      description: 'Find roommates for shared accommodations',
      icon: 'Users',
      color: 'bg-purple-100 text-purple-700',
      isActive: true
    },
    {
      id: 'rooms-guest-stay',
      name: 'Guest Stay for Parents',
      description: 'Accommodation for visiting parents',
      icon: 'UserCheck',
      color: 'bg-orange-100 text-orange-700',
      isActive: true
    },
    {
      id: 'rooms-fest-accommodation',
      name: 'College Fest Accommodation',
      description: 'Accommodation during college festivals',
      icon: 'CalendarDays',
      color: 'bg-red-100 text-red-700',
      isActive: true
    },

    // Academic Tools
    {
      id: 'tools-drawing',
      name: 'Engineering Drawing Kits',
      description: 'Drawing instruments and kits',
      icon: 'PencilRuler',
      color: 'bg-gray-100 text-gray-700',
      isActive: true
    },
    {
      id: 'tools-lab',
      name: 'Lab Toolkits',
      description: 'Laboratory equipment and tools',
      icon: 'Wrench',
      color: 'bg-brown-100 text-brown-700',
      isActive: true
    },
    {
      id: 'tools-sports',
      name: 'Sports Kits',
      description: 'Sports equipment and gear',
      icon: 'Ball',
      color: 'bg-green-100 text-green-700',
      isActive: true
    },
    {
      id: 'tools-calculator',
      name: 'Calculator Rental',
      description: 'Scientific and graphing calculators',
      icon: 'Calculator',
      color: 'bg-blue-100 text-blue-700',
      isActive: true
    },
    {
      id: 'tools-camera',
      name: 'DSLR Cameras for Project Shoots',
      description: 'Camera rental for projects and events',
      icon: 'Camera',
      color: 'bg-purple-100 text-purple-700',
      isActive: true
    },
    {
      id: 'tools-laptop',
      name: 'Laptops & Computers',
      description: 'Laptops, computers, and accessories for students',
      icon: 'Laptop',
      color: 'bg-gray-100 text-gray-700',
      isActive: true
    },

    // Services Marketplace
    {
      id: 'services-assignments',
      name: 'Assignments Typing',
      description: 'Typing and formatting services for assignments',
      icon: 'Type',
      color: 'bg-blue-100 text-blue-700',
      isActive: true
    },
    {
      id: 'services-tutoring',
      name: 'Tutoring',
      description: 'Private tutoring and academic help',
      icon: 'GraduationCap',
      color: 'bg-green-100 text-green-700',
      isActive: true
    },
    {
      id: 'services-design',
      name: 'Graphic Design',
      description: 'Graphic design services for projects',
      icon: 'Palette',
      color: 'bg-purple-100 text-purple-700',
      isActive: true
    },
    {
      id: 'services-video',
      name: 'Video Editing',
      description: 'Video editing and production services',
      icon: 'Video',
      color: 'bg-red-100 text-red-700',
      isActive: true
    },
    {
      id: 'services-resume',
      name: 'Resume Building',
      description: 'Professional resume writing services',
      icon: 'FileText',
      color: 'bg-orange-100 text-orange-700',
      isActive: true
    },
    {
      id: 'services-photography',
      name: 'Event Photography',
      description: 'Photography services for events',
      icon: 'Camera',
      color: 'bg-yellow-100 text-yellow-700',
      isActive: true
    },
    {
      id: 'services-summarization',
      name: 'Notes Summarization',
      description: 'Summarizing lengthy notes and materials',
      icon: 'FileMinus',
      color: 'bg-indigo-100 text-indigo-700',
      isActive: true
    },
    {
      id: 'services-coding',
      name: 'Coding/Debugging Help',
      description: 'Programming assistance and debugging',
      icon: 'Code',
      color: 'bg-gray-100 text-gray-700',
      isActive: true
    },

    // Event Tickets
    {
      id: 'events-tech-fest',
      name: 'Tech Fest Passes',
      description: 'Technology festival tickets and passes',
      icon: 'Cpu',
      color: 'bg-blue-100 text-blue-700',
      isActive: true
    },
    {
      id: 'events-cultural-fest',
      name: 'Cultural Fest Passes',
      description: 'Cultural festival tickets',
      icon: 'Music',
      color: 'bg-purple-100 text-purple-700',
      isActive: true
    },
    {
      id: 'events-sponsored',
      name: 'Sponsored Events',
      description: 'Sponsored event tickets',
      icon: 'Star',
      color: 'bg-yellow-100 text-yellow-700',
      isActive: true
    },
    {
      id: 'events-after-party',
      name: 'After-party Tickets',
      description: 'Party and social event tickets',
      icon: 'PartyPopper',
      color: 'bg-pink-100 text-pink-700',
      isActive: true
    },
    {
      id: 'events-workshop',
      name: 'Workshop/Certificate Events',
      description: 'Workshop and certification event tickets',
      icon: 'Certificate',
      color: 'bg-green-100 text-green-700',
      isActive: true
    },

    // Project Materials
    {
      id: 'project-electronics',
      name: 'Electronic Components',
      description: 'Electronic parts and components',
      icon: 'CircuitBoard',
      color: 'bg-green-100 text-green-700',
      isActive: true
    },
    {
      id: 'project-arduino',
      name: 'Arduino/ESP Boards',
      description: 'Microcontroller boards and kits',
      icon: 'Microchip',
      color: 'bg-blue-100 text-blue-700',
      isActive: true
    },
    {
      id: 'project-3d-printer',
      name: '3D Printer Time Sharing',
      description: '3D printing time and services',
      icon: 'Box',
      color: 'bg-purple-100 text-purple-700',
      isActive: true
    },
    {
      id: 'project-robotics',
      name: 'Robotics Parts',
      description: 'Robotics components and parts',
      icon: 'Bot',
      color: 'bg-red-100 text-red-700',
      isActive: true
    },
    {
      id: 'project-datasets',
      name: 'Data Sets',
      description: 'Datasets for research and projects',
      icon: 'Database',
      color: 'bg-orange-100 text-orange-700',
      isActive: true
    },
    {
      id: 'project-code',
      name: 'Code Snippets',
      description: 'Reusable code and algorithms',
      icon: 'Code',
      color: 'bg-gray-100 text-gray-700',
      isActive: true
    },

    // Internship & Campus Gigs
    {
      id: 'internships-part-time',
      name: 'Part-time Gigs',
      description: 'Part-time job opportunities',
      icon: 'Briefcase',
      color: 'bg-blue-100 text-blue-700',
      isActive: true
    },
    {
      id: 'internships-internships',
      name: 'Internships',
      description: 'Internship opportunities for students',
      icon: 'UserCheck',
      color: 'bg-green-100 text-green-700',
      isActive: true
    },
    {
      id: 'internships-campus-work',
      name: 'Paid Campus Work',
      description: 'On-campus job opportunities',
      icon: 'Building',
      color: 'bg-purple-100 text-purple-700',
      isActive: true
    },
    {
      id: 'internships-micro-tasks',
      name: 'Micro Tasks for Seniors',
      description: 'Small tasks and errands for senior students',
      icon: 'CheckSquare',
      color: 'bg-orange-100 text-orange-700',
      isActive: true
    },

    // Campus Club Marketplace
    {
      id: 'clubs-merchandise',
      name: 'Club Merchandise',
      description: 'Merchandise from campus clubs',
      icon: 'Shirt',
      color: 'bg-red-100 text-red-700',
      isActive: true
    },
    {
      id: 'clubs-event-kits',
      name: 'Event Kits',
      description: 'Kits for club events and activities',
      icon: 'Package',
      color: 'bg-blue-100 text-blue-700',
      isActive: true
    },
    {
      id: 'clubs-registration',
      name: 'Registration Fees',
      description: 'Club membership and event registration',
      icon: 'CreditCard',
      color: 'bg-green-100 text-green-700',
      isActive: true
    },
    {
      id: 'clubs-workshop',
      name: 'Workshop Materials',
      description: 'Materials for club workshops',
      icon: 'Wrench',
      color: 'bg-purple-100 text-purple-700',
      isActive: true
    },

    // Science / Lab Material Exchange
    {
      id: 'lab-coats',
      name: 'Lab Coats',
      description: 'Laboratory coats and aprons',
      icon: 'User',
      color: 'bg-white-100 text-white-700 border',
      isActive: true
    },
    {
      id: 'lab-goggles',
      name: 'Goggles',
      description: 'Safety goggles and eye protection',
      icon: 'Glasses',
      color: 'bg-blue-100 text-blue-700',
      isActive: true
    },
    {
      id: 'lab-gloves',
      name: 'Gloves',
      description: 'Laboratory gloves and safety equipment',
      icon: 'HandMetal',
      color: 'bg-green-100 text-green-700',
      isActive: true
    },
    {
      id: 'lab-experiment-kits',
      name: 'Experiment Kits',
      description: 'Complete experiment kits and setups',
      icon: 'Flask',
      color: 'bg-purple-100 text-purple-700',
      isActive: true
    },

    // Creative Exchange
    {
      id: 'creative-handmade',
      name: 'Handmade Crafts',
      description: 'Handmade crafts and artwork',
      icon: 'Paintbrush',
      color: 'bg-pink-100 text-pink-700',
      isActive: true
    },
    {
      id: 'art-supplies',
      name: 'Art Supplies',
      description: 'Art materials and supplies',
      icon: 'Palette',
      color: 'bg-orange-100 text-orange-700',
      isActive: true
    },
    {
      id: 'paintings',
      name: 'Paintings',
      description: 'Original paintings and artwork',
      icon: 'Image',
      color: 'bg-red-100 text-red-700',
      isActive: true
    },
    {
      id: 'diy-kits',
      name: 'DIY Kits',
      description: 'Do-it-yourself craft kits',
      icon: 'Package',
      color: 'bg-blue-100 text-blue-700',
      isActive: true
    },

    // Career & Skills
    {
      id: 'career-interview-books',
      name: 'Used Interview Preparation Books',
      description: 'Books for interview preparation',
      icon: 'Book',
      color: 'bg-green-100 text-green-700',
      isActive: true
    },
    {
      id: 'career-mock-interview',
      name: 'Mock Interview Services',
      description: 'Mock interview practice sessions',
      icon: 'UserCheck',
      color: 'bg-blue-100 text-blue-700',
      isActive: true
    },
    {
      id: 'career-resume-templates',
      name: 'Resume Templates',
      description: 'Professional resume templates',
      icon: 'FileText',
      color: 'bg-purple-100 text-purple-700',
      isActive: true
    },
    {
      id: 'career-skill-courses',
      name: 'Skill Course Subscriptions Resell',
      description: 'Resell skill development course subscriptions',
      icon: 'GraduationCap',
      color: 'bg-orange-100 text-orange-700',
      isActive: true
    },

    // Document & Admin Support
    {
      id: 'docs-printouts',
      name: 'Printouts',
      description: 'Printing and document services',
      icon: 'Printer',
      color: 'bg-gray-100 text-gray-700',
      isActive: true
    },
    {
      id: 'docs-xerox',
      name: 'Xerox',
      description: 'Photocopying and duplication services',
      icon: 'Copy',
      color: 'bg-blue-100 text-blue-700',
      isActive: true
    },
    {
      id: 'docs-lamination',
      name: 'Lamination',
      description: 'Document lamination services',
      icon: 'Layers',
      color: 'bg-green-100 text-green-700',
      isActive: true
    },
    {
      id: 'docs-id-holders',
      name: 'ID Card Holders',
      description: 'ID card holders and accessories',
      icon: 'IdCard',
      color: 'bg-purple-100 text-purple-700',
      isActive: true
    },
    {
      id: 'docs-stationery',
      name: 'Stationery Bundles',
      description: 'Stationery sets and bundles',
      icon: 'Package',
      color: 'bg-orange-100 text-orange-700',
      isActive: true
    },

    // Music & Performance
    {
      id: 'music-guitars',
      name: 'Guitars',
      description: 'Acoustic and electric guitars',
      icon: 'Guitar',
      color: 'bg-brown-100 text-brown-700',
      isActive: true
    },
    {
      id: 'music-keyboards',
      name: 'Keyboards',
      description: 'Musical keyboards and pianos',
      icon: 'Piano',
      color: 'bg-black-100 text-black-700 border',
      isActive: true
    },
    {
      id: 'music-microphones',
      name: 'Microphones',
      description: 'Microphones and audio equipment',
      icon: 'Mic',
      color: 'bg-gray-100 text-gray-700',
      isActive: true
    },
    {
      id: 'music-dj',
      name: 'DJ Equipment Rentals',
      description: 'DJ equipment and sound systems',
      icon: 'Headphones',
      color: 'bg-purple-100 text-purple-700',
      isActive: true
    },

    // Student Startups Section
    {
      id: 'startups-products',
      name: 'Sell Products Made by Students',
      description: 'Products created by student entrepreneurs',
      icon: 'ShoppingBag',
      color: 'bg-green-100 text-green-700',
      isActive: true
    },
    {
      id: 'startups-promote',
      name: 'Promote Campus Entrepreneurs',
      description: 'Promotion services for student startups',
      icon: 'Megaphone',
      color: 'bg-blue-100 text-blue-700',
      isActive: true
    },
    {
      id: 'startups-d2c',
      name: 'Small D2C Brands',
      description: 'Direct-to-consumer brands by students',
      icon: 'Store',
      color: 'bg-purple-100 text-purple-700',
      isActive: true
    }
  ]

  for (const category of categories) {
    await prisma.category.create({
      data: category
    })
  }

  console.log('Categories seeded successfully!')

  console.log('Seeding campuses...')
  
  // Clear existing campuses
  await prisma.campus.deleteMany()

  // Create demo campuses
  const campuses = [
    {
      id: 'campus-1',
      name: 'Indian Institute of Technology Bombay',
      address: 'Powai, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      isActive: true
    },
    {
      id: 'campus-2',
      name: 'Delhi University',
      address: 'North Campus',
      city: 'New Delhi',
      state: 'Delhi',
      isActive: true
    },
    {
      id: 'campus-3',
      name: 'Bangalore Institute of Technology',
      address: 'KR Road, VV Puram',
      city: 'Bangalore',
      state: 'Karnataka',
      isActive: true
    }
  ]

  for (const campus of campuses) {
    await prisma.campus.create({
      data: campus
    })
  }

  console.log('Campuses seeded successfully!')

  console.log('Seeding users...')
  
  // Clear existing users
  await prisma.user.deleteMany()

  // Create demo users
  const users = [
    {
      id: 'user-1',
      phone: '+919876543210',
      email: 'rahul.sharma@iitb.ac.in',
      name: 'Rahul Sharma',
      isVerified: true,
      isPremium: true,
      premiumExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      campusId: 'campus-1'
    },
    {
      id: 'user-2',
      phone: '+919876543211',
      email: 'priya.patel@du.ac.in',
      name: 'Priya Patel',
      isVerified: true,
      isPremium: false,
      campusId: 'campus-2'
    },
    {
      id: 'user-3',
      phone: '+919876543212',
      email: 'amit.kumar@bit.edu',
      name: 'Amit Kumar',
      isVerified: true,
      isPremium: false,
      campusId: 'campus-3'
    },
    {
      id: 'user-4',
      phone: '+919876543213',
      email: 'sneha.raj@iitb.ac.in',
      name: 'Sneha Raj',
      isVerified: true,
      isPremium: true,
      premiumExpires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      campusId: 'campus-1'
    },
    {
      id: 'user-5',
      phone: '+919876543214',
      email: 'vikram.singh@du.ac.in',
      name: 'Vikram Singh',
      isVerified: false,
      isPremium: false,
      campusId: 'campus-2'
    }
  ]

  for (const user of users) {
    await prisma.user.create({
      data: user
    })
  }

  console.log('Users seeded successfully!')

  console.log('Seeding wallets...')
  
  // Clear existing wallets
  await prisma.wallet.deleteMany()

  // Create demo wallets
  const wallets = [
    {
      id: 'wallet-1',
      balance: 1500.00,
      userId: 'user-1'
    },
    {
      id: 'wallet-2',
      balance: 500.00,
      userId: 'user-2'
    },
    {
      id: 'wallet-3',
      balance: 750.00,
      userId: 'user-3'
    },
    {
      id: 'wallet-4',
      balance: 2000.00,
      userId: 'user-4'
    },
    {
      id: 'wallet-5',
      balance: 100.00,
      userId: 'user-5'
    }
  ]

  for (const wallet of wallets) {
    await prisma.wallet.create({
      data: wallet
    })
  }

  console.log('Wallets seeded successfully!')

  console.log('Seeding listings...')
  
  // Clear existing listings
  await prisma.listing.deleteMany()

  // Create demo listings
  const listings = [
    {
      id: 'listing-1',
      title: 'Engineering Mathematics Complete Notes',
      description: 'Comprehensive handwritten notes for Engineering Mathematics, includes all chapters with solved examples. Perfect for semester exams.',
      price: 150.00,
      category: 'notes-handwritten',
      condition: 'GOOD',
      location: 'Hostel 7, IIT Bombay',
      isAvailable: true,
      isFeatured: false,
      views: 45,
      contactUnlocked: false,
      userId: 'user-1',
      campusId: 'campus-1',
      categoryId: 'notes-handwritten'
    },
    {
      id: 'listing-2',
      title: 'Used Python Programming Book',
      description: 'Python Programming: A Practical Approach - 2nd Edition. Good condition, minimal highlighting.',
      price: 450.00,
      category: 'books-textbooks',
      condition: 'LIKE_NEW',
      location: 'Library Road, Delhi University',
      isAvailable: true,
      isFeatured: true,
      views: 78,
      contactUnlocked: false,
      userId: 'user-2',
      campusId: 'campus-2',
      categoryId: 'books-textbooks'
    },
    {
      id: 'listing-3',
      title: 'Mountain Bike for Sale',
      description: 'Hero Sprint 21-speed mountain bike, used for 1 year, excellent condition, perfect for campus commute.',
      price: 8500.00,
      category: 'bikes-bicycles',
      condition: 'GOOD',
      location: 'BIT Boys Hostel',
      isAvailable: true,
      isFeatured: false,
      views: 120,
      contactUnlocked: true,
      userId: 'user-3',
      campusId: 'campus-3',
      categoryId: 'bikes-bicycles'
    },
    {
      id: 'listing-4',
      title: 'Assignment Typing Services',
      description: 'Professional typing and formatting services for assignments and projects. Fast turnaround, reasonable rates.',
      price: 50.00,
      category: 'services-assignments',
      location: 'IIT Bombay Academic Area',
      isAvailable: true,
      isFeatured: false,
      views: 32,
      contactUnlocked: false,
      userId: 'user-4',
      campusId: 'campus-1',
      categoryId: 'services-assignments'
    },
    {
      id: 'listing-5',
      title: 'Extra Mess Tokens - Monthly Pack',
      description: '20 extra mess tokens for the month, valid at all campus canteens. Great deal!',
      price: 800.00,
      category: 'food-extra-meal',
      location: 'DU North Campus Mess',
      isAvailable: true,
      isFeatured: false,
      views: 67,
      contactUnlocked: false,
      userId: 'user-5',
      campusId: 'campus-2',
      categoryId: 'food-extra-meal'
    },
    {
      id: 'listing-6',
      title: 'PG Room Sharing Available',
      description: 'Single room in PG accommodation, 2km from campus. AC, WiFi, food included. Immediate occupancy.',
      price: 8000.00,
      category: 'rooms-pg',
      condition: 'GOOD',
      location: 'Powai, Mumbai',
      isAvailable: true,
      isFeatured: true,
      views: 156,
      contactUnlocked: false,
      userId: 'user-1',
      campusId: 'campus-1',
      categoryId: 'rooms-pg'
    },
    {
      id: 'listing-7',
      title: 'MacBook Pro 2020 - High Value',
      description: 'MacBook Pro 13" 2020, 16GB RAM, 512GB SSD, excellent condition. Perfect for coding and design work.',
      price: 75000.00,
      category: 'tools-laptop',
      condition: 'LIKE_NEW',
      location: 'IIT Bombay',
      isAvailable: true,
      isFeatured: true,
      views: 234,
      contactUnlocked: false,
      userId: 'user-4',
      campusId: 'campus-1',
      categoryId: 'tools-laptop'
    }
  ]

  for (const listing of listings) {
    await prisma.listing.create({
      data: listing
    })
  }

  console.log('Listings seeded successfully!')

  console.log('Seeding business ads...')
  
  // Clear existing business ads
  await prisma.businessAd.deleteMany()

  // Create demo business ads
  const businessAds = [
    {
      id: 'business-ad-1',
      title: 'Campus Cafe - 20% Student Discount',
      description: 'Fresh coffee, snacks, and meals. Special 20% discount for all students with valid ID.',
      imageUrl: 'https://example.com/cafe-image.jpg',
      targetUrl: 'https://campuscafe.com',
      category: 'RESTAURANT',
      location: 'Near IIT Bombay Gate',
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      monthlyFee: 199.00,
      impressions: 1250,
      clicks: 45,
      campusId: 'campus-1'
    },
    {
      id: 'business-ad-2',
      title: 'Tech Store - Student Deals',
      description: 'Laptops, accessories, and electronics at special student prices. EMI options available.',
      imageUrl: 'https://example.com/techstore-image.jpg',
      targetUrl: 'https://techstore.com',
      category: 'RETAIL',
      location: 'Bangalore Commercial Street',
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      monthlyFee: 199.00,
      impressions: 890,
      clicks: 32,
      campusId: 'campus-3'
    }
  ]

  for (const ad of businessAds) {
    await prisma.businessAd.create({
      data: ad
    })
  }

  console.log('Business ads seeded successfully!')

  console.log('Seeding events...')
  
  // Clear existing events
  await prisma.event.deleteMany()

  // Create demo events
  const events = [
    {
      id: 'event-1',
      title: 'Tech Fest 2024',
      description: 'Annual technology festival featuring coding competitions, workshops, and tech talks.',
      imageUrl: 'https://example.com/techfest-image.jpg',
      category: 'TECH_FEST',
      location: 'IIT Bombay Main Auditorium',
      startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
      organizerName: 'Tech Club IITB',
      organizerContact: '+919876543210',
      maxParticipants: 500,
      currentParticipants: 234,
      fee: 200.00,
      partnershipFee: 5000.00,
      isActive: true,
      isPartnered: true,
      campusId: 'campus-1'
    },
    {
      id: 'event-2',
      title: 'Cultural Night',
      description: 'Evening of music, dance, and drama performances by students.',
      imageUrl: 'https://example.com/cultural-image.jpg',
      category: 'CULTURAL_FEST',
      location: 'DU Auditorium',
      startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      organizerName: 'Cultural Society',
      organizerContact: '+919876543211',
      maxParticipants: 300,
      currentParticipants: 156,
      fee: 100.00,
      partnershipFee: 3000.00,
      isActive: true,
      isPartnered: false,
      campusId: 'campus-2'
    }
  ]

  for (const event of events) {
    await prisma.event.create({
      data: event
    })
  }

  console.log('Events seeded successfully!')

  console.log('Seeding products...')
  
  // Clear existing products
  await prisma.product.deleteMany()

  // Create demo products
  const products = [
    {
      id: 'product-1',
      name: 'IIT Bombay Hoodie',
      description: 'Official IIT Bombay hoodie with college logo. Comfortable and stylish.',
      imageUrl: 'https://example.com/hoodie-image.jpg',
      category: 'MERCHANDISE',
      price: 899.00,
      stockQuantity: 50,
      sku: 'IITB-HOODIE-001',
      isActive: true,
      isDigital: false,
      weight: 0.5,
      dimensions: '30x25x5',
      campusId: 'campus-1'
    },
    {
      id: 'product-2',
      name: 'Engineering Drawing Kit',
      description: 'Complete engineering drawing kit with all instruments. Perfect for first-year students.',
      imageUrl: 'https://example.com/drawing-kit-image.jpg',
      category: 'STATIONERY',
      price: 450.00,
      stockQuantity: 25,
      sku: 'ED-KIT-001',
      isActive: true,
      isDigital: false,
      weight: 0.3,
      dimensions: '20x15x3',
      campusId: 'campus-2'
    },
    {
      id: 'product-3',
      name: 'Programming Cheat Sheets PDF',
      description: 'Comprehensive programming cheat sheets for Python, Java, and C++.',
      imageUrl: 'https://example.com/cheatsheet-image.jpg',
      category: 'BOOKS',
      price: 99.00,
      stockQuantity: 999,
      sku: 'PROG-CS-001',
      isActive: true,
      isDigital: true,
      digitalUrl: 'https://example.com/cheatsheets.pdf',
      campusId: 'campus-3'
    }
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product
    })
  }

  console.log('Products seeded successfully!')

  console.log('Seeding transactions...')
  
  // Clear existing transactions
  await prisma.transaction.deleteMany()

  // Create demo transactions
  const transactions = [
    {
      id: 'transaction-1',
      type: 'LISTING_FEE',
      amount: 10.00,
      status: 'COMPLETED',
      paymentMethod: 'WALLET',
      description: 'Listing fee for Engineering Mathematics Notes',
      userId: 'user-1',
      listingId: 'listing-1'
    },
    {
      id: 'transaction-2',
      type: 'PREMIUM_SUBSCRIPTION',
      amount: 99.00,
      status: 'COMPLETED',
      paymentMethod: 'CARD',
      description: 'Premium membership subscription',
      userId: 'user-1'
    },
    {
      id: 'transaction-3',
      type: 'CONTACT_UNLOCK',
      amount: 5.00,
      status: 'COMPLETED',
      paymentMethod: 'WALLET',
      description: 'Contact unlock for Mountain Bike',
      userId: 'user-2',
      listingId: 'listing-3'
    },
    {
      id: 'transaction-4',
      type: 'HIGH_VALUE_COMMISSION',
      amount: 3750.00,
      status: 'COMPLETED',
      paymentMethod: 'WALLET',
      description: '5% commission on MacBook Pro sale',
      commissionRate: 5.0,
      userId: 'user-4',
      listingId: 'listing-7'
    },
    {
      id: 'transaction-5',
      type: 'SPONSORED_LISTING',
      amount: 25.00,
      status: 'COMPLETED',
      paymentMethod: 'WALLET',
      description: 'Sponsored listing boost for PG Room',
      userId: 'user-1',
      listingId: 'listing-6'
    },
    {
      id: 'transaction-6',
      type: 'BUSINESS_AD',
      amount: 199.00,
      status: 'COMPLETED',
      paymentMethod: 'CARD',
      description: 'Business advertisement for Campus Cafe',
      userId: 'user-1',
      businessAdId: 'business-ad-1'
    },
    {
      id: 'transaction-7',
      type: 'EVENT_PARTNERSHIP',
      amount: 5000.00,
      status: 'COMPLETED',
      paymentMethod: 'CARD',
      description: 'Event partnership for Tech Fest 2024',
      userId: 'user-1',
      eventId: 'event-1'
    }
  ]

  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: transaction
    })
  }

  console.log('Transactions seeded successfully!')

  console.log('Seeding wallet transactions...')
  
  // Clear existing wallet transactions
  await prisma.walletTransaction.deleteMany()

  // Create demo wallet transactions
  const walletTransactions = [
    {
      id: 'wallet-tx-1',
      type: 'CREDIT',
      amount: 1000.00,
      balance: 1000.00,
      description: 'Wallet top-up via UPI',
      referenceId: 'transaction-topup-1',
      referenceType: 'WALLET_TOPUP',
      walletId: 'wallet-1'
    },
    {
      id: 'wallet-tx-2',
      type: 'DEBIT',
      amount: 10.00,
      balance: 990.00,
      description: 'Listing fee payment',
      referenceId: 'transaction-1',
      referenceType: 'LISTING_FEE',
      walletId: 'wallet-1'
    },
    {
      id: 'wallet-tx-3',
      type: 'CREDIT',
      amount: 500.00,
      balance: 500.00,
      description: 'Wallet top-up via Card',
      referenceId: 'transaction-topup-2',
      referenceType: 'WALLET_TOPUP',
      walletId: 'wallet-2'
    },
    {
      id: 'wallet-tx-4',
      type: 'DEBIT',
      amount: 5.00,
      balance: 495.00,
      description: 'Contact unlock fee',
      referenceId: 'transaction-3',
      referenceType: 'CONTACT_UNLOCK',
      walletId: 'wallet-2'
    }
  ]

  for (const walletTx of walletTransactions) {
    await prisma.walletTransaction.create({
      data: walletTx
    })
  }

  console.log('Wallet transactions seeded successfully!')

  console.log('Seeding orders...')
  
  // Clear existing orders
  await prisma.order.deleteMany()

  // Create demo orders
  const orders = [
    {
      id: 'order-1',
      orderNumber: 'ORD-2024-001',
      status: 'DELIVERED',
      totalAmount: 899.00,
      shippingAddress: 'Hostel 7, IIT Bombay, Powai, Mumbai - 400076',
      notes: 'Please deliver before 6 PM',
      userId: 'user-1',
      campusId: 'campus-1'
    },
    {
      id: 'order-2',
      orderNumber: 'ORD-2024-002',
      status: 'PROCESSING',
      totalAmount: 99.00,
      userId: 'user-3',
      campusId: 'campus-3'
    }
  ]

  for (const order of orders) {
    await prisma.order.create({
      data: order
    })
  }

  console.log('Orders seeded successfully!')

  console.log('Seeding order items...')
  
  // Clear existing order items
  await prisma.orderItem.deleteMany()

  // Create demo order items
  const orderItems = [
    {
      id: 'order-item-1',
      quantity: 1,
      price: 899.00,
      orderId: 'order-1',
      productId: 'product-1'
    },
    {
      id: 'order-item-2',
      quantity: 1,
      price: 99.00,
      orderId: 'order-2',
      productId: 'product-3'
    }
  ]

  for (const orderItem of orderItems) {
    await prisma.orderItem.create({
      data: orderItem
    })
  }

  console.log('Order items seeded successfully!')

  console.log('Demo data seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })