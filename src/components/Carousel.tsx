'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
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
        strokeOpacity={0.35}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const captionClassName = (isHovered: boolean) =>
  `heading_h3 px-1 transition-colors duration-200 ${
    isHovered ? '!text-[#FF0066]' : '!text-black'
  }`;

function CarouselSlideImage({ slide }: { slide: CarouselSlide }) {
  if (slide.usePlaceholder) {
    return (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-white">
        <BrandTriangleOutline />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#F8F9FA]">
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
  );
}

function CarouselSlideCaption({ slide, isHovered }: { slide: CarouselSlide; isHovered: boolean }) {
  if (!slide.caption) return null;

  return <p className={captionClassName(isHovered)}>{slide.caption}</p>;
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
  const [hoveredTrackIndex, setHoveredTrackIndex] = useState<number | null>(null);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const SWIPE_THRESHOLD_PX = 50;

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
    if (isInfiniteAuto) {
      setCurrentIndex((index) => {
        if (index > 0) return index - 1;
        setTransitionEnabled(false);
        return slides.length;
      });
      return;
    }
    setCurrentIndex((index) => (index <= 0 ? maxIndex : index - 1));
  }, [isInfiniteAuto, maxIndex, slides.length]);

  useEffect(() => {
    if (!isInfiniteAuto || transitionEnabled || currentIndex !== slides.length) return;

    const frame = requestAnimationFrame(() => {
      setTransitionEnabled(true);
      setCurrentIndex(slides.length - 1);
    });
    return () => cancelAnimationFrame(frame);
  }, [isInfiniteAuto, transitionEnabled, currentIndex, slides.length]);

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

  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    if (!canAutoScroll) return;

    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsPaused(true);
  }, [canAutoScroll]);

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      const start = touchStartRef.current;
      touchStartRef.current = null;

      if (!start || !canAutoScroll) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;

      if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
      if (Math.abs(deltaX) < Math.abs(deltaY)) return;

      if (deltaX < 0) goNext();
      else goPrev();
    },
    [canAutoScroll, goNext, goPrev]
  );

  const handleTouchCancel = useCallback(() => {
    touchStartRef.current = null;
  }, []);

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

  const showArrows = canAutoScroll;
  const imageViewportAspectRatio = `${16 * visibleCount} / 9`;

  const arrowInsetLeftClassName = isCardsLayout ? 'left-0 md:left-3' : 'left-0';
  const arrowInsetRightClassName = isCardsLayout ? 'right-0 md:right-3' : 'right-0';

  const arrowButtonClassName =
    'pointer-events-auto absolute inset-y-0 z-10 flex h-full w-24 cursor-pointer items-center justify-center bg-transparent text-[#FF0066] transition-colors hover:bg-white/90 sm:w-28';

  const renderSlideCells = (
    renderContent: (slide: CarouselSlide, index: number) => ReactNode
  ) =>
    trackSlides.map((slide, index) => (
      <div
        key={`${slide._key ?? 'slide'}-${index}`}
        className={`${slideClassName} group shrink-0 cursor-pointer`}
        style={slideStyle}
        onMouseEnter={() => {
          setIsPaused(true);
          setHoveredTrackIndex(index);
        }}
      >
        {renderContent(slide, index)}
      </div>
    ));

  const carouselTrack = (
    <div
      className="relative touch-pan-y"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setHoveredTrackIndex(null);
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: imageViewportAspectRatio }}
      >
        <div
          className={`flex h-full ${trackTransitionClass}`}
          style={trackStyle}
          onTransitionEnd={handleTrackTransitionEnd}
        >
          {renderSlideCells((slide) => (
            <CarouselSlideImage slide={slide} />
          ))}
        </div>

        {showArrows && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className={`${arrowButtonClassName} ${arrowInsetLeftClassName}`}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-14 w-14 sm:h-16 sm:w-16" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className={`${arrowButtonClassName} ${arrowInsetRightClassName}`}
              aria-label="Next slide"
            >
              <ChevronRight className="h-14 w-14 sm:h-16 sm:w-16" />
            </button>
          </>
        )}
      </div>

      <div className="overflow-hidden pt-6">
        <div className={`flex ${trackTransitionClass}`} style={trackStyle}>
          {renderSlideCells((slide, index) => (
            <CarouselSlideCaption slide={slide} isHovered={hoveredTrackIndex === index} />
          ))}
        </div>
      </div>
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
