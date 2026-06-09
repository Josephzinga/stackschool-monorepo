import { ReactNode } from 'react';
import { Socket } from 'socket.io-client';
export declare const SocketProvider: ({ children }: {
    children: ReactNode;
}) => import("react").JSX.Element;
export declare const useSocket: () => Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap> | null;
//# sourceMappingURL=socket-context.d.ts.map