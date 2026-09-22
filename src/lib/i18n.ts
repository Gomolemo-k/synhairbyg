import { createTranslator } from "use-intl/core";
import type { AbstractIntlMessages } from "use-intl";
import en from "../../messages/en.json";

export type Translator = (
  key: string,
  values?: Record<string, string | number>,
) => string;

const messages: AbstractIntlMessages = en as unknown as AbstractIntlMessages;

const cache = new Map<string, Translator>();

export function translator(scope: string): Translator {
  let fn = cache.get(scope);
  if (!fn) {
    const t = createTranslator({
      locale: "en",
      messages,
      namespace: `UI.${scope}`,
    });
    fn = t as unknown as Translator;
    cache.set(scope, fn);
  }
  return fn;
}

export function t(scope: string, key: string, values?: Record<string, string | number>) {
  return translator(scope)(key, values);
}