'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselSlide {
  _key?: string;
  usePlaceholder?: boolean;
  caption?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageAlignHorizontal?: 'left' | 'center' | 'right' | null;
  imageAlignVertical?: 'top' | 'center' | 'bottom' | null;
}

function getImageObjectPosition(slide: CarouselSlide): string {
  const horizontal =
    slide.imageAlignHorizontal === 'left' || slide.imageAlignHorizontal === 'right'
      ? slide.imageAlignHorizontal
      : 'center';
  const vertical =
    slide.imageAlignVertical === 'top' || slide.imageAlignVertical === 'bottom'
      ? slide.imageAlignVertical
      : 'center';
  return `${horizontal} ${vertical}`;
}

export interface CarouselData {
  _id?: string;
  title?: string;
  heading?: string;
  slides?: CarouselSlide[];
  layout?: 'fullWidth' | 'contained' | 'cards';
  cardsPerView?: number;
  scrolling?: 'auto' | 'manual';
  autoPlayDelay?: number;
}

interface CarouselProps {
  sectionId?: string;
  carousel?: CarouselData | null;
}

function useCardsPerView(cardsPerView: number) {
  const [effectiveCardsPerView, setEffectiveCardsPerView] = useState(1);

  useEffect(() => {
    const update = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth < 1024;
      if (isMobile) {
        setEffectiveCardsPerView(1);
      } else if (isTablet) {
        setEffectiveCardsPerView(Math.min(cardsPerView, 2));
      } else {
        setEffectiveCardsPerView(cardsPerView);
      }
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [cardsPerView]);

  return effectiveCardsPerView;
}

function BrandTriangleOutline({ className = 'h-20 w-auto md:h-28' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 91 104"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M88.602 52 L2 2 L2 102 Z"
        fill="none"
        stroke="#FF0066"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CarouselSlideContent({ slide }: { slide: CarouselSlide }) {
  const captionClassName =
    'heading_h3 mt-4 px-1 !text-black transition-colors duration-200 group-hover:!text-[#FF0066]';

  if (slide.usePlaceholder) {
    return (
      <div className="flex h-full w-full flex-col">
        <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden bg-white">
          <BrandTriangleOutline />
        </div>
        {slide.caption && (
          <p className={captionClassName}>{slide.caption}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F8F9FA]">
        {slide.imageUrl ? (
          <>
            <img
              src={slide.imageUrl}
              alt={slide.imageAlt || slide.caption || 'Carousel slide'}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              style={{ objectPosition: getImageObjectPosition(slide) }}
            />
            <div
              className="pointer-events-none absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              aria-hidden
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="heading_h3 text-gray-500">No image</p>
          </div>
        )}
      </div>
      {slide.caption && (
        <p className={captionClassName}>{slide.caption}</p>
      )}
    </div>
  );
}

const Carousel = ({ sectionId, carousel }: CarouselProps) => {
  const slides = carousel?.slides ?? [];
  const layout = carousel?.layout ?? 'fullWidth';
  const scrolling = carousel?.scrolling ?? 'manual';
  const autoPlayDelay = carousel?.autoPlayDelay ?? 5;
  const cardsPerView = Math.min(Math.max(carousel?.cardsPerView ?? 3, 1), 6);
  const isCardsLayout = layout === 'cards';
  const effectiveCardsPerView = useCardsPerView(isCardsLayout ? cardsPerView : 1);
  const visibleCount = isCardsLayout ? effectiveCardsPerView : 1;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const isInfiniteAuto = scrolling === 'auto' && slides.length > 1;
  const canAutoScroll = slides.length > visibleCount;

  const trackSlides = useMemo(
    () => (isInfiniteAuto ? [...slides, ...slides] : slides),
    [isInfiniteAuto, slides]
  );

  const maxIndex = useMemo(
    () => Math.max(0, slides.length - visibleCount),
    [slides.length, visibleCount]
  );

  useEffect(() => {
    if (isInfiniteAuto) return;
    setCurrentIndex((index) => Math.min(index, maxIndex));
  }, [maxIndex, isInfiniteAuto]);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
    },
    [maxIndex]
  );

  const goNext = useCallback(() => {
    if (isInfiniteAuto) {
      setCurrentIndex((index) => index + 1);
      return;
    }
    setCurrentIndex((index) => (index >= maxIndex ? 0 : index + 1));
  }, [isInfiniteAuto, maxIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((index) => (index <= 0 ? maxIndex : index - 1));
  }, [maxIndex]);

  const handleTrackTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      if (
        !isInfiniteAuto ||
        event.target !== event.currentTarget ||
        event.propertyName !== 'transform'
      ) {
        return;
      }

      setCurrentIndex((index) => {
        if (index < slides.length) return index;
        setTransitionEnabled(false);
        return index - slides.length;
      });
    },
    [isInfiniteAuto, slides.length]
  );

  useEffect(() => {
    if (transitionEnabled) return;

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setTransitionEnabled(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [transitionEnabled, currentIndex]);

  useEffect(() => {
    if (scrolling !== 'auto' || !canAutoScroll || isPaused) return;

    const interval = window.setInterval(goNext, autoPlayDelay * 1000);
    return () => window.clearInterval(interval);
  }, [scrolling, canAutoScroll, isPaused, autoPlayDelay, goNext]);

  if (!carousel || slides.length === 0) {
    return null;
  }

  const slideWidthPercent = 100 / visibleCount;
  const trackStyle = {
    transform: `translateX(-${currentIndex * slideWidthPercent}%)`,
  };
  const trackTransitionClass = transitionEnabled
    ? 'transition-transform duration-500 ease-in-out'
    : '';

  const slideClassName = isCardsLayout
    ? 'shrink-0 px-2 md:px-3'
    : 'shrink-0';

  const slideStyle = isCardsLayout
    ? { width: `${slideWidthPercent}%` }
    : { width: `${slideWidthPercent}%` };

  const carouselTrack = (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className={`flex ${trackTransitionClass}`}
          style={trackStyle}
          onTransitionEnd={handleTrackTransitionEnd}
        >
          {trackSlides.map((slide, index) => (
            <div
              key={`${slide._key ?? 'slide'}-${index}`}
              className={`${slideClassName} group cursor-pointer`}
              style={slideStyle}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="h-full">
                <CarouselSlideContent slide={slide} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {scrolling === 'manual' && slides.length > visibleCount && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-md transition-colors hover:bg-[#FF0066] hover:text-white md:left-4"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-md transition-colors hover:bg-[#FF0066] hover:text-white md:right-4"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
    </div>
  );

  const dots =
    scrolling === 'manual' && maxIndex > 0 ? (
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goTo(index)}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              index === currentIndex ? 'bg-[#FF0066]' : 'bg-black/20 hover:bg-black/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    ) : null;

  const displayTitle = carousel.heading?.trim() || carousel.title?.trim();
  const sectionTitle = displayTitle ? (
    <div className="mb-16">
      <h1 className="display_h1 brand-color">{displayTitle}</h1>
    </div>
  ) : null;

  if (layout === 'fullWidth') {
    return (
      <section id={sectionId} className="w-full">
        {sectionTitle && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">{sectionTitle}</div>
          </div>
        )}
        <div className="w-full">
          {carouselTrack}
          {dots && <div className="container mx-auto px-4 sm:px-6 lg:px-8">{dots}</div>}
        </div>
      </section>
    );
  }

  return (
    <section id={sectionId} className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="row">
          {sectionTitle}
          {carouselTrack}
          {dots}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
