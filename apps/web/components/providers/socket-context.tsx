'use client';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null); // 👈 AJOUT

  useEffect(() => {
    const s = io(`${API_URL}/notifications`, {
      withCredentials: true,
      transports: ['websocket'],
    });
    socketRef.current = s;
    setSocket(s); // 👈 Déclenche le re-render

    s.on('connect', () => {
      console.log('✅ Socket connecté', s.id);
    });

    s.on('connect_error', (err) => {
      console.error('❌ Erreur de connexion socket :', err.message);
    });

    s.on('disconnect', (reason) => {
      console.log('🔌 Déconnecté:', reason);
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
export const useSocket = () => {
  const context = useContext(SocketContext);

  if (context === undefined) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};
