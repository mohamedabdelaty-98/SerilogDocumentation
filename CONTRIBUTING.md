# Contributing

Thanks for improving the team's Serilog handbook. Keep pages accurate, direct, and useful to readers with different levels of .NET experience.

## Local setup

1. Install Python 3.10 or later.
2. Create and activate a virtual environment (`python -m venv .venv`).
3. Install dependencies with `python -m pip install -r requirements.txt`.
4. Preview with `python -m mkdocs serve` and open the local address it prints.
5. Before submitting, run `python -m mkdocs build --strict`.

## Writing guidelines

- Prefer short, descriptive pages and update `mkdocs.yml` navigation when adding a page.
- Explain the purpose of each code example, important APIs, package requirements, and relevant limitations.
- Use stable message templates and named properties. Avoid examples that log secrets or indiscriminately destructure objects.
- Link to official Serilog or package documentation for claims that depend on implementation details.
- State the .NET version or package generation when compatibility matters. Verify sink options against its current package README.
- Use fenced `mermaid` blocks for supported diagrams. Include a title and explain the flow and component roles in nearby prose.
- Keep external links descriptive and check internal links before submitting.

## Pull request checklist

- [ ] The page fits the sidebar structure and navigation is updated.
- [ ] Code blocks are complete enough to understand and use.
- [ ] `python -m mkdocs build --strict` succeeds.
- [ ] Mermaid diagrams and links are checked in the rendered preview.
- [ ] No credentials, secrets, personal data, or internal endpoints were added.

## Licensing

The repository owner should establish a license before inviting contributions or redistributing the project. Do not add a license file without that decision.
