import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

export interface BlogPost {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
    slug: string;
    excerpt: string;
    content: any;
    featuredImage: {
      fields: {
        file: {
          url: string;
          details: {
            image: {
              width: number;
              height: number;
            };
          };
        };
      };
    };
    author: {
      fields: {
        name: string;
        bio: string;
        avatar: {
          fields: {
            file: {
              url: string;
            };
          };
        };
      };
    };
    tags: string[];
    publishedDate: string;
  };
}

export interface Service {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
    description: string;
    icon: string;
    features: string[];
    price?: number;
    category: string;
  };
}

export interface Project {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
    description: string;
    slug: string;
    featuredImage: {
      fields: {
        file: {
          url: string;
          details: {
            image: {
              width: number;
              height: number;
            };
          };
        };
      };
    };
    technologies: string[];
    liveUrl?: string;
    githubUrl?: string;
    category: string;
    featured: boolean;
  };
}

export interface TeamMember {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    name: string;
    role: string;
    bio: string;
    avatar: {
      fields: {
        file: {
          url: string;
        };
      };
    };
    socialLinks: {
      linkedin?: string;
      twitter?: string;
      github?: string;
    };
  };
}

// Blog Posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await client.getEntries({
      content_type: 'blogPost',
      order: '-fields.publishedDate',
    });
    return response.items as BlogPost[];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await client.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
    });
    return response.items[0] as BlogPost || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Services
export async function getServices(): Promise<Service[]> {
  try {
    const response = await client.getEntries({
      content_type: 'service',
      order: 'fields.order',
    });
    return response.items as Service[];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

// Projects
export async function getProjects(): Promise<Project[]> {
  try {
    const response = await client.getEntries({
      content_type: 'project',
      order: '-fields.featured,-sys.createdAt',
    });
    return response.items as Project[];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const response = await client.getEntries({
      content_type: 'project',
      'fields.featured': true,
      order: '-sys.createdAt',
    });
    return response.items as Project[];
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

// Team Members
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const response = await client.getEntries({
      content_type: 'teamMember',
      order: 'fields.order',
    });
    return response.items as TeamMember[];
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

export default client;
