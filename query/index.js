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


app.get('/polls', async (req, res) => {
    logger.info(`(Process ID ${process.pid}) Query Service: responding to query`);


    const polls = await store.readAllPolls();


    // convert to object for ... so I don't need to redo the frontend
    const query = {};
    polls.forEach(poll => {
      /* 
        Currently, a poll is like this:

        const newPoll = {
            _id: id, // User-defined ID
            title,
            options
        };

        So the polls response would be like this:

        [
          {
            _id,
            title,
            options : [
              { option, votes},
              ...
            ]
          },
          ...
        ]

        We switched to this new format because of MongoDB, but the UI expects the old format based off of JSON objects.
        So, we want it to look like this:

        This is what the response will look like:
        {
          id: {
            id,
            title,
            options: {
              option1: votes,
              option2: votes,
              ...
            }
          }
        }
        
        Therefore, we need to convert each poll to the correct format, and put it into the query object
      */

      const newPoll = {
        id: poll._id,
        title: poll.title,
        options: {}
      };
      poll.options.forEach(o => {
        newPoll.options[o.option] = o.votes;
      });

      query[poll._id] = newPoll;
    });

    console.log("query", query);



    res.status(200).send(query);
});



app.post('/events', (req, res) => {
    logger.info(`(Process ID ${process.pid}) Received event: ${req.body.type}`);

    // const query = store.read();


    // if (req.body.type === 'PollCreated') {
    //     const { id, title, options } = req.body.data;
        
    //     query[id] = { id, title };
    //     query[id].options = {};

    //     options.forEach(option => {
    //         query[id].options[option] = 0;
    //     });

    // }

    // else if (req.body.type === 'RadioChosen') {
    //     const { pollId, radioOption, count } = req.body.data;
    //     logger.info("query", pollId, radioOption, count);

    //     let options = query[pollId].options || {};
    //     options[radioOption] = count;
    //     query[pollId].options = options;

    // }

    // store.write(query);
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