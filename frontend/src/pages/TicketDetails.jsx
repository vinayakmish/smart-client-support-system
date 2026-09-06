import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { IconArrowLeft, IconEdit, IconTrash, IconClock, IconUser, IconCheck, IconPaperclip, IconClose } from '../components/Icons';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isClient, isAgent, isAdmin } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [agents, setAgents] = useState([]);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [updating, setUpdating] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  useEffect(() => {
    if (isAdmin || isAgent) {
      fetchAgents();
    }
  }, [isAdmin, isAgent]);

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

  const handleUpdate = async (overrideData) => {
    try {
      setUpdating(true);
      const updatePayload = overrideData || { ...editData };
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
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickStatusChange = (newStatus) => {
    const updated = { ...editData, status: newStatus };
    setEditData(updated);
    handleUpdate(updated);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this ticket?')) return;
    try {
      const response = await api.delete(`/tickets/${id}`);
      if (response.data.success) {
        navigate('/tickets');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      alert('Failed to delete ticket');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const pastedFiles = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        const file = items[i].getAsFile();
        if (file) {
          const renamedFile = new File(
            [file],
            file.name && file.name !== 'image.png'
              ? file.name
              : `pasted-image-${Date.now()}.${file.type.split('/')[1] || 'png'}`,
            { type: file.type }
          );
          pastedFiles.push(renamedFile);
        }
      }
    }
    if (pastedFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...pastedFiles]);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() && selectedFiles.length === 0) return;

    try {
      setSubmittingComment(true);
      const formData = new FormData();
      formData.append('content', commentText.trim() || 'Attached file(s)');

      selectedFiles.forEach((file) => {
        formData.append('attachments', file);
      });

      const response = await api.post(`/tickets/${id}/comments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        setComments([response.data.data, ...comments]);
        setCommentText('');
        setSelectedFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900/60';
      case 'in_progress':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900/60';
      case 'pending':
        return 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border-orange-200 dark:border-orange-900/60';
      case 'resolved':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60';
      case 'closed':
        return 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700';
      default:
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900/60';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-900/60';
      case 'high':
        return 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border-orange-200 dark:border-orange-900/60';
      case 'medium':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900/60';
      case 'low':
      default:
        return 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-100"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center text-xs text-zinc-500">
        Ticket not found. <Link to="/tickets" className="underline">Back</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Header / Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          to="/tickets"
          className="inline-flex items-center space-x-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <IconArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Tickets</span>
        </Link>

        {isAdmin && (
          <button
            onClick={handleDelete}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-md text-xs font-medium transition-colors cursor-pointer"
          >
            <IconTrash className="w-3.5 h-3.5" />
            <span>Delete Ticket</span>
          </button>
        )}
      </div>

      {/* 2-Column Enterprise Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Content Area (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Header & Description */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex-1">
                {editing ? (
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({ ...editData, title: e.target.value })
                    }
                    className="w-full text-lg font-semibold text-zinc-900 dark:text-zinc-100 bg-transparent border-b border-zinc-300 dark:border-zinc-700 pb-1 mb-2 outline-none"
                  />
                ) : (
                  <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {ticket.title}
                  </h1>
                )}
                <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                  Ticket #{ticket._id.slice(-8)} • Opened by {ticket.createdBy?.name} on {new Date(ticket.createdAt).toLocaleDateString()}
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
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 rounded-md transition-colors cursor-pointer"
                >
                  <IconEdit className="w-3.5 h-3.5" />
                  <span>{editing ? 'Save' : 'Edit'}</span>
                </button>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 text-xs leading-relaxed whitespace-pre-wrap">
              {editing ? (
                <textarea
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  rows={6}
                  className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs outline-none"
                />
              ) : (
                ticket.description
              )}
            </div>
          </div>

          {/* Activity / Comments Timeline */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-6">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Activity & Comments ({comments.length})
            </h2>

            {/* Composer */}
            <form onSubmit={handleAddComment} className="space-y-3">
              <div className="relative">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onPaste={handlePaste}
                  rows={3}
                  placeholder="Leave an update or reply... (Tip: You can paste screenshots directly via Ctrl+V)"
                  className="w-full px-3.5 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-all placeholder-zinc-400"
                />
              </div>

              {/* Selected Files preview chips */}
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-200"
                    >
                      <IconPaperclip className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="truncate max-w-[180px] font-medium">{file.name}</span>
                      <span className="text-[10px] text-zinc-400">({(file.size / 1024).toFixed(0)}KB)</span>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="text-zinc-400 hover:text-red-500 transition-colors ml-1 cursor-pointer"
                      >
                        <IconClose className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <IconPaperclip className="w-3.5 h-3.5" />
                    <span>Attach Files</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={submittingComment || (!commentText.trim() && selectedFiles.length === 0)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-md text-xs font-medium shadow-sm transition-colors disabled:opacity-40 cursor-pointer"
                >
                  {submittingComment ? 'Submitting...' : 'Comment'}
                </button>
              </div>
            </form>

            {/* Comment Thread */}
            <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              {comments.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-6">
                  No comments yet.
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {comment.user?.name}
                        </span>
                        <span className="px-1.5 py-0.2 text-[9px] uppercase font-semibold rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                          {comment.user?.role}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>

                    {/* Attachments rendering */}
                    {comment.attachments && comment.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
                        {comment.attachments.map((att, idx) => {
                          const fileUrl = `http://localhost:5000/uploads/${att.path}`;
                          const isImg = /\.(jpg|jpeg|png|gif|webp)$/i.test(att.filename || att.path);
                          return (
                            <a
                              key={idx}
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 px-2.5 py-1.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 transition-colors shadow-xs"
                            >
                              {isImg ? (
                                <img src={fileUrl} alt={att.filename} className="w-6 h-6 object-cover rounded" />
                              ) : (
                                <IconPaperclip className="w-4 h-4 text-zinc-400" />
                              )}
                              <span className="truncate max-w-[160px] font-medium">{att.filename || att.path}</span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Properties Sidebar (1 Col) */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm space-y-5 text-xs">
          <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider pb-2 border-b border-zinc-100 dark:border-zinc-800">
            Properties
          </h3>

          {/* Status */}
          <div>
            <label className="block text-zinc-500 dark:text-zinc-400 mb-1 font-medium">
              Status
            </label>
            {(isAdmin || isAgent) ? (
              <select
                value={editData.status || ticket.status}
                onChange={(e) => handleQuickStatusChange(e.target.value)}
                disabled={updating}
                className="w-full px-2.5 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 outline-none text-xs"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            ) : (
              <span className={`inline-block px-2.5 py-0.5 rounded-md border text-[11px] font-medium capitalize ${getStatusBadge(ticket.status)}`}>
                {ticket.status.replace('_', ' ')}
              </span>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-zinc-500 dark:text-zinc-400 mb-1 font-medium">
              Priority
            </label>
            {(isAdmin || isAgent) && editing ? (
              <select
                value={editData.priority}
                onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 outline-none text-xs"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            ) : (
              <span className={`inline-block px-2.5 py-0.5 rounded-md border text-[11px] uppercase tracking-wider ${getPriorityBadge(ticket.priority)}`}>
                {ticket.priority}
              </span>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-zinc-500 dark:text-zinc-400 mb-1 font-medium">
              Category
            </label>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {ticket.category}
            </span>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-zinc-500 dark:text-zinc-400 mb-1 font-medium">
              Assignee
            </label>
            {(isAdmin || isAgent) ? (
              <select
                value={editData.assignedTo || ticket.assignedTo?._id || ''}
                onChange={(e) => {
                  const newAgentId = e.target.value;
                  const updated = { ...editData, assignedTo: newAgentId || null };
                  setEditData(updated);
                  handleUpdate(updated);
                }}
                disabled={updating}
                className="w-full px-2.5 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 outline-none text-xs"
              >
                <option value="">Unassigned</option>
                {agents.map((ag) => (
                  <option key={ag._id} value={ag._id}>
                    {ag.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center space-x-1.5 font-medium text-zinc-900 dark:text-zinc-100">
                <IconUser className="w-3.5 h-3.5 text-zinc-400" />
                <span>{ticket.assignedTo?.name || 'Unassigned'}</span>
              </div>
            )}
          </div>

          {/* Requester */}
          <div>
            <label className="block text-zinc-500 dark:text-zinc-400 mb-1 font-medium">
              Requester
            </label>
            <div className="font-medium text-zinc-900 dark:text-zinc-100">
              {ticket.createdBy?.name}
            </div>
            <div className="text-zinc-400 text-[11px]">
              {ticket.createdBy?.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
