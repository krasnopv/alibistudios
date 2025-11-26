'use client';

import { motion } from 'framer-motion';
import { useMailto } from '@/hooks/useMailto';

interface FooterItemProps {
  city: string;
  address: string;
  country: string;
  index: number;
}

const FooterItem = ({ city, address, country, index }: FooterItemProps) => {
  const email = 'production@alibistudios.co.uk';
  const { handleMailtoClick, copied } = useMailto(email);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-transparent"
    >
      <h3 className="text-black mb-2" style={{
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: 700,
        fontStyle: 'normal',
        fontSize: '14px',
        lineHeight: '150%',
        letterSpacing: '0%'
      }}>
        {city}
      </h3>
      <p className="text-black mb-4 whitespace-pre-line" style={{
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: 400,
        fontStyle: 'normal',
        fontSize: '14px',
        lineHeight: '150%',
        letterSpacing: '0%'
      }}>
        {address}
      </p>
      <a 
        href={`mailto:${email}`}
        onClick={handleMailtoClick}
        className="text-[#FF0066] hover:underline cursor-pointer transition-all duration-200" 
        style={{
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: 400,
        fontStyle: 'normal',
        fontSize: '14px',
        lineHeight: '150%',
        letterSpacing: '0%'
        }}
        title={copied ? 'Email copied to clipboard!' : `Click to copy ${email}`}
      >
        {copied ? 'Email copied!' : `${country} →`}
      </a>
    </motion.div>
  );
};

export default FooterItem;
