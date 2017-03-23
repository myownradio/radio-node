#!/usr/bin/env node

import { config } from 'dotenv';
import startApp from '../';

config();

startApp(process.env.PORT, process.env.BACKEND);
