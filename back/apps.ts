// Comandos para instalar no terminal
// npm install express 
// npm install @types/express
// npm install cors 
// npm install @types/cors
// 
// rodar este comando de baixo também, para ir ao postman(criar o link)
// Set-ExecutionPolicy -ExecutionPolicy  Unrestricted -Scope Process
//
// Ctrl + c , para matar o terminal

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import {Pagamento} from './pagamento';

const port: Number = 3000;
let server: Express = express();

server.use(cors());
server.use(express.json());

let pagamentos: Pagamento[] = [];

// Rota inicial
server.get('/', async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json('Olá, mundo!');
});

// Listar todos os pagamentos
server.get('/pagamento', async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json(pagamentos);
});

// Obter um pagamento pelo código
server.get('/pagamento/:codigo', async (req: Request, res: Response): Promise<Response> => {
    let codigo = Number(req.params.codigo);

    let pagamento = pagamentos.find(p => p.codigo === codigo);
    
    if (pagamento) {
        return res.status(200).json(pagamento);
    }

    let erro = { "codigo": codigo, "erro": "Pagamento não encontrado." };
    return res.status(400).json(erro);
});

// Gravar novo pagamento
server.post('/pagamento', async (req: Request, res: Response): Promise<Response> => {
    console.log("Dados recebidos:", req.body); // Log para verificar se os dados estão chegando

    // Validação do corpo da requisição
    if (!req.body.formapgt || !req.body.localpgt) {
        return res.status(400).json({
            erro: "Campos obrigatórios estão faltando: 'formapgt' e 'localpgt'"
        });
    }

    // Criando um novo pagamento a partir dos dados do corpo da requisição
    console.log(req.body);
    let pagamento = new Pagamento();
        pagamento.formapgt = req.body.formapgt;
        pagamento.localpgt = req.body.localpgt;
        pagamento.codigo = pagamentos.length;
        pagamentos.push(pagamento);

    // Retorna o pagamento recém-criado como resposta
    return res.status(200).json(pagamento); // 200 = retorno de sucesso
});

// Editar pagamento existente
server.put('/pagamento/:codigo', async (req: Request, res: Response): Promise<Response> => {
    let codigo = Number(req.params.codigo);

    let pagamento = pagamentos.find(p => p.codigo === codigo);

    if (pagamento) {
        pagamento.formapgt = req.body.formapgt;
        pagamento.localpgt = req.body.localpgt;

        return res.status(200).json(pagamento);
    }

    let erro = { "codigo": codigo, "erro": "Pagamento não encontrado." };
    return res.status(400).json(erro);
});

// Excluir pagamento
server.delete('/pagamento/:codigo', async (req: Request, res: Response): Promise<Response> => {
    let codigo = Number(req.params.codigo);
    
    let index = pagamentos.findIndex(p => p.codigo === codigo);

    if (index >= 0) {
        let pagamento = pagamentos.splice(index, 1)[0];
        return res.status(200).json(pagamento);
    }

    let erro = { "codigo": codigo, "erro": "Pagamento não encontrado." };
    return res.status(400).json(erro);
});

// Iniciar o servidor
server.listen(port, () => {
    console.log('Server iniciado na porta ' + port);
});