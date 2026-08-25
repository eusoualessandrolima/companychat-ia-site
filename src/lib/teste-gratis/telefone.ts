/* Normalização de telefone para E.164.
   A máscara do formulário é conveniência visual; quem manda é este módulo,
   porque o corpo do POST pode chegar de qualquer lugar. */

export type Normalizacao =
  | { ok: true; e164: string }
  | { ok: false; motivo: string };

const DDDS_VALIDOS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

/** Aceita o número com ou sem código de país. Sem o `+` e sem o 55 na frente,
 *  assume Brasil: é o que o visitante brasileiro digita, e o formulário deixa
 *  claro que o campo é o WhatsApp com código do país. */
export function normalizarWhatsapp(bruto: unknown): Normalizacao {
  if (typeof bruto !== "string") {
    return { ok: false, motivo: "Informe o seu WhatsApp" };
  }

  const digitos = bruto.replace(/\D/g, "");
  if (!digitos) return { ok: false, motivo: "Informe o seu WhatsApp" };
  // E.164 termina em 15 dígitos, código de país incluído.
  if (digitos.length > 15) return { ok: false, motivo: "Número longo demais" };

  const internacional = bruto.trim().startsWith("+") || bruto.trim().startsWith("00");

  if (!internacional && !digitos.startsWith("55") && digitos.length <= 11) {
    return brasileiro(digitos);
  }
  if (digitos.startsWith("55") && digitos.length >= 12 && digitos.length <= 13) {
    return brasileiro(digitos.slice(2));
  }
  if (!internacional && digitos.length <= 11) {
    return brasileiro(digitos);
  }

  if (digitos.length < 8) {
    return { ok: false, motivo: "Número curto demais" };
  }
  return { ok: true, e164: `+${digitos}` };
}

function brasileiro(local: string): Normalizacao {
  if (local.length < 10) {
    return { ok: false, motivo: "Informe o DDD e o número" };
  }
  if (local.length > 11) {
    return { ok: false, motivo: "Número longo demais" };
  }

  const ddd = Number.parseInt(local.slice(0, 2), 10);
  if (!DDDS_VALIDOS.has(ddd)) {
    return { ok: false, motivo: "DDD inválido" };
  }

  let assinante = local.slice(2);

  /* Celular brasileiro tem nove dígitos desde 2016. Quem digita oito e começa
     com 6 a 9 esqueceu o nono; fixo (2 a 5) fica como está e não recebe
     WhatsApp, o que é recusado logo abaixo. */
  if (assinante.length === 8 && /^[6-9]/.test(assinante)) {
    assinante = `9${assinante}`;
  }

  if (assinante.length !== 9 || !/^9/.test(assinante)) {
    return { ok: false, motivo: "Informe um celular com WhatsApp" };
  }

  return { ok: true, e164: `+55${ddd}${assinante}` };
}

/** Chave de comparação entre o número que a pessoa informou e o `wa_id` que o
 *  provedor devolve.
 *
 *  A Meta responde `wa_id` de número brasileiro quase sempre **sem** o nono
 *  dígito (556293054630 para +5562993054630). Comparar as strings cruas faz o
 *  webhook não achar o lead e a conversa nunca chegar na IA. */
export function chaveComparacao(e164: string) {
  const digitos = e164.replace(/\D/g, "");
  if (digitos.startsWith("55") && digitos.length === 13 && digitos[4] === "9") {
    return `55${digitos.slice(2, 4)}${digitos.slice(5)}`;
  }
  return digitos;
}

/** As grafias E.164 sob as quais o mesmo número pode ter sido gravado.
 *  Usado para achar o lead a partir do `wa_id` do webhook, sem depender de o
 *  provedor mandar o nono dígito. */
export function variantesE164(bruto: string) {
  const digitos = bruto.replace(/\D/g, "");
  if (!digitos) return [];

  const variantes = new Set<string>([`+${digitos}`]);

  if (digitos.startsWith("55")) {
    const local = digitos.slice(2);
    if (local.length === 10 && /^[1-9]/.test(local.slice(2))) {
      variantes.add(`+55${local.slice(0, 2)}9${local.slice(2)}`);
    }
    if (local.length === 11 && local[2] === "9") {
      variantes.add(`+55${local.slice(0, 2)}${local.slice(3)}`);
    }
  }

  return [...variantes];
}

/** Só os últimos quatro dígitos, para log e mensagem de erro. Telefone
 *  completo em log técnico é dado pessoal espalhado sem necessidade. */
export function mascarar(e164: string) {
  const digitos = e164.replace(/\D/g, "");
  if (digitos.length <= 4) return "****";
  return `${"*".repeat(digitos.length - 4)}${digitos.slice(-4)}`;
}
