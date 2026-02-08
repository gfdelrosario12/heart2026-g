'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Heart, Eye } from 'lucide-react';
import datesData from '@/data/dates.json';

interface ValentineModalProps {
  onClose: () => void;
}

interface DateEntry {
  id: string;
  date: string;
  title: string;
  location: string;
  description: string;
  imageUrl: string;
}

export function ValentineModal({ onClose }: ValentineModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedDate, setSelectedDate] = useState<DateEntry | null>(null);
  const dates = datesData.dates as DateEntry[];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = Math.random() * -5 - 2;
        this.life = 1;
        const colors = ['#ff1493', '#ff69b4', '#ffc0cb', '#ffb6c1', '#ff00ff'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // gravity
        this.life -= 0.01;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Create confetti
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);

        if (particles[i].life <= 0) {
          particles.splice(i, 1);
        }
      }

      if (particles.length > 0) {
        requestAnimationFrame(animate);
      }
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-40"
      />
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="bg-gradient-to-br from-pink-900 to-rose-900 border-pink-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-pink-100">
              Happy Valentine's Day! 💕
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-6xl mb-4 animate-bounce">
              <Heart className="w-16 h-16 text-pink-300 fill-pink-300" />
            </div>
            <p className="text-center text-pink-100 text-lg mb-4">
              Thank you for being an amazing part of our secured journey!
            </p>
            <p className="text-center text-pink-200 text-sm">
              This special date is all about celebrating love, trust, and secure
              connections—just like the foundations of every security management platform.
            </p>
            <div className="mt-6 pt-4 border-t border-pink-700/50 w-full">
              <div className="text-center space-y-1">
                <p className="text-pink-300 text-xs font-semibold">
                  Cloud IAM Training Platform
                </p>
                <p className="text-pink-400 text-xs">Version 1.0.0-beta</p>
                <p className="text-pink-400 text-xs">Build: Feb 2026</p>
                <p className="text-pink-300/70 text-xs mt-2">
                  Secure • Scalable • Simple
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {[...Array(5)].map((_, i) => (
              <Heart
                key={i}
                className="w-5 h-5 text-pink-300 fill-pink-300 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
