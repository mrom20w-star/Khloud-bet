import React, { useEffect, useRef } from 'react';

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let time = 0;

    interface GoldStream {
      x: number;
      y: number;
      speed: number;
      length: number;
      width: number;
      alpha: number;
      depth: number;
      swayOffset: number;
    }

    interface GoldDust {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      twinkleSpeed: number;
      phase: number;
      isDiamond: boolean;
    }

    interface GoldNode {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
    }

    interface GoldRipple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      speed: number;
    }

    let streams: GoldStream[] = [];
    let dust: GoldDust[] = [];
    let nodes: GoldNode[] = [];
    let ripples: GoldRipple[] = [];

    const initEntities = () => {
      const streamCount = Math.min(55, Math.max(28, Math.floor(width / 26)));
      const dustCount = Math.min(85, Math.max(40, Math.floor(width / 16)));
      const nodeCount = Math.min(36, Math.max(20, Math.floor(width / 38)));

      streams = Array.from({ length: streamCount }, () => {
        const depth = Math.random() * 0.75 + 0.25;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          speed: (Math.random() * 2.1 + 1.1) * depth + 0.6,
          length: (Math.random() * 70 + 35) * depth,
          width: (Math.random() * 1.4 + 0.7) * depth,
          alpha: (Math.random() * 0.45 + 0.2) * depth,
          depth,
          swayOffset: Math.random() * Math.PI * 2,
        };
      });

      dust = Array.from({ length: dustCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: Math.random() * 0.55 + 0.18,
        radius: Math.random() * 2.6 + 0.8,
        alpha: Math.random() * 0.55 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.015,
        phase: Math.random() * Math.PI * 2,
        isDiamond: Math.random() > 0.78,
      }));

      nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: Math.random() * 0.45 + 0.2,
        size: Math.random() * 1.8 + 1.2,
        alpha: Math.random() * 0.35 + 0.2,
      }));

      ripples = Array.from({ length: 4 }, (_, idx) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: idx * 35,
        maxRadius: Math.random() * 90 + 70,
        alpha: 0.22,
        speed: Math.random() * 0.45 + 0.35,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initEntities();
    };

    const drawDiamond = (x: number, y: number, r: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(0, -r * 1.8);
      ctx.lineTo(r * 0.45, -r * 0.45);
      ctx.lineTo(r * 1.8, 0);
      ctx.lineTo(r * 0.45, r * 0.45);
      ctx.lineTo(0, r * 1.8);
      ctx.lineTo(-r * 0.45, r * 0.45);
      ctx.lineTo(-r * 1.8, 0);
      ctx.lineTo(-r * 0.45, -r * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawAuroraWaves = () => {
      const waveConfigs = [
        { yBase: height * 0.24, amp: 48, freq: 0.0028, speed: 0.011, alpha: 0.09, lineWidth: 2.2 },
        { yBase: height * 0.52, amp: 62, freq: 0.0022, speed: -0.009, alpha: 0.07, lineWidth: 1.8 },
        { yBase: height * 0.78, amp: 42, freq: 0.0032, speed: 0.013, alpha: 0.08, lineWidth: 2.0 },
      ];

      waveConfigs.forEach((w, idx) => {
        const grad = ctx.createLinearGradient(0, w.yBase - w.amp, width, w.yBase + w.amp);
        grad.addColorStop(0, 'rgba(245, 158, 11, 0)');
        grad.addColorStop(0.25, `rgba(245, 158, 11, ${w.alpha})`);
        grad.addColorStop(0.5, `rgba(253, 224, 71, ${w.alpha * 1.5})`);
        grad.addColorStop(0.75, `rgba(217, 119, 6, ${w.alpha})`);
        grad.addColorStop(1, 'rgba(245, 158, 11, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = w.lineWidth;
        ctx.beginPath();

        for (let x = 0; x <= width; x += 24) {
          const y =
            w.yBase +
            Math.sin(x * w.freq + time * w.speed + idx * 1.6) * w.amp +
            Math.cos(x * w.freq * 0.55 - time * w.speed * 0.7) * (w.amp * 0.4);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
    };

    const renderFrame = (animate: boolean) => {
      ctx.clearRect(0, 0, width, height);
      if (animate) time += 1;

      // 1. Flowing Luxury Gold Silk Waves
      drawAuroraWaves();

      // 2. Subtle expanding gold pulse rings
      ripples.forEach((rp) => {
        if (animate) {
          rp.radius += rp.speed;
          if (rp.radius > rp.maxRadius) {
            rp.radius = 0;
            rp.x = Math.random() * width;
            rp.y = Math.random() * height;
          }
        }
        const progress = rp.radius / rp.maxRadius;
        const currentAlpha = rp.alpha * (1 - progress);
        if (currentAlpha > 0.01) {
          ctx.strokeStyle = `rgba(251, 191, 36, ${currentAlpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // 3. Constellation Nodes & Golden Filaments
      nodes.forEach((n, i) => {
        if (animate) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0) n.x = width;
          if (n.x > width) n.x = 0;
          if (n.y > height) {
            n.y = -10;
            n.x = Math.random() * width;
          }
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 135) {
            const lineAlpha = (1 - dist / 135) * 0.16;
            ctx.strokeStyle = `rgba(245, 185, 35, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = `rgba(252, 211, 77, ${n.alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Falling Golden Light Meteors / Cascades
      streams.forEach((s) => {
        if (animate) {
          s.y += s.speed;
          s.x += Math.sin(time * 0.01 + s.swayOffset) * 0.15;
          if (s.y - s.length > height) {
            s.y = -s.length - Math.random() * 40;
            s.x = Math.random() * width;
          }
        }

        const grad = ctx.createLinearGradient(s.x, s.y - s.length, s.x, s.y);
        grad.addColorStop(0, 'rgba(245, 158, 11, 0)');
        grad.addColorStop(0.55, `rgba(245, 185, 35, ${s.alpha * 0.45})`);
        grad.addColorStop(0.92, `rgba(253, 224, 71, ${s.alpha})`);
        grad.addColorStop(1, `rgba(254, 249, 195, ${Math.min(1, s.alpha + 0.25)})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y - s.length);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        // Soft glowing bokeh tip
        const glowRadius = s.width * 3.8;
        const tipGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowRadius);
        tipGlow.addColorStop(0, `rgba(254, 240, 138, ${Math.min(0.9, s.alpha + 0.25)})`);
        tipGlow.addColorStop(0.45, `rgba(245, 158, 11, ${s.alpha * 0.4})`);
        tipGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');

        ctx.fillStyle = tipGlow;
        ctx.beginPath();
        ctx.arc(s.x, s.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Twinkling Gold Dust & Star Diamonds
      dust.forEach((d) => {
        if (animate) {
          d.x += d.vx;
          d.y += d.vy;
          d.phase += d.twinkleSpeed;
          if (d.x < 0) d.x = width;
          if (d.x > width) d.x = 0;
          if (d.y > height + 10) {
            d.y = -10;
            d.x = Math.random() * width;
          }
        }

        const twinkle = 0.55 + 0.45 * Math.sin(d.phase);
        const currentAlpha = d.alpha * twinkle;

        if (d.isDiamond) {
          drawDiamond(d.x, d.y, d.radius * 1.15, currentAlpha);
        } else {
          const orbGlow = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.radius * 2.4);
          orbGlow.addColorStop(0, `rgba(254, 240, 138, ${currentAlpha})`);
          orbGlow.addColorStop(0.5, `rgba(245, 158, 11, ${currentAlpha * 0.45})`);
          orbGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');

          ctx.fillStyle = orbGlow;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.radius * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    const loop = () => {
      renderFrame(true);
      animId = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    resize();

    if (prefersReducedMotion) {
      renderFrame(false);
    } else {
      loop();
    }

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#060503]">
      {/* Radial Luxury Obsidian & Warm Gold Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 55% at 50% 0%, rgba(245, 158, 11, 0.14) 0%, rgba(180, 83, 9, 0.05) 45%, rgba(6, 5, 3, 0.96) 100%)',
        }}
      />

      {/* Masked Fine Gold Geometric Grid (fades seamlessly toward edges) */}
      <div
        className="absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(251, 191, 36, 0.45) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 191, 36, 0.45) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 75% 70% at 50% 45%, black 35%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 50% 45%, black 35%, transparent 90%)',
        }}
      />

      {/* Slow Breathing Ambient Gold Halos */}
      <div
        className="absolute -top-24 right-[-10%] w-[420px] h-[420px] bg-amber-500/15 rounded-full blur-[140px] animate-pulse"
        style={{ animationDuration: '6s' }}
      />
      <div
        className="absolute -bottom-24 left-[-10%] w-[420px] h-[420px] bg-yellow-600/12 rounded-full blur-[140px] animate-pulse"
        style={{ animationDuration: '8s' }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-amber-600/[0.07] rounded-full blur-[160px]" />

      {/* Multi-Layer Animated Gold Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-90" />
    </div>
  );
};
