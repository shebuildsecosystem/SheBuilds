import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

const Ecosystem = () => {
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

  const ecosystemPoints = [
    { title: "Upskilling Cohorts", description: "Hands-on learning programs in emerging tech." },
    { title: "Innovation Challenges", description: "Hackathons and sprints to solve real-world problems." },
    { title: "Mentorship Access", description: "Guidance from experienced industry leaders." },
    { title: "Startup & Project Support", description: "Resources and visibility for women-led projects." },
    { title: "Funding & Grants", description: "Micro-grants and pitch opportunities for new ventures." },
    { title: "Community & Networking", description: "A vibrant network fostering collaboration and sisterhood." },
  ];

  const stats = [
    { value: "10,000+", label: "Strong Community" },
    { value: "300+", label: "Projects Built" },
    { value: "₹5L+", label: "Disbursed in Grants" },
  ];

  const leftPoints = ecosystemPoints.slice(0, 3);
  const rightPoints = ecosystemPoints.slice(3, 6);

  return (
    <section ref={sectionRef} className="py-24 bg-pink-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Title */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-light text-gray-900 mb-4 font-martian transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            Our Ecosystem
          </h2>
          <p className={`text-lg text-gray-600 max-w-2xl mx-auto font-inter transition-opacity duration-1000 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            A holistic environment designed to support women at every stage of their journey in tech and entrepreneurship.
          </p>
        </div>

        {/* Ecosystem Grid */}
        <div className="grid lg:grid-cols-3 gap-8 items-center mb-20">
          {/* Left Column */}
          <div className="space-y-8">
            {leftPoints.map((point, index) => (
              <div 
                key={index}
                className={`text-right transition-all duration-700 delay-${200 + index * 100} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
              >
                <h3 className="font-martian text-lg font-medium text-gray-900">{point.title}</h3>
                <p className="font-inter text-gray-600">{point.description}</p>
              </div>
            ))}
          </div>

          {/* Center Image */}
          <div className={`flex justify-center items-center transition-opacity duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <img src="/19square.png" alt="SheBuilds Ecosystem" className="w-full max-w-sm h-auto rounded-lg" />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {rightPoints.map((point, index) => (
              <div 
                key={index}
                className={`text-left transition-all duration-700 delay-${200 + index * 100} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
              >
                <h3 className="font-martian text-lg font-medium text-gray-900">{point.title}</h3>
                <p className="font-inter text-gray-600">{point.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="text-center mb-12">
          <h3 className={`text-3xl font-light text-gray-900 mb-2 font-martian transition-opacity duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            Our Community, In Numbers
          </h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`bg-white p-8 rounded-2xl shadow-md text-center transition-all duration-700 hover:-translate-y-2 hover:shadow-lg delay-${800 + index * 100} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            >
              <p className="text-4xl font-bold text-orange-500 font-martian mb-2">{stat.value}</p>
              <p className="text-lg text-gray-600 font-inter">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ecosystem; 