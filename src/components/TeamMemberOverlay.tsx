'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface TeamMember {
  _id: string;
  fullName: string;
  imageUrl: string;
  imageAlt: string;
  role: string;
  industries: string[];
  locations: string[];
  service: string;
  services: {
    _id: string;
    title: string;
  }[];
  socialMedia: {
    platform: string;
    url: string;
    icon: string;
  }[];
  bioTitle?: string;
  bio: string | unknown;
}

interface TeamMemberOverlayProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
}

const TeamMemberOverlay = ({ member, isOpen, onClose }: TeamMemberOverlayProps) => {
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

  if (!member) return null;

  const getSocialIcon = (platform: string) => {
    const icons: { [key: string]: string } = {
      'LinkedIn': '💼',
      'Twitter': '🐦',
      'Instagram': '📷',
      'Facebook': '📘',
      'YouTube': '📺',
      'Vimeo': '🎬',
      'Behance': '🎨',
      'Dribbble': '🏀',
      'IMDB': '🎭'
    };
    return icons[platform] || '🔗';
  };

  const renderRichText = (bio: string | unknown) => {
    // Handle different bio data types
    if (typeof bio === 'string') {
      return bio.split('\n').map((paragraph, index) => (
        <p key={index} className="mb-4 last:mb-0">
          {paragraph}
        </p>
      ));
    }
    
    // Handle rich text objects from Sanity
    if (Array.isArray(bio)) {
      return bio.map((block, index) => {
        if (block._type === 'block' && block.children) {
          const text = block.children.map((child: { text: string }) => child.text).join('');
          return (
            <p key={index} className="mb-4 last:mb-0">
              {text}
            </p>
          );
        }
        return null;
      }).filter(Boolean);
    }
    
    // Fallback for other data types
    return (
      <p className="mb-4 last:mb-0">
        {String(bio)}
      </p>
    );
  };

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
            className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <span className="text-gray-600 text-xl">×</span>
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Image */}
                <div className="flex-shrink-0">
                  <img
                    src={member.imageUrl}
                    alt={member.imageAlt}
                    className="w-48 h-48 object-cover rounded-lg"
                  />
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-black mb-2">
                    {member.fullName}
                  </h2>
                  <p className="text-xl text-gray-600 mb-4">
                    {member.role}
                  </p>
                  
                  {/* Industries */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Industries
                    </h3>
                    <p className="text-gray-700">
                      {member.industries.join(' / ')}
                    </p>
                  </div>

                  {/* Locations */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Locations
                    </h3>
                    <p className="text-gray-700">
                      {member.locations.join(' / ')}
                    </p>
                  </div>

                  {/* Social Media */}
                  {member.socialMedia && member.socialMedia.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Social Media
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {member.socialMedia.map((social, index) => (
                          <a
                            key={index}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            <span className="text-lg">
                              {getSocialIcon(social.platform)}
                            </span>
                            <span className="text-sm font-medium">
                              {social.platform}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio Section */}
              <div>
                <h3 className="text-2xl font-bold text-black mb-4">
                  {member.bioTitle || member.role}
                </h3>
                <div className="prose prose-gray max-w-none">
                  {renderRichText(member.bio)}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TeamMemberOverlay;
