import { useState } from 'react';
import { PhotoUpload } from '@/components/PhotoUpload';
import { SwipeSession } from '@/components/SwipeSession';
import heroImage from '@/assets/hero-image.jpg';

interface Photo {
  file: File;
  url: string;
  id: string;
}

const Index = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const handlePhotosSelected = (files: File[]) => {
    const photoObjects = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(7)
    }));
    
    setPhotos(photoObjects);
    setIsSessionActive(true);
  };

  const handleRestart = () => {
    // Clean up object URLs to prevent memory leaks
    photos.forEach(photo => URL.revokeObjectURL(photo.url));
    setPhotos([]);
    setIsSessionActive(false);
  };

  if (isSessionActive && photos.length > 0) {
    return (
      <SwipeSession 
        photos={photos} 
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-background opacity-90"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-background/80" />
        
        <div className="relative">
          <PhotoUpload onPhotosSelected={handlePhotosSelected} />
        </div>
      </div>
    </div>
  );
};

export default Index;