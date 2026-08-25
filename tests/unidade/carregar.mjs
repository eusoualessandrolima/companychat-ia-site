import { createRequire } from "node:module";

/* Os módulos do funil são TypeScript e importam sem extensão. O script
   `npm run test:unidade` compila `src/lib/` para CommonJS em `.testes-build/`
   e os testes carregam de lá com `require`, que resolve extensão sozinho.

   `require` e não `import`: a detecção de exports nomeados em módulos
   CommonJS depende de análise estática e falha com reexport; o `require`
   devolve o objeto pronto, sem surpresa. */

const require_ = createRequire(import.meta.url);

export function carregar(caminho) {
  return require_(`../../.testes-build/lib/${caminho}.js`);
}
