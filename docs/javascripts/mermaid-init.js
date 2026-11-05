document$.subscribe(() => {
  mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: "default" });
  mermaid.run({ querySelector: ".mermaid" });
});
