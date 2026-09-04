/** Dados públicos da empresa e datas de vigência dos documentos jurídicos.
 *
 *  Ficam aqui, e não espalhados nas três páginas, porque a revisão de apps da
 *  Meta confere se a razão social e o contato batem entre a Política de
 *  Privacidade, os Termos e a página de Exclusão de Dados. Divergir em uma
 *  delas é motivo de reprovação.
 *
 *  Cada documento tem a sua própria data de atualização: alterar os Termos não
 *  pode reescrever a data da política de privacidade, porque a data é o que
 *  identifica a versão vigente de cada texto. */

export const RAZAO_SOCIAL = "CompanyChat IA Ltda";
export const CNPJ = "36.076.441/0001-14";
export const CIDADE_SEDE = "Goiânia, Goiás, Brasil";

export const EMAIL_CONTATO = "contato@companychatia.com.br";
export const EMAIL_PRIVACIDADE = EMAIL_CONTATO;

export const ATUALIZADO_PRIVACIDADE = "4 de setembro de 2026";
export const ATUALIZADO_TERMOS = "4 de setembro de 2026";
export const ATUALIZADO_EXCLUSAO = "4 de setembro de 2026";

/** Prazos publicados nos três documentos — precisam ser iguais em todos. */
export const PRAZO_CONFIRMACAO = "2 dias úteis";
export const PRAZO_ATENDIMENTO = "15 dias";
