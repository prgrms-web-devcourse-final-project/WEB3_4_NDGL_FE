import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export const FloatingButton = () => {
  return (
    <Link to="/post/create" className="fixed right-6 bottom-6 z-50">
      <Button
        size="icon"
        className="bg-primary hover:bg-primary/90 h-12 w-12 cursor-pointer rounded-full text-white shadow-lg transition-colors dark:text-black"
      >
        <PencilIcon className="h-6 w-6" />
      </Button>
    </Link>
  );
};
