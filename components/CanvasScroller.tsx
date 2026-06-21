"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const FRAME_COUNT = 151;
const FRAME_PATH = '/15fpsframes/';
const EXT = '.jpg';

const MAPPING = [
  { p: 0, f: 0 },
  { p: 0.25, f: 37 },
  { p: 0.5, f: 75 },
  { p: 0.75, f: 112 },
  { p: 1, f: 150 },
];

function pad(n: number) {
  return String(n + 1).padStart(3, '0');
}

function mapProgressToFrame(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  for (let i = 0; i < MAPPING.length - 1; i++) {
    const a = MAPPING[i];
    const b = MAPPING[i + 1];
    if (p >= a.p && p <= b.p) {
      const t = (p - a.p) / (b.p - a.p);
      return Math.round(a.f + (b.f - a.f) * t);
    }
  }
  return FRAME_COUNT - 1;
}

export default function CanvasScroller() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef<number | null>(null);
  const [loaded, setLoaded] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isCompactMobile, setIsCompactMobile] = useState(false);

  useEffect(() => {
    // Preload all frames
    let mounted = true;
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `${FRAME_PATH}ezgif-frame-${pad(i)}${EXT}`;
      img.onload = () => {
        if (!mounted) return;
        setLoaded((s) => s + 1);
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let devicePixelRatio = window.devicePixelRatio || 1;

    function resize() {
      // Use visualViewport when available to account for mobile browser UI
      const vw = window.visualViewport?.width || window.innerWidth;
      const vh = window.visualViewport?.height || window.innerHeight;
      width = vw;
      height = vh;
      devicePixelRatio = window.devicePixelRatio || 1;
      if (!canvas || !ctx) return;

      // Detect narrow/mobile viewports and adjust layout
      const narrow = width <= 420 || (window.navigator && /iphone|android.+mobile/i.test(window.navigator.userAgent));
      const compact = width <= 400 && height <= 642;
      setIsMobile(narrow);
      setIsCompactMobile(compact);

      // Dynamically set the scroll container height to maintain consistent mapping
      if (container) {
        const multiplier = compact ? 2.6 : (narrow ? 3.2 : 4.5);
        container.style.height = `${Math.floor(height * multiplier)}px`;
      }

      canvas.width = Math.floor(width * devicePixelRatio);
      canvas.height = Math.floor(height * devicePixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      renderFrame(currentFrame);
    }

    let targetFrame = 0;
    let currentFrame = 0;

    function getScrollProgress() {
      if (!container) return 0;
      const rect = container.getBoundingClientRect();
      // how far the container has been scrolled relative to its total scrollable range
      const total = container.clientHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      return total <= 0 ? 0 : scrolled / total;
    }

    function renderFrame(frameIndex: number) {
      if (!ctx || !canvas) return;
      const img = imagesRef.current[frameIndex];
      if (!img) return;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      // cover the canvas while maintaining aspect ratio
      const canvasRatio = width / height;
      const imgRatio = iw / ih;
      let dw = width;
      let dh = height;
      let dx = 0;
      let dy = 0;
      if (imgRatio > canvasRatio) {
        // image is wider, fit height
        dh = height;
        dw = (iw / ih) * dh;
        dx = -(dw - width) / 2;
      } else {
        // image taller, fit width
        dw = width;
        dh = (ih / iw) * dw;
        dy = -(dh - height) / 2;
      }
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    function loop() {
      const progress = getScrollProgress();
      targetFrame = mapProgressToFrame(progress);
      // smooth interpolation
      currentFrame += (targetFrame - currentFrame) * 0.15;
      const idx = Math.round(currentFrame);
      renderFrame(idx);
      rafRef.current = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener('resize', resize);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loaded]);

  // overlayed storytelling copy keyed to progress
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    function onScroll() {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const total = container.clientHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = total <= 0 ? 0 : scrolled / total;
      setProgress(p);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function sectionOpacity(start: number, end: number) {
    const t = (progress - start) / (end - start);
    return Math.max(0, Math.min(1, t));
  }

  return (
    <div ref={containerRef} style={{ height: '450vh' }} className="relative">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-screen h-screen z-0 pointer-events-none"
        style={{ touchAction: 'none' }}
      />

      <div
        className={`pointer-events-none fixed inset-0 z-10 flex justify-center ${isCompactMobile ? 'compact-mobile' : (isMobile ? 'mobile-fit' : 'md:items-center items-start')}`}
      >
          <div className={`${isCompactMobile ? 'max-w-xs' : (isMobile ? 'max-w-xl' : 'max-w-4xl')} text-center px-4`}>

          <motion.div
            style={{ opacity: sectionOpacity(0.2, 0.4), translateY: (1 - sectionOpacity(0.2,0.4)) * 20 }}
            className="mt-20"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-heading">Walking Through Life Together</h2>
            <p className="mt-3">Every step creates a memory. Every moment becomes a story.</p>
          </motion.div>

          <motion.div
            style={{ opacity: sectionOpacity(0.4, 0.6), translateY: (1 - sectionOpacity(0.4,0.6)) * 20 }}
            className="mt-20"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-heading">More Than A Hero</h2>
            <p className="mt-3">A guide. A protector. A teacher. A friend.</p>
          </motion.div>

          <motion.div
            style={{ opacity: sectionOpacity(0.6, 0.8), translateY: (1 - sectionOpacity(0.6,0.8)) * 20 }}
            className="mt-20"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-heading">Thank You, Dad</h2>
            <p className="mt-3">For every lesson. For every sacrifice. For every dream you helped build.</p>
          </motion.div>

          <motion.div
            style={{ opacity: sectionOpacity(0.8, 1), translateY: (1 - sectionOpacity(0.8,1)) * 20 }}
            className="mt-20"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-heading">Happy Father's Day</h2>
            <p className="mt-3">The greatest gift in life is having someone who always walks beside you.</p>
          </motion.div>
        </div>
      </div>

      {/* loader removed for clean mobile/hero view */}
    </div>
  );
}
