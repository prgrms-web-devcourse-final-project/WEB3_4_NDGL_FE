import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { searchSchema, type SearchSchemaType } from "@/schemas/search.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import { suggestKeyword } from "@/services/search.service";

export const NavbarSearch = ({
  placeholder,
  onClose,
}: {
  placeholder?: string;
  onClose?: () => void;
}) => {
  const router = useNavigate();

  const form = useForm<SearchSchemaType>({
    defaultValues: { query: "" },
    resolver: zodResolver(searchSchema),
  });

  const queryValue = form.watch("query");
  const [debouncedQuery] = useDebounce(queryValue, 300);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { data, isFetching } = useQuery({
    queryKey: ["suggestions", debouncedQuery],
    queryFn: () => suggestKeyword(debouncedQuery),
    enabled: !!debouncedQuery,
    select: (res) => res.data.data.slice(0, 5),
  });

  useEffect(() => {
    if (data) setSuggestions(data);
  }, [data]);

  const submitHandler = (values: SearchSchemaType) => {
    const trimmedQuery = values.query.trim();
    if (!trimmedQuery) return;
    form.reset();
    onClose?.();
    router(`/post?query=${encodeURIComponent(trimmedQuery)}&mode=search`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)}>
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <div className="flex items-center justify-between border rounded-lg px-2">
                    <Input
                      {...field}
                      placeholder={placeholder ?? "검색어를 입력해주세요."}
                      className="border-none outline-none bg-transparent shadow-none"
                      autoComplete="off"
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      className="cursor-pointer border-none outline-none hover:bg-transparent"
                    >
                      <SearchIcon className="size-4" />
                    </Button>
                  </div>
                  {suggestions.length > 0 && queryValue && (
                    <ul className="absolute z-10 w-full bg-background/70 border rounded-md mt-1 shadow-md">
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="px-3 py-1.5 cursor-pointer hover:bg-muted"
                          onClick={() => {
                            form.setValue("query", suggestion);
                            submitHandler({ query: suggestion });
                          }}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                  {isFetching && (
                    <p className="absolute left-1 mt-1 text-xs text-muted-foreground">
                      검색 중...
                    </p>
                  )}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
