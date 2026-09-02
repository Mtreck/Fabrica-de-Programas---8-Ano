var SUPABASE_URL = 'https://zgmjscrqndjrrkicvnqj.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnbWpzY3JxbmRqcnJraWN2bnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMzYxNDMsImV4cCI6MjEwMzkxMjE0M30.CpT3m4f1or8DBSXibDbu734NSqjqYh2HkJ-f0gSY4t4';
var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

var FASES = [
  {
    titulo: "Fase 1 - Fazer Suco",
    objetivo: "Monte o programa que faz suco. Algoritmos do dia a dia tambem sao algoritmos!",
    exemplo: "LARANJA &rarr; SUCO NA JARRA",
    blocos: ["PEGAR LARANJA", "CORTAR LARANJA", "ESPREMER", "SERVIR NA JARRA", "LIGAR VENTILADOR"],
    solucao: ["PEGAR LARANJA","CORTAR LARANJA","ESPREMER","SERVIR NA JARRA"],
    dica: "pegar &rarr; cortar &rarr; espremer &rarr; servir"
  },
  {
    titulo: "Fase 2 - Dobrar Numero",
    objetivo: "Entrada: 5 | Saida esperada: 10. Use algoritmos matematicos.",
    exemplo: "ENTRADA: 5 &rarr; SAIDA: 10",
    blocos: ["PEGAR NUMERO", "MULTIPLICAR POR 2", "SOMAR 5", "MOSTRAR NA TELA", "DIVIDIR POR 2"],
    solucao: ["PEGAR NUMERO","MULTIPLICAR POR 2","MOSTRAR NA TELA"],
    dica: "Pegar &rarr; Calcular &rarr; Mostrar"
  },
  {
    titulo: "Fase 3 - Calcular Media",
    objetivo: "Notas: 7 e 9 | Saida esperada: 8. Um programa junta varios algoritmos!",
    exemplo: "ENTRADA: [7, 9] &rarr; SAIDA: 8",
    blocos: ["PEGAR NOTA 1", "PEGAR NOTA 2", "SOMAR NOTAS", "DIVIDIR POR 2", "MOSTRAR NA TELA", "MULTIPLICAR POR 2"],
    solucao: ["PEGAR NOTA 1","PEGAR NOTA 2","SOMAR NOTAS","DIVIDIR POR 2","MOSTRAR NA TELA"],
    dica: "Pegue as duas, some, divida, mostre"
  },
  {
    titulo: "Fase 4 - Aprovado ou Reprovado?",
    objetivo: "Nota 6 = REPROVADO. Nota 8 = APROVADO. Use o algoritmo condicional SE.",
    exemplo: "6 &rarr; REPROVADO | 8 &rarr; APROVADO",
    blocos: ["PEGAR NOTA", "SE NOTA >= 7", "MOSTRAR APROVADO", "MOSTRAR REPROVADO", "SOMAR 10"],
    solucao: ["PEGAR NOTA","SE NOTA >= 7","MOSTRAR APROVADO","MOSTRAR REPROVADO"],
    dica: "Pegar nota &rarr; Testar condicao &rarr; Mostrar resultado"
  },
  {
    titulo: "Fase 5 - Robo Entregador",
    objetivo: "O robo precisa andar 3 casas e entregar. Repita o algoritmo ANDAR.",
    exemplo: "[ROBO _ _ PRESENTE] &rarr; 3x ANDAR + ENTREGAR",
    blocos: ["ANDAR 1 CASA", "ANDAR 1 CASA", "ANDAR 1 CASA", "ENTREGAR", "VIRAR", "PEGAR NOTA"],
    solucao: ["ANDAR 1 CASA","ANDAR 1 CASA","ANDAR 1 CASA","ENTREGAR"],
    dica: "Algoritmo repetido = programa com laco"
  },
  {
    titulo: "Fase 6 - Contar Votos",
    objetivo: "Receba os votos e conte. Saida: total de votos registrados.",
    exemplo: "VOTOS: [Ana, Joao, Maria] &rarr; SAIDA: 3",
    blocos: ["LER VOTO 1", "LER VOTO 2", "LER VOTO 3", "CONTAR TOTAL", "MOSTRAR NA TELA", "LIMPAR LISTA"],
    solucao: ["LER VOTO 1","LER VOTO 2","LER VOTO 3","CONTAR TOTAL","MOSTRAR NA TELA"],
    dica: "Leia todos, conte, mostre"
  },
  {
    titulo: "Fase 7 - Filtrar Pares",
    objetivo: "Entrada: 4 e 7 | Saida: so os numeros pares. Use condicao para filtrar.",
    exemplo: "ENTRADA: [4, 7] &rarr; SAIDA: [4]",
    blocos: ["LER NUMERO 1", "LER NUMERO 2", "SE E PAR", "ADICIONAR AO RESULTADO", "MOSTRAR RESULTADO", "IGNORAR"],
    solucao: ["LER NUMERO 1","SE E PAR","ADICIONAR AO RESULTADO","LER NUMERO 2","SE E PAR","ADICIONAR AO RESULTADO","MOSTRAR RESULTADO"],
    dica: "Para cada numero, teste se e par antes de adicionar"
  },
  {
    titulo: "Fase 8 - Calcular Preco",
    objetivo: "Item custa R$10. Com 3 itens e desconto de R$2, quanto paga?",
    exemplo: "QTD: 3 | PRECO: 10 | DESCONTO: 2 &rarr; SAIDA: 28",
    blocos: ["LER QUANTIDADE", "LER PRECO UNIT.", "LER DESCONTO", "MULTIPLICAR QTD X PRECO", "SUBTRAIR DESCONTO", "MOSTRAR TOTAL"],
    solucao: ["LER QUANTIDADE","LER PRECO UNIT.","LER DESCONTO","MULTIPLICAR QTD X PRECO","SUBTRAIR DESCONTO","MOSTRAR TOTAL"],
    dica: "Leia dados, multiplique, subtraia, mostre"
  },
  {
    titulo: "Fase 9 - Repetir 3 Vezes",
    objetivo: "O aluno precisa dizer 'obrigado' 3 vezes. Monte o laco com repeticao.",
    exemplo: "REPETIR 3x: DIZER OBRIGADO &rarr; SAIDA: obrigado, obrigado, obrigado",
    blocos: ["INICIAR LACO", "DIZER OBRIGADO", "DIZER OBRIGADO", "DIZER OBRIGADO", "FIM DO LACO", "MOSTRAR NA TELA"],
    solucao: ["INICIAR LACO","DIZER OBRIGADO","FIM DO LACO","MOSTRAR NA TELA"],
    dica: "Laco envolve a acao que se repete"
  },
  {
    titulo: "Fase 10 - Programa Completo",
    objetivo: "Junte tudo: leia, calcule, teste condicao, repita, mostre. O grande desafio!",
    exemplo: "LER NOTA &rarr; SE >= 7 &rarr; APROVAR &rarr; MOSTRAR",
    blocos: ["LER DADOS", "CALCULAR MEDIA", "SE MEDIA >= 7", "APROVAR", "REPROVAR", "REPETIR 2x VERIFICAR", "MOSTRAR RESULTADO FINAL"],
    solucao: ["LER DADOS","CALCULAR MEDIA","SE MEDIA >= 7","APROVAR","REPROVAR","MOSTRAR RESULTADO FINAL"],
    dica: "Leia, calcule, teste, passe o resultado, mostre"
  }
];

