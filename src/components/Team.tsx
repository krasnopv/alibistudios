'use client';

import { motion } from 'framer-motion';

const Team = () => {
  return (
    <section className="py-20 bg-[#F8F9FA]">
      <div className="w-[1440px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-[64px] font-[200] leading-[76.8px] text-[#FF0066] mb-4">
            Our Team
          </h2>
          <p className="text-[40px] font-[200] leading-[48px] text-black max-w-5xl mx-auto">
            Alibi&apos;s multidisciplinary studios are powered by multicultural teams of seasoned industry veterans with decades of experience. Independent and adaptable, we tailor our pipeline and team to fit the unique needs of every project. Whether collaborating as partners or taking the lead on full productions, our scalable resources and deep expertise deliver exceptional results for clients worldwide. →
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Team;
