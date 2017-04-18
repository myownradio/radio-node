import { config } from 'dotenv';
import app from './';

config();

app(process.env.PORT, process.env.BACKEND);
