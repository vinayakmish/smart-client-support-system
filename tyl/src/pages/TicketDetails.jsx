import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isClient, isAgent, isAdmin } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  useEffect(() => {
    if ((isAdmin || isAgent) && ticket) {
      fetchAgents();
    }
  }, [isAdmin, isAgent, ticket]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tickets/${id}`);
      if (response.data.success) {
        setTicket(response.data.data.ticket);
        setComments(response.data.data.comments);
        setEditData({
          title: response.data.data.ticket.title,
          description: response.data.data.ticket.description,
          category: response.data.data.ticket.category,
          status: response.data.data.ticket.status,
          priority: response.data.data.ticket.priority,
          assignedTo: response.data.data.ticket.assignedTo?._id || '',
        });
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await api.get('/users?role=agent');
      if (response.data.success) {
        setAgents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatePayload = { ...editData };
      if (!updatePayload.assignedTo) {
        updatePayload.assignedTo = null;
      }
      const response = await api.put(`/tickets/${id}`, updatePayload);
      if (response.data.success) {
        setTicket(response.data.data);
        setEditing(false);
        fetchTicket();
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Failed to update ticket');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const formData = new FormData();
      formData.append('content', commentText);

      const response = await api.post(`/tickets/${id}/comments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        setComments([response.data.data, ...comments]);
        setCommentText('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      pending: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      closed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    };
    return colors[status] || colors.open;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[priority] || colors.medium;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-400">Ticket not found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/tickets')}
        className="mb-4 text-blue-600 dark:text-blue-400 hover:underline"
      >
        ← Back to Tickets
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            {editing ? (
              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                className="w-full text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-blue-500 mb-2"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {ticket.title}
              </h1>
            )}
            <div className="flex space-x-2">
              <span
                className={`px-3 py-1 text-sm font-medium rounded ${getStatusColor(
                  ticket.status
                )}`}
              >
                {ticket.status.replace('_', ' ')}
              </span>
              <span
                className={`px-3 py-1 text-sm font-medium rounded ${getPriorityColor(
                  ticket.priority
                )}`}
              >
                {ticket.priority}
              </span>
            </div>
          </div>
          {(isAgent || isAdmin) && (
            <button
              onClick={() => {
                if (editing) {
                  handleUpdate();
                } else {
                  setEditing(true);
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editing ? 'Save' : 'Edit'}
            </button>
          )}
        </div>

        <div className="mb-4">
          {editing ? (
            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {ticket.description}
            </p>
          )}
        </div>

        {(isAgent || isAdmin) && editing && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={editData.status}
                onChange={(e) =>
                  setEditData({ ...editData, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={editData.priority}
                onChange={(e) =>
                  setEditData({ ...editData, priority: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            {isAdmin && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign To Agent
                </label>
                <select
                  value={editData.assignedTo || ''}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      assignedTo: e.target.value || null,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Unassigned</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name} ({agent.email})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>
            <strong>Category:</strong> {ticket.category}
          </p>
          <p>
            <strong>Created by:</strong> {ticket.createdBy?.name} on{' '}
            {new Date(ticket.createdAt).toLocaleString()}
          </p>
          {ticket.assignedTo && (
            <p>
              <strong>Assigned to:</strong> {ticket.assignedTo.name}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Comments
        </h2>

        <form onSubmit={handleAddComment} className="mb-6">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={4}
            placeholder="Add a comment..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-2"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Comment
          </button>
        </form>

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-4">
              No comments yet
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="border-l-4 border-blue-500 pl-4 py-2"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {comment.user?.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;

