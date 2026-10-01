---
name: achado-cofre
description: Cria uma página robusta no Cofre (heliofilho.dev) sobre um achado externo (repo, ferramenta, projeto de outra pessoa) a partir de um link - pesquisa de verdade, texto no tom do Hélio, imagens reais da fonte, depois publica via publicar-admin.
---

# Criar página de achado no Cofre

Usuário manda um link (repo do GitHub, produto, ferramenta) que ele cobriu num vídeo/post e quer uma página própria no Cofre pra captar quem comentou pedindo o link - em vez de mandar o link cru. Esse skill cobre a parte que `publicar-admin` não cobre: pesquisar de verdade, escrever no tom certo e achar imagens reais. No fim, usa `publicar-admin` pra mecânica de publicar.

## Por que essa página existe (não esquecer)

O objetivo é reter atenção e gerar interesse real, não só reformatar o README. Uma página rasa (resumo de 3 frases + lista de specs copiada) não vale o clique perdido. Cada página precisa deixar quem leu mais interessado no Hélio e no site, não só informado sobre o projeto de outra pessoa.

## Passo 1: pesquisar de verdade, com fonte primária

Nunca escreva a partir de memória/treino sobre o projeto. Sempre:

1. `WebFetch` a própria página do repositório (pega stats atualizados: estrelas, forks, linguagem, idade do repo via `created_at`).
2. Baixe o README cru (`raw.githubusercontent.com/.../main/README.md` ou `WebFetch` na página do README) - é a fonte mais completa e confiável, normalmente bem mais detalhada que o que aparece na página inicial do repo.
3. Procure imagens reais no próprio README: `grep "!\["` acha toda imagem referenciada - quase sempre tem foto de hardware, diagrama de arquitetura, screenshot de GUI. **Use essas, nunca invente ou gere uma descrição de imagem que não existe.** Se uma imagem tiver nota do próprio autor marcando ela como desatualizada/deprecated, inclua mesmo assim mas com a ressalva (isso dá credibilidade, mostra que você leu direito).
4. Procure vídeo: demo no YouTube linkado no README, GIF de demonstração, link de "watch it in action". Se não achar nenhum, não invente - só não tem.
5. Prefira a `api.github.com/repos/<owner>/<repo>` pra número de estrelas/forks exato (mais confiável que o que uma ferramenta de busca resume). Ignore o campo `language` se parecer errado (GitHub erra a detecção em repo com muito arquivo gerado/binário - hardware costuma vir como algo nonsense tipo PLSQL).
6. Anote: nome completo do projeto, autor, empresa/afiliação se tiver, data de criação, licença(s), por que a arquitetura é desenhada do jeito que é (não só "o que tem", mas "por quê"), qualquer história por trás (ex.: por que mudou de licença, de onde veio o projeto) - é esse tipo de detalhe que torna a página mais interessante que o README puro.

Números como estrela/fork mudam rápido: deixe isso explícito no texto ("no momento em que este texto foi escrito") em vez de escrever como se fosse estático.

## Passo 2: escrever no tom certo

Regras não-negociáveis (ver [[feedback-copy-style]]):

- **Nunca usar travessão (—)**. Nem no título, nem no resumo, nem no corpo. Trocar por vírgula, dois-pontos, ponto ou reformular a frase. **Cheque também o campo Título e o campo Resumo depois de preencher** - são os campos mais fáceis de esquecer (já aconteceu: corpo todo limpo, título com travessão escondido).
- **Voz ativa.** "A FPGA processa o sinal", não "o sinal é processado pela FPGA".
- **Sem transição robótica de IA**: nada de "Além disso", "É importante notar", "Vale ressaltar", "Em resumo", "Não menos importante". Uma frase simples conecta melhor.
- **Técnico sem ser redundante**: cada seção acrescenta informação nova. Não repetir a mesma especificação em dois parágrafos diferentes só pra encher.
- Confirme no fim: `grep "—"` no arquivo antes de publicar. Zero ocorrências.

## Passo 3: estrutura da página

1. Link do repositório logo no topo (parágrafo de abertura), pra quem só quer isso.
2. Imagem real (hardware/produto) logo em seguida, se existir.
3. "O que é": nome completo, o que faz, pra quem é, por quem foi feito.
4. Corpo técnico de verdade: arquitetura, componentes, como o dado/sinal percorre o sistema, decisões de design e o porquê delas. Isso é o que agrega valor real sobre só ler o README - organizar e explicar, não só listar.
5. Imagens técnicas (diagrama, GUI, etc.) nos pontos do texto onde fazem sentido, não todas empilhadas numa galeria.
6. Licenciamento, contribuição, créditos ao autor.
7. Se tiver uma citação/história genuína do autor (tipo um "post de agradecimento" ou retrospectiva), usar como bloco de citação - humaniza a página.
8. Link do repositório de novo, no fechamento.

## Passo 4: publicar

Siga o skill `publicar-admin` pra mecânica (login, seletores, fillSafe, toggle Publicado). Specificamente pra achado externo:

- Categoria: **Repos** (não Vídeos, a menos que o achado seja especificamente um vídeo).
- Tema: curto, formato "Área/Subárea" (ex.: "Hardware/RF", "IA/Local") - olhar os temas já usados nos outros itens do Cofre (`WebFetch` em `/cofre`) pra manter o padrão.
- Palavra-chave da DM: a palavra que o usuário pediu pra comentarem no vídeo, em maiúsculo.
- Slug: curto, sem acento, fácil de falar.
- Antes do `Salvar` final, rode uma checagem de travessão no texto que vai pro campo (ver Passo 2) e confirme visualmente no screenshot que as imagens carregaram (não ficaram como link quebrado).

## Depois de publicar

Relate ao usuário: link publicado, quais imagens reais foram usadas (e de onde vieram), e se faltou algo que só ele resolve (vídeo próprio, imagem de capa, etc.) - nunca dar a entender que algo está completo se não está.
