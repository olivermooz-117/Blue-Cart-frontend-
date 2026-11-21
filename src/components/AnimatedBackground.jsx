import { useEffect, useRef, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export default function AnimatedBackground() {
  const canvasRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(
    typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION_QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(REDUCED_MOTION_QUERY);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;

    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];
    let animationId;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const particleCount = Math.floor((width * height) / 12000);
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 2 + Math.random() * 4,
        speed: 0.15 + Math.random() * 0.35,
        sway: 0.5 + Math.random() * 1.5,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: 0.3 + Math.random() * 0.5,
        color: Math.random() > 0.5 ? "#3b7597" : "#2fb89a",
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const time = Date.now() * 0.001;

      for (const p of particles) {
        p.y -= p.speed;
        p.x += Math.sin(time + p.swayOffset) * 0.15 * p.sway;

        if (p.y < -p.size) p.y = height + p.size;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const px = Math.round(p.x);
        const py = Math.round(p.y);
        const ps = Math.round(p.size * 2) / 2;

        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(px, py, ps, ps);
      }
      ctx.globalAlpha = 1;

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="animated-background" aria-hidden="true" />;
}
