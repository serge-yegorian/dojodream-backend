import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { userRouter } from './routes/users.js';
import { gymRouter } from './routes/gyms.js'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { coachRouter } from './routes/coaches.js';
dotenv.config(); 
const port = process.env.PORT || 4000

mongoose.connect(`mongodb+srv://${process.env.DB_PASSWORD}@dojodream.uy37p2i.mongodb.net/?retryWrites=true&w=majority`)

const app = express()

const corsOptions = {
    origin: ['http://localhost:3000', 'https://magenta-toffee-1e4e9d.netlify.app', 'https://dojodream.com']
  };
  
app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser())

app.use('/users', userRouter)
app.use('/gyms', gymRouter)
app.use('/coaches', coachRouter)


app.listen(port)