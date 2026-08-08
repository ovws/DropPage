"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

type TileId = "framework" | "voice" | "logo" | "type" | "icon" | "colour" | "imagery" | "motion";
type Tile = { id: TileId; label: string; href?: string; className: string; drift: [number, number]; mobileDrift: [number, number] };

/* The exact eight-tile ordering and movement vectors used by brand.dropbox.com. */
const tiles: Tile[] = [
  { id: "framework", label: "About", className: "strategy", drift: [4, 2], mobileDrift: [2, 3] },
  { id: "voice", label: "Writing", href: "https://home.mugou.pro/", className: "voice-tone", drift: [-0.1, 1], mobileDrift: [-2, 3] },
  { id: "logo", label: "GitHub", href: "https://github.com/ovws", className: "logo", drift: [-1, -0.1], mobileDrift: [0.25, 1.5] },
  { id: "type", label: "Blog", href: "https://blog.loser.dev/", className: "typography", drift: [-4, 2], mobileDrift: [-1.5, 0.25] },
  { id: "icon", label: "Tools", href: "https://so.loser.dev/", className: "iconography", drift: [4, -2], mobileDrift: [1.5, -0.25] },
  { id: "colour", label: "Loser.dev", href: "https://www.loser.dev/", className: "color", drift: [1, 0.1], mobileDrift: [-0.25, -1.5] },
  { id: "imagery", label: "Projects", href: "https://ovws.github.io/Gallery-Yan", className: "imagery", drift: [0.1, -1], mobileDrift: [2, -3] },
  { id: "motion", label: "Links", href: "https://linktr.ee/qiws", className: "motion", drift: [-4, -2], mobileDrift: [-2, -3] },
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

function OvwsMark({ className = "" }: { className?: string }) {
  return <img className={`ovws-mark ${className}`} alt="" aria-hidden="true" src="/ovws-mark.png" />;
}

function TileVisual({ id }: { id: TileId }) {
  if (id === "framework") return <span className="tile-visual strategy-visual" aria-hidden="true">
    <span className="strategy-visual-square">
      <svg className="strategy-point point-one" viewBox="-2 -2 20 20"><path d="M0 8C0 5.19974 0 3.79961 .544967 2.73005C1.02433 1.78924 1.78924 1.02433 2.73005 .544967C3.79961 0 5.19974 0 8 0C10.8003 0 12.2004 0 13.27 .544967C14.2108 1.02433 14.9757 1.78924 15.455 2.73005C16 3.79961 16 5.19974 16 8C16 10.8003 16 12.2004 15.455 13.27C14.9757 14.2108 14.2108 14.9757 13.27 15.455C12.2004 16 10.8003 16 8 16C5.19974 16 3.79961 16 2.73005 15.455C1.78924 14.9757 1.02433 14.2108 .544967 13.27C0 12.2004 0 10.8003 0 8Z" /></svg>
      <svg className="strategy-point point-two" viewBox="-2 -2 20 20"><path d="M0 8C0 5.19974 0 3.79961 .544967 2.73005C1.02433 1.78924 1.78924 1.02433 2.73005 .544967C3.79961 0 5.19974 0 8 0C10.8003 0 12.2004 0 13.27 .544967C14.2108 1.02433 14.9757 1.78924 15.455 2.73005C16 3.79961 16 5.19974 16 8C16 10.8003 16 12.2004 15.455 13.27C14.9757 14.2108 14.2108 14.9757 13.27 15.455C12.2004 16 10.8003 16 8 16C5.19974 16 3.79961 16 2.73005 15.455C1.78924 14.9757 1.02433 14.2108 .544967 13.27C0 12.2004 0 10.8003 0 8Z" /></svg>
      <svg className="strategy-point point-three" viewBox="-2 -2 20 20"><path d="M0 8C0 5.19974 0 3.79961 .544967 2.73005C1.02433 1.78924 1.78924 1.02433 2.73005 .544967C3.79961 0 5.19974 0 8 0C10.8003 0 12.2004 0 13.27 .544967C14.2108 1.02433 14.9757 1.78924 15.455 2.73005C16 3.79961 16 5.19974 16 8C16 10.8003 16 12.2004 15.455 13.27C14.9757 14.2108 14.2108 14.9757 13.27 15.455C12.2004 16 10.8003 16 8 16C5.19974 16 3.79961 16 2.73005 15.455C1.78924 14.9757 1.02433 14.2108 .544967 13.27C0 12.2004 0 10.8003 0 8Z" /></svg>
      <span className="strategy-bezier"><span className="strategy-bezier-embed"><svg className="strategy-bezier-path" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 25Q31.25 32.8125 62.5 40.625Q93.75 48.4375 100 50C70 57.5 80 55 50 62.5C20 70 30 67.5 0 75" /></svg></span></span>
      <span className="strategy-sketch strategy-sketch-one"><svg className="strategy-sketch-path" viewBox="0 0 230 134" preserveAspectRatio="none"><path d="M10 25.9355C18.5 21.266 20.8707 19.9053 29.968 16.173C42.5012 11.0312 56.0106 11.8857 69.3085 11.8857C86.1833 11.8857 104.199 14.8053 117.944 25.6051C126.871 32.619 132.508 39.5429 134.476 51.0204C136.056 60.2398 138.357 71.0643 134.819 80.1056C132.69 85.546 126.533 90.478 121.5 90.9355C115.296 91.4995 108.734 92.337 105 85.9355C100.933 78.9636 106.721 68.6751 112.5 64.9355C120.248 59.9219 128.67 55.4355 137.5 55.4355C152.272 55.4355 167.625 66.3328 179.5 75.8325C189.5 83.8325 194.985 91.3048 197.5 95.8325C200 100.333 201.66 101.419 204.5 111.833C205.182 114.333 207.5 122.833 207.712 124.248C207.712 124.408 203.344 121.813 201.66 120.425C199.399 118.562 197.5 117.826 195.5 116.833C193.472 115.826 190 112.833 188 112.333C187.156 112.122 202 120.833 208 123.833C209.5 121.833 210.5 119.833 212.5 116.833C213.677 115.067 217 110.833 220 107.833" /></svg></span>
      <span className="strategy-sketch strategy-sketch-two"><svg className="strategy-sketch-path" viewBox="0 0 230 134" preserveAspectRatio="none"><path d="M219.36 17.1993C219.006 16.4914 214.909 15.59 213.801 15.5317C209.624 15.3118 205.295 14.1842 201.108 13.5861C189.734 11.9612 177.606 12.3757 166.18 13.1846C155.481 13.9421 144.868 14.4116 134.309 16.6743C121.742 19.3673 109.21 24.1555 97.3736 29.1818C90.7444 31.9969 83.7225 34.8108 77.6088 38.6318C73.0482 41.4822 69.1444 45.2812 65.0087 48.6995C43.6854 66.3239 27.3717 93.2898 25.3555 121.15C24.2391 118.308 21.4909 116.548 19.8259 114.033C18.5433 112.095 16.993 110.261 15.4726 108.507C14.57 107.465 13.9753 106.314 12.9878 105.326C12.2757 104.614 11.3185 103.936 11 102.98L25.6881 121.15C32 114.5 35 113 38.5 111C42 109 44.5 105.5 46 105" /></svg></span>
    </span>
  </span>;
  if (id === "voice") return <span className="tile-visual quote-visual" aria-hidden="true"><i>“</i><i>”</i></span>;
  if (id === "logo") return <span className="tile-visual logo-visual" aria-hidden="true"><OvwsMark /></span>;
  if (id === "type") return <span className="tile-visual type-visual" aria-hidden="true"><i>A</i><b>a</b></span>;
  if (id === "icon") return <span className="tile-visual lock-visual" aria-hidden="true"><svg viewBox="0 0 102 142"><g className="lock-shackle"><path d="M28 60V39c0-19 8.6-29 23-29s23 10 23 29v21" fill="none" stroke="currentColor" strokeWidth="13" /></g><path className="lock-body" d="M10 54h82c6 0 10 4 10 10v47c0 10-3 18-8.5 23.5C88 140 81 142 70 142H32c-11 0-18-2-24-7.5C2.5 129 0 121 0 111V64c0-6 4-10 10-10Z" /><path className="lock-keyhole" d="M44.5 116h13v-15.3c5.6-2.3 9-7.4 9-13.1 0-8.7-6.9-15.6-15.5-15.6S35.5 79 35.5 87.6c0 5.7 3.5 10.8 9 13.1V116Z" /></svg></span>;
  if (id === "colour") return <span className="tile-visual colour-visual" aria-hidden="true"><i><b /></i><i><b /></i></span>;
  if (id === "imagery") return <span className="tile-visual imagery-visual" aria-hidden="true"><span className="picture"><svg className="hills" viewBox="0 0 250 150"><path d="M39 64.6C16.4 64.6 0 83.9 0 83.9V150H250V34.3S229 0 202.6 0c-47.6 0-66.2 87.9-102.6 87.9-23 0-36-23.3-61-23.3Z" /></svg><span className="sun-moon"><svg className="sun" viewBox="-2 -2 44 44"><circle cx="20" cy="20" r="20" /></svg><svg className="moon" viewBox="-2 -2 44 44"><path d="M37.789 27.858C37.789 27.858 25.448 32.757 15.62 22.52 5.793 12.282 11.374.765 11.374.765A20.1 20.1 0 0 0 6.034 4.574c-7.75 7.75-7.727 20.34.052 28.12 7.78 7.78 20.37 7.803 28.12.052a20.07 20.07 0 0 0 3.583-4.888Z" /></svg></span></span></span>;
  return <span className="tile-visual motion-visual" aria-hidden="true"><svg className="motion-face" viewBox="0 0 160 160"><g className="mood-eyes mood-rest-eyes"><path d="M42 68H66" /><path d="M94 68H118" /></g><g className="mood-eyes mood-open-eyes"><path d="M40 64H68" /><path d="M92 64H120" /></g><path className="mood-mouth mood-frown" d="M34 115C58 94 102 94 126 115" /><path className="mood-mouth mood-smile" d="M34 105C58 135 102 135 126 105" /></svg></span>;
}

export default function Home() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const tileRefs = useRef(new Map<TileId, HTMLElement>());
  const gridRefs = useRef(new Map<TileId, HTMLDivElement>());
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const initialCopyRef = useRef<HTMLDivElement>(null);
  const blueCopyRef = useRef<HTMLDivElement>(null);
  const chevronsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!aboutOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAboutOpen(false);
    };
    addEventListener("keydown", closeOnEscape);
    return () => removeEventListener("keydown", closeOnEscape);
  }, [aboutOpen]);

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
      const buttonSize = window.innerWidth <= 991 ? 70 : 90;
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
          {tiles.map((tile, index) => tile.id === "framework" ? (
            <button aria-expanded={aboutOpen} aria-haspopup="dialog" className={`nav-tile nav-tile-${index + 1} tile tile-button ${tile.className}`} key={tile.id} onClick={() => setAboutOpen(true)} ref={(node) => { if (node) tileRefs.current.set(tile.id, node); else tileRefs.current.delete(tile.id); }} type="button">
              <span className="tile-title">{tile.label}</span><TileVisual id={tile.id} />
            </button>
          ) : (
            <a className={`nav-tile nav-tile-${index + 1} tile ${tile.className}`} href={tile.href} key={tile.id} ref={(node) => { if (node) tileRefs.current.set(tile.id, node); else tileRefs.current.delete(tile.id); }} rel="noreferrer" target="_blank"><span className="tile-title">{tile.label}</span><TileVisual id={tile.id} /></a>
          ))}
          <div className="grid-layer" aria-hidden="true">{tiles.map((tile, index) => <div className={`nav-tile nav-tile-${index + 1} grid-tile`} key={tile.id} ref={(node) => { if (node) gridRefs.current.set(tile.id, node); else gridRefs.current.delete(tile.id); }} />)}</div>
        </nav>
        <div className="menu-card" ref={menuRef}>
          <div className="menu-copy initial-copy" ref={initialCopyRef}><span>文山木公 / QI WENSONG</span><h1>我把喜欢的事，<br />做成自己的工具。</h1><p>好奇、耐心，也有一点较真；喜欢把日常的麻烦，做成顺手的小工具。</p></div>
          <div className="menu-copy blue-copy" ref={blueCopyRef}><h2>从云端架构到个人工具，<br />一直做点有用的东西。</h2></div>
          <OvwsMark className="center-menu-mark" />
        </div>
        <span className="site-credit">QI WENSONG / DROP PAGE / 2026</span>
        <span className="site-chevrons" aria-hidden="true" ref={chevronsRef}><i /><i /></span>
        <div aria-hidden={!aboutOpen} className={`about-panel${aboutOpen ? " is-open" : ""}`}>
          <button aria-label="关闭个人简介" className="about-backdrop" onClick={() => setAboutOpen(false)} tabIndex={aboutOpen ? 0 : -1} type="button" />
          <aside aria-labelledby="about-title" aria-modal="true" className="about-sheet" role="dialog">
            <button aria-label="关闭个人简介" className="about-close" onClick={() => setAboutOpen(false)} tabIndex={aboutOpen ? 0 : -1} type="button">×</button>
            <span className="about-kicker">ABOUT / 01</span>
            <h2 id="about-title">文山木公<br />QI WENSONG</h2>
            <p>做云端基础设施与平台架构，也把日常的麻烦做成顺手的小工具。</p>
            <dl className="about-details">
              <div><dt>工作</dt><dd>云端基础设施与平台架构</dd></div>
              <div><dt>邮箱</dt><dd><a href="mailto:work@qiwensong.com">work@qiwensong.com</a></dd></div>
              <div><dt>联系</dt><dd><a href="https://linktr.ee/qiws" rel="noreferrer" target="_blank">linktr.ee/qiws ↗</a></dd></div>
              <div><dt>GitHub</dt><dd><a href="https://github.com/ovws" rel="noreferrer" target="_blank">github.com/ovws ↗</a></dd></div>
              <div><dt>X / Twitter</dt><dd><a href="https://x.com/wensqi" rel="noreferrer" target="_blank">@wensqi ↗</a></dd></div>
              <div><dt>YouTube</dt><dd><span>频道整理中</span></dd></div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  </main>;
}
