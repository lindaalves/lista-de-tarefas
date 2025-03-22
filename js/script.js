document.addEventListener("DOMContentLoaded", function () {
  const inputTarefa = document.getElementById("novaTarefa");
  const botaoAdicionar = document.getElementById("adicionarTarefa");
  const listaTarefas = document.getElementById("listaTarefas");
  const botaoTema = document.getElementById("toggleTheme");
  const body = document.body;

  carregarTarefas();

  function alternarTema() {
    body.classList.toggle("dark-mode");
    const temaAtual = body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("tema", temaAtual);
    botaoTema.textContent = temaAtual === "dark" ? "Modo Claro" : "Modo Escuro";
  }

  if (localStorage.getItem("tema") === "dark") {
    body.classList.add("dark-mode");
    botaoTema.textContent = "Modo Claro";
  }

  botaoAdicionar.addEventListener("click", adicionarTarefa);
  botaoTema.addEventListener("click", alternarTema);

  function adicionarTarefa() {
    const textoTarefa = inputTarefa.value.trim();
    if (textoTarefa !== "") {
      const novaTarefa = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";

      const textoSpan = document.createElement("span");
      textoSpan.textContent = textoTarefa;

      const botaoExcluir = document.createElement("button");
      botaoExcluir.classList.add("excluir");
      botaoExcluir.innerHTML = '<i class="fa-regular fa-trash-can"></i>';

      checkbox.addEventListener("change", function () {
        textoSpan.classList.toggle("completed", checkbox.checked);
      });

      botaoExcluir.addEventListener("click", function () {
        listaTarefas.removeChild(novaTarefa);
      });

      novaTarefa.appendChild(checkbox);
      novaTarefa.appendChild(textoSpan);
      novaTarefa.appendChild(botaoExcluir);
      listaTarefas.appendChild(novaTarefa);

      inputTarefa.value = "";

      salvarTarefas();
    }
  }

  function salvarTarefas() {
    const tarefas = [];
    document.querySelectorAll("#listaTarefas li").forEach((tarefa) => {
      const texto = tarefa.querySelector("span").textContent;
      const concluida = tarefa.querySelector("input").checked;
      tarefas.push({ texto, concluida });
    });
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }

  function carregarTarefas() {
    const tarefasSalvas = JSON.parse(localStorage.getItem("tarefas")) || [];
    tarefasSalvas.forEach(({ texto, concluida }) => {
      const novaTarefa = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = concluida;

      const textoSpan = document.createElement("span");
      textoSpan.textContent = texto;
      if (concluida) textoSpan.classList.add("completed");

      const botaoExcluir = document.createElement("button");
      botaoExcluir.classList.add("excluir");
      botaoExcluir.innerHTML = '<i class="fa-regular fa-trash-can"></i>';

      checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
          textoSpan.classList.add("completed");
        } else {
          textoSpan.classList.remove("completed");
        }
        salvarTarefas();
      });

      botaoExcluir.addEventListener("click", function () {
        listaTarefas.removeChild(novaTarefa);
        salvarTarefas();
      });

      novaTarefa.appendChild(checkbox);
      novaTarefa.appendChild(textoSpan);
      novaTarefa.appendChild(botaoExcluir);
      listaTarefas.appendChild(novaTarefa);

      inputTarefa.value = "";
    });

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    function lembrarTarefa() {
      if (Notification.permission === "granted") {
        new Notification("Lembrete!", {
          body: "Não se esqueça de revisar suas tarefas! ✅",
        });
      }
    }

    setInterval(lembrarTarefa, 3600000);
  }
});
