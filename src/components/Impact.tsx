
import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

const Impact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const column1Images = ["/1.png", "/2.png", "/3.png", "/4.png", "/5.png", "/11.png", "/12.png", "/13.png"];
  const column2Images = ["/6.png", "/7.png", "/8.png", "/9.png", "/10.png", "/14.png", "/15.png", "/16.png"];

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-orange-600 bg-orange-100 rounded-full">
              Our Impact
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 font-martian">
            By the Numbers
          </h2>
          <p className="text-xl text-gray-600 mb-8 font-inter leading-relaxed">
            From a small group of builders to a thriving ecosystem, our impact is a testament to the power of community. We've created a space where thousands can learn, build, and grow together.
          </p>
          
          <div className="grid grid-cols-2 gap-6 mb-8 text-center">
            <div>
              <p className="text-4xl font-light text-orange-500 font-martian">10,000+</p>
              <p className="text-sm text-gray-600 font-inter">Community Members</p>
            </div>
            <div>
              <p className="text-4xl font-light text-orange-500 font-martian">300+</p>
              <p className="text-sm text-gray-600 font-inter">Projects Built</p>
            </div>
            <div>
              <p className="text-4xl font-light text-orange-500 font-martian">₹5L+</p>
              <p className="text-sm text-gray-600 font-inter">In Grants Disbursed</p>
            </div>
            <div>
              <p className="text-4xl font-light text-orange-500 font-martian">65%</p>
              <p className="text-sm text-gray-600 font-inter">First-Time Builders</p>
            </div>
          </div>

          <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-base font-medium rounded-full font-inter">
            Join The Community
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Image Gallery */}
        <div className={`h-[500px] flex gap-6 overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-1/2 flex flex-col gap-6 animate-scroll-up">
            {[...column1Images, ...column1Images].map((src, index) => (
              <img key={`col1-${index}`} src={src} alt={`Impact image ${index + 1}`} className="w-full h-auto object-cover rounded-2xl shadow-lg" />
            ))}
          </div>
          <div className="w-1/2 flex flex-col gap-6 animate-scroll-down">
            {[...column2Images, ...column2Images].map((src, index) => (
              <img key={`col2-${index}`} src={src} alt={`Impact image ${index + 1}`} className="w-full h-auto object-cover rounded-2xl shadow-lg" />
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scroll-up {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        @keyframes scroll-down {
          from { transform: translateY(-50%); }
          to { transform: translateY(0); }
        }
        .animate-scroll-up {
          animation: scroll-up 15s linear infinite;
        }
        .animate-scroll-down {
          animation: scroll-down 15s linear infinite;
        }
      `}} />
    </section>
  );
};

export default Impact;
