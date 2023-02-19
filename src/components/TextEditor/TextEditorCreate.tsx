import { useContext } from "react";

import { TextEditorContext } from "../Header/HeaderCreate";
import { TextEditor } from "./TextEditor";

export const TextEditorCreate: React.FC = () => {
  const { content, changeContent } = useContext(TextEditorContext);

  return <TextEditor content={content} changeContent={changeContent} />;
};
