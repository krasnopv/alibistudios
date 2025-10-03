'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ServicesGrid from '@/components/ServicesGrid';
import ScrollableCategories from '@/components/ScrollableCategories';

interface SubService {
  _id: string;
  title: string;
  slug: string;
}

interface Project {
  _id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  slug: string;
  services?: {
    _id: string;
    title: string;
    slug: string;
    subServices?: SubService[];
  }[];
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [allSubServices, setAllSubServices] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        console.log('Projects data:', data);
        setProjects(data);
        
        // Extract all unique subServices from projects
        const subServicesSet = new Set<string>();
        data.forEach((project: Project) => {
          project.services?.forEach(service => {
            service.subServices?.forEach(subService => {
              subServicesSet.add(subService.title);
            });
          });
        });
        setAllSubServices(Array.from(subServicesSet).sort());
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on active category
  const filteredProjects = projects.filter(project => {
    if (activeCategory === 'All') return true;
    
    // Check if project has the selected subService in any of its services
    return project.services?.some(service =>
      service.subServices?.some(subService => subService.title === activeCategory)
    );
  });

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of projects section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        {/* Projects Content */}
        <section className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              {/* Header */}
              <div className="mb-16">
                <h1 className="display_h1 brand-color text-center mb-6">
                  All Projects
                </h1>
                <h6 className="display_h6 text-center">
                  Explore our portfolio of creative work
                </h6>
              </div>

              {/* Categories Filter */}
              {allSubServices.length > 0 && (
                <div className="mb-12">
                  <ScrollableCategories
                    categories={['All', ...allSubServices]}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                  />
                </div>
              )}

              {/* Projects Grid */}
              {currentProjects.length > 0 ? (
                <ServicesGrid 
                  gridData={currentProjects}
                  schemaUrl="projects"
                  gridCols="md:grid-cols-2"
                />
              ) : (
                <div className="text-center py-12">
                  <p className="body_regular text-gray-600">No projects found for this category.</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 body_regular border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                      // Show first page, last page, current page, and pages around current
                      const showPage = 
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1);
                      
                      // Show ellipsis
                      const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                      const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                      if (showEllipsisBefore || showEllipsisAfter) {
                        return (
                          <span key={page} className="px-2 py-2 body_regular text-gray-400">
                            ...
                          </span>
                        );
                      }

                      if (!showPage) return null;

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 body_regular border rounded transition-colors ${
                            currentPage === page
                              ? 'bg-[#FF0066] text-white border-[#FF0066]'
                              : 'border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 body_regular border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProjectsPage;
