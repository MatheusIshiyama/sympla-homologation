import '@/config';
import 'reflect-metadata';
import { initializeDataSource } from '@/database/data-source';
import { startJobs } from '@/jobs';
import { Server } from '@/server';

const PORT: number = Number(process.env.PORT) || 3000;

const server: Server = new Server(PORT);

initializeDataSource().then(() => {
  server.start();
  startJobs();
});
