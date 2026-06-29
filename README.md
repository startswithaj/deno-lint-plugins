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

Reference the rules you want under `lint.plugins`. The docs list local paths,
`jsr:`, and `npm:` specifiers, but **`https://` raw URLs also work** — so you
can consume these straight from GitHub with no vendoring step:

```jsonc
{
  "lint": {
    "plugins": [
      "https://raw.githubusercontent.com/startswithaj/deno-lint-plugins/main/src/expression-complexity.ts",
      "https://raw.githubusercontent.com/startswithaj/deno-lint-plugins/main/src/function-length.ts",
      "https://raw.githubusercontent.com/startswithaj/deno-lint-plugins/main/src/no-foreach-mutation.ts",
      "https://raw.githubusercontent.com/startswithaj/deno-lint-plugins/main/src/no-imperative-loops.ts",
      "https://raw.githubusercontent.com/startswithaj/deno-lint-plugins/main/src/no-let.ts",
      "https://raw.githubusercontent.com/startswithaj/deno-lint-plugins/main/src/no-param-mutation.ts",
      "https://raw.githubusercontent.com/startswithaj/deno-lint-plugins/main/src/no-swallowed-catch.ts",
      "https://raw.githubusercontent.com/startswithaj/deno-lint-plugins/main/src/no-test-globals.ts",
      "https://raw.githubusercontent.com/startswithaj/deno-lint-plugins/main/src/test-file-length.ts"
    ]
  }
}
```

- **Pinning:** swap `main` for a commit SHA or tag (e.g. `v1.0.0`) for
  reproducible linting. Tracking `main` is convenient but means a push here can
  change a consumer's lint behavior on the next cache refresh.
- **Caching:** Deno caches remote modules. After this repo changes, consumers
  pulling from `main` must run `deno lint --reload` (or `deno cache --reload`)
  to pick it up.

Prefer fully local files? Vendor the repo and use relative paths instead:

- **git submodule** — `git submodule add <repo-url> vendor/deno-lint-plugins`,
  then reference `./vendor/deno-lint-plugins/src/<rule>.ts`.
- **clone / vendor** — clone the repo somewhere and point relative paths at it.

### Rule IDs

`deno-lint-ignore` directives use the **plugin name + rule name**. Note the
names are not uniform — eight plugins carry a `custom-` prefix, while
`expression-complexity` does not:

```ts
// deno-lint-ignore custom-no-let/no-let -- store needs mutable state
// deno-lint-ignore expression-complexity/no-nested-ternary
```

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
