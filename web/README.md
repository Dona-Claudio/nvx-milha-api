# NVX Fibra LTDA - Sistema de Gerenciamento de Milhas

Frontend web para gerenciar milhas de fibra óptica da NVX.

## 📁 Estrutura de Pastas

```
web/
├── pages/
│   ├── login.html          # Página de login
│   └── dashboard.html      # Página principal (dashboard)
├── styles/
│   ├── global.css          # Estilos globais (tema cinza+roxo)
│   ├── login.css           # Estilos da página de login
│   └── dashboard.css       # Estilos do dashboard
├── scripts/
│   ├── api-client.js       # Cliente HTTP para API
│   ├── auth-service.js     # Serviço de autenticação
│   ├── milha-service.js    # Serviço de gerenciamento de milhas
│   ├── ui-manager.js       # Gerenciador de elementos da UI
│   ├── login.js            # Lógica da página de login
│   └── dashboard.js        # Lógica do dashboard
└── assets/                 # Imagens e recursos (quando necessário)
```

## 🎨 Design

- **Cores Principais**: Cinza (#2c2c2c, #f5f5f5) + Roxo (#7b2cbf, #c77dff)
- **Estilo**: Minimalista e moderno
- **Responsivo**: Funciona em desktop e mobile

## 🚀 Como Usar

### 1. Configurar a API

Certifique-se de que a API Spring Boot está rodando em `http://localhost:8080`.

Para iniciar:
```bash
cd api/milha
./gradlew.bat bootRun --no-daemon
```

### 2. Abrir o Frontend

- Abra o arquivo `pages/login.html` em um navegador
- Ou use um servidor local (recomendado para evitar problemas CORS)

**Usando Python:**
```bash
cd web
python -m http.server 8000
```

Depois acesse: `http://localhost:8000/pages/login.html`

**Usando Node.js (http-server):**
```bash
npm install -g http-server
cd web
http-server -p 8000
```

### 3. Fazer Login

Use as credenciais de um usuário cadastrado na API:
- Email: `seu@email.com`
- Senha: `sua_senha`

## 📋 Funcionalidades

### Autenticação
- ✅ Login com email e senha
- ✅ Sessão persistente (localStorage)
- ✅ Logout

### Milhas
- ✅ Listar todas as milhas
- ✅ Buscar por nome, cliente ou IP (case-insensitive)
- ✅ Criar nova milha
- ✅ Editar milha existente
- ✅ Deletar milha com confirmação

## 🔧 Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend API**: Spring Boot (Groovy)
- **Banco de Dados**: MySQL
- **Autenticação**: Simples (localStorage)

## 📝 Endpoints da API Utilizados

- `POST /api/usuarios/login` - Fazer login
- `GET /api/milhas` - Listar milhas
- `GET /api/milhas/buscar/{termo}` - Buscar milhas
- `POST /api/milhas` - Criar milha
- `PUT /api/milhas/{id}` - Editar milha
- `DELETE /api/milhas/{id}` - Deletar milha

## 🐛 Troubleshooting

### CORS Error

Se receber erro de CORS, a API está respondendo com headers incorretos. Verifique se `@CrossOrigin` está configurado no controller.

### Login não funciona

1. Verifique se a API está rodando (`http://localhost:8080/api/usuarios/login`)
2. Verifique as credenciais do usuário
3. Verifique se o usuário existe no banco de dados

### Milhas não aparecem

1. Verifique se está logado
2. Verifique a conexão com a API
3. Abra o console do navegador (F12) para ver erros

## 📱 Responsividade

O design é totalmente responsivo:
- Desktop (1200px+)
- Tablet (768px - 1200px)
- Mobile (< 768px)

## 🔐 Segurança

⚠️ **Nota**: Este é um exemplo educacional. Para produção:
- Use JWT/OAuth para autenticação
- Implemente HTTPS
- Valide todos os inputs no backend
- Use headers de segurança apropriados
- Não armazene senhas em plaintext

## 📄 Licença

© 2026 NVX Fibra LTDA. Todos os direitos reservados.
