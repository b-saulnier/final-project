import express from 'express';
import cors from 'cors';
import { randomBytes } from 'crypto';
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

/*
    well. All the databases now are the same mongodb database, for better or worse
    is this still 'microservice' architecture? not sure
    database functions:
        addPoll,
        readAllPolls,
        addVotesToOption

*/


app.post('/polls', async (req, res) => {

    const id = randomBytes(4).toString('hex');
    const { title, options } = req.body;

    logger.info("(Process ID ${process.pid}) Poll Service: title, options", title, options);

    if (!title || !options) {
        logger.error(`(Process ID ${process.pid}) Poll Service: Missing title or options`);
        return res.status(400).send({
            status: 'ERROR',
            message: 'Missing title or options',
        });
    }

    const poll = {
        id,
        title,
        options, 
    };

    try {
        await store.addPoll(id, title, options);


        logger.info(`(Process ID ${process.pid}) Poll Service: sending PollCreated event`);
        await fetch('http://event-bus:4001/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'PollCreated',
                data: poll,
            }),
        });   

    } catch (err) {
        logger.error(`(Process ID ${process.pid}) Poll Service: ${err}`);
        return res.status(500).send({
            status: 'ERROR',
            message: err,
        });
    }

    logger.info(`(Process ID ${process.pid}) Poll Service sending return response`);
    logger.info(`(Process ID ${process.pid}) Poll Service: ${JSON.stringify(poll)}`);
    return res.status(201).send(poll);   
});

app.post('/events', (req, res) => {
    logger.info(`(Process ID ${process.pid}) Received event: ${req.body.type}`);

    res.send({ status: 'OK' });
});




app.listen(4003, () => {
    logger.info(`(Process ID ${process.pid}) Poll service listening on port 4003`);
});
