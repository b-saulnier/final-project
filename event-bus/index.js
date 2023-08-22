import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
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
    the event-bus has an array of objects containing hosts and ports
    it listens to events from these ports, and sends received events to all other ports
*/

const services = [
    {host: 'http://localhost', port: 4000},
    //{host: 'http://localhost', port: 4001},
    {host: 'http://localhost', port: 4002},
    {host: 'http://localhost', port: 4003},
    {host: 'http://localhost', port: 4004},
    {host: 'http://localhost', port: 4005}
];

app.post('/events', (req, res) => {
    // console.log(`(Process ID ${process.pid}) Received event: ${req.body.type}`);

    // console.log(req.body);

    logger.info(`(Process ID ${process.pid}) Received event: ${req.body.type}`);
    logger.info(req.body);


    services.forEach(async service => {
        try {
            const url = `${service.host}:${service.port}/events`;
            //console.log(url);
            logger.info(url);

            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body),
            });
            //console.log(`fetch ${url} succeeded`);
            logger.info(`fetch ${url} succeeded`);
        } catch (err) {
            //console.log(`(Process ID ${process.pid}) Event Bus Service: ${err}`);
            logger.error(`(Process ID ${process.pid}) Event Bus Service: fetch to service ${service.port}: ${err}`);
        }
    });

    res.send({ status: 'OK' });
});




app.listen(4001, () => {
    //console.log(`(Process ID ${process.pid}) Event bus service listening on port 4001`);
    logger.info(`(Process ID ${process.pid}) Event bus service listening on port 4001`);
});