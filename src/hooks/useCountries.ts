import { useState, useEffect } from 'react';
import { Country } from '@/types/country';

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/countries');
        
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        
        const data = await response.json();
        setCountries(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching countries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
}

export function useCountry(code: string) {
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    const fetchCountry = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/countries/${code}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Country not found');
          }
          throw new Error('Failed to fetch country');
        }
        
        const data = await response.json();
        setCountry(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching country:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [code]);

  return { country, loading, error };
}
