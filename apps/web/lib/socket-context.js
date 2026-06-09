'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSocket = exports.SocketProvider = void 0;
const react_1 = require("react");
const socket_io_client_1 = require("socket.io-client");
const SocketContext = (0, react_1.createContext)(null);
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const SocketProvider = ({ children }) => {
    const [socket, setSocket] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const socketInstance = (0, socket_io_client_1.io)(API_URL, {
            withCredentials: true,
            transports: ['websocket'],
        });
        setSocket(socketInstance);
        return () => {
            socketInstance.disconnect();
        };
    }, []);
    return (<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>);
};
exports.SocketProvider = SocketProvider;
const useSocket = () => {
    const context = (0, react_1.useContext)(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
};
exports.useSocket = useSocket;
//# sourceMappingURL=socket-context.js.map