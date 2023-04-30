import 'express-async-errors';
import 'dotenv/config'
import express from 'express';
import morgan from 'morgan';
// import { startup } from './lib/setup.js';

import router from './routes.js'; // Importa as rotas

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

app.use('/', express.static('public'));
app.use('/', router);
// app.use('/', startup());


app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000")
});

