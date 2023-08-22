import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import store from './store.js';
import winston from 'winston';



const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} (${process.pid}) [${level.toUpperCase()}]: ${message}`;
      })
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'event.log' })
    ]
  });


app.get('/polls', (req, res) => {
    logger.info(`(Process ID ${process.pid}) Query Service: responding to query`);
    const polls = store.read();
    res.status(200).send(polls);
});



app.post('/events', (req, res) => {
    logger.info(`(Process ID ${process.pid}) Received event: ${req.body.type}`);

    const query = store.read();


    if (req.body.type === 'PollCreated') {
        const { id, title, options } = req.body.data;
        
        query[id] = { id, title };
        query[id].options = {};

        options.forEach(option => {
            query[id].options[option] = 0;
        });

    }

    else if (req.body.type === 'RadioChosen') {
        const { pollId, radioOption, count } = req.body.data;
        logger.info("query", pollId, radioOption, count);

        let options = query[pollId].options || {};
        options[radioOption] = count;
        query[pollId].options = options;

    }

    store.write(query);
    res.send({ status: 'OK' });
});


app.delete('/restart', (req, res) => {
    logger.info(`(Process ID ${process.pid}) Query Service: deleting database`);
    store.restart();
    res.status(200).send({ status: 'OK' });
});



app.listen(4000, () => {
    logger.info(`(Process ID ${process.pid}) Query service listening on port 4000`);
});