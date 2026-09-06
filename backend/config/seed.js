import dotenv from 'dotenv';
import connectDB from './db.js';
import User from '../models/User.js';
import Ticket from '../models/Ticket.js';
import Comment from '../models/Comment.js';

dotenv.config();

export const seedDatabase = async () => {
  // Clear existing data
  await User.deleteMany({});
  await Ticket.deleteMany({});
  await Comment.deleteMany({});

  console.log('Seeding initial data...');

  // Create users
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@support.com',
    password: 'admin123',
    role: 'admin',
  });

  const agent1 = await User.create({
    name: 'John Agent',
    email: 'agent1@support.com',
    password: 'agent123',
    role: 'agent',
  });

  const agent2 = await User.create({
    name: 'Jane Agent',
    email: 'agent2@support.com',
    password: 'agent123',
    role: 'agent',
  });

  const client1 = await User.create({
    name: 'Client One',
    email: 'client1@example.com',
    password: 'client123',
    role: 'client',
  });

  const client2 = await User.create({
    name: 'Client Two',
    email: 'client2@example.com',
    password: 'client123',
    role: 'client',
  });

  const client3 = await User.create({
    name: 'Client Three',
    email: 'client3@example.com',
    password: 'client123',
    role: 'client',
  });

  // Create tickets
  const tickets = [
    {
      title: 'Login Issue',
      description: 'Unable to login to the system. Getting error message.',
      status: 'open',
      priority: 'high',
      category: 'Technical',
      createdBy: client1._id,
      assignedTo: agent1._id,
    },
    {
      title: 'Password Reset Request',
      description: 'Need to reset my password for my account.',
      status: 'in_progress',
      priority: 'medium',
      category: 'Account',
      createdBy: client2._id,
      assignedTo: agent1._id,
    },
    {
      title: 'Feature Request',
      description: 'Would like to request a new feature for the dashboard.',
      status: 'pending',
      priority: 'low',
      category: 'Feature Request',
      createdBy: client1._id,
      assignedTo: agent2._id,
    },
    {
      title: 'Payment Issue',
      description: 'Payment not processing correctly. Need urgent help.',
      status: 'resolved',
      priority: 'urgent',
      category: 'Billing',
      createdBy: client3._id,
      assignedTo: agent2._id,
    },
    {
      title: 'Bug Report',
      description: 'Found a bug in the ticket creation form.',
      status: 'closed',
      priority: 'medium',
      category: 'Bug',
      createdBy: client2._id,
      assignedTo: agent1._id,
    },
    {
      title: 'Account Deletion',
      description: 'Request to delete my account and all associated data.',
      status: 'open',
      priority: 'high',
      category: 'Account',
      createdBy: client3._id,
    },
    {
      title: 'API Documentation',
      description: 'Need help understanding the API documentation.',
      status: 'in_progress',
      priority: 'low',
      category: 'Documentation',
      createdBy: client1._id,
      assignedTo: agent2._id,
    },
    {
      title: 'Performance Issue',
      description: 'System is running very slowly. Need optimization.',
      status: 'pending',
      priority: 'high',
      category: 'Technical',
      createdBy: client2._id,
      assignedTo: agent1._id,
    },
  ];

  const createdTickets = await Ticket.insertMany(tickets);

  // Create comments
  const comments = [
    {
      ticket: createdTickets[0]._id,
      user: agent1._id,
      content: 'I have reviewed the issue. Please try clearing your browser cache.',
    },
    {
      ticket: createdTickets[1]._id,
      user: agent1._id,
      content: 'Password reset link has been sent to your email.',
    },
    {
      ticket: createdTickets[2]._id,
      user: agent2._id,
      content: 'Thank you for the feature request. We will review it in our next meeting.',
    },
    {
      ticket: createdTickets[3]._id,
      user: agent2._id,
      content: 'Payment issue has been resolved. Please check your account.',
    },
    {
      ticket: createdTickets[3]._id,
      user: client3._id,
      content: 'Thank you! The payment went through successfully.',
    },
  ];

  await Comment.insertMany(comments);

  console.log('✅ Seed data created successfully!');
  console.log('\nDefault Test Credentials:');
  console.log('  Admin:  admin@support.com  / admin123');
  console.log('  Agent:  agent1@support.com / agent123');
  console.log('  Client: client1@example.com / client123\n');
};

export const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database is empty. Automatically seeding default accounts and tickets...');
      await seedDatabase();
    }
  } catch (error) {
    console.error('Error during auto-seed check:', error.message);
  }
};

const runDirect = async () => {
  try {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error running seed:', error);
    process.exit(1);
  }
};

// If run directly from CLI (e.g. `node config/seed.js`)
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  runDirect();
}
