import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import TicketCard from '../components/TicketCard';
import CreateTicketModal from '../components/CreateTicketModal';
import { IconPlus, IconTicket, IconClock, IconCheck, IconAlert } from '../components/Icons';

const Dashboard = () => {
  const { user, isClient } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tickets?limit=5');
      if (response.data.success) {
        setTickets(response.data.data);
        calculateStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ticketList) => {
    setStats({
      total: ticketList.length,
      open: ticketList.filter((t) => t.status === 'open').length,
      inProgress: ticketList.filter((t) => t.status === 'in_progress').length,
      resolved: ticketList.filter((t) => t.status === 'resolved').length,
    });
  };

  const handleCreateTicket = async (formData) => {
    try {
      const response = await api.post('/tickets', formData);
      if (response.data.success) {
        setIsModalOpen(false);
        fetchTickets();
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-100"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Overview
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            System summary and recent ticket updates for {user?.name}
          </p>
        </div>

        {isClient && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <IconPlus className="w-3.5 h-3.5" />
            <span>Create Ticket</span>
          </button>
        )}
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total</span>
            <IconTicket className="w-4 h-4 text-zinc-400" />
          </div>
          <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {stats.total}
          </p>
        </div>

        {/* Open */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Open</span>
            <IconAlert className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400 tracking-tight">
            {stats.open}
          </p>
        </div>

        {/* In Progress */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">In Progress</span>
            <IconClock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-semibold text-amber-600 dark:text-amber-400 tracking-tight">
            {stats.inProgress}
          </p>
        </div>

        {/* Resolved */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Resolved</span>
            <IconCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400 tracking-tight">
            {stats.resolved}
          </p>
        </div>
      </div>

      {/* Recent Tickets Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Recent Tickets
          </h2>
          <Link
            to="/tickets"
            className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {tickets.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
              No tickets recorded yet.
            </div>
          ) : (
            tickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))
          )}
        </div>
      </div>

      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTicket}
      />
    </div>
  );
};

export default Dashboard;
