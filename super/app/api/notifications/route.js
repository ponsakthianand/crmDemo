import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';

const notificationHandler = async (req, res) => {
  // if (req.method === 'GET') {
  //   try {
  //     // Mock data: Replace with your database call
  //     const notifications = [
  //       { id: 1, message: 'New user signed up!' },
  //       { id: 2, message: 'New order received!' },
  //     ];

  //     // Emit the notification count via Socket.IO
  //     const io = res.socket.server.io;
  //     if (io) {
  //       io.emit('notification-count', { count: notifications.length });
  //     }

  //     res.status(200).json(notifications);
  //   } catch (error) {
  //     console.error('Error fetching notifications:', error);
  //     res.status(500).json({ message: 'Internal server error' });
  //   }
  // } else {
  //   res.status(405).json({ message: 'Method not allowed' });
  // }
  return NextResponse.json({ message: "It's wrong buddy!" });
}

export { notificationHandler as GET };