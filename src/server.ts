import { config } from 'dotenv';
import app from './app';

config();

app(process.env.PORT, process.env.BACKEND);
