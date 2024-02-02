import express, { ErrorRequestHandler, Express } from 'express';
import morgan from 'morgan';
import sampleRouter from 'server/src/routers/sample';

let app: Express | undefined;

export async function getApp(): Promise<Express> {
  if (app) {
    return app;
  }

  app = express();

  app.use(
    morgan('dev', {
      stream: {
        write: function (message) {
          // https://stackoverflow.com/questions/40602106/how-to-remove-empty-lines-that-are-being-generated-in-a-log-file-from-morgan-log
          console.log(message.trim());
        },
      },
    }),
  );

  process.on('exit', async function () {
    await close();
    app = undefined;
  });

  // Increasing the limit from 100kB.
  app.use(express.json({ limit: '1MB' }));
  app.use('/sample', sampleRouter);

  // https://expressjs.com/en/guide/error-handling.html
  const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    console.error(err);
    return res.sendStatus(500);
  };

  app.use(errorHandler);

  return app;
}
