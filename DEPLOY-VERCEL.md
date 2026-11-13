# Publicar a Agenda na Vercel

## 1. Configurar as variáveis
Em **Project > Settings > Environment Variables**, defina `CONNECTIONSTRING` (URI do MongoDB Atlas) e `SESSION_SECRET` (string longa e aleatória). Configure para Production, Preview e Development conforme necessário. Não publique o `.env`.

No MongoDB Atlas, confirme que o cluster está ativo, que o usuário tem acesso ao banco e que as regras de Network Access permitem as conexões da implantação.

## 2. Atualizar dependências e publicar
Instale o Node.js 26 localmente, execute `npm install`, `npm run build` e `npm start` para validar. Commit o `package-lock.json` atualizado e envie ao GitHub.

Na Vercel, mantenha o framework como **Other**, diretório raiz na pasta do projeto e configuração em `vercel.json`. Faça um novo deployment. Se a configuração do projeto estiver fixada em Node 20, altere-a para Node 26 nas configurações de Build and Deployment.

## 3. Diagnóstico
- Erro de variável ausente: confira `CONNECTIONSTRING` e `SESSION_SECRET`.
- Timeout de conexão: confira cluster, URI, usuário e Network Access no Atlas.
- Sessão/login não persiste: confira HTTPS, SESSION_SECRET e store do MongoDB.
- Arquivos JS não carregam: confira o diretório `public/assets/js` e a build.

**Observação:** não foi possível executar uma implantação real na sua conta Vercel nem testar o MongoDB sem credenciais.
