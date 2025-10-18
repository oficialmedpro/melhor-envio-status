const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuração da API Melhor Envio
const MELHOR_ENVIO_API_URL = 'https://www.melhorenvio.com.br/api/v2/me/shipment/tracking';
const MELHOR_ENVIO_TOKEN = process.env.MELHOR_ENVIO_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMjI1NjY0MGQ4YjUxNWQ1NDIyMzJiNmExNGUwYzE2ZTdkNjAyMzlkODZiZjllMWUxYTViZGUyOWRjYzM1OTE0YzEwN2NlYzNmNDZmNjA4OTYiLCJpYXQiOjE3NTk3NjIzNzEuODY4Mjk5LCJuYmYiOjE3NTk3NjIzNzEuODY4MzAxLCJleHAiOjE3OTEyOTgzNzEuODU1NTMzLCJzdWIiOiI5YWZmMjk0NC1kZjE0LTRhMmUtYjE2ZS00ZjlmYzg2NDQ3MDIiLCJzY29wZXMiOlsiY2FydC1yZWFkIiwiY2FydC13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiY29tcGFuaWVzLXdyaXRlIiwiY291cG9ucy1yZWFkIiwiY291cG9ucy13cml0ZSIsIm5vdGlmaWNhdGlvbnMtcmVhZCIsIm9yZGVycy1yZWFkIiwicHJvZHVjdHMtcmVhZCIsInByb2R1Y3RzLWRlc3Ryb3kiLCJwcm9kdWN0cy13cml0ZSIsInB1cmNoYXNlcy1yZWFkIiwic2hpcHBpbmctY2FsY3VsYXRlIiwic2hpcHBpbmctY2FuY2VsIiwic2hpcHBpbmctY2hlY2tvdXQiLCJzaGlwcGluZy1jb21wYW5pZXMiLCJzaGlwcGluZy1nZW5lcmF0ZSIsInNoaXBwaW5nLXByZXZpZXciLCJzaGlwcGluZy1wcmludCIsInNoaXBwaW5nLXNoYXJlIiwic2hpcHBpbmctdHJhY2tpbmciLCJlY29tbWVyY2Utc2hpcHBpbmciLCJ0cmFuc2FjdGlvbnMtcmVhZCIsInVzZXJzLXJlYWQiLCJ1c2Vycy13cml0ZSIsIndlYmhvb2tzLXJlYWQiLCJ3ZWJob29rcy13cml0ZSIsIndlYmhvb2tzLWRlbGV0ZSIsInRkZWFsZXItd2ViaG9vayJdfQ.bYvZvzNfOlaVcGF7MUzxXGvxUYBJOFty9XXUmtcvVc9Ppx5I-DDvrYt4G4MQgPanTFamokMTq9qAVLkBqK1yRytXfUiup4NHIUtHI4-xijhayxOGOqxXOrh_IZXQGss7_p3IIQFqScCNun6DcvHcUWAl9vXK5P0xfKJPctXaJPnrmNTx5t9xVWRLXeFZu4-YtC0AJHMyc7x4G0zL6QBH3M6zhn04Rqaq-Y2TY3SgpRuJsAcCdh4jw5BsBPmd_jroyKMEy-Ove2ZywHwfEEJZ4xFyNxXLx8CkYMgOtWaF8rF8VccPetFAdDu0h0BB3M4qVMUL_VkumiENuhq6a9xLDpn61clG_uMypeYSVpf2hd7lfX3HVw0L6iWJZTJqIdO36QcRSfSRRML0xDtLkaQpbwR1VwvR4hOH2PcbuFFLYRhhXesbYq_eVdpjioNs_cjz-2WhnBYeHrXFgZqQ3PHw3VamUFtJ6p3RY3fELTrGhowXpaRyP3Agw2fs1-gC64PhuUe3iT2nP76e75NSnD6HPcVOC0h7pgVFD8F8FA8SXfSKkHZngDzQc2BHF210HT56ODgh0WzKBGXSN2aP5FQlCjmBzeKJa7Y5nRkagfOqEJ5U8bDgCvKJEsZoXwbSuLMNQQNKCehK2pFRR1D0F1bmNE1s-jvvfalI_NKT80UFlT8';
const USER_AGENT = process.env.USER_AGENT || 'Aplicação mkt.oficialmed@gmail.com';

/**
 * Função para consultar rastreamento no Melhor Envio
 * @param {Array} orders - Array com IDs dos pedidos (ID Correio)
 * @returns {Object} - Dados tratados do rastreamento
 */
async function consultarMelhorEnvio(orders) {
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${MELHOR_ENVIO_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT
    };

    const body = { orders };

    try {
        console.log('[Melhor Envio] Consultando rastreamento:', orders);
        
        const response = await axios.post(MELHOR_ENVIO_API_URL, body, { headers });
        
        console.log('[Melhor Envio] Status:', response.status);
        console.log('[Melhor Envio] Resposta recebida');

        // Transformar o resultado: extrair os objetos com chaves dinâmicas
        const transformedData = Object.entries(response.data).map(([orderId, orderData]) => ({
            id: orderId,
            ...orderData
        }));

        // Se houver apenas um objeto, retornar ele diretamente, senão retornar o array
        const finalData = transformedData.length === 1 ? transformedData[0] : transformedData;

        return {
            success: true,
            data: finalData
        };

    } catch (error) {
        console.error('[Melhor Envio] Erro na requisição:');
        
        if (error.response) {
            console.error('[Melhor Envio] Status:', error.response.status);
            console.error('[Melhor Envio] Dados do erro:', error.response.data);
            
            return {
                success: false,
                error: error.response.data,
                status: error.response.status
            };
        } else if (error.request) {
            console.error('[Melhor Envio] Erro de rede:', error.message);
            
            return {
                success: false,
                error: 'Erro de conexão com API Melhor Envio',
                message: error.message
            };
        } else {
            console.error('[Melhor Envio] Erro:', error.message);
            
            return {
                success: false,
                error: 'Erro ao processar requisição',
                message: error.message
            };
        }
    }
}

