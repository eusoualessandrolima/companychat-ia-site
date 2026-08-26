# Base de conhecimento da Jade: campanha "10 Empresas, 10 Assistentes de IA"

Rascunho para a base da Jade, o agente que atende o WhatsApp oficial da
CompanyChat. **Ainda não foi aplicado** — este documento aguarda aprovação.

Quando for aprovado, aplicar com as ferramentas MCP `fazer-ai` (tenant
`companychat-ia`), pelo procedimento de `CLAUDE.md`:

1. `knowledge_document_create` com o título e o corpo da seção "Documento".
2. Conferir com `knowledge_documents_list` que ele volta ao estado `READY`.
3. Quando a seleção encerrar, substituir o documento pela versão de encerramento
   (seção "Depois que a campanha acabar") — base desatualizada é pior que base
   ausente: a Jade continuaria oferecendo vaga que não existe mais.

> A página `/10-empresas` vai ao ar com `noindex` e fora do sitemap, então a Jade
> é o principal canal de dúvida de quem recebeu o anúncio. Se ela e a página
> disserem coisas diferentes sobre o que é gratuito, o problema aparece na
> conversa de vendas.
>
> **Aplicar este documento só depois do deploy da página.** Antes disso a Jade
> estaria convidando para um endereço que ainda responde 404.

Fonte da verdade da copy: `src/components/dez-empresas/conteudo.ts`.

---

## Documento

**Título:** `Campanha 10 Empresas, 10 Assistentes de IA`

**Corpo:**

### O que é a campanha

A CompanyChat vai selecionar **10 empresas** para receber a implantação inicial
gratuita de um Assistente de IA personalizado no WhatsApp. A candidatura é feita
pelo formulário da página `companychatia.com.br/10-empresas` e é **gratuita**.

**Objetivo da CompanyChat:** acompanhar empresas reais usando a plataforma em
segmentos diferentes. As selecionadas recebem uma implantação personalizada;
nosso time acompanha a operação para identificar melhorias, validar novos fluxos
e gerar aprendizados para a evolução da plataforma. É uma troca declarada, não
um brinde.

### Prazos

- **Inscrições:** a campanha fica aberta por **30 dias após a publicação** ou
  até que as 10 empresas sejam selecionadas — o que acontecer primeiro.
- **"Período inicial":** os **primeiros 30 dias após a ativação da operação** da
  empresa selecionada. É a esse período que se referem "implantação inicial" e
  "continuidade depois do período inicial".

A Jade pode afirmar os dois prazos acima. Qualquer outro prazo — data exata de
encerramento, tempo de análise, dia da resposta — **não existe** e não deve ser
inventado.

### Critérios de seleção

A seleção **não é automática**. As candidaturas são analisadas por:

- perfil da empresa e aderência ao projeto;
- demanda real de atendimento pelo WhatsApp;
- disponibilidade para participar e dar retorno durante o projeto.

Perfil que a campanha procura: empresas que recebem clientes ou leads pelo
WhatsApp, perdem oportunidades por demora, precisam organizar as conversas,
querem automatizar tarefas repetitivas e têm interesse real em usar IA.

Perfil que **não** se encaixa: quem procura apenas um número de WhatsApp gratuito
ou não tem operação real para testar.

### O que está incluído gratuitamente

Cada empresa selecionada recebe gratuitamente a implantação de **um fluxo
principal de automação**. O fluxo principal pode ser:

**atendimento · qualificação · vendas · agendamento · follow-up · suporte**

— um deles, escolhido conforme o caso da empresa. A implantação inclui:

- diagnóstico do atendimento atual;
- mapeamento das principais conversas;
- configuração do Assistente de IA;
- personalização para o segmento da empresa;
- o fluxo principal escolhido;
- integração com o WhatsApp, conforme a viabilidade técnica de cada empresa;
- organização dos contatos no CRM;
- acompanhamento inicial da operação.

> É **um** fluxo principal, não todos os seis. Se o candidato quiser mais de um,
> a Jade explica que os demais são avaliados separadamente — e não promete.

### O que não está incluído

- **Automações, integrações ou fluxos adicionais** além do fluxo principal. São
  avaliados separadamente, com escopo e valor apresentados **antes** de qualquer
  execução.
- Integrações ou funcionalidades que a plataforma ainda não oferece. A Jade não
  promete o que não existe: se o candidato pedir algo assim, a resposta é que
  será avaliado pelo time e respondido depois.
- Uso gratuito por tempo indeterminado. **Nunca dizer "gratuito para sempre".**

### O que acontece depois do período inicial

O período inicial são os **30 primeiros dias após a ativação da operação**.

