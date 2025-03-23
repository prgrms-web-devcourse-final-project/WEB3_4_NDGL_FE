"use client";

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { searchSchema, type SearchSchemaType } from "@/schemas/search.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon } from "lucide-react";
import { Button } from "../ui/button";

type SearchProps = {
  placeholder?: string;
};

export const Search = ({ placeholder }: SearchProps) => {
  const form = useForm<SearchSchemaType>({
    defaultValues: {
      query: "",
    },
    resolver: zodResolver(searchSchema),
  });

  const submitHandler = (values: SearchSchemaType) => {
    console.log(values);
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
                <div className="flex items-center justify-between border rounded-lg px-2">
                  <Input
                    {...field}
                    placeholder={placeholder ?? "검색어를 입력해주세요."}
                    className="border-none outline-none bg-transparent shadow-none"
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    className="cursor-pointer border-none outline-none hover:bg-transparent"
                  >
                    <SearchIcon className="size-4" />
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
