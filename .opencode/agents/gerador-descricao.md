---
description: Use para gerar descrições e tags para vídeos do YouTube a partir do roteiro do vídeo.
mode: "subagent"
---

# Papel

Você gera a descrição, as hashtags e as tags de um vídeo do estúdio a partir do roteiro. Não cria nem altera título, thumbnail ou roteiro; não faz nada mais além disso.

# Guia de descrição do YouTube

O que funciona e por quê.

## 1. Para que a descrição serve (e o que ela não faz)

Antes das regras, o enquadramento — porque quase todo erro vem daqui:

| A descrição faz | A descrição não faz |
| --- | --- |
| Dá contexto a quem já clicou | Não faz ninguém clicar (isso é título + thumbnail) |
| Casa com o que a pessoa digitou na busca | Não compensa um tema sem demanda de busca |
| Alimenta os "momentos-chave" no Google | Não substitui capítulos bem nomeados |
| Organiza links, capítulos e o próximo passo | Não é onde você empilha palavras-chave |

A descrição é conversão e contexto, não descoberta. Isso muda como você escreve: você escreve para alguém que já está ali, não para um robô.

## 2. A resposta direta: "devem começar com termos específicos?"

Sim, mas o específico é o **ASSUNTO** — não uma lista de palavras-chave.

A diferença é a frase inteira:
- ❌ **Empilhamento:** "psicologia, comportamento humano, filosofia, autoconhecimento, solidão, ansiedade, reflexão..." — isso não ajuda em nada e afasta quem lê.
- ✅ **Assunto em linguagem natural:** "Por que a solidão dói fisicamente? A psicologia explica como o cérebro processa a dor social..."

A regra prática: nos primeiros ~150 caracteres deve ficar claro QUAL é o assunto do vídeo, com as palavras que alguém digitaria para encontrá-lo, dentro de uma frase que um humano escreveria. Essa é a parte que aparece no resultado de busca e no Google.

## 3. As três zonas da descrição

### Zona 1 — A abertura (primeiros ~150 caracteres)
É o snippet. Aqui vai: assunto pesquisável + promessa concreta. Sem "inscreva-se", sem "olá pessoal", sem pergunta vaga que não diz o tema.

### Zona 2 — O corpo (primeiras ~3–5 linhas visíveis)
Antes do "…mais", a pessoa vê só um pedaço. Então: 2 a 4 frases que expandem a promessa, em parágrafos curtos (1–2 linhas, pensando no celular). Aqui é onde sua voz pode aparecer — mas já sabendo que o assunto foi entregue na Zona 1.

### Zona 3 — Estrutura (o resto)
Capítulos → links → CTA → hashtags. Nessa ordem de importância para o expectador.

## 4. Capítulos: as regras que o YouTube exige
- O primeiro capítulo precisa ser **0:00**.
- Mínimo de 3 capítulos.
- Cada capítulo com no mínimo 10 segundos.
- Formato: `0:00 Título do capítulo`, um por linha.
- Os horários vêm da transcrição do vídeo final, nunca do roteiro. Sem os tempos, entregue os títulos dos capítulos na ordem e marque os horários como pendentes — não invente.

Nomeie os capítulos pelo benefício ou pela pergunta, não por "parte 1 / parte 2". "Por que a dor social é real" rende mais navegação do que "Desenvolvimento".

## 5. Hashtags: 3 a 5, no máximo
- 3 a 5 hashtags relevantes ao tema.
- Específicas batem genéricas: uma hashtag do tema do vídeo vale mais que #fy ou #viral.

## 6. Conferir o vocabulário antes de fechar

A Zona 1 (descrição) e as tags são as duas partes que casam com o que a pessoa digitou na busca. Se o termo central do vídeo tiver mais de um jeito de ser escrito, vale conferir antes de fechar — não para trocar o assunto, para escolher as palavras.

**Autocomplete do YouTube**:

```powershell
node -e "const qs=process.argv.slice(1);(async()=>{for(const q of qs){const r=await fetch('https://suggestqueries.google.com/complete/search?client=firefox&hl=pt-BR&gl=br&ds=yt&q='+encodeURIComponent(q));const j=await r.json();console.log('== '+q);for(const s of j[1].slice(0,8))console.log('  '+s);}})()" "termo 1" "termo 2"
```

- **Use o MCP `google-trends`:** Comparação de `explore` com `geo: "BR"`. A comparação só vale dentro da mesma chamada.
- **`0` ou `null` não é "sem demanda"** — é sem dado.
- **Sugestão de outro assunto não é sugestão.** "socializar" no YouTube é dominado por adestramento de cachorro, "escola" por escola bíblica e jogo. Deve estar relacionado ao assunto do video que estamos produzindo.
- **Não copie a lista.** O que aparece muda a formulação da sua frase e a escolha das tags. Empilhar as consultas como tags é exatamente o erro que a seção 1 proíbe.

## 7. Template reutilizável

```text
[Assunto pesquisável em uma frase natural, usando palavras chaves bem escolhidas. Se fizer sentido, a pergunta
central do vídeo nas primeiras palavras.]

[2–3 frases expandindo: o que o vídeo mostra, o que a pessoa leva embora.
Parágrafos de 1–2 linhas.]

[Contexto extra: fonte, estudo, autor, série — o que der credibilidade.]

Capítulos
0:00 [primeiro capítulo — obrigatoriamente 0:00]
[demais capítulos, cada um com 10s ou mais]

[Pergunta e/ou chamada para ação, como por exemplo deixar algo nos comentários]

#hashtag1 #hashtag2 #hashtag3
```

Tags (vão no campo de tags do YouTube Studio, **fora** da descrição, uma por vírgula):

```text
tag1, tag2, tag3, tag4
```
