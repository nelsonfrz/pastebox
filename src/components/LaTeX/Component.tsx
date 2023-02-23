import { NodeViewWrapper } from "@tiptap/react";
import katex from "katex";
import React from "react";

export const Component: React.FC<{
  node: { attrs: { content: string; mode: string } };
}> = (props) => {
  return (
    <NodeViewWrapper className="latex">
      <div
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(props.node.attrs.content, {
            throwOnError: false,
            errorColor: "red",
            displayMode: true,
          }),
        }}
      />
    </NodeViewWrapper>
  );
};
