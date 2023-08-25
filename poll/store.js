import { MongoClient } from 'mongodb';

const url = 'mongodb://admin:password@database:27017';
const dbName = 'db';
const collectionName = 'polls';


let collection;
async function connectToMongo() {
  // check if collection exists; make it exist if it doesn't
  if (!collection) {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(dbName);
    collection = db.collection(collectionName);
  }
  return collection;
};


async function addPoll(id, title, options) {
  const polls = await connectToMongo();

  // take options array and convert to array of objects
  options = options.map(o => {
    return {
      option: o,
      votes: 0
    };
  });

  const newPoll = {
      _id: id, 
      title,
      options
  };

  const result = await polls.insertOne(newPoll);
  return result.insertedId;
}

async function addVotesToOption(pollId, optionName) {
  const polls = await connectToMongo();

  const result = await polls.updateOne(
    // finds the poll with the correct id, and the option with the correct name
    { _id: ObjectId(pollId), 'options.option': optionName },
    // here the $ substitutes for the option that was found
    { $inc: { 'options.$.votes': 1 } }
  );

  // returns the number of documents modified
  return result.modifiedCount;
}

async function readAllPolls() {
  const polls = await connectToMongo();

  // returns all polls as an array, 
  // (as opposed to a 'cursor' pointing to the first array element)
  const allPolls = await polls.find().toArray();
  return allPolls;
}


export default {
  addPoll,
  readAllPolls,
  addVotesToOption
};
