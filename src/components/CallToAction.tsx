
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CallToAction = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="container mx-auto max-w-4xl">
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Build the Future?
            </h2>
            <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto leading-relaxed">
              Join our community of innovators, creators, and changemakers. Whether you're looking to connect, learn, or sponsor our mission, there's a place for you at SheBuilds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Join Our Community
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold transition-all duration-300"
              >
                View FAQ
              </Button>
            </div>
            
            <div className="border-t border-white/20 pt-8">
              <p className="text-purple-200 mb-4">For sponsorship inquiries:</p>
              <a 
                href="mailto:shebuilds.hacks@gmail.com" 
                className="text-xl font-semibold text-yellow-300 hover:text-yellow-200 transition-colors duration-300"
              >
                shebuilds.hacks@gmail.com
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CallToAction;
