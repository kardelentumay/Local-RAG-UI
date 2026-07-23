"use client";

import { FormEvent, useMemo, useState } from "react";

type DocumentItem = {
  name: string;
  meta: string;
  kind: "pdf" | "docx" | "xlsx";
  active: boolean;
};

const initialDocuments: DocumentItem[] = [
  { name: "RAG Evolution Survey.pdf", meta: "58 parça · 4.2 MB", kind: "pdf", active: true },
  { name: "Corrective RAG.pdf", meta: "36 parça · 1.8 MB", kind: "pdf", active: true },
  { name: "Araştırma Notları.docx", meta: "24 parça · 640 KB", kind: "docx", active: true },
  { name: "Deney Sonuçları.xlsx", meta: "8 tablo · 320 KB", kind: "xlsx", active: false },
];

const suggestions = [
  "Corrective RAG nasıl çalışır?",
  "RAGAS faithfulness nasıl ölçer?",
  "Agentic ve geleneksel RAG'ı karşılaştır.",
];

export default function Home() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [selectedSource, setSelectedSource] = useState<1 | 2>(1);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [answerLength, setAnswerLength] = useState("Normal");
  const activeCount = useMemo(() => documents.filter((item) => item.active).length, [documents]);

  function submitQuestion(event: FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    setNotice(`Demo modu: “${query.trim()}” sorusu gerçek RAG sistemine gönderilmedi.`);
    setQuery("");
  }

  function simulateUpload() {
    if (documents.some((item) => item.name === "Yeni Rapor.pdf")) {
      setNotice("Yeni Rapor.pdf zaten demo kütüphanesine eklendi.");
      return;
    }
    setDocuments((current) => [
      ...current,
      { name: "Yeni Rapor.pdf", meta: "İşlendi · 31 parça", kind: "pdf", active: true },
    ]);
    setNotice("Yeni Rapor.pdf başarıyla işlendi ve 31 parçaya ayrıldı.");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <img src="/assistant-icon.png" alt="" className="brand-mark" />
          <div>
            <strong>Lila</strong>
            <span>Yerel belge asistanı</span>
          </div>
        </div>
        <div className="top-actions">
          <span className="privacy-status"><i /> Çevrimdışı · Veriler bu cihazda</span>
          <button className="model-button" onClick={() => setSettingsOpen(true)}>
            qwen2.5-1.5b <span>⌄</span>
          </button>
          <button className="icon-button" aria-label="Ayarları aç" onClick={() => setSettingsOpen(true)}>⚙</button>
        </div>
      </header>

      <div className="workspace">
        <aside className="library-panel">
          <section className="sidebar-section chat-history-section">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Geçmiş</span>
                <h1>Sohbetler</h1>
              </div>
              <button className="small-icon" aria-label="Yeni sohbet başlat" onClick={() => setNotice("Yeni sohbet başlatıldı.")}>＋</button>
            </div>
            <nav className="chat-history" aria-label="Sohbet geçmişi">
              <button className="history-row is-current">
                <span className="history-icon">◌</span>
                <span className="history-copy"><b>Agentic ve geleneksel RAG</b><time>Bugün</time></span>
              </button>
              <button className="history-row">
                <span className="history-icon">◌</span>
                <span className="history-copy"><b>RAGAS değerlendirme metrikleri</b><time>Dün</time></span>
              </button>
              <button className="history-row">
                <span className="history-icon">◌</span>
                <span className="history-copy"><b>Corrective RAG özeti</b><time>21 Tem</time></span>
              </button>
            </nav>
          </section>

          <section className="sidebar-section documents-section">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Bilgi alanı</span>
                <h2>Belgelerim</h2>
              </div>
              <button className="small-icon" aria-label="Belge ara">⌕</button>
            </div>

            <button className="upload-zone" onClick={simulateUpload}>
              <span className="upload-icon">＋</span>
              <strong>Dosya ekle</strong>
              <small>PDF, DOCX veya XLSX</small>
            </button>

            <div className="collection-row">
              <span><b>RAG araştırmaları</b><small>{documents.length} belge</small></span>
              <button aria-label="Koleksiyon seçenekleri">•••</button>
            </div>

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
                  <span className="ready-dot" aria-label={document.active ? "Etkin" : "Devre dışı"} />
                </label>
              ))}
            </div>

            <div className="library-footer">
              <div><span>{activeCount}</span><small>etkin belge</small></div>
              <div><span>1.692</span><small>indeksli parça</small></div>
            </div>
          </section>
        </aside>

        <section className="chat-panel">
          <div className="chat-heading">
            <div>
              <span className="eyebrow">Yeni sohbet</span>
              <h2>Belgelerine bir soru sor</h2>
            </div>
            <button className="new-chat" onClick={() => setNotice("Yeni sohbet başlatıldı.")}>＋ Yeni sohbet</button>
          </div>

          <div className="chat-content">
            <div className="assistant-message">
              <img src="/assistant-icon.png" alt="Lila chatbot" />
              <div className="message-bubble welcome">
                <strong>Merhaba, ben Lila.</strong>
                <p>Seçtiğin belgeleri yerel olarak tarayıp, yanıtlarımı doğrulanabilir kaynaklarla desteklerim. Bugün neyi araştırıyoruz?</p>
              </div>
            </div>

            <div className="suggestions">
              {suggestions.map((suggestion) => (
                <button key={suggestion} onClick={() => setQuery(suggestion)}>{suggestion}</button>
              ))}
            </div>

            <div className="user-message">
              Agentic RAG ile geleneksel RAG arasındaki temel farklar nelerdir?
            </div>

            <div className="assistant-message">
              <img src="/assistant-icon.png" alt="Lila chatbot" />
              <div className="message-bubble answer">
                <div className="answer-label"><span>Kaynaklara dayalı yanıt</span><small>3,4 sn</small></div>
                <p>
                  Geleneksel RAG, sabit bir retrieval–generation akışında en ilgili parçaları bulup yanıt üretir.
                  Agentic RAG ise sorguyu planlayan, sonuçların ilgisini değerlendiren ve gerektiğinde aramayı yineleyen
                  otonom ajanlar kullanır. Bu yapı, çok adımlı sorularda daha uyarlanabilir bir süreç sağlar.
                  <button className="citation" onClick={() => setSelectedSource(1)}>[1]</button>
                </p>
                <p>
                  Bunun karşılığında agentic yaklaşım daha fazla işlem süresi, bileşen ve hata kontrolü gerektirir.
                  <button className="citation" onClick={() => setSelectedSource(2)}>[2]</button>
                </p>
                <div className="message-actions">
                  <button onClick={() => setNotice("Yanıt panoya kopyalandı (demo).")}>Kopyala</button>
                  <button onClick={() => setNotice("Olumlu geri bildirim kaydedildi (demo).")}>İyi yanıt</button>
                  <button onClick={() => setNotice("Geri bildirim paneli açıldı (demo).")}>Geliştirilmeli</button>
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
                placeholder="Belgelerin hakkında bir soru sor..."
                aria-label="Soru"
                rows={2}
              />
              <div className="composer-controls">
                <span><b>{activeCount}</b> belge içinde aranacak</span>
                <button type="submit" className="send-button" aria-label="Soruyu gönder">Gönder ↗</button>
              </div>
            </div>
            <small>Yanıtlar yalnızca seçili belgelerden üretilir. Önemli bilgileri kaynaklardan doğrulayın.</small>
          </form>
        </section>

        <aside className="source-panel">
          <div className="source-heading">
            <div><span className="eyebrow">Kanıt görünümü</span><h2>Kaynaklar</h2></div>
            <span className="source-count">2</span>
          </div>

          <div className="source-tabs">
            <button className={selectedSource === 1 ? "active" : ""} onClick={() => setSelectedSource(1)}>Kaynak 1</button>
            <button className={selectedSource === 2 ? "active" : ""} onClick={() => setSelectedSource(2)}>Kaynak 2</button>
          </div>

          {selectedSource === 1 ? (
            <article className="source-card">
              <div className="source-file">
                <span className="file-type pdf">PDF</span>
                <span><b>Agentic RAG Survey.pdf</b><small>Sayfa 18 · Bölüm 4.2</small></span>
              </div>
              <div className="confidence"><span>İlgililik</span><b>%91</b><i><em style={{ width: "91%" }} /></i></div>
              <blockquote>
                “Agentic RAG introduces autonomous agents that plan retrieval, assess document relevance and iteratively refine the retrieved context.”
              </blockquote>
              <button className="open-source" onClick={() => setNotice("PDF önizlemesi açıldı (demo).")}>Belgede göster ↗</button>
            </article>
          ) : (
            <article className="source-card">
              <div className="source-file">
                <span className="file-type pdf">PDF</span>
                <span><b>RAG Evolution Survey.pdf</b><small>Sayfa 27 · Limitations</small></span>
              </div>
              <div className="confidence"><span>İlgililik</span><b>%84</b><i><em style={{ width: "84%" }} /></i></div>
              <blockquote>
                “The added reasoning and evaluation stages improve adaptability, while increasing latency and orchestration complexity.”
              </blockquote>
              <button className="open-source" onClick={() => setNotice("PDF önizlemesi açıldı (demo).")}>Belgede göster ↗</button>
            </article>
          )}

          <div className="system-card">
            <div className="system-title"><span>●</span><b>Sistem hazır</b></div>
            <dl>
              <div><dt>Embedding</dt><dd>qwen3-0.6b</dd></div>
              <div><dt>Arama</dt><dd>Hibrit · top 2</dd></div>
              <div><dt>Veritabanı</dt><dd>Yerel SQLite</dd></div>
            </dl>
          </div>
        </aside>
      </div>

      {settingsOpen && (
        <div className="modal-backdrop" onMouseDown={() => setSettingsOpen(false)}>
          <section className="settings-modal" onMouseDown={(event) => event.stopPropagation()} aria-modal="true" role="dialog" aria-label="Yanıt ayarları">
            <div className="modal-heading"><div><span className="eyebrow">Yerel çalışma</span><h2>Yanıt ayarları</h2></div><button onClick={() => setSettingsOpen(false)}>×</button></div>
            <label>Model<select defaultValue="qwen2.5-1.5b"><option>qwen2.5-1.5b</option><option>qwen2.5-0.5b</option></select></label>
            <label>Yanıt dili<select defaultValue="auto"><option value="auto">Otomatik algıla</option><option>Türkçe</option><option>English</option></select></label>
            <fieldset><legend>Yanıt uzunluğu</legend>{["Kısa", "Normal", "Ayrıntılı"].map((item) => <button key={item} className={answerLength === item ? "active" : ""} onClick={() => setAnswerLength(item)}>{item}</button>)}</fieldset>
            <div className="privacy-note"><b>Gizlilik koruması açık</b><p>Belgeler ve sorular bu cihazdan dışarı gönderilmez.</p></div>
            <button className="save-settings" onClick={() => { setSettingsOpen(false); setNotice("Ayarlar demo için güncellendi."); }}>Ayarları uygula</button>
          </section>
        </div>
      )}
    </main>
  );
}
