"use client";

import { useLayoutEffect, useRef } from "react";

type TileId = "framework" | "voice" | "logo" | "type" | "icon" | "colour" | "imagery" | "motion";
type Tile = { id: TileId; label: string; href: string; className: string; drift: [number, number]; mobileDrift: [number, number] };

/* The exact eight-tile ordering and movement vectors used by brand.dropbox.com. */
const tiles: Tile[] = [
  { id: "framework", label: "Framework", href: "https://www.qiwensong.com/", className: "strategy", drift: [4, 2], mobileDrift: [2, 3] },
  { id: "voice", label: "Voice & Tone", href: "https://ink.loser.dev/", className: "voice-tone", drift: [-0.1, 1], mobileDrift: [-2, 3] },
  { id: "logo", label: "Logo", href: "https://github.com/ovws", className: "logo", drift: [-1, -0.1], mobileDrift: [0.25, 1.5] },
  { id: "type", label: "Typography", href: "https://blog.loser.dev/", className: "typography", drift: [-4, 2], mobileDrift: [-1.5, 0.25] },
  { id: "icon", label: "Iconography", href: "https://so.loser.dev/", className: "iconography", drift: [4, -2], mobileDrift: [1.5, -0.25] },
  { id: "colour", label: "Color", href: "https://www.loser.dev/", className: "color", drift: [1, 0.1], mobileDrift: [-0.25, -1.5] },
  { id: "imagery", label: "Imagery", href: "https://ovws.github.io/", className: "imagery", drift: [0.1, -1], mobileDrift: [2, -3] },
  { id: "motion", label: "Motion", href: "https://linktr.ee/qiws", className: "motion", drift: [-4, -2], mobileDrift: [-2, -3] },
];

function clamp(value: number) { return Math.min(1, Math.max(0, value)); }