var estado = {
  nome: "",
  fase: 0,
  pontos: 0,
  programa: [],
  inicio: null,
  timer: null,
  faseLiberada: 0
};

// ===== SENHA DO PROFESSOR =====
function getProfSenha() {
  return localStorage.getItem('fabrica_prof_senha') || 'prof';
}
function setProfSenha(s) {
  localStorage.setItem('fabrica_prof_senha', s);
}
function profLogado() {
  return sessionStorage.getItem('fabrica_prof_logado') === '1';
}

function entrarProf() {
  var input = document.getElementById('profSenhaInput');
  var erro = document.getElementById('profSenhaErro');
  var senha = input.value.trim();
  if (senha === getProfSenha()) {
    sessionStorage.setItem('fabrica_prof_logado', '1');
    document.getElementById('profLoginBox').classList.add('hidden');
    document.getElementById('profPainel').classList.remove('hidden');
    gerarQR();
    renderRankingProf();
    renderControleFases();
  } else {
    erro.classList.remove('hidden');
    input.value = '';
    input.focus();
  }
}

// ===== NAVIGACAO =====
function router(view) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.bn-btn').forEach(function(b) { b.classList.remove('active'); });
  var el = document.getElementById('view-' + view);
  if (el) el.classList.add('active');
  var nav = document.getElementById('nav-' + view);
  if (nav) nav.classList.add('active');
  if (view === 'professor') {
    if (profLogado()) {
      document.getElementById('profLoginBox').classList.add('hidden');
      document.getElementById('profPainel').classList.remove('hidden');
      gerarQR(); renderRankingProf(); renderControleFases();
    } else {
      document.getElementById('profLoginBox').classList.remove('hidden');
      document.getElementById('profPainel').classList.add('hidden');
      document.getElementById('profSenhaErro').classList.add('hidden');
      document.getElementById('profSenhaInput').value = '';
    }
  }
  if (view === 'jogar') { renderRankingMini(); }
  location.hash = view;
}

