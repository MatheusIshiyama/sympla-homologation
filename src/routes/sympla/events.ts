import { Router, type Request, type Response } from 'express';

import { eventService } from '@/services/eventService';

import type { Event } from '@prisma/client';

const router: Router = Router();

router.get('/:eventId', async (req: Request, res: Response): Promise<any> => {
  const { eventId } = req.params;

  const event: Event | null = await eventService.getEventById(eventId);

  if (!event) return res.status(404).json({ status: 'error', message: 'Event not found' });

  return res.json({ status: 'ok' });
});

export const symplaEventsRouter: Router = router;
