var SUPABASE_URL = 'https://zgmjscrqndjrrkicvnqj.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnbWpzY3JxbmRqcnJraWN2bnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMzYxNDMsImV4cCI6MjEwMzkxMjE0M30.CpT3m4f1or8DBSXibDbu734NSqjqYh2HkJ-f0gSY4t4';
var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

var estado = {
  nome: '',
  pontos: 0,
  fase: 0,
  faseAtual: 0,
  programa: [],
  inicio: null,
  timer: null,
  jogo: 'algoritmos',
  perguntas: [],
  perguntaAtual: 0,
  respondeuQuiz: false
};

var fasesCustomCache = [];
var quizPerguntasCache = [];

// ===== AUTH =====
async function fazerLogin() {
  var nome = document.getElementById('loginNome').value.trim();
  var senha = document.getElementById('loginSenha').value.trim();
  var erro = document.getElementById('loginErro');
  if (nome.length < 2) { mostrarErro(erro, 'Nome precisa ter pelo menos 2 letras'); return; }
  if (!senha) { mostrarErro(erro, 'Digite a senha'); return; }

  var resp = await supabase.from('usuarios').select('*').eq('nome', nome).eq('senha', senha).single();
  if (resp.error || !resp.data) {
    mostrarErro(erro, 'Nome ou senha incorretos');
    return;
  }
  estado.nome = resp.data.nome;
  estado.pontos = resp.data.pontos || 0;
  estado.faseAtual = resp.data.fase_atual || 0;
  estado.jogo = resp.data.jogo || 'algoritmos';
  estado.fase = 0;
  document.getElementById('playerName').textContent = estado.nome;
  document.getElementById('jogarPontos').textContent = estado.pontos + ' pts';
  document.getElementById('loginBox') ? document.getElementById('loginBox').classList.add('hidden') : null;
  router('jogar');
  registrarOnline();
  iniciarTimer();
  await carregarFases();
  await carregarQuizPerguntas();
  carregarFase();
  checarFaseLiberada();
  renderRankingMini();
}

function mostrarErro(el, msg) {
  el.textContent = msg;
  el.classList.remove('hidden');
}

function entrarJogo() {
  router('login');
}

async function salvarProgresso() {
  if (!estado.nome) return;
  await supabase.from('ranking').upsert({
    nome: estado.nome,
    pontos: estado.pontos,
    fase: estado.faseAtual + 1,
    tempo: Math.floor((Date.now() - estado.inicio) / 1000),
    jogo: estado.jogo
  }, { onConflict: 'nome' });
  await supabase.from('usuarios').update({
    pontos: estado.pontos,
    fase_atual: estado.faseAtual,
    jogo: estado.jogo
  }).eq('nome', estado.nome);
}

var estadoSalaAtual = null; // sala selecionada pelo professor

// ===== PROFESSOR AUTH =====
function profLogado() {
  return sessionStorage.getItem('fabrica_prof_nome') || '';
}

async function entrarProf() {
  var nome = document.getElementById('profNomeInput').value.trim();
  var senha = document.getElementById('profSenhaInput').value.trim();
  var erro = document.getElementById('profSenhaErro');
  if (!nome) { mostrarErro(erro, 'Digite seu nome'); return; }
  if (!senha) { mostrarErro(erro, 'Digite sua senha'); return; }

  var resp = await supabase.from('professores').select('*').eq('nome', nome).eq('senha', senha).single();
  if (resp.error || !resp.data) {
    mostrarErro(erro, 'Nome ou senha incorretos');
    document.getElementById('profSenhaInput').value = '';
    document.getElementById('profSenhaInput').focus();
    return;
  }
  sessionStorage.setItem('fabrica_prof_nome', nome);
  document.getElementById('profLoginBox').classList.add('hidden');
  document.getElementById('profCadastroBox').classList.add('hidden');
  document.getElementById('profPainel').classList.remove('hidden');
  renderListaSalas();
}

async function cadastrarProf() {
  var nome = document.getElementById('profCadNome').value.trim();
  var senha = document.getElementById('profCadSenha').value.trim();
  var confirma = document.getElementById('profCadConfirma').value.trim();
  var erro = document.getElementById('profCadErro');
  if (!nome || nome.length < 2) { mostrarErro(erro, 'Nome precisa ter pelo menos 2 letras'); return; }
  if (!senha || senha.length < 3) { mostrarErro(erro, 'Senha precisa ter pelo menos 3 caracteres'); return; }
  if (senha !== confirma) { mostrarErro(erro, 'As senhas nao conferem'); return; }

  var resp = await supabase.from('professores').insert({ nome: nome, senha: senha });
  if (resp.error) {
    mostrarErro(erro, 'Erro: ' + resp.error.message);
    return;
  }
  sessionStorage.setItem('fabrica_prof_nome', nome);
  document.getElementById('profLoginBox').classList.add('hidden');
  document.getElementById('profCadastroBox').classList.add('hidden');
  document.getElementById('profPainel').classList.remove('hidden');
  renderListaSalas();
}

