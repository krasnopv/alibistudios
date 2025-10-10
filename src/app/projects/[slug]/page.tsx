'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import BlockContent from '@sanity/block-content-to-react';
import { serializers } from '@/lib/serializers';
import VideoOverlay from '@/components/VideoOverlay';

interface Project {
  _id: string;
  title: string;
  subtitle: string;
  description: string | unknown;
  fullTitle: string;
  videoTrailer?: {
    type: 'youtube' | 'vimeo' | 'upload';
    url?: string;
    videoFileUrl?: string;
    thumbnailUrl?: string;
    thumbnailAlt?: string;
    thumbnailSmall?: string;
    thumbnailMedium?: string;
    thumbnailLarge?: string;
  };
  credits: {
    role: string;
    people: {
      type: string;
      teamMember?: {
        fullName: string;
        name: string;
      };
      manualName?: string;
    }[];
  }[];
  awards?: {
    _id: string;
    name: string;
    year?: number;
    category?: string;
    description?: string;
  }[];
  images: {
    _id: string;
    imageUrl: string;
    imageAlt: string;
  }[];
  relatedProjects: {
    _id: string;
    title: string;
    subtitle: string;
    slug: string;
    imageUrl: string;
    imageAlt: string;
  }[];
  services?: {
    _id: string;
    title: string;
    slug: string;
  }[];
  imageUrl: string;
  imageAlt: string;
}

interface VideoWithThumbnailProps {
  videoUrl: string;
  thumbnailUrl?: string;
  thumbnailAlt?: string;
  videoId: string;
  onLoadStart: (videoId: string) => void;
  onCanPlay: (videoId: string) => void;
  onError: (videoId: string) => void;
  isLoading: boolean;
  className?: string;
}

