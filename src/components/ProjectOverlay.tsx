'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface Project {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
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
}

interface ProjectOverlayProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectOverlay = ({ project, isOpen, onClose }: ProjectOverlayProps) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 flex items-center justify-center transition-opacity hover:opacity-70"
              style={{
                width: '31px',
                height: '27px',
                padding: '5px',
                gap: '10px'
              }}
            >
              <img
                src="/x.svg"
                alt="Close"
                className="w-5 h-5"
                style={{
                  filter: 'brightness(0) saturate(100%)',
                  color: '#000000'
                }}
              />
            </button>

            <div className="p-8">
              {/* Main Content */}
              <div className="flex gap-8 mb-8">
                {/* Left Column - Project Info (1/3) */}
                <div className="w-1/3">
                  <h2 className="heading_h3 mb-4">
                    {project.fullTitle}
                  </h2>
                  
                  <div className="mb-6">
                    <p className="body_small mb-4">
                      {project.description}
                    </p>
                  </div>

                  {/* Credits */}
                  {project.credits && project.credits.length > 0 && (
                    <div className="mb-6">
                      <h3 className="body_bold mb-4">Credits</h3>
                      <div className="space-y-3">
                        {project.credits.map((credit, index) => (
                          <div key={index} className="border-b border-gray-200 pb-2 last:border-b-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-sm">{credit.role}</p>
                                <p className="text-sm text-gray-600">{credit.person}</p>
                              </div>
                              {credit.award && (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                  {credit.award.name}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Images Gallery (2/3) */}
                <div className="w-2/3">
                  {project.images && project.images.length > 0 && (
                    <div className="grid grid-cols-1 gap-4">
                      {project.images.map((image) => (
                        <div key={image._id} className="aspect-video">
                          <img
                            src={image.imageUrl}
                            alt={image.imageAlt}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Related Projects */}
              {project.relatedProjects && project.relatedProjects.length > 0 && (
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="body_bold mb-6">Related Projects</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {project.relatedProjects.map((relatedProject) => (
                      <div key={relatedProject._id} className="cursor-pointer group">
                        <div className="aspect-[4/3] mb-3">
                          <img
                            src={relatedProject.imageUrl}
                            alt={relatedProject.imageAlt}
                            className="w-full h-full object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                          />
                        </div>
                        <h4 className="font-semibold text-sm mb-1">
                          {relatedProject.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {relatedProject.subtitle}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectOverlay;
