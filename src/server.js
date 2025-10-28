import express from "express";
import cors from "cors";
import pino from "pino-http";
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors());
app.use(
  pino({
    level: "info",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      }
    }
  })
);

app.use((req, res, next) => {
  const now = new Date();

  const formatted = now.toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).replace(',', '');

  console.log(`Time: ${formatted}`);
  next();
});

app.get('/notes', (req, res) => {
	res.status(200).json({ message: 'Retrieved all notes' });
});

app.get('/notes/:noteId', (req, res) => {
	const noteId = req.params.noteId;

	res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
});

app.get('/test-error', (req, res) => {
	throw new Error('Simulated server error');
});

app.use((req, res, next) => {
	res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
	const isProd = process.env.NODE_ENV === 'production';

	res.status(500).json({
		message: isProd
			? 'Something went wrong. Please try again later.'
			: err.message,
	});
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

