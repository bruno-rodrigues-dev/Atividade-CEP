let cep = document.getElementById("cep");
let mensagem = document.getElementById("mensagem");

cep.addEventListener("input", function() {
    let valor = cep.value.replace(/\D/g, "").slice(0, 8);

    if (valor.length > 5) {
        valor = valor.slice(0, 5) + "-" + valor.slice(5);
    }

    cep.value = valor;
});

cep.addEventListener("blur", async function() {
    let numeroCep = cep.value.replace(/\D/g, "");

    if (numeroCep.length != 8) {
        mensagem.textContent = "Digite um CEP válido com 8 dígitos!";
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

        mensagem.textContent = "Endereço encontrado!";
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