function calcBezier(t: number, a1: number, a2: number) {
  return (((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t + 3 * a1) * t;
}

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  return (x: number) => {
    if (x === 0 || x === 1) return x;
    let lower = 0;
    let upper = 1;
    for (let index = 0; index < 14; index += 1) {
      const middle = (lower + upper) / 2;
      if (calcBezier(middle, x1, x2) > x) upper = middle;
      else lower = middle;
    }
    return calcBezier((lower + upper) / 2, y1, y2);
  };
}

const ease = cubicBezier(1, 0.25, 0.85, 1);

function DropboxMark({ className = "" }: { className?: string }) {
  return <svg className={`dropbox-mark ${className}`} aria-hidden="true" viewBox="0 0 64 54">
    <path d="M16 0 32 10 16 20 0 10 16 0Zm32 0 16 10-16 10-16-10L48 0ZM16 22l16 10-16 10L0 32l16-10Zm32 0 16 10-16 10-16-10 16-10ZM32 34l16 10-16 10-16-10 16-10Z" />
  </svg>;
}

function TileVisual({ id }: { id: TileId }) {
  if (id === "framework") return <span className="tile-visual strategy-visual" aria-hidden="true"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 25Q31.25 32.8 62.5 40.6Q93.75 48.4 100 50C70 57.5 80 55 50 62.5C20 70 30 67.5 0 75" /></svg><i className="dot one" /><i className="dot two" /><i className="dot three" /></span>;
  if (id === "voice") return <span className="tile-visual quote-visual" aria-hidden="true"><i>“</i><i>”</i></span>;
  if (id === "logo") return <span className="tile-visual logo-visual" aria-hidden="true"><DropboxMark /></span>;
  if (id === "type") return <span className="tile-visual type-visual" aria-hidden="true"><i>A</i><b>a</b></span>;
  if (id === "icon") return <span className="tile-visual lock-visual" aria-hidden="true"><svg viewBox="0 0 102 142"><g className="lock-shackle"><path d="M28 60V39c0-19 8.6-29 23-29s23 10 23 29v21" fill="none" stroke="currentColor" strokeWidth="13" /></g><path className="lock-body" d="M10 54h82c6 0 10 4 10 10v47c0 10-3 18-8.5 23.5C88 140 81 142 70 142H32c-11 0-18-2-24-7.5C2.5 129 0 121 0 111V64c0-6 4-10 10-10Z" /><path className="lock-keyhole" d="M44.5 116h13v-15.3c5.6-2.3 9-7.4 9-13.1 0-8.7-6.9-15.6-15.5-15.6S35.5 79 35.5 87.6c0 5.7 3.5 10.8 9 13.1V116Z" /></svg></span>;
  if (id === "colour") return <span className="tile-visual colour-visual" aria-hidden="true"><i><b /></i><i><b /></i></span>;
  if (id === "imagery") return <span className="tile-visual imagery-visual" aria-hidden="true"><span className="picture"><svg className="hills" viewBox="0 0 250 150" preserveAspectRatio="none"><path d="M39 64.6C16.4 64.6 0 83.9 0 83.9V150H250V34.3S229 0 202.6 0c-47.6 0-66.2 87.9-102.6 87.9-23 0-36-23.3-61-23.3Z" /></svg><span className="sun-moon"><i /><b /></span></span></span>;
  return <span className="tile-visual motion-visual" aria-hidden="true"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 75C30 75 60 25 100 25" /></svg><i className="point one" /><i className="point two" /><i className="point three" /><i className="point four" /><b className="tangent one" /><b className="tangent two" /></span>;
}

export default function Home() {
  const tileRefs = useRef(new Map<TileId, HTMLAnchorElement>());
  const gridRefs = useRef(new Map<TileId, HTMLDivElement>());
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const initialCopyRef = useRef<HTMLDivElement>(null);
  const blueCopyRef = useRef<HTMLDivElement>(null);
  const chevronsRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    let frame = 0;
    let baseWindowSize = 0;
    const mix = (from: number, to: number, amount: number) => Math.round(from + (to - from) * amount);
    const smoothstep = (value: number) => value * value * (3 - 2 * value);

    const draw = () => {
      frame = 0;
      baseWindowSize = Math.max(window.innerWidth, window.innerHeight);
      const rawProgress = clamp(window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
      const progress = ease(rawProgress);
      const scale = 2 - progress;
      const fwd = progress - 1;
      const bwd = 1 - progress;
      const highestTileYeet = (baseWindowSize - 90) / 4;
      const movement = window.innerWidth <= 991 ? "mobileDrift" : "drift";

      tiles.forEach((tile) => {
        const [x, y] = tile[movement];
        const tx = (x > 0 ? fwd : bwd) * Math.abs(x * highestTileYeet);
        const ty = (y > 0 ? fwd : bwd) * Math.abs(y * highestTileYeet);
        const transform = `scale(${scale}) translate(${tx}px, ${ty}px)`;
        const tileElement = tileRefs.current.get(tile.id);
        const gridElement = gridRefs.current.get(tile.id);
        if (tileElement) {
          tileElement.style.transform = transform;
          tileElement.style.pointerEvents = progress > .95 ? "auto" : "none";
        }
        if (gridElement) gridElement.style.transform = transform;
      });

      const menu = menuRef.current;
      const initialCopy = initialCopyRef.current;
      const blueCopy = blueCopyRef.current;
      if (!menu || !initialCopy || !blueCopy) return;
      const secondBreakpoint = .05 + baseWindowSize / 5000;
      const inset = window.innerWidth <= 991 ? 32 : 64;
      const availableSize = Math.max(0, Math.min(window.innerWidth, window.innerHeight) - inset);
      const initialSize = Math.min(800, availableSize);
      const blueSize = Math.min(500, availableSize);
      const buttonSize = window.innerWidth <= 991 ? 70 : 102;
      const introProgress = smoothstep(clamp(progress / secondBreakpoint));
      const shrinkProgress = clamp((progress - secondBreakpoint) / Math.max(.001, 1 - secondBreakpoint));
      const copyFade = smoothstep(clamp(shrinkProgress / .08));

      let size = initialSize;
      let background = "rgb(255, 255, 255)";
      let color = "rgb(0, 97, 254)";
      let initialOpacity = 1;
      let blueOpacity = 0;

      if (progress < secondBreakpoint) {
        size = mix(initialSize, blueSize, introProgress);
        background = `rgb(${mix(255, 0, introProgress)}, ${mix(255, 97, introProgress)}, ${mix(255, 254, introProgress)})`;
        color = `rgb(${mix(0, 255, introProgress)}, ${mix(97, 255, introProgress)}, ${mix(254, 255, introProgress)})`;
        initialOpacity = 1 - introProgress;
        blueOpacity = introProgress;
      } else {
        size = mix(blueSize, buttonSize, shrinkProgress);
        background = "rgb(0, 97, 254)";
        color = "rgb(255, 255, 255)";
        initialOpacity = 0;
        blueOpacity = 1 - copyFade;
      }

      menu.style.transition = "none";
      menu.style.width = `${size}px`;
      menu.style.height = `${size}px`;
      menu.style.background = background;
      menu.style.color = color;
      initialCopy.style.opacity = `${initialOpacity}`;
      blueCopy.style.opacity = `${blueOpacity}`;
      initialCopy.style.transform = `scale(${1 - introProgress * .035})`;
      blueCopy.style.transform = `translateY(${(1 - introProgress) * 10 - copyFade * 6}px) scale(${1 - copyFade * .08})`;
      if (chevronsRef.current) chevronsRef.current.style.opacity = `${1 - introProgress}`;
      navRef.current?.classList.add("is-live");
    };

    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    draw();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => { removeEventListener("scroll", schedule); removeEventListener("resize", schedule); if (frame) cancelAnimationFrame(frame); };
  }, []);

  return <main className="drop-page">
    <section className="home" aria-label="文山木公的个人主页">
      <div className="nav-container">
        <nav className="nav" aria-label="个人目录" ref={navRef}>
          {tiles.map((tile, index) => <a className={`nav-tile nav-tile-${index + 1} tile ${tile.className}`} href={tile.href} key={tile.id} ref={(node) => { if (node) tileRefs.current.set(tile.id, node); else tileRefs.current.delete(tile.id); }} rel="noreferrer" target="_blank"><span className="tile-title">{tile.label}</span><TileVisual id={tile.id} /></a>)}
          <div className="grid-layer" aria-hidden="true">{tiles.map((tile, index) => <div className={`nav-tile nav-tile-${index + 1} grid-tile`} key={tile.id} ref={(node) => { if (node) gridRefs.current.set(tile.id, node); else gridRefs.current.delete(tile.id); }} />)}</div>
        </nav>
        <div className="menu-card" ref={menuRef}>
          <div className="menu-copy initial-copy" ref={initialCopyRef}><span>文山木公 / QI WENSONG</span><h1>我把喜欢的事，<br />做成自己的工具。</h1><p>好奇、耐心，也有一点较真；把好玩的东西做成可用工具，在云、开源与自托管里慢慢折腾。</p></div>
          <div className="menu-copy blue-copy" ref={blueCopyRef}><h2>从云计算到开源工具，<br />我把好奇心变成能用的日常。</h2></div>
          <DropboxMark className="center-menu-mark" />
        </div>
        <span className="site-credit">QI WENSONG / DROP PAGE / 2026</span>
        <span className="site-chevrons" aria-hidden="true" ref={chevronsRef}><i /><i /></span>
      </div>
    </section>
  </main>;
}