/**
 * Função para enviar dados via webhook
 * @param {String} webhookUrl - URL do webhook
 * @param {Object} data - Dados a serem enviados
 */
async function enviarWebhook(webhookUrl, data) {
    try {
        console.log('[Webhook] Enviando para:', webhookUrl);
        
        const response = await axios.post(webhookUrl, data, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 segundos
        });

        console.log('[Webhook] Enviado com sucesso. Status:', response.status);
        return { success: true, status: response.status };

    } catch (error) {
        console.error('[Webhook] Erro ao enviar:', error.message);
        
        return {
            success: false,
            error: error.message,
            status: error.response?.status
        };
    }
}

// ==================== ROTAS/ENDPOINTS ====================

/**
 * GET / - Health check
 */
app.get('/', (req, res) => {
    res.json({
        service: 'Melhor Envio Tracking API',
        version: '1.0.0',
        status: 'online',
        endpoints: {
            health: 'GET /',
            tracking: 'POST /tracking'
        }
    });
});

/**
 * GET /health - Health check detalhado
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

/**
 * POST /tracking
 * Recebe requisição do SprintHub, consulta Melhor Envio e envia resposta via webhook
 * 
 * Body esperado:
 * {
 *   "orders": ["id_correio_1", "id_correio_2"],
 *   "webhook_url": "https://sprinthub.com/webhook/callback" (opcional)
 * }
 */
app.post('/tracking', async (req, res) => {
    const startTime = Date.now();
    
    try {
        console.log('\n========== NOVA REQUISIÇÃO DE TRACKING ==========');
        console.log('[Request] Body:', JSON.stringify(req.body, null, 2));

        const { orders, webhook_url } = req.body;

        // Validação
        if (!orders || !Array.isArray(orders) || orders.length === 0) {
            console.log('[Erro] Orders inválido ou vazio');
            return res.status(400).json({
                success: false,
                error: 'O campo "orders" é obrigatório e deve ser um array com pelo menos um ID'
            });
        }

        // Consultar Melhor Envio
        const resultado = await consultarMelhorEnvio(orders);

        // Se não houver webhook_url, retornar resposta diretamente
        if (!webhook_url) {
            const duration = Date.now() - startTime;
            console.log(`[Resposta] Enviada diretamente (${duration}ms)`);
            console.log('========== FIM DA REQUISIÇÃO ==========\n');
            
            return res.json({
                ...resultado,
                processedAt: new Date().toISOString(),
                duration: `${duration}ms`
            });
        }

        // Se houver webhook_url, enviar resposta via webhook
        console.log('[Webhook] URL fornecida:', webhook_url);
        
        const webhookResult = await enviarWebhook(webhook_url, {
            ...resultado,
            processedAt: new Date().toISOString()
        });

        const duration = Date.now() - startTime;
        console.log(`[Resposta] Processamento completo (${duration}ms)`);
        console.log('========== FIM DA REQUISIÇÃO ==========\n');

        // Retornar confirmação para o SprintHub
        res.json({
            success: true,
            message: 'Requisição processada e webhook enviado',
            tracking: resultado,
            webhook: webhookResult,
            processedAt: new Date().toISOString(),
            duration: `${duration}ms`
        });

    } catch (error) {
        console.error('[Erro] Erro no processamento:', error);
        
        const duration = Date.now() - startTime;
        console.log('========== FIM DA REQUISIÇÃO (ERRO) ==========\n');
        
        res.status(500).json({
            success: false,
            error: 'Erro interno no servidor',
            message: error.message,
            duration: `${duration}ms`
        });
    }
});

/**
 * POST /webhook
 * Endpoint para receber webhooks do Melhor Envio (caso eles enviem atualizações automáticas)
 */
app.post('/webhook', async (req, res) => {
    console.log('\n========== WEBHOOK RECEBIDO DO MELHOR ENVIO ==========');
    console.log('[Webhook] Body:', JSON.stringify(req.body, null, 2));
    console.log('========== FIM DO WEBHOOK ==========\n');

    // Responder imediatamente ao Melhor Envio
    res.status(200).json({ received: true });

    // Aqui você pode processar os dados e enviar para o SprintHub se necessário
    // TODO: Implementar lógica de processamento de webhook do Melhor Envio
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║     🚀 Melhor Envio Tracking API                      ║');
    console.log('╠════════════════════════════════════════════════════════╣');
    console.log(`║  📡 Servidor rodando na porta: ${PORT.toString().padEnd(23)}║`);
    console.log(`║  🌍 Ambiente: ${(process.env.NODE_ENV || 'development').padEnd(38)}║`);
    console.log(`║  ⏰ Iniciado em: ${new Date().toLocaleString('pt-BR').padEnd(32)}║`);
    console.log('╠════════════════════════════════════════════════════════╣');
    console.log('║  Endpoints disponíveis:                                ║');
    console.log('║  • GET  / - Health check                               ║');
    console.log('║  • GET  /health - Health check detalhado              ║');
    console.log('║  • POST /tracking - Consultar rastreamento            ║');
    console.log('║  • POST /webhook - Receber webhook Melhor Envio       ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

module.exports = app;

