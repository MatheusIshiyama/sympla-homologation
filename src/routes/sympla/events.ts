import { Router, type Request, type Response } from 'express';

import { symplaController } from '@/controllers/api/sympla';

import type { Ticket } from '@/types';

const router: Router = Router();

router.get('/:eventId', async (req: Request, res: Response) => {
  const { eventId } = req.params;

  const lastUpdateDate: Date | null = symplaController.getLastUpdateDateByEventId(eventId as string);
  const validatedTickets: Ticket[] = symplaController.getValidatedTicketsByEventId(eventId as string);

  res.json({ status: 'ok', lastUpdateDate, validatedTickets });
});

export default router;