const VideoWithThumbnail = ({ 
  videoUrl, 
  thumbnailUrl, 
  thumbnailAlt, 
  videoId, 
  onLoadStart, 
  onCanPlay, 
  onError, 
  isLoading,
  className = "w-full h-full object-cover"
}: VideoWithThumbnailProps) => {
  return (
    <div className="relative w-full h-full">
      {/* Video Element */}
      <video
        src={videoUrl}
        className={className}
        autoPlay
        muted
        loop
        playsInline
        controls
        preload="auto"
        onLoadStart={() => onLoadStart(videoId)}
        onCanPlay={() => onCanPlay(videoId)}
        onError={() => onError(videoId)}
      />
      
      {/* Thumbnail Overlay - Show while loading */}
      {isLoading && thumbnailUrl && (
        <div className="absolute inset-0 bg-black">
          <img
            src={thumbnailUrl}
            alt={thumbnailAlt || 'Video thumbnail'}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

interface IframeWithThumbnailProps {
  embedUrl: string;
  thumbnailUrl?: string;
  thumbnailAlt?: string;
  iframeId: string;
  onLoad: (iframeId: string) => void;
  isLoading: boolean;
  className?: string;
  title?: string;
}

const IframeWithThumbnail = ({ 
  embedUrl, 
  thumbnailUrl, 
  thumbnailAlt, 
  iframeId, 
  onLoad, 
  isLoading,
  className = "w-full h-full",
  title = "Video trailer"
}: IframeWithThumbnailProps) => {
  return (
    <div className="relative w-full h-full">
      {/* Iframe Element */}
      <iframe
        src={embedUrl}
        className={className}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        title={title}
        loading="eager"
        onLoad={() => onLoad(iframeId)}
      />
      
      {/* Thumbnail Overlay - Show while loading */}
      {isLoading && thumbnailUrl && (
        <div className="absolute inset-0 bg-black">
          <img
            src={thumbnailUrl}
            alt={thumbnailAlt || 'Video thumbnail'}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

const ProjectPage = () => {
  const params = useParams();
  const projectSlug = params.slug;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVideoOverlay, setShowVideoOverlay] = useState(false);
  const [videoLoadingStates, setVideoLoadingStates] = useState<{[key: string]: boolean}>({});

  const renderRichText = (description: string | unknown) => {
    // Handle null/undefined
    if (!description) {
      return null;
    }
    
    // Handle string description
    if (typeof description === 'string') {
      return description.split('\n').map((paragraph, index) => (
        <p key={`paragraph-${index}-${projectSlug}`} className="mb-4 last:mb-0">
          {paragraph}
        </p>
      ));
    }
    
    // Handle Sanity Portable Text
    if (Array.isArray(description)) {
      return <BlockContent blocks={description} serializers={serializers} />;
    }
    
    // Fallback for other data types
    return (
      <p key={`fallback-${projectSlug}`} className="mb-4 last:mb-0">
        {String(description)}
      </p>
    );
  };

  const handleVideoLoadStart = (videoId: string) => {
    setVideoLoadingStates(prev => ({ ...prev, [videoId]: true }));
  };

  const handleVideoCanPlay = (videoId: string) => {
    // Wait 1 second after video can play, then hide thumbnail
    setTimeout(() => {
      setVideoLoadingStates(prev => ({ ...prev, [videoId]: false }));
    }, 1000);
  };

  const handleVideoError = (videoId: string) => {
    // Hide thumbnail on error
    setVideoLoadingStates(prev => ({ ...prev, [videoId]: false }));
  };

  const handleIframeLoad = (iframeId: string) => {
    // Wait 1 second after iframe loads, then hide thumbnail
    setTimeout(() => {
      setVideoLoadingStates(prev => ({ ...prev, [iframeId]: false }));
    }, 1000);
  };

  const getOptimalThumbnail = (videoTrailer: Project['videoTrailer'], containerWidth: number = 800) => {
    if (!videoTrailer) return undefined;
    
    // Choose thumbnail size based on container width
    if (containerWidth <= 400) {
      return videoTrailer.thumbnailSmall || videoTrailer.thumbnailUrl;
    } else if (containerWidth <= 800) {
      return videoTrailer.thumbnailMedium || videoTrailer.thumbnailUrl;
    } else {
      return videoTrailer.thumbnailLarge || videoTrailer.thumbnailUrl;
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/slug/${projectSlug}`);
        const data = await response.json();
        console.log('Project data:', data);
        console.log('Project images:', data.images);
        setProject(data);
        
        // Initialize loading states for all video types
        if (data.videoTrailer) {
          const videoUrl = data.videoTrailer.type === 'upload' 
            ? (data.videoTrailer.videoFileUrl || null)
            : (data.videoTrailer.url || null);
          
          if (videoUrl) {
            const initialStates: {[key: string]: boolean} = {};
            
            if (videoUrl.includes('youtube.com/watch?v=') || videoUrl.includes('youtu.be/')) {
              initialStates[`mobile-youtube-${projectSlug}`] = true;
              initialStates[`desktop-youtube-${projectSlug}`] = true;
            } else if (videoUrl.includes('vimeo.com/')) {
              initialStates[`mobile-vimeo-${projectSlug}`] = true;
              initialStates[`desktop-vimeo-${projectSlug}`] = true;
            } else {
              initialStates[`mobile-video-${projectSlug}`] = true;
              initialStates[`desktop-video-${projectSlug}`] = true;
            }
            
            setVideoLoadingStates(initialStates);
          }
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    if (projectSlug) {
      fetchProject();
    }
  }, [projectSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
        <Header />
        <main className="w-full flex flex-col items-center no-hero">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0066]"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
        <Header />
        <main className="w-full flex flex-col items-center no-hero">
          <div className="flex justify-center items-center py-20">
            <h1 className="display_h1 brand-color">Project not found</h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
      <Header />
      <main className="w-full flex flex-col items-center no-hero">
        {/* Project Content */}
        <section className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              {/* Mobile Layout */}
              <div className="flex flex-col md:hidden gap-6 mb-8">
                {/* Back Link */}
                <div>
                  {project.services && project.services.length > 0 ? (
                    <Link href={`/services/${project.services[0].slug}`} className="body_regular text-black hover:text-[#FF0066] transition-colors">
                      <span className="text-[#FF0066] text-3xl">←</span> {project.services[0].title}
                    </Link>
                  ) : (
                    <Link href="/projects" className="body_regular text-black hover:text-[#FF0066] transition-colors">
                      <span className="text-[#FF0066] text-3xl">←</span> All Projects
                    </Link>
                  )}
                </div>

                {/* Full Title */}
                <div>
                  <h1 className="heading_h1">
                    {typeof project.fullTitle === 'string' ? project.fullTitle : String(project.fullTitle)}
                  </h1>
                </div>

                {/* Video Trailer */}
                {project.videoTrailer && (
                  <div>
                    <div className="relative w-full aspect-video overflow-hidden">
                      {(() => {
                        const videoUrl = project.videoTrailer.type === 'upload' 
                          ? (project.videoTrailer.videoFileUrl || null)
                          : (project.videoTrailer.url || null);
                        
                        if (videoUrl) {
                          // For YouTube videos
                          if (videoUrl.includes('youtube.com/watch?v=') || videoUrl.includes('youtu.be/')) {
                            const videoId = videoUrl.includes('youtube.com/watch?v=') 
                              ? videoUrl.split('v=')[1].split('&')[0]
                              : videoUrl.split('youtu.be/')[1].split('?')[0];
                            const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`;
                            const mobileYouTubeId = `mobile-youtube-${projectSlug}`;
                            
                            return (
                              <IframeWithThumbnail
                                embedUrl={embedUrl}
                                thumbnailUrl={getOptimalThumbnail(project.videoTrailer, 400)}
                                thumbnailAlt={project.videoTrailer.thumbnailAlt}
                                iframeId={mobileYouTubeId}
                                onLoad={handleIframeLoad}
                                isLoading={videoLoadingStates[mobileYouTubeId] || false}
                                className="w-full h-full"
                                title="Video trailer"
                              />
                            );
                          }
                          
                          // For Vimeo videos
                          if (videoUrl.includes('vimeo.com/')) {
                            const videoId = videoUrl.split('vimeo.com/')[1].split('?')[0];
                            const embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1`;
                            const mobileVimeoId = `mobile-vimeo-${projectSlug}`;
                            
                            return (
                              <IframeWithThumbnail
                                embedUrl={embedUrl}
                                thumbnailUrl={getOptimalThumbnail(project.videoTrailer, 400)}
                                thumbnailAlt={project.videoTrailer.thumbnailAlt}
                                iframeId={mobileVimeoId}
                                onLoad={handleIframeLoad}
                                isLoading={videoLoadingStates[mobileVimeoId] || false}
                                className="w-full h-full"
                                title="Video trailer"
                              />
                            );
                          }
                          
                          // For direct video files
                          const mobileVideoId = `mobile-video-${projectSlug}`;
                          return (
                            <VideoWithThumbnail
                              videoUrl={videoUrl}
                              thumbnailUrl={getOptimalThumbnail(project.videoTrailer, 400)}
                              thumbnailAlt={project.videoTrailer.thumbnailAlt}
                              videoId={mobileVideoId}
                              onLoadStart={handleVideoLoadStart}
                              onCanPlay={handleVideoCanPlay}
                              onError={handleVideoError}
                              isLoading={videoLoadingStates[mobileVideoId] || false}
                              className="w-full h-full object-cover"
                            />
                          );
                        }
                        
                        // Fallback to thumbnail if no video URL
                        return (
                          <img
                            src={getOptimalThumbnail(project.videoTrailer, 400)}
                            alt={project.videoTrailer.thumbnailAlt || 'Video trailer thumbnail'}
                            className="w-full h-full object-cover"
                          />
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <div className="prose prose-gray max-w-none">
                    {renderRichText(project.description)}
                  </div>
                </div>

                {/* Images Gallery */}
                {project.images && project.images.length > 0 && (
                  <div>
                    <div className="grid grid-cols-1 gap-4">
                      {project.images.map((image, index) => (
                        <div key={`image-mobile-${projectSlug}-${image._id || index}`} className="aspect-video">
                          <img
                            src={image.imageUrl}
                            alt={image.imageAlt || `Project image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Image failed to load:', image.imageUrl);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Credits */}
                {project.credits && project.credits.length > 0 && (
                  <div>
                    <p 
                      className="uppercase"
                      style={{ marginBottom: 'calc(var(--spacing) * 12)' }}
                    >
                      Credits
                    </p>
                    <div className="space-y-3">
                      {project.credits.map((credit, index) => (
                        <div key={`credit-mobile-${projectSlug}-${index}`} className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-sm">{typeof credit.role === 'string' ? credit.role : String(credit.role)}</span>
                              {credit.people && credit.people.length > 0 && (
                                <div className="space-y-1">
                                  {credit.people.map((person, personIndex) => (
                                    <p key={`person-mobile-${index}-${personIndex}`} className="font-semibold text-sm text-gray-600">
                                      {person.type === 'teamMember' 
                                        ? person.teamMember?.fullName
                                        : person.manualName
                                      }
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex gap-8 mb-8">
                {/* Left Column - Project Info (1/3) */}
                <div className="w-1/3">
                  {/* Back Link */}
                  <div className="mb-12">
                    {project.services && project.services.length > 0 ? (
                      <Link href={`/services/${project.services[0].slug}`} className="body_regular text-black hover:text-[#FF0066] transition-colors">
                        <span className="text-[#FF0066] text-3xl">←</span> {project.services[0].title}
                      </Link>
                    ) : (
                      <Link href="/projects" className="body_regular text-black hover:text-[#FF0066] transition-colors">
                        <span className="text-[#FF0066] text-3xl">←</span> All Projects
                      </Link>
                    )}
                  </div>

                  {/* Full Title */}
                  <div className="mb-12">
                    <h1 className="heading_h1">
                      {typeof project.fullTitle === 'string' ? project.fullTitle : String(project.fullTitle)}
                    </h1>
                  </div>

                  {/* Description */}
                  <div className="mb-12">
                    <div className="prose prose-gray max-w-none">
                      {renderRichText(project.description)}
                    </div>
                  </div>

                  {/* Credits */}
                  {project.credits && project.credits.length > 0 && (
                    <div className="mb-6">
                      <p 
                        className="uppercase"
                        style={{ marginBottom: 'calc(var(--spacing) * 12)' }}
                      >
                        Credits
                      </p>
                      <div className="space-y-3">
                        {project.credits.map((credit, index) => (
                          <div key={`credit-desktop-${projectSlug}-${index}`} className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-sm">{typeof credit.role === 'string' ? credit.role : String(credit.role)}</span>
                                {credit.people && credit.people.length > 0 && (
                                  <div className="space-y-1">
                                    {credit.people.map((person, personIndex) => (
                                      <p key={`person-desktop-${index}-${personIndex}`} className="font-semibold text-sm text-gray-600">
                                        {person.type === 'teamMember' 
                                          ? person.teamMember?.fullName
                                          : person.manualName
                                        }
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Awards */}
                  {project.awards && project.awards.length > 0 && (
                    <div className="mb-6">
                      <p 
                        className="uppercase"
                        style={{ marginBottom: 'calc(var(--spacing) * 12)' }}
                      >
                        Awards
                      </p>
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            {project.awards.map((award, index) => (
                              <div key={`award-desktop-${projectSlug}-${index}`} className="pb-2">
                                <span className="font-semibold text-sm text-gray-600">
                                  {award.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Images Gallery (2/3) */}
                <div className="w-2/3">
                  {/* Video Trailer */}
                  {project.videoTrailer && (
                    <div className="mb-6">
                      <div className="relative w-full aspect-video overflow-hidden">
                        {(() => {
                          const videoUrl = project.videoTrailer.type === 'upload' 
                            ? (project.videoTrailer.videoFileUrl || null)
                            : (project.videoTrailer.url || null);
                          
                          if (videoUrl) {
                            // For YouTube videos
                            if (videoUrl.includes('youtube.com/watch?v=') || videoUrl.includes('youtu.be/')) {
                              const videoId = videoUrl.includes('youtube.com/watch?v=') 
                                ? videoUrl.split('v=')[1].split('&')[0]
                                : videoUrl.split('youtu.be/')[1].split('?')[0];
                              const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`;
                              const desktopYouTubeId = `desktop-youtube-${projectSlug}`;
                              
                              return (
                                <IframeWithThumbnail
                                  embedUrl={embedUrl}
                                  thumbnailUrl={getOptimalThumbnail(project.videoTrailer, 800)}
                                  thumbnailAlt={project.videoTrailer.thumbnailAlt}
                                  iframeId={desktopYouTubeId}
                                  onLoad={handleIframeLoad}
                                  isLoading={videoLoadingStates[desktopYouTubeId] || false}
                                  className="w-full h-full"
                                  title="Video trailer"
                                />
                              );
                            }
                            
                            // For Vimeo videos
                            if (videoUrl.includes('vimeo.com/')) {
                              const videoId = videoUrl.split('vimeo.com/')[1].split('?')[0];
                              const embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1`;
                              const desktopVimeoId = `desktop-vimeo-${projectSlug}`;
                              
                              return (
                                <IframeWithThumbnail
                                  embedUrl={embedUrl}
                                  thumbnailUrl={getOptimalThumbnail(project.videoTrailer, 800)}
                                  thumbnailAlt={project.videoTrailer.thumbnailAlt}
                                  iframeId={desktopVimeoId}
                                  onLoad={handleIframeLoad}
                                  isLoading={videoLoadingStates[desktopVimeoId] || false}
                                  className="w-full h-full"
                                  title="Video trailer"
                                />
                              );
                            }
                            
                            // For direct video files
                            const desktopVideoId = `desktop-video-${projectSlug}`;
                            return (
                              <VideoWithThumbnail
                                videoUrl={videoUrl}
                                thumbnailUrl={getOptimalThumbnail(project.videoTrailer, 800)}
                                thumbnailAlt={project.videoTrailer.thumbnailAlt}
                                videoId={desktopVideoId}
                                onLoadStart={handleVideoLoadStart}
                                onCanPlay={handleVideoCanPlay}
                                onError={handleVideoError}
                                isLoading={videoLoadingStates[desktopVideoId] || false}
                                className="w-full h-full object-cover"
                              />
                            );
                          }
                          
                          // Fallback to thumbnail if no video URL
                          return (
                            <img
                              src={getOptimalThumbnail(project.videoTrailer, 800)}
                              alt={project.videoTrailer.thumbnailAlt || 'Video trailer thumbnail'}
                              className="w-full h-full object-cover"
                            />
                          );
                        })()}
                      </div>
                    </div>
                )}

                {/* Images Gallery */}
                  {project.images && project.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {project.images.map((image, index) => (
                        <div key={`image-desktop-${projectSlug}-${image._id || index}`} className="aspect-video">
                          <img
                            src={image.imageUrl}
                            alt={image.imageAlt || `Project image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Image failed to load:', image.imageUrl);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

              {/* Related Projects */}
              {project.relatedProjects && project.relatedProjects.length > 0 && (
          <section className="w-full bg-white py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="body_regular uppercase" style={{ marginBottom: 'calc(var(--spacing) * 4)' }}>Related Projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {project.relatedProjects.slice(0, 4).map((relatedProject, index) => (
                  <Link 
                    key={`related-${projectSlug}-${relatedProject._id || index}`} 
                    href={`/projects/${relatedProject.slug}`}
                    className="cursor-pointer group block"
                  >
                    <div className="aspect-[1.8/1] mb-4 overflow-hidden">
                          <img
                            src={relatedProject.imageUrl}
                            alt={relatedProject.imageAlt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                    <h3 className="body_regular mb-2">
                          {typeof relatedProject.title === 'string' ? relatedProject.title : String(relatedProject.title)}
                    </h3>
                    <p className="body_bold text-gray-600">
                          {typeof relatedProject.subtitle === 'string' ? relatedProject.subtitle : String(relatedProject.subtitle)}
                        </p>
                  </Link>
                    ))}
            </div>
          </div>
        </section>
        )}
      </main>
      
      {/* Video Overlay */}
      {showVideoOverlay && project.videoTrailer && (
        <VideoOverlay 
          videoUrl={
            project.videoTrailer.type === 'upload' 
              ? (project.videoTrailer.videoFileUrl || null)
              : (project.videoTrailer.url || null)
          } 
          onClose={() => setShowVideoOverlay(false)} 
        />
      )}
    </div>
  );
};

export default ProjectPage;
