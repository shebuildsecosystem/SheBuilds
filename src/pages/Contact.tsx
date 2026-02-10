import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Footer from '@/components/Footer';
import { submitContactForm } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContactForm(formData);
      toast({ title: 'Message sent!', description: 'We\'ll get back to you soon.' });
      setFormData({ name: '', email: '', message: '' });
    } catch (err: any) {
      toast({ title: 'Failed to send', description: err?.response?.data?.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <main className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-4 font-martian">Contact Us</h1>
            <p className="text-xl text-gray-600 font-inter">We'd love to hear from you. Reach out with any questions or collaboration ideas.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 bg-gray-50 p-8 rounded-2xl">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-medium text-gray-900 font-martian mb-4">Get in Touch</h2>
                <div className="flex items-start space-x-4 mb-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 font-inter">Email</h3>
                    <p className="text-gray-600 font-inter">shebuilds.hacks@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 font-inter">Phone</h3>
                    <p className="text-gray-600 font-inter">+91 88513 63766</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 font-inter mb-2">Our Community Hubs</h3>
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <MapPin className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 font-inter">
                      Delhi • Bangalore • Chennai • Gurugram • Noida • Chandigarh • Nagpur • Lucknow
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-medium text-gray-900 font-martian mb-4">Send a Message</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="sr-only">Name</label>
                  <input type="text" id="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-orange-500 focus:border-orange-500 font-inter" />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input type="email" id="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-orange-500 focus:border-orange-500 font-inter" />
                </div>
                <div>
                  <label htmlFor="message" className="sr-only">Message</label>
                  <textarea id="message" rows={5} placeholder="Your Message" value={formData.message} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-orange-500 focus:border-orange-500 font-inter"></textarea>
                </div>
                <div>
                  <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors duration-300 font-inter disabled:opacity-50">
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact; 