"use client";
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function NotificationCount() {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Initialize Socket.IO client
    const socket = io({ path: '/api/socket' });

    // Listen for notification count updates
    socket.on('notification-count', (data) => {
      setNotificationCount(data.count);
    });

    // Clean up the connection
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <p>New Notifications: {notificationCount}</p>
    </div>
  );
}
