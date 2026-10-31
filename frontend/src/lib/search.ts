export function parseSearchTerms(search: string): string[] {
  return search
    .split(",")
    .map((term) => term.trim().toLocaleLowerCase())
    .filter(Boolean);
}

export function matchesSearchTerms(fields: readonly string[], terms: readonly string[]): boolean {
  if (!terms.length) return true;

  const searchableText = fields.join(" ").toLocaleLowerCase();
  return terms.every((term) => searchableText.includes(term));
}
