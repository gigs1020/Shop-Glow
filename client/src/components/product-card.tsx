import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const originalPrice = parseFloat(product.price);
  const salePrice = product.salePrice ? parseFloat(product.salePrice) : null;
  const discountPercentage = salePrice 
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : null;

  const displayPrice = salePrice || originalPrice;
  const rating = parseFloat(product.rating || "0");

  return (
    <div className="group cursor-pointer" data-testid={`product-card-${product.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <div className="relative overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4">
            {product.featured && (
              <Badge className="bg-emerald-accent text-white text-xs font-medium mb-2">
                Best Seller
              </Badge>
            )}
            {discountPercentage && (
              <Badge className="bg-royal-purple text-white text-xs font-medium">
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <Button 
              size="icon"
              variant="secondary"
              className="bg-white bg-opacity-80 hover:bg-opacity-100 transition-all"
              data-testid={`button-favorite-${product.id}`}
            >
              <Heart className="w-4 h-4 text-gray-700" />
            </Button>
            <Button 
              size="icon"
              variant="secondary"
              className="bg-white bg-opacity-80 hover:bg-opacity-100 transition-all"
              data-testid={`button-add-to-cart-${product.id}`}
            >
              <ShoppingCart className="w-4 h-4 text-gray-700" />
            </Button>
          </div>
          
          {/* Rating overlay */}
          {rating > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="flex items-center text-white text-sm">
                <div className="flex text-yellow-300 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-current' : ''}`} 
                    />
                  ))}
                </div>
                <span>{rating.toFixed(1)} ({product.reviewCount} reviews)</span>
              </div>
            </div>
          )}
        </div>
        
        <CardContent className="p-4 space-y-2">
          <h3 
            className="font-semibold text-gray-900 group-hover:text-royal-purple transition-colors line-clamp-2"
            data-testid={`text-product-name-${product.id}`}
          >
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">by Partner</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span 
                className="text-lg font-bold text-royal-purple"
                data-testid={`text-price-${product.id}`}
              >
                ${displayPrice.toFixed(2)}
              </span>
              {salePrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {discountPercentage && (
              <Badge 
                variant="secondary" 
                className="text-emerald-accent text-sm font-medium"
              >
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>
          
          {!product.inStock && (
            <Badge variant="destructive" className="text-sm">
              Out of Stock
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
