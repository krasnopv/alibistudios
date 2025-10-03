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
  };
  credits: {
    role: string;
    person: {
      type: string;
      teamMember?: {
        fullName: string;
        name: string;
      };
      manualName?: string;
    };
    award?: {
      _id: string;
      name: string;
    };
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

const ProjectPage = () => {
  const params = useParams();
  const projectSlug = params.slug;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVideoOverlay, setShowVideoOverlay] = useState(false);

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

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/slug/${projectSlug}`);
        const data = await response.json();
        console.log('Project data:', data);
        console.log('Project images:', data.images);
        setProject(data);
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
                    <div 
                      className="relative w-full aspect-video overflow-hidden cursor-pointer group"
                      onClick={() => setShowVideoOverlay(true)}
                    >
                      <img
                        src={project.videoTrailer.thumbnailUrl}
                        alt={project.videoTrailer.thumbnailAlt || 'Video trailer thumbnail'}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                        <img
                          src="/play.svg"
                          alt="Play video"
                          className="w-[43px] h-[50px]"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-2xl font-bold mb-2">Watch Trailer</div>
                          <div className="text-sm opacity-90">Click to play</div>
                        </div>
                      </div>
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
                              <p className="font-semibold text-sm text-gray-600">
                                {credit.person && (
                                  credit.person.type === 'teamMember' 
                                    ? credit.person.teamMember?.fullName
                                    : credit.person.manualName
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {project.credits.some(credit => credit.award) && (
                        <div className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-sm">Award</span>
                              <p className="font-semibold text-sm text-gray-600">
                                {project.credits.find(credit => credit.award)?.award?.name || 'Unknown Award'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
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
                                <p className="font-semibold text-sm text-gray-600">
                                  {credit.person && (
                                    credit.person.type === 'teamMember' 
                                      ? credit.person.teamMember?.fullName
                                      : credit.person.manualName
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {project.credits.some(credit => credit.award) && (
                          <div className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-sm">Award</span>
                                <p className="font-semibold text-sm text-gray-600">
                                  {project.credits.find(credit => credit.award)?.award?.name || 'Unknown Award'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Images Gallery (2/3) */}
                <div className="w-2/3">
                  {/* Video Trailer Thumbnail */}
                  {project.videoTrailer && (
                    <div className="mb-6">
                      <div 
                        className="relative w-full aspect-video overflow-hidden cursor-pointer group"
                        onClick={() => setShowVideoOverlay(true)}
                      >
                        <img
                          src={project.videoTrailer.thumbnailUrl}
                          alt={project.videoTrailer.thumbnailAlt || 'Video trailer thumbnail'}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                          <img
                            src="/play.svg"
                            alt="Play video"
                            className="w-[43px] h-[50px]"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="text-2xl font-bold mb-2">Watch Trailer</div>
                            <div className="text-sm opacity-90">Click to play</div>
                          </div>
                        </div>
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
