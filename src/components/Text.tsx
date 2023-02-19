import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { lowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import java from "highlight.js/lib/languages/java";
import python from "highlight.js/lib/languages/python";
import latex from "highlight.js/lib/languages/latex";
import Image from "@tiptap/extension-image";
import LaTeX from "./LaTeX/Extension";
import { useEffect } from "react";

lowlight.registerLanguage("html", html);
lowlight.registerLanguage("css", css);
lowlight.registerLanguage("js", js);
lowlight.registerLanguage("ts", ts);
lowlight.registerLanguage("c", c);
lowlight.registerLanguage("cpp", cpp);
lowlight.registerLanguage("java", java);
lowlight.registerLanguage("python", python);
lowlight.registerLanguage("latex", latex);

interface TextEditorProps {
  content: string;
}

export const Text: React.FC<TextEditorProps> = ({ content }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      TextStyle,
      Color,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Image,
      LaTeX,
    ],
    editable: false,
  });

  useEffect(() => {
    editor?.commands.setContent(
      content.replace(
        /<pre><code class="language-latex">(.*?)<\/code><\/pre>/g,
        '<latex content="$1"></latex>'
      )
    );
  }, [content, editor?.commands]);

  return (
    <RichTextEditor
      editor={editor}
      styles={{
        content: {
          img: {
            borderRadius: "10px",
            maxWidth: "100%",
          },
        },
      }}
    >
      <RichTextEditor.Content />
    </RichTextEditor>
  );
};
