"use client";

import { useLayoutEffect, useRef, useState } from "react";

type Frame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type TileId = "about" | "thought" | "ovws" | "blog" | "tools" | "services" | "gallery" | "now";

type Tile = {
  id: TileId;
  title: string;
  detail: string;
  href: string;
  tone: string;
  visual: "nodes" | "quote" | "monogram" | "type" | "lock" | "blocks" | "imagery" | "motion";
  initial: Frame;
  radius?: string;
};

const tiles: Tile[] = [
  {
    id: "about",
    title: "文山木公",
    detail: "好奇、耐心，也有一点较真；喜欢把喜欢的事做成工具，在云与开源里长期折腾。",
    href: "#profile",
    tone: "navy",
    visual: "nodes",
    initial: { x: -2.05, y: -1.89, width: 0.371, height: 1.075 },
    radius: "8px 0 0 0",
  },
  {
    id: "thought",
    title: "Thought",
    detail: "無法改變現狀，那就享受當下。",
    href: "https://ink.loser.dev/",
    tone: "yellow",
    visual: "quote",
    initial: { x: -0.087, y: -1.1, width: 0.666, height: 0.861 },
  },
  {
    id: "ovws",
    title: "OVWS",
    detail: "一个可持续折腾的个人系统。",
    href: "https://www.qiwensong.com/",
    tone: "cyan",
    visual: "monogram",
    initial: { x: 1.007, y: -0.458, width: 0.519, height: 1.075 },
  },
  {
    id: "blog",
    title: "Blog",
    detail: "鏡花水月：文字与实验。",
    href: "https://blog.loser.dev/",
    tone: "orange-red",
    visual: "type",
    initial: { x: 2.675, y: -1.78, width: 0.371, height: 0.861 },
    radius: "0 8px 0 0",
  },
  {
    id: "tools",
    title: "Tools",
    detail: "检索、图床、临时邮箱与更多小工具。",
    href: "https://so.loser.dev/",
    tone: "lime",
    visual: "lock",
    initial: { x: -2.05, y: 1.919, width: 0.371, height: 0.861 },
    radius: "0 0 0 8px",
  },
  {
    id: "services",
    title: "Services",
    detail: "有的实用，有的纯好玩。",
    href: "https://www.loser.dev/",
    tone: "orange",
    visual: "blocks",
    initial: { x: -0.526, y: 0.384, width: 0.519, height: 1.075 },
  },
  {
    id: "gallery",
    title: "Gallery",
    detail: "图像、片段与随手留下的视觉实验。",
    href: "https://ovws.github.io/",
    tone: "plum",
    visual: "imagery",
    initial: { x: 0.42, y: 1.239, width: 0.666, height: 0.861 },
  },
  {
    id: "now",
    title: "Now",
    detail: "云计算、开源、自托管，还有一点不肯停下来的好奇。",
    href: "https://linktr.ee/qiws",
    tone: "lilac",
    visual: "motion",
    initial: { x: 2.675, y: 1.812, width: 0.371, height: 1.075 },
    radius: "0 0 8px 0",
  },
];

const links = [
  ["blog.loser.dev", "https://blog.loser.dev/"],
  ["pb.loser.dev", "https://pb.loser.dev/"],
  ["mail.loser.dev", "https://mail.loser.dev/"],
  ["ink.loser.dev", "https://ink.loser.dev/"],
  ["raw.loser.dev", "https://raw.loser.dev/"],
  ["chat.loser.dev", "https://chat.loser.dev/"],
] as const;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(value: number) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function centerScale(progress: number, baseSize: number, finalSize: number) {
  if (progress <= 0.43) {
    return lerp(finalSize / baseSize, 0.62, smoothstep(progress / 0.43));
  }
  return lerp(0.62, 1, smoothstep((progress - 0.43) / 0.57));
}

