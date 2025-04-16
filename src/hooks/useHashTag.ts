import { PostSchemaType } from "@/schemas/post.schema";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export const useHashtag = (form: UseFormReturn<PostSchemaType>) => {
  const [hashtagInput, setHashtagInput] = useState("");

  const addHashtag = () => {
    const value = hashtagInput.trim().replace(/,$/, "");
    if (!value) return;
    const currentTags = form.getValues("hashtags");
    if (currentTags.length >= 10) {
      toast.error("최대 10개까지 입력 가능합니다.");
      return;
    }
    if (!currentTags.some((tag) => tag.name === value)) {
      form.setValue("hashtags", [...currentTags, { name: value }]);
    }
    setHashtagInput("");
  };

  const removeHashtag = (name: string) => {
    form.setValue(
      "hashtags",
      form.getValues("hashtags").filter((tag) => tag.name !== name)
    );
  };

  return {
    hashtagInput,
    setHashtagInput,
    addHashtag,
    removeHashtag,
    handleHashtagKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.nativeEvent.isComposing) {
        e.preventDefault();
        addHashtag();
      }
    },
    handleHashtagBlur: addHashtag,
  };
};
