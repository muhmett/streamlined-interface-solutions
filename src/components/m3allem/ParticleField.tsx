import { useEffect, useRef } from "react";

/**
 * Ambient gold particles that periodically gather into the silhouette of a
 * craft tool (wrench, hammer, bolt, brush, key, screwdriver), hold it, then
 * scatter and re-form the next one. Silhouettes are drawn with canvas
 * primitives on an offscreen canvas and sampled into particle targets, so no
 * fonts or assets are needed. Honors prefers-reduced-motion.
 */

type ShapePainter = (ctx: CanvasRenderingContext2D) => void;

// All painters draw inside a 100×100 box.
const wrench: ShapePainter = (ctx) => {
  ctx.save();
  ctx.translate(50, 50);
  ctx.rotate(-Math.PI / 4);
  ctx.fillRect(-7, -12, 14, 52); // handle
  ctx.beginPath();
  ctx.arc(0, -22, 17, 0, Math.PI * 2); // head
  ctx.fill();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(0, -34, 9, 0, Math.PI * 2); // jaw opening
  ctx.fill();
  ctx.restore();
};

const hammer: ShapePainter = (ctx) => {
  ctx.save();
  ctx.translate(50, 50);
  ctx.rotate(Math.PI / 5);
  ctx.fillRect(-26, -34, 52, 18); // head
  ctx.fillRect(-6, -16, 12, 52); // handle
  ctx.restore();
};

const bolt: ShapePainter = (ctx) => {
  ctx.beginPath();
  ctx.moveTo(58, 8);
  ctx.lineTo(30, 54);
  ctx.lineTo(46, 54);
  ctx.lineTo(40, 92);
  ctx.lineTo(72, 42);
  ctx.lineTo(54, 42);
  ctx.closePath();
  ctx.fill();
};

const brush: ShapePainter = (ctx) => {
  ctx.save();
  ctx.translate(50, 50);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-5, -42, 10, 44); // handle
  ctx.fillRect(-11, 4, 22, 14); // ferrule
  ctx.beginPath(); // bristles
  ctx.moveTo(-11, 18);
  ctx.lineTo(11, 18);
  ctx.lineTo(6, 40);
  ctx.lineTo(-6, 40);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

const key: ShapePainter = (ctx) => {
  ctx.save();
  ctx.translate(50, 50);
  ctx.rotate(-Math.PI / 4);
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(0, -24, 13, 0, Math.PI * 2); // bow
  ctx.stroke();
  ctx.fillRect(-4, -12, 8, 46); // shaft
  ctx.fillRect(4, 18, 12, 7); // teeth
  ctx.fillRect(4, 29, 9, 7);
  ctx.restore();
};

const screwdriver: ShapePainter = (ctx) => {
  ctx.save();
  ctx.translate(50, 50);
  ctx.rotate(Math.PI / 4);
  ctx.beginPath(); // handle
  ctx.roundRect(-9, -44, 18, 34, 8);
  ctx.fill();
  ctx.fillRect(-3.5, -10, 7, 38); // shaft
  ctx.beginPath(); // tip
  ctx.moveTo(-6, 28);
  ctx.lineTo(6, 28);
  ctx.lineTo(2, 42);
  ctx.lineTo(-2, 42);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

const SHAPES: ShapePainter[] = [wrench, hammer, bolt, brush, key, screwdriver];

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  size: number;
  alpha: number;
  wobble: number;
}

const PARTICLE_COUNT = 190;
const SHAPE_INTERVAL_MS = 3600;

function sampleShape(painter: ShapePainter): { x: number; y: number }[] {
  const off = document.createElement("canvas");
  off.width = 100;
  off.height = 100;
  const ctx = off.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  painter(ctx);
  const { data } = ctx.getImageData(0, 0, 100, 100);
  const pts: { x: number; y: number }[] = [];
  for (let y = 0; y < 100; y += 2) {
    for (let x = 0; x < 100; x += 2) {
      if (data[(y * 100 + x) * 4 + 3] > 100) pts.push({ x, y });
    }
  }
  return pts;
}

export function ParticleField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const targetSets = SHAPES.map(sampleShape);
    let shapeIndex = Math.floor(Math.random() * targetSets.length);

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      tx: 0,
      ty: 0,
      size: 1.4 + Math.random() * 2.1,
      alpha: 0.4 + Math.random() * 0.55,
      wobble: Math.random() * Math.PI * 2,
    }));

    // Map 100×100 shape space to a centered box in the canvas.
    const assignTargets = () => {
      const pts = targetSets[shapeIndex];
      const box = Math.min(width, height) * 0.62;
      const ox = (width - box) / 2;
      const oy = (height - box) / 2;
      const shuffled = [...pts].sort(() => Math.random() - 0.5);
      particles.forEach((p, i) => {
        const pt = shuffled[i % shuffled.length];
        p.tx = ox + (pt.x / 100) * box + (Math.random() - 0.5) * 3;
        p.ty = oy + (pt.y / 100) * box + (Math.random() - 0.5) * 3;
      });
      shapeIndex = (shapeIndex + 1) % targetSets.length;
    };
    assignTargets();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(43, 72%, 62%, ${p.alpha})`;
        ctx.fill();
      }
    };

    if (reducedMotion) {
      // Static: place particles directly on the first shape, no loop.
      particles.forEach((p) => {
        p.x = p.tx;
        p.y = p.ty;
      });
      draw();
      return () => window.removeEventListener("resize", resize);
    }

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 16.7, 3);
      last = now;
      for (const p of particles) {
        p.wobble += 0.02 * dt;
        p.x += (p.tx - p.x) * 0.055 * dt + Math.sin(p.wobble) * 0.18;
        p.y += (p.ty - p.y) * 0.055 * dt + Math.cos(p.wobble * 0.8) * 0.18;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const cycle = setInterval(assignTargets, SHAPE_INTERVAL_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(cycle);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
