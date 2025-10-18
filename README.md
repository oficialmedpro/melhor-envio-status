# Melhor Envio - API de Tracking (melhor-envio-status)

Este projeto contém um exemplo de como fazer requisições para a API de tracking do Melhor Envio.

## Arquivos

- `melhor-envio-tracking.js` - Script principal com a função de consulta de rastreamento
- `package.json` - Configuração do projeto Node.js com dependências
- `README.md` - Este arquivo de documentação

## Como usar

1. Instale as dependências:
```bash
npm install
```

2. Execute o script:
```bash
npm start
```

## Configuração

O script está configurado com:
- **URL**: https://www.melhorenvio.com.br/api/v2/me/shipment/tracking
- **Headers**: Accept, Authorization, Content-Type, User-Agent
- **Body**: JSON com array de orders contendo o ID de correio

## Exemplo de uso

```javascript
const { consultarRastreamento } = require('./melhor-envio-tracking');

consultarRastreamento()
    .then(data => console.log('Dados:', data))
    .catch(error => console.error('Erro:', error));
```

## Notas

- O token de autorização na imagem está truncado, você precisará usar seu token completo
- O ID de correio usado é apenas um exemplo: `a01f6c8e-0f14-4c29-8799-ae79c1d1da5e`
- Certifique-se de ter as permissões necessárias na API do Melhor Envio