A participação **não cria contratação automática**. A continuidade depois desse
período é **opcional**: se a empresa quiser seguir usando a plataforma, as
condições e os valores são apresentados previamente, e a decisão é dela. Se não
quiser, não há cobrança nem renovação automática.

### Resposta a quem não for selecionado

**Todas as empresas candidatas recebem retorno.** As não selecionadas são
respondidas por WhatsApp ou e-mail depois do encerramento da seleção — de forma
respeitosa, sem promessa vaga de "próxima oportunidade" que não exista.

Quando alguém perguntar, a Jade pode confirmar que haverá resposta para todos
após o encerramento, **sem prometer data**.

### Respostas do FAQ

O FAQ em acordeão saiu da página em 2026-08-26. As mesmas condições continuam
lá, resumidas no bloco "Condições da seleção", logo abaixo do formulário. As
respostas abaixo são a versão longa, para a Jade usar na conversa: elas não
podem contradizer aquele bloco, que é o que o candidato leu antes de preencher.

**A candidatura é gratuita?**
Sim. Não existe cobrança para enviar a candidatura, e candidatar-se não gera
nenhum compromisso.

**Todas as empresas serão selecionadas?**
Não. Serão selecionadas apenas 10 empresas. A seleção não é automática:
analisamos o perfil, a demanda de atendimento e a disponibilidade da empresa para
participar do projeto.

**O que exatamente é gratuito?**
A implantação de um fluxo principal de automação — atendimento, qualificação,
vendas, agendamento, follow-up ou suporte, conforme o caso da empresa. Junto vêm
o diagnóstico do atendimento, a configuração do assistente, a personalização para
o segmento, a integração disponível, a organização dos contatos no CRM e o
acompanhamento inicial da operação.

**E o que fica fora desse escopo?**
Automações, integrações ou fluxos adicionais além do fluxo principal são
avaliados separadamente, com escopo e valor apresentados antes de qualquer
execução. Nada é cobrado por surpresa.

**Até quando dá para se candidatar?**
A campanha fica aberta por 30 dias após a publicação ou até que as 10 empresas
sejam selecionadas, o que acontecer primeiro.

**A empresa terá que contratar depois?**
Não. A participação não cria contratação automática. O período inicial são os 30
primeiros dias após a ativação da operação; depois disso, continuar é opcional, e
as condições e os valores são apresentados previamente para a empresa decidir.

**A IA funciona no WhatsApp da empresa?**
Sim. A configuração é planejada de acordo com a operação e com a viabilidade
técnica de cada empresa selecionada, usando as integrações já disponíveis na
plataforma.

**E se minha empresa não for selecionada?**
Todas as candidaturas recebem retorno. Quem não for selecionado é avisado pelo
WhatsApp ou pelo e-mail informados no formulário, depois do encerramento da
seleção.

### Como a Jade deve responder aos candidatos

**Quem pergunta como participar:** mandar o link
`companychatia.com.br/10-empresas` e explicar que a candidatura leva menos de dois
minutos. A Jade **não coleta a candidatura pela conversa** — o formulário é o
canal, porque é ele que registra a origem e alimenta a análise.

**Quem já se candidatou e quer saber o resultado:** confirmar que a candidatura
foi registrada e que **toda candidatura recebe retorno** pelos dados do
formulário, selecionada ou não, depois do encerramento da seleção. **Não prometer
prazo de resposta nem dizer que a empresa foi ou será selecionada** — a Jade não
tem acesso à decisão.

**Quem pergunta se vai pagar alguma coisa:** a candidatura é gratuita, e a
implantação de um fluxo principal para as selecionadas também. O que ficar fora
desse fluxo é orçado à parte, com valor apresentado antes.

**Quem quer contratar agora, sem esperar a seleção:** não segurar a pessoa. Tratar
como lead comercial normal e seguir o roteiro de planos — a campanha não é o único
caminho para começar.

**Quem pede recurso que a plataforma não tem:** não improvisar. Registrar o pedido
e dizer que o time avalia a viabilidade e retorna.

### O que a Jade nunca deve dizer

- "Gratuito para sempre", "de graça pra sempre" ou equivalente.
- "Sua empresa vai ser selecionada" / "já está garantida".
- Prazo de resposta que não foi definido ("respondemos em 48 horas").
- Qualquer integração ou recurso que a plataforma ainda não ofereça.
- Que a seleção é automática ou por ordem de chegada.
- Número de vagas restantes — não existe contador em tempo real.

---

## Período da campanha e como encerrar

