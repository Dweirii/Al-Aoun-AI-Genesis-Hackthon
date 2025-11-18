"use client";

import { cn } from "@workspace/ui/lib/utils";

export interface ImageDisplayProps {
  imageUrls: string[];
  className?: string;
}

export function ImageDisplay({ imageUrls, className }: ImageDisplayProps) {
  if (imageUrls.length === 0) {
    return null;
  }

  const gridClass = imageUrls.length === 1 
    ? "grid-cols-1" 
    : imageUrls.length === 2 
    ? "grid-cols-2" 
    : "grid-cols-2";

  return (
    <div
      className={cn(
        "grid gap-1.5 w-full mb-1",
        gridClass,
        className
      )}
    >
      {imageUrls.map((url, index) => (
        <div
          key={index}
          className="relative rounded-lg border border-border/50 overflow-hidden bg-muted/20"
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
          />
        </div>
      ))}
    </div>
  );
}

