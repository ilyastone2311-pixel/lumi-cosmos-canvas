import { cn } from "@/lib/utils";
import React from "react";

interface SkeletonCardProps {
  className?: string;
  variant?: "article" | "category" | "small";
  style?: React.CSSProperties;
}

export const SkeletonCard = ({ className, variant = "article", style }: SkeletonCardProps) => {
  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden bg-card/60 backdrop-blur-sm border border-border/50",
        className
      )}
      style={style}
    >
      {/* Animated glow overlay */}
      <div className="absolute inset-0 skeleton-glow" />
      
      {variant === "category" && (
        <>
          {/* Image skeleton */}
          <div className="h-40 sm:h-48 bg-muted/30 skeleton-pulse" />
          {/* Content skeleton */}
          <div className="p-4 sm:p-6 space-y-3">
            <div className="h-5 w-3/4 rounded-md bg-muted/40 skeleton-pulse" />
            <div className="h-4 w-full rounded-md bg-muted/30 skeleton-pulse" />
            <div className="h-4 w-2/3 rounded-md bg-muted/30 skeleton-pulse" />
          </div>
        </>
      )}
      
      {variant === "article" && (
        <div className="p-5 space-y-4">
          {/* Badge skeleton */}
          <div className="h-6 w-20 rounded-full bg-muted/40 skeleton-pulse" />
          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="h-5 w-full rounded-md bg-muted/40 skeleton-pulse" />
            <div className="h-5 w-4/5 rounded-md bg-muted/30 skeleton-pulse" />
          </div>
          {/* Excerpt skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded-md bg-muted/30 skeleton-pulse" />
            <div className="h-4 w-3/4 rounded-md bg-muted/30 skeleton-pulse" />
          </div>
          {/* Meta skeleton */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <div className="h-4 w-16 rounded-md bg-muted/30 skeleton-pulse" />
              <div className="h-4 w-12 rounded-md bg-muted/30 skeleton-pulse" />
            </div>
            <div className="h-4 w-8 rounded-md bg-muted/30 skeleton-pulse" />
          </div>
        </div>
      )}
      
      {variant === "small" && (
        <div className="p-4 space-y-3">
          <div className="h-4 w-16 rounded-full bg-muted/40 skeleton-pulse" />
          <div className="h-4 w-full rounded-md bg-muted/30 skeleton-pulse" />
          <div className="h-4 w-2/3 rounded-md bg-muted/30 skeleton-pulse" />
        </div>
      )}
    </div>
  );
};

export const ArticlePageSkeleton = () => {
  return (
    <div className="container mx-auto max-w-3xl animate-fade-in">
      {/* Back button skeleton */}
      <div className="h-6 w-16 rounded-md bg-muted/30 skeleton-pulse mb-8" />
      
      {/* Header skeleton */}
      <div className="mb-8 sm:mb-12 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-7 w-24 rounded-full bg-primary/20 skeleton-pulse" />
          <div className="h-8 w-8 rounded-full bg-muted/30 skeleton-pulse" />
        </div>
        <div className="space-y-3">
          <div className="h-8 sm:h-10 w-full rounded-lg bg-muted/40 skeleton-pulse" />
          <div className="h-8 sm:h-10 w-3/4 rounded-lg bg-muted/30 skeleton-pulse" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-4 w-24 rounded-md bg-muted/30 skeleton-pulse" />
          <div className="h-4 w-20 rounded-md bg-muted/30 skeleton-pulse" />
          <div className="h-4 w-16 rounded-md bg-muted/30 skeleton-pulse" />
        </div>
      </div>
      
      {/* Audio player skeleton */}
      <div className="rounded-2xl bg-card/60 border border-border/50 p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 skeleton-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-2 w-full rounded-full bg-muted/30 skeleton-pulse" />
            <div className="flex justify-between">
              <div className="h-3 w-10 rounded bg-muted/30 skeleton-pulse" />
              <div className="h-3 w-10 rounded bg-muted/30 skeleton-pulse" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Action bar skeleton */}
      <div className="flex items-center gap-3 mb-10 pb-6 border-b border-border/30">
        <div className="h-9 w-20 rounded-full bg-muted/30 skeleton-pulse" />
        <div className="h-9 w-20 rounded-full bg-muted/30 skeleton-pulse" />
        <div className="h-9 w-20 rounded-full bg-muted/30 skeleton-pulse" />
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 w-1/3 rounded-lg bg-muted/40 skeleton-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded-md bg-muted/30 skeleton-pulse" />
              <div className="h-4 w-full rounded-md bg-muted/30 skeleton-pulse" />
              <div className="h-4 w-4/5 rounded-md bg-muted/30 skeleton-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 6, variant = "article" }: { count?: number; variant?: "article" | "category" }) => {
  return (
    <div className={cn(
      "grid gap-4 sm:gap-6",
      variant === "category" 
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard 
          key={i} 
          variant={variant}
          className="animate-fade-in"
          style={{ animationDelay: `${i * 50}ms` } as React.CSSProperties}
        />
      ))}
    </div>
  );
};
