import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import { IconSquareRoot2 } from "@tabler/icons";

export const LaTeXControl: React.FC = () => {
  const { editor } = useRichTextEditorContext();
  return (
    <RichTextEditor.Control
      onClick={() =>
        editor?.chain().setCodeBlock({ language: "latex" }).focus().run()
      }
      aria-label="LaTeX"
      title="LaTeX"
    >
      <IconSquareRoot2 stroke={1.5} size={16} />
    </RichTextEditor.Control>
  );
};
