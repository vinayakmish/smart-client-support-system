import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import TicketCard from '../components/TicketCard';
import CreateTicketModal from '../components/CreateTicketModal';

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
      const response = await api.get('/tickets?limit=10');
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's an overview of your tickets
        </p>
      </div>

      {isClient && (
        <div className="mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Create New Ticket
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Total Tickets
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.total}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Open
          </h3>
          <p className="text-3xl font-bold text-blue-600">{stats.open}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            In Progress
          </h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Resolved
          </h3>
          <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Tickets
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {tickets.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No tickets found
            </p>
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

