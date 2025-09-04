import { useRef, useState } from 'react';
import { Upload, Camera, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { toast } from '@/components/ui/use-toast';

interface PhotoUploadProps {
  onPhotosSelected: (files: File[]) => void;
}

export const PhotoUpload = ({ onPhotosSelected }: PhotoUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onPhotosSelected(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleAccessDevicePhotos = async () => {
    try {
      setIsLoadingPhotos(true);
      
      // Request permission to access photos
      const permission = await CapacitorCamera.requestPermissions({ permissions: ['photos'] });
      
      if (permission.photos === 'granted') {
        // Note: Capacitor Camera plugin doesn't directly support bulk photo access
        // This would require a custom plugin or using the Photos plugin
        // For now, we'll show a message to the user
        toast({
          title: "Photo Access",
          description: "For bulk photo access, please use the file upload option. Native bulk photo access requires additional setup.",
        });
      } else {
        toast({
          title: "Permission Denied",
          description: "Photo access permission is required to load your device photos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error accessing photos:', error);
      toast({
        title: "Error",
        description: "Unable to access device photos. Please try the file upload option.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPhotos(false);
    }
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
          
          <div className="space-y-3">
            <Button 
              onClick={handleAccessDevicePhotos}
              disabled={isLoadingPhotos}
              className="w-full bg-gradient-primary hover:shadow-float transition-all duration-300"
              size="lg"
            >
              <Smartphone className="w-5 h-5 mr-2" />
              {isLoadingPhotos ? 'Accessing Photos...' : 'Access Device Photos'}
            </Button>
            
            <div className="text-center text-muted-foreground text-sm">or</div>
            
            <Button 
              onClick={handleClick}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Camera className="w-5 h-5 mr-2" />
              Upload Photos
            </Button>
          </div>
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