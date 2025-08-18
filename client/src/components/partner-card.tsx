import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface PartnerCardProps {
  name: string;
  category: string;
  description: string;
  icon: string;
}

export default function PartnerCard({ name, category, description, icon }: PartnerCardProps) {
  return (
    <div className="group bg-soft-gray rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="w-16 h-16 bg-gradient-to-br from-royal-purple to-emerald-accent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200 text-2xl">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{name}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex items-center text-emerald-accent font-medium">
        <span className="text-sm">Featured Partner</span>
        <CheckCircle className="w-4 h-4 ml-2" />
      </div>
    </div>
  );
}
