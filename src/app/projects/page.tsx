'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

interface Project {
  _id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  slug: string;
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        console.log('Projects data:', data);
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

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
      <Header />
      <main className="w-full flex flex-col items-center no-hero">
        <section className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              {/* Title */}
              <div className="text-center mb-16">
                <h1 className="heading_h1">All Projects</h1>
              </div>

              {/* Projects Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <Link
                    key={project._id}
                    href={project.slug ? `/projects/${project.slug}` : `/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group cursor-pointer"
                  >
                    {/* Project Image */}
                    <div className="relative h-[372px] overflow-hidden mb-6">
                      <img
                        src={project.imageUrl}
                        alt={project.imageAlt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-2xl font-bold mb-2">{project.title}</div>
                          <div className="text-sm opacity-90">{project.subtitle}</div>
                        </div>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="flex flex-col">
                      <div className="text-[#FF0066] text-base font-[300] leading-6">
                        {project.title}
                      </div>
                      <div className="text-black text-xl font-[400] leading-[30px] mt-1">
                        →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProjectsPage;
