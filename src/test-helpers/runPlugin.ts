// Shared helper for the lint-plugin test suite. Wraps `Deno.lint.runPlugin`
// with a default non-test filename so tests don't repeat the same incantation.
export function runPlugin(
  plugin: Deno.lint.Plugin,
  source: string,
  filename = "src/Example.ts",
): Deno.lint.Diagnostic[] {
  return Deno.lint.runPlugin(plugin, filename, source);
}
