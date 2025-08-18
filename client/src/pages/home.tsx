import Header from "@/components/header";
import Hero from "@/components/hero";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import PartnerCard from "@/components/partner-card";
import NewsletterSignup from "@/components/newsletter-signup";
import CountdownTimer from "@/components/countdown-timer";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, Heart, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import type { Category, Product, FlashSale } from "@shared/schema";

export default function Home() {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: featuredProducts } = useQuery<Product[]>({
    queryKey: ["/api/products", { featured: "true", limit: "4" }],
  });

  const { data: flashSale } = useQuery<FlashSale>({
    queryKey: ["/api/flash-sale"],
  });

  return (
    <div className="min-h-screen bg-elegant-white">
      <Header />
      <Hero />
      
      {/* Flash Sale Banner */}
      {flashSale && (
        <section className="bg-gradient-to-r from-emerald-accent to-royal-purple py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-4 text-white">
              <div className="animate-pulse">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="font-semibold">⚡ FLASH SALE:</span>
              <span>Free shipping on orders over $50 - Ends in</span>
              <CountdownTimer endTime={flashSale.endTime} />
            </div>
          </div>
        </section>
      )}

      {/* Quick Links Section */}
      <section className="py-12 bg-soft-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {categories?.map((category) => (
              <Link key={category.id} to={`/products/${category.slug}`}>
                <div className="group cursor-pointer" data-testid={`category-link-${category.slug}`}>
                  <div className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <img 
                      src={category.imageUrl || ""} 
                      alt={category.name}
                      className="w-16 h-16 mx-auto rounded-xl object-cover mb-4 group-hover:scale-110 transition-transform duration-200" 
                    />
                    <h3 className="font-semibold text-gray-900 group-hover:text-royal-purple transition-colors">{category.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{category.description?.split('.')[0]}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">
              Curated Collections
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection from premium beauty partners. Each product is carefully vetted for quality and performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {featuredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/products">
              <Button 
                className="bg-gradient-to-r from-royal-purple to-emerald-accent text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                data-testid="button-view-all-products"
              >
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-soft-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">
              Loved by Beauty Enthusiasts
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our customers are saying about their Shop&glow experience
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-royal-purple mb-2">25K+</div>
              <div className="text-gray-600 font-medium">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-accent mb-2">4.9★</div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-royal-purple mb-2">8</div>
              <div className="text-gray-600 font-medium">Curated Partners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-accent mb-2">500+</div>
              <div className="text-gray-600 font-medium">Premium Products</div>
            </div>
          </div>

          {/* Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "The quality of products from Shop&glow's curated partners is exceptional. I finally found my holy grail skincare routine, and my skin has never looked better!"
                </blockquote>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                    alt="Happy customer" 
                    className="w-12 h-12 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Sarah Martinez</div>
                    <div className="text-sm text-gray-500">Verified Buyer</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review 2 */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "As a makeup artist, I rely on high-quality tools. The professional brush set I got from Shop&glow exceeded my expectations. Amazing curation!"
                </blockquote>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                    alt="Professional makeup artist" 
                    className="w-12 h-12 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Jessica Chen</div>
                    <div className="text-sm text-gray-500">Professional MUA</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review 3 */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "The mother care products are a godsend! Gentle, effective, and safe for both me and my baby. Shop&glow's curation is spot on."
                </blockquote>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                    alt="Happy mother customer" 
                    className="w-12 h-12 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Emma Thompson</div>
                    <div className="text-sm text-gray-500">New Mother</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">
              Our Curated Partners
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We carefully select only the best partners in each category to ensure premium quality and exceptional customer experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <PartnerCard 
              name="LuxeBeauty" 
              category="makeup"
              description="Premium makeup collections featuring innovative formulas and stunning color payoff."
              icon="✨"
            />
            <PartnerCard 
              name="MakeupMasters" 
              category="beauty-tools"
              description="Professional-grade brushes and tools trusted by makeup artists worldwide."
              icon="🎨"
            />
            <PartnerCard 
              name="MotherlyCare" 
              category="mother-care"
              description="Gentle, natural skincare products designed for expecting and new mothers."
              icon="💝"
            />
            <PartnerCard 
              name="PetPampering" 
              category="pet-care"
              description="Luxury grooming products that keep your pets looking and feeling their best."
              icon="🐾"
            />
          </div>

          {/* Partner Benefits */}
          <div className="mt-16 bg-gradient-to-br from-royal-purple to-emerald-accent rounded-3xl p-8 md:p-12 text-white">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-playfair font-bold mb-4">Want to Become a Partner?</h3>
              <p className="text-lg opacity-90">Join our exclusive network of premium beauty brands</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-semibold mb-2">Quality Assurance</h4>
                <p className="text-sm opacity-90">Rigorous vetting process ensures only premium brands</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">Exclusive Access</h4>
                <p className="text-sm opacity-90">Maximum 2 partners per category for focused promotion</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">Fair Commission</h4>
                <p className="text-sm opacity-90">Competitive 8-15% commission with weekly payouts</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link to="/partners">
                <Button 
                  className="bg-white text-royal-purple px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
                  data-testid="button-apply-partner"
                >
                  Apply to Become a Partner
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSignup />
      <Footer />
    </div>
  );
}
