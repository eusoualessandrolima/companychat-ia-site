/** Endereço do site da Company AI, a frente de projetos sob medida.
 *
 *  A variável `NEXT_PUBLIC_COMPANY_AI_URL` existe para poder apontar para um
 *  ambiente de teste sem mexer no código; em produção o padrão já é o certo. */
export const SITE_COMPANY_AI =
  process.env.NEXT_PUBLIC_COMPANY_AI_URL || "https://ai.companychatia.com.br";
