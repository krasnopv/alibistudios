'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ContentGrid from '@/components/ContentGrid';
import TeamMemberOverlay from '@/components/TeamMemberOverlay';

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

interface Page {
  _id: string;
  title: string;
  slug: string;
}

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [pageData, setPageData] = useState<Page | null>(null);
  const [hasHeroContent, setHasHeroContent] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch team members
        const teamResponse = await fetch('/api/team');
        const teamData = await teamResponse.json();
        setTeamMembers(teamData);

        // Fetch page data
        const pageResponse = await fetch('/api/pages/slug/team');
        const pageData = await pageResponse.json();
        setPageData(pageData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setTeamMembers([]);
        setPageData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
        <Header />
        <main className={`w-full flex flex-col items-center ${hasHeroContent === false ? 'no-hero' : ''}`}>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0066]"></div>
          </div>
        </main>
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
  console.log('All services from members:', allServices);

  const handleMemberClick = (member: { id: string | number }) => {
    // Find the full team member data
    const fullMember = teamMembers.find(m => m._id === String(member.id));
    if (fullMember) {
      setSelectedMember(fullMember);
      setIsOverlayOpen(true);
    }
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedMember(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
      <Header />
      <main className={`w-full flex flex-col items-center ${hasHeroContent === false ? 'no-hero' : ''}`}>
        {/* Hero with team video */}
        <Hero pageSlug="team" onRenderChange={setHasHeroContent} />
        
        {/* Team Content */}
        <section className="w-full pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              {/* Page Title */}
              <div className="mb-16">
                <h1 className="display_h1 brand-color text-center">
                  {pageData?.title || 'Seasoned industry veterans'}
                </h1>
              </div>
            </div>
          {/* </div>
        </section> */}
              <ContentGrid
                title=""
                categories={['All', ...services]}
                items={teamMembers.map(member => ({
                  id: member._id,
                  title: member.fullName,
                  image: member.imageUrl,
                  description: member.role,
                  category: member.service, // Keep the single service field for display
                  subtitle: member.industries.join(' / '),
                  locations: member.locations,
                  socialMedia: member.socialMedia,
                  bioTitle: member.bioTitle,
                  bio: member.bio,
                  services: member.services // Pass services array for filtering
                }))}
                defaultCategory="All"
                showMemberInfo={true}
                onItemClick={handleMemberClick}
              />
            {/* </div> */}
          </div>
        </section>
        </main>
        
        {/* Team Member Overlay */}
        <TeamMemberOverlay
          member={selectedMember}
          isOpen={isOverlayOpen}
          onClose={handleCloseOverlay}
        />
    </div>
  );
};

export default Team;
