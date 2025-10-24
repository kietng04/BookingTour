import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { TourImage } from '@/lib/types'

interface TourGalleryProps {
  images: TourImage[]
  tourName: string
}

export function TourGallery({ images, tourName }: TourGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const displayImages = images.length > 0 
    ? images 
    : [{ id: 0, imageUrl: 'https://via.placeholder.com/800x600?text=No+Image', isPrimary: true }]

  const primaryImage = displayImages.find(img => img.isPrimary) || displayImages[0]


  const handlePrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + displayImages.length) % displayImages.length)
    }
  }

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % displayImages.length)
    }
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        {/* Main image */}
        <div 
          className="col-span-4 md:col-span-3 aspect-video rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => setSelectedIndex(0)}
        >
          <img
            src={primaryImage.imageUrl}
            alt={tourName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Thumbnail images */}
        {displayImages.slice(1, 4).map((image, index) => (
          <div
            key={image.id}
            className="aspect-square rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => setSelectedIndex(index + 1)}
          >
            <img
              src={image.imageUrl}
              alt={`${tourName} ${index + 2}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}

        {displayImages.length > 4 && (
          <div
            className="aspect-square rounded-lg overflow-hidden cursor-pointer bg-muted flex items-center justify-center"
            onClick={() => setSelectedIndex(4)}
          >
            <span className="text-lg font-semibold">+{displayImages.length - 4}</span>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedIndex(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation()
                handlePrevious()
              }}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <motion.img
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={displayImages[selectedIndex].imageUrl}
              alt={tourName}
              className="max-h-[80vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              {selectedIndex + 1} / {displayImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

