
let formulario = document.getElementById("formulario");
let cep = document.getElementById("cep");

cep.addEventListener("input", function() {
    let valor = cep.value.replace(/\D/g, "").slice(0, 8);

    if (valor.length > 5) {
        valor = valor.slice(0, 5) + "-" + valor.slice(5);
    }

    cep.value = valor;
});

formulario.addEventListener("submit", async function(event) {
    event.preventDefault();

    let numeroCep = cep.value.replace(/\D/g, "");
    let mensagem = document.getElementById("mensagem");

    if (numeroCep.length != 8) {
        mensagem.textContent = "Digite um CEP com 8 dígitos!";
        mensagem.style.color = "red";
        return;
    }

    try {
        let resposta = await fetch(
            "https://viacep.com.br/ws/" + numeroCep + "/json/"
        );

        if (!resposta.ok) {
            throw new Error("Erro na consulta");
        }

        let dados = await resposta.json();

        if (dados.erro) {
            throw new Error("CEP não encontrado!");
        }

        document.getElementById("rua").value = dados.logradouro || "";
        document.getElementById("complemento").value = dados.complemento || "";
        document.getElementById("bairro").value = dados.bairro || "";
        document.getElementById("cidade").value = dados.localidade || "";
        document.getElementById("estado").value = dados.uf || "";

        mensagem.textContent = "CEP encontrado com sucesso!";
        mensagem.style.color = "green";

    } catch (erro) {
        mensagem.textContent = erro.message === "CEP não encontrado!"
            ? "CEP não encontrado!"
            : "Erro ao consultar o CEP!";

        mensagem.style.color = "red";

        document.getElementById("rua").value = "";
        document.getElementById("complemento").value = "";
        document.getElementById("bairro").value = "";
        document.getElementById("cidade").value = "";
        document.getElementById("estado").value = "";
    }
});
