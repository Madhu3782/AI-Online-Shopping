import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  description: string;
  href: string;
  iconColor: string;
}

const CategoryCard = ({ title, icon: Icon, description, href, iconColor }: CategoryCardProps) => {
  return (
    <Link to={href} className="group">
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-primary/50">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className={`rounded-full p-4 mb-4 transition-transform group-hover:scale-110 ${iconColor}`}>
            <Icon className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
