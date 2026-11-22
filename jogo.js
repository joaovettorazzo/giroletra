'use strict';

const $ = id => document.getElementById(id);
const modos = [1, 2, 4];
const nomes = {1: 'Uma palavra', 2: 'Duas palavras', 4: 'Quatro palavras'};
const significado = {certa: 'posição certa', perto: 'outra posição', fora: 'letra ausente'};
const codigo = 'giroletra.v1.';
const vazio = () => Array(5).fill('');
let modo = 1;
let partida;
let avisoTimer;
const rascunhos = new Map();

function ler(chave) {
  try { return JSON.parse(localStorage.getItem(codigo + chave)); }
  catch { return null; }
}
function salvar(chave, valor) {
  try { localStorage.setItem(codigo + chave, JSON.stringify(valor)); }
  catch { /* A partida continua na memória quando o navegador bloqueia o armazenamento. */ }
}
function preferencia() {
  const rota = Number(new URLSearchParams(location.search).get('modo'));
  return modos.includes(rota) ? rota : modos.includes(ler('modo')) ? ler('modo') : 1;
}
function valida(dados, numero) {
  const r = dados?.rodada;
  return r && Array.isArray(r.alvos) && r.alvos.length === numero &&
    new Set(r.alvos).size === numero && r.alvos.every(p => typeof p === 'string' && Giro.banco.get(Giro.normalizar(p)) === p) &&
    Array.isArray(r.palpites) && r.palpites.length <= Giro.limites[numero] && r.palpites.every(p => Giro.vocabulario.has(p)) &&
    [dados.vitorias, dados.derrotas].every(n => Number.isSafeInteger(n) && n >= 0) &&
    Array.isArray(dados.letras) && dados.letras.length === 5 && dados.letras.every(l => typeof l === 'string' && /^[a-z]?$/.test(l)) &&
    Number.isInteger(dados.cursor) && dados.cursor >= 0 && dados.cursor < 5;
}
function estado(numero) {
  const dados = ler('modo-' + numero);
  if (valida(dados, numero)) return dados;
  return rascunhos.get(numero) ?? {rodada: Giro.sortear(numero), letras: vazio(), cursor: 0, vitorias: 0, derrotas: 0};
}
function gravar() {
  rascunhos.set(modo, partida);
  salvar('modo-' + modo, partida);
}
function selecionar(numero, atualizarUrl = true) {
  modo = numero;
  partida = estado(numero);
  salvar('modo', numero);
  gravar();
  if (atualizarUrl) {
    const url = new URL(location.href);
    url.searchParams.set('modo', numero);
    try { history.replaceState(null, '', url); } catch { /* Arquivo aberto localmente. */ }
  }
  document.querySelectorAll('.modo').forEach(botao => botao.setAttribute('aria-pressed', String(Number(botao.dataset.modo) === numero)));
  avisar('');
  atualizar();
}
function criarModos() {
  for (const numero of modos) {
    const botao = document.createElement('button');
    botao.className = 'modo';
    botao.dataset.modo = numero;
    botao.textContent = numero === 1 ? '1 palavra' : numero + ' palavras';
    botao.addEventListener('click', () => selecionar(numero));
    $('modos').append(botao);
  }
}
function criarTeclado() {
  for (const teclas of ['QWERTYUIOP', 'ASDFGHJKL', ['ENTER', ...'ZXCVBNM', 'APAGAR']]) {
    const linha = document.createElement('div');
    linha.className = 'fileira';
    for (const tecla of teclas) {
      const botao = document.createElement('button');
      botao.className = 'tecla';
      botao.dataset.tecla = tecla;
      const rotulo = document.createElement('span');
      rotulo.textContent = tecla === 'APAGAR' ? '⌫' : tecla === 'ENTER' ? 'Enviar' : tecla;
      botao.append(rotulo);
      if (tecla.length > 1) botao.classList.add('especial');
      if (tecla === 'ENTER') botao.classList.add('enviar');
      botao.setAttribute('aria-label', tecla === 'APAGAR' ? 'Apagar letra' : tecla === 'ENTER' ? 'Enviar palpite' : tecla);
      botao.addEventListener('click', () => digitar(tecla));
      linha.append(botao);
    }
    $('teclado').append(linha);
  }
}
function avisar(texto) {
  clearTimeout(avisoTimer);
  $('mensagem').textContent = texto;
  if (texto) avisoTimer = setTimeout(() => { $('mensagem').textContent = ''; }, 4000);
}
function atualizar(animar = false) {
  const {alvos, palpites} = partida.rodada;
  const fim = Giro.resultado(partida.rodada);
  const limite = Giro.limites[modo];
  $('tentativa').textContent = fim ? (fim === 'ganhou' ? 'Rodada vencida' : 'Rodada encerrada') : 'Tentativa ' + (palpites.length + 1) + ' de ' + limite;
  const quadros = [];
  const pistasPorQuadro = [];
  for (const [indice, alvo] of alvos.entries()) {
    const chave = Giro.normalizar(alvo);
    const acerto = palpites.indexOf(chave);
    const pistasTeclas = {};
    const linhas = [];
    for (let n = 0; n < limite; n++) {
      const palpite = (acerto < 0 || n <= acerto) ? palpites[n] : null;
      const ativa = !fim && acerto < 0 && n === palpites.length;
      const letras = palpite ? [...(palpite === chave ? alvo : Giro.vocabulario.get(palpite))] : ativa ? partida.letras : vazio();
      const pistas = palpite ? Giro.avaliar(palpite, alvo) : [];
      const casas = letras.map((letra, i) => {
        const pista = pistas[i];
        if (pista) {
          const anterior = pistasTeclas[palpite[i]];
          if (!anterior || pista === 'certa' || (pista === 'perto' && anterior === 'fora')) pistasTeclas[palpite[i]] = pista;
        }
        const classe = ['casa', pista || '', ativa && partida.cursor === i ? 'cursor' : '', animar && palpite && n === palpites.length - 1 ? 'revela' : ''].join(' ');
        const descricao = (letra || 'vazia') + (pista ? ', ' + significado[pista] : '');
        return '<span role="cell" aria-label="' + descricao + '" class="' + classe + '" style="--ordem:' + i + '"' + (ativa ? ' data-casa="' + i + '"' : '') + '>' + letra + '</span>';
      });
      linhas.push('<div role="row" class="linha ' + (ativa ? 'ativa' : '') + '">' + casas.join('') + '</div>');
    }
    pistasPorQuadro.push(pistasTeclas);
    const nome = 'Palavra ' + (indice + 1);
    const rotulo = modo > 1 ? '<div class="nome-quadro">' + nome + (acerto >= 0 ? ' ✓' : '') + '</div>' : '';
    quadros.push('<div class="quadro">' + rotulo + '<div class="grade" role="table" aria-label="' + nome + '">' + linhas.join('') + '</div></div>');
  }
  $('tabuleiros').dataset.modo = modo;
  $('tabuleiros').innerHTML = quadros.join('');
  for (const botao of $('teclado').querySelectorAll('button')) {
    const letra = botao.dataset.tecla.toLowerCase();
    if (letra.length !== 1) continue;
    botao.className = 'tecla';
    botao.querySelector('.marcas')?.remove();
    const pistas = pistasPorQuadro.map(p => p[letra]);
    if (modo === 1 && pistas[0]) botao.classList.add(pistas[0]);
    if (modo > 1 && pistas.some(Boolean)) {
      botao.insertAdjacentHTML('beforeend', '<span aria-hidden="true" class="marcas">' + pistas.map(p => '<i class="' + (p || '') + '"></i>').join('') + '</span>');
    }
    const rotulos = pistas.map((p, i) => p ? 'palavra ' + (i + 1) + ', ' + significado[p] : '').filter(Boolean);
    botao.setAttribute('aria-label', [letra.toUpperCase(), ...rotulos].join('. '));
  }
}
function digitar(tecla) {
  if ($('modal').open || Giro.resultado(partida.rodada)) return;
  const {letras} = partida;
  if (tecla === 'ENTER') {
    if (letras.includes('')) return avisar('Preencha as cinco letras.');
    const palavra = letras.join('');
    if (!Giro.vocabulario.has(palavra)) return avisar('O dicionário não reconheceu essa palavra.');
    partida.rodada.palpites.push(palavra);
    partida.letras = vazio();
    partida.cursor = 0;
    const fim = Giro.resultado(partida.rodada);
    if (fim === 'ganhou') partida.vitorias++;
    if (fim === 'perdeu') partida.derrotas++;
    gravar();
    atualizar(true);
    avisar(fim ? '' : 'Palpite ' + partida.rodada.palpites.length + ' registrado.');
    if (fim) mostrarResultado(fim);
    return;
  }
  if (tecla === 'APAGAR') {
    if (!letras[partida.cursor]) partida.cursor = Math.max(0, partida.cursor - 1);
    letras[partida.cursor] = '';
  } else if (/^[a-z]$/i.test(tecla)) {
    letras[partida.cursor] = tecla.toLowerCase();
    partida.cursor = Math.min(4, partida.cursor + 1);
  } else {
    return;
  }
  avisar('');
  gravar();
  atualizar();
}
function mostrar(titulo, html, acao, executar) {
  $('assunto').textContent = titulo;
  $('conteudo').innerHTML = html;
  if (acao) {
    const botao = document.createElement('button');
    botao.className = 'acao';
    botao.textContent = acao;
    botao.onclick = () => { $('modal').close(); executar?.(); };
    $('conteudo').append(botao);
  }
  $('modal').showModal();
}
function mostrarResultado(fim) {
  const total = partida.rodada.palpites.length;
  const resumo = fim === 'ganhou' ? '<p>Você acertou em ' + total + (total === 1 ? ' tentativa.' : ' tentativas.') + '</p>' : '<p>As tentativas acabaram.</p>';
  mostrar(fim === 'ganhou' ? 'Você acertou!' : 'Fim da rodada', resumo + '<p>' + (modo === 1 ? 'Palavra sorteada' : 'Palavras sorteadas') + '</p><p><strong>' + partida.rodada.alvos.join(' · ').toUpperCase() + '</strong></p>', 'Jogar de novo', novaRodada);
}
function novaRodada() {
  partida.rodada = Giro.sortear(modo, partida.rodada.alvos);
  partida.letras = vazio();
  partida.cursor = 0;
  gravar();
  atualizar();
  avisar('Nova rodada iniciada.');
}
$('nova').onclick = () => {
  if (!Giro.resultado(partida.rodada) && (partida.rodada.palpites.length || partida.letras.some(Boolean))) {
    mostrar('Começar outra rodada?', '<p>Você vai descartar os palpites desta partida.</p>', 'Sortear novas palavras', novaRodada);
  } else novaRodada();
};
$('ajuda').onclick = () => mostrar('Como jogar', '<p>Escolha um modo. Digite uma palavra de cinco letras e pressione <strong>Enviar</strong>. Cada palpite vale para todos os tabuleiros em aberto.</p><ul><li><strong>Verde com traço</strong> indica uma letra na posição certa.</li><li><strong>Amarelo com canto marcado</strong> indica uma letra em outra posição.</li><li><strong>Cinza</strong> indica que a palavra já teve todas as ocorrências dessa letra marcadas ou que ela está ausente.</li></ul><p>Digite sem acentos. As palavras podem repetir letras. No teclado, cada faixa de cor corresponde a um tabuleiro, em ordem.</p><p class="credito">Vocabulário de palpites adaptado da <a href="https://users.ime.usp.br/~pf/dicios/" target="_blank" rel="noopener">lista de Paulo Feofiloff (IME-USP)</a>, baseada no br.ispell de Ricardo Ueda Karpischek. Seleção de palavras de cinco letras sob <a href="https://creativecommons.org/licenses/by/4.0/deed.pt-br" target="_blank" rel="noopener">CC BY 4.0</a>.</p>');
$('estatisticas').onclick = () => {
  const linhas = modos.map(numero => {
    const info = numero === modo ? partida : rascunhos.get(numero) ?? ler('modo-' + numero);
    const ok = valida(info, numero);
    const v = ok ? info.vitorias : 0;
    const d = ok ? info.derrotas : 0;
    return '<tr><th scope="row">' + nomes[numero] + '</th><td>' + (v + d) + '</td><td>' + v + '</td></tr>';
  });
  mostrar('Estatísticas', '<p>Rodadas concluídas neste navegador.</p><table><thead><tr><th>Modo</th><th>Jogadas</th><th>Vitórias</th></tr></thead><tbody>' + linhas.join('') + '</tbody></table>');
};
$('fechar').onclick = () => $('modal').close();
$('modal').addEventListener('click', e => {
  const b = $('modal').getBoundingClientRect();
  if (e.target === $('modal') && (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom)) $('modal').close();
});
$('tabuleiros').addEventListener('click', e => {
  if (e.target.dataset.casa === undefined) return;
  partida.cursor = Number(e.target.dataset.casa);
  gravar();
  atualizar();
});
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey || $('modal').open || e.isComposing) return;
  if (e.key === 'Enter' && e.target.closest?.('button') && !e.target.closest('#teclado')) return;
  if (Giro.resultado(partida.rodada)) return;
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault();
    partida.cursor = Math.max(0, Math.min(4, partida.cursor + (e.key === 'ArrowLeft' ? -1 : 1)));
    gravar();
    atualizar();
    return;
  }
  const tecla = e.key === 'Enter' ? 'ENTER' : e.key === 'Backspace' ? 'APAGAR' : Giro.normalizar(e.key);
  if (!/^[a-z]$/.test(tecla) && !['ENTER', 'APAGAR'].includes(tecla)) return;
  e.preventDefault();
  if (e.key.length === 1 && document.activeElement instanceof HTMLButtonElement) document.activeElement.blur();
  digitar(tecla);
});
window.addEventListener('storage', e => {
  if (e.key === codigo + 'modo-' + modo) {
    const remota = ler('modo-' + modo);
    if (valida(remota, modo)) {
      partida = remota;
      rascunhos.set(modo, partida);
      atualizar();
    }
  }
});
criarModos();
criarTeclado();
selecionar(preferencia(), false);
