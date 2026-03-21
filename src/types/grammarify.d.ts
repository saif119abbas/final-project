// src/types/grammarify.d.ts
// src/types/grammarify.d.ts
declare module "grammarify" {
  interface Grammarify {
    clean(text: string): string;
  }
  const grammarify: Grammarify;
  export = grammarify;
}
