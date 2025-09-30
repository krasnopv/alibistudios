'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';

interface Project {
  _id: string;
  title: string;
  slug: string;
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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (project: { id: string | number; slug?: string }) => {
    // Redirect to project page using slug
    const slug = project.slug || project.id;
    window.location.href = `/immersive/${slug}`;
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
                        onClick={() => handleProjectClick({ id: project._id, slug: project.slug })}
                      >
                        <div className="aspect-[4/3] mb-4">
                          <img
                            src={project.imageUrl}
                            alt={project.imageAlt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="body_gerular mb-2">
                          {project.title}
                        </h3>
                        <p className="body_regular">
                          {project.subtitle} <span className="text-xl">→</span>
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
    </div>
  );
};

export default Immersive;
