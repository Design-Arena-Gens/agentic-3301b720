"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type OverlayPosition = "top" | "center" | "bottom";

const DEFAULT_PROMO_HEADLINE = "BLACK FRIDAY 28 NËNTORI";
const DEFAULT_PROMO_SUBLINE =
  "Personalizoni shishet me logo, foto, shkrime sipas dëshirës.";
const DEFAULT_SCRIPT =
  "Original text as I write – edit this live to sync your storytelling with the sale visuals.";
const FALLBACK_VIDEO =
  "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4";

const positions: { value: OverlayPosition; label: string }[] = [
  { value: "top", label: "Top" },
  { value: "center", label: "Center" },
  { value: "bottom", label: "Bottom" }
];

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoSrc, setVideoSrc] = useState<string>(FALLBACK_VIDEO);
  const [headline, setHeadline] = useState(DEFAULT_PROMO_HEADLINE);
  const [subline, setSubline] = useState(DEFAULT_PROMO_SUBLINE);
  const [script, setScript] = useState(DEFAULT_SCRIPT);
  const [accent, setAccent] = useState(true);
  const [primaryColor, setPrimaryColor] = useState("#ffc300");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(48);
  const [tracking, setTracking] = useState(5);
  const [position, setPosition] = useState<OverlayPosition>("bottom");
  const [verticalOffset, setVerticalOffset] = useState(8);
  const [textShadow, setTextShadow] = useState(true);
  const [scriptEnabled, setScriptEnabled] = useState(true);

  const overlayStyle = useMemo(() => {
    const base: React.CSSProperties = {
      fontSize: `${fontSize}px`,
      letterSpacing: `${tracking / 100}em`,
      color: accent ? "#050505" : secondaryColor,
      transform: "translate(-50%, -50%)"
    };

    if (position === "top") {
      base.top = `${5 + verticalOffset}%`;
      base.left = "50%";
    } else if (position === "center") {
      base.top = "50%";
      base.left = "50%";
    } else {
      base.top = `${95 - verticalOffset}%`;
      base.left = "50%";
    }

    if (!textShadow) {
      base.textShadow = "none";
    }

    return base;
  }, [accent, fontSize, position, tracking, verticalOffset, secondaryColor, textShadow]);

  const sublineStyle = useMemo(() => {
    const base: React.CSSProperties = {
      display: subline.trim() ? "block" : "none",
      marginTop: "6px",
      fontSize: `${Math.max(16, fontSize * 0.35)}px`,
      fontWeight: 600,
      letterSpacing: "0.08em",
      color: accent ? "#050505" : secondaryColor,
      textTransform: "none"
    };

    return base;
  }, [accent, fontSize, secondaryColor, subline]);

  useEffect(() => {
    return () => {
      if (videoSrc !== FALLBACK_VIDEO) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [videoSrc]);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setVideoSrc((current) => {
      if (current !== FALLBACK_VIDEO) {
        URL.revokeObjectURL(current);
      }
      return fileUrl;
    });

    requestAnimationFrame(() => {
      if (videoRef.current) {
        const playPromise = videoRef.current.play();
        if (playPromise) playPromise.catch(() => {});
      }
    });
  };

  const handleAccentToggle = () => setAccent((prev) => !prev);
  const handleScriptToggle = () => setScriptEnabled((prev) => !prev);
  const handleReset = () => {
    setHeadline(DEFAULT_PROMO_HEADLINE);
    setSubline(DEFAULT_PROMO_SUBLINE);
    setScript(DEFAULT_SCRIPT);
    setAccent(true);
    setPrimaryColor("#ffc300");
    setSecondaryColor("#ffffff");
    setFontSize(48);
    setTracking(5);
    setPosition("bottom");
    setVerticalOffset(8);
    setTextShadow(true);
    setScriptEnabled(true);
  };

  const overlayClass = accent ? "overlay-text accented" : "overlay-text";

  return (
    <main className="app-shell">
      <section className="hero">
        <h1>Promo Overlay Studio</h1>
        <p>
          Drag your campaign video, type bilingual headlines, and export a Black
          Friday friendly layout instantly.
        </p>
      </section>

      <section className="workspace">
        <aside className="panel">
          <h2>Creative Controls</h2>
          <div className="control-grid">
            <div className="control-group">
              <label htmlFor="video-upload">Campaign Video</label>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
              />
              <div className="timeline-preview">
                <span className="timeline-tag">1. Upload</span>
                <span className="timeline-tag">2. Style</span>
                <span className="timeline-tag">3. Deliver</span>
              </div>
            </div>

            <div className="control-group">
              <label htmlFor="headline">Headline Overlay</label>
              <textarea
                id="headline"
                rows={2}
                value={headline}
                onChange={(event) => setHeadline(event.target.value.toUpperCase())}
              />
            </div>

            <div className="control-group">
              <label htmlFor="subline">Subline</label>
              <textarea
                id="subline"
                rows={2}
                value={subline}
                onChange={(event) => setSubline(event.target.value)}
              />
            </div>

            <div className="control-group">
              <label htmlFor="script">Live Script (Original)</label>
              <textarea
                id="script"
                rows={4}
                value={script}
                onChange={(event) => setScript(event.target.value)}
                disabled={!scriptEnabled}
                placeholder="Write your narration or Albanian/English script here..."
              />
              <div className="control-row">
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleScriptToggle}
                >
                  {scriptEnabled ? "Hide Script" : "Show Script"}
                </button>
                <button type="button" className="primary-button" onClick={handleAccentToggle}>
                  {accent ? "Use White Mode" : "Use Golden Mode"}
                </button>
              </div>
            </div>

            <div className="control-group">
              <label>Styling</label>
              <div className="control-row">
                <input
                  type="color"
                  title="Primary Accent"
                  value={primaryColor}
                  onChange={(event) => setPrimaryColor(event.target.value)}
                  disabled={!accent}
                />
                <input
                  type="color"
                  title="Secondary Color"
                  value={secondaryColor}
                  onChange={(event) => setSecondaryColor(event.target.value)}
                  disabled={accent}
                />
                <select
                  value={position}
                  onChange={(event) => setPosition(event.target.value as OverlayPosition)}
                >
                  {positions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="control-row">
                <input
                  type="number"
                  min={24}
                  max={96}
                  value={fontSize}
                  onChange={(event) =>
                    setFontSize(Number.parseInt(event.target.value, 10))
                  }
                />
                <input
                  type="number"
                  min={-10}
                  max={40}
                  value={tracking}
                  onChange={(event) =>
                    setTracking(Number.parseInt(event.target.value, 10))
                  }
                />
                <input
                  type="number"
                  min={0}
                  max={45}
                  value={verticalOffset}
                  onChange={(event) =>
                    setVerticalOffset(Number.parseInt(event.target.value, 10))
                  }
                />
              </div>
              <div className="control-row">
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => setTextShadow((prev) => !prev)}
                >
                  {textShadow ? "Disable Shadow" : "Enable Shadow"}
                </button>
                <button type="button" className="primary-button" onClick={handleReset}>
                  Reset Styling
                </button>
              </div>
            </div>
          </div>
        </aside>

        <section className="panel">
          <h2>Live Preview</h2>
          <div
            className="video-stage"
            style={
              accent
                ? { boxShadow: `0 0 45px ${primaryColor}40`, borderColor: `${primaryColor}33` }
                : undefined
            }
          >
            <video
              ref={videoRef}
              src={videoSrc}
              controls
              playsInline
              preload="auto"
              loop
              style={
                accent
                  ? { outline: `1px solid ${primaryColor}55`, background: "#000" }
                  : undefined
              }
            />
            <div
              className={overlayClass}
              style={{
                ...overlayStyle,
                background: accent
                  ? `linear-gradient(135deg, ${primaryColor}f2, ${primaryColor}d8)`
                  : "rgba(0,0,0,0.35)"
              }}
            >
              <span>{headline}</span>
              <span style={sublineStyle}>{subline}</span>
            </div>
          </div>
          {scriptEnabled && (
            <article
              style={{
                marginTop: "24px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.05)",
                padding: "20px",
                lineHeight: 1.6,
                fontSize: "15px",
                letterSpacing: "0.02em",
                color: "rgba(255,255,255,0.82)"
              }}
            >
              {script}
            </article>
          )}
        </section>
      </section>

      <footer className="footer">
        Crafted for Black Friday & 28 Nëntori campaigns · Tailor labels, logos &
        storytelling on-brand.
      </footer>
    </main>
  );
}