function sairProf() {
  sessionStorage.removeItem('fabrica_prof_nome');
  estadoSalaAtual = null;
  document.getElementById('profPainel').classList.add('hidden');
  document.getElementById('view-sala').classList.remove('active');
  document.getElementById('profLoginBox').classList.remove('hidden');
  document.getElementById('profCadastroBox').classList.add('hidden');
  document.getElementById('profNomeInput').value = '';
  document.getElementById('profSenhaInput').value = '';
  document.getElementById('profSenhaErro').classList.add('hidden');
}

// ===== NAVIGATION =====
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
      document.getElementById('profCadastroBox').classList.add('hidden');
      document.getElementById('profPainel').classList.remove('hidden');
      document.getElementById('view-sala').classList.remove('active');
      renderListaSalas();
    } else {
      document.getElementById('profLoginBox').classList.remove('hidden');
      document.getElementById('profCadastroBox').classList.add('hidden');
      document.getElementById('profPainel').classList.add('hidden');
      document.getElementById('view-sala').classList.remove('active');
      document.getElementById('profSenhaErro').classList.add('hidden');
      document.getElementById('profNomeInput').value = '';
      document.getElementById('profSenhaInput').value = '';
    }
  }
  if (view === 'jogar') {
    if (!estado.nome) {
      router('login');
      return;
    }
    renderRankingMini();
    renderJogar();
  }
  if (view === 'login') {
    document.getElementById('loginNome').value = '';
    document.getElementById('loginSenha').value = '';
    document.getElementById('loginErro').classList.add('hidden');
  }
  location.hash = view;
}

// ===== SALAS CRUD =====
var salaJogoTipo = 'algoritmos';

function criarSalaModal(jogo) {
  salaJogoTipo = jogo;
  document.getElementById('modalJogoTipo').textContent = jogo === 'quiz' ? 'Quiz' : 'Algoritmos';
  document.getElementById('modalSalaNome').value = '';
  document.getElementById('modalSalaErro').classList.add('hidden');
  document.getElementById('modalCriarSala').classList.remove('hidden');
  document.getElementById('modalSalaNome').focus();
}

function fecharModal(e) {
  if (e.target === document.getElementById('modalCriarSala')) {
    document.getElementById('modalCriarSala').classList.add('hidden');
  }
}

async function criarSala() {
  var nome = document.getElementById('modalSalaNome').value.trim();
  var erro = document.getElementById('modalSalaErro');
  if (!nome) { mostrarErro(erro, 'Digite o nome da sala'); return; }

  var resp = await supabase.from('salas').insert({ nome: nome, jogo: salaJogoTipo });
  if (resp.error) {
    mostrarErro(erro, 'Erro: ' + resp.error.message);
    return;
  }
  document.getElementById('modalCriarSala').classList.add('hidden');
  renderListaSalas();
}

async function renderListaSalas() {
  var c = document.getElementById('listaSalas');
  if (!c) return;
  var resp = await supabase.from('salas').select('*').order('created_at', { ascending: false });
  var salas = resp.data || [];
  if (salas.length === 0) {
    c.innerHTML = '<p class="hint">Nenhuma sala criada. Clique em uma atividade acima para comecar.</p>';
    return;
  }
  var html = '';
  for (var i = 0; i < salas.length; i++) {
    var s = salas[i];
    var countResp = await supabase.from('usuarios').select('id', { count: 'exact', head: true }).eq('sala_id', s.id);
    var count = countResp.count || 0;
    var iconCls = s.jogo === 'quiz' ? 'quiz' : 'alg';
    var icon = s.jogo === 'quiz' ? '&#10067;' : '&#128218;';
    var statusCls = s.ativa ? 'aberta' : 'fechada';
    var statusTxt = s.ativa ? 'Aberta' : 'Fechada';
    html += '<div class="sala-card' + (s.ativa ? '' : ' sala-card-fechada') + '" onclick="entrarSala(' + s.id + ')">' +
      '<div class="sala-card-icon ' + iconCls + '">' + icon + '</div>' +
      '<div class="sala-card-info"><strong>' + s.nome + '</strong><small>' + s.jogo + ' &middot; ' + count + ' aluno(s)</small></div>' +
      '<span class="sala-card-badge ' + statusCls + '">' + statusTxt + '</span>' +
      '</div>';
  }
  c.innerHTML = html;
}

async function entrarSala(id) {
  var resp = await supabase.from('salas').select('*').eq('id', id).single();
  if (resp.error || !resp.data) return;
  estadoSalaAtual = resp.data;
  document.getElementById('profPainel').classList.add('hidden');
  document.getElementById('view-sala').classList.add('active');
  renderSalaDetalhe();
}

function voltarHub() {
  estadoSalaAtual = null;
  document.getElementById('view-sala').classList.remove('active');
  document.getElementById('profPainel').classList.remove('hidden');
  renderListaSalas();
}

