import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="font-playfair font-bold text-2xl bg-gradient-to-r from-royal-purple to-emerald-accent bg-clip-text text-transparent mb-4">
              Shop&Glow
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your curated marketplace for premium beauty, mother care, and pet grooming products from trusted partners.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-royal-purple transition-colors"
                data-testid="link-social-twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-royal-purple transition-colors"
                data-testid="link-social-facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-royal-purple transition-colors"
                data-testid="link-social-instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Shop</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products">
                  <a className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-new-arrivals">
                    New Arrivals
                  </a>
                </Link>
              </li>
              <li>
                <Link to="/products?featured=true">
                  <a className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-best-sellers">
                    Best Sellers
                  </a>
                </Link>
              </li>
              <li>
                <Link to="/products/makeup">
                  <a className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-makeup">
                    Makeup
                  </a>
                </Link>
              </li>
              <li>
                <Link to="/products/beauty-tools">
                  <a className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-beauty-tools">
                    Beauty Tools
                  </a>
                </Link>
              </li>
              <li>
                <Link to="/products/mother-care">
                  <a className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-mother-care">
                    Mother Care
                  </a>
                </Link>
              </li>
              <li>
                <Link to="/products/pet-care">
                  <a className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-pet-care">
                    Pet Care
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Track Order</a></li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Partners</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/partners">
                  <a className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-become-partner">
                    Become a Partner
                  </a>
                </Link>
              </li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partner Portal</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Brand Guidelines</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Commission Structure</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Marketing Resources</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; 2024 Shop&glow. All rights reserved. | Privacy Policy | Terms of Service
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-gray-400 text-sm">Secure payments powered by Stripe</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
