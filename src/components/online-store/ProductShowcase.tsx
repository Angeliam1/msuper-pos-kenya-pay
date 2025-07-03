
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Play, Pause, Volume2, VolumeX, ShoppingCart, Heart, Share2 } from 'lucide-react';

interface ProductVideo {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  description: string;
}

interface ProductShowcaseProps {
  videos: ProductVideo[];
  onAddToCart: (productId: string) => void;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  videos,
  onAddToCart
}) => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.play();
      } else {
        video.pause();
      }
    }
  }, [isPlaying, currentVideo]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
    setIsPlaying(true);
  };

  const prevVideo = () => {
    setCurrentVideo((prev) => (prev - 1 + videos.length) % videos.length);
    setIsPlaying(true);
  };

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No product videos available</h3>
        <p className="text-gray-600">Check back soon for exciting product showcases!</p>
      </div>
    );
  }

  const currentVideoData = videos[currentVideo];

  return (
    <div className="space-y-6">
      {/* Featured Video Player */}
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src={currentVideoData.url}
            poster={currentVideoData.thumbnail}
            className="w-full h-full object-cover"
            loop
            muted={isMuted}
            onEnded={nextVideo}
          />
          
          {/* Video Controls Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => onAddToCart(currentVideoData.id)}
                    className="bg-primary hover:bg-primary/90"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="sm"
            onClick={prevVideo}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
          >
            ←
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextVideo}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
          >
            →
          </Button>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{currentVideoData.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{currentVideoData.description}</p>
            </div>
            <Badge variant="secondary" className="ml-4">
              {currentVideo + 1} / {videos.length}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Video Thumbnails Carousel */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold mb-4">More Products</h4>
          <Carousel className="w-full">
            <CarouselContent>
              {videos.map((video, index) => (
                <CarouselItem key={video.id} className="basis-1/3 md:basis-1/4 lg:basis-1/6">
                  <div
                    className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden ${
                      index === currentVideo ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => {
                      setCurrentVideo(index);
                      setIsPlaying(true);
                    }}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>
    </div>
  );
};
