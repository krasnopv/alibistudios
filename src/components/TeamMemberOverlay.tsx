'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { 
  FaLinkedin, 
  FaTwitter, 
  FaInstagram, 
  FaFacebook, 
  FaYoutube, 
  FaVimeo,
  FaBehance,
  FaDribbble,
  FaImdb,
  FaExternalLinkAlt
} from 'react-icons/fa';

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
    const icons: { [key: string]: React.ComponentType<{ className?: string }> } = {
      'LinkedIn': FaLinkedin,
      'Twitter': FaTwitter,
      'Instagram': FaInstagram,
      'Facebook': FaFacebook,
      'YouTube': FaYoutube,
      'Vimeo': FaVimeo,
      'Behance': FaBehance,
      'Dribbble': FaDribbble,
      'IMDB': FaImdb
    };
    const IconComponent = icons[platform] || FaExternalLinkAlt;
    return <IconComponent className="w-5 h-5" />;
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
              {/* Header */}
              <div className="flex gap-8 mb-8">
                {/* Left Column - Image and Social Media (1/3) */}
                <div className="w-1/3 flex flex-col">
                  {/* Image with 5:6 ratio */}
                  <div className="w-full aspect-[5/6] mb-6">
                    <img
                      src={member.imageUrl}
                      alt={member.imageAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Social Media Icons */}
                  {member.socialMedia && member.socialMedia.length > 0 && (
                    <div className="flex flex-wrap gap-3 justify-center">
                      {member.socialMedia.map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center transition-colors hover:opacity-70"
                          title={social.platform}
                        >
                          {getSocialIcon(social.platform)}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column - All Text Content (2/3) */}
                <div className="w-2/3">
                  {/* Basic Info */}
                  <div className="mb-6">
                    <h2 className="heading_h3 mb-2">
                      {member.fullName}
                    </h2>
                    <p 
                      className="body_small"
                      style={{ marginBottom: 'calc(var(--spacing) * 6)' }}
                    >
                      {member.role}
                    </p>
                  </div>

                  {/* Bio Section */}
                  <div>
                    <h3 className="body_bold mb-6">
                      {member.bioTitle || member.role}
                    </h3>
                    <div className="prose prose-gray max-w-none">
                      {renderRichText(member.bio)}
                    </div>
                  </div>
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
