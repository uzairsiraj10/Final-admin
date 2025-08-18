
import { Star } from "lucide-react";

interface RatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
}

export const Rating = ({ rating, maxRating = 5, size = 16 }: RatingProps) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: maxRating }).map((_, i) => (
        <Star 
          key={i}
          size={size}
          className={`mr-1 ${
            i < Math.floor(rating) 
              ? "fill-primary-blue text-primary-blue" 
              : i < rating 
                ? "fill-primary-blue/40 text-primary-blue" 
                : "fill-none text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};
