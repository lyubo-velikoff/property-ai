import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Image } from '@avalon/shared-types';

interface ImagePreviewProps {
  images: File[];
  existingImages?: Image[];
  onRemove?: (index: number) => void;
  onRemoveExisting?: (id: string) => void;
  className?: string;
}

export default function ImagePreview({ 
  images, 
  existingImages = [], 
  onRemove, 
  onRemoveExisting,
  className = '' 
}: ImagePreviewProps) {
  if (!images.length && !existingImages.length) return null;

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {/* Existing Images */}
      {existingImages.map((image) => (
        <div key={image.id} className="relative group">
          <div className="aspect-w-3 aspect-h-2 w-full overflow-hidden rounded-lg">
            <img
              src={image.url}
              alt="Property"
              className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/images/property-placeholder.webp';
              }}
            />
            {onRemoveExisting && (
              <button
                type="button"
                onClick={() => onRemoveExisting(image.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/70 hover:bg-white/90 text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:text-red-500"
                title="Премахни"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* New Images */}
      {images.map((image, index) => (
        <div key={`new-${index}`} className="relative group">
          <div className="aspect-w-3 aspect-h-2 w-full overflow-hidden rounded-lg">
            <img
              src={URL.createObjectURL(image)}
              alt={`Preview ${index + 1}`}
              className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
            />
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/70 hover:bg-white/90 text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:text-red-500"
                title="Премахни"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 
