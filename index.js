import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose';
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'

const app = express();
import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const socketIO = new Server(httpServer, {
    cors: { origin : 'http://localhost:3000' }
})

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });
});

app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
app.use(cors());

app.use('/posts', postRoutes)
app.use('/users', userRoutes)

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`Listening on port ${PORT}`)))
    .catch(err => console.log(err))
