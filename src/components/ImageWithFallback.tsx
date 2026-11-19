import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle = 'Trustline Collection Services',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0B1F3A] via-[#132D52] to-[#071426] p-8 text-center text-white ${className}`}
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-[#C6973F]/40 bg-[#C6973F]/10 text-[#C6973F]">
          <Building2 className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-slate-200">{fallbackTitle}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
