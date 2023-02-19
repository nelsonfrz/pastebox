import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { Component } from "./Component";

export default Node.create({
  name: "latexComponent",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      content: {
        default: "",
        isRequired: true,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "latex",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["latex", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component);
  },
});
