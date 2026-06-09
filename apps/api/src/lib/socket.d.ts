import { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
export declare const initSocket: (httpServer: HttpServer, frontendOrigin: string) => Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare const getIO: () => Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
//# sourceMappingURL=socket.d.ts.map