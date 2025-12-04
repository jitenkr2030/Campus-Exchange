import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { referrerId, referredId } = await request.json()

    if (!referrerId || !referredId) {
      return NextResponse.json(
        { success: false, message: 'Both referrer and referred IDs are required' },
        { status: 400 }
      )
    }

    // Verify both users exist
    const [referrer, referred] = await Promise.all([
      db.user.findUnique({ where: { id: referrerId } }),
      db.user.findUnique({ where: { id: referredId } })
    ])

    if (!referrer || !referred) {
      return NextResponse.json(
        { success: false, message: 'One or both users not found' },
        { status: 404 }
      )
    }

    // Check if referred user already has a referrer
    const existingReferral = await db.referral.findUnique({
      where: { referredId }
    })

    if (existingReferral) {
      return NextResponse.json(
        { success: false, message: 'User already has a referrer' },
        { status: 400 }
      )
    }

    // Generate referral code
    const referralCode = `CE${referrerId.slice(0, 4)}${Date.now().toString().slice(-4)}`.toUpperCase()

    // Create referral record
    const referral = await db.referral.create({
      data: {
        code: referralCode,
        referrerId,
        referredId,
        status: 'PENDING',
        reward: 50, // ₹50 reward
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    })

    // Award badge to referrer
    const referralBadge = await db.badge.findFirst({
      where: { name: 'Referral Champion' }
    })

    if (referralBadge) {
      await db.userBadge.upsert({
        where: {
          userId_badgeId: {
            userId: referrerId,
            badgeId: referralBadge.id
          }
        },
        update: {},
        create: {
          userId: referrerId,
          badgeId: referralBadge.id
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Referral created successfully',
      referral: {
        id: referral.id,
        code: referral.code,
        status: referral.status,
        reward: referral.reward,
        expiresAt: referral.expiresAt
      }
    })

  } catch (error) {
    console.error('Create referral error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID required' },
        { status: 400 }
      )
    }

    // Get user's referral code and stats
    const referrals = await db.referral.findMany({
      where: { referrerId: userId },
      include: {
        referred: {
          select: {
            id: true,
            name: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get user's badges
    const userBadges = await db.userBadge.findMany({
      where: { userId },
      include: {
        badge: true
      },
      orderBy: { earnedAt: 'desc' }
    })

    // Generate referral code if user doesn't have one
    let referralCode = null
    if (referrals.length === 0) {
      referralCode = `CE${userId.slice(0, 4)}${Date.now().toString().slice(-4)}`.toUpperCase()
    } else {
      referralCode = referrals[0].code
    }

    // Calculate leaderboard position (simplified for demo)
    const leaderboardPosition = await calculateLeaderboardPosition(userId)

    return NextResponse.json({
      success: true,
      referralData: {
        code: referralCode,
        totalReferrals: referrals.length,
        successfulReferrals: referrals.filter(r => r.status === 'COMPLETED').length,
        pendingReferrals: referrals.filter(r => r.status === 'PENDING').length,
        totalEarnings: referrals.filter(r => r.status === 'COMPLETED').length * 50,
        referrals: referrals.map(r => ({
          id: r.id,
          status: r.status,
          reward: r.reward,
          completedAt: r.completedAt,
          referredUser: r.referred
        }))
      },
      badges: userBadges.map(ub => ({
        id: ub.badge.id,
        name: ub.badge.name,
        description: ub.badge.description,
        icon: ub.badge.icon,
        color: ub.badge.color,
        earnedAt: ub.earnedAt
      })),
      leaderboard: {
        position: leaderboardPosition,
        totalReferrals: referrals.length
      }
    })

  } catch (error) {
    console.error('Get referral data error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function calculateLeaderboardPosition(userId: string) {
  try {
    // Get all users with their referral counts
    const referralCounts = await db.referral.groupBy({
      by: ['referrerId'],
      where: { status: 'COMPLETED' },
      _count: { referrerId: true },
      orderBy: { _count: { referrerId: 'desc' } }
    })

    const userCount = referralCounts.find(rc => rc.referrerId === userId)?._count.referrerId || 0
    const position = referralCounts.findIndex(rc => rc._count.referrerId > userCount) + 1

    return position
  } catch (error) {
    console.error('Error calculating leaderboard position:', error)
    return 0
  }
}