import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-royal-purple via-soft-lavender to-emerald-accent">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-white rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white rounded-full animate-float-delayed-2"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-white">
            <div className="mb-4">
              <Badge className="inline-block bg-white bg-opacity-20 text-white text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm border-none">
                ✨ Curated by Beauty Experts
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-playfair font-bold leading-tight mb-6">
              Discover Your Perfect 
              <span className="block bg-gradient-to-r from-emerald-accent to-white bg-clip-text text-transparent">
                Beauty Match
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white text-opacity-90 mb-8 leading-relaxed">
              Premium cosmetics, mother care, and pet grooming products from our carefully selected partners. Quality guaranteed, beauty elevated.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <Button 
                  className="bg-white text-royal-purple px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-xl w-full sm:w-auto"
                  data-testid="button-shop-now"
                >
                  Shop Now
                </Button>
              </Link>
              <Link to="/partners">
                <Button 
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-royal-purple transition-all duration-200 w-full sm:w-auto"
                  data-testid="button-discover-partners"
                >
                  Discover Partners
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 mt-8 pt-8 border-t border-white border-opacity-20">
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-300">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-white text-sm">4.9/5 Rating</span>
              </div>
              <div className="text-white text-sm">
                <strong>25K+</strong> Happy Customers
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Elegant model with luxury makeup" 
              className="rounded-2xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform duration-500"
              data-testid="img-hero-model"
            />
            
            {/* Floating product showcase */}
            <div className="absolute -top-4 -left-4 bg-white rounded-xl p-4 shadow-xl animate-float">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                  alt="Premium makeup products" 
                  className="w-12 h-12 rounded-lg object-cover" 
                />
                <div>
                  <p className="font-medium text-sm">Premium Collection</p>
                  <p className="text-emerald-accent text-sm font-semibold">Just Added</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-xl animate-float-delayed">
              <div className="text-center">
                <p className="font-bold text-royal-purple text-lg">30%</p>
                <p className="text-xs text-gray-600">OFF Today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
