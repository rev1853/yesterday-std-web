import { Star, MessageSquare, User } from 'lucide-react';

interface Testimonial {
  id: string;
  albumId: string;
  clientId: string;
  clientName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface TestimonialsListProps {
  testimonials: Testimonial[];
  albumTitle?: string;
}

export default function TestimonialsList({ testimonials, albumTitle }: TestimonialsListProps) {
  if (testimonials.length === 0) {
    return (
      <div className="bg-[#1e1e1e] rounded-xl p-12 border-2 border-neutral-800 text-center">
        <MessageSquare className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
        <p className="font-['Inter'] text-[20px] text-neutral-500 mb-2">
          No reviews yet
        </p>
        <p className="font-['Inter'] text-[14px] text-neutral-600">
          {albumTitle ? `Be the first to leave a review for ${albumTitle}` : 'Reviews from clients will appear here'}
        </p>
      </div>
    );
  }

  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-[#1e1e1e] rounded-xl p-8 border-2 border-neutral-800">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="font-['Inter'] font-extrabold text-[64px] text-neutral-100 tracking-[-3.2px] mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center gap-1 justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(averageRating)
                      ? 'fill-yellow-500 text-yellow-500'
                      : 'text-neutral-600'
                  }`}
                />
              ))}
            </div>
            <p className="font-['Inter'] text-[14px] text-neutral-400">
              {testimonials.length} {testimonials.length === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = testimonials.filter((t) => t.rating === rating).length;
              const percentage = (count / testimonials.length) * 100;

              return (
                <div key={rating} className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1 w-20">
                    <span className="font-['Inter'] text-[14px] text-neutral-400">
                      {rating}
                    </span>
                    <Star className="w-4 h-4 text-neutral-500" />
                  </div>
                  <div className="flex-1 h-2 bg-[#0d0d0d] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="font-['Inter'] text-[14px] text-neutral-400 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-[#1e1e1e] rounded-xl p-6 border-2 border-neutral-800"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-['Inter'] font-extrabold text-[18px] text-neutral-100 tracking-[-0.9px] mb-1">
                    {testimonial.clientName}
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= testimonial.rating
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-neutral-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-['Inter'] text-[12px] text-neutral-500">
                      {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {testimonial.comment && (
              <p className="font-['Inter'] text-[16px] text-neutral-300 leading-relaxed">
                {testimonial.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