async function renderSalaDetalhe() {
  if (!estadoSalaAtual) return;
  var s = estadoSalaAtual;
  document.getElementById('salaNomeTopo').textContent = s.nome;
  var badge = document.getElementById('salaStatusBadge');
  badge.textContent = s.ativa ? 'Aberta' : 'Fechada';
  badge.className = 'sala-status-badge ' + (s.ativa ? 'aberta' : 'fechada');
  var btnFechar = document.getElementById('btnFecharAbrirSala');
  btnFechar.textContent = s.ativa ? 'Fechar sala' : 'Abrir sala';
  btnFechar.className = 'btn-sm ' + (s.ativa ? 'btn-danger' : 'btn-accent');

  var base = location.href.split('#')[0].split('?')[0];
  var link = base + '#jogar';
  var url = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(link);
  document.getElementById('salaQrImg').src = url;

  // Montar tabs conforme tipo da sala
  var tabsHtml = '<button class="prof-tab active" onclick="salaTab(\'ranking\')">Ranking</button>';
  tabsHtml += '<button class="prof-tab" onclick="salaTab(\'alunos\')">Alunos</button>';
  if (s.jogo === 'quiz') {
    tabsHtml += '<button class="prof-tab" onclick="salaTab(\'quiz\')">Quiz</button>';
  } else {
    tabsHtml += '<button class="prof-tab" onclick="salaTab(\'fases\')">Fases</button>';
  }
  document.getElementById('salaTabs').innerHTML = tabsHtml;

  // Resetar pra tab ranking
  document.querySelectorAll('#stab-ranking, #stab-alunos, #stab-fases, #stab-quiz').forEach(function(el) {
    el.classList.remove('active');
  });
  document.getElementById('stab-ranking').classList.add('active');

  renderAlunosSala();
  renderRankingSala();
  renderJogadores();
  if (s.jogo === 'quiz') renderListaQuizPerguntas();
  else renderListaFasesCustom();
}

async function toggleSala() {
  if (!estadoSalaAtual) return;
  var novoStatus = !estadoSalaAtual.ativa;
  await supabase.from('salas').update({ ativa: novoStatus }).eq('id', estadoSalaAtual.id);
  estadoSalaAtual.ativa = novoStatus;
  renderSalaDetalhe();
}

async function deletarSalaAtual() {
  if (!estadoSalaAtual) return;
  if (!confirm('Deletar sala "' + estadoSalaAtual.nome + '"?')) return;
  await supabase.from('usuarios').update({ sala_id: null }).eq('sala_id', estadoSalaAtual.id);
  await supabase.from('salas').delete().eq('id', estadoSalaAtual.id);
  voltarHub();
}

function copiarLinkSala() {
  var t = document.getElementById('salaQrLink').textContent;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(t).then(function() { alert('Link copiado!'); });
  } else {
    prompt('Copie o link:', t);
  }
}

async function renderAlunosSala() {
  var c = document.getElementById('salaListaAlunos');
  if (!c || !estadoSalaAtual) return;
  var resp = await supabase.from('usuarios').select('*').eq('sala_id', estadoSalaAtual.id).order('nome');
  var alunos = resp.data || [];
  if (alunos.length === 0) {
    c.innerHTML = '<p class="hint">Nenhum aluno na sala</p>';
    return;
  }
  c.innerHTML = alunos.map(function(a) {
    return '<div class="sala-aluno-item">' +
      '<span class="sala-aluno-nome">' + a.nome + '</span>' +
      '<span class="sala-aluno-pontos">' + (a.pontos || 0) + ' pts</span>' +
      '<button class="sala-aluno-remove" onclick="event.stopPropagation();removerAlunoSala(' + a.id + ')">&times;</button>' +
      '</div>';
  }).join('');
}

async function removerAlunoSala(id) {
  await supabase.from('usuarios').update({ sala_id: null }).eq('id', id);
  renderAlunosSala();
}

// ===== SALA TABS =====
function salaTab(tab) {
  document.querySelectorAll('#salaTabs .prof-tab').forEach(function(t) { t.classList.remove('active'); });
  document.querySelectorAll('#view-sala .prof-tab-content').forEach(function(c) { c.classList.remove('active'); });
  event.target.classList.add('active');
  var content = document.getElementById('stab-' + tab);
  if (content) content.classList.add('active');
  if (tab === 'ranking') renderRankingSala();
  if (tab === 'alunos') { renderAlunosSala(); renderJogadores(); }
  if (tab === 'fases') renderListaFasesCustom();
  if (tab === 'quiz') renderListaQuizPerguntas();
}

async function renderRankingSala() {
  var c = document.getElementById('salaRankingTab');
  if (!c) return;
  var resp = await supabase.from('ranking').select('*').order('pontos', { ascending: false }).limit(20);
  var arr = resp.data || [];
  if (arr.length === 0) {
    c.innerHTML = '<p class="ranking-vazio">Ninguem jogou ainda.</p>';
    return;
  }
  c.innerHTML = arr.map(function(r, i) {
    return montarRankRow(r, i, false);
  }).join('');
}

