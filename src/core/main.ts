import express from 'express';
import { logger } from './logger';
import { EventBus } from './event-bus';
import { Connector } from './connector';

const app = express();
app.use(express.json());

const eventBus = new EventBus();

app.post('/register-module', (req, res) => {
  const { moduleId, moduleType, level, dependencies } = req.body;
  logger.info({ moduleId, moduleType, level }, 'Registering module');
  res.json({ status: 'success', message: `Module ${moduleId} registered` });
});

app.post('/event', (req, res) => {
  const { source, target, eventType, payload } = req.body;
  logger.info({ source, target, eventType }, 'Event received');
  eventBus.publish(eventType, payload);
  res.json({ status: 'success', eventId: Date.now().toString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info({ port: PORT }, 'Server started');
});