// ===== QR CODE =====
function gerarQR() {
  var sala = document.getElementById('salaInput').value || 'SALA-7A';
  var base = location.href.split('#')[0].split('?')[0];
  var link = base + '#jogar';
  var url = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(link);
  document.getElementById('qrImg').src = url;
  document.getElementById('qrLink').textContent = link + '?sala=' + encodeURIComponent(sala);
}

function copiarLink() {
  var t = document.getElementById('qrLink').textContent;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(t).then(function() { alert('Link copiado!'); });
  } else {
    prompt('Copie o link:', t);
  }
}

// ===== CONTROLE DE FASES (Supabase) =====
async function getFasesLiberadas() {
  var resp = await supabase.from('fases_liberadas').select('fase').order('fase');
  if (!resp.data) return [];
  return resp.data.map(function(r) { return r.fase; });
}

async function renderControleFases() {
  var c = document.getElementById('controleFases');
  if (!c) return;
  var liberadas = await getFasesLiberadas();
  var html = '';
  for (var i = 0; i < FASES.length; i++) {
    var liberada = liberadas.indexOf(i) !== -1;
    var classe = liberada ? 'ctrl-fase lib' : 'ctrl-fase';
    var btnHtml = liberada
      ? '<button class="ctrl-fase-btn fechar" onclick="fecharFase(' + i + ')">Fechar</button>'
      : '<button class="ctrl-fase-btn lib" onclick="liberarFase(' + i + ')">Liberar</button>';
    html += '<div class="' + classe + '">' +
      '<div class="ctrl-fase-num">' + (i + 1) + '</div>' +
      '<div class="ctrl-fase-info"><strong>' + FASES[i].titulo + '</strong>' +
      (liberada ? 'Liberada' : 'Bloqueada') + '</div>' +
      btnHtml + '</div>';
  }
  c.innerHTML = html;
  var badge = document.getElementById('faseAtualProf');
  if (badge) {
    badge.textContent = liberadas.length > 0 ? 'Fase ' + (Math.max.apply(null, liberadas) + 1) : 'Nenhuma';
  }
}

async function liberarFase(idx) {
  await supabase.from('fases_liberadas').upsert({ fase: idx }, { onConflict: 'fase' });
  renderControleFases();
}

async function fecharFase(idx) {
  await supabase.from('fases_liberadas').delete().eq('fase', idx);
  renderControleFases();
}

// ===== JOGAR =====
function entrarJogo() {
  var n = document.getElementById('nomeInput').value.trim();
  if (n.length < 2) { alert('Digite seu nome (minimo 2 letras)'); return; }
  estado.nome = n;
  estado.fase = 0;
  estado.pontos = 0;
  estado.programa = [];
  document.getElementById('loginBox').classList.add('hidden');
  document.getElementById('gameBox').classList.remove('hidden');
  document.getElementById('playerName').textContent = n;
  iniciarTimer();
  carregarFase();
}

