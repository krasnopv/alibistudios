'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import ContentGrid from '@/components/ContentGrid';

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
  bio: string;
}

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('/api/team');
        const data = await response.json();
        setTeamMembers(data);
      } catch (error) {
        console.error('Error fetching team members:', error);
        // Fallback to mock data
        setTeamMembers([
          {
            _id: '1',
            fullName: 'John Smith',
            imageUrl: '/api/placeholder/300/300',
            imageAlt: 'John Smith',
            role: 'Creative Director',
            industries: ['Film', 'Advertising'],
            locations: ['London, UK', 'New York, USA'],
            service: 'Creative Direction',
            services: [
              { _id: 'service-1', title: 'Creative Direction' },
              { _id: 'service-2', title: 'Brand Strategy' }
            ],
            socialMedia: [
              { platform: 'LinkedIn', url: 'https://linkedin.com/in/johnsmith', icon: 'linkedin' },
              { platform: 'Twitter', url: 'https://twitter.com/johnsmith', icon: 'twitter' }
            ],
            bioTitle: 'Creative Visionary',
            bio: 'John is a creative director with over 10 years of experience in film and advertising.'
          },
          {
            _id: '2',
            fullName: 'Sarah Johnson',
            imageUrl: '/api/placeholder/300/300',
            imageAlt: 'Sarah Johnson',
            role: 'Producer',
            industries: ['Television', 'Documentary'],
            locations: ['Los Angeles, USA'],
            service: 'Production',
            services: [
              { _id: 'service-3', title: 'Production' },
              { _id: 'service-4', title: 'Project Management' }
            ],
            socialMedia: [
              { platform: 'Instagram', url: 'https://instagram.com/sarahj', icon: 'instagram' }
            ],
            bioTitle: 'Production Expert',
            bio: 'Sarah specializes in documentary production and has won multiple awards.'
          },
          {
            _id: '3',
            fullName: 'Mike Chen',
            imageUrl: '/api/placeholder/300/300',
            imageAlt: 'Mike Chen',
            role: 'VFX Supervisor',
            industries: ['Film', 'Television'],
            locations: ['Vancouver, Canada'],
            service: 'Post Production',
            services: [
              { _id: 'service-5', title: 'Post Production' },
              { _id: 'service-6', title: 'VFX' }
            ],
            socialMedia: [
              { platform: 'LinkedIn', url: 'https://linkedin.com/in/mikechen', icon: 'linkedin' }
            ],
            bioTitle: 'VFX Expert',
            bio: 'Mike is a VFX supervisor with expertise in visual effects and post-production.'
          },
          {
            _id: '4',
            fullName: 'Emma Wilson',
            imageUrl: '/api/placeholder/300/300',
            imageAlt: 'Emma Wilson',
            role: 'Marketing Manager',
            industries: ['Advertising', 'Digital'],
            locations: ['New York, USA'],
            service: 'Marketing',
            services: [
              { _id: 'service-7', title: 'Marketing' },
              { _id: 'service-8', title: 'Digital Strategy' }
            ],
            socialMedia: [
              { platform: 'LinkedIn', url: 'https://linkedin.com/in/emmawilson', icon: 'linkedin' },
              { platform: 'Twitter', url: 'https://twitter.com/emmawilson', icon: 'twitter' }
            ],
            bioTitle: 'Marketing Strategist',
            bio: 'Emma leads marketing initiatives and brand development for the company.'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
        <Header />
        <main className="w-full flex flex-col items-center">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0066]"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get unique services for filtering from the services field (array of service references)
  const allServices = teamMembers.flatMap(member => 
    member.services ? member.services.map(service => service.title) : []
  );
  const services = Array.from(new Set(allServices)).filter(Boolean);
  
  // Debug: Log services and team members to see what we're working with
  console.log('Team members:', teamMembers);
  console.log('Services:', services);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
      <Header />
      <main className="w-full flex flex-col items-center">
        {/* Hero with team video */}
        <Hero pageSlug="team" />
        
        {/* Team Content */}
        <section className="w-full py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              {/* Page Title */}
              <div className="mb-16">
                <h1 className="display_h1 text-center">
                  Seasoned industry veterans
                </h1>
              </div>

              {/* Team Grid */}
              <ContentGrid
                title=""
                categories={['All', ...services]}
                items={teamMembers.map(member => ({
                  id: member._id,
                  title: member.fullName,
                  image: member.imageUrl,
                  description: member.role,
                  category: member.services ? member.services.map(service => service.title).join(', ') : member.service,
                  subtitle: member.industries.join(', '),
                  locations: member.locations,
                  socialMedia: member.socialMedia,
                  bioTitle: member.bioTitle,
                  bio: member.bio,
                  services: member.services
                }))}
                defaultCategory="All"
                onItemClick={(member) => {
                  // Handle team member click - could open overlay
                  console.log('Team member clicked:', member);
                }}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Team;
