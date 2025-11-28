import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Hero = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const isAdmin = localStorage.getItem('is_admin') === 'true';
  const events = [
    { eventTitle: "SheBuilds Annual Conference 2023", image: "/1.png" },
    { eventTitle: "Founder's Fireside Chat", image: "/2.png" },
    { eventTitle: "UX/UI Design Sprint Week", image: "/3.png" },
    { eventTitle: "Web3 & Blockchain Workshop", image: "/4.png" },
    { eventTitle: "Data Science for Startups", image: "/5.png" },
    { eventTitle: "Digital Marketing Masterclass", image: "/6.png" },
    { eventTitle: "Leadership in Tech Summit", image: "/7.png" },
    { eventTitle: "Angel Investing & VCs Panel", image: "/8.png" },
    { eventTitle: "SheBuilds Annual Conference 2023", image: "/9.png" },
    { eventTitle: "Founder's Fireside Chat", image: "/10.png" },
    { eventTitle: "UX/UI Design Sprint Week", image: "/11.png" },
    { eventTitle: "Web3 & Blockchain Workshop", image: "/12.png" },
    { eventTitle: "Data Science for Startups", image: "/13.png" },
    { eventTitle: "Digital Marketing Masterclass", image: "/14.png" },
    { eventTitle: "Leadership in Tech Summit", image: "/15.png" },
    { eventTitle: "Angel Investing & VCs Panel", image: "/16.png" },
    { eventTitle: "SheBuilds Annual Conference 2023", image: "/17.png" },
    { eventTitle: "Founder's Fireside Chat", image: "/18.png" },
    { eventTitle: "UX/UI Design Sprint Week", image: "/19.png" },
    { eventTitle: "Web3 & Blockchain Workshop", image: "/20.png" },
    { eventTitle: "Data Science for Startups", image: "/21.png" },
    { eventTitle: "Digital Marketing Masterclass", image: "/22.png" },
    { eventTitle: "Leadership in Tech Summit", image: "/23.png" },
    { eventTitle: "Angel Investing & VCs Panel", image: "/24.png" },
    { eventTitle: "SheBuilds Annual Conference 2023", image: "/25.png" },
    { eventTitle: "Founder's Fireside Chat", image: "/26.png" },
    { eventTitle: "UX/UI Design Sprint Week", image: "/27.png" },
    { eventTitle: "Web3 & Blockchain Workshop", image: "/28.png" },
    { eventTitle: "Data Science for Startups", image: "/29.png" },
  ];

  // Create duplicated arrays for seamless scrolling
  const topRowEvents = [...events, ...events];
  const bottomRowEvents = [...events.slice().reverse(), ...events.slice().reverse()];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Announcement Banner */}
      {/* <div className="bg-gray-50 text-center py-3">
        <p className="text-sm text-gray-600 font-inter">
          Join a community of over <span className="text-orange-500 font-semibold">10,000+</span> builders and leaders
          <span className="ml-2">→</span>
        </p>
      </div> */}

      {/* Hero Content */}
      <section className="relative px-6 py-16 text-center">
        {/* Animated Butterfly */}
        <img
          src="/butterfly.png"
          alt="Animated Butterfly"
          className="butterfly"
        />

        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-light mb-8 text-gray-900 leading-tight font-martian">
            Bridging <span id="gaps-target" className="relative">Gaps</span>,
            <br />
            Breaking Barriers.
          </h1>
          
          {/* <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto font-inter font-light">
            SheBuilds is an inclusive community and fellowship program dedicated to empowering women in technology and entrepreneurship. At its core, SheBuilds is more than just a network — it's a movement.
          </p> */}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-3 text-base font-medium rounded-full font-inter" onClick={() => navigate('/projects')}>
              Explore Projects
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900 px-8 py-3 text-base font-medium font-inter" onClick={() => navigate('/community')}>
              Explore Community
            </Button>
            {!isLoggedIn && (
              <Button className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-3 text-base font-medium rounded-full font-inter" onClick={() => navigate('/register')}>
                Join SheBuilds
              </Button>
            )}
          </div>
        </div>

        {/* Auto-Scrolling Event Cards */}
        <div className="max-w-full mx-auto overflow-hidden scrolling-rows">
          {/* Top Row - Right to Left */}
          <div className="flex animate-scroll-right mb-8">
            {topRowEvents.map((event, index) => (
              <div key={`top-${index}`} className="flex-shrink-0 w-96 mx-4">
                <div className="relative h-56 rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
                  <img
                    src={event.image}
                    alt={event.eventTitle}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row - Left to Right */}
          <div className="flex animate-scroll-left">
            {bottomRowEvents.map((event, index) => (
              <div key={`bottom-${index}`} className="flex-shrink-0 w-96 mx-4">
                <div className="relative h-56 rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
                  <img
                    src={event.image}
                    alt={event.eventTitle}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animation styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes scroll-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        
        .animate-scroll-left {
          animation: scroll-left 20s linear infinite;
        }
        
        .animate-scroll-right {
          animation: scroll-right 20s linear infinite;
        }
        
        .scrolling-rows:hover .animate-scroll-left,
        .scrolling-rows:hover .animate-scroll-right {
          animation-play-state: paused;
        }

        .butterfly {
          position: absolute;
          width: 70px;
          height: 70px;
          transform: scale(0.8);
          animation: fly-and-sit 15s ease-in-out infinite;
          z-index: 10;
          pointer-events: auto;
          transition: transform 0.3s, filter 0.3s;
          filter: brightness(0.6);
        }

        .butterfly:hover {
          animation-play-state: paused;
          transform: scale(1.1);
          filter: drop-shadow(0 0 10px rgba(255, 165, 0, 0.7));
        }

        @keyframes fly-and-sit {
          0%, 100% {
            top: 10%;
            left: -10%;
            transform: scale(0.8) rotate(20deg);
          }
          15% {
            top: 60%;
            left: 30%;
            transform: scale(1) rotate(-10deg);
          }
          30% {
            top: 30%;
            left: 70%;
            transform: scale(0.9) rotate(30deg);
          }
          45% {
            top: 50%;
            left: 95%;
            transform: scale(1) rotate(0deg);
          }
          
          /* Land on "Gaps" */
          60% {
            /* These values are fine-tuned for a typical 1080p screen. */
            /* The butterfly will land relative to the heading. */
            top: calc(50% - 220px);
            left: calc(50% - 40px);
            transform: scale(0.5) rotate(0deg) translateY(-50%);
          }

          /* Sit on "Gaps" for a few seconds */
          75% {
            top: calc(50% - 220px);
            left: calc(50% - 40px);
            transform: scale(0.5) rotate(0deg) translateY(-50%);
          }

          90% {
            top: 20%;
            left: 110%;
            transform: scale(0.9) rotate(10deg);
          }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animation-delay-200 { animation-delay: 0.2s; opacity: 0; }
        .animation-delay-400 { animation-delay: 0.4s; opacity: 0; }
        .animation-delay-600 { animation-delay: 0.6s; opacity: 0; }
      `}} />
    </div>
  );
};

export default Hero;