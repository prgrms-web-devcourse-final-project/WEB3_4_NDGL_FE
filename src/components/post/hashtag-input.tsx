import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface HashtagInputProps {
  hashtagInput: string;
  setHashtagInput: (value: string) => void;
  hashtags: { name: string }[];
  addHashtag: () => void;
  removeHashtag: (name: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur: () => void;
}

export const HashtagInput = ({
  hashtagInput,
  setHashtagInput,
  hashtags,
  removeHashtag,
  onKeyDown,
  onBlur,
}: HashtagInputProps) => {
  return (
    <div>
      <Input
        placeholder="태그 입력 후 엔터"
        value={hashtagInput}
        onChange={(e) => setHashtagInput(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {hashtags.map((tag) => (
          <Badge
            key={tag.name}
            onClick={() => removeHashtag(tag.name)}
            className="cursor-pointer"
          >
            {tag.name} ×
          </Badge>
        ))}
      </div>
    </div>
  );
};
