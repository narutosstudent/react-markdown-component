export type GetTypesStartingWithPrefix<
  Type,
  Prefix extends string
> = Type extends `${Prefix}${infer _}` ? Type : never;

export type Tag = {
  type: "normal" | "bold" | "italic" | "link";
  content: string;
  attributes?: string;
  id: string;
};

export type MarkdownElement =
  | {
      type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
      tags: Array<Tag>;
      id: string;
    }
  | {
      type: "breakpoint";
      id: string;
    };
