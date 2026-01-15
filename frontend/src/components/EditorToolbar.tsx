import { Editor } from "@tiptap/react";
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Image as ImageIcon, Highlighter, 
  Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
  Code, Quote, Minus, Table as TableIcon, Undo, Redo, Smile
} from "lucide-react";
import { useState, useCallback, useMemo, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface EditorToolbarProps {
  editor: Editor;
}

interface ToolbarButton {
  icon: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
  tooltip: string;
  disabled?: boolean;
}

const EMOJI_LIST =[
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣",
  "🥲", "☺️", "😊", "😇","🙂", "🙃", "😉", "😌", 
  "😍", "🥰","😘", "😗", "😙", "😚", "😋", "😛",
  "😎", "🤓","🧐", "😕", "😟", "🙁", "☹️", "😮",
  "😯", "😲", "😳", "🥺","🐶", "🐱", "🐭", "🐹",
  "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮",
  "🌍", "🌎", "🌏", "🌕", "🌖", "🌗", "🌘", "🌑",
  "🌒", "🌓", "🌔", "⭐","🎉", "🎊", "🎂", "🎈",
  "🎁", "🎀", "🎗️", "🎟️", "🎫", "🎮", "♟️", 
  "🎯","🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", 
  "🚓", "🚑", "🚒", "🚐", "🚚", "🚛","❤️", 
  "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍",
  "🤎", "💔", "❣️", "💕"]

const HEADING_LEVELS = [
  { level: 1, icon: <Heading1 className="h-4 w-4" />, label: "Tiêu đề 1" },
  { level: 2, icon: <Heading2 className="h-4 w-4" />, label: "Tiêu đề 2" },
  { level: 3, icon: <Heading3 className="h-4 w-4" />, label: "Tiêu đề 3" },
  { level: 4, icon: <Heading4 className="h-4 w-4" />, label: "Tiêu đề 4" },
  { level: 5, icon: <Heading5 className="h-4 w-4" />, label: "Tiêu đề 5" },
  { level: 6, icon: <Heading6 className="h-4 w-4" />, label: "Tiêu đề 6" },
];

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [tableRows, setTableRows] = useState(0);
  const [tableCols, setTableCols] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const width = window.prompt("Chiều rộng (px hoặc %):", "300px") || "300px";
      const height = window.prompt("Chiều cao (auto hoặc px):", "auto") || "auto";
      
      editor
        .chain()
        .focus()
        .setImage({ 
          src,
          style: `width: ${width}; height: ${height}; object-fit: contain;` 
        })
        .run();
    };
    reader.readAsDataURL(file);
    
    e.target.value = "";
  }, [editor]);

  const handleSetLink = useCallback(() => {
    const url = window.prompt("URL:", "https://");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const handleInsertTable = useCallback((rows: number, cols: number) => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
  }, [editor]);

  const textFormattingButtons = useMemo<ToolbarButton[]>(() => [
    {
      icon: <Bold className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      tooltip: "Đậm (Ctrl+B)",
    },
    {
      icon: <Italic className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      tooltip: "Nghiêng (Ctrl+I)",
    },
    {
      icon: <UnderlineIcon className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
      tooltip: "Gạch chân (Ctrl+U)",
    },
    {
      icon: <Strikethrough className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
      tooltip: "Gạch ngang",
    },
    {
      icon: <Highlighter className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      isActive: editor.isActive("highlight"),
      tooltip: "Đánh dấu",
    },
  ], [editor]);

  const listButtons = useMemo<ToolbarButton[]>(() => [
    {
      icon: <List className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      tooltip: "Danh sách không thứ tự",
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      tooltip: "Danh sách có thứ tự",
    },
  ], [editor]);

  const alignmentButtons = useMemo<ToolbarButton[]>(() => [
    {
      icon: <AlignLeft className="h-4 w-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: editor.isActive({ textAlign: "left" }),
      tooltip: "Căn trái",
    },
    {
      icon: <AlignCenter className="h-4 w-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: editor.isActive({ textAlign: "center" }),
      tooltip: "Căn giữa",
    },
    {
      icon: <AlignRight className="h-4 w-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: editor.isActive({ textAlign: "right" }),
      tooltip: "Căn phải",
    },
    {
      icon: <AlignJustify className="h-4 w-4" />,
      onClick: () => editor.chain().focus().setTextAlign("justify").run(),
      isActive: editor.isActive({ textAlign: "justify" }),
      tooltip: "Căn đều",
    },
  ], [editor]);

  const blockButtons = useMemo<ToolbarButton[]>(() => [
    {
      icon: <Code className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive("codeBlock"),
      tooltip: "Khối mã",
    },
    {
      icon: <Quote className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
      tooltip: "Trích dẫn",
    },
    {
      icon: <Minus className="h-4 w-4" />,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: false,
      tooltip: "Đường kẻ ngang",
    },
  ], [editor]);

  const historyButtons = useMemo<ToolbarButton[]>(() => [
    {
      icon: <Undo className="h-4 w-4" />,
      onClick: () => editor.chain().focus().undo().run(),
      isActive: false,
      tooltip: "Hoàn tác (Ctrl+Z)",
      disabled: !editor.can().undo(),
    },
    {
      icon: <Redo className="h-4 w-4" />,
      onClick: () => editor.chain().focus().redo().run(),
      isActive: false,
      tooltip: "Làm lại (Ctrl+Y)",
      disabled: !editor.can().redo(),
    },
  ], [editor]);

  return (
    <div className="flex flex-wrap items-center gap-1 border-b bg-background/50 p-2 sticky top-0 z-10">
      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        {textFormattingButtons.map((btn, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={btn.isActive}
                onPressedChange={btn.onClick}
                disabled={btn.disabled}
              >
                {btn.icon}
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>{btn.tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Headings */}
      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm" variant="ghost" className="px-2">
              <Heading1 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-2">
            <div className="grid grid-cols-2 gap-1">
              {HEADING_LEVELS.map(({ level, icon, label }) => (
                <Button
                  key={level}
                  size="sm"
                  variant={editor.isActive("heading", { level }) ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => editor.chain().focus().toggleHeading({ level } as any).run()}
                >
                  {icon}
                  <span className="ml-2">{label}</span>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        {listButtons.map((btn, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={btn.isActive}
                onPressedChange={btn.onClick}
              >
                {btn.icon}
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>{btn.tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Alignment */}
      <div className="flex items-center gap-1">
        {alignmentButtons.map((btn, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={btn.isActive}
                onPressedChange={btn.onClick}
              >
                {btn.icon}
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>{btn.tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Superscript/Subscript */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("subscript")}
              onPressedChange={() => editor.chain().focus().toggleSubscript().run()}
            >
              <SubscriptIcon className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Chỉ số dưới</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("superscript")}
              onPressedChange={() => editor.chain().focus().toggleSuperscript().run()}
            >
              <SuperscriptIcon className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Chỉ số trên</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Blocks */}
      <div className="flex items-center gap-1">
        {blockButtons.map((btn, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={btn.isActive}
                onPressedChange={btn.onClick}
              >
                {btn.icon}
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>{btn.tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Media & Links
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("link")}
              onPressedChange={handleSetLink}
            >
              <LinkIcon className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Chèn liên kết</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="ghost" onClick={handleAddImage}>
              <ImageIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Chèn hình ảnh</TooltipContent>
        </Tooltip>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageSelect}
        />
      </div> */}

      <Separator orientation="vertical" className="h-6" />

      {/* Emoji */}
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="ghost">
            <Smile className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="grid grid-cols-8 gap-1">
            {EMOJI_LIST.map((emoji, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted"
                onClick={() => {
                  editor.chain().focus().insertContent(emoji).run();
                }}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="h-6" />

      {/* Table */}
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="ghost">
            <TableIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-3">
          <div className="space-y-3">
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: 8 }).map((_, row) =>
                Array.from({ length: 8 }).map((_, col) => {
                  const isActive = row < tableRows && col < tableCols;
                  return (
                    <button
                      key={`${row}-${col}`}
                      className={`h-6 w-6 border ${
                        isActive ? "bg-primary" : "bg-background hover:bg-muted"
                      } transition-colors`}
                      onMouseEnter={() => {
                        setTableRows(row + 1);
                        setTableCols(col + 1);
                      }}
                      onClick={() => handleInsertTable(row + 1, col + 1)}
                    />
                  );
                })
              )}
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {tableRows} × {tableCols}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="h-6" />

      {/* History */}
      <div className="flex items-center gap-1">
        {historyButtons.map((btn, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={btn.isActive}
                onPressedChange={btn.onClick}
                disabled={btn.disabled}
              >
                {btn.icon}
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>{btn.tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}