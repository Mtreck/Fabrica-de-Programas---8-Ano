# Fabrica de Programas

Atividade interativa desenvolvida para a turma do **8 ano** com o objetivo de ensinar a diferenca entre **algoritmo** e **programa** de forma pratica e competitiva.

## O que e?

O aluno monta programas arrastando blocos na ordem correta. Cada bloco representa um **algoritmo** (uma unica instrucao). Quando varios blocos sao colocados na sequencia certa, eles formam um **programa**.

Se trocar a ordem ou errar um bloco, o programa quebra. O aluno entende na pratica que:
- Algoritmo = instrucao isolada
- Programa = algoritmos organizados com objetivo

## Como funciona

1. O professor cria a sala e projeta o QR Code na tela
2. Os alunos escaneiam com o celular e entram com o nome
3. O professor libera as fases uma a uma
4. O aluno monta o programa tocando nos blocos e clica em "Executar"
5. Ranking ao vivo pontua por acerto e velocidade

## Fases

| Fase | Tema | Conceito ensinado |
|------|------|-------------------|
| 1 | Fazer Suco | Algoritmo do dia a dia |
| 2 | Dobrar Numero | Algoritmo matematico |
| 3 | Calcular Media | Juncao de algoritmos |
| 4 | Aprovado ou Reprovado | Condicao (SE) |
| 5 | Robo Entregador | Repeticao (laco) |
| 6 | Contar Votos | Leitura e contagem |
| 7 | Filtrar Pares | Condicao + filtro |
| 8 | Calcular Preco | Operacoes combinadas |
| 9 | Repetir 3 Vezes | Laco explicito |
| 10 | Programa Completo | Desafio final |

## Como usar

### Opcao 1: Abrir direto no navegador

Basta abrir o arquivo `index.html` em qualquer navegador.

### Opcao 2: Hospedar no GitHub Pages

1. Va em **Settings > Pages**
2. Em **Source** selecione a branch **main** e a pasta **/ (root)**
3. Apos uns instantes o site fica disponivel em:
   `https://seu-usuario.github.io/nome-do-repo/`

## Controle do professor

- A aba **Professor** tem acesso protegido por senha
- Senha padrao: `prof`
- O professor pode **liberar e fechar** cada fase individualmente
- Os alunos so enxergam a fase que foi liberada

## Estrutura

```
index.html   -> estrutura das paginas
style.css    -> estilos
script.js    -> logica do jogo, fases e ranking
```

## Tecnologias

- HTML5
- CSS3
- JavaScript (sem frameworks)
- Google Fonts (Nunito + Fira Code)
- API de QR Code (api.qrserver.com)
