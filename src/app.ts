import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { logger } from "./helpers/logger";
import router from "./web/router";
import { errorMiddleware } from "@src/web/middlewares/errorHandeling";
import { loggerMiddleware } from './web/middlewares/logger';
// import { errorLoggerMiddleware } from './middleware/error-logger.middleware';
// import { globalErrorHandler } from './middleware/global-error-handler.middleware';
// import router from './routes';



const app = express();

const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({
    extended: true,
    limit: '50mb',
  })
);


app.get('/', (req, res) => {
  res.json({ cool: true });
});

app.use(loggerMiddleware)
app.use('/api', router)
app.use(errorMiddleware)

app.listen(port, () => {
  mongoose.connect(process.env.MONGO_DB_URI!).then(res=>{
    logger.info(
      `Database: is connected`
    );
  });

  logger.info(`Application is running on port ${port}.`);
});
