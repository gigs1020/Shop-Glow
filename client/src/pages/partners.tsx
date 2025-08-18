import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, DollarSign, Shield, Zap } from "lucide-react";

const partnerApplicationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  category: z.enum(["makeup", "beauty-tools", "mother-care", "pet-care"], {
    required_error: "Please select a category",
  }),
  description: z.string().min(50, "Description must be at least 50 characters"),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  commissionRate: z.string().regex(/^(8|9|10|11|12|13|14|15)\.00$/, "Commission rate must be between 8.00 and 15.00"),
});

type PartnerApplicationForm = z.infer<typeof partnerApplicationSchema>;

export default function Partners() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<PartnerApplicationForm>({
    resolver: zodResolver(partnerApplicationSchema),
    defaultValues: {
      userId: "temp-user-id", // In a real app, this would come from auth context
      businessName: "",
      category: undefined,
      description: "",
      website: "",
      commissionRate: "10.00",
    },
  });

  const submitApplication = useMutation({
    mutationFn: async (data: PartnerApplicationForm) => {
      const response = await apiRequest("POST", "/api/partners", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Application Submitted Successfully",
        description: "We'll review your application and get back to you within 5-7 business days.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
    },
    onError: (error: any) => {
      toast({
        title: "Application Failed",
        description: error.message || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PartnerApplicationForm) => {
    submitApplication.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-elegant-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="pt-6 pb-8">
              <div className="mb-6">
                <CheckCircle className="mx-auto h-16 w-16 text-emerald-accent" />
              </div>
              <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-4">
                Application Submitted!
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for your interest in becoming a Shop&Glow partner. We've received your application and will review it within 5-7 business days.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                We'll contact you at the email address associated with your account once we've completed our review.
              </p>
              <Button 
                onClick={() => setIsSubmitted(false)}
                className="bg-royal-purple hover:bg-soft-lavender text-white"
                data-testid="button-submit-another"
              >
                Submit Another Application
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-elegant-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-royal-purple to-emerald-accent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
            Become a Shop&Glow Partner
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Join our exclusive network of premium beauty brands and reach thousands of quality-conscious customers.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-4">
              Partner Benefits
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Why thousands of premium brands choose Shop&Glow as their marketplace partner
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-royal-purple to-emerald-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Exclusive Access</h3>
                <p className="text-gray-600">Maximum 2 partners per category ensures focused promotion and reduced competition.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-accent to-royal-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Fair Commission</h3>
                <p className="text-gray-600">Competitive 8-15% commission structure with automated weekly payouts via ACH.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-soft-lavender to-emerald-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Protection System</h3>
                <p className="text-gray-600">Comprehensive dispute resolution and partner protection with evidence-based claims.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-soft-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-playfair text-center">Partner Application</CardTitle>
              <p className="text-center text-gray-600">
                Fill out the form below to apply for partnership with Shop&glow
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-partner-application">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your business name" 
                            {...field} 
                            data-testid="input-business-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="Select your product category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="makeup">Makeup</SelectItem>
                            <SelectItem value="beauty-tools">Beauty Tools</SelectItem>
                            <SelectItem value="mother-care">Mother Care</SelectItem>
                            <SelectItem value="pet-care">Pet Care</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          We accept maximum 2 partners per category to ensure quality and exclusivity.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your business, products, and what makes you unique..." 
                            className="min-h-[120px]"
                            {...field} 
                            data-testid="textarea-description"
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum 50 characters. Help us understand your brand and products.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://your-website.com" 
                            {...field} 
                            data-testid="input-website"
                          />
                        </FormControl>
                        <FormDescription>
                          Your business website or online presence (optional but recommended).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="commissionRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proposed Commission Rate (%)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-commission">
                              <SelectValue placeholder="Select commission rate" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="8.00">8%</SelectItem>
                            <SelectItem value="9.00">9%</SelectItem>
                            <SelectItem value="10.00">10%</SelectItem>
                            <SelectItem value="11.00">11%</SelectItem>
                            <SelectItem value="12.00">12%</SelectItem>
                            <SelectItem value="13.00">13%</SelectItem>
                            <SelectItem value="14.00">14%</SelectItem>
                            <SelectItem value="15.00">15%</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Our commission range is 8-15%. Higher quality brands may qualify for lower rates.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-royal-purple to-emerald-accent text-white hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      disabled={submitApplication.isPending}
                      data-testid="button-submit-application"
                    >
                      {submitApplication.isPending ? "Submitting Application..." : "Submit Partner Application"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
