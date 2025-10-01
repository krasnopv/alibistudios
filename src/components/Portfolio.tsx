'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, Eye } from 'lucide-react';

const Portfolio = () => {
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Modern e-commerce solution with advanced features and seamless user experience.',
      image: '/api/placeholder/600/400',
      tags: ['Next.js', 'TypeScript', 'Stripe'],
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 2,
      title: 'SaaS Dashboard',
      description: 'Comprehensive dashboard for managing business operations and analytics.',
      image: '/api/placeholder/600/400',
      tags: ['React', 'Node.js', 'MongoDB'],
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 3,
      title: 'Mobile Banking App',
      description: 'Secure and intuitive mobile banking application with advanced security features.',
      image: '/api/placeholder/600/400',
      tags: ['React Native', 'Firebase', 'Biometric Auth'],
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 4,
      title: 'Real Estate Platform',
      description: 'Property listing and management platform with advanced search and filtering.',
      image: '/api/placeholder/600/400',
      tags: ['Vue.js', 'Express', 'PostgreSQL'],
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 5,
      title: 'Healthcare Management',
      description: 'Comprehensive healthcare management system for clinics and hospitals.',
      image: '/api/placeholder/600/400',
      tags: ['Angular', 'Spring Boot', 'MySQL'],
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 6,
      title: 'Learning Management System',
      description: 'Interactive learning platform with video streaming and progress tracking.',
      image: '/api/placeholder/600/400',
      tags: ['Next.js', 'Prisma', 'AWS'],
      liveUrl: '#',
      githubUrl: '#'
    }
  ];

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Portfolio
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our recent projects and see how we&apos;ve helped businesses 
            achieve their digital goals.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {['All', 'Web Apps', 'Mobile Apps', 'E-Commerce', 'SaaS'].map((filter) => (
            <button
              key={filter}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                filter === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                  <a
                    href={project.liveUrl}
                    className="p-3 bg-white rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-300"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <a
                    href={project.githubUrl}
                    className="p-3 bg-white rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-300"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <a
                    href={project.liveUrl}
                    className="flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </a>
                  <a
                    href={project.githubUrl}
                    className="flex items-center text-gray-600 font-semibold hover:text-gray-700 transition-colors duration-300"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="bg-gray-100 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300">
            View All Projects
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
