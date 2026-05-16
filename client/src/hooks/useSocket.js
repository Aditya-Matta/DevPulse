import { useEffect, useRef } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '../lib/socket';
import useAuthStore from '../store/authStore';

const useSocket = (roomCode, handlers = {}) => {
  const socketRef = useRef(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!roomCode || !user) return;

    const socket = connectSocket();
    socketRef.current = socket;

    socket.emit('room:join', { roomCode, userId: user._id, username: user.username });

    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      socket.emit('room:leave', { roomCode });
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [roomCode, user?._id]);

  const emit = (event, data) => {
    socketRef.current?.emit(event, data);
  };

  return { emit, socket: socketRef.current };
};

export default useSocket;
