import { useState, useEffect } from 'react';

const FALLBACK_EMAIL = 'production@alibistudios.co.uk';

export function useContactEmail() {
  const [email, setEmail] = useState<string>(FALLBACK_EMAIL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactEmail = async () => {
      try {
        const response = await fetch('/api/options');
        if (!response.ok) {
          console.error('Failed to fetch options, status:', response.status);
          setEmail(FALLBACK_EMAIL);
          setLoading(false);
          return;
        }

        const options = await response.json();
        console.log('Options received:', options);
        
        // Check for "Contact Email" key (case-sensitive)
        const contactEmail = options['Contact Email'];
        console.log('Contact Email from options:', contactEmail);

        // Use Sanity value if it exists and is not empty, otherwise use fallback
        if (contactEmail && typeof contactEmail === 'string' && contactEmail.trim()) {
          console.log('Using Sanity email:', contactEmail.trim());
          setEmail(contactEmail.trim());
        } else {
          console.log('Using fallback email:', FALLBACK_EMAIL);
          setEmail(FALLBACK_EMAIL);
        }
      } catch (error) {
        console.error('Error fetching contact email:', error);
        setEmail(FALLBACK_EMAIL);
      } finally {
        setLoading(false);
      }
    };

    fetchContactEmail();
  }, []);

  return { email, loading };
}
