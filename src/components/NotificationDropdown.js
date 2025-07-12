import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, X, Check, Trash2, MessageSquare, User, AtSign, ThumbsUp, CheckCircle } from 'lucide-react';
import { fetchNotifications, fetchUnreadCount, markNotificationRead, markAllNotificationsRead, deleteNotification } from '../services/api';
import toast from 'react-hot-toast';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetchNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await fetchUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await markNotificationRead(notification._id);
        setNotifications(prev => 
          prev.map(n => 
            n._id === notification._id ? { ...n, read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      // Navigate to the notification link
      navigate(notification.link);
      onClose();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      if (!notifications.find(n => n._id === notificationId)?.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'answer':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'mention':
        return <AtSign className="w-4 h-4 text-purple-500" />;
      case 'vote':
        return <ThumbsUp className="w-4 h-4 text-orange-500" />;
      case 'accept':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute right-0 top-16 mt-2 w-96 bg-[#493222] rounded-xl shadow-lg border border-[#cba990] max-h-96 overflow-hidden">
        <div className="p-4 border-b border-[#cba990]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-[#cba990] hover:text-white transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="text-[#cba990] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-[#cba990]">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-[#cba990]">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y divide-[#cba990]">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 cursor-pointer transition-colors ${
                    notification.read 
                      ? 'hover:bg-[#3a2819]' 
                      : 'bg-[#3a2819] hover:bg-[#2d1f12]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-white">
                            <span className="font-medium text-[#f26c0c]">
                              {notification.sender?.username || 'Unknown'}
                            </span>
                            {' '}
                            {notification.content}
                          </p>
                          <p className="text-xs text-[#cba990] mt-1">
                            {formatTime(notification.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-[#f26c0c] rounded-full"></div>
                          )}
                          <button
                            onClick={(e) => handleDeleteNotification(notification._id, e)}
                            className="text-[#cba990] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-3 border-t border-[#cba990] bg-[#3a2819]">
            <Link
              to="/notifications"
              className="text-sm text-[#cba990] hover:text-white transition-colors block text-center"
              onClick={onClose}
            >
              View all notifications
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown; 