**Se o deploy acontecer em 25/08/2026, a campanha fica aberta até
24/09/2026 às 23h59 (horário de Brasília)** — ou até as 10 empresas serem
selecionadas, o que ocorrer primeiro. Publicou em outro dia? Some 30 dias
corridos à data real do deploy e corrija esta linha.

> **O encerramento é MANUAL. Não existe nada no código que feche a campanha
> sozinha no dia 30.** Não há data no build, agendamento nem verificação de
> prazo: passada a data, a página continua aceitando candidatura até alguém
> virar a chave. Quem publicar precisa colocar um lembrete na agenda.

### Onde fica a chave

`src/components/dez-empresas/conteudo.ts`, primeira linha depois de `VAGAS`:

```ts
export const CAMPANHA_ENCERRADA = false;
```

### Como encerrar as candidaturas

1. Trocar para `export const CAMPANHA_ENCERRADA = true;`
2. Commit, e o deploy pelo fluxo normal (`@devops`).
3. Conferir em `companychatia.com.br/10-empresas` que o formulário sumiu.

Não é preciso mexer em rota, `robots`, sitemap ou anúncio: a página continua no
ar e o endereço divulgado segue funcionando.

### Como reabrir, se precisar

Voltar a chave para `false` e publicar de novo. Nada mais muda — a copy, o
formulário e a integração continuam intactos no código. Reabrir depois de já ter
respondido os candidatos, porém, é decisão comercial: quem foi avisado de que a
seleção fechou não espera vê-la aberta de novo.

### O que o visitante vê depois do encerramento

| Antes | Depois |
|---|---|
| Formulário de candidatura com 10 campos | Card "As 10 empresas desta seleção já foram escolhidas", com o texto de agradecimento e um botão que leva ao WhatsApp comercial |
| CTAs "Quero candidatar minha empresa" | Os mesmos botões, com o rótulo "Ver o resultado da seleção", levando ao card acima |
| — | Nenhum campo para preencher: é impossível enviar candidatura nova |

O resto da página (hero, o que a IA faz, o que é entregue, para quem é, FAQ)
continua igual, servindo de contexto para quem chega por link antigo.

> Ao virar a chave, vale revisar também o badge do hero ("apenas 10 empresas") e
> o selo "10 vagas nesta seleção", que seguem escritos como se houvesse vaga
> aberta. Não impedem candidatura — o formulário já não existe —, mas soam
> estranhos numa seleção encerrada.

---

## Depois que a campanha acabar

Quando as 10 empresas forem escolhidas, **três coisas mudam ao mesmo tempo**:

1. **A LP para de aceitar candidatura.** Em
   `src/components/dez-empresas/conteudo.ts`, virar `CAMPANHA_ENCERRADA` para
   `true`: o formulário dá lugar ao aviso de seleção encerrada e os CTAs deixam
   de prometer candidatura. A página continua no ar e o endereço divulgado
   segue funcionando.
2. **As não selecionadas são respondidas** por WhatsApp ou e-mail, com os dados
   do formulário (disponíveis no painel `/leads` e no CSV).
3. **Este documento é substituído** por uma versão que diz que a seleção foi
   encerrada e direciona para o caminho comercial normal (planos ou teste
   grátis). Enquanto isso não acontecer, a Jade seguirá convidando gente para uma
   seleção que já fechou.

A página está `noindex` e fora do `sitemap.ts`, então não fica resíduo em busca.

### Texto sugerido para a versão de encerramento

> A seleção das 10 empresas foi encerrada e as escolhidas já receberam contato.
> Quem se candidatou e não foi selecionado também foi avisado. Sua empresa ainda
> pode ter um Assistente de IA no WhatsApp pelo caminho normal: a CompanyChat
> apresenta as condições conforme o tamanho da operação.

---

## Regras comerciais aprovadas em 2026-08-25

Ficou definido pelo dono do produto, e está refletido na página e neste
documento:

| Regra | Definição |
|---|---|
| Prazo de inscrição | 30 dias após a publicação, ou até as 10 serem selecionadas |
| "Período inicial" | Os 30 primeiros dias após a ativação da operação |
| O que é gratuito | A implantação de **um** fluxo principal de automação |
| Fluxo principal | Atendimento, qualificação, vendas, agendamento, follow-up ou suporte |
| Fora do escopo | Automações, integrações e fluxos adicionais, avaliados à parte |
| Contratação | Não é automática; continuidade é opcional, com valores apresentados antes |
| Não selecionados | Recebem resposta por WhatsApp ou e-mail após o encerramento |
| Fim da campanha | A LP passa a exibir a versão encerrada e bloqueia novas candidaturas |

O que **continua sem definição** e por isso não pode ser dito por ninguém: data
exata de encerramento, prazo de análise das candidaturas e dia da resposta.
