import { X } from 'lucide-react';
import { FC, MouseEvent, useRef, useState } from 'react';

const ZoomableImage: FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();

    const x = Math.max(
      0,
      Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
    );
    const y = Math.max(
      0,
      Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)
    );

    setPosition({ x, y });
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="w-full h-96 object-contain mb-4 cursor-zoom-in"
        onClick={() => setIsZoomed(true)}
      />
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative w-full h-full overflow-hidden cursor-zoom-out"
            onClick={e => e.stopPropagation()}
            onMouseMove={handleMouseMove}
          >
            <img
              ref={imageRef}
              src={src}
              alt={alt}
              className="absolute w-full h-full object-contain scale-[2]"
              style={{
                transformOrigin: `${position.x}% ${position.y}%`,
              }}
            />
          </div>
          <button
            className="absolute top-4 right-4 text-black"
            onClick={() => setIsZoomed(false)}
          >
            <X size={24} />
          </button>
        </div>
      )}
    </>
  );
};

export default ZoomableImage;
