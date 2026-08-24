'use client';
import { createContext, ReactNode, useContext, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(`${API_URL}/notifications`, {
      withCredentials: true,
      transports: ['websocket'],
    });
    const socket = socketRef.current;
    socket.on('connect', () => {
      console.log('✅ Socket connecté', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Erreur de connexion socket:', err.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Déconnecté:', reason);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (context === undefined) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};
