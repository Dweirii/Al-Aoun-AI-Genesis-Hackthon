"use client";

import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { ChevronLeftIcon, ChevronRightIcon, ZoomInIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export interface ImageDisplayProps {
  imageUrls: string[];
  className?: string;
}

export function ImageDisplay({ imageUrls, className }: ImageDisplayProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  if (imageUrls.length === 0) {
    return null;
  }

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev === null ? null : (prev - 1 + imageUrls.length) % imageUrls.length));
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % imageUrls.length));
    }
  };

  const gridClass = imageUrls.length === 1 
    ? "grid-cols-1" 
    : imageUrls.length === 2 
    ? "grid-cols-2" 
    : "grid-cols-2";

  const currentImageUrl = selectedIndex !== null ? imageUrls[selectedIndex] : null;

  return (
    <>
      <div
        className={cn(
          "grid gap-1.5 w-full mb-1",
          gridClass,
          className
        )}
      >
        {imageUrls.map((url, index) => {
          if (imageErrors.has(index)) {
            return (
              <div
                key={index}
                className="relative rounded-lg border border-border/50 overflow-hidden bg-muted/20 flex items-center justify-center"
                style={{
                  minHeight: imageUrls.length === 1 ? "180px" : "120px",
                }}
              >
                <div className="text-xs text-muted-foreground p-4 text-center">
                  Failed to load image
                </div>
              </div>
            );
          }

          return (
            <div
              key={index}
              className="relative rounded-lg border border-border/50 overflow-hidden bg-muted/20 cursor-pointer group hover:border-border transition-colors"
              onClick={() => setSelectedIndex(index)}
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-auto object-cover"
                style={{
                  maxHeight: imageUrls.length === 1 ? "180px" : "120px",
                  objectFit: "cover",
                  display: "block",
                }}
                loading="lazy"
                onError={() => handleImageError(index)}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <ZoomInIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={selectedIndex !== null} onOpenChange={(open) => {
        if (!open) {
          setSelectedIndex(null);
        }
      }}>
        {currentImageUrl && (
          <DialogContent 
            className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 bg-black/95 border-none"
            showCloseButton={true}
          >
            <div className="relative flex items-center justify-center w-full h-full min-h-[50vh]">
              {imageUrls.length > 1 && selectedIndex !== null && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 z-10 bg-black/50 hover:bg-black/70 text-white border-none"
                    onClick={handlePrevious}
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 z-10 bg-black/50 hover:bg-black/70 text-white border-none"
                    onClick={handleNext}
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </Button>
                </>
              )}
              <img
                src={currentImageUrl}
                alt={`Image ${selectedIndex !== null ? selectedIndex + 1 : 1}`}
                className="max-w-full max-h-[95vh] object-contain"
                onError={() => selectedIndex !== null && handleImageError(selectedIndex)}
              />
              {imageUrls.length > 1 && selectedIndex !== null && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                  {selectedIndex + 1} / {imageUrls.length}
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