function iniciarTimer() {
  estado.inicio = Date.now();
  clearInterval(estado.timer);
  estado.timer = setInterval(function() {
    var s = Math.floor((Date.now() - estado.inicio) / 1000);
    var m = String(Math.floor(s / 60)).padStart(2, '0');
    var sec = String(s % 60).padStart(2, '0');
    document.getElementById('tempo').textContent = m + ':' + sec;
  }, 500);
}

async function checarFaseLiberada() {
  var liberadas = await getFasesLiberadas();
  if (liberadas.indexOf(estado.fase) !== -1) {
    document.getElementById('faseAguardando').classList.add('hidden');
    document.getElementById('faseConteudo').classList.remove('hidden');
    return true;
  }
  document.getElementById('faseAguardando').classList.remove('hidden');
  document.getElementById('faseConteudo').classList.add('hidden');
  return false;
}

function carregarFase() {
  var f = FASES[estado.fase];
  document.getElementById('faseLabel').textContent = 'Fase ' + (estado.fase + 1) + '/' + FASES.length;
  document.getElementById('jogarPontos').textContent = estado.pontos + ' pts';
  document.getElementById('progressBar').style.width = ((estado.fase) / FASES.length * 100) + '%';
  document.getElementById('faseTitulo').textContent = f.titulo;
  document.getElementById('faseObjetivo').textContent = f.objetivo;
  document.getElementById('faseExemplo').innerHTML = f.exemplo;
  document.getElementById('execLog').textContent = '';
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback hidden';
  document.getElementById('btnProxima').classList.add('hidden');
  document.getElementById('btnExecutar').disabled = false;
  estado.programa = [];
  renderBlocos();
  renderPrograma();
  checarFaseLiberada();
}

function renderBlocos() {
  var f = FASES[estado.fase];
  var c = document.getElementById('blocosDisponiveis');
  c.innerHTML = '';
  var embaralhados = f.blocos.slice().sort(function() { return Math.random() - 0.5; });
  embaralhados.forEach(function(txt) {
    var d = document.createElement('div');
    d.className = 'bloco';
    d.textContent = txt;
    d.setAttribute('data-valor', txt);
    d.onclick = function() { addBloco(txt); };
    c.appendChild(d);
  });
}

function renderPrograma() {
  var c = document.getElementById('meuPrograma');
  c.innerHTML = '';
  if (estado.programa.length === 0) {
    c.innerHTML = '<p class="vazio-msg">Toque nos blocos acima</p>';
    return;
  }
  estado.programa.forEach(function(txt, idx) {
    var d = document.createElement('div');
    d.className = 'bloco bloco-programa';
    d.innerHTML = '<span class="bloco-num">' + (idx + 1) + '.</span> ' + txt +
      ' <button class="bloco-remove" onclick="removerBloco(' + idx + ')">&times;</button>';
    c.appendChild(d);
  });
}

function addBloco(txt) {
  estado.programa.push(txt);
  renderPrograma();
}

function removerBloco(i) {
  estado.programa.splice(i, 1);
  renderPrograma();
}

function limparPrograma() {
  estado.programa = [];
  renderPrograma();
  document.getElementById('execLog').textContent = '';
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback hidden';
}

function executarPrograma() {
  var f = FASES[estado.fase];
  var log = document.getElementById('execLog');
  var fb = document.getElementById('feedback');
  log.textContent = '';
  log.classList.remove('hidden');
  fb.classList.remove('hidden');

  if (estado.programa.length === 0) {
    fb.textContent = 'Monte seu programa primeiro!';
    fb.className = 'feedback err';
    return;
  }

  document.getElementById('btnExecutar').disabled = true;
  var i = 0;
  function step() {
    if (i < estado.programa.length) {
      log.textContent += 'Passo ' + (i + 1) + ': ' + estado.programa[i] + '\n';
      i++;
      setTimeout(step, 250);
    } else {
      var ok = estado.programa.length === f.solucao.length &&
        estado.programa.every(function(v, idx) { return v === f.solucao[idx]; });
      if (ok) {
        var pts = 100 + Math.max(0, 50 - Math.floor((Date.now() - estado.inicio) / 2000));
        estado.pontos += pts;
        document.getElementById('jogarPontos').textContent = estado.pontos + ' pts';
        fb.textContent = 'Programa correto! +' + pts + ' pontos';
        fb.className = 'feedback ok';
        document.getElementById('btnProxima').classList.remove('hidden');
        salvarRanking().then(function() { renderRankingMini(); });
      } else {
        fb.textContent = 'Programa com erro. Ordene os blocos novamente. Dica: ' + f.dica;
        fb.className = 'feedback err';
        log.textContent += '\nERRO: saida inesperada.';
        document.getElementById('btnExecutar').disabled = false;
      }
    }
  }
  step();
}

