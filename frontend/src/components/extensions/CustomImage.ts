// extensions/CustomImage.ts
import Image from "@tiptap/extension-image";
declare module "@tiptap/extension-image" {
  interface SetImageOptions {
    style?: string;
  }
}
export const CustomImage = Image.extend({
  name: "customImage",

  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          if (attributes.style) {
            return { style: attributes.style };
          }
          return {};
        },
      },
      alt: {
        default: null,
        parseHTML: (element) => element.getAttribute("alt"),
        renderHTML: (attributes) => {
          if (attributes.alt) {
            return { alt: attributes.alt };
          }
          return {};
        },
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute("title"),
        renderHTML: (attributes) => {
          if (attributes.title) {
            return { title: attributes.title };
          }
          return {};
        },
      },
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute("width"),
        renderHTML: (attributes) => {
          if (attributes.width) {
            return { width: attributes.width };
          }
          return {};
        },
      },
      height: {
        default: null,
        parseHTML: (element) => element.getAttribute("height"),
        renderHTML: (attributes) => {
          if (attributes.height) {
            return { height: attributes.height };
          }
          return {};
        },
      },
    };
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
