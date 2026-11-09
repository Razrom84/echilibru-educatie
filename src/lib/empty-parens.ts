/** Empty parentheses left in activity copy: `()` or `( )`. */
export const EMPTY_PARENS = /\(\s*\)/;

export function hasEmptyParens(value: string): boolean {
  return EMPTY_PARENS.test(value);
}

export function fieldsWithEmptyParens(
  fields: readonly string[],
): string[] {
  return fields.filter((field) => hasEmptyParens(field));
}
