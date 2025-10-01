'use client';

import { motion } from 'framer-motion';
import { Users, Award, Clock, Target } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Users, value: '500+', label: 'Happy Clients' },
    { icon: Award, value: '50+', label: 'Awards Won' },
    { icon: Clock, value: '5+', label: 'Years Experience' },
    { icon: Target, value: '99%', label: 'Success Rate' }
  ];

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              About Our Company
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We are a team of passionate developers, designers, and digital strategists 
              dedicated to creating exceptional web experiences that drive business growth.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              With over 5 years of experience in the industry, we&apos;ve helped hundreds of 
              businesses transform their digital presence and achieve their goals through 
              innovative web solutions.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-20 bg-white rounded-lg shadow-sm flex items-center justify-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">A</span>
                    </div>
                  </div>
                  <div className="h-16 bg-white rounded-lg shadow-sm flex items-center justify-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="h-16 bg-white rounded-lg shadow-sm flex items-center justify-center">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div className="h-20 bg-white rounded-lg shadow-sm flex items-center justify-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">B</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
