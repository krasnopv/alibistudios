'use client';

import { useEffect, useState } from 'react';
import ContentGrid from './ContentGrid';
import { urlFor } from '@/lib/sanity';

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
  imageUrl: string;
  imageAlt: string;
  imageRef: string;
  image: any;
}

const Films = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch films and categories in parallel
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
        // Fallback to mock data
        setFilms(Array.from({ length: 24 }, (_, i) => ({
          _id: `film-${i + 1}`,
          title: `Film ${i + 1}`,
          description: `Description for Film ${i + 1}`,
          category: { _id: 'all', name: 'All', slug: 'all' },
          year: 2024,
          imageUrl: `/api/placeholder/207/307`,
          imageAlt: `Film ${i + 1}`,
          imageRef: '',
          image: null
        })));
        setCategories([{ _id: 'all', name: 'All', slug: 'all' }]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="row">
            <div className="text-center">
              <div className="text-2xl">Loading films...</div>
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
    <ContentGrid
      title="Films Led or contributed to by Alibi members"
      categories={allCategories.map(cat => cat.name)}
      items={films.map(film => {
        const imageUrl = film.image ? urlFor(film.image).width(207).height(307).url() : `/api/placeholder/207/307`;
        return {
          id: film._id,
          title: film.title,
          image: imageUrl,
          description: film.description,
          category: film.category?.name || 'All'
        };
      })}
      defaultCategory="All"
    />
  );
};

export default Films;
