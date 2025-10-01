import Header from '@/components/Header';
import ContactForm from '@/components/ContactForm';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Let&apos;s Work Together
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ready to bring your ideas to life? We&apos;d love to hear about your project 
                and discuss how we can help you achieve your goals.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600">hello@alibi.com</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Visit Us</h3>
                <p className="text-gray-600">San Francisco, CA</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Hours</h3>
                <p className="text-gray-600">Mon-Fri 9AM-6PM</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="max-w-4xl mx-auto">
              <ContactForm />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Here are some common questions we receive about our services.
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  question: "How long does a typical project take?",
                  answer: "Project timelines vary depending on complexity, but most web development projects take 4-12 weeks from start to finish."
                },
                {
                  question: "Do you provide ongoing support after launch?",
                  answer: "Yes! We offer maintenance and support packages to keep your website running smoothly and up-to-date."
                },
                {
                  question: "What technologies do you work with?",
                  answer: "We specialize in modern technologies including React, Next.js, Node.js, TypeScript, and various CMS platforms."
                },
                {
                  question: "Do you work with small businesses?",
                  answer: "Absolutely! We work with businesses of all sizes, from startups to enterprise companies."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
