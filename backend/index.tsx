//taken from https://typeofnan.dev/your-first-node-express-app-with-typescript/

import express from 'express';

const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(PORT, () => {
  console.log(`Express with Typescript! http://localhost:${PORT}`);
});