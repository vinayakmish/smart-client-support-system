import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';

// @desc    Get analytics data
// @route   GET /api/analytics
// @access  Private (Admin only)
export const getAnalytics = async (req, res) => {
  try {
    // Total tickets
    const totalTickets = await Ticket.countDocuments();

    // Tickets by status
    const ticketsByStatus = await Ticket.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Tickets by priority
    const ticketsByPriority = await Ticket.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    // Tickets by category
    const ticketsByCategory = await Ticket.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Monthly trends (last 12 months)
    const monthlyTrends = await Ticket.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
      {
        $limit: 12,
      },
    ]);

    // Agent performance
    const agentPerformance = await Ticket.aggregate([
      {
        $match: { assignedTo: { $ne: null } },
      },
      {
        $group: {
          _id: '$assignedTo',
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] },
          },
          closed: {
            $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'agent',
        },
      },
      {
        $unwind: '$agent',
      },
      {
        $project: {
          agentName: '$agent.name',
          agentEmail: '$agent.email',
          total: 1,
          resolved: 1,
          closed: 1,
          resolutionRate: {
            $multiply: [
              {
                $divide: [
                  { $add: ['$resolved', '$closed'] },
                  '$total',
                ],
              },
              100,
            ],
          },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    // Response time (average days to resolve)
    const avgResolutionTime = await Ticket.aggregate([
      {
        $match: {
          status: { $in: ['resolved', 'closed'] },
          updatedAt: { $exists: true },
        },
      },
      {
        $project: {
          daysToResolve: {
            $divide: [
              { $subtract: ['$updatedAt', '$createdAt'] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgDays: { $avg: '$daysToResolve' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalTickets,
        ticketsByStatus: ticketsByStatus.map((item) => ({
          status: item._id,
          count: item.count,
        })),
        ticketsByPriority: ticketsByPriority.map((item) => ({
          priority: item._id,
          count: item.count,
        })),
        ticketsByCategory: ticketsByCategory.map((item) => ({
          category: item._id,
          count: item.count,
        })),
        monthlyTrends: monthlyTrends.map((item) => ({
          month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
          count: item.count,
        })),
        agentPerformance,
        avgResolutionTime:
          avgResolutionTime.length > 0
            ? Math.round(avgResolutionTime[0].avgDays * 10) / 10
            : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

