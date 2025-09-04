import { useRef } from 'react';
import { Upload, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoUploadProps {
  onPhotosSelected: (files: File[]) => void;
}

export const PhotoUpload = ({ onPhotosSelected }: PhotoUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onPhotosSelected(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-background px-6">
      <div className="text-center mb-8 animate-fade-in-scale">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
          Photo Swipe
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Organize your photos easily. Swipe right to keep, left to delete.
        </p>
      </div>

      <div 
        onClick={handleClick}
        className="relative bg-gradient-card rounded-3xl p-8 shadow-card hover:shadow-float transition-all duration-300 cursor-pointer group max-w-sm w-full mx-auto border-2 border-dashed border-muted hover:border-primary/50"
      >
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-12 h-12 text-primary" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-2">Upload Photos</h3>
          <p className="text-muted-foreground mb-6">
            Select multiple photos to start organizing
          </p>
          
          <Button 
            className="w-full bg-gradient-primary hover:shadow-float transition-all duration-300"
            size="lg"
          >
            <Camera className="w-5 h-5 mr-2" />
            Choose Photos
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground max-w-md">
        <p>Your photos are processed locally on your device for privacy and security.</p>
      </div>
    </div>
  );
};