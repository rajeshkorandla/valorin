import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount, currency = 'USD') {
  if (!amount && amount !== 0) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatDate(date, format = 'short') {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'short') {
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  
  if (format === 'long') {
    return dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
  
  return dateObj.toLocaleDateString('en-US');
}

export function formatRelativeTime(date) {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now - dateObj;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}

export function getInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(text, length = 50) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function calculateWinRate(won, lost) {
  const total = won + lost;
  if (total === 0) return 0;
  return Math.round((won / total) * 100);
}

export function getStatusColor(status) {
  const colors = {
    new_request: 'bg-blue-500',
    contacted: 'bg-purple-500',
    quoted: 'bg-orange-500',
    closed_won: 'bg-green-500',
    closed_lost: 'bg-red-500',
  };
  return colors[status] || 'bg-gray-500';
}

export function getPriorityColor(priority) {
  const colors = {
    low: 'text-gray-600',
    medium: 'text-blue-600',
    high: 'text-orange-600',
    urgent: 'text-red-600',
  };
  return colors[priority] || 'text-gray-600';
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
