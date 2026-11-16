require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const path = require('path');
const csrf = require('csurf');
const { connectDB } = require('./src/config/database');
const routes = require('./routes');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

const app = express();
const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

const missing = ['CONNECTIONSTRING', 'SESSION_SECRET'].filter((name) => !process.env[name]);
if (missing.length) {
  // Do not expose credentials or other secrets in logs.
  console.error(`Variáveis obrigatórias ausentes: ${missing.join(', ')}`);
}

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

// Diagnóstico de runtime, sem revelar dados de conexão ou segredos.
app.get('/health', (req, res) => {
  res.status(missing.length ? 503 : 200).json({
    status: missing.length ? 'configuration_error' : 'running',
    database: 'not_checked'
  });
});

if (!missing.length) {
  // A single MongoDB client is shared by Mongoose and the session store.
  // Do not create a second MongoClient for each serverless invocation.
  const clientPromise = connectDB();
  // Handle connection failures even if no request reaches the session store.
  clientPromise.catch(() => {});

  const store = MongoStore.create({
    clientPromise,
    dbName: process.env.MONGODB_DB_NAME || undefined,
    collectionName: 'sessions',
    ttl: 7 * 24 * 60 * 60,
    touchAfter: 24 * 60 * 60,
    autoRemove: 'native'
  });
  store.on('error', (error) => console.error('Erro no armazenamento de sessões:', error.message));

  app.use(async (req, res, next) => {
    try {
      await connectDB();
      next();
    } catch (error) {
      console.error('MongoDB indisponível:', error.message);
      res.status(503).send('Serviço temporariamente indisponível. Tente novamente mais tarde.');
    }
  });

  app.use(session({
    name: 'agenda.sid',
    secret: process.env.SESSION_SECRET,
    store,
    resave: false,
    saveUninitialized: false,
    rolling: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax'
    }
  }));
  app.use(flash());
  app.use(csrf());
  app.use(middlewareGlobal);
  app.use(checkCsrfError);
  app.use(csrfMiddleware);
  app.use(routes);
} else {
  app.use((req, res) => res.status(503).send('Configuração do servidor incompleta.'));
}

app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err.message);
  if (res.headersSent) return next(err);
  res.status(500).send('Erro interno no servidor.');
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor disponível em http://localhost:${PORT}`));
}
module.exports = app;
