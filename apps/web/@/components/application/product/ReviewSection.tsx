import { Star } from "lucide-react";

interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  summary: string;
}

export default function ReviewSection({
  productId,
  summary,
}: {
  productId: string;
  summary: ReviewSummary;
}) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      <div className="bg-secondary/5 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <div className="flex items-center mr-4">
            {[...Array(5)].map((_, i) => (
              <Star
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(summary.averageRating)
                    ? "text-yellow-400 fill-current"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-lg font-semibold">
            {summary.averageRating.toFixed(1)}
          </span>
          <span className="text-muted-foreground ml-2">
            ({summary.totalReviews} reviews)
          </span>
        </div>
        <p className="text-muted-foreground">{summary.summary}</p>
      </div>
    </section>
  );
}
