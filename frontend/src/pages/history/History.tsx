import { useMemo, useState } from "react";
import Aside from "./../../components/Aside/Aside";
import Header from "./../../components/Header/Header";
import "./History.css";

type Recording = {
  id: number;
  category: string;
  when: string;
  duration: string;
  title: string;
  excerpt: string;
  dialect: string;
  acc: string;
  format: string;
};

const recordings: Recording[] = [
  {
    id: 1,
    category: "Kgotla",
    when: "Today, 14:32",
    duration: "18:24 min",
    title: "Puisano ya Lekgotla la Mochudi",
    excerpt: "\"Re a lo amogela botlhe mo phuthegong e ya letsatsi. Go botlhokwa thata gore rotlhe re bee maikutlo a rona mo…",
    dialect: "Sekgatla",
    acc: "98.4%",
    format: "FLAC 24-bit / 48kHz",
  },
  {
    id: 2,
    category: "Kgotla",
    when: "Yesterday, 09:15",
    duration: "45:10 min",
    title: "Thuto ya Temo-Thuo Maun",
    excerpt: "\"...noka ya Thamalakane e tletse metsi sentle, balemi ba tshwanetse go simolola go lema masimo a bone ka…",
    dialect: "Setawana (North)",
    acc: "97.8%",
    format: "FLAC 24-bit",
  },
  {
    id: 3,
    category: "Radio Broadcasts",
    when: "12 May",
    duration: "12:05 min",
    title: "Seromamowa sa RB1 - Puisano ya Botsogo",
    excerpt: "\"Motsamaisi wa thulaganyo o tlhalosa botlhokwa jwa go kenta bana le go netefatsa gore tlhaloganyo e siame mo…",
    dialect: "Sengwaketse",
    acc: "99.1%",
    format: "MP3 320kbps",
  },
  {
    id: 4,
    category: "Healthcare & Clinical",
    when: "08 May",
    duration: "28:30 min",
    title: "Therisano ya Baoki le Dingaka (Clinic)",
    excerpt: "\"Molwetse o bolela gore: 'I have severe headache mme gape ke utlwa botlhoko mo mangoleng fa ke tsamaya.' Baoki",
    dialect: "Code-Switching (TN / EN)",
    acc: "96.5%",
    format: "WAV 16-bit",
  },
];

const filters: { label: string; count: number; key: string }[] = [
  { label: "All", count: 37, key: "All" },
  { label: "Kgotla", count: 14, key: "Kgotla" },
  { label: "Radio Broadcasts", count: 9, key: "Radio Broadcasts" },
  { label: "Traditional", count: 8, key: "Traditional" },
  { label: "Healthcare & Clinical", count: 6, key: "Healthcare & Clinical" },
];

const segments = [
  { id: 0, range: "00:00 - 02:15", title: "Opening & Thapelo (Prayer)", speaker: "Moruti / Elder Motsamai", acc: "99.4% Acc" },
  { id: 1, range: "02:15 - 06:45", title: "Kgosi Address (Tsamaiso)", speaker: "Kgosi Kgafela II", acc: "98.4% Acc" },
  { id: 2, range: "06:45 - 18:24", title: "Morafe Discussion & Feedback", speaker: "Bakgatla Ba Kgafela Community Reps", acc: "97.6% Acc" },
];

const speeds = ["0.75x", "1.0x", "1.25x", "1.5x"];

// deterministic waveform so it doesn't change between renders
const WAVE = Array.from({ length: 90 }, (_, i) =>
  Math.round(22 + Math.abs(Math.sin(i * 0.9) * 40 + Math.sin(i * 0.31) * 28)),
);

