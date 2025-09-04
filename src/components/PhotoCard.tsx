import { useState, useRef, useEffect } from 'react';
import { X, Heart } from 'lucide-react';

interface PhotoCardProps {
  image: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isActive: boolean;
}

export const PhotoCard = ({ image, onSwipeLeft, onSwipeRight, isActive }: PhotoCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isActive) return;
    setIsDragging(true);
    startPos.current = { 
      x: e.touches[0].clientX, 
      y: e.touches[0].clientY 
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !isActive) return;
    
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
    setRotation(deltaX * 0.1);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !isActive) return;
    
    const deltaX = e.touches[0].clientX - startPos.current.x;
    const deltaY = e.touches[0].clientY - startPos.current.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
    setRotation(deltaX * 0.1);
  };

  const handleMouseUp = () => {
    if (!isDragging || !isActive) return;
    
    setIsDragging(false);
    
    const threshold = 150;
    if (Math.abs(dragOffset.x) > threshold) {
      if (dragOffset.x > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    } else {
      // Snap back
      setDragOffset({ x: 0, y: 0 });
      setRotation(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || !isActive) return;
    
    setIsDragging(false);
    
    const threshold = 150;
    if (Math.abs(dragOffset.x) > threshold) {
      if (dragOffset.x > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    } else {
      // Snap back
      setDragOffset({ x: 0, y: 0 });
      setRotation(0);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragOffset.x]);

  const getActionIndicator = () => {
    if (Math.abs(dragOffset.x) < 50) return null;
    
    if (dragOffset.x > 0) {
      return (
        <div className="absolute inset-0 bg-save/20 flex items-center justify-center animate-pulse">
          <div className="bg-save text-white p-4 rounded-full">
            <Heart className="w-8 h-8" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="absolute inset-0 bg-delete/20 flex items-center justify-center animate-pulse">
          <div className="bg-delete text-white p-4 rounded-full">
            <X className="w-8 h-8" />
          </div>
        </div>
      );
    }
  };

  return (
    <div
      ref={cardRef}
      className={`absolute inset-4 bg-gradient-card rounded-3xl shadow-float overflow-hidden cursor-grab ${
        isDragging ? 'cursor-grabbing' : ''
      } ${isActive ? 'z-10' : 'z-0'} transition-all duration-300 ${
        isActive ? 'scale-100' : 'scale-95 brightness-75'
      }`}
      style={{
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="relative w-full h-full">
        <img 
          src={image} 
          alt="Photo to review"
          className="w-full h-full object-cover"
          draggable={false}
        />
        {getActionIndicator()}
        
        {/* Action hints when not dragging */}
        {!isDragging && isActive && (
          <>
            <div className="absolute top-6 left-6 bg-delete/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
              <X className="w-4 h-4 inline mr-1" />
              Swipe Left
            </div>
            <div className="absolute top-6 right-6 bg-save/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
              <Heart className="w-4 h-4 inline mr-1" />
              Swipe Right
            </div>
          </>
        )}
      </div>
    </div>
  );
};