"use client";

import { useCallback, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
import {
  Bold,
  CircleAlert,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  Strikethrough,
  TextCursorInput,
  Underline,
  Undo2,
} from "lucide-react";
import { cn } from "cn";
import { uploadAsset } from "@/lib/media/upload-client";

interface RichTextFieldProps {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
  describedBy?: string;
}

type Status =
  | { state: "idle" }
  | { state: "uploading"; percent: number; remaining: number }
  | { state: "notice"; message: string };

const DELIVERY_PREFIX = "https://res.cloudinary.com/";

/**
 * Pasted HTML can bring pictures hotlinked from wherever it was copied. They
 * are taken out before the editor sees them - the server would refuse them
 * anyway, and this way the editor is told at the moment they paste.
 */
function stripForeignImages(html: string): { html: string; removed: number } {
  const doc = new DOMParser().parseFromString(html, "text/html");
  let removed = 0;
  doc.querySelectorAll("img").forEach((img) => {
    if (!(img.getAttribute("src") ?? "").startsWith(DELIVERY_PREFIX)) {
      img.remove();
      removed += 1;
    }
  });
  return { html: doc.body.innerHTML, removed };
}

function imageFiles(list: FileList | null | undefined): File[] {
  return Array.from(list ?? []).filter((file) => file.type.startsWith("image/"));
}

/**
 * The article editor: formatted writing with photos from the editor's own
 * device.
 *
 * What it can produce is deliberately small - paragraphs, two heading levels,
 * bold, italic, underline, strike, links, lists, quotes, a divider and photos.
 * That is everything a news story needs, and it is exactly the vocabulary the
 * server-side allow-list keeps, so nothing an editor sees here disappears on
 * save. Photos go straight to Cloudinary through the same signed upload as
 * every other media field; the story only ever holds their URLs.
 *
 * The form posts the HTML from a hidden input. It is not trusted for that:
 * saveRecord rebuilds it through lib/cms/rich-text.ts before it is stored.
 */
export function RichTextField({
  id,
  name,
  label,
  defaultValue,
  describedBy,
}: RichTextFieldProps) {
  const [html, setHtml] = useState(defaultValue);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const fileRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor | null>(null);

  /** Uploads photos one after another and drops each in where it was asked. */
  const insertPhotos = useCallback(async (files: File[], at?: number) => {
    const editor = editorRef.current;
    if (!editor || files.length === 0) return;

    let position = at;
    for (const [index, file] of files.entries()) {
      setStatus({ state: "uploading", percent: 0, remaining: files.length - index });
      const result = await uploadAsset(file, "image", {
        onProgress: (percent) =>
          setStatus({ state: "uploading", percent, remaining: files.length - index }),
      });
      if (!result.ok) {
        setStatus({ state: "notice", message: result.message });
        return;
      }
      const image = { type: "image", attrs: { src: result.url, alt: "" } };
      if (position === undefined) {
        editor.chain().focus().insertContent(image).run();
      } else {
        editor.chain().focus().insertContentAt(position, image).run();
        position += 1;
      }
    }
    setStatus({
      state: "notice",
      message:
        files.length === 1
          ? "Photo added. Select it and press “Describe photo” to add a description for blind readers."
          : `${files.length} photos added. Select each one and press “Describe photo” to describe it.`,
    });
  }, []);

  const editor = useEditor({
    // The admin is server-rendered; ProseMirror needs the DOM, so the editor
    // mounts on the client only.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
          protocols: ["http", "https", "mailto"],
        },
      }),
      Image.configure({ allowBase64: false }),
      Placeholder.configure({
        placeholder: "Start writing the story…",
      }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        id,
        class: "rich-text min-h-80 px-4 py-4 sm:px-5 focus:outline-none",
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": label,
        ...(describedBy ? { "aria-describedby": describedBy } : {}),
      },
      transformPastedHTML: (pasted) => {
        const { html: kept, removed } = stripForeignImages(pasted);
        if (removed > 0) {
          setStatus({
            state: "notice",
            message: `${removed === 1 ? "A picture" : `${removed} pictures`} from another website ${removed === 1 ? "was" : "were"} left out. Save the picture to your device and add it with the photo button.`,
          });
        }
        return kept;
      },
      handlePaste: (_view, event) => {
        const files = imageFiles(event.clipboardData?.files);
        if (files.length === 0) return false;
        event.preventDefault();
        void insertPhotos(files);
        return true;
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false;
        const files = imageFiles(event.dataTransfer?.files);
        if (files.length === 0) return false;
        event.preventDefault();
        const at = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
        void insertPhotos(files, at);
        return true;
      },
    },
    onCreate: ({ editor: created }) => {
      editorRef.current = created;
    },
    onUpdate: ({ editor: updated }) => {
      setHtml(updated.isEmpty ? "" : updated.getHTML());
    },
  });

  const active = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      paragraph: current?.isActive("paragraph") ?? false,
      h2: current?.isActive("heading", { level: 2 }) ?? false,
      h3: current?.isActive("heading", { level: 3 }) ?? false,
      bold: current?.isActive("bold") ?? false,
      italic: current?.isActive("italic") ?? false,
      underline: current?.isActive("underline") ?? false,
      strike: current?.isActive("strike") ?? false,
      link: current?.isActive("link") ?? false,
      bullet: current?.isActive("bulletList") ?? false,
      ordered: current?.isActive("orderedList") ?? false,
      quote: current?.isActive("blockquote") ?? false,
      image: current?.isActive("image") ?? false,
      canUndo: current?.can().undo() ?? false,
      canRedo: current?.can().redo() ?? false,
    }),
  });

  const setLink = () => {
    if (!editor) return;
    const previous = (editor.getAttributes("link").href as string | undefined) ?? "";
    const entered = window.prompt("Link address (leave empty to remove the link)", previous);
    if (entered === null) return;
    const href = entered.trim();
    if (href === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    const normalised = /^(https?:|mailto:|\/)/i.test(href) ? href : `https://${href}`;
    if (!/^(https?:\/\/|mailto:|\/(?!\/))/i.test(normalised)) {
      setStatus({ state: "notice", message: "That link address is not allowed." });
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: normalised }).run();
  };

  const describePhoto = () => {
    if (!editor) return;
    const previous = (editor.getAttributes("image").alt as string | undefined) ?? "";
    const entered = window.prompt(
      "Describe this photo in a sentence, for readers who cannot see it",
      previous
    );
    if (entered === null) return;
    editor.chain().focus().updateAttributes("image", { alt: entered.trim() }).run();
  };

  const uploading = status.state === "uploading";
  const chain = () => editor?.chain().focus();

  return (
    <div>
      <input type="hidden" name={name} value={html} />

      <div className="overflow-hidden rounded-xl border border-hairline bg-background focus-within:border-primary/60">
        <div
          role="toolbar"
          aria-label={`${label} formatting`}
          className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-hairline bg-card/95 p-1.5 backdrop-blur"
        >
          <ToolButton label="Paragraph" pressed={active?.paragraph} onClick={() => chain()?.setParagraph().run()}>
            <Pilcrow />
          </ToolButton>
          <ToolButton label="Section heading" pressed={active?.h2} onClick={() => chain()?.toggleHeading({ level: 2 }).run()}>
            <Heading2 />
          </ToolButton>
          <ToolButton label="Small heading" pressed={active?.h3} onClick={() => chain()?.toggleHeading({ level: 3 }).run()}>
            <Heading3 />
          </ToolButton>
          <Divider />
          <ToolButton label="Bold" pressed={active?.bold} onClick={() => chain()?.toggleBold().run()}>
            <Bold />
          </ToolButton>
          <ToolButton label="Italic" pressed={active?.italic} onClick={() => chain()?.toggleItalic().run()}>
            <Italic />
          </ToolButton>
          <ToolButton label="Underline" pressed={active?.underline} onClick={() => chain()?.toggleUnderline().run()}>
            <Underline />
          </ToolButton>
          <ToolButton label="Strikethrough" pressed={active?.strike} onClick={() => chain()?.toggleStrike().run()}>
            <Strikethrough />
          </ToolButton>
          <ToolButton label="Link" pressed={active?.link} onClick={setLink}>
            <Link2 />
          </ToolButton>
          <Divider />
          <ToolButton label="Bulleted list" pressed={active?.bullet} onClick={() => chain()?.toggleBulletList().run()}>
            <List />
          </ToolButton>
          <ToolButton label="Numbered list" pressed={active?.ordered} onClick={() => chain()?.toggleOrderedList().run()}>
            <ListOrdered />
          </ToolButton>
          <ToolButton label="Quote" pressed={active?.quote} onClick={() => chain()?.toggleBlockquote().run()}>
            <Quote />
          </ToolButton>
          <ToolButton label="Divider line" onClick={() => chain()?.setHorizontalRule().run()}>
            <Minus />
          </ToolButton>
          <Divider />
          <ToolButton
            label="Add photos from this device"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
          </ToolButton>
          {active?.image && (
            <button
              type="button"
              onClick={describePhoto}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[0.76rem] font-bold text-foreground transition-colors hover:bg-muted"
            >
              <TextCursorInput className="size-3.5" />
              Describe photo
            </button>
          )}
          <span className="ml-auto flex items-center gap-0.5">
            <ToolButton label="Undo" disabled={!active?.canUndo} onClick={() => chain()?.undo().run()}>
              <Undo2 />
            </ToolButton>
            <ToolButton label="Redo" disabled={!active?.canRedo} onClick={() => chain()?.redo().run()}>
              <Redo2 />
            </ToolButton>
          </span>
        </div>

        <EditorContent editor={editor} />
      </div>

      {status.state === "uploading" && (
        <div className="mt-2" role="status">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-200"
              style={{ width: `${status.percent}%` }}
            />
          </div>
          <p className="mt-1.5 text-[0.76rem] text-muted-foreground">
            Uploading photo… {status.percent}%
            {status.remaining > 1 && ` (${status.remaining} left)`}
          </p>
        </div>
      )}

      {status.state === "notice" && (
        <p
          role="status"
          className="mt-2 flex items-start gap-1.5 text-[0.76rem] font-semibold text-muted-foreground"
        >
          <CircleAlert className="mt-px size-3.5 shrink-0" />
          {status.message}
        </p>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          const files = imageFiles(event.target.files);
          // Reset so choosing the same file twice after an error still fires.
          event.target.value = "";
          void insertPhotos(files);
        }}
      />
    </div>
  );
}

function ToolButton({
  label,
  pressed,
  disabled,
  onClick,
  children,
}: {
  label: string;
  pressed?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      // Keeps the selection in the editor while the toolbar is clicked.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors [&_svg]:size-4",
        "hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
        pressed && "bg-primary/12 text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span aria-hidden className="mx-1 h-5 w-px bg-hairline" />;
}
