import fs from 'fs';

const fileName = 'stat.json'

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

export default {
  read,
  write,
};
