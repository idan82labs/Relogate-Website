'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  type Notification,
} from '@/services/notifications';
import { useAuth } from '@/contexts';

interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className = '' }: NotificationBellProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    const { count } = await getUnreadCount();
    setUnreadCount(count);
  }, [isAuthenticated]);

  // Fetch notifications when dropdown opens
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    const { data } = await getUserNotifications({ limit: 10 });
    if (data) {
      setNotifications(data.notifications);
    }
    setLoading(false);
  }, [isAuthenticated]);

  // Fetch unread count on mount and periodically
  useEffect(() => {
    async function init() {
      await fetchUnreadCount();
    }
    init();
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    async function loadNotifications() {
      if (isOpen) {
        await fetchNotifications();
      }
    }
    loadNotifications();
  }, [isOpen, fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      await markAsRead(notification.id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
    }

    // Navigate based on notification type
    setIsOpen(false);
    if (notification.type === 'report_ready') {
      router.push('/personal-area/report');
    } else if (notification.type === 'country_response_ready' && notification.relatedId) {
      router.push(`/personal-area/report?destination=${notification.relatedId}`);
    } else {
      router.push('/personal-area');
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'עכשיו';
    if (diffMins < 60) return `לפני ${diffMins} דקות`;
    if (diffHours < 24) return `לפני ${diffHours} שעות`;
    if (diffDays < 7) return `לפני ${diffDays} ימים`;
    return date.toLocaleDateString('he-IL');
  };

  if (!isAuthenticated) return null;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-[#F7F7F7] transition-colors"
        aria-label="התראות"
      >
        <svg
          className="w-6 h-6 text-[#1D1D1B]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#C6C6C6] overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#C6C6C6] flex items-center justify-between">
              <h3 className="font-semibold text-[#1D1D1B]">התראות</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-[#215388] hover:underline"
                >
                  סמן הכל כנקרא
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#215388]" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-8 text-center text-[#706F6F]">
                  אין התראות חדשות
                </div>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-right px-4 py-3 border-b border-[#F7F7F7] hover:bg-[#F9F6F1] transition-colors ${
                      !notification.isRead ? 'bg-[#215388]/5' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Unread indicator */}
                      <div className="flex-shrink-0 mt-1.5">
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-[#215388] rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#1D1D1B] truncate">
                          {notification.title}
                        </p>
                        <p className="text-sm text-[#706F6F] line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-[#B2B2B2] mt-1">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-[#C6C6C6]">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/personal-area/notifications');
                  }}
                  className="w-full text-center text-sm text-[#215388] hover:underline"
                >
                  צפה בכל ההתראות
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationBell;
