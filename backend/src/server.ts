import express from 'express';
import cors from 'cors'
import 'express-async-errors'
import {getRepository} from 'typeorm';
import Orphanage from './models/Orphanage';
import './database/connection'
import routes from './routes'
import path from 'path'
import errors_handler from './errors/handlers'

const app = express();
app.use(cors())
app.use(express.json());
app.use(routes);
app.use('/uploads',express.static(path.join(__dirname,'..','uploads')))
app.use(errors_handler)
app.listen(3333);