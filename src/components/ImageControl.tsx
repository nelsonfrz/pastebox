import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import { IconCamera } from "@tabler/icons";
import { useState } from "react";
import * as Mantine from "@mantine/core";

export const ImageControl: React.FC = () => {
  const { editor } = useRichTextEditorContext();

  const [image, setImage] = useState<string>("");
  const [modalOpened, setModalOpened] = useState<boolean>(false);

  if (!editor) {
    return null;
  }

  return (
    <>
      <Mantine.Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Insert Image"
      >
        <Mantine.Stack>
          <Mantine.TextInput
            label="Image URL"
            placeholder="Enter Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <Mantine.Button
            onClick={() => {
              editor.chain().focus().setImage({ src: image }).run();
              setModalOpened(false);
            }}
          >
            Insert
          </Mantine.Button>
        </Mantine.Stack>
      </Mantine.Modal>

      <RichTextEditor.Control
        onClick={() => {
          setImage("");
          setModalOpened(true);
        }}
        aria-label="Insert image"
        title="Insert image"
      >
        <IconCamera stroke={1.5} size={16} />
      </RichTextEditor.Control>
    </>
  );
};