// ===== CONTROLE DE FASES (Supabase) =====
async function getFasesLiberadas() {
  var resp = await supabase.from('fases_liberadas').select('fase').order('fase');
  if (!resp.data) return [];
  return resp.data.map(function(r) { return r.fase; });
}

async function checarFaseLiberada() {
  if (!estado.nome) return false;
  var liberadas = await getFasesLiberadas();
  if (estado.jogo === 'algoritmos') {
    if (liberadas.indexOf(estado.fase) !== -1) {
      document.getElementById('faseAguardando').classList.add('hidden');
      document.getElementById('faseConteudo').classList.remove('hidden');
      document.getElementById('quizConteudo').classList.add('hidden');
      return true;
    }
    document.getElementById('faseAguardando').classList.remove('hidden');
    document.getElementById('faseConteudo').classList.add('hidden');
    return false;
  } else {
    // quiz: check if fase 0 (quiz starts when fase 0 is liberated)
    if (liberadas.indexOf(0) !== -1) {
      document.getElementById('faseAguardando').classList.add('hidden');
      document.getElementById('faseConteudo').classList.add('hidden');
      document.getElementById('quizConteudo').classList.remove('hidden');
      return true;
    }
    document.getElementById('faseAguardando').classList.remove('hidden');
    document.getElementById('quizConteudo').classList.add('hidden');
    return false;
  }
}

// ===== CARREGAR FASES E QUIZ =====
async function carregarFases() {
  var resp = await supabase.from('fases_custom').select('*').order('ordem');
  fasesCustomCache = (resp.data && resp.data.length > 0) ? resp.data : [];
}

async function carregarQuizPerguntas() {
  var resp = await supabase.from('quiz_perguntas').select('*').order('ordem');
  quizPerguntasCache = resp.data || [];
}

// ===== GAME: ALGORITMOS =====
function carregarFase() {
  if (fasesCustomCache.length === 0) {
    document.getElementById('faseAguardando').classList.remove('hidden');
    document.getElementById('faseConteudo').classList.add('hidden');
    return;
  }
  if (estado.fase >= fasesCustomCache.length) {
    clearInterval(estado.timer);
    document.getElementById('progressBar').style.width = '100%';
    var tempo = document.getElementById('tempo').textContent;
    document.getElementById('gameBox') ? null : null;
    document.getElementById('faseConteudo').innerHTML =
      '<div class="login-card" style="margin:40px auto">' +
      '<div class="login-icon">&#127942;</div>' +
      '<h2>Todas as fases concluidas!</h2>' +
      '<p><strong>' + estado.nome + '</strong> fez <strong>' + estado.pontos + '</strong> pontos em ' + tempo + '</p>' +
      '<button class="btn-entrar" style="margin-top:14px" onclick="location.reload()">Jogar de novo</button>' +
      '</div>';
    return;
  }
  var f = fasesCustomCache[estado.fase];
  document.getElementById('faseLabel').textContent = 'Fase ' + (estado.fase + 1) + '/' + fasesCustomCache.length;
  document.getElementById('jogarPontos').textContent = estado.pontos + ' pts';
  document.getElementById('progressBar').style.width = ((estado.fase) / fasesCustomCache.length * 100) + '%';
  document.getElementById('faseTitulo').textContent = f.titulo;
  document.getElementById('faseObjetivo').textContent = f.objetivo || '';
  document.getElementById('faseExemplo').innerHTML = f.exemplo || '';
  document.getElementById('execLog').textContent = '';
  document.getElementById('execLog').classList.add('hidden');
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback hidden';
  document.getElementById('btnProxima').classList.add('hidden');
  document.getElementById('btnExecutar').disabled = false;
  document.getElementById('faseConteudo').classList.remove('hidden');
  estado.programa = [];
  renderBlocos();
  renderPrograma();
}

function renderBlocos() {
  var f = fasesCustomCache[estado.fase];
  var blocos = Array.isArray(f.blocos) ? f.blocos : JSON.parse(f.blocos);
  var c = document.getElementById('blocosDisponiveis');
  c.innerHTML = '';
  var embaralhados = blocos.slice().sort(function() { return Math.random() - 0.5; });
  embaralhados.forEach(function(txt) {
    var d = document.createElement('div');
    d.className = 'bloco';
    d.textContent = txt;
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
    d.innerHTML = '<span class="bloco-num">' + (idx + 1) + '.</span>' +
      '<span class="bloco-txt">' + txt + '</span>' +
      '<button class="bloco-remove" onclick="removerBloco(' + idx + ')">&times;</button>';
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
  document.getElementById('execLog').classList.add('hidden');
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback hidden';
}

function executarPrograma() {
  var f = fasesCustomCache[estado.fase];
  var solucao = Array.isArray(f.solucao) ? f.solucao : JSON.parse(f.solucao);
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
      var ok = estado.programa.length === solucao.length &&
        estado.programa.every(function(v, idx) { return v === solucao[idx]; });
      if (ok) {
        var pts = 100 + Math.max(0, 50 - Math.floor((Date.now() - estado.inicio) / 2000));
        estado.pontos += pts;
        estado.faseAtual = estado.fase;
        document.getElementById('jogarPontos').textContent = estado.pontos + ' pts';
        fb.textContent = 'Programa correto! +' + pts + ' pontos';
        fb.className = 'feedback ok';
        document.getElementById('btnProxima').classList.remove('hidden');
        document.getElementById('btnPular').classList.add('hidden');
        salvarProgresso().then(function() { renderRankingMini(); });
      } else {
        fb.textContent = 'Programa com erro. Ordene os blocos novamente. Dica: ' + (f.dica || '');
        fb.className = 'feedback err';
        log.textContent += '\nERRO: saida inesperada.';
        document.getElementById('btnExecutar').disabled = false;
      }
    }
  }
  step();
}

