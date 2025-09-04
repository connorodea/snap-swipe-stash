import { useState, useEffect } from 'react';
import { PhotoCard } from './PhotoCard';
import { RotateCcw, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Photo {
  file: File;
  url: string;
  id: string;
}

interface SwipeSessionProps {
  photos: Photo[];
  onRestart: () => void;
}

export const SwipeSession = ({ photos, onRestart }: SwipeSessionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedPhotos, setSavedPhotos] = useState<Photo[]>([]);
  const [deletedPhotos, setDeletedPhotos] = useState<Photo[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentPhoto = photos[currentIndex];
  const progress = ((currentIndex + 1) / photos.length) * 100;

  const handleSwipeLeft = () => {
    if (isAnimating || !currentPhoto) return;
    
    setIsAnimating(true);
    setDeletedPhotos(prev => [...prev, currentPhoto]);
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 500);
  };

  const handleSwipeRight = () => {
    if (isAnimating || !currentPhoto) return;
    
    setIsAnimating(true);
    setSavedPhotos(prev => [...prev, currentPhoto]);
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 500);
  };

  const downloadSavedPhotos = () => {
    // Create a simple way to download saved photos
    savedPhotos.forEach((photo, index) => {
      const link = document.createElement('a');
      link.href = photo.url;
      link.download = `saved_photo_${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  if (currentIndex >= photos.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-background px-6">
        <div className="text-center mb-8 animate-fade-in-scale">
          <h2 className="text-3xl font-bold mb-4">Session Complete!</h2>
          <div className="grid grid-cols-2 gap-6 mb-8 max-w-md mx-auto">
            <div className="bg-gradient-card p-6 rounded-2xl shadow-card text-center">
              <div className="w-12 h-12 bg-save/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Download className="w-6 h-6 text-save" />
              </div>
              <p className="text-2xl font-bold text-save">{savedPhotos.length}</p>
              <p className="text-sm text-muted-foreground">Saved</p>
            </div>
            
            <div className="bg-gradient-card p-6 rounded-2xl shadow-card text-center">
              <div className="w-12 h-12 bg-delete/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6 text-delete" />
              </div>
              <p className="text-2xl font-bold text-delete">{deletedPhotos.length}</p>
              <p className="text-sm text-muted-foreground">Deleted</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {savedPhotos.length > 0 && (
              <Button 
                onClick={downloadSavedPhotos}
                className="bg-save hover:bg-save/90 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Saved Photos
              </Button>
            )}
            
            <Button 
              onClick={onRestart}
              variant="outline"
              className="border-primary/20"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Start New Session
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-background">
      {/* Header with progress */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {currentIndex + 1} of {photos.length}
          </h2>
          <Button 
            onClick={onRestart}
            variant="ghost"
            size="sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart
          </Button>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-primary h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Photo cards container */}
      <div className="flex-1 relative overflow-hidden">
        {/* Current photo */}
        {currentPhoto && (
          <PhotoCard
            key={currentPhoto.id}
            image={currentPhoto.url}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            isActive={true}
          />
        )}
        
        {/* Next photo preview */}
        {photos[currentIndex + 1] && (
          <PhotoCard
            key={photos[currentIndex + 1].id}
            image={photos[currentIndex + 1].url}
            onSwipeLeft={() => {}}
            onSwipeRight={() => {}}
            isActive={false}
          />
        )}
      </div>

      {/* Bottom action area */}
      <div className="p-6 pt-0">
        <div className="flex justify-center gap-8">
          <div className="flex items-center gap-2 text-delete">
            <div className="w-3 h-3 bg-delete rounded-full"></div>
            <span className="text-sm font-medium">{deletedPhotos.length} deleted</span>
          </div>
          
          <div className="flex items-center gap-2 text-save">
            <div className="w-3 h-3 bg-save rounded-full"></div>
            <span className="text-sm font-medium">{savedPhotos.length} saved</span>
          </div>
        </div>
      </div>
    </div>
  );
};