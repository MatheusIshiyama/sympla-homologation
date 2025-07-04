import nodeCron from 'node-cron';

import { updateOrders } from '@/jobs/updateOrders';

const eventId: string = '3024800';

nodeCron.schedule('*/10 * * * * *', () => updateOrders(eventId));
