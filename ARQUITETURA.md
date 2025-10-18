# 📚 Documentação da Arquitetura do Projeto

Este documento explica a função de cada arquivo no projeto `melhor-envio-status`.

---

## 📁 Arquivos do Projeto

### **server.js**
**Função**: Servidor principal da aplicação Express.js

**O que faz**:
- Cria o servidor web HTTP na porta 3000
- Define 4 endpoints REST (/, /health, /tracking, /webhook)
- Recebe requisições do SprintHub com IDs de rastreamento
- Faz requisições para a API do Melhor Envio
- Trata dados com chaves dinâmicas retornados pela API
- Envia webhooks de resposta para o SprintHub
- Registra logs detalhados de todas as operações
- Gerencia erros e timeouts

**Dependências**: express, axios, cors, dotenv

---

### **melhor-envio-tracking.js**
**Função**: Script legado de exemplo (mantido apenas como referência)

**O que faz**:
- Exemplo original de consulta à API Melhor Envio
- Executa uma única requisição e exibe o resultado no console
- Não é usado em produção (substituído pelo server.js)

**Status**: Arquivo histórico, não utilizado pelo servidor

---

### **package.json**
**Função**: Manifesto do projeto Node.js

**O que faz**:
- Define nome, versão e descrição do projeto
- Lista todas as dependências necessárias (axios, express, cors, dotenv)
- Define scripts NPM (start, dev, test)
- Especifica metadados (autor, licença, keywords)

**Dependências principais**:
- `express`: Framework web para criar APIs REST
- `axios`: Cliente HTTP para fazer requisições
- `cors`: Middleware para permitir requisições cross-origin
- `dotenv`: Carrega variáveis de ambiente de arquivos .env

---

### **package-lock.json**
**Função**: Lock file das dependências

**O que faz**:
- Trava as versões exatas de todas as dependências e sub-dependências
- Garante builds reproduzíveis
- Gerado automaticamente pelo NPM

**Status**: Não deve ser editado manualmente

---

### **Dockerfile**
**Função**: Receita para construir a imagem Docker

**O que faz**:
- Define imagem base (Node.js 18 Alpine)
- Copia código da aplicação para o container
- Instala dependências do NPM
- Configura usuário não-root para segurança
- Expõe porta 3000
- Define comando de inicialização (node server.js)
- Configura health check automático

**Build**: `docker build -t oficialmedpro/melhor-envio-tracking .`

---

### **docker-compose.yml**
**Função**: Stack do Docker Swarm para deploy no Portainer