export default function History() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [selectedId, setSelectedId] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState("1.0x");
  const [segment, setSegment] = useState(1);

  const progress = 0.37; // 06:45 / 18:24

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = recordings.filter(
      (r) =>
        (filter === "All" || r.category === filter) &&
        (!q || r.title.toLowerCase().includes(q) || r.excerpt.toLowerCase().includes(q)),
    );
    return sort === "newest" ? out : [...out].reverse();
  }, [filter, query, sort]);

  const selected = recordings.find((r) => r.id === selectedId) ?? recordings[0];

  return (
    <div className="hist">
      <Aside active="history" />

      <div className="hist-main">
        <Header />

        <div className="hist-content">
          {/* Title row */}
          <div className="hist-top">
            <div>
              <span className="hist-label hist-label--orange">CORPUS ARCHIVE • WHISPER V3 SYNCED</span>
              <h1 className="hist-title">Audio &amp; Transcripts History</h1>
            </div>
            <div className="hist-tools">
              <button
                type="button"
                className="hist-btn hist-btn--select"
                onClick={() => setSort((s) => (s === "newest" ? "oldest" : "newest"))}
              >
                Sort: {sort === "newest" ? "Newest First" : "Oldest First"} ⌄
              </button>
              <button type="button" className="hist-btn">⇪ Upload Audio Files</button>
              <button type="button" className="hist-btn hist-btn--orange">⤓ Batch Export (SRT / JSON / WAV)</button>
            </div>
          </div>

          {/* Search + filters */}
          <div className="hist-search-bar">
            <div className="hist-search">
              <span>⌕</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search in audio recordings, speakers, or Setswana keywords (e.g., 'Kgotla', 'Dikgosi', 'Puso')..."
              />
              <span className="hist-mic">🎙</span>
            </div>
            <div className="hist-filters">
              {filters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`hist-chip ${filter === f.key ? "hist-chip--active" : ""}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
          </div>

          <div className="hist-cols">
            {/* LEFT: list */}
            <div className="hist-left">
              <div className="hist-left-head">
                <h2>
                  <span className="hist-dot" /> 37 Audio Files Stored
                </h2>
                <span className="hist-badge">BW Dialects: 7</span>
              </div>

              {list.map((r) => {
                const active = r.id === selectedId;
                return (
                  <button
                    key={r.id}
                    type="button"
                    className={`hist-item ${active ? "hist-item--active" : ""}`}
                    onClick={() => setSelectedId(r.id)}
                  >
                    <div className="hist-item-meta">
                      {active ? (
                        <span className="hist-tag-orange">ACTIVE PLAYBACK</span>
                      ) : (
                        <span className="hist-tag-dim">{r.category}</span>
                      )}
                      <span className="hist-when">{r.when}</span>
                      <span className="hist-dur">◷ {r.duration}</span>
                    </div>
                    <h3>{r.title}</h3>
                    <p>{r.excerpt}</p>
                    <div className="hist-item-foot">
                      <span className="hist-badge">{r.dialect}</span>
                      <span className="hist-badge hist-badge--acc">✓ {r.acc} Acc</span>
                      <span className="hist-badge hist-badge--dim">{r.format}</span>
                    </div>
                  </button>
                );
              })}
              {list.length === 0 && <p className="hist-empty">No recordings match your search.</p>}

              <div className="hist-storage">
                <div>
                  <strong>14.2 hrs Audio Stored on Device</strong>
                  <span>INT8 Quantized Synced Cache • 1.2 GB</span>
                </div>
                <button type="button" className="hist-btn">Export All (.TAR)</button>
              </div>
            </div>

            {/* RIGHT: detail */}
            <div className="hist-right">
              {/* Player card */}
              <section className="hist-card hist-player">
                <div className="hist-player-top">
                  <div>
                    <div className="hist-tag-row">
                      <span className="hist-tag-orange">RECENT RECORDING • ACTIVE PLAYBACK</span>
                      <span className="hist-label">ID: #BW-MOC-2024-089</span>
                    </div>
                    <h2 className="hist-h2">{selected.title}</h2>
                    <p className="hist-sub">
                      ⌖ Mochudi Traditional Kgotla, Kgatleng • Recording Date: {selected.when}
                    </p>
                    <p className="hist-sub hist-sub--strong">{selected.format} Lossless</p>
                  </div>
                  <div className="hist-acc-box">
                    <b>✓ {selected.acc}</b>
                    <span>Whisper Large-v3 (Fine-Tuned)</span>
                  </div>
                </div>

                <div className="hist-wave" aria-hidden="true">
                  {WAVE.map((h, i) => {
                    const done = i / WAVE.length <= progress;
                    return (
                      <span
                        key={i}
                        className={done ? "hist-wave-bar hist-wave-bar--done" : "hist-wave-bar"}
                        style={{ height: `${h}%` }}
                      />
                    );
                  })}
                  <span className="hist-playhead" style={{ left: `${progress * 100}%` }}>
                    <em>06:45</em>
                  </span>
                </div>

                <div className="hist-controls">
                  <button
                    type="button"
                    className="hist-play"
                    onClick={() => setPlaying((p) => !p)}
                    aria-label={playing ? "Pause" : "Play"}
                  >
                    {playing ? "❚❚" : "▶"}
                  </button>
                  <button type="button" className="hist-round" aria-label="Back 10 seconds">↺</button>
                  <button type="button" className="hist-round" aria-label="Forward 10 seconds">↻</button>
                  <span className="hist-time">
                    <b>06:45</b> / 18:24 min
                  </span>
                </div>

                <div className="hist-speed-row">
                  <div className="hist-speeds">
                    {speeds.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`hist-speed ${speed === s ? "hist-speed--active" : ""}`}
                        onClick={() => setSpeed(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="hist-volume">
                    ♪ <span><i /></span>
                  </div>
                </div>
              </section>

              {/* Transcript card */}
              <section className="hist-card hist-transcript">
                <div className="hist-transcript-head">
                  <h2 className="hist-h2">
                    <span className="hist-bars-icon">▮▮</span> SYNCHRONIZED TRANSCRIPT
                  </h2>
                  <div className="hist-transcript-actions">
                    <span className="hist-sync">06:45 Synced</span>
                    <button type="button" className="hist-btn">Copy Text</button>
                    <button type="button" className="hist-btn">Edit Phonemes</button>
                  </div>
                </div>

                <div className="hist-verbatim">
                  <div className="hist-verbatim-head">
                    <span>● SETSWANA VERBATIM (SEKGATLA ACOUSTIC MODEL)</span>
                    <span>Speaker: Kgosi Kgafela II</span>
                  </div>
                  <p>
                    "Re a lo amogela botlhe mo phuthegong e ya letsatsi.{" "}
                    <mark>Go botlhokwa thata gore rotlhe re bee maikutlo a rona mo pontsheng</mark> ka
                    kelotlhoko le kagiso mo kgotleng ya Mochudi. A re tsweleleng ka thulaganyo ya rona ya
                    go buisana ka merero ya motse le ditsamaiso tsa temo-thuo le ditsha."
                  </p>
                </div>

                <div className="hist-translation">
                  <div className="hist-verbatim-head">
                    <span>⇄ ENGLISH NEURAL TRANSLATION (DIRECT SYNTHESIZED)</span>
                    <span className="hist-orange">BLEU Score: 41.2</span>
                  </div>
                  <p>
                    "ENGLISH TRANSLATION: 'We welcome you all to today's gathering. It is of utmost
                    importance that we lay our thoughts openly with care and peace at Mochudi Kgotla. Let
                    us proceed with our agenda of consulting on communal village developments,
                    agricultural allocations, and land plots.'"
                  </p>
                </div>

                <div className="hist-seg-head">
                  <span>TIMESTAMP SEGMENTS &amp; SPEAKER DIARIZATION</span>
                  <span>3 Detected Turns</span>
                </div>
                <div className="hist-segments">
                  {segments.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`hist-seg ${segment === s.id ? "hist-seg--active" : ""}`}
                      onClick={() => setSegment(s.id)}
                    >
                      <span className="hist-seg-range">{s.range}</span>
                      <span className="hist-seg-info">
                        <strong>{s.title}</strong>
                        <em>{s.speaker}</em>
                      </span>
                      <span className="hist-seg-acc">{s.acc}</span>
                      <span className="hist-seg-play">{segment === s.id ? "❚❚" : "▶"}</span>
                    </button>
                  ))}
                </div>

                <div className="hist-downloads">
                  <button type="button" className="hist-btn">Download Subtitles (.SRT)</button>
                  <button type="button" className="hist-btn">Download Audio (.WAV)</button>
                  <button type="button" className="hist-btn">{"{}"} JSON Timestamps</button>
                  <button type="button" className="hist-btn hist-btn--dark">Share Transcript Link</button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}