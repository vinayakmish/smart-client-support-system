import { Link } from 'react-router-dom';
import { IconClock, IconUser } from './Icons';

const TicketCard = ({ ticket }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return {
          bg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900/60',
          dot: 'bg-blue-500',
        };
      case 'in_progress':
        return {
          bg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900/60',
          dot: 'bg-amber-500',
        };
      case 'pending':
        return {
          bg: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border-orange-200 dark:border-orange-900/60',
          dot: 'bg-orange-500',
        };
      case 'resolved':
        return {
          bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60',
          dot: 'bg-emerald-500',
        };
      case 'closed':
        return {
          bg: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
          dot: 'bg-zinc-400',
        };
      default:
        return {
          bg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900/60',
          dot: 'bg-blue-500',
        };
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-900/60 font-semibold';
      case 'high':
        return 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border border-orange-200 dark:border-orange-900/60 font-medium';
      case 'medium':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 font-medium';
      case 'low':
      default:
        return 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 font-medium';
    }
  };

  const statusStyle = getStatusBadge(ticket.status);

  return (
    <Link
      to={`/tickets/${ticket._id}`}
      className="group block bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800/90 p-5 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-sm transition-all duration-150"
    >
      <div className="flex items-start justify-between gap-4 mb-2.5">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {ticket.title}
        </h3>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <span
            className={`inline-flex items-center space-x-1.5 px-2 py-0.5 text-[11px] rounded-md border ${statusStyle.bg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
            <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
          </span>
          <span
            className={`px-2 py-0.5 text-[11px] uppercase rounded-md tracking-wider ${getPriorityBadge(
              ticket.priority
            )}`}
          >
            {ticket.priority}
          </span>
        </div>
      </div>

      <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-4 line-clamp-2 leading-relaxed">
        {ticket.description}
      </p>

      <div className="flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-medium text-zinc-700 dark:text-zinc-300 text-[11px]">
            {ticket.category}
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <IconClock className="w-3 h-3 text-zinc-400" />
            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
          </span>
        </div>

        <div className="flex items-center space-x-1">
          {ticket.assignedTo ? (
            <div className="flex items-center space-x-1 text-zinc-600 dark:text-zinc-300 font-medium text-[11px]">
              <IconUser className="w-3 h-3 text-zinc-400" />
              <span>{ticket.assignedTo.name}</span>
            </div>
          ) : (
            <span className="text-zinc-400 text-[11px] italic">Unassigned</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default TicketCard;
