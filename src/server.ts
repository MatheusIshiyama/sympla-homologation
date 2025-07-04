import express, { type Application } from 'express';

import { getRoutes } from '@/routes';
import { logger } from '@/utils';

export class Server {
  private app: Application;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;

    this.setup();
  }

  private setup(): void {
    this.app.use(express.json());
    this.app.use(getRoutes());
  }

  public start(): void {
    this.app.listen(this.port, () => logger('SUCCESS', 'API', `Ready at http://localhost:${this.port}`));
  }
}
