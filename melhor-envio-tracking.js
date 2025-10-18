const axios = require('axios');

// Configuração da requisição para o Melhor Envio API
async function consultarRastreamento() {
    const url = 'https://www.melhorenvio.com.br/api/v2/me/shipment/tracking';
    
    // Headers conforme mostrado na imagem
    const headers = {
        'Accept': 'application/json',
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMjI1NjY0MGQ4YjUxNWQ1NDIyMzJiNmExNGUwYzE2ZTdkNjAyMzlkODZiZjllMWUxYTViZGUyOWRjYzM1OTE0YzEwN2NlYzNmNDZmNjA4OTYiLCJpYXQiOjE3NTk3NjIzNzEuODY4Mjk5LCJuYmYiOjE3NTk3NjIzNzEuODY4MzAxLCJleHAiOjE3OTEyOTgzNzEuODU1NTMzLCJzdWIiOiI5YWZmMjk0NC1kZjE0LTRhMmUtYjE2ZS00ZjlmYzg2NDQ3MDIiLCJzY29wZXMiOlsiY2FydC1yZWFkIiwiY2FydC13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiY29tcGFuaWVzLXdyaXRlIiwiY291cG9ucy1yZWFkIiwiY291cG9ucy13cml0ZSIsIm5vdGlmaWNhdGlvbnMtcmVhZCIsIm9yZGVycy1yZWFkIiwicHJvZHVjdHMtcmVhZCIsInByb2R1Y3RzLWRlc3Ryb3kiLCJwcm9kdWN0cy13cml0ZSIsInB1cmNoYXNlcy1yZWFkIiwic2hpcHBpbmctY2FsY3VsYXRlIiwic2hpcHBpbmctY2FuY2VsIiwic2hpcHBpbmctY2hlY2tvdXQiLCJzaGlwcGluZy1jb21wYW5pZXMiLCJzaGlwcGluZy1nZW5lcmF0ZSIsInNoaXBwaW5nLXByZXZpZXciLCJzaGlwcGluZy1wcmludCIsInNoaXBwaW5nLXNoYXJlIiwic2hpcHBpbmctdHJhY2tpbmciLCJlY29tbWVyY2Utc2hpcHBpbmciLCJ0cmFuc2FjdGlvbnMtcmVhZCIsInVzZXJzLXJlYWQiLCJ1c2Vycy13cml0ZSIsIndlYmhvb2tzLXJlYWQiLCJ3ZWJob29rcy13cml0ZSIsIndlYmhvb2tzLWRlbGV0ZSIsInRkZWFsZXItd2ViaG9vayJdfQ.bYvZvzNfOlaVcGF7MUzxXGvxUYBJOFty9XXUmtcvVc9Ppx5I-DDvrYt4G4MQgPanTFamokMTq9qAVLkBqK1yRytXfUiup4NHIUtHI4-xijhayxOGOqxXOrh_IZXQGss7_p3IIQFqScCNun6DcvHcUWAl9vXK5P0xfKJPctXaJPnrmNTx5t9xVWRLXeFZu4-YtC0AJHMyc7x4G0zL6QBH3M6zhn04Rqaq-Y2TY3SgpRuJsAcCdh4jw5BsBPmd_jroyKMEy-Ove2ZywHwfEEJZ4xFyNxXLx8CkYMgOtWaF8rF8VccPetFAdDu0h0BB3M4qVMUL_VkumiENuhq6a9xLDpn61clG_uMypeYSVpf2hd7lfX3HVw0L6iWJZTJqIdO36QcRSfSRRML0xDtLkaQpbwR1VwvR4hOH2PcbuFFLYRhhXesbYq_eVdpjioNs_cjz-2WhnBYeHrXFgZqQ3PHw3VamUFtJ6p3RY3fELTrGhowXpaRyP3Agw2fs1-gC64PhuUe3iT2nP76e75NSnD6HPcVOC0h7pgVFD8F8FA8SXfSKkHZngDzQc2BHF210HT56ODgh0WzKBGXSN2aP5FQlCjmBzeKJa7Y5nRkagfOqEJ5U8bDgCvKJEsZoXwbSuLMNQQNKCehK2pFRR1D0F1bmNE1s-jvvfalI_NKT80UFlT8',
        'Content-Type': 'application/json',
        'User-Agent': 'Aplicação mkt.oficialmed@gmail.com'
    };
    
    // Body da requisição com o ID de exemplo fornecido
    const body = {
        "orders": [
            "a01f6c8e-0f14-4c29-8799-ae79c1d1da5e"
        ]
    };
    
    try {
        console.log('Fazendo requisição para:', url);
        console.log('Headers:', headers);
        console.log('Body:', JSON.stringify(body, null, 2));
        
        const response = await axios.post(url, body, { headers });
        
        console.log('Status:', response.status);
        console.log('Dados da resposta (original):', JSON.stringify(response.data, null, 2));
        
        // Transformar o resultado: extrair os objetos e adicionar o ID como propriedade
        const transformedData = Object.entries(response.data).map(([orderId, orderData]) => ({
            id: orderId,
            ...orderData
        }));
        
        // Se houver apenas um objeto, retornar ele diretamente, senão retornar o array
        const finalData = transformedData.length === 1 ? transformedData[0] : transformedData;
        
        console.log('Dados transformados:', JSON.stringify(finalData, null, 2));
        
        return finalData;
        
    } catch (error) {
        console.error('Erro na requisição:');
        if (error.response) {
            // Erro de resposta do servidor
            console.error('Status:', error.response.status);
            console.error('Dados do erro:', error.response.data);
        } else if (error.request) {
            // Erro de rede
            console.error('Erro de rede:', error.message);
        } else {
            // Outros erros
            console.error('Erro:', error.message);
        }
        throw error;
    }
}

// Executar a função
consultarRastreamento()
    .then(data => {
        console.log('Requisição realizada com sucesso!');
        console.log('Resultado:', data);
    })
    .catch(error => {
        console.error('Falha na requisição:', error.message);
    });

module.exports = { consultarRastreamento };