function proximaFase() {
  if (estado.fase < fasesCustomCache.length - 1) {
    estado.fase++;
    carregarFase();
  } else {
    clearInterval(estado.timer);
    document.getElementById('progressBar').style.width = '100%';
    var tempo = document.getElementById('tempo').textContent;
    document.getElementById('faseConteudo').innerHTML =
      '<div class="login-card" style="margin:40px auto">' +
      '<div class="login-icon">&#127942;</div>' +
      '<h2>Todas as fases concluidas!</h2>' +
      '<p><strong>' + estado.nome + '</strong> fez <strong>' + estado.pontos + '</strong> pontos em ' + tempo + '</p>' +
      '<button class="btn-entrar" style="margin-top:14px" onclick="location.reload()">Jogar de novo</button>' +
      '</div>';
  }
}

function pularFase() {
  if (!confirm('Pular esta fase sem pontos?')) return;
  if (estado.fase < fasesCustomCache.length - 1) {
    estado.fase++;
    carregarFase();
  } else {
    proximaFase();
  }
}

// ===== GAME: QUIZ =====
function carregarPerguntaQuiz() {
  if (quizPerguntasCache.length === 0) {
    document.getElementById('faseAguardando').classList.remove('hidden');
    document.getElementById('quizConteudo').classList.add('hidden');
    return;
  }
  if (estado.perguntaAtual >= quizPerguntasCache.length) {
    clearInterval(estado.timer);
    document.getElementById('quizConteudo').innerHTML =
      '<div class="login-card" style="margin:40px auto">' +
      '<div class="login-icon">&#127942;</div>' +
      '<h2>Quiz finalizado!</h2>' +
      '<p><strong>' + estado.nome + '</strong> fez <strong>' + estado.pontos + '</strong> pontos</p>' +
      '<button class="btn-entrar" style="margin-top:14px" onclick="location.reload()">Jogar de novo</button>' +
      '</div>';
    return;
  }
  var p = quizPerguntasCache[estado.perguntaAtual];
  var alternativas = Array.isArray(p.alternativas) ? p.alternativas : JSON.parse(p.alternativas);
  document.getElementById('quizPergunta').textContent = 'Pergunta ' + (estado.perguntaAtual + 1) + '/' + quizPerguntasCache.length + ': ' + p.pergunta;
  document.getElementById('faseLabel').textContent = 'Quiz ' + (estado.perguntaAtual + 1) + '/' + quizPerguntasCache.length;
  document.getElementById('progressBar').style.width = ((estado.perguntaAtual) / quizPerguntasCache.length * 100) + '%';
  document.getElementById('jogarPontos').textContent = estado.pontos + ' pts';

  var c = document.getElementById('quizAlternativas');
  c.innerHTML = '';
  alternativas.forEach(function(alt, idx) {
    var btn = document.createElement('button');
    btn.className = 'quiz-alt';
    btn.textContent = (idx + 1) + ') ' + alt;
    btn.onclick = function() { responderQuiz(idx, p.resposta_correta); };
    c.appendChild(btn);
  });

  document.getElementById('quizFeedback').textContent = '';
  document.getElementById('quizFeedback').className = 'feedback hidden';
  document.getElementById('btnQuizProxima').classList.add('hidden');
  document.getElementById('btnQuizPular').classList.remove('hidden');
  estado.respondeuQuiz = false;
  document.getElementById('quizConteudo').classList.remove('hidden');
}

function responderQuiz(idx, correta) {
  if (estado.respondeuQuiz) return;
  estado.respondeuQuiz = true;
  var btns = document.querySelectorAll('#quizAlternativas .quiz-alt');
  btns.forEach(function(b, i) {
    b.classList.add('disabled');
    if (i === correta) b.classList.add('correct');
    if (i === idx && i !== correta) b.classList.add('wrong');
  });
  var fb = document.getElementById('quizFeedback');
  fb.classList.remove('hidden');
  if (idx === correta) {
    var pts = 100;
    estado.pontos += pts;
    fb.textContent = 'Resposta correta! +' + pts + ' pontos';
    fb.className = 'feedback ok';
  } else {
    fb.textContent = 'Resposta incorreta!';
    fb.className = 'feedback err';
  }
  document.getElementById('jogarPontos').textContent = estado.pontos + ' pts';
  document.getElementById('btnQuizProxima').classList.remove('hidden');
  document.getElementById('btnQuizPular').classList.add('hidden');
  salvarProgresso().then(function() { renderRankingMini(); });
}