function proximaFase() {
  if (estado.fase < FASES.length - 1) {
    estado.fase++;
    carregarFase();
  } else {
    clearInterval(estado.timer);
    document.getElementById('progressBar').style.width = '100%';
    var tempo = document.getElementById('tempo').textContent;
    document.getElementById('gameBox').innerHTML =
      '<div class="login-card" style="margin:40px auto">' +
      '<div class="login-icon">&#127942;</div>' +
      '<h2>Fabrica Concluida!</h2>' +
      '<p><strong>' + estado.nome + '</strong> fez <strong>' + estado.pontos + '</strong> pontos em ' + tempo + '</p>' +
      '<p style="color:var(--muted);font-size:13px;margin-top:8px">Voce entendeu: Programa = Algoritmos em sequencia</p>' +
      '<button class="btn-entrar" style="margin-top:14px" onclick="location.reload()">Jogar de novo</button>' +
      '</div>';
  }
}

// ===== RANKING (Supabase) =====
async function salvarRanking() {
  var tempo = Math.floor((Date.now() - estado.inicio) / 1000);
  await supabase.from('ranking').upsert({
    nome: estado.nome,
    pontos: estado.pontos,
    fase: estado.fase + 1,
    tempo: tempo
  }, { onConflict: 'nome' });
}

async function getRanking() {
  var resp = await supabase
    .from('ranking')
    .select('*')
    .order('pontos', { ascending: false })
    .limit(20);
  return resp.data || [];
}

async function renderRankingProf() {
  var c = document.getElementById('rankingProf');
  if (!c) return;
  var arr = await getRanking();
  if (arr.length === 0) {
    c.innerHTML = '<p class="ranking-vazio">Ninguem jogou ainda. Projete o QR e aguarde.</p>';
    return;
  }
  c.innerHTML = arr.map(function(r, i) {
    return '<div class="rank-row">' +
      '<span>' + (i + 1) + 'o ' + r.nome + ' <span class="rank-fase">Fase ' + r.fase + '</span></span>' +
      '<span class="rank-pontos">' + r.pontos + ' pts</span></div>';
  }).join('');
}

async function renderRankingMini() {
  var c = document.getElementById('rankingMini');
  if (!c) return;
  var arr = (await getRanking()).slice(0, 5);
  if (arr.length === 0) {
    c.innerHTML = '<p class="hint">Seja o primeiro!</p>';
    return;
  }
  c.innerHTML = arr.map(function(r, i) {
    var cls = r.nome === estado.nome ? 'rank-row me' : 'rank-row';
    return '<div class="' + cls + '"><span>' + (i + 1) + 'o ' + r.nome + '</span><span class="rank-pontos">' + r.pontos + '</span></div>';
  }).join('');
}

async function limparRanking() {
  if (confirm('Zerar ranking de todos?')) {
    await supabase.from('ranking').delete().neq('id', 0);
    renderRankingProf();
    renderRankingMini();
  }
}

// ===== REALTIME: atualiza ranking e fases em tempo real =====
supabase
  .channel('ranking-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'ranking' }, function() {
    renderRankingMini();
    renderRankingProf();
  })
  .on('postgres_changes', { event: '*', schema: 'public', table: 'fases_liberadas' }, function() {
    checarFaseLiberada();
  })
  .subscribe();

// ===== POLLING: checa se fase foi liberada a cada 2s =====
setInterval(function() {
  if (estado.nome && document.getElementById('faseConteudo')) {
    checarFaseLiberada();
  }
}, 2000);

// ===== INIT =====
window.addEventListener('load', function() {
  var h = location.hash.replace('#', '');
  if (h === 'jogar' || h === 'professor') router(h);
  else router('home');
  gerarQR();
});
