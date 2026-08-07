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
  visual: "nodes" | "quote" | "monogram" | "type" | "terminal" | "blocks" | "landscape" | "curve";
  initial: Frame;
  radius?: string;
};

const tiles: Tile[] = [
  {
    id: "about",
    title: "About",
    detail: "文山木公 / Qi Wensong",
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
    visual: "terminal",
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
    detail: "Gallery-Yan 与随手留下的视觉实验。",
    href: "https://ovws.github.io/",
    tone: "plum",
    visual: "landscape",
    initial: { x: 0.42, y: 1.239, width: 0.666, height: 0.861 },
  },
  {
    id: "now",
    title: "Now",
    detail: "云计算、开源、自托管，还有一点不肯停下来的好奇。",
    href: "https://linktr.ee/qiws",
    tone: "lilac",
    visual: "curve",
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
  if (progress <= 0.4) {
    return lerp(1, 0.625, smoothstep(progress / 0.4));
  }
  if (progress <= 0.77) {
    return lerp(0.625, 0.49, smoothstep((progress - 0.4) / 0.37));
  }
  return lerp(0.49, finalSize / baseSize, smoothstep((progress - 0.77) / 0.23));
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
      return <span className="tile-visual visual-nodes" aria-hidden="true"><i /><i /><i /></span>;
    case "quote":
      return <span className="tile-visual visual-quote" aria-hidden="true"><i>“</i><i>”</i></span>;
    case "monogram":
      return <span className="tile-visual visual-monogram" aria-hidden="true"><i>OV</i><i>WS</i></span>;
    case "type":
      return <span className="tile-visual visual-type" aria-hidden="true"><i>字</i><span>Aa</span></span>;
    case "terminal":
      return <span className="tile-visual visual-terminal" aria-hidden="true"><i>&gt;_</i></span>;
    case "blocks":
      return <span className="tile-visual visual-blocks" aria-hidden="true"><i /><i /></span>;
    case "landscape":
      return <span className="tile-visual visual-landscape" aria-hidden="true"><i /><b /></span>;
    case "curve":
      return <span className="tile-visual visual-curve" aria-hidden="true"><i /><i /><b /></span>;
  }
}

export default function Home() {
  const [profileOpen, setProfileOpen] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef(new Map<TileId, HTMLAnchorElement>());
  const centerRef = useRef<HTMLDivElement>(null);
  const identityRef = useRef<HTMLSpanElement>(null);
  const introRef = useRef<HTMLSpanElement>(null);
  const middleRef = useRef<HTMLSpanElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const chevronsRef = useRef<HTMLSpanElement>(null);

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
          x: lerp(tile.initial.x * width, finalFrame.x, amount),
          y: lerp(tile.initial.y * height, finalFrame.y, amount),
          width: lerp(tile.initial.width * width, finalFrame.width, amount),
          height: lerp(tile.initial.height * height, finalFrame.height, amount),
        };
        movingFrames.push(currentFrame);

        if (dimensionsChanged) {
          element.style.width = `${finalFrame.width}px`;
          element.style.height = `${finalFrame.height}px`;
          element.style.borderRadius = tile.radius ?? "0";
        }

        element.style.transform = `translate3d(${currentFrame.x.toFixed(3)}px, ${currentFrame.y.toFixed(3)}px, 0) scale3d(${(currentFrame.width / finalFrame.width).toFixed(5)}, ${(currentFrame.height / finalFrame.height).toFixed(5)}, 1)`;
        element.style.pointerEvents = progress > 0.72 ? "auto" : "none";
        const componentProgress = smoothstep(clamp((progress - 0.54) / 0.36));
        const componentOffset = (1 - componentProgress) * 28;
        const componentTilt = (1 - componentProgress) * 12;
        element.style.setProperty("--component-progress", componentProgress.toFixed(4));
        element.style.setProperty("--component-opacity", clamp((componentProgress - 0.08) / 0.92).toFixed(4));
        element.style.setProperty("--component-offset", `${componentOffset.toFixed(2)}px`);
        element.style.setProperty("--component-offset-negative", `${(-componentOffset).toFixed(2)}px`);
        element.style.setProperty("--component-tilt", `${componentTilt.toFixed(2)}deg`);
        element.style.setProperty("--component-tilt-negative", `${(-componentTilt).toFixed(2)}deg`);
        element.style.setProperty("--component-scale", `${(0.9 + componentProgress * 0.1).toFixed(4)}`);
        element.style.setProperty("--component-pop", componentProgress.toFixed(4));
        element.classList.toggle("is-arriving", componentProgress >= 0.03);
        element.classList.toggle("is-settled", progress >= 0.88);
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
        const isBlue = progress > 0.46;
        center.classList.toggle("is-blue", isBlue);
        center.classList.toggle("is-paper", !isBlue);
      }

      const introOpacity = clamp(1 - progress / 0.42);
      const middleOpacity = clamp((progress - 0.45) / 0.12) * clamp((0.78 - progress) / 0.16);
      const markOpacity = clamp((progress - 0.65) / 0.16);

      if (identityRef.current) {
        identityRef.current.style.opacity = `${introOpacity}`;
        identityRef.current.style.transform = `translateY(${lerp(0, -8, clamp(progress / 0.42))}px)`;
      }
      if (introRef.current) {
        introRef.current.style.opacity = `${introOpacity}`;
        introRef.current.style.transform = `translateY(${lerp(0, -12, clamp(progress / 0.42))}px)`;
      }
      if (middleRef.current) {
        middleRef.current.style.opacity = `${middleOpacity}`;
        middleRef.current.style.transform = `scale(${lerp(0.92, 1, clamp((progress - 0.45) / 0.12))})`;
      }
      if (markRef.current) markRef.current.style.opacity = `${markOpacity}`;
      if (chevronsRef.current) chevronsRef.current.style.opacity = `${introOpacity}`;

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
          <div className="blueprint-grid" aria-hidden="true" />

          <div className="tile-field" aria-label="个人目录">
            {tiles.map((tile) => (
              <a
                className={`scene-tile tile-${tile.tone}`}
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
            className="center-tile is-paper"
            ref={centerRef}
            role="img"
          >
            <span className="center-identity" ref={identityRef}>
              <strong>文山木公</strong><em>QI WENSONG</em>
            </span>
            <span className="center-intro" ref={introRef}>
              云计算与开源折腾者，喜欢把好奇做成顺手的工具；偶尔写字，也持续搭建自己的小系统。
            </span>
            <span className="center-middle" ref={middleRef}>
              在云端、开源和<br />自托管里持续搭建。
            </span>
            <span className="center-mark" ref={markRef}>
              OVWS<span>.</span>
            </span>
            <span className="scroll-chevrons" aria-hidden="true" ref={chevronsRef}><i /><i /></span>
          </div>

          <p className="profile-trigger" aria-hidden="true">
            <span>SCROLL</span>
            <span>TO EXPLORE</span>
          </p>

          <p className="scene-index" aria-hidden="true">QI WENSONG / DROP PAGE / 2026</p>

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
