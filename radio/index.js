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


app.post('/polls/:pollId/:radioOption', async (req, res) => {

    const { pollId, radioOption } = req.params;

    if (!pollId || !radioOption) {
        logger.error(`(${process.pid}) Radio Service: Missing route parameters`);
        return res.status(400).send({
            status: 'ERROR',
            message: 'Missing route parameters',
        });
    }


    const radios = store.read();

    try {
        
        
        const poll = radios[pollId] || {};
        let count = poll[radioOption] || 0;
        count++;
        poll[radioOption] = count;
        radios[pollId] = poll;

        store.write(radios);

        await fetch('http://localhost:4001/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'RadioChosen',
                data: {
                    pollId,
                    radioOption,
                    count,
                },
            }),
        });


    } catch (err) {
        logger.error(`(${process.pid}) Radio Service: ${err}`);
        res.status(500).send({
            status: 'ERROR',
            message: err,
        });
    }

    res.status(201).send(radios[pollId]);
    logger.info(`(${process.pid}) Radio Service: ${JSON.stringify(radios)}`);


});

app.post('/events', (req, res) => {
    logger.info(`(Process ID ${process.pid}) Received event: ${req.body.type}`);

    res.send({ status: 'OK' });
});

app.listen(4004, () => {
    logger.info(`(Process ID ${process.pid}) Radio service listening on port 4004`);
});

