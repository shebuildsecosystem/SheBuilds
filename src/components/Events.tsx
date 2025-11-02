import React, { useEffect, useRef, useState } from 'react';

const Events = () => {
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

  const events = [
    {
      title: "Code N Challenge",
      description: "Our flagship hackathon with over 7,000+ participants. A launchpad for aspiring women in tech to build and innovate.",
      image: "/2.png",
      stats: ["7,000+", "Participants"],
    },
    {
      title: "Code N Connect",
      description: "A series of meetups bringing students closer to industry, with 25+ virtual sessions and 8+ in-person gatherings.",
      image: "/1.png",
      stats: ["25+", "Virtual Sessions"],
    },
    {
      title: "Code N Candid",
      description: "Our podcast featuring candid conversations with women leaders, changemakers, and trailblazers in tech.",
      image: "/3.png",
      stats: ["50+", "Episodes"],
    },
    {
      title: "Mentorship Circles",
      description: "Structured fellowships and one-on-one guidance led by industry leaders and experienced women in tech.",
      image: "/4.png",
      stats: ["50+", "Speakers & Mentors"],
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-light text-gray-900 mb-6 font-martian transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Our Flagship Events
          </h2>
          <p className={`text-xl text-gray-600 max-w-3xl mx-auto font-inter transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            These core initiatives are the heart of our community, creating opportunities for connection, innovation, and inspiration.
          </p>
        </div>
        
        {/* 2x2 Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <div 
              key={index}
              className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: `${200 + index * 100}ms`, transitionProperty: 'opacity, transform' }}
            >
              <div className="relative h-64">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3 font-martian">{event.title}</h3>
                <p className="text-sm text-gray-600 font-inter mb-4 h-20">{event.description}</p>
                <div className="flex items-center space-x-2 text-sm pt-4 border-t border-gray-100">
                  <div className="font-bold text-orange-500 font-martian">{event.stats[0]}</div>
                  <div className="text-gray-500 font-inter">{event.stats[1]}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events; 