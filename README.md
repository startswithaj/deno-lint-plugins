# deno-lint-plugins

A set of generic, project-agnostic custom [Deno lint plugins][deno-lint]
enforcing functional-style code and a few safety/hygiene rules. Drop them into
any Deno project via `deno.json` `lint.plugins`.

## Plugins

| Plugin                    | What it enforces                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| **expression-complexity** | Bans nested ternaries, multi-line ternaries (>3 lines), and multi-line boolean expressions (>2 lines). |
| **function-length**       | Max function body length — 110 lines for production code, 200 for test files.                          |
| **no-foreach-mutation**   | No mutating outer-scope collections inside `.forEach()` callbacks. Use `.reduce()` instead.            |
| **no-imperative-loops**   | Bans `for`, `for...of`, `for...in`, `while`, `do...while`. Use `.map()` / `.filter()` / `.reduce()`.   |
| **no-let**                | Bans `let` declarations. Use `const` with early returns, ternaries, or reduce.                         |
| **no-param-mutation**     | No mutating objects passed as function parameters. Return new values instead.                          |
| **no-swallowed-catch**    | Catch blocks must do something with the error (log, rethrow, or assign).                               |
| **no-test-globals**       | Bans leaking shared mutable state across tests via module-level globals.                               |
| **test-file-length**      | Caps test file length to keep suites focused.                                                          |

## Configuration

Deno lint plugins do **not** accept per-rule options from `deno.json`, so the
thresholds are baked-in sensible defaults:

- `function-length`: 110 lines (production), 200 lines (`*.test.ts` /
  `*.test.tsx`).
- `test-file-length`: 1000 lines.
- `expression-complexity`: ternary >3 lines, boolean expression >2 lines.

To narrow where a rule applies (e.g. exempt generated code), use the standard
`lint.exclude` globs in your `deno.json`.

## Usage

Reference the rules you want under `lint.plugins`. Deno supports local paths,
`jsr:`, and `npm:` specifiers.

```jsonc
{
  "lint": {
    "plugins": [
      "./vendor/deno-lint-plugins/src/expression-complexity.ts",
      "./vendor/deno-lint-plugins/src/function-length.ts",
      "./vendor/deno-lint-plugins/src/no-foreach-mutation.ts",
      "./vendor/deno-lint-plugins/src/no-imperative-loops.ts",
      "./vendor/deno-lint-plugins/src/no-let.ts",
      "./vendor/deno-lint-plugins/src/no-param-mutation.ts",
      "./vendor/deno-lint-plugins/src/no-swallowed-catch.ts",
      "./vendor/deno-lint-plugins/src/no-test-globals.ts",
      "./vendor/deno-lint-plugins/src/test-file-length.ts"
    ]
  }
}
```

Common ways to get the files locally for a relative path:

- **git submodule** — `git submodule add <repo-url> vendor/deno-lint-plugins`,
  pinned by commit and updated with `git submodule update --remote`.
- **clone / vendor** — clone the repo somewhere and point the relative paths at
  it.

## Notes on rule scope

Several rules special-case test files (`*.test.ts` / `*.test.tsx`):

- `function-length` allows 200 lines and skips
  `describe`/`it`/`test`/`Deno.test` callbacks.
- `no-let` is fully exempt in test files and in
  `describe`/`beforeEach`/`afterEach` setup callbacks.
- `no-test-globals` and `test-file-length` only run on test files.

`no-test-globals` recognizes vitest conventions (`vi.mock`, `vi.hoisted`) for
its module-scope escape hatches.

## Development

```sh
deno task check:all   # fmt:check + lint + check + test
deno task test        # run the plugin test suite
```

Each plugin with non-trivial logic has a co-located `*.test.ts` file.

[deno-lint]: https://docs.deno.com/runtime/reference/lint_plugins/
