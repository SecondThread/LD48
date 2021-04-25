//taken from https://typeofnan.dev/your-first-node-express-app-with-typescript/

import express from 'express';
import mongoose from 'mongoose';
import routes from './backendRoutes';

const app = express();
app.use(express.json());
app.use('/api', routes);
const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
};

const PORT = 3001;
mongoose.connect('mongodb://localhost:27017/under', options)
	.then(() => console.log(`Connected to MongoDB...`))
	.catch((e) => console.error('Could not connect to DB '+e));

app.listen(PORT, () => {
  console.log(`Express with Typescript! http://localhost:${PORT}`);
});