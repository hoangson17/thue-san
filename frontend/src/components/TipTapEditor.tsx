import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Link from "@tiptap/extension-link";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";
import { Card } from "@/components/ui/card";
import { useCallback, useRef } from "react";
import { Table } from "@tiptap/extension-table";
import { EditorToolbar } from "./EditorToolbar";
import { CustomImage } from "./extensions/CustomImage";

interface TipTapEditorProps {
  value?: string;
  onChange?: (html: string) => void;
}

export function TipTapEditor({ value, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      Highlight,
      Subscript,
      Superscript,
      Link.configure({
        openOnClick: false,
        autolink: true,
        validate: (href) => /^https?:\/\//.test(href),
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      CustomImage,
      Table.configure({
        resizable: true,
        lastColumnResizable: true,
        allowTableNodeSelection: true,
        cellMinWidth: 100,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Emoji.configure({
        emojis: gitHubEmojis,
        enableEmoticons: true,
      }),
    ],
    content: value ?? "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px] p-4",
        spellcheck: "true",
      },
    },
  });

  if (!editor) {
    return (
      <Card className="overflow-hidden border min-h-[200px] p-4">
        <div className="animate-pulse">Đang tải trình soạn thảo...</div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border w-full">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </Card>
  );
}