import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import TicketCard from '../components/TicketCard';
import FiltersPanel from '../components/FiltersPanel';
import CreateTicketModal from '../components/CreateTicketModal';

const TicketsList = () => {
  const { isClient } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    category: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [filters, pagination.page]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 10,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        ),
      };
      const response = await api.get('/tickets', { params });
      if (response.data.success) {
        setTickets(response.data.data);
        setPagination({
          page: response.data.page,
          pages: response.data.pages,
          total: response.data.total,
        });
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 });
  };

  const handleReset = () => {
    setFilters({ search: '', status: '', priority: '', category: '' });
    setPagination({ ...pagination, page: 1 });
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tickets
        </h1>
        {isClient && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Create New Ticket
          </button>
        )}
      </div>

      <FiltersPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <div className="grid grid-cols-1 gap-4 mb-6">
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

      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page - 1 })
            }
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page + 1 })
            }
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTicket}
      />
    </div>
  );
};

export default TicketsList;

