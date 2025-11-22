import { useState } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface TestimonialFormProps {
  albumId: string;
  onSubmit: (rating: number, comment: string) => void | Promise<void>;
  onCancel?: () => void;
  existingTestimonial?: {
    rating: number;
    comment: string;
  };
}

export default function TestimonialForm({ 
  albumId, 
  onSubmit, 
  onCancel,
  existingTestimonial 
}: TestimonialFormProps) {
  const [rating, setRating] = useState(existingTestimonial?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingTestimonial?.comment || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      await onSubmit(rating, comment);
    }
  };

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-8 border-2 border-neutral-800">
      <div className="flex items-start gap-3 mb-6">
        <div className="p-3 bg-blue-500/10 rounded-lg">
          <MessageSquare className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h3 className="font-['Inter'] font-extrabold text-[24px] text-neutral-100 tracking-[-1.2px] mb-1">
            {existingTestimonial ? 'Edit Your Review' : 'Share Your Experience'}
          </h3>
          <p className="font-['Inter'] text-[14px] text-neutral-400">
            Help others by sharing your thoughts about this album
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block font-['Inter'] font-medium text-[14px] text-neutral-300 mb-3">
            Your Rating *
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-500 text-yellow-500'
                      : 'text-neutral-600 hover:text-neutral-500'
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-4 font-['Inter'] text-[16px] text-neutral-400">
                {rating === 5 && '🌟 Excellent!'}
                {rating === 4 && '😊 Great!'}
                {rating === 3 && '👍 Good'}
                {rating === 2 && '😐 Fair'}
                {rating === 1 && '😔 Poor'}
              </span>
            )}
          </div>
          {rating === 0 && (
            <p className="font-['Inter'] text-[12px] text-neutral-500 mt-2">
              Click on the stars to rate
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="block font-['Inter'] font-medium text-[14px] text-neutral-300 mb-3">
            Your Review (Optional)
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience with this album..."
            rows={5}
            className="w-full px-4 py-3 bg-[#0d0d0d] border-2 border-neutral-800 rounded-xl text-neutral-100 font-['Inter'] placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors resize-none"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="font-['Inter'] text-[12px] text-neutral-500">
              Share what you loved or what could be improved
            </p>
            <p className="font-['Inter'] text-[12px] text-neutral-500">
              {comment.length}/500
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={rating === 0}
            className="flex-1 px-6 py-6 bg-neutral-100 hover:bg-neutral-200 text-[#0d0d0d] rounded-lg font-['Inter'] font-extrabold text-[16px] tracking-[-0.8px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            {existingTestimonial ? 'Update Review' : 'Submit Review'}
          </Button>
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              className="px-6 py-6 bg-[#0d0d0d] hover:bg-neutral-900 text-neutral-300 border-2 border-neutral-800 hover:border-neutral-700 rounded-lg font-['Inter'] font-medium text-[16px] transition-colors"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
