# 📦 Melhor Envio - API de Tracking

API RESTful para integração entre SprintHub CRM e Melhor Envio, com processamento de webhooks e rastreamento de pedidos.

## 🎯 Funcionalidades

- ✅ Recebe requisições do SprintHub com IDs de rastreamento
- ✅ Consulta API do Melhor Envio automaticamente
- ✅ Trata dados com chaves dinâmicas retornadas pela API
- ✅ Envia resposta via webhook para o SprintHub
- ✅ Totalmente dockerizado e pronto para deploy no Portainer
- ✅ CI/CD automatizado com GitHub Actions
- ✅ Integração com Traefik para SSL automático

## 🏗️ Arquitetura

```
SprintHub CRM  →  [POST] rastreio.oficialmed.com.br/tracking
                         ↓
                   Consulta Melhor Envio API
                         ↓
                   Trata dados dinâmicos
                         ↓
                   [Webhook] → SprintHub CRM
```

## 📁 Estrutura do Projeto

```
melhor-envio-status/
├── server.js                    # Servidor Express principal
├── melhor-envio-tracking.js     # Script legado (referência)
├── package.json                 # Dependências Node.js
├── Dockerfile                   # Configuração Docker
├── docker-compose.yml           # Stack do Portainer
├── .dockerignore               # Arquivos ignorados no build
├── .github/
│   └── workflows/
│       └── docker-build.yml     # CI/CD GitHub Actions
└── README.md                    # Esta documentação
```

## 🚀 Endpoints da API

### 1. Health Check

