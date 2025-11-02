
import { Card, CardContent } from '@/components/ui/card';

const Sponsors = () => {
  const sponsors = [
    { name: "Concordium", logo: "C", color: "from-blue-500 to-purple-500" },
    { name: "Appwrite", logo: "A", color: "from-pink-500 to-red-500" },
    { name: "GitHub", logo: "G", color: "from-gray-700 to-gray-900" },
    { name: "Your Logo Here", logo: "?", color: "from-teal-500 to-green-500" }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Our Sponsors
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-teal-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're grateful to our sponsors who share our vision of creating a more inclusive tech ecosystem.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {sponsors.map((sponsor, index) => (
            <Card 
              key={index} 
              className="group hover:scale-105 transition-all duration-300 border-0 shadow-lg hover:shadow-2xl"
            >
              <CardContent className="p-8 text-center">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${sponsor.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl font-bold text-white">{sponsor.logo}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{sponsor.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Interested in sponsoring SheBuilds and supporting our mission?
          </p>
          <a 
            href="mailto:shebuilds.hacks@gmail.com" 
            className="inline-block bg-gradient-to-r from-purple-600 to-teal-500 text-white px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Contact Us for Sponsorship
          </a>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