function proximaPergunta() {
  if (estado.perguntaAtual < quizPerguntasCache.length - 1) {
    estado.perguntaAtual++;
    carregarPerguntaQuiz();
  } else {
    clearInterval(estado.timer);
    document.getElementById('progressBar').style.width = '100%';
  }
}

function pularPergunta() {
  if (!confirm('Pular esta pergunta sem pontos?')) return;
  if (estado.perguntaAtual < quizPerguntasCache.length - 1) {
    estado.perguntaAtual++;
    carregarPerguntaQuiz();
  } else {
    proximaPergunta();
  }
}

// ===== JOGO: mudar modo =====
async function mudarJogo() {
  if (!estado.nome) return;
  var novoJogo = document.getElementById('jogoSelect').value;
  estado.jogo = novoJogo;
  await supabase.from('usuarios').update({ jogo: novoJogo }).eq('nome', estado.nome);
  await supabase.from('ranking').update({ jogo: novoJogo }).eq('nome', estado.nome);
  renderJogar();
}

function renderJogar() {
  var badge = document.getElementById('jogarModo');
  badge.textContent = estado.jogo === 'quiz' ? 'Quiz' : 'Algoritmos';
  document.getElementById('faseLabel').textContent = estado.jogo === 'quiz'
    ? 'Quiz 0/' + quizPerguntasCache.length
    : 'Fase ' + (estado.fase + 1) + '/' + fasesCustomCache.length;

  if (estado.jogo === 'quiz') {
    document.getElementById('faseConteudo').classList.add('hidden');
    document.getElementById('quizConteudo').classList.remove('hidden');
    carregarPerguntaQuiz();
  } else {
    document.getElementById('quizConteudo').classList.add('hidden');
    carregarFase();
  }
}

// ===== TIMER =====
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

// ===== RANKING (Supabase) =====
async function getRanking() {
  var resp = await supabase
    .from('ranking')
    .select('*')
    .order('pontos', { ascending: false })
    .limit(20);
  return resp.data || [];
}

var MEDALHAS = ['&#129351;','&#129352;','&#129353;'];

function montarRankRow(r, i, ehEu) {
  var medalha = i < 3 ? '<span class="rank-medal">' + MEDALHAS[i] + '</span>' : '<span class="rank-medal" style="opacity:0">' + (i+1) + 'o</span>';
  var classe = 'rank-row';
  if (ehEu) classe += ' me';
  if (i === 0) classe += ' rank-1';
  if (i === 1) classe += ' rank-2';
  if (i === 2) classe += ' rank-3';
  var avisosHtml = '';
  var avisos = r.avisos || 0;
  if (avisos > 0) {
    classe += ' rank-aviso';
    for (var a = 0; a < avisos; a++) {
      avisosHtml += '<span class="rank-x">x</span>';
    }
  }
  return '<div class="' + classe + '">' +
    medalha +
    '<span class="rank-nome">' + r.nome + avisosHtml + '</span>' +
    '<span class="rank-pontos">' + r.pontos + '</span></div>';
}

async function renderRankingMini() {
  var c = document.getElementById('rankingMini');
  if (!c) return;
  var arr = (await getRanking()).slice(0, 5);
  if (arr.length === 0) {
    c.innerHTML = '<p style="color:#a0aec0;font-size:12px">Seja o primeiro!</p>';
    return;
  }
  c.innerHTML = arr.map(function(r, i) {
    return montarRankRow(r, i, r.nome === estado.nome);
  }).join('');
}

async function limparRanking() {
  if (confirm('Zerar ranking de todos?')) {
    await supabase.from('ranking').delete().neq('id', 0);
    renderRankingSala();
    renderRankingMini();
  }
}

// ===== ONLINE (Supabase) =====
async function registrarOnline() {
  if (!estado.nome) return;
  await supabase.from('online').upsert({
    nome: estado.nome,
    last_seen: new Date().toISOString()
  }, { onConflict: 'nome' });
}

async function removerOnline() {
  if (!estado.nome) return;
  await supabase.from('online').delete().eq('nome', estado.nome);
}

async function pingOnline() {
  if (!estado.nome) return;
  await supabase.from('online').update({
    last_seen: new Date().toISOString()
  }).eq('nome', estado.nome);
}

async function getOnline() {
  var resp = await supabase.from('online').select('nome,last_seen').order('last_seen', { ascending: false });
  return resp.data || [];
}

async function renderJogadores() {
  var c = document.getElementById('listaJogadores');
  if (!c) return;
  var lista = await getOnline();
  var agora = Date.now();
  var ativos = lista.filter(function(j) {
    var diff = agora - new Date(j.last_seen).getTime();
    return diff < 60000;
  });
  if (ativos.length === 0) {
    c.innerHTML = '<span class="hint">Nenhum jogador conectado</span>';
    return;
  }
  c.innerHTML = ativos.map(function(j) {
    return '<span class="jogador-chip online-dot">' + j.nome + '</span>';
  }).join('');
}