**GET /** ou **GET /health**

Verifica se o serviço está online.

```bash
curl https://rastreio.oficialmed.com.br/health
```

**Resposta:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-18T12:00:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

---

### 2. Rastreamento de Pedidos

**POST /tracking**

Endpoint principal para consultar rastreamento no Melhor Envio.

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "orders": ["a0234c5e-0a48-4e0d-abca-3b862b668451"],
  "webhook_url": "https://seu-sprinthub.com/webhook/callback"
}
```

**Parâmetros:**
- `orders` (array, obrigatório): Array com IDs de correio do Melhor Envio
- `webhook_url` (string, opcional): URL para enviar resposta via webhook

**Resposta (sem webhook_url):**
```json
{
  "success": true,
  "data": {
    "id": "a0234c5e-0a48-4e0d-abca-3b862b668451",
    "protocol": "ORD-202510120479645",
    "status": "pending",
    "tracking": null,
    "melhorenvio_tracking": null,
    "created_at": "2025-10-17 20:57:35",
    "paid_at": null,
    "generated_at": null,
    "posted_at": null,
    "delivered_at": null,
    "canceled_at": null,
    "expired_at": null
  },
  "processedAt": "2025-10-18T12:00:00.000Z",
  "duration": "345ms"
}
```

**Resposta (com webhook_url):**
```json
{
  "success": true,
  "message": "Requisição processada e webhook enviado",
  "tracking": {
    "success": true,
    "data": { ... }
  },
  "webhook": {
    "success": true,
    "status": 200
  },
  "processedAt": "2025-10-18T12:00:00.000Z",
  "duration": "456ms"
}
```

---

### 3. Webhook do Melhor Envio

**POST /webhook**

Endpoint para receber atualizações automáticas do Melhor Envio (se configurado).

---

## 🐳 Deploy com Docker

### Opção 1: Docker Compose Local

```bash
# 1. Clone o repositório
git clone https://github.com/oficialmedpro/melhor-envio-status.git
cd melhor-envio-status

# 2. Crie o arquivo .env
echo "MELHOR_ENVIO_TOKEN=seu_token_aqui" > .env

# 3. Build da imagem
docker build -t oficialmedpro/melhor-envio-tracking:latest .

# 4. Execute o container
docker run -d \
  --name melhor-envio-tracking \
  -p 3000:3000 \
  -e MELHOR_ENVIO_TOKEN=seu_token_aqui \
  oficialmedpro/melhor-envio-tracking:latest
```

### Opção 2: Portainer Stack (Recomendado)

1. **Criar Secret no Docker Swarm:**

```bash
echo "seu_token_melhor_envio_aqui" | docker secret create MELHOR_ENVIO_TOKEN -
```

2. **Deploy da Stack no Portainer:**

- Acesse Portainer → Stacks → Add Stack
- Cole o conteúdo do `docker-compose.yml`
- Clique em "Deploy the stack"

3. **Configurar DNS:**

Aponte `rastreio.oficialmed.com.br` para o IP do seu servidor Docker Swarm.

---

## ⚙️ Configuração do GitHub Actions

### 1. Criar Secrets no GitHub

Acesse: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

Crie os seguintes secrets:

| Nome | Descrição |
|------|-----------|
| `DOCKERHUB_USERNAME` | Usuário do Docker Hub (`oficialmedpro`) |
| `DOCKERHUB_TOKEN` | Token de acesso do Docker Hub |

### 2. Obter Token do Docker Hub

1. Acesse https://hub.docker.com/settings/security
2. Clique em "New Access Token"
3. Nome: `GitHub Actions CI/CD`
4. Permissões: `Read, Write, Delete`
5. Copie o token gerado

### 3. Workflow Automático

O workflow é acionado automaticamente quando você faz:
- `git push` na branch `main`
- Cria uma tag de versão (ex: `v1.0.0`)
- Manualmente via "Actions" tab no GitHub

**Build manual:**
```bash
# Via interface do GitHub
GitHub → Actions → Build and Push Docker Image → Run workflow
```

---

## 🧪 Testando Localmente

### Sem Docker:

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variável de ambiente
export MELHOR_ENVIO_TOKEN="seu_token_aqui"

# 3. Executar servidor
npm start
```

### Testar endpoint:

```bash
# Health check
curl http://localhost:3000/health

# Tracking (sem webhook)
curl -X POST http://localhost:3000/tracking \
  -H "Content-Type: application/json" \
  -d '{
    "orders": ["a0234c5e-0a48-4e0d-abca-3b862b668451"]
  }'

# Tracking (com webhook)
curl -X POST http://localhost:3000/tracking \
  -H "Content-Type: application/json" \
  -d '{
    "orders": ["a0234c5e-0a48-4e0d-abca-3b862b668451"],
    "webhook_url": "https://webhook.site/seu-id-unico"
  }'
```

---

## 🔐 Segurança

- ✅ Token do Melhor Envio armazenado como Docker Secret
- ✅ Container roda com usuário não-root
- ✅ CORS configurado
- ✅ SSL automático via Traefik + Let's Encrypt
- ✅ Health checks configurados
- ✅ Timeout de 10s em webhooks externos

---

## 📊 Monitoramento

### Logs do Container:

```bash
# Docker Swarm
docker service logs -f melhor-envio-tracking_melhor-envio-tracking

# Docker Compose
docker logs -f melhor-envio-tracking
```

### Métricas:

O servidor possui health check endpoint que pode ser integrado com:
- Prometheus
- Grafana
- UptimeRobot
- Uptime Kuma

---

## 🛠️ Variáveis de Ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `PORT` | `3000` | Porta do servidor |
| `NODE_ENV` | `production` | Ambiente de execução |
| `MELHOR_ENVIO_TOKEN` | - | Token de autenticação da API Melhor Envio |
| `USER_AGENT` | `Aplicação mkt.oficialmed@gmail.com` | User-Agent das requisições |

---

## 📝 Exemplos de Integração

### SprintHub CRM → API

```javascript
// Exemplo de chamada do SprintHub para a API
const response = await fetch('https://rastreio.oficialmed.com.br/tracking', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    orders: [idCorreio],
    webhook_url: 'https://sprinthub.com/api/webhook/tracking-response'
  })
});

const result = await response.json();
console.log(result);
```

### API → SprintHub CRM (Webhook Response)

Os dados serão enviados via POST para o `webhook_url` fornecido:

```json
{
  "success": true,
  "data": {
    "id": "a0234c5e-0a48-4e0d-abca-3b862b668451",
    "protocol": "ORD-202510120479645",
    "status": "delivered",
    "tracking": "BR123456789BR",
    ...
  },
  "processedAt": "2025-10-18T12:00:00.000Z"
}
```

---

## 🔄 Fluxo Completo

1. **SprintHub** envia requisição POST para `rastreio.oficialmed.com.br/tracking`
2. **API** valida os dados recebidos
3. **API** consulta `www.melhorenvio.com.br/api/v2/me/shipment/tracking`
4. **Melhor Envio** retorna dados com chave dinâmica
5. **API** trata os dados (remove chave dinâmica, normaliza estrutura)
6. **API** envia dados tratados via webhook para SprintHub
7. **SprintHub** recebe e processa os dados normalizados

---

## 📦 Versionamento

Este projeto segue o [Semantic Versioning](https://semver.org/):

- **MAJOR**: Mudanças incompatíveis na API
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs

```bash
# Criar nova versão
git tag v1.0.0
git push origin v1.0.0
```

O GitHub Actions fará build automático com a tag de versão.

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Minha nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

ISC License - OficialMed © 2025

---

## 🆘 Suporte

- **Email**: mkt.oficialmed@gmail.com
- **GitHub Issues**: [https://github.com/oficialmedpro/melhor-envio-status/issues](https://github.com/oficialmedpro/melhor-envio-status/issues)

---

## 🎉 Changelog

### v1.0.0 (2025-10-18)
- ✨ Servidor Express.js com endpoints REST
- ✨ Integração completa com API Melhor Envio
- ✨ Sistema de webhooks para SprintHub
- ✨ Tratamento de dados com chaves dinâmicas
- ✨ Dockerização completa
- ✨ CI/CD com GitHub Actions
- ✨ Stack pronta para Portainer
- ✨ SSL automático com Traefik
