import { useContext } from "react";

import { TextEditorContext } from "../Header/HeaderEdit";
import { TextEditor } from "./TextEditor";

export const TextEditorEdit: React.FC = () => {
  const { content, changeContent } = useContext(TextEditorContext);

  return <TextEditor content={content} changeContent={changeContent} />;
};
