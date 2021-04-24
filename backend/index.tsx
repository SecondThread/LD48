//taken from https://typeofnan.dev/your-first-node-express-app-with-typescript/

import express from 'express';
import createPrivateRoom from './backendCalls/createPrivateRoom';
import joinPublicRoom from './backendCalls/joinPublicRoom';
import getRoomInfo from './backendCalls/getRoomInfo';
import mongoose from 'mongoose';
import addPlayerToRoom from './backendCalls/addPlayerToRoom';

const app = express();
const PORT = 3001;

// middleware
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.send('Hello world');
});

const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
};

// MongoDB sud
mongoose.connect('mongodb://localhost:27017/under', options)
	.then(() => console.log(`Connected to MongoDB...`))
	.catch((e) => console.error('Could not connect to DB '+e));

app.post('/api/createPrivateRoom', createPrivateRoom);
app.post('/api/joinPublicRoom', joinPublicRoom);
app.post('/api/getRoomInfo', getRoomInfo);
app.post('/api/addPlayerToRoom', addPlayerToRoom);

app.listen(PORT, () => {
  console.log(`Express with Typescript! http://localhost:${PORT}`);
});