function createFinalLayout(width: number, height: number) {
  const finalSize = width <= 991 ? 64 : 90;
  const gap = width <= 991 ? 5 : 10;
  const margin = gap;
  const side = Math.max(1, width * 0.2 - gap * 2);
  const middle = Math.max(1, (width - margin * 2 - gap * 4 - finalSize - side * 2) / 2);
  const shortHeight = Math.max(1, (height - margin * 2 - gap * 2 - finalSize) / 2);
  const tallHeight = shortHeight + gap + finalSize;

  const x0 = margin;
  const x1 = x0 + side + gap;
  const x2 = x1 + middle + gap;
  const x3 = x2 + finalSize + gap;
  const x4 = x3 + middle + gap;
  const y0 = margin;
  const y1 = y0 + shortHeight + gap;
  const y2 = y1 + finalSize + gap;

  const frames: Record<TileId, Frame> = {
    about: { x: x0, y: y0, width: side, height: tallHeight },
    thought: { x: x1, y: y0, width: middle + gap + finalSize, height: shortHeight },
    ovws: { x: x3, y: y0, width: middle, height: tallHeight },
    blog: { x: x4, y: y0, width: side, height: shortHeight },
    tools: { x: x0, y: y2, width: side, height: shortHeight },
    services: { x: x1, y: y1, width: middle, height: tallHeight },
    gallery: { x: x2, y: y2, width: finalSize + gap + middle, height: shortHeight },
    now: { x: x4, y: y1, width: side, height: tallHeight },
  };

  return { finalSize, gap, frames };
}

function maximumCenterSize(width: number, height: number, frames: Frame[], gap: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  let maximumHalfSize = Number.POSITIVE_INFINITY;

  frames.forEach((frame) => {
    const horizontalClearance = frame.x >= centerX
      ? frame.x - centerX - gap
      : frame.x + frame.width <= centerX
        ? centerX - (frame.x + frame.width) - gap
        : Number.NEGATIVE_INFINITY;
    const verticalClearance = frame.y >= centerY
      ? frame.y - centerY - gap
      : frame.y + frame.height <= centerY
        ? centerY - (frame.y + frame.height) - gap
        : Number.NEGATIVE_INFINITY;

    maximumHalfSize = Math.min(maximumHalfSize, Math.max(horizontalClearance, verticalClearance));
  });

  return Number.isFinite(maximumHalfSize) ? Math.max(0, maximumHalfSize * 2) : Number.POSITIVE_INFINITY;
}

function TileVisual({ type }: { type: Tile["visual"] }) {
  switch (type) {
    case "nodes":
      return (
        <span className="tile-visual visual-nodes" aria-hidden="true">
          <svg viewBox="0 0 200 210">
            <path className="nodes-link" d="M18 44L164 105 18 166" />
            <rect className="nodes-start" x="6" y="33" width="22" height="22" rx="6" />
            <rect className="nodes-end" x="6" y="155" width="22" height="22" rx="6" />
            <rect className="nodes-center" x="153" y="94" width="22" height="22" rx="6" />
          </svg>
        </span>
      );
    case "quote":
      return <span className="tile-visual visual-quote" aria-hidden="true"><i>“</i><i>”</i></span>;
    case "monogram":
      return <span className="tile-visual visual-monogram" aria-hidden="true"><i>OV</i><i>WS</i></span>;
    case "type":
      return <span className="tile-visual visual-type" aria-hidden="true"><i>A</i><span>a</span></span>;
    case "lock":
      return <span className="tile-visual visual-lock" aria-hidden="true"><i /><b /></span>;
    case "blocks":
      return <span className="tile-visual visual-blocks" aria-hidden="true"><i /><i /></span>;
    case "imagery":
      return (
        <span className="tile-visual visual-imagery" aria-hidden="true">
          <span className="imagery-picture">
            <svg className="imagery-landscape" viewBox="0 0 300 180" preserveAspectRatio="none">
              <circle className="imagery-sun" cx="150" cy="48" r="17" />
              <path className="imagery-horizon" d="M0 131C39 105 70 123 105 143C151 170 186 106 232 81C259 65 282 73 300 95V180H0Z" />
              <path className="imagery-front" d="M0 150C45 132 87 145 126 159C171 176 215 142 255 127C275 119 289 119 300 123V180H0Z" />
            </svg>
          </span>
        </span>
      );
    case "motion":
      return (
        <span className="tile-visual visual-motion" aria-hidden="true">
          <i className="motion-node motion-node-start" /><i className="motion-node motion-node-start-handle" />
          <i className="motion-node motion-node-end" /><i className="motion-node motion-node-end-handle" />
          <b className="motion-tangent motion-tangent-start" /><b className="motion-tangent motion-tangent-end" />
          <svg viewBox="0 0 200 230">
            <path className="motion-path-rest" d="M10 214C62 214 100 22 190 18" />
            <path className="motion-path-active" d="M10 214C70 214 108 50 190 18" />
          </svg>
        </span>
      );
  }
}

