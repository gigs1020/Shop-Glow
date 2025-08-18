import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category, Product } from "@shared/schema";

export default function Products() {
  const { category } = useParams();
  
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { category: category, limit: "20" }],
  });

  const { data: categoryInfo } = useQuery<Category>({
    queryKey: ["/api/categories", category],
    enabled: !!category,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-elegant-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <Skeleton className="h-64 w-full rounded-t-lg" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-6 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-elegant-white">
      <Header />
      
      {/* Category Header */}
      <section className="bg-gradient-to-br from-royal-purple to-emerald-accent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
            {categoryInfo?.name || "All Products"}
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            {categoryInfo?.description || "Discover our complete collection of premium beauty products"}
          </p>
          <div className="mt-6">
            <Badge className="bg-white bg-opacity-20 text-white border-none">
              {products?.length || 0} Products Available
            </Badge>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products?.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-6">
                <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m12 0V9a2 2 0 00-2-2H8a2 2 0 00-2 2v4h12z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">
                We're currently adding products to this category. Check back soon!
              </p>
              <Button 
                className="bg-royal-purple hover:bg-soft-lavender text-white"
                onClick={() => window.history.back()}
                data-testid="button-go-back"
              >
                Go Back
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
