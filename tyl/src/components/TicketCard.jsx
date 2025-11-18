import { Link } from 'react-router-dom';

const TicketCard = ({ ticket }) => {
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

  return (
    <Link
      to={`/tickets/${ticket._id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
          {ticket.title}
        </h3>
        <div className="flex space-x-2 ml-4">
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
              ticket.status
            )}`}
          >
            {ticket.status.replace('_', ' ')}
          </span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(
              ticket.priority
            )}`}
          >
            {ticket.priority}
          </span>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {ticket.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div>
          <span className="font-medium">Category:</span> {ticket.category}
        </div>
        <div className="text-right">
          <div>
            <span className="font-medium">Created:</span>{' '}
            {new Date(ticket.createdAt).toLocaleDateString()}
          </div>
          {ticket.assignedTo && (
            <div>
              <span className="font-medium">Assigned:</span>{' '}
              {ticket.assignedTo.name}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default TicketCard;

