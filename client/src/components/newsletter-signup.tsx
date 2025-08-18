import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle } from "lucide-react";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type NewsletterForm = z.infer<typeof newsletterSchema>;

export default function NewsletterSignup() {
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const form = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const subscribeNewsletter = useMutation({
    mutationFn: async (data: NewsletterForm) => {
      const response = await apiRequest("POST", "/api/newsletter", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubscribed(true);
      toast({
        title: "Successfully Subscribed!",
        description: "You'll receive our latest updates and exclusive offers.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Failed",
        description: error.message || "There was an error subscribing to our newsletter. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: NewsletterForm) => {
    subscribeNewsletter.mutate(data);
  };

  if (isSubscribed) {
    return (
      <section className="py-16 bg-soft-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <CheckCircle className="mx-auto h-16 w-16 text-emerald-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">
            Welcome to the Glow Family!
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            You're all set to receive exclusive beauty tips, product launches, and special offers.
          </p>
          <Button 
            onClick={() => setIsSubscribed(false)}
            className="bg-royal-purple hover:bg-soft-lavender text-white"
            data-testid="button-subscribe-another"
          >
            Subscribe Another Email
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-soft-gray">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">
            Stay in the Glow
          </h2>
          <p className="text-lg text-gray-600">
            Get exclusive access to new product launches, beauty tips, and special offers from our curated partners.
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto" data-testid="form-newsletter">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input 
                        placeholder="Enter your email address"
                        className="px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-royal-purple focus:border-transparent"
                        {...field}
                        data-testid="input-newsletter-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit"
                className="bg-gradient-to-r from-royal-purple to-emerald-accent text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                disabled={subscribeNewsletter.isPending}
                data-testid="button-subscribe-newsletter"
              >
                {subscribeNewsletter.isPending ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
          </form>
        </Form>
        
        <p className="text-sm text-gray-500 mt-4">
          By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
        </p>
        
        {/* Trust badges */}
        <div className="flex items-center justify-center space-x-8 mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-gray-600">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium">Secure Shopping</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium">7-Day Protection</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium">Free Returns</span>
          </div>
        </div>
      </div>
    </section>
  );
}
