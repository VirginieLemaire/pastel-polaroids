import { useState } from "react";
import { useVotes, type Rating } from "@/features/votes";
import { useCurrentUser } from "@/features/user";

const STAR_PATH =
  "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z";

interface VoteStarsProps {
  photoId: string;
  contestId: string;
}

export default function VoteStars({ photoId, contestId }: VoteStarsProps) {
  const { getVoteByUser, castVote } = useVotes();
  const { currentUser } = useCurrentUser();
  const currentVote = getVoteByUser(photoId, currentUser.id);
  const rating = currentVote?.rating ?? 0;
  const [hover, setHover] = useState(0);
  const active = hover || rating;

  return (
    <div
      className="flex justify-center gap-1 mt-2"
      onClick={(e) => e.stopPropagation()}
      role="group"
      aria-label="Noter la photo"
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            castVote(photoId, contestId, value as Rating);
          }}
          onMouseEnter={() => setHover(value)}
          onMouseLeave={() => setHover(0)}
          onFocus={() => setHover(value)}
          onBlur={() => setHover(0)}
          className={`w-5 h-5 transition-colors ${
            value <= active ? "text-yellow-500" : "text-muted-foreground"
          }`}
          aria-label={`${value} sur 5`}
          aria-pressed={value === rating}
        >
          <svg
            viewBox="0 0 24 24"
            fill={value <= active ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
            className="w-full h-full"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={STAR_PATH} />
          </svg>
        </button>
      ))}
    </div>
  );
}
