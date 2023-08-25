import { MongoClient } from 'mongodb';

const url = 'mongodb://admin:password@database:27017';
const dbName = 'db';
const collectionName = 'polls';


let collection;

// Function to connect to MongoDB and return the collection
const connectToMongo = async () => {
  if (!collection) {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(dbName);
    collection = db.collection(collectionName);
  }
  return collection;
};


// Function to add a poll
async function addPoll(id, title, options) {
  const polls = await connectToMongo();

  options = options.map(o => {
    return {
      option: o,
      votes: 0
    };
  });

  const newPoll = {
      _id: id, // User-defined ID
      title,
      options
  };

  const result = await polls.insertOne(newPoll);
  return result.insertedId;
}

// Function to add votes to an option
async function addVotesToOption(pollId, optionName) {
  const polls = await connectToMongo();

  const result = await polls.updateOne(
    { _id: ObjectId(pollId), 'options.option': optionName },
    { $inc: { 'options.$.votes': 1 } }
  );

  return result.modifiedCount;
}

// Function to read all polls
async function readAllPolls() {
  const polls = await connectToMongo();

  const allPolls = await polls.find().toArray();
  return allPolls;
}

async function restart() {
  const polls = await connectToMongo();
  await polls.deleteMany({});
}


export default {
  addPoll,
  readAllPolls,
  addVotesToOption,
  restart
};
