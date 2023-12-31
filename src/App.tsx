import { ReactElement, ReactNode, useState } from "react";
import "./App.css";
import { parseMarkdownElements } from "./parseMarkdownElements";
import { MarkdownElement, Tag } from "./types";

type FunctionalComponentWithChildren = (props: {
  children?: ReactNode;
}) => ReactElement;
type FunctionalComponentWithoutChildren = () => ReactElement;
type MarkdownComponentType =
  | FunctionalComponentWithChildren
  | FunctionalComponentWithoutChildren;

const MarkdownComponents: Record<
  MarkdownElement["type"],
  MarkdownComponentType
> = {
  h1: ({ children }) => <h1>{children}</h1>,
  h2: ({ children }) => <h2>{children}</h2>,
  h3: ({ children }) => <h3>{children}</h3>,
  h4: ({ children }) => <h4>{children}</h4>,
  h5: ({ children }) => <h5>{children}</h5>,
  h6: ({ children }) => <h6>{children}</h6>,
  p: ({ children }) => <p>{children}</p>,
  breakpoint: () => <br />,
};

function mapTagComponents(
  tag: Tag
): (props: { children: ReactNode } ) => ReactElement {
  switch(tag.type) {
    case "bold": return ({ children }) => <strong>{children}</strong>;
    case "italic": return ({ children }) => <em>{children}</em>;
    case "link": return ({ children }) => <a href={tag.attributes}>{children}</a>;
    case "normal": return ({ children }) => <>{children}</>
  }
}

const DefaultComponent: MarkdownComponentType = ({ children }) => (
  <div>{children}</div>
);

export function App() {
  const [textareaContent, setTextareaContent] = useState("");
  const [markdownElements, setMarkdownElements] = useState<MarkdownElement[]>(
    []
  );

  return (
    <main>
      <h1>Markdown Preview Playground</h1>
      <div className="wrapper">
        <div className="markdown">
          <label htmlFor="markdown">Enter markdown here</label>
          <textarea
            placeholder="# This is a title"
            id="markdown"
            value={textareaContent}
            onChange={(event) => {
              setTextareaContent(event.target.value);
              setMarkdownElements(parseMarkdownElements(event.target.value));
            }}
          />
        </div>

        <div className="preview">
          <h2 className="preview-title">Preview</h2>
          <div className="content">
            {markdownElements.map((markdownElement) => {
              const Component =
                MarkdownComponents[markdownElement.type] || DefaultComponent;

              if (markdownElement.type === "breakpoint") {
                return <Component key={markdownElement.id} />;
              } else {
                return (
                  <Component key={markdownElement.id}>
                    {markdownElement.tags.map((tag) => {
                      const TagComponent = mapTagComponents(tag);

                      return (
                        <TagComponent key={tag.id}>{tag.content}</TagComponent>
                      );
                    })}
                  </Component>
                );
              }
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
