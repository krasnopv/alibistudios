'use client';

import { motion } from 'framer-motion';

const Footer = () => {
  const locations = [
    {
      city: 'Los Angeles',
      address: '360E 2nd suite 800\nLos Angeles CA 90012\nU.S.A',
      country: 'us'
    },
    {
      city: 'London/Bristol',
      address: 'Royal Talbot Building,\n2 Victoria St, Redcliffe\nBristol, BS16BN, UK',
      country: 'uk'
    },
    {
      city: 'Paris',
      address: '8 Rue Godillot,\n93400 Saint-Ouen-sur-Seine\nFrance',
      country: 'fr'
    },
    {
      city: 'Helsinki',
      address: 'Muonamiehentie 11\n00390 Helsinki\nFinland',
      country: 'fi'
    },
    {
      city: 'Montreal',
      address: '2 rue de Souilly,\nLorraine, Quebec\nCanada J6Z3Y5',
      country: 'ca'
    },
    {
      city: 'Barcelona',
      address: 'BAv. de Francesc Cambó 17, P1\n08003 Barcelona\nSpain',
      country: 'es'
    }
  ];

  return (
    <footer className="bg-[#F8F9FA] text-black border-t border-black">
      <div className="w-[1440px] px-4 sm:px-6 lg:px-8 py-16">
        {/* Locations Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {locations.map((location, index) => (
            <motion.div
              key={location.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 border border-black"
            >
              <h3 className="text-[14px] font-[700] leading-[21px] text-black mb-2">
                {location.city}
              </h3>
              <p className="text-[14px] font-[400] leading-[21px] text-black mb-4 whitespace-pre-line">
                {location.address}
              </p>
              <span className="text-[#FF0066] text-[14px] font-[400] leading-[21px]">
                {location.country} →
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-black py-8 text-center"
        >
          <div className="text-[32px] font-[400] leading-[48px] text-black mb-4">
            ©
          </div>
          <div className="text-[14px] font-[400] leading-[21px] text-black">
            Copyright © 2025 Alibi Studios
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;