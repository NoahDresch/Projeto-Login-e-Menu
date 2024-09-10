const apiUrl =  "http://localhost:3000";

// Função para listar pagamentos
async function listarPagamentos() {
    const options = {
        method: "GET",
        redirect: "follow"
    };

    let result = await fetch(apiUrl + "/pagamento", options);
    let pagamentos = await result.json();
    let html = "";

    for (let i = 0; i < pagamentos.length; i++) {
        let pagamento = pagamentos[i];
        let excluir = `<button onclick="excluirPagamento(${pagamento.codigo})">Excluir</button>`;
        let editar = `<button onclick="editarPagamento(${pagamento.codigo})">Editar</button>`;

        html += `
        <tr>
            <td>${excluir} ${editar}</td>
            <td>${pagamento.codigo}</td>
            <td>${pagamento.formapgt}</td>
            <td>${pagamento.localpgt}</td>
        </tr>
        `;
    }

    document.getElementById('tbody-pagamentos').innerHTML = html;
    console.log(pagamentos);
}

// Função para gravar pagamento
async function gravarPagamento() {
    let id = pegarParametro('id');
    let method = id == null ? 'POST' : 'PUT';
    let url = id == null ? "/pagamento" : "/pagamento/" + id;

    let pagamento = {
        "formapgt": document.getElementById("formapgt").value,
        "localpgt": document.getElementById("localpgt").value
    };

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const options = {
        method: method,
        body: JSON.stringify(pagamento),
        headers: myHeaders,
        redirect: "follow"
    };

    let result = await fetch(apiUrl + url, options);
    let pagamentoResult = await result.json();

    if (pagamentoResult.formapgt) {
        alert("Pagamento cadastrado com sucesso!");
        window.location = "pagamento.html";
    } else {
        alert("Erro ao cadastrar pagamento!");
    }

    console.log(pagamentoResult);
}

// Função para excluir pagamento
async function excluirPagamento(codigo) {
    if (confirm("Deseja realmente excluir?")) {
        const options = {
            method: "DELETE",
            redirect: "follow"
        };
          
        let result = await fetch(apiUrl + "/pagamento/" + codigo, options);
        let json = await result.json();

        if (json.formapgt) {
            alert("Pagamento excluído com sucesso!");
            window.location.reload();
        } else {
            alert("Problemas em excluir o pagamento!");
        }

        console.log(json);
    }
}

// Função para editar pagamento
async function editarPagamento(codigo) {
    window.location = "formapgt.html?id=" + codigo;
}

// Função para carregar os dados de um pagamento para edição
async function carregarPagamento() {
    let id = pegarParametro('id');
    console.log("id " + id);

    if (id != null) {
        document.getElementById('h1').innerHTML = 'Editar pagamento';

        let result = await fetch(apiUrl + "/pagamento/" + id);
        let pagamento = await result.json();

        document.getElementById('formapgt').value = pagamento.formapgt;
        document.getElementById('localpgt').value = pagamento.localpgt;

        console.log(pagamento);
    }
}

// Função para pegar parâmetros da URL
function pegarParametro(parametro) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(parametro);
}

// Função para permitir gravar dados ao pressionar Enter
function pressEnter() {
    if (event.key === 'Enter') {
        gravarPagamento();
    }
}