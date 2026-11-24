---
name: pacote-de-producao
description: Gera o pacote de produção de um vídeo do YouTube chamando os subagentes gerador-titulo (títulos + thumbnail) e gerador-descricao (descrição + tags) a partir do roteiro completo, e junta os dois resultados em youtube.md na pasta de entrega do vídeo.
---

# Pacote de Produção

Gera o pacote de produção de um vídeo em três arquivos, na pasta de entrega do vídeo:

- `titulos.md` — escrito pelo subagente `gerador-titulo`
- `descricao.md` — escrito pelo subagente `gerador-descricao`
- `youtube.md` — você cria ao final, juntando os dois acima

## Entrada

Você precisa de duas coisas antes de começar:

1. o **roteiro completo** do vídeo;
2. a **pasta de entrega do vídeo** (o caminho onde os arquivos devem ser salvos). O nome dessa pasta é o nome do vídeo.

Se você já tem o vídeo renderizado, a **transcrição por palavra** (`kit-video/work/transcricoes/<slug>/`) é um terceiro insumo opcional: é dela que saem os horários dos capítulos. Sem ela, os capítulos vão sem horário e o usuário completa depois.

Se faltar alguma das duas primeiras, peça ao usuário. Se a pasta não existir, pare e pergunte o caminho certo antes de disparar. Passe o roteiro inteiro para os agentes, sem resumir nem reescrever.

## 1. Disparar os dois subagentes em paralelo

Faça as duas chamadas no mesmo passo, com o tool `subagent`:

| `agent` | `description` | resultado esperado |
| --- | --- | --- |
| `gerador-titulo` | Títulos e thumbnail | `titulos.md` |
| `gerador-descricao` | Descrição e tags | `descricao.md` |

Prompt do `gerador-titulo`:

```text
Roteiro completo do vídeo:
<caminho arquivo do roteiro, ou o roteiro colado na íntegra>

Pasta de entrega: <caminho da pasta>

Transcrição por palavra (só o `gerador-descricao` usa, e só se existir): <caminho da transcrição>

Tarefa: gere somente o arquivo `titulos.md` nessa pasta, com opções de título e o conceito de thumbnail conforme seu guia. Não crie nem altere nenhum outro arquivo. Ao terminar, responda apenas com o caminho do arquivo criado.
```

Prompt do `gerador-descricao`: igual, trocando a tarefa por:

```text
Tarefa: gere somente o arquivo `descricao.md` nessa pasta, conforme seu guia. Use o roteiro para o assunto da descrição e das hashtags. Horários de capítulo não saem do roteiro: se você recebeu a transcrição do vídeo final, use os tempos dela; sem a transcrição, entregue os títulos dos capítulos na ordem, com os horários marcados como pendentes — nunca invente e nunca omita os capítulos. Links também só entram se vierem no material recebido. Não crie nem altere nenhum outro arquivo. Ao terminar, responda apenas com o caminho do arquivo criado.
```

## 2. Conferir as entregas

Quando os dois voltarem, confirme que `titulos.md` e `descricao.md` existem na pasta e não estão vazios.

- Arquivo ausente ou vazio → chame o mesmo agente de novo, uma vez, com o mesmo prompt.
- Falhou de novo → pare e mostre o erro ao usuário. Não escreva o conteúdo no lugar dele.

## 3. Juntar em `youtube.md`

Quando os dois estiverem entregues, crie `youtube.md` na mesma pasta:

```markdown
# Pacote de produção — <nome do vídeo>

## Títulos e thumbnail

<conteúdo de titulos.md>

## Descrição

<conteúdo de descricao.md>
```

Regras da junção:

- Copie o conteúdo dos dois arquivos **como veio**, sem editar, resumir ou reordenar.
- Se algum começar com um título `# ...`, remova essa linha para não repetir cabeçalho.

## Regras

- Não gere conteúdo próprio: título, thumbnail, descrição e tags vêm dos agentes.
- Não edite os arquivos que os agentes entregaram.
- No fim, informe os três arquivos criados e o caminho da pasta.
