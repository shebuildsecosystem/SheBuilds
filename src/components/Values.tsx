
import React, { useEffect, useRef, useState } from 'react';

const Values = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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

  const sections = [
    {
      title: "Turn Representation into Leadership",
      description: "From presence to power — enabling women to lead, influence, and drive change. SheBuilds provides mentorship programs, leadership workshops, and networking opportunities that help women transition from participants to decision-makers in the tech ecosystem.",
      image: "/4.png",
      stats: ["63%", "Female Representation"],
      imageLeft: true,
      delay: 300
    },
    {
      title: "Democratize Access to Resources",
      description: "Levelling the playing field with opportunities in tech, funding, mentorship, and growth. Through our initiatives, we've disbursed ₹5L+ in grants and support to women-led projects and startups, creating pathways to success for underrepresented groups.",
      image: "/7.png",
      stats: ["₹5L+", "Grants Disbursed"],
      imageLeft: false,
      delay: 500
    },
    {
      title: "Build an Action-Oriented Sisterhood",
      description: "Building a bold, collaborative network of women who create, launch, and scale together. Our community of 10,000+ members spans across India and APAC regions, fostering connections that transcend competition and embrace collective growth.",
      image: "/11.png",
      stats: ["10,000+", "Community Members"],
      imageLeft: true,
      delay: 700
    }
  ];

  // Background floating elements
  const floatingElements = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5
  }));

  return (
    <section ref={sectionRef} className="py-16 px-6 bg-white relative overflow-hidden">
      {/* Floating Background Elements */}
      {floatingElements.map((element) => (
        <div
          key={element.id}
          className="absolute bg-orange-100 rounded-full opacity-20 animate-float"
          style={{
            width: `${element.size}rem`,
            height: `${element.size}rem`,
            left: `${element.left}%`,
            top: `${element.top}%`,
            animationDuration: `${element.duration}s`,
            animationDelay: `${element.delay}s`,
          }}
        />
      ))}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className={`text-sm text-gray-500 mb-4 font-inter transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Why SheBuilds
          </p>
          <h2 className={`text-4xl md:text-5xl font-light text-gray-900 mb-6 font-martian transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Our Core Values
          </h2>
          <p className={`text-xl text-gray-600 max-w-3xl mx-auto font-inter transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            These principles guide everything we do and shape the inclusive community we're building together.
          </p>
        </div>
        
        {/* Alternating Image and Text Sections */}
        <div className="space-y-24">
          {sections.map((section, index) => (
            <div 
              key={index}
              className={`flex flex-col ${section.imageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${section.delay}ms` }}
            >
              {/* Image Section */}
              <div className="w-full md:w-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-amber-100 rounded-2xl transform rotate-3 scale-95 opacity-50"></div>
                  <div className="relative overflow-hidden rounded-2xl shadow-xl group">
                    <img 
                      src={section.image} 
                      alt={section.title} 
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
              
              {/* Text Section */}
              <div className="w-full md:w-1/2">
                <h3 className="text-3xl font-light text-gray-900 mb-4 font-martian hover:text-orange-600 transition-colors duration-300">
                  {section.title}
                </h3>
                <p className="text-gray-600 mb-8 font-inter leading-relaxed">
                  {section.description}
                </p>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-light text-orange-500 font-martian animate-pulse-orange">
                    {section.stats[0]}
                  </div>
                  <div className="text-sm text-gray-600 font-inter">
                    {section.stats[1]}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className={`mt-24 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 shadow-sm transition-all duration-1000 delay-900 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-medium text-gray-900 mb-4 font-martian">
              Our Mission
            </h3>
            <p className="text-gray-700 font-inter leading-relaxed text-lg">
              To empower women by providing a collaborative ecosystem that fosters upskilling, innovation and mentorship — enabling them to grow as confident creators, entrepreneurs, and changemakers.
            </p>
            <div className="mt-6 text-lg font-medium text-orange-600 font-martian">
              "Built by her. Backed by boldness."
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        
        @keyframes pulse-orange {
          0%, 100% { color: #f97316; }
          50% { color: #ea580c; }
        }
        
        .animate-pulse-orange {
          animation: pulse-orange 2s ease-in-out infinite;
        }
        `
      }} />
    </section>
  );
};

export default Values;
