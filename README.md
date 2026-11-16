# 📒 Agenda Profissional

### Gerencie seus contatos de forma simples, segura e organizada.

Aplicação **full stack** desenvolvida com **Node.js, Express, MongoDB e EJS** para cadastro de usuários e gerenciamento de contatos. O projeto reúne autenticação, sessões persistidas no MongoDB, operações de cadastro, consulta, edição e exclusão de contatos e integração com a API ViaCEP.

[**🌐 Acessar aplicação**](https://projeto-agenda-amber.vercel.app/) · [**💻 GitHub**](https://github.com/DevElyShow/projeto-agenda)

> O projeto utiliza um banco de dados e requer que o serviço esteja configurado e disponível para funcionar corretamente.

## 🖥️ Visão geral

### Página inicial

Apresentação da Agenda Profissional, com acesso às opções de login e criação de conta.

![Página inicial da Agenda Profissional](assets/images/01-pagina-inicial.png)

### Cadastro de usuários

Formulário para criar uma conta com e-mail e senha.

![Formulário de cadastro de usuário](assets/images/02-cadastro-usuario.png)

Após o cadastro, a aplicação apresenta uma confirmação e orienta o usuário a entrar.

![Mensagem de usuário criado com sucesso](assets/images/03-cadastro-sucesso.png)

### Validação de acesso

O sistema exibe mensagens de erro quando as credenciais informadas não são válidas.

![Validação de senha inválida](assets/images/04-validacao-login.png)

### Área de contatos

Depois da autenticação, o usuário acessa a agenda, com busca de contatos e ações para gerenciá-los.

![Agenda de contatos após login](assets/images/05-dashboard-contatos.png)

### Cadastro e edição de contatos

Formulário com dados pessoais e campos de endereço, incluindo CEP e rua.

![Formulário de criação e edição de contato](assets/images/06-formulario-contato.png)

### Contato salvo com sucesso

Após registrar um contato, a aplicação apresenta uma confirmação e o novo registro na listagem, com opções de editar ou excluir.

![Contato cadastrado com sucesso na listagem](assets/images/07-contato-cadastrado.png)

## ✨ Funcionalidades

- Cadastro e autenticação de usuários com senhas protegidas por hash usando `bcryptjs`.
- Sessões de usuário armazenadas no MongoDB com `express-session` e `connect-mongo`.
- Rotas protegidas para acesso à agenda e ao gerenciamento de contatos.
- CRUD de contatos: cadastrar, listar, editar e excluir.
- Busca de contatos pelo nome.
- Campos de endereço e consulta de CEP por meio de integração com o ViaCEP.
- Mensagens de confirmação e validação de operações.
- Interface responsiva com templates EJS.

## 🛠️ Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Back-end | Node.js, Express |
| Banco de dados | MongoDB, Mongoose |
| Interface | EJS, HTML, CSS, JavaScript |
| Autenticação e sessões | bcryptjs, express-session, connect-mongo |
| Segurança e validação | csurf, Helmet, validator |
| Integrações | Axios, API ViaCEP |
| Build e deploy | Webpack, Babel, Vercel |

## 🏗️ Arquitetura

O código utiliza a separação **MVC (Model–View–Controller)**:

- **Models (`src/models`)**: modelos e acesso aos dados.
- **Views (`src/views`)**: templates EJS exibidos ao usuário.
- **Controllers (`src/controllers`)**: regras de processamento e ações das rotas.
- **Middlewares (`src/middlewares`)**: autenticação e tratamento das requisições.
- **Configuração (`src/config`)**: conexão com o banco de dados.
- **Rotas (`routes.js`)**: endpoints da aplicação.
- **Entrada (`server.js`)**: configuração e inicialização do Express.

## 🚀 Executar localmente

**Pré-requisitos:** Node.js compatível com o `package.json`, npm e um banco MongoDB acessível.

```bash
git clone https://github.com/DevElyShow/projeto-agenda.git
cd projeto-agenda
npm install
```

Crie um arquivo `.env` na raiz do projeto, com base no `.env.example`:

```env
CONNECTIONSTRING=mongodb+srv://USUARIO:SENHA@SEU_CLUSTER.mongodb.net/NOME_DO_BANCO
SESSION_SECRET=SUBSTITUA_POR_UMA_CHAVE_ALEATORIA_FORTE
```

> Nunca publique o arquivo `.env` nem compartilhe credenciais do banco. Confirme os nomes das variáveis com o código da versão que estiver utilizando.

Gere os recursos do front-end e inicie a aplicação:

```bash
npm run build
npm start
```

Acesse `http://localhost:3000` (ou a porta configurada no ambiente).

## ☁️ Deploy na Vercel

Configure `CONNECTIONSTRING` e `SESSION_SECRET` nas **Environment Variables** do projeto na Vercel. Confirme também que o cluster MongoDB Atlas está ativo e que a configuração de rede permite a conexão da aplicação. Depois, publique um novo deployment.

O projeto inclui o arquivo `vercel.json` e orientações adicionais em `DEPLOY-VERCEL.md`.

## 🎯 Aprendizados

Este projeto foi desenvolvido para praticar arquitetura MVC, criação de rotas, autenticação, persistência em banco NoSQL, consumo de APIs, validação de formulários e publicação de aplicações Node.js.

## 👨‍💻 Autor

Desenvolvido por **Elydeivison Cesar**.

[GitHub](https://github.com/DevElyShow) · [LinkedIn](https://www.linkedin.com/in/elydeivisoncesar/)
