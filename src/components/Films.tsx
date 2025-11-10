'use client';

import { useEffect, useState } from 'react';
import ContentGrid from './ContentGrid';
// Removed urlFor import to avoid CORS issues

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

interface Film {
  _id: string;
  title: string;
  description: string;
  category: Category;
  year: number;
  order?: number;
  imageUrl: string;
  imageAlt: string;
  imageRef: string;
  image: unknown;
  slug?: string;
}

interface FilmsProps {
  sectionId?: string;
  title?: string;
  subtitle?: string;
}

const Films = ({ sectionId, title, subtitle }: FilmsProps) => {
  const [films, setFilms] = useState<Film[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
        const fetchData = async () => {
          try {
            // Always use API routes to avoid CORS issues
            const [filmsResponse, categoriesResponse] = await Promise.all([
              fetch('/api/films'),
              fetch('/api/categories')
            ]);
            
            const filmsData = await filmsResponse.json();
            const categoriesData = await categoriesResponse.json();
            
            setFilms(filmsData);
            setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setFilms([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="row">
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0066]"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Prepare categories for ContentGrid (add "All" at the beginning)
  const allCategories = [
    { id: 'all', name: 'All' },
    ...categories.map(cat => ({ id: cat._id, name: cat.name }))
  ];

  return (
    <section id={sectionId} className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="row">
          {/* Header */}
          <div className="mb-16">
            <h1 className="display_h1 brand-color">
              {title || "Films Led or contributed to by Alibi members"}
            </h1>
            {subtitle && (
              <h6 className="display_h6">
                {subtitle}
              </h6>
            )}
          </div>
        </div>
          {/* Films Grid */}
          <ContentGrid
            title=""
            categories={allCategories.map(cat => cat.name)}
            items={films.map(film => {
              const imageUrl = film.imageUrl || `/api/placeholder/207/307`;
              return {
                id: film._id,
                title: film.title,
                image: imageUrl,
                description: film.description,
                category: film.category?.name || 'All',
                slug: film.slug
              };
            })}
            defaultCategory="All"
            schemaUrl="films"
            enablePagination={true}
            paginationMode="loadMore"
            itemsPerPageDesktop={24}
            itemsPerPageTablet={12}
            itemsPerPageMobile={6}
          />
        {/* </div> */}
      </div>
    </section>
  );
};

export default Films;
