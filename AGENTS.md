# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

This is a documentation/tutorial repository (MyAwesomeCursor) that teaches how to use the Cursor AI editor. It contains three tutorial sections and one interactive static HTML/JS game demo. There are **no build tools, package managers, or external dependencies**.

### Running the demo application

The only runnable artifact is the text-adventure game located at `如何让cursor按流程图写出交互网页/game/`. Since it uses ES modules (`type="module"`), it must be served over HTTP (not opened as a `file://` URL).

Start a static file server:

```bash
cd "如何让cursor按流程图写出交互网页/game" && python3 -m http.server 8080
```

Then open `http://localhost:8080/` in a browser.

### Lint / Test / Build

- **No linter, test suite, or build step exists.** The project is pure static HTML/CSS/JS with no transpilation or bundling.
- The only meaningful validation is to confirm the game loads and runs in a browser.

### Key caveats

- File and directory names are in Chinese. When referencing paths in shell commands, always wrap them in quotes.
- Google Fonts is loaded via CDN; the game still functions without it (fonts degrade gracefully).
