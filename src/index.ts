import '@/config';
import { Server } from '@/server';
import '@/jobs';

const PORT: number = Number(process.env.PORT) || 3000;

const server: Server = new Server(PORT);

server.start();
