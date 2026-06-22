export function buildQueryParams(sp: Record<string, string | string[] | undefined>, changes: Record<string, string | undefined>): string {
  const merged = { ...sp, ...changes };
  const entries: [string, string][] = [];
  for (const [key, val] of Object.entries(merged)) {
    if (val === undefined || val === "") continue;
    if (Array.isArray(val)) {
      val.forEach((v) => entries.push([key, v]));
    } else {
      entries.push([key, val]);
    }
  }
  const qs = new URLSearchParams(entries).toString();
  return qs ? `/ara?${qs}` : "/ara";
}
