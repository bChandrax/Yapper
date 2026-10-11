import { useState } from "react";
import Aside from "./../../components/Aside/Aside";
import Header from "./../../components/Header/Header";
import "./Dashboard.css";

const profiles = [
  "Sengwaketse (Southern - Active)",
  "Setawana (Northern)",
  "Sekgatla (Kgatleng)",
  "Rolong (Barolong)",
  "Code-Switching (Setswana / English)",
];

const bars: { h: number; c: "orange" | "blue" | "dim" }[] = [
  { h: 40, c: "dim" }, { h: 90, c: "orange" }, { h: 55, c: "dim" }, { h: 70, c: "orange" },
  { h: 100, c: "blue" }, { h: 50, c: "dim" }, { h: 45, c: "dim" }, { h: 65, c: "blue" },
  { h: 30, c: "orange" }, { h: 38, c: "dim" }, { h: 62, c: "orange" }, { h: 100, c: "blue" },
  { h: 95, c: "orange" }, { h: 55, c: "dim" }, { h: 35, c: "dim" }, { h: 80, c: "orange" },
  { h: 45, c: "dim" }, { h: 70, c: "blue" }, { h: 85, c: "orange" }, { h: 40, c: "dim" },
  { h: 55, c: "blue" }, { h: 98, c: "orange" }, { h: 30, c: "dim" }, { h: 55, c: "dim" },
];

const initialToggles = [
  { id: "live", title: "Live Transcription", sub: "Real-time beam search", on: true },
  { id: "translate", title: "English Translation", sub: "Direct Setswana → English", on: true },
  { id: "diar", title: "Kgotla Diarization", sub: "Customary council speakers", on: false },
  { id: "punct", title: "Punctuation Restoration", sub: "Syntax & capitalization", on: true },
];

const filters = ["All (37)", "Kgotla Sessions", "Radio Broadcasts", "Health Consults"];

const recordings = [
  {
    id: 1,
    title: "Puisano ya Lekgotla la Mochudi",
    dialect: "Sekgatla dialect",
    duration: "18:24 min",
    acc: "98.4% Acc",
    category: "Kgotla Sessions",
    excerpt:
      "\"Re a lo amogela botlhe mo phuthegong e ya letsatsi. Go botlhokwa thata gore rotlhe re bee maikutlo a rona mo pontsheng ka botswerere le kagiso...\"",
  },
  {
    id: 2,
    title: "Thuto ya Temo-Thuo Maun",
    dialect: "Setawana (Northern)",
    duration: "45:10 min",
    acc: "97.8% Acc",
    category: "Kgotla Sessions",
    excerpt:
      "\"...noka ya Thamalakane e tletse metsi sentle monongwaga. Balemi ba tshwanetse go simolola go baakanya masimo a bone pele ga pula ya ntlha e na...\"",
  },
  {
    id: 3,
    title: "Seromamowa sa RB1 - Puisano ya Botsogo",
    dialect: "Sengwaketse",
    duration: "12:05 min",
    acc: "99.1% Acc",
    category: "Radio Broadcasts",
    excerpt:
      "\"Kgang-kgolo gompieno mo seromamoweng ke go tlhatlhoba gore maikaelelo a tsa botsogo a goroga jang mo magaeng a rona otlhe...\"",
  },
];

