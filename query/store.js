import fs from 'fs';

const fileName = 'query.json'

const read = () => {
  if (fs.existsSync(fileName)) {
    const posts = fs.readFileSync(fileName);
    return JSON.parse(posts);
  } else {
    return {};
  }
};

const write = (posts) => {
  fs.writeFileSync(fileName, JSON.stringify(posts));
};

const restart = () => {
  fs.writeFileSync(fileName, '{}');
}

export default {
  read,
  write,
  restart,
};
