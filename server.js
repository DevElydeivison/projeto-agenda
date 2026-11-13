require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const path = require('path');
const csrf = require('csurf');
const routes = require('./routes');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

const app = express();

if (!process.env.CONNECTIONSTRING) {
  throw new Error('Defina CONNECTIONSTRING nas variáveis de ambiente.');
}
if (!process.env.SESSION_SECRET) {
  throw new Error('Defina SESSION_SECRET nas variáveis de ambiente.');
}

// Necessário atrás do proxy da Vercel (cookies/sessão)
app.set('trust proxy', 1);

// ===============================
// CONEXÃO COM O MONGO (reaproveitada entre requisições)
// ===============================
let connectionPromise = null;

function connectDB() {
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.CONNECTIONSTRING, {
        serverSelectionTimeoutMS: 8000
      })
      .catch((err) => {
        connectionPromise = null; // permite tentar de novo na próxima requisição
        throw err;
      });
  }
  return connectionPromise;
}

// Garante que o banco está conectado antes de qualquer rota
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Erro ao conectar no MongoDB:', err);
    res.status(500).send('Erro ao conectar no banco de dados.');
  }
});

// ===============================
// CONFIGURAÇÕES
// ===============================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({
      mongoUrl: process.env.CONNECTIONSTRING,
      touchAfter: 24 * 3600
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    }
  })
);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf());
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

// ===============================
// EXECUÇÃO
// ===============================
// Local: `node server.js` sobe o servidor.
// Vercel: o arquivo é importado, então só exportamos o app.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Acessar http://localhost:${PORT}`);
  });
}

module.exports = app;
