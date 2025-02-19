import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';

const SocketHandler = async (req, res) => {
  // if (!res.socket?.server?.io) {
  //   console.log('Initializing Socket.IO server...');

  //   const io = new Server(res.socket.server, {
  //     path: '/api/socket.io',
  //     cors: {
  //       origin: '*', // Adjust for production
  //       methods: ['GET', 'POST'],
  //     },
  //   });

  //   return res.socket.server.io = io;
  // }

  // return res.json({ message: "It's wrong buddy!" });
  return NextResponse.json({ message: "It's wrong buddy!" });
}

export { SocketHandler as GET };