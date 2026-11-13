const express = require('express');
const route = express.Router();

const homeController = require('./src/controllers/homeController');
const contatoController = require('./src/controllers/contatoController');
const loginController = require('./src/controllers/loginController');
const loginRequired = require('./src/middlewares/loginRequired');

const axios = require('axios');


// ===============================
// ROTAS HOME
// ===============================
route.get('/', homeController.landing);

// Dashboard protegido
route.get('/dashboard', loginRequired, homeController.dashboard);

route.post('/', homeController.trataPost);


// ===============================
// ROTAS CONTATO (PROTEGIDAS)
// ===============================

// LISTAR CONTATOS
route.get('/contato', loginRequired, contatoController.index);

// 🔥 IMPORTANTE: cadastro precisa vir ANTES de /:id
route.get('/contato/cadastro', loginRequired, contatoController.cadastro);

// REGISTRAR
route.post('/contato/register', loginRequired, contatoController.register);

// EDITAR (abrir formulário)
route.get('/contato/:id', loginRequired, contatoController.editIndex);

// SALVAR EDIÇÃO
route.post('/contato/edit/:id', loginRequired, contatoController.edit);

// DELETAR
route.get('/contato/delete/:id', loginRequired, contatoController.delete);


// ===============================
// LOGIN E CADASTRO
// ===============================
route.get('/login', loginController.index);
route.post('/login/register', loginController.register);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);


// ===============================
// VIA CEP (PROXY PARA EVITAR CORS)
// ===============================
route.get('/buscar-cep/:cep', async (req, res) => {
  try {
    const { cep } = req.params;
    if (!/^\d{8}$/.test(cep)) return res.status(400).json({ erro: true, mensagem: 'CEP inválido' });
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ erro: true });
  }
});


module.exports = route;