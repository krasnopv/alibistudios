'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import FooterItem from './FooterItem';

interface Address {
  _id: string;
  city: string;
  address: string;
  country: string;
}

const Footer = () => {
  const [locations, setLocations] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        // Import Sanity client directly
        const { client, queries } = await import('@/lib/sanity');
        const data = await client.fetch(queries.addresses);
        setLocations(data);
      } catch (error) {
        console.error('Error fetching addresses:', error);
        // Fallback to mock data
        setLocations([
          {
            _id: '1',
            city: 'Los Angeles',
            address: '360E 2nd suite 800\nLos Angeles CA 90012\nU.S.A',
            country: 'us'
          },
          {
            _id: '2',
            city: 'London/Bristol',
            address: 'Royal Talbot Building,\n2 Victoria St, Redcliffe\nBristol, BS16BN, UK',
            country: 'uk'
          },
          {
            _id: '3',
            city: 'Paris',
            address: '8 Rue Godillot,\n93400 Saint-Ouen-sur-Seine\nFrance',
            country: 'fr'
          },
          {
            _id: '4',
            city: 'Helsinki',
            address: 'Muonamiehentie 11\n00390 Helsinki\nFinland',
            country: 'fi'
          },
          {
            _id: '5',
            city: 'Montreal',
            address: '2 rue de Souilly,\nLorraine, Quebec\nCanada J6Z3Y5',
            country: 'ca'
          },
          {
            _id: '6',
            city: 'Barcelona',
            address: 'BAv. de Francesc Cambó 17, P1\n08003 Barcelona\nSpain',
            country: 'es'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  return (
    <footer className="w-full text-black" style={{ paddingTop: '15%' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="row">
          {/* Layer Image Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
            style={{ transform: 'translateY(50%)' }}
          >
            <img 
              src="./Layer_1.svg" 
              alt="Layer 1" 
              className="w-full h-auto absolute"
              style={{ marginTop: '-8.5%' }}
            />
          </motion.div>

          {/* Locations Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative grid grid-cols-6 gap-8 py-8 z-10"
            style={{ backgroundColor: '#F8F9FA' }}
          >
            {locations.map((location, index) => (
              <FooterItem
                key={location.city}
                city={location.city}
                address={location.address}
                country={location.country}
                index={index}
              />
            ))}
          </motion.div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="py-8 text-center"
          >
            <div className="mb-8">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="mx-auto text-black"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <div className="text-[14px] font-[400] leading-[21px] text-black">
              Copyright © 2025 Alibi Studios
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;