setInterval(function() {
  if (estado.nome) pingOnline();
}, 30000);

window.addEventListener('beforeunload', function() {
  removerOnline();
});

// ===== DETECCAO DE SAIDA DE TELA =====
document.addEventListener('visibilitychange', function() {
  if (!estado.nome) return;
  if (document.hidden) {
    marcarSaida();
  }
});

window.addEventListener('blur', function() {
  if (!estado.nome) return;
  marcarSaida();
});

async function marcarSaida() {
  if (!estado.nome) return;
  var resp = await supabase.from('ranking').select('avisos,pontos').eq('nome', estado.nome).single();
  if (!resp.data) return;
  var avisos = (resp.data.avisos || 0) + 1;
  var penalidade = avisos * 5;
  var novosPontos = Math.max(0, resp.data.pontos - penalidade);
  await supabase.from('ranking').update({ avisos: avisos, pontos: novosPontos }).eq('nome', estado.nome);
  await supabase.from('usuarios').update({ pontos: novosPontos }).eq('nome', estado.nome);
  estado.pontos = novosPontos;
  document.getElementById('jogarPontos').textContent = novosPontos + ' pts';
}

// ===== PROFESSOR: CADASTRO DE ALUNOS =====
async function cadastrarAluno() {
  var nome = document.getElementById('novoAlunoNome').value.trim();
  var senha = document.getElementById('novoAlunoSenha').value.trim();
  var msg = document.getElementById('cadastroMsg');
  if (nome.length < 2) { mostrarErro(msg, 'Nome precisa ter pelo menos 2 letras'); return; }
  if (!senha) { mostrarErro(msg, 'Digite uma senha'); return; }

  var dados = { nome: nome, senha: senha };
  if (estadoSalaAtual) dados.sala_id = estadoSalaAtual.id;

  var resp = await supabase.from('usuarios').insert(dados);
  if (resp.error) {
    mostrarErro(msg, 'Erro: ' + resp.error.message);
    return;
  }
  mostrarErro(msg, '');
  msg.className = '';
  msg.style.color = 'var(--green)';
  msg.textContent = 'Aluno "' + nome + '" cadastrado!';
  document.getElementById('novoAlunoNome').value = '';
  renderListaAlunos();
  if (estadoSalaAtual) renderAlunosSala();
  setTimeout(function() { msg.textContent = ''; }, 3000);
}

async function renderListaAlunos() {
  var c = document.getElementById('listaAlunos');
  if (!c) return;
  var query = supabase.from('usuarios').select('*');
  if (estadoSalaAtual) query = query.eq('sala_id', estadoSalaAtual.id);
  var resp = await query.order('nome');
  var lista = resp.data || [];
  if (lista.length === 0) {
    c.innerHTML = '<p class="hint">Nenhum aluno cadastrado</p>';
    return;
  }
  c.innerHTML = lista.map(function(a) {
    return '<div class="aluno-row">' +
      '<span class="aluno-nome">' + a.nome + '</span>' +
      '<span class="aluno-senha">' + a.senha + '</span>' +
      '<span class="aluno-pontos">' + (a.pontos || 0) + ' pts</span>' +
      '<div class="aluno-btns">' +
      '<button class="aluno-btn aluno-btn-reset" onclick="resetarSenha(\'' + a.nome + '\')">Resetar senha</button>' +
      '<button class="aluno-btn aluno-btn-del" onclick="deletarAluno(\'' + a.nome + '\')">X</button>' +
      '</div></div>';
  }).join('');
}

async function resetarSenha(nome) {
  var novaSenha = prompt('Nova senha para "' + nome + '":');
  if (!novaSenha) return;
  await supabase.from('usuarios').update({ senha: novaSenha }).eq('nome', nome);
  renderListaAlunos();
}

async function deletarAluno(nome) {
  if (!confirm('Deletar aluno "' + nome + '"?')) return;
  await supabase.from('usuarios').delete().eq('nome', nome);
  renderListaAlunos();
  if (estadoSalaAtual) renderAlunosSala();
}

