import React, { useEffect, useRef, useState } from 'react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
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

  // Rotating testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const floatingElements = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5
  }));

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-gray-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      {floatingElements.map((element) => (
        <div
          key={element.id}
          className="absolute bg-orange-200 rounded-full opacity-20 animate-float"
          style={{
            width: `${element.size}px`,
            height: `${element.size}px`,
            left: `${element.left}%`,
            animationDuration: `${element.duration}s`,
            animationDelay: `${element.delay}s`,
          }}
        />
      ))}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <p className={`text-sm text-gray-500 mb-4 font-inter transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Why SheBuilds
          </p>
          <h2 className={`text-3xl md:text-4xl font-light text-gray-900 mb-2 font-martian transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Turn representation into <span className="animate-pulse-glow">leadership</span>.
          </h2>
          <p className={`text-3xl md:text-4xl font-light text-gray-500 font-martian transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Build an action-oriented <span className="animate-pulse-glow">sisterhood</span>.
          </p>
        </div>

        {/* Two Column Features */}
        <div className="grid md:grid-cols-2 gap-16 mb-20">
          {/* Left Column - Upskilling & Innovation */}
          <div className={`transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h3 className="text-2xl font-medium text-gray-900 mb-4 font-martian hover:text-orange-600 transition-colors duration-300">
              Upskilling & Innovation
            </h3>
            <p className="text-gray-600 mb-8 font-inter leading-relaxed">
              Hands-on learning programs focused on emerging tech like AI, Blockchain, XR, and entrepreneurial skills. 
              Our Code & Challenge hackathon series has empowered <span className="text-orange-500 animate-pulse-orange">7,000+</span> participants to build real-world solutions.
            </p>

            {/* User testimonials with rotation */}
            <div className="space-y-6">
              <div className={`flex items-start space-x-3 transition-all duration-500 transform ${
                activeCard === 0 ? 'opacity-100 translate-x-0' : 'opacity-70 translate-x-2'
              }`}>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex-shrink-0 animate-bounce-subtle"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-inter mb-1 hover:text-gray-800 transition-colors duration-200">
                    "SheBuilds' community helped me gain clarity and grow with support. The mentorship is invaluable."
                  </p>
                  <p className="text-xs text-gray-400 font-inter">Bhavya Sachdeva, Signoz</p>
                </div>
              </div>

              <div className={`flex items-start space-x-3 transition-all duration-500 transform ${
                activeCard === 1 ? 'opacity-100 translate-x-0' : 'opacity-70 translate-x-2'
              }`}>
                <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex-shrink-0 animate-bounce-subtle" style={{ animationDelay: '0.5s' }}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-inter mb-1 hover:text-gray-800 transition-colors duration-200">
                    "The Code & Connect sessions brought me closer to industry professionals and real-world applications."
                  </p>
                  <p className="text-xs text-gray-400 font-inter">Akshita Gupta, Intel</p>
                </div>
              </div>

              <div className={`flex items-start space-x-3 transition-all duration-500 transform ${
                activeCard === 2 ? 'opacity-100 translate-x-0' : 'opacity-70 translate-x-2'
              }`}>
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex-shrink-0 animate-bounce-subtle" style={{ animationDelay: '1s' }}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-inter mb-1 hover:text-gray-800 transition-colors duration-200">
                    "SheBuilds gave me the confidence to pursue my startup dreams with a supportive community."
                  </p>
                  <p className="text-xs text-gray-400 font-inter">Pooja Gera, Palo Alto Networks</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Funding & Support */}
          <div className={`transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h3 className="text-2xl font-medium text-gray-900 mb-4 font-martian hover:text-orange-600 transition-colors duration-300">
              Funding & Support
            </h3>
            <p className="text-gray-600 mb-8 font-inter leading-relaxed">
              We fund and showcase innovative products built by women, providing micro-grants, pitch opportunities, and fundraising support to help turn ideas into ventures.
            </p>

            {/* Impact stats with animations */}
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-orange-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between group">
                  <span className="text-sm text-gray-600 font-inter group-hover:text-gray-800 transition-colors duration-200">Projects Built</span>
                  <span className="text-xs text-orange-500 font-inter animate-pulse-orange">300+</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-inter">Community Size</span>
                    <span className="text-xs text-orange-500 font-inter animate-pulse-orange">10,000+</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400 font-inter">First-Time Builders</span>
                    <span className="text-xs text-orange-500 font-inter">65%</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-inter">Grants Disbursed</span>
                    <span className="text-xs text-orange-500 font-inter animate-pulse-orange">₹5L+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What Makes Us Unique Section */}
        <div className={`text-center mb-20 transition-all duration-1000 delay-600 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-2xl font-medium text-gray-900 mb-4 font-martian hover:text-orange-600 transition-colors duration-300">
            What Makes SheBuilds Unique?
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto font-inter leading-relaxed">
            We raise voices and break silence with bold, unfiltered discussions around women-specific challenges in tech. 
            We actively support women-led businesses and fund innovative products built by women.
          </p>
        </div>

        {/* Bottom Features Grid */}
        <div className="grid md:grid-cols-2 gap-16">
          {/* Mentorship Access */}
          <div className={`transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-700 rounded-full mx-auto mb-6 flex items-center justify-center hover:scale-105 transition-transform duration-300 animate-pulse-ring">
                <div className="w-20 h-20 bg-white rounded-full animate-bounce-subtle"></div>
              </div>
            </div>
            
            <h4 className="text-xl font-medium text-gray-900 mb-3 font-martian text-center hover:text-orange-600 transition-colors duration-300">
              Mentorship Access
            </h4>
            <p className="text-gray-600 text-center mb-6 font-inter">
              One-on-one guidance and structured fellowships led by industry leaders and experienced women in tech, 
              including speakers from Intel, Amazon, Uber, and more.
            </p>
            
            <div className="flex justify-center mb-6">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full border-2 border-white hover:scale-110 transition-transform duration-200 animate-bounce-subtle"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-500 rounded-full border-2 border-white hover:scale-110 transition-transform duration-200 animate-bounce-subtle" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full border-2 border-white hover:scale-110 transition-transform duration-200 animate-bounce-subtle" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>

          {/* Community & Networking */}
          <div className={`transition-all duration-1000 delay-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full mx-auto mb-6 flex items-center justify-center hover:scale-105 transition-transform duration-300 animate-pulse-ring">
                <div className="w-20 h-20 bg-white rounded-full animate-bounce-subtle"></div>
              </div>
            </div>
            
            <h4 className="text-xl font-medium text-gray-900 mb-3 font-martian text-center hover:text-orange-600 transition-colors duration-300">
              Community & Networking
            </h4>
            <p className="text-gray-600 text-center mb-6 font-inter">
              A vibrant, inclusive network that fosters collaboration, peer learning, and long-term sisterhood. 
              Join our 10,000+ strong community across India and APAC.
            </p>
            
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full">
                <span className="text-xs text-orange-600 font-inter">63% Female</span>
                <span className="text-xs text-gray-400 font-inter">•</span>
                <span className="text-xs text-orange-600 font-inter">34% Male</span>
                <span className="text-xs text-gray-400 font-inter">•</span>
                <span className="text-xs text-orange-600 font-inter">3% Others</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Martian+Mono:wght@100;200;300;400;500;600;700;800&family=Inter:wght@100;200;300;400;500;600;700;800&display=swap');
          
          .font-martian {
            font-family: 'Martian Mono', monospace;
          }
          
          .font-inter {
            font-family: 'Inter', sans-serif;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-10px) rotate(90deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
            75% { transform: translateY(-10px) rotate(270deg); }
          }

          @keyframes bounce-subtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }

          @keyframes pulse-glow {
            0%, 100% { 
              color: rgb(17 24 39);
              text-shadow: none;
            }
            50% { 
              color: rgb(234 88 12);
              text-shadow: 0 0 10px rgba(234, 88, 12, 0.3);
            }
          }

          @keyframes pulse-orange {
            0%, 100% { 
              color: rgb(249 115 22);
              opacity: 1;
            }
            50% { 
              color: rgb(234 88 12);
              opacity: 0.8;
            }
          }

          @keyframes pulse-ring {
            0% { box-shadow: 0 0 0 0 rgba(239 68 68 / 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(239 68 68 / 0); }
            100% { box-shadow: 0 0 0 0 rgba(239 68 68 / 0); }
          }

          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes count-up {
            0% { color: rgb(249 115 22); }
            50% { color: rgb(34 197 94); }
            100% { color: rgb(249 115 22); }
          }

          .animate-float {
            animation: float 15s ease-in-out infinite;
          }

          .animate-bounce-subtle {
            animation: bounce-subtle 2s ease-in-out infinite;
          }

          .animate-pulse-glow {
            animation: pulse-glow 3s ease-in-out infinite;
          }

          .animate-pulse-orange {
            animation: pulse-orange 2s ease-in-out infinite;
          }

          .animate-pulse-ring {
            animation: pulse-ring 2s infinite;
          }

          .animate-fade-in {
            animation: fade-in 0.8s ease-out forwards;
            opacity: 0;
          }

          .animate-count-up {
            animation: count-up 3s ease-in-out infinite;
            font-weight: 600;
          }

          /* Hover Effects */
          .group:hover .group-hover\\:scale-105 {
            transform: scale(1.05);
          }

          .group:hover .group-hover\\:text-gray-800 {
            color: rgb(31 41 55);
          }

          /* Smooth transitions for all interactive elements */
          * {
            transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 150ms;
          }
        `
      }} />
    </section>
  );
};

export default About;