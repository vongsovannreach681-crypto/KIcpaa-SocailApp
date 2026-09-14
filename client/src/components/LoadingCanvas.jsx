import { useEffect, useState, useRef } from "react";

const LoadingCanvas = ({ logo, isDataReady, onComplete }) => {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) return current;
        return current + 1;
      });
    }, 10);

    return () => window.clearInterval(timer);
  }, [isDataReady]);

  useEffect(() => {
    if (progress !== 100 || !isDataReady) return undefined;

    const completionTimer = window.setTimeout(onComplete, 260);
    return () => window.clearTimeout(completionTimer);
  }, [isDataReady, onComplete, progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const image = new Image();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frameId;
    let imageReady = false;

    const draw = (time = 0) => {
      const size = canvas.clientWidth;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const expectedWidth = Math.round(size * pixelRatio);

      if (canvas.width !== expectedWidth) {
        canvas.width = expectedWidth;
        canvas.height = expectedWidth;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      }

      const center = size / 2;
      const rotation = reducedMotion ? 0 : time / 1200;
      context.clearRect(0, 0, size, size);

      const glow = context.createRadialGradient(center, center, size * 0.12, center, center, size * 0.5);
      glow.addColorStop(0, "rgba(14, 165, 233, 0.24)");
      glow.addColorStop(1, "rgba(14, 165, 233, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, size, size);

      context.save();
      context.translate(center, center);
      context.rotate(rotation);
      context.lineWidth = Math.max(3, size * 0.025);
      context.lineCap = "round";
      const arc = context.createLinearGradient(-center, -center, center, center);
      arc.addColorStop(0, "#38bdf8");
      arc.addColorStop(0.55, "#2563eb");
      arc.addColorStop(1, "rgba(56, 189, 248, 0.08)");
      context.strokeStyle = arc;
      context.beginPath();
      context.arc(0, 0, size * 0.38, -Math.PI * 0.2, Math.PI * 1.3);
      context.stroke();

      for (let index = 0; index < 3; index += 1) {
        const angle = rotation * (index % 2 ? -0.65 : 1) + (index * Math.PI * 2) / 3;
        const radius = size * 0.38;
        context.beginPath();
        context.fillStyle = index === 0 ? "#e0f2fe" : "#38bdf8";
        context.arc(Math.cos(angle) * radius, Math.sin(angle) * radius, size * 0.025, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();

      context.beginPath();
      context.fillStyle = "#ffffff";
      context.arc(center, center, size * 0.28, 0, Math.PI * 2);
      context.fill();

      if (imageReady) {
        const logoSize = size * 0.39;
        context.drawImage(image, center - logoSize / 2, center - logoSize / 2, logoSize, logoSize);
      }

      if (!reducedMotion) frameId = requestAnimationFrame(draw);
    };

    image.onload = () => {
      imageReady = true;
      draw();
    };
    image.onerror = () => draw();
    image.src = logo;
    window.addEventListener("resize", draw);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", draw);
    };
  }, [logo]);

  return (
    <main className="canvas-loader" aria-busy="true" aria-live="polite">
      <canvas ref={canvasRef} className="canvas-loader-art" aria-hidden="true" />
      <p>Preparing your links</p>
      <span>Loading preview · {progress}%</span>
    </main>
  );
};

export default LoadingCanvas;
