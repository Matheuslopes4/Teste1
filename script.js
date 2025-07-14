document.addEventListener("DOMContentLoaded", function () {
  // Formatação de CPF
  function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ""); // remove tudo que não é número
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return cpf;
  }

  // Formatação de telefone
  function formatarTelefone(tel) {
    tel = tel.replace(/\D/g, "");
    if (tel.length > 11) tel = tel.substring(0, 11);
    tel = tel.replace(/^(\d{2})(\d)/g, "($1) $2");
    tel = tel.replace(/(\d{5})(\d{4})$/, "$1-$2");
    return tel;
  }

  // Função para gerar lista de vagas (index.html)
  function gerarVagas() {
    const vagas = [
      { titulo: "Aprendiz Industrial em Tintas e Vernizes - Jaraguá do Sul", local: "Jaraguá do Sul / SC" },
      { titulo: "Aprendiz Industrial em Tintas e Vernizes - Mauá", local: "Mauá / SP" },
      { titulo: "Aprendiz Industrial em Eletromecânica - Jaraguá do Sul", local: "Jaraguá do Sul / SC" }
    ];

    const lista = document.getElementById('lista-vagas');
    if (!lista) return;

    vagas.forEach(vaga => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <strong>${vaga.titulo}</strong><br />
          <small>${vaga.local}</small>
        </div>
        <button type="button" class="btn-candidatar">Candidatar-se</button>
      `;
      lista.appendChild(li);
    });

    document.querySelectorAll('.btn-candidatar').forEach(botao => {
      botao.addEventListener('click', () => {
        window.location.href = 'inscricao.html';
      });
    });
  }

  // Validação e formatação do formulário (inscricao.html)
  function validarFormulario() {
    const form = document.getElementById("formInscricao");
    if (!form) return;

    const idadeInput = document.getElementById("idade");
    const dataNascimentoInput = document.getElementById("dataNascimento");
    const cpfInput = document.getElementById("cpf");
    const telefoneInput = document.getElementById("telefone");

    let avisoIdade = document.getElementById("aviso-idade");
    if (!avisoIdade) {
      avisoIdade = document.createElement("div");
      avisoIdade.id = "aviso-idade";
      idadeInput.insertAdjacentElement("afterend", avisoIdade);
    }

    // Formata CPF enquanto digita
    cpfInput.addEventListener("input", () => {
      cpfInput.value = formatarCPF(cpfInput.value);
    });

    // Formata telefone enquanto digita
    telefoneInput.addEventListener("input", () => {
      telefoneInput.value = formatarTelefone(telefoneInput.value);
    });

    // Valida idade e data de nascimento
    function calcularIdade(dataNasc) {
      const hoje = new Date();
      const nasc = new Date(dataNasc);
      let idade = hoje.getFullYear() - nasc.getFullYear();
      const mes = hoje.getMonth() - nasc.getMonth();
      if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) {
        idade--;
      }
      return idade;
    }

    function validarIdadeData() {
      const idade = parseInt(idadeInput.value);
      const dataNasc = dataNascimentoInput.value;
      if (!dataNasc) return false;

      const idadeCalculada = calcularIdade(dataNasc);

      if (isNaN(idade) || idade < 14 || idade > 16 || idade !== idadeCalculada) {
        avisoIdade.textContent = "Idade deve estar entre 14 e 16 anos e coincidir com a data de nascimento.";
        avisoIdade.style.display = "block";
        return false;
      } else {
        avisoIdade.style.display = "none";
        return true;
      }
    }

    idadeInput.addEventListener("input", validarIdadeData);
    dataNascimentoInput.addEventListener("change", validarIdadeData);

    form.addEventListener("submit", function (event) {
      if (!validarIdadeData()) {
        alert("Corrija a idade e a data de nascimento antes de enviar.");
        event.preventDefault();
        return;
      }

      alert("Inscrição enviada com sucesso!");
      form.reset();
      event.preventDefault(); // Remova se quiser que envie para backend real
    });
  }

  // Animações de scroll para toda a página
  function animarScroll() {
    const elementos = document.querySelectorAll('.animate-on-scroll');
    elementos.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.85) {
        el.classList.add('visible');
      } else {
        el.classList.remove('visible');
      }
    });
  }

  // Scroll suave para âncoras
  function ativarScrollSuave() {
    document.querySelectorAll('a[href^="#"]').forEach(ancora => {
      ancora.addEventListener('click', function (e) {
        e.preventDefault();
        const alvo = document.querySelector(this.getAttribute('href'));
        if (alvo) {
          const headerAltura = document.querySelector('header').offsetHeight;
          const posicao = alvo.offsetTop - headerAltura;

          window.scrollTo({
            top: posicao,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Função para controlar o menu hambúrguer
  function configurarMenuHamburguer() {
    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("menu-mobile");

    toggle.addEventListener("click", () => {
      menu.classList.toggle("active");
    });

    // Fecha o menu ao clicar em qualquer link dentro dele (mobile)
    document.querySelectorAll("#menu-mobile a").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("active");
      });
    });
  }

  // Controle do botão que abre/esconde lista de cursos
  const btnCursos = document.querySelector('.btn-cursos');
  const listaCursos = document.getElementById('lista-cursos');

  if (btnCursos && listaCursos) {
    btnCursos.addEventListener('click', () => {
      listaCursos.classList.toggle('aberto');
      if (listaCursos.classList.contains('aberto')) {
        btnCursos.textContent = 'Ocultar cursos';
      } else {
        btnCursos.textContent = 'Ver todos os cursos';
      }
    });
  }

  // Executa as funções principais
  gerarVagas();
  validarFormulario();
  ativarScrollSuave();
  configurarMenuHamburguer();

  window.addEventListener('scroll', animarScroll);
  animarScroll(); // Anima já no carregamento, para elementos visíveis
});
