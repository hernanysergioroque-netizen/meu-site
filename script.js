// 1) Menu hambúrguer (só visível em ecrãs pequenos, definido no CSS)
const botaoMenu = document.querySelector('.menu-btn');
const menu = document.getElementById('menu-principal');

function alternarMenu(abrir) {
  menu.classList.toggle('nav--aberto', abrir);
  botaoMenu.setAttribute('aria-expanded', String(abrir));
}

botaoMenu.addEventListener('click', () => alternarMenu(botaoMenu.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('nav--aberto')) {
    alternarMenu(false);
    botaoMenu.focus();
  }
});

// 2) Filtros por categoria + pesquisa por nome (sem JS, a lista aparece completa)
const semAcentos = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

document.querySelectorAll('[data-filtros]').forEach((grupo) => {
  const id = grupo.dataset.filtros;
  const lista = document.getElementById(id);
  const estado = document.getElementById(`${id}-estado`);
  const busca = document.querySelector(`[data-busca="${id}"]`);
  const campo = busca.querySelector('input');
  const itens = [...lista.querySelectorAll('[data-cat]')];
  const botoes = grupo.querySelectorAll('button[data-filtro]');
  let categoria = 'todos';

  function aplicar() {
    const texto = semAcentos(campo.value.trim());
    let visiveis = 0;
    itens.forEach((item) => {
      const nome = semAcentos(item.querySelector('h2').textContent);
      const mostrar = (categoria === 'todos' || item.dataset.cat === categoria) && nome.includes(texto);
      item.hidden = !mostrar;
      if (mostrar) visiveis += 1;
    });
    botoes.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filtro === categoria)));
    estado.textContent = visiveis ? `A mostrar ${visiveis} de ${itens.length} locais.` : 'Nenhum local encontrado.';
  }

  grupo.addEventListener('click', (e) => {
    const botao = e.target.closest('button[data-filtro]');
    if (!botao) return;
    categoria = botao.dataset.filtro;
    aplicar();
  });
  campo.addEventListener('input', aplicar);

  grupo.hidden = false;
  busca.hidden = false;
  aplicar();
});

// 3) Selo "Aberto agora / Fechado agora" (usa a hora do dispositivo)
function minutos(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

document.querySelectorAll('[data-abre]').forEach((selo) => {
  const agora = new Date();
  const atual = agora.getHours() * 60 + agora.getMinutes();
  const aberto = atual >= minutos(selo.dataset.abre) && atual < minutos(selo.dataset.fecha);
  selo.textContent = aberto ? 'Aberto agora' : 'Fechado agora';
  selo.classList.add(aberto ? 'aberto--sim' : 'aberto--nao');
  selo.hidden = false;
});
