'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProjectOverlay from '@/components/ProjectOverlay';

interface Project {
  _id: string;
  title: string;
  subtitle: string;
  description: string | unknown;
  fullTitle: string;
  credits: {
    role: string;
    person: string;
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
    imageUrl: string;
    imageAlt: string;
  }[];
  imageUrl: string;
  imageAlt: string;
}

const Immersive = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback to mock data
        setProjects([
          {
            _id: '1',
            title: 'Virtual Reality Experience',
            subtitle: 'Immersive storytelling',
            description: 'A groundbreaking VR experience that transports users into a new dimension of storytelling.',
            fullTitle: 'The Future of Storytelling: Virtual Reality Experience',
            credits: [
              { role: 'Director', person: 'John Smith' },
              { role: 'Producer', person: 'Sarah Johnson', award: { _id: 'award-1', name: 'Best VR Production' } }
            ],
            images: [
              { _id: 'img-1', imageUrl: '/api/placeholder/600/400', imageAlt: 'VR Experience 1' },
              { _id: 'img-2', imageUrl: '/api/placeholder/600/400', imageAlt: 'VR Experience 2' }
            ],
            relatedProjects: [
              { _id: '2', title: 'AR Installation', subtitle: 'Interactive art', imageUrl: '/api/placeholder/300/200', imageAlt: 'AR Installation' }
            ],
            imageUrl: '/api/placeholder/400/300',
            imageAlt: 'Virtual Reality Experience'
          },
          {
            _id: '2',
            title: 'AR Installation',
            subtitle: 'Interactive art',
            description: 'An augmented reality installation that blends digital and physical worlds.',
            fullTitle: 'Digital Dreams: AR Installation',
            credits: [
              { role: 'Artist', person: 'Mike Chen' },
              { role: 'Technician', person: 'Emma Wilson' }
            ],
            images: [
              { _id: 'img-3', imageUrl: '/api/placeholder/600/400', imageAlt: 'AR Installation 1' }
            ],
            relatedProjects: [
              { _id: '1', title: 'Virtual Reality Experience', subtitle: 'Immersive storytelling', imageUrl: '/api/placeholder/300/200', imageAlt: 'VR Experience' }
            ],
            imageUrl: '/api/placeholder/400/300',
            imageAlt: 'AR Installation'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (project: { id: string | number }) => {
    const fullProject = projects.find(p => p._id === String(project.id));
    if (fullProject) {
      setSelectedProject(fullProject);
      setIsOverlayOpen(true);
    }
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
        <Header />
        <main className="w-full flex flex-col items-center">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0066]"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
      <Header />
      <main className="w-full flex flex-col items-center">
        {/* Hero */}
        <Hero pageSlug="immersive" />
        
        {/* Immersive Content */}
        <section className="w-full py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              {/* Header */}
              <div className="mb-16">
                <h1 className="display_h1 text-center mb-6">
                  Immersive Experiences
                </h1>
                <p className="display_h6 text-center">
                  Forged by experience. Built for the future. Fuelled by next-gen thinking.
                </p>
              </div>

              {/* Projects Grid - Chess Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((project, index) => {
                  const isEven = index % 2 === 0;
                  const colSpan = isEven ? 'md:col-span-1' : 'md:col-span-1';
                  const order = isEven ? 'md:order-1' : 'md:order-2';
                  
                  return (
                    <div key={project._id} className={`${colSpan} ${order}`}>
                      <div 
                        className="service-card cursor-pointer"
                        onClick={() => handleProjectClick({ id: project._id })}
                      >
                        <div className="aspect-[4/3] mb-4">
                          <img
                            src={project.imageUrl}
                            alt={project.imageAlt}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <h3 className="heading_h1 mb-2">
                          {project.title}
                        </h3>
                        <p className="text-gray-600">
                          {project.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Project Overlay */}
      <ProjectOverlay
        project={selectedProject}
        isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
      />
    </div>
  );
};

export default Immersive;
