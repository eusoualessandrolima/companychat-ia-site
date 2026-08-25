import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { carregar } from "./carregar.mjs";

const { envioWhatsappLigado } = carregar("teste-gratis/config");
const { processarFila } = carregar("teste-gratis/fila");
const { copyDoFunil, detalheDoSucesso } = carregar(
  "../components/teste-gratis/conteudo"
);

const original = process.env.FREE_TRIAL_WHATSAPP_ENABLED;

afterEach(() => {
  if (original === undefined) delete process.env.FREE_TRIAL_WHATSAPP_ENABLED;
  else process.env.FREE_TRIAL_WHATSAPP_ENABLED = original;
});

test("a chave nasce desligada quando a variável não existe", () => {
  delete process.env.FREE_TRIAL_WHATSAPP_ENABLED;
  assert.equal(envioWhatsappLigado(), false);
});

test("só o valor exato 'true' liga o envio", () => {
  for (const valor of ["", " ", "false", "1", "yes", "sim", "TRUE", "True"]) {
    process.env.FREE_TRIAL_WHATSAPP_ENABLED = valor;
    assert.equal(envioWhatsappLigado(), false, `não deveria ligar com "${valor}"`);
  }

  process.env.FREE_TRIAL_WHATSAPP_ENABLED = "true";
  assert.equal(envioWhatsappLigado(), true);

  // Espaço em volta é erro de digitação no painel, não intenção diferente.
  process.env.FREE_TRIAL_WHATSAPP_ENABLED = " true ";
  assert.equal(envioWhatsappLigado(), true);
});

test("com a chave desligada a fila não reivindica nem envia nada", async () => {
  process.env.FREE_TRIAL_WHATSAPP_ENABLED = "false";

  let reivindicou = false;
  const enviados = [];

  const resumo = await processarFila(
    10,
    {
      nome: "falso",
      async enviarTemplate(pedido) {
        enviados.push(pedido);
        return { ok: true, messageId: "x", provedor: "falso" };
      },
    },
    {
      bancoDisponivel: () => true,
      async reivindicarJobs() {
        reivindicou = true;
        return [{ id: "1", lead_id: "l", tipo: "followup_whatsapp", executar_em: "", status: "processando", tentativas: 1, max_tentativas: 5 }];
      },
      async buscarLead() {
        throw new Error("não deveria chegar aqui");
      },
      async concluirJob() {},
      async adiarOuFalharJob() {
        return { desistiu: false };
      },
      async marcarEnviado() {},
      async marcarFalhaEnvio() {},
      async registrarEvento() {
        return true;
      },
    }
  );

  assert.equal(resumo.envioDesligado, true);
  assert.equal(resumo.reivindicados, 0);
  assert.equal(enviados.length, 0);
  // Não tocar na fila é o que permite religar sem perder tentativa nenhuma.
  assert.equal(reivindicou, false);
});

test("com a chave ligada a fila volta a trabalhar", async () => {
  process.env.FREE_TRIAL_WHATSAPP_ENABLED = "true";

  const enviados = [];
  const lead = {
    id: "l",
    nome: "Ana Souza",
    whatsapp_e164: "+5562993054630",
    consentimento_whatsapp: true,
    status: "agendado",
    whatsapp_message_id: null,
  };

  const resumo = await processarFila(
    10,
    {
      nome: "falso",
      async enviarTemplate(pedido) {
        enviados.push(pedido);
        return { ok: true, messageId: "wamid.1", provedor: "falso" };
      },
    },
    {
      bancoDisponivel: () => true,
      async reivindicarJobs() {
        return [{ id: "1", lead_id: "l", tipo: "followup_whatsapp", executar_em: "", status: "processando", tentativas: 1, max_tentativas: 5 }];
      },
      async buscarLead() {
        return lead;
      },
      async concluirJob() {},
      async adiarOuFalharJob() {
        return { desistiu: false };
      },
      async marcarEnviado() {},
      async marcarFalhaEnvio() {},
      async registrarEvento() {
        return true;
      },
    }
  );

  assert.equal(resumo.enviados, 1);
  assert.equal(enviados.length, 1);
  assert.equal(resumo.envioDesligado, undefined);
});

test("a copy sem envio não promete prazo", () => {
  const semEnvio = copyDoFunil(false);
  const textos = [
    semEnvio.subtitulo,
    semEnvio.sucessoTexto,
    detalheDoSucesso(semEnvio, "+55 62 99999-9999"),
    semEnvio.etapaContato.titulo,
    semEnvio.etapaContato.texto,
    ...semEnvio.garantias,
  ].join(" ");

  for (const promessa of ["alguns minutos", "minutos", "imediat", "em breve", "assim que"]) {
    assert.ok(
      !textos.toLowerCase().includes(promessa),
      `a copy sem envio não pode conter "${promessa}"`
    );
  }
});

test("a copy com envio mantém a promessa de minutos", () => {
  const comEnvio = copyDoFunil(true);
  assert.ok(comEnvio.sucessoTexto.includes("Em alguns minutos"));
  assert.ok(comEnvio.garantias.some((g) => g.includes("alguns minutos")));
});

test("o número entra no detalhe da confirmação nas duas versões", () => {
  for (const copy of [copyDoFunil(true), copyDoFunil(false)]) {
    const texto = detalheDoSucesso(copy, "+55 62 99999-9999");
    assert.ok(texto.includes("+55 62 99999-9999"));
    assert.ok(!texto.includes("{whatsapp}"));
  }
});

test("as duas versões falam do mesmo canal e do mesmo compromisso", () => {
  for (const copy of [copyDoFunil(true), copyDoFunil(false)]) {
    assert.ok(copy.subtitulo.includes("WhatsApp"));
    assert.ok(copy.garantias.some((g) => g.includes("sem custo")));
    assert.ok(copy.garantias.some((g) => g.includes("Sem compromisso")));
  }
});
