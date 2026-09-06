import Ticket from '../models/Ticket.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private
export const getTickets = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      category,
      search,
      assignedTo,
    } = req.query;

    // Build query
    const query = {};

    // Role-based filtering
    if (req.user.role === 'client') {
      query.createdBy = req.user.id;
    } else if (req.user.role === 'agent') {
      query.$or = [
        { assignedTo: req.user.id },
        { assignedTo: null },
      ];
    }
    // Admin can see all tickets

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (assignedTo) query.assignedTo = assignedTo;

    if (search) {
      const searchQuery = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      };
      // If there's already a $or for agent role, combine them
      if (query.$or && req.user.role === 'agent') {
        query.$and = [
          { $or: query.$or },
          searchQuery,
        ];
        delete query.$or;
      } else {
        Object.assign(query, searchQuery);
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Ticket.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tickets.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
export const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check permissions
    if (
      req.user.role === 'client' &&
      ticket.createdBy._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get comments
    const comments = await Comment.find({ ticket: ticket._id })
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { ticket, comments },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private (Client only)
export const createTicket = async (req, res) => {
  try {
    const { title, description, priority, category } = req.body;

    if (!title || !description || !category) {
      return res
        .status(400)
        .json({ message: 'Please provide title, description, and category' });
    }

    const ticket = await Ticket.create({
      title,
      description,
      priority: priority || 'medium',
      category,
      createdBy: req.user.id,
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.status(201).json({
      success: true,
      data: populatedTicket,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
export const updateTicket = async (req, res) => {
  try {
    let ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check permissions
    if (req.user.role === 'client') {
      if (ticket.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      // Clients can only update title, description, category
      const { title, description, category } = req.body;
      ticket.title = title || ticket.title;
      ticket.description = description || ticket.description;
      ticket.category = category || ticket.category;
    } else {
      // Agents and Admins can update everything
      const { title, description, status, priority, category, assignedTo } =
        req.body;
      ticket.title = title || ticket.title;
      ticket.description = description || ticket.description;
      ticket.status = status || ticket.status;
      ticket.priority = priority || ticket.priority;
      ticket.category = category || ticket.category;
      ticket.assignedTo = assignedTo || ticket.assignedTo;
    }

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      data: updatedTicket,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private (Admin only)
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Delete associated comments
    await Comment.deleteMany({ ticket: ticket._id });

    await ticket.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Ticket deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add comment to ticket
// @route   POST /api/tickets/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Please provide comment content' });
    }

    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        attachments.push({
          filename: file.originalname,
          path: file.filename || file.originalname,
        });
      });
    }

    const comment = await Comment.create({
      ticket: ticket._id,
      user: req.user.id,
      content,
      attachments,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      'user',
      'name email role'
    );

    res.status(201).json({
      success: true,
      data: populatedComment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Upload file to ticket
// @route   POST /api/tickets/:id/upload
// @access  Private
export const uploadFile = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    ticket.attachments.push({
      filename: req.file.originalname,
      path: req.file.filename || req.file.originalname,
    });

    await ticket.save();

    res.status(200).json({
      success: true,
      data: ticket.attachments[ticket.attachments.length - 1],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

