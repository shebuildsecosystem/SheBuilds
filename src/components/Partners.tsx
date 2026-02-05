import { useEffect, useRef, useState } from 'react';

interface PartnersProps {
  className?: string;
}

const Partners = ({ className = '' }: PartnersProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

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

    if (sliderRef.current) {
      observer.observe(sliderRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const logoStyle = {
    filter: 'grayscale(100%)',
    opacity: 0.7,
    transition: 'all 0.3s ease-in-out',
    height: '60px',
    width: 'auto',
    maxWidth: '160px',
    objectFit: 'contain' as const,
  };

  const logos = [
    {
      name: 'Amazon',
      src: '/logos/amazon.webp'
    },
    {
      name: 'Microsoft',
      src: '/logos/microsoft.webp'
    },
    {
      name: 'Meta',
      src: '/logos/meta.webp'
    },
    {
      name: 'Google',
      src: '/logos/google.webp'
    }
    // },
    // {
    //   name: 'BCG',
    //   src: '/logos/bcg.webp'
    // },
    // {
    //   name: 'Morgan Stanley',
    //   src: '/logos/morganstanley.webp'
    // },
    // {
    //   name: 'McKinsey',
    //   src: '/logos/mckinsey.webp'
    // },
    // {
    //   name: 'Goldman Sachs',
    //   src: '/logos/goldmansachs.webp'
    // },
  ];

  return (
    <div 
      ref={sliderRef}
      className={`w-full py-24 overflow-hidden relative bg-white ${className}`}
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-50" style={{
        backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-light mb-16 text-center text-gray-900 font-martian">
          Our Partners
        </h2>
        
        <div 
          className={`transition-opacity duration-1000 relative ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: 'linear-gradient(to right, white 0%, transparent 10%, transparent 90%, white 100%)'
          }}
        >
          <div className="flex items-center justify-center">
            <div 
              className="flex items-center members-slide"
              style={{
                width: 'fit-content'
              }}
            >
              {[...logos, ...logos, ...logos].map((logo, index) => (
                <div 
                  key={`logo-${index}`} 
                  className="flex items-center justify-center"
                  style={{
                    margin: '0 3rem',
                    minWidth: '120px',
                    height: '100px',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={logo.src}
                    alt={`${logo.name} logo`}
                    style={logoStyle}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.filter = 'none';
                      target.style.opacity = '1';
                      target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.filter = 'grayscale(100%)';
                      target.style.opacity = '0.7';
                      target.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;