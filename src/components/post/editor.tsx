'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import {
  StarterKit,
  Bold,
  Italic,
  Underline,
  Strike,
  Code,
  Heading,
  Blockquote,
  BulletList,
  OrderedList,
  ListItem,
  TaskList,
  TaskItem,
  Link,
  Image,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Youtube,
  Highlight,
  HorizontalRule,
  Placeholder,
  TextAlign,
  CharacterCount,
} from '@/lib/tiptap';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import TextStyle from '@tiptap/extension-text-style';
import { Level } from '@tiptap/extension-heading';

const fontSizeMap: { [key: string]: string } = {
  '1': '가장 큼',
  '2': '큼',
  '3': '보통',
  '4': '작음',
  '5': '가장 작음',
};

export const Editor = ({ onChange }: { onChange: (html: string) => void }) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Strike,
      Code,
      Heading.configure({
        levels: [1, 2, 3, 4, 5],
      }),
      Blockquote,
      BulletList,
      OrderedList,
      ListItem,
      TaskList,
      TaskItem.configure({ nested: true }),
      Link,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube,
      Highlight,
      HorizontalRule,
      Placeholder.configure({ placeholder: '내용을 작성하세요...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CharacterCount,
      TextStyle,
    ],
    content: '',
    editorProps: {
      attributes: {
        class:
          'border rounded-md bg-white dark:bg-gray-800 shadow-sm min-h-[300px] p-4 prose dark:prose-invert max-w-none',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const alignment = ['left', 'center', 'right', 'justify'];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1 rounded-md border bg-gray-50 p-2 dark:bg-gray-700">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            editor.isActive('bold') && 'bg-gray-300 dark:bg-gray-600',
          )}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            editor.isActive('italic') && 'bg-gray-300 dark:bg-gray-600',
          )}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            editor.isActive('underline') && 'bg-gray-300 dark:bg-gray-600',
          )}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            editor.isActive('strike') && 'bg-gray-300 dark:bg-gray-600',
          )}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <StrikethroughIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            editor.isActive('code') && 'bg-gray-300 dark:bg-gray-600',
          )}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <CodeIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            editor.isActive('bulletList') && 'bg-gray-300 dark:bg-gray-600',
          )}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ListIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            editor.isActive('orderedList') && 'bg-gray-300 dark:bg-gray-600',
          )}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrderedIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            editor.isActive('blockquote') && 'bg-gray-300 dark:bg-gray-600',
          )}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <QuoteIcon />
        </Button>

        <Select
          onValueChange={(value) =>
            editor.chain().focus().setTextAlign(value).run()
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="정렬" />
          </SelectTrigger>
          <SelectContent>
            {alignment.map((align) => (
              <SelectItem key={align} value={align}>
                {align}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(size) =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: parseInt(size) as Level })
              .run()
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="글자 크기" />
          </SelectTrigger>
          <SelectContent>
            {['1', '2', '3', '4', '5'].map((size) => (
              <SelectItem key={size} value={size}>
                {fontSizeMap[size]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};
