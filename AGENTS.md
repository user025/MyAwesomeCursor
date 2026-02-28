# AGENTS.md

## Cursor Cloud specific instructions

This is a documentation/tutorial repository ("MyAwesomeCursor") containing Chinese-language guides on using the Cursor AI editor. There are **no build tools, package managers, linters, or test frameworks**.

### Repository structure

| Directory | Contents |
|---|---|
| `如何让cursor按流程图写出交互网页/` | Tutorial on generating interactive webpages from flowcharts; includes a static HTML/CSS/JS text adventure game in `game/` |
| `如何让cursor使用设计模式编程/` | Tutorial on using design patterns with Cursor; Markdown + `.mdc` rule files |
| `如何让cursor完成网页任务/` | Tutorial on using Chrome DevTools MCP with Cursor |

### Running the application

The only runnable artifact is the static HTML game. Serve it with any HTTP server:

```bash
python3 -m http.server 8080
```

Then open in browser: `http://localhost:8080/如何让cursor按流程图写出交互网页/game/index.html`

There is also a standalone flowchart page at: `http://localhost:8080/如何让cursor按流程图写出交互网页/知识产权维权流程图.html`

### Gotchas

- The directory names contain Chinese characters. URL-encode them when using `curl` or other CLI tools.
- The game uses ES modules (`type="module"`), so it **must** be served via HTTP — opening `index.html` directly via `file://` will fail due to CORS restrictions on module imports.
- `知识产权维权流程图.html` loads Mermaid from CDN (`cdn.jsdelivr.net`), so it requires internet access to render the flowchart.