// ===== PROFESSOR: FASES CUSTOMIZADAS =====
async function salvarFaseCustom() {
  var titulo = document.getElementById('faseTitulo').value.trim();
  var objetivo = document.getElementById('faseObjetivo').value.trim();
  var exemplo = document.getElementById('faseExemplo').value.trim();
  var dica = document.getElementById('faseDica').value.trim();
  var blocosRaw = document.getElementById('faseBlocos').value.trim();
  var solucaoRaw = document.getElementById('faseSolucao').value.trim();
  if (!titulo || !blocosRaw || !solucaoRaw) {
    alert('Preencha titulo, blocos e solucao');
    return;
  }
  var blocos = blocosRaw.split('\n').map(function(s) { return s.trim(); }).filter(Boolean);
  var solucao = solucaoRaw.split('\n').map(function(s) { return s.trim(); }).filter(Boolean);
  var maxOrdem = fasesCustomCache.length;
  await supabase.from('fases_custom').insert({
    titulo: titulo,
    objetivo: objetivo,
    exemplo: exemplo,
    blocos: blocos,
    solucao: solucao,
    dica: dica,
    ordem: maxOrdem
  });
  document.getElementById('faseTitulo').value = '';
  document.getElementById('faseObjetivo').value = '';
  document.getElementById('faseExemplo').value = '';
  document.getElementById('faseDica').value = '';
  document.getElementById('faseBlocos').value = '';
  document.getElementById('faseSolucao').value = '';
  await carregarFases();
  renderListaFasesCustom();
}

async function renderListaFasesCustom() {
  var c = document.getElementById('listaFasesCustom');
  if (!c) return;
  await carregarFases();
  if (fasesCustomCache.length === 0) {
    c.innerHTML = '<p class="hint">Nenhuma fase customizada</p>';
    return;
  }
  c.innerHTML = fasesCustomCache.map(function(f) {
    return '<div class="fase-row">' +
      '<span class="fase-row-titulo">' + f.titulo + '</span>' +
      '<button class="fase-row-btn" onclick="deletarFaseCustom(' + f.id + ')">X</button>' +
      '</div>';
  }).join('');
}

async function deletarFaseCustom(id) {
  if (!confirm('Deletar esta fase?')) return;
  await supabase.from('fases_custom').delete().eq('id', id);
  await carregarFases();
  renderListaFasesCustom();
}

// ===== PROFESSOR: QUIZ =====
async function salvarPerguntaQuiz() {
  var pergunta = document.getElementById('quizPerguntaInput').value.trim();
  var alternativasRaw = document.getElementById('quizAlternativasInput').value.trim();
  var resposta = parseInt(document.getElementById('quizRespostaInput').value) - 1;
  if (!pergunta || !alternativasRaw) {
    alert('Preencha a pergunta e as alternativas');
    return;
  }
  var alternativas = alternativasRaw.split('\n').map(function(s) { return s.trim(); }).filter(Boolean);
  if (resposta < 0 || resposta >= alternativas.length) {
    alert('Resposta correta invalida. Use o numero da alternativa (1, 2, 3...)');
    return;
  }
  var maxOrdem = quizPerguntasCache.length;
  await supabase.from('quiz_perguntas').insert({
    pergunta: pergunta,
    alternativas: alternativas,
    resposta_correta: resposta,
    ordem: maxOrdem
  });
  document.getElementById('quizPerguntaInput').value = '';
  document.getElementById('quizAlternativasInput').value = '';
  document.getElementById('quizRespostaInput').value = '1';
  await carregarQuizPerguntas();
  renderListaQuizPerguntas();
}

async function renderListaQuizPerguntas() {
  var c = document.getElementById('listaQuizPerguntas');
  if (!c) return;
  await carregarQuizPerguntas();
  if (quizPerguntasCache.length === 0) {
    c.innerHTML = '<p class="hint">Nenhuma pergunta criada</p>';
    return;
  }
  c.innerHTML = quizPerguntasCache.map(function(p) {
    var alts = Array.isArray(p.alternativas) ? p.alternativas : JSON.parse(p.alternativas);
    var altHtml = alts.map(function(a, i) {
      var cls = i === p.resposta_correta ? 'quiz-row-alt correta' : 'quiz-row-alt';
      return '<div class="' + cls + '">' + (i + 1) + ') ' + a + '</div>';
    }).join('');
    return '<div class="quiz-row">' +
      '<div class="quiz-row-pergunta">' + p.pergunta + '</div>' +
      altHtml +
      '<div class="quiz-row-btns">' +
      '<button class="fase-row-btn" onclick="deletarPerguntaQuiz(' + p.id + ')">X</button>' +
      '</div></div>';
  }).join('');
}

async function deletarPerguntaQuiz(id) {
  if (!confirm('Deletar esta pergunta?')) return;
  await supabase.from('quiz_perguntas').delete().eq('id', id);
  await carregarQuizPerguntas();
  renderListaQuizPerguntas();
}

// ===== REALTIME =====
supabase
  .channel('all-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'ranking' }, function() {
    renderRankingMini();
    renderRankingSala();
  })
  .on('postgres_changes', { event: '*', schema: 'public', table: 'fases_liberadas' }, function() {
    checarFaseLiberada();
  })
  .on('postgres_changes', { event: '*', schema: 'public', table: 'online' }, function() {
    renderJogadores();
  })
  .subscribe();

setInterval(function() {
  if (estado.nome) {
    checarFaseLiberada();
  }
}, 2000);

// ===== INIT =====
window.addEventListener('load', function() {
  var h = location.hash.replace('#', '');
  if (h === 'jogar' || h === 'professor' || h === 'login') router(h);
  else router('home');
});
