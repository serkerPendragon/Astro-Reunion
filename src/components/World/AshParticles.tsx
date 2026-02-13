import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  initialY: number;
}

interface ParticleImage {
  img: HTMLImageElement;
  url: string;
}

// 将 AshParticles 的动画逻辑抽离到自定义 hook
function useAshParticlesAnimation(
  count: number,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  particleImageUrl?: string
) {
  const [currentImage, setCurrentImage] = useState<ParticleImage | null>(null);
  const [nextImage, setNextImage] = useState<ParticleImage | null>(null);
  const [transitionProgress, setTransitionProgress] = useState<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const y = canvas.height + Math.random() * 100;
      particles.push({
        x: Math.random() * canvas.width,
        y: y,
        initialY: y,
        size: Math.random() * 1 + 1.2,
        speed: Math.random() * 0.2,
      });
    }

    // 加载图片
    const loadImage = (url: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    };

    // 处理粒子图片URL变化
    if (particleImageUrl) {
      loadImage(particleImageUrl)
        .then((img) => {
          if (currentImage === null) {
            // 初始加载
            setCurrentImage({ img, url: particleImageUrl });
          } else {
            // 图片切换：设置下一图片并开始过渡
            setNextImage({ img, url: particleImageUrl });
            setTransitionProgress(0);
          }
        })
        .catch((err) => console.error("Error loading particle image:", err));
    }

    function easeOutCubic(t: number): number {
      return 1 - Math.pow(1 - t, 3);
    }

    let animationFrameId: number;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 更新过渡进度
      if (nextImage && transitionProgress < 1) {
        setTransitionProgress((prev) => Math.min(prev + 0.01, 1)); // 控制过渡速度
      } else if (nextImage && transitionProgress >= 1) {
        // 过渡完成，更新当前图片
        setCurrentImage(nextImage);
        setNextImage(null);
      }

      particles.forEach((particle) => {
        // 如果有过渡图片，绘制两个图层
        if (nextImage && currentImage) {
          // 计算过渡alpha值
          const alpha = easeOutCubic(transitionProgress);

          // 绘制当前图片，逐渐减少透明度
          ctx.globalAlpha = 0.7 * (1 - alpha);
          if (currentImage.img.complete) {
            ctx.drawImage(
              currentImage.img,
              particle.x - particle.size,
              particle.y - particle.size,
              particle.size * 2,
              particle.size * 2
            );
          }

          // 绘制下一个图片，逐渐增加透明度
          ctx.globalAlpha = 0.7 * alpha;
          if (nextImage.img.complete) {
            ctx.drawImage(
              nextImage.img,
              particle.x - particle.size,
              particle.y - particle.size,
              particle.size * 2,
              particle.size * 2
            );
          }
        } else if (currentImage && currentImage.img.complete) {
          // 只绘制当前图片
          ctx.globalAlpha = 0.7;
          ctx.drawImage(
            currentImage.img,
            particle.x - particle.size,
            particle.y - particle.size,
            particle.size * 2,
            particle.size * 2
          );
        } else {
          // 回退到圆形绘制
          ctx.globalAlpha = 0.7;
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();

          // 模糊
          for (let i = 0; i < 3; i++) {
            ctx.globalAlpha = 0.01;
            ctx.beginPath();
            ctx.arc(
              particle.x,
              particle.y,
              particle.size + i * 0.5,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        }

        const totalDistance = canvas.height * 0.2;
        const currentDistance = particle.initialY - particle.y;
        const progress = Math.min(currentDistance / totalDistance, 1);
        const easeProgress = easeOutCubic(progress);

        const speed = particle.speed * (10 - 9 * easeProgress);
        particle.y -= speed;

        if (particle.y < 0) {
          particle.y = canvas.height;
          particle.x = Math.random() * canvas.width;
          particle.initialY = particle.y;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, particleImageUrl]);

  // 返回当前状态以便外部使用
  return { currentImage, nextImage, transitionProgress };
}

interface AshParticlesProps {
  count?: number;
  particleImageUrl?: string;
}

export default function AshParticles({
  count = 20,
  particleImageUrl,
}: AshParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { transitionProgress } = useAshParticlesAnimation(
    count,
    canvasRef,
    particleImageUrl
  );

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-[1]"
      />
      {/* 可选：显示过渡进度信息 */}
      {transitionProgress > 0 && transitionProgress < 1 && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            color: "white",
            zIndex: 10,
          }}
        >
          Transition: {Math.round(transitionProgress * 100)}%
        </div>
      )}
    </>
  );
}