export default function Dashboard() {
  const [profile, setProfile] = useState(profiles[0]);
  const [toggles, setToggles] = useState(initialToggles);
  const [filter, setFilter] = useState(filters[0]);

  const flip = (id: string) =>
    setToggles((t) => t.map((x) => (x.id === id ? { ...x, on: !x.on } : x)));

  const visible = recordings.filter((r) => filter === filters[0] || r.category === filter);
  const activeCount = toggles.filter((t) => t.on).length;

  return (
    <div className="dash">
      <Aside active="dashboard" />

      <div className="dash-main">
        <Header />

        <div className="dash-content">
          {/* Welcome panel */}
          <section className="dash-card dash-hero">
            <div className="dash-hero-top">
              <div>
                <div className="dash-tag-row">
                  <span className="dash-pill-outline">NEURAL ACOUSTIC RIG</span>
                  <span className="dash-dot" />
                  <span className="dash-mono-sm">CoreML • Local Device Stream</span>
                </div>
                <h1 className="dash-title">Welcome back, Daniel</h1>
                <p className="dash-sub">Setswana Whisper Large-v3 Speech-to-Text Neural Engine</p>
              </div>
              <div className="dash-stats">
                <div className="dash-stat">
                  <span>Accuracy</span>
                  <strong>98.4%</strong>
                </div>
                <div className="dash-stat">
                  <span>Latency</span>
                  <strong>120ms</strong>
                </div>
                <div className="dash-stat">
                  <span>Precision</span>
                  <strong>INT8 Quantized</strong>
                </div>
              </div>
            </div>

            <div className="dash-profile-head">
              <span className="dash-label">ACTIVE REGIONAL ACOUSTIC PROFILE</span>
              <span className="dash-mono-sm">Tone &amp; Click Preservation Engine v2</span>
            </div>
            <div className="dash-chips">
              {profiles.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`dash-chip ${profile === p ? "dash-chip--active" : ""}`}
                  onClick={() => setProfile(p)}
                >
                  {profile === p && "• "}
                  {p}
                </button>
              ))}
            </div>
          </section>

          {/* Engine + metrics */}
          <div className="dash-grid">
            <section className="dash-card dash-engine">
              <div className="dash-engine-head">
                <div>
                  <span className="dash-label dash-label--orange">STUDIO INPUT BUFFER</span>
                  <h2 className="dash-h2">LENTSWE AI ENGINE</h2>
                  <p className="dash-sub">Live Voice Recorder &amp; Acoustic Transcriber</p>
                </div>
                <span className="dash-badge">● 48.0 kHz • 24-bit PCM</span>
              </div>

              <div className="dash-viz">
                <div className="dash-viz-head">
                  <span>▮ SPECTRAL BEAM VISUALIZER (CH 1-8)</span>
                  <span>
                    -18.4 dB RMS <b className="dash-orange">PEAK: -2.1 dB</b>
                  </span>
                </div>
                <div className="dash-bars">
                  {bars.map((b, i) => (
                    <span
                      key={i}
                      className={`dash-bar dash-bar--${b.c}`}
                      style={{ height: `${b.h}%` }}
                    />
                  ))}
                </div>
                <div className="dash-viz-foot">
                  <span>00:00:00.00</span>
                  <span>VAD: SILENCE THRESHOLD 32MS</span>
                  <b className="dash-blue">BEAM BUFFER READY</b>
                </div>
              </div>

              <div className="dash-actions">
                <button type="button" className="dash-start">
                  Start Speaking / Live Transcribe →
                </button>
                <button type="button" className="dash-upload">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 18a5 5 0 0 1-.5-9.97A6 6 0 0 1 18 9a4 4 0 0 1 0 8" />
                    <path d="M12 12v8M9 15l3-3 3 3" />
                  </svg>
                  <span>
                    <strong>Upload Audio / Batch FLAC</strong>
                    <em>WAV, MP3, M4A, OGG up to 2GB</em>
                  </span>
                </button>
              </div>

              <div className="dash-profile-head">
                <span className="dash-label">ACOUSTIC ENGINE PIPELINE TOGGLES</span>
                <span className="dash-mono-sm">{activeCount} Models Active</span>
              </div>
              <div className="dash-toggles">
                {toggles.map((t) => (
                  <div key={t.id} className="dash-toggle">
                    <div>
                      <strong>{t.title}</strong>
                      <span>{t.sub}</span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={t.on}
                      aria-label={t.title}
                      className={`dash-switch ${t.on ? "dash-switch--on" : ""}`}
                      onClick={() => flip(t.id)}
                    >
                      <span />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <div className="dash-side-col">
              <section className="dash-card dash-metrics">
                <div className="dash-metrics-head">
                  <div>
                    <span className="dash-label dash-label--orange">LOCAL CHECKPOINT</span>
                    <h2 className="dash-h2">Whisper Large-v3 Metrics</h2>
                  </div>
                  <span className="dash-badge">Metal GPU Active</span>
                </div>
                <div className="dash-metric-boxes">
                  <div className="dash-metric">
                    <b className="dash-blue">2.1%</b>
                    <span>CER (CHAR ERROR)</span>
                  </div>
                  <div className="dash-metric">
                    <b className="dash-orange">4.2%</b>
                    <span>WER (WORD ERROR)</span>
                  </div>
                  <div className="dash-metric">
                    <b className="dash-orange">1.2x</b>
                    <span>REAL-TIME RATIO</span>
                  </div>
                </div>
                <div className="dash-profile-head">
                  <span className="dash-mono-sm">Attention Matrix Depth</span>
                  <span className="dash-mono-sm">32 Heads • 32 Layers</span>
                </div>
                <div className="dash-progress">
                  <span style={{ width: "92%" }} />
                </div>
              </section>

              <section className="dash-card dash-storage">
                <div className="dash-storage-head">
                  <div>
                    <strong>Local Storage &amp; Cache</strong>
                    <span>Offline audio corpus</span>
                  </div>
                  <button type="button" className="dash-ghost-btn">
                    ⤓ Export Database
                  </button>
                </div>
                <div className="dash-storage-body">
                  <div>
                    <b>14.2</b> <em>hrs</em>
                    <span>Setswana Audio Cached</span>
                  </div>
                  <div className="dash-storage-right">
                    <b>1.2 GB</b>
                    <span>INT8 Quantized</span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Recent recordings */}
          <section className="dash-recent">
            <span className="dash-label dash-label--orange">CORPUS ARCHIVE</span>
            <div className="dash-recent-head">
              <h2 className="dash-title dash-title--md">Recent Recordings &amp; Transcriptions</h2>
              <div className="dash-chips">
                {filters.map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`dash-chip dash-chip--sm ${filter === f ? "dash-chip--active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="dash-list">
              {visible.map((r) => (
                <article key={r.id} className="dash-row">
                  <div className="dash-row-icon">🎙</div>
                  <div className="dash-row-body">
                    <div className="dash-row-title">
                      <h3>{r.title}</h3>
                      <span className="dash-badge dash-badge--sm">{r.dialect}</span>
                      <span className="dash-badge dash-badge--sm">{r.duration}</span>
                      <span className="dash-acc">{r.acc}</span>
                    </div>
                    <p>{r.excerpt}</p>
                  </div>
                  <div className="dash-row-actions">
                    <button type="button" className="dash-ghost-btn">▶ Play</button>
                    <button type="button" className="dash-ghost-btn">View Transcript</button>
                    <button type="button" className="dash-ghost-btn" aria-label="Download">⤓</button>
                  </div>
                </article>
              ))}
              {visible.length === 0 && <p className="dash-empty">No recordings in this category yet.</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}