import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, Search, ShoppingCart, User } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-royal-purple to-emerald-accent text-white text-center py-2 px-4">
        <div className="flex items-center justify-center space-x-2 text-sm font-medium">
          <span className="animate-pulse">⚡</span>
          <span>LIMITED TIME: 30% OFF SITEWIDE + FREE SHIPPING OVER $50</span>
          <span className="animate-pulse">⚡</span>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <div className="flex items-center cursor-pointer" data-testid="link-home">
              <div className="font-playfair font-bold text-2xl bg-gradient-to-r from-royal-purple to-emerald-accent bg-clip-text text-transparent">
                Shop&Glow
              </div>
              <div className="hidden sm:block ml-2 text-xs text-gray-500 font-medium">CURATED BEAUTY</div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/products">
              <a 
                className={`font-medium transition-colors duration-200 ${
                  isActive("/products") ? "text-royal-purple" : "text-gray-700 hover:text-royal-purple"
                }`}
                data-testid="link-products"
              >
                New Arrivals
              </a>
            </Link>
            <Link to="/products">
              <a 
                className={`font-medium transition-colors duration-200 ${
                  location.startsWith("/products") ? "text-royal-purple" : "text-gray-700 hover:text-royal-purple"
                }`}
                data-testid="link-categories"
              >
                Categories
              </a>
            </Link>
            <Link to="/products?featured=true">
              <a 
                className="text-gray-700 hover:text-royal-purple transition-colors duration-200 font-medium"
                data-testid="link-best-sellers"
              >
                Best Sellers
              </a>
            </Link>
            <Link to="/partners">
              <a 
                className={`font-medium transition-colors duration-200 ${
                  isActive("/partners") ? "text-royal-purple" : "text-gray-700 hover:text-royal-purple"
                }`}
                data-testid="link-partners"
              >
                Partners
              </a>
            </Link>
          </nav>
          
          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-700 hover:text-royal-purple transition-colors duration-200"
              data-testid="button-search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-700 hover:text-royal-purple transition-colors duration-200"
              data-testid="button-account"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="relative text-gray-700 hover:text-royal-purple transition-colors duration-200"
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 bg-emerald-accent text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                2
              </Badge>
            </Button>
            
            {/* Mobile Menu Button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="md:hidden text-gray-700"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-sm">
                <SheetHeader>
                  <SheetTitle className="font-playfair text-xl bg-gradient-to-r from-royal-purple to-emerald-accent bg-clip-text text-transparent">
                    Shop&Glow
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link to="/products" onClick={() => setIsMenuOpen(false)}>
                    <a 
                      className="text-lg font-medium text-gray-700 hover:text-royal-purple transition-colors py-2"
                      data-testid="mobile-link-products"
                    >
                      New Arrivals
                    </a>
                  </Link>
                  <Link to="/products" onClick={() => setIsMenuOpen(false)}>
                    <a 
                      className="text-lg font-medium text-gray-700 hover:text-royal-purple transition-colors py-2"
                      data-testid="mobile-link-categories"
                    >
                      Categories
                    </a>
                  </Link>
                  <Link to="/products?featured=true" onClick={() => setIsMenuOpen(false)}>
                    <a 
                      className="text-lg font-medium text-gray-700 hover:text-royal-purple transition-colors py-2"
                      data-testid="mobile-link-best-sellers"
                    >
                      Best Sellers
                    </a>
                  </Link>
                  <Link to="/partners" onClick={() => setIsMenuOpen(false)}>
                    <a 
                      className="text-lg font-medium text-gray-700 hover:text-royal-purple transition-colors py-2"
                      data-testid="mobile-link-partners"
                    >
                      Partners
                    </a>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