**O que faz**:
- Define o serviço `melhor-envio-tracking`
- Configura imagem Docker Hub a ser usada
- Define rede `OficialMed` (externa)
- Configura secrets (MELHOR_ENVIO_TOKEN)
- Define variáveis de ambiente
- Configura labels do Traefik para:
  - Roteamento HTTP/HTTPS
  - Certificado SSL automático (Let's Encrypt)
  - Redirecionamento www → raiz
  - Redirecionamento HTTP → HTTPS
- Define recursos (CPU, memória)
- Configura política de restart

**Deploy**: Via Portainer → Stacks → Add Stack

---

### **.dockerignore**
**Função**: Lista de arquivos ignorados no build Docker

**O que faz**:
- Exclui arquivos desnecessários da imagem Docker
- Reduz tamanho final da imagem
- Melhora velocidade de build

**Arquivos ignorados**:
- `node_modules` (reinstalado no container)
- `.git` (histórico Git não necessário)
- `.env` (secrets vêm de Docker Secrets)
- `docker-compose.yml` (apenas para deploy)
- `melhor-envio-tracking.js` (arquivo legado)

---

### **.gitignore**
**Função**: Lista de arquivos ignorados pelo Git

**O que faz**:
- Evita commit de arquivos sensíveis e temporários
- Mantém repositório limpo

**Arquivos ignorados típicos**:
- `node_modules/`
- `.env`
- `*.log`

---

### **.github/workflows/docker-build.yml**
**Função**: Workflow CI/CD do GitHub Actions

**O que faz**:
- Detecta push na branch main ou tags de versão
- Faz checkout do código
- Autentica no Docker Hub
- Extrai metadados (versão, tags)
- Faz build da imagem Docker
- Publica imagem no Docker Hub
- Gera relatório de build

**Triggers**:
- Push na branch `main`
- Criação de tags (ex: v1.0.0)
- Execução manual via interface GitHub

**Outputs**:
- Imagem: `oficialmedpro/melhor-envio-tracking:latest`
- Tags adicionais: versões, SHA do commit

---

### **README.md**
**Função**: Documentação principal do projeto

**O que contém**:
- Visão geral do projeto
- Instruções de instalação e uso
- Documentação dos endpoints da API
- Guia de deploy (Docker, Portainer)
- Configuração do GitHub Actions
- Exemplos de integração
- Fluxo completo de funcionamento
- Troubleshooting e monitoramento

**Público**: Desenvolvedores e usuários finais

---

### **ARQUITETURA.md** (este arquivo)
**Função**: Documentação técnica da arquitetura

**O que contém**:
- Explicação detalhada de cada arquivo
- Propósito e responsabilidade de cada componente
- Diagramas de fluxo
- Detalhes de integração

**Público**: Desenvolvedores e mantenedores do projeto

---

## 🔄 Fluxo de Dados

```
┌─────────────┐
│ SprintHub   │
│    CRM      │
└──────┬──────┘
       │ POST /tracking
       │ { orders: [...], webhook_url: "..." }
       ↓
┌─────────────────────────────────────┐
│  server.js (Express)                │
│  ┌────────────────────────────────┐ │
│  │ Endpoint: POST /tracking       │ │
│  │ - Valida dados                 │ │
│  │ - Chama consultarMelhorEnvio() │ │
│  └────────────┬───────────────────┘ │
└───────────────┼─────────────────────┘
                │
                │ POST https://melhorenvio.com.br/api/v2/me/shipment/tracking
                │ { orders: ["id_correio"] }
                ↓
┌──────────────────────────┐
│  API Melhor Envio        │
│  Retorna:                │
│  {                       │
│    "id_dinamico": {      │
│      protocol: "...",    │
│      status: "...",      │
│      ...                 │
│    }                     │
│  }                       │
└──────────┬───────────────┘
           │
           ↓
┌─────────────────────────────────────┐
│  server.js                          │
│  ┌────────────────────────────────┐ │
│  │ Trata dados:                   │ │
│  │ - Remove chave dinâmica        │ │
│  │ - Adiciona "id" como prop      │ │
│  │ - Normaliza estrutura          │ │
│  └────────────┬───────────────────┘ │
└───────────────┼─────────────────────┘
                │
                │ POST webhook_url (do SprintHub)
                │ { success: true, data: { id: "...", ... } }
                ↓
┌─────────────┐
│ SprintHub   │
│    CRM      │
│ (recebe)    │
└─────────────┘
```

---

## 🐳 Fluxo de Deploy

```
1. Desenvolvedor faz commit e push
   └─> git push origin main

2. GitHub detecta push
   └─> Aciona workflow .github/workflows/docker-build.yml

3. GitHub Actions:
   ├─> Faz checkout do código
   ├─> Login no Docker Hub
   ├─> Build da imagem usando Dockerfile
   └─> Push para oficialmedpro/melhor-envio-tracking:latest

4. No servidor (via Portainer):
   ├─> Pull da imagem do Docker Hub
   ├─> Cria container com docker-compose.yml
   ├─> Injeta secrets (MELHOR_ENVIO_TOKEN)
   └─> Traefik configura:
       ├─> SSL/TLS (Let's Encrypt)
       ├─> Roteamento (rastreio.oficialmed.com.br)
       └─> Load balancing

5. Aplicação disponível em:
   └─> https://rastreio.oficialmed.com.br
```

---

## 🔐 Segurança

### **Secrets do Docker Swarm**
- `MELHOR_ENVIO_TOKEN`: Token da API Melhor Envio
- Não fica exposto em variáveis de ambiente
- Montado como arquivo read-only em `/run/secrets/`

### **Secrets do GitHub**
- `DOCKERHUB_USERNAME`: Usuário Docker Hub
- `DOCKERHUB_TOKEN`: Token de acesso Docker Hub
- Usados apenas no CI/CD

### **Container Security**
- Roda com usuário não-root (nodejs:1001)
- Imagem Alpine (menor superfície de ataque)
- Dependências fixadas (package-lock.json)
- Health checks configurados

---

## 📊 Monitoramento

### **Logs**
```bash
# Ver logs em tempo real
docker service logs -f melhor-envio-tracking_melhor-envio-tracking

# Formato dos logs
[Request] Body: {...}
[Melhor Envio] Consultando rastreamento: [...]
[Melhor Envio] Status: 200
[Webhook] Enviando para: https://...
[Webhook] Enviado com sucesso. Status: 200
[Resposta] Processamento completo (456ms)
```

### **Health Check**
- Endpoint: `GET /health`
- Intervalo: 30 segundos
- Timeout: 3 segundos
- Retries: 3 tentativas

---

## 🛠️ Manutenção

### **Atualizar dependências**
```bash
npm update
npm audit fix
git commit -am "chore: update dependencies"
git push
```

### **Nova versão**
```bash
git tag v1.1.0
git push origin v1.1.0
# GitHub Actions fará build automático
```

### **Trocar token Melhor Envio**
```bash
# No servidor Docker Swarm
echo "novo_token_aqui" | docker secret create MELHOR_ENVIO_TOKEN_V2 -

# Atualizar docker-compose.yml
# Mudar: MELHOR_ENVIO_TOKEN -> MELHOR_ENVIO_TOKEN_V2

# Redeploy no Portainer
```

---

## 📞 Contato

Para dúvidas sobre a arquitetura, entre em contato:
- **Email**: mkt.oficialmed@gmail.com
- **GitHub**: https://github.com/oficialmedpro/melhor-envio-status

---

**Última atualização**: 18/10/2025
**Versão**: 1.0.0

