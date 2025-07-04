import { Server } from '@/server';

const PORT: number = Number(process.env.PORT) || 3000;

const server: Server = new Server(PORT);

server.start();
