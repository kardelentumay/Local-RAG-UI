"use client";

import { FormEvent, useMemo, useState } from "react";

type DocumentItem = {
  name: string;
  meta: string;
  kind: "pdf" | "docx" | "xlsx";
  active: boolean;
};

const initialDocuments: DocumentItem[] = [
  { name: "RAG Evolution Survey.pdf", meta: "58 chunks · 4.2 MB", kind: "pdf", active: true },
  { name: "Corrective RAG.pdf", meta: "36 chunks · 1.8 MB", kind: "pdf", active: true },
  { name: "Research Notes.docx", meta: "24 chunks · 640 KB", kind: "docx", active: true },
  { name: "Experiment Results.xlsx", meta: "8 tables · 320 KB", kind: "xlsx", active: false },
];

const suggestions = [
  "How does Corrective RAG work?",
  "How does RAGAS measure faithfulness?",
  "Compare agentic and traditional RAG.",
];

export default function Home() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [selectedSource, setSelectedSource] = useState<1 | 2>(1);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("qwen2.5-1.5b");
  const [selectedLanguage, setSelectedLanguage] = useState("Auto-detect");
  const [openDropdown, setOpenDropdown] = useState<"model" | "language" | null>(null);
  const [answerLength, setAnswerLength] = useState("Normal");
  const [documentsOpen, setDocumentsOpen] = useState(true);
  const [libraryOpen, setLibraryOpen] = useState(true);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const activeCount = useMemo(() => documents.filter((item) => item.active).length, [documents]);

  function showSource(source: 1 | 2) {
    setSelectedSource(source);
    setSourcesOpen(true);
  }

  function submitQuestion(event: FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    setNotice(`Demo mode: “${query.trim()}” was not sent to the actual RAG system.`);
    setQuery("");
  }

  function simulateUpload() {
    if (documents.some((item) => item.name === "New Report.pdf")) {
      setNotice("New Report.pdf has already been added to the demo library.");
      return;
    }
    setDocuments((current) => [
      ...current,
      { name: "New Report.pdf", meta: "Processed · 31 chunks", kind: "pdf", active: true },
    ]);
    setNotice("New Report.pdf was processed successfully and split into 31 chunks.");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <img src="/assistant-icon.png" alt="" className="brand-mark" />
          <div>
            <strong>Lila</strong>
            <span>Local document assistant</span>
          </div>
        </div>
        <div className="top-actions">
          <button className="model-button" onClick={() => setSettingsOpen(true)}>
            {selectedModel} <span>⌄</span>
          </button>
        </div>
      </header>

      <div className={`workspace ${libraryOpen ? "left-open" : ""} ${sourcesOpen ? "right-open" : ""}`}>
        {libraryOpen && <aside className="library-panel">
          <button
            className="sidebar-toggle inside-toggle left-inside direction-left"
            type="button"
            onClick={() => setLibraryOpen(false)}
            aria-label="Close left sidebar"
            title="Close left sidebar"
          >
            <img src="/sidebar-toggle.svg" alt="" />
          </button>
          <section className="sidebar-section chat-history-section">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Chat History</span>
              </div>
              <button className="small-icon" aria-label="Start a new chat" onClick={() => setNotice("A new chat was started.")}>＋</button>
            </div>
            <nav className="chat-history" aria-label="Chat history">
              <button className="history-row is-current">
                <span className="history-icon">◌</span>
                <span className="history-copy"><b>Agentic vs. traditional RAG</b><time>Today</time></span>
              </button>
              <button className="history-row">
                <span className="history-icon">◌</span>
                <span className="history-copy"><b>RAGAS evaluation metrics</b><time>Yesterday</time></span>
              </button>
              <button className="history-row">
                <span className="history-icon">◌</span>
                <span className="history-copy"><b>Corrective RAG summary</b><time>Jul 21</time></span>
              </button>
            </nav>
          </section>

          <section className="sidebar-section documents-section">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">My Documents</span>
              </div>
              <button className="heading-upload" aria-label="Add file" onClick={simulateUpload}>＋</button>
            </div>

            <div className="collection-row">
              <span><b>RAG Research</b><small>{documents.length} documents</small></span>
              <button
                className={`category-toggle ${documentsOpen ? "is-open" : ""}`}
                type="button"
                aria-label={documentsOpen ? "Collapse document category" : "Expand document category"}
                aria-expanded={documentsOpen}
                onClick={() => setDocumentsOpen((current) => !current)}
              >
                <img src="/category-dropdown.svg" alt="" />
              </button>
            </div>

            {documentsOpen && (
              <div className="document-list">
                {documents.map((document) => (
                  <label className={`document-row ${document.active ? "is-active" : ""}`} key={document.name}>
                    <input
                      type="checkbox"
                      checked={document.active}
                      onChange={() =>
                        setDocuments((current) =>
                          current.map((item) =>
                            item.name === document.name ? { ...item, active: !item.active } : item
                          )
                        )
                      }
                    />
                    <span className={`file-type ${document.kind}`}>{document.kind === "xlsx" ? "XLS" : document.kind.toUpperCase()}</span>
                    <span className="document-copy"><b>{document.name}</b><small>{document.meta}</small></span>
                    <span className="ready-dot" aria-label={document.active ? "Active" : "Inactive"} />
                  </label>
                ))}
              </div>
            )}

          </section>
        </aside>}

        <section className="chat-panel">
          {!libraryOpen && (
            <button
              className="sidebar-toggle collapsed-toggle left-collapsed direction-right"
              type="button"
              onClick={() => setLibraryOpen(true)}
              aria-label="Open left sidebar"
              title="Open left sidebar"
            >
              <img src="/sidebar-toggle.svg" alt="" />
            </button>
          )}
          {!sourcesOpen && (
            <button
              className="sidebar-toggle collapsed-toggle right-collapsed direction-left"
              type="button"
              onClick={() => setSourcesOpen(true)}
              aria-label="Open sources panel"
              title="Open sources panel"
            >
              <img src="/sidebar-toggle.svg" alt="" />
            </button>
          )}
          <div className="chat-content">
            <div className="assistant-message">
              <img src="/assistant-icon.png" alt="Lila chatbot" />
              <div className="message-bubble welcome">
                <strong>Hello, I&apos;m Lila.</strong>
                <p>I search your selected documents locally and support my answers with verifiable sources. What would you like to explore today?</p>
              </div>
            </div>

            <div className="suggestions">
              {suggestions.map((suggestion) => (
                <button key={suggestion} onClick={() => setQuery(suggestion)}>{suggestion}</button>
              ))}
            </div>

            <div className="user-message">
              What are the key differences between agentic RAG and traditional RAG?
            </div>

            <div className="assistant-message">
              <img src="/assistant-icon.png" alt="Lila chatbot" />
              <div className="message-bubble answer">
                <div className="answer-label"><span>Source-grounded answer</span><small>3.4 sec</small></div>
                <p>
                  Traditional RAG retrieves the most relevant chunks and generates an answer through a fixed
                  retrieval–generation pipeline. Agentic RAG uses autonomous agents that plan the query, evaluate
                  result relevance, and repeat retrieval when needed. This makes multi-step tasks more adaptable.
                  <button className="citation" onClick={() => showSource(1)}>[1]</button>
                </p>
                <p>
                  In return, the agentic approach requires more processing time, components, and error handling.
                  <button className="citation" onClick={() => showSource(2)}>[2]</button>
                </p>
                <div className="message-actions">
                  <button onClick={() => setNotice("The answer was copied to the clipboard (demo).")}>Copy</button>
                  <button onClick={() => setNotice("Positive feedback was saved (demo).")}>Good answer</button>
                  <button onClick={() => setNotice("The feedback panel was opened (demo).")}>Needs improvement</button>
                </div>
              </div>
            </div>
          </div>

          <form className="composer" onSubmit={submitQuestion}>
            {notice && <div className="demo-notice">{notice}<button type="button" onClick={() => setNotice("")}>×</button></div>}
            <div className="composer-box">
              <textarea
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ask a question about your documents..."
                aria-label="Question"
                rows={1}
              />
              <div className="composer-controls">
                <span>Search across <b>{activeCount}</b> documents</span>
                <button type="submit" className="send-button" aria-label="Send question">Send ↗</button>
              </div>
            </div>
            <small>Answers are generated only from selected documents. Verify important information against the sources.</small>
          </form>
        </section>

        {sourcesOpen && <aside className="source-panel">
          <button
            className="sidebar-toggle inside-toggle right-inside direction-right"
            type="button"
            onClick={() => setSourcesOpen(false)}
            aria-label="Close sources panel"
            title="Close sources panel"
          >
            <img src="/sidebar-toggle.svg" alt="" />
          </button>
          <div className="source-heading">
            <div><span className="eyebrow">Sources</span></div>
            <span className="source-count">2</span>
          </div>

          <div className="source-tabs">
            <button className={selectedSource === 1 ? "active" : ""} onClick={() => setSelectedSource(1)}>Source 1</button>
            <button className={selectedSource === 2 ? "active" : ""} onClick={() => setSelectedSource(2)}>Source 2</button>
          </div>

          {selectedSource === 1 ? (
            <article className="source-card">
              <div className="source-file">
                <span className="file-type pdf">PDF</span>
                <span><b>Agentic RAG Survey.pdf</b><small>Page 18 · Section 4.2</small></span>
              </div>
              <div className="confidence"><span>Relevance</span><b>91%</b><i><em style={{ width: "91%" }} /></i></div>
              <blockquote>
                “Agentic RAG introduces autonomous agents that plan retrieval, assess document relevance and iteratively refine the retrieved context.”
              </blockquote>
              <button className="open-source" onClick={() => setNotice("PDF preview opened (demo).")}>View in document ↗</button>
            </article>
          ) : (
            <article className="source-card">
              <div className="source-file">
                <span className="file-type pdf">PDF</span>
                <span><b>RAG Evolution Survey.pdf</b><small>Page 27 · Limitations</small></span>
              </div>
              <div className="confidence"><span>Relevance</span><b>84%</b><i><em style={{ width: "84%" }} /></i></div>
              <blockquote>
                “The added reasoning and evaluation stages improve adaptability, while increasing latency and orchestration complexity.”
              </blockquote>
              <button className="open-source" onClick={() => setNotice("PDF preview opened (demo).")}>View in document ↗</button>
            </article>
          )}

        </aside>}
      </div>

      {settingsOpen && (
        <div className="modal-backdrop" onMouseDown={() => { setSettingsOpen(false); setOpenDropdown(null); }}>
          <section className="settings-modal" onMouseDown={(event) => event.stopPropagation()} aria-modal="true" role="dialog" aria-label="Answer settings">
            <div className="modal-heading"><div><span className="eyebrow">Local mode</span><h2>Answer settings</h2></div><button aria-label="Close settings" onClick={() => { setSettingsOpen(false); setOpenDropdown(null); }}>×</button></div>

            <label className="settings-field">
              <span>Model</span>
              <div className={`custom-select ${openDropdown === "model" ? "is-open" : ""}`}>
                <button
                  type="button"
                  className="select-trigger"
                  aria-haspopup="listbox"
                  aria-expanded={openDropdown === "model"}
                  onClick={() => setOpenDropdown((current) => current === "model" ? null : "model")}
                >
                  <span>{selectedModel}</span><i>⌄</i>
                </button>
                {openDropdown === "model" && (
                  <div className="select-menu" role="listbox" aria-label="Model options">
                    {["qwen2.5-1.5b", "qwen2.5-0.5b"].map((model) => (
                      <button
                        type="button"
                        role="option"
                        aria-selected={selectedModel === model}
                        className={selectedModel === model ? "is-selected" : ""}
                        key={model}
                        onClick={() => { setSelectedModel(model); setOpenDropdown(null); }}
                      >
                        <span>{model}</span><b>{selectedModel === model ? "✓" : ""}</b>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </label>

            <label className="settings-field">
              <span>Answer language</span>
              <div className={`custom-select ${openDropdown === "language" ? "is-open" : ""}`}>
                <button
                  type="button"
                  className="select-trigger"
                  aria-haspopup="listbox"
                  aria-expanded={openDropdown === "language"}
                  onClick={() => setOpenDropdown((current) => current === "language" ? null : "language")}
                >
                  <span>{selectedLanguage}</span><i>⌄</i>
                </button>
                {openDropdown === "language" && (
                  <div className="select-menu" role="listbox" aria-label="Answer language options">
                    {["Auto-detect", "English", "Turkish"].map((language) => (
                      <button
                        type="button"
                        role="option"
                        aria-selected={selectedLanguage === language}
                        className={selectedLanguage === language ? "is-selected" : ""}
                        key={language}
                        onClick={() => { setSelectedLanguage(language); setOpenDropdown(null); }}
                      >
                        <span>{language}</span><b>{selectedLanguage === language ? "✓" : ""}</b>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </label>
            <fieldset><legend>Answer length</legend>{["Short", "Normal", "Detailed"].map((item) => <button key={item} className={answerLength === item ? "active" : ""} onClick={() => setAnswerLength(item)}>{item}</button>)}</fieldset>
            <div className="privacy-note"><b>Privacy protection is on</b><p>Documents and questions never leave this device.</p></div>
            <button className="save-settings" onClick={() => { setSettingsOpen(false); setOpenDropdown(null); setNotice("Demo settings were updated."); }}>Apply settings</button>
          </section>
        </div>
      )}
    </main>
  );
}