export default function Home() {
  const [profileOpen, setProfileOpen] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef(new Map<TileId, HTMLAnchorElement>());
  const centerRef = useRef<HTMLDivElement>(null);
  const identityRef = useRef<HTMLSpanElement>(null);
  const introRef = useRef<HTMLSpanElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    let animationFrame = 0;
    let previousWidth = 0;
    let previousHeight = 0;

    const updateScene = () => {
      animationFrame = 0;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - height;
      const progress = maxScroll > 0 ? clamp(window.scrollY / maxScroll) : 0;
      const amount = smoothstep(progress);
      const layout = createFinalLayout(width, height);
      const dimensionsChanged = width !== previousWidth || height !== previousHeight;
      const movingFrames: Frame[] = [];

      tiles.forEach((tile) => {
        const element = tileRefs.current.get(tile.id);
        if (!element) return;

        const finalFrame = layout.frames[tile.id];
        const currentFrame: Frame = {
          x: lerp(finalFrame.x, tile.initial.x * width, amount),
          y: lerp(finalFrame.y, tile.initial.y * height, amount),
          width: lerp(finalFrame.width, tile.initial.width * width, amount),
          height: lerp(finalFrame.height, tile.initial.height * height, amount),
        };
        movingFrames.push(currentFrame);

        if (dimensionsChanged) {
          element.style.width = `${finalFrame.width}px`;
          element.style.height = `${finalFrame.height}px`;
          element.style.borderRadius = tile.radius ?? "0";
        }

        element.style.transform = `translate3d(${currentFrame.x.toFixed(3)}px, ${currentFrame.y.toFixed(3)}px, 0) scale3d(${(currentFrame.width / finalFrame.width).toFixed(5)}, ${(currentFrame.height / finalFrame.height).toFixed(5)}, 1)`;
        element.style.pointerEvents = progress < 0.15 ? "auto" : "none";
        const componentProgress = 1 - smoothstep(clamp((progress - 0.04) / 0.34));
        const componentOffset = (1 - componentProgress) * 28;
        const componentTilt = (1 - componentProgress) * 12;
        element.style.setProperty("--component-progress", componentProgress.toFixed(4));
        element.style.setProperty("--component-opacity", clamp((componentProgress - 0.08) / 0.92).toFixed(4));
        element.style.setProperty("--component-offset", `${componentOffset.toFixed(2)}px`);
        element.style.setProperty("--component-offset-negative", `${(-componentOffset).toFixed(2)}px`);
        element.style.setProperty("--component-offset-soft", `${(componentOffset * 0.46).toFixed(2)}px`);
        element.style.setProperty("--component-offset-far", `${(componentOffset * 1.18).toFixed(2)}px`);
        element.style.setProperty("--component-tilt", `${componentTilt.toFixed(2)}deg`);
        element.style.setProperty("--component-tilt-negative", `${(-componentTilt).toFixed(2)}deg`);
        element.style.setProperty("--component-tilt-soft", `${(componentTilt * 0.42).toFixed(2)}deg`);
        element.style.setProperty("--component-scale", `${(0.9 + componentProgress * 0.1).toFixed(4)}`);
        element.style.setProperty("--component-pop", componentProgress.toFixed(4));
        element.classList.toggle("is-arriving", componentProgress >= 0.03);
        element.classList.toggle("is-settled", progress <= 0.15);
      });

      const baseSize = Math.min(
        height * 0.852,
        width * (width <= 991 ? 0.84 : 0.586),
      );
      const plannedCenterSize = baseSize * centerScale(progress, baseSize, layout.finalSize);
      const safeCenterSize = maximumCenterSize(width, height, movingFrames, layout.gap);
      const centerSize = Math.max(layout.finalSize, Math.min(plannedCenterSize, safeCenterSize || layout.finalSize));
      const scale = centerSize / baseSize;
      const center = centerRef.current;

      if (center) {
        if (dimensionsChanged) {
          center.style.width = `${baseSize}px`;
          center.style.height = `${baseSize}px`;
        }

        center.style.transform = `translate3d(${((width - baseSize) / 2).toFixed(3)}px, ${((height - baseSize) / 2).toFixed(3)}px, 0) scale(${scale.toFixed(5)})`;
        center.style.opacity = "1";
        center.classList.add("is-blue");
        center.classList.remove("is-paper");
      }

      const contentProgress = smoothstep(clamp((progress - 0.56) / 0.32));
      const introOpacity = smoothstep(clamp((progress - 0.64) / 0.26));
      const markScale = lerp(1, 0.4, contentProgress);

      if (identityRef.current) {
        identityRef.current.style.opacity = `${contentProgress}`;
        identityRef.current.style.transform = `translateY(${lerp(18, 0, contentProgress)}px)`;
      }
      if (introRef.current) {
        introRef.current.style.opacity = `${introOpacity}`;
        introRef.current.style.transform = `translateY(${lerp(24, 0, introOpacity)}px)`;
      }
      if (markRef.current) {
        markRef.current.style.opacity = "1";
        markRef.current.style.transform = `scale(${markScale.toFixed(4)})`;
      }

      previousWidth = width;
      previousHeight = height;
      sceneRef.current?.classList.add("is-ready");
    };

    const scheduleUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateScene);
    };

    updateScene();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("orientationchange", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("orientationchange", scheduleUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <main className="drop-page">
      <section className="scroll-runway" aria-label="OVWS 个人主页">
        <div className="brand-scene" ref={sceneRef}>
          <div className="tile-field" aria-label="个人目录">
            {tiles.map((tile) => (
              <a
                className={`scene-tile tile-${tile.tone} tile-${tile.id}`}
                href={tile.href}
                key={tile.id}
                ref={(element) => {
                  if (element) tileRefs.current.set(tile.id, element);
                  else tileRefs.current.delete(tile.id);
                }}
                onClick={tile.href === "#profile" ? (event) => {
                  event.preventDefault();
                  setProfileOpen(true);
                } : undefined}
                rel={tile.href.startsWith("http") ? "noreferrer" : undefined}
                target={tile.href.startsWith("http") ? "_blank" : undefined}
              >
                <span className="tile-title">{tile.title}</span>
                <span className="tile-detail">{tile.detail} <b>↗</b></span>
                <TileVisual type={tile.visual} />
              </a>
            ))}
          </div>

          <div
            aria-label="OVWS 个人主页标识"
            className="center-tile is-blue"
            ref={centerRef}
            role="img"
          >
            <span className="center-identity" ref={identityRef}>
              <strong>文山木公</strong><em>QI WENSONG</em>
            </span>
            <span className="center-intro" ref={introRef}>
              从云计算到小工具，从笔记到自托管；这些片段组成了文山木公持续折腾的个人系统。
            </span>
            <span className="center-mark" ref={markRef}>
              OVWS<span>.</span>
            </span>
          </div>

          <button
            aria-label="关闭个人档案"
            className={`panel-scrim ${profileOpen ? "is-open" : ""}`}
            onClick={() => setProfileOpen(false)}
            type="button"
          />
          <aside aria-hidden={!profileOpen} className={`profile-panel ${profileOpen ? "is-open" : ""}`} id="profile">
            <div className="profile-panel-grid" aria-hidden="true" />
            <button className="panel-close" onClick={() => setProfileOpen(false)} type="button">关闭 ×</button>
            <div className="profile-body">
              <p className="panel-kicker">FILE / 001</p>
              <h1>文山木公<br /><span>QI WENSONG</span></h1>
              <p className="profile-lead">無法改變現狀，那就享受當下。</p>
              <p>我在云计算与开源折腾里留下笔记，也做一些真正能在日常里用上的小服务。容器、虚拟化、自托管、排障与碎碎念，都在这张个人目录里。</p>
              <div className="profile-links">
                {links.map(([label, href]) => (
                  <a href={href} key={label} rel="noreferrer" target="_blank">{label}<span>↗</span></a>
                ))}
              </div>
              <a className="panel-main-link" href="https://www.qiwensong.com/" rel="noreferrer" target="_blank">访问原始个人主页 <span>↗</span></a>
            </div>
            <p className="panel-credit">ENJOY THE MOMENT<br />BUILD YOUR OWN TOOLS</p>
          </aside>
        </div>
      </section>
    </main>
  );
}
