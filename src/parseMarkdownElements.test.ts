import { parseMarkdownElements } from "./parseMarkdownElements";
import { it, expect, describe } from "vitest";
import { MarkdownElement } from "./types";

describe("headings", () => {
  it("should parse a single heading", () => {
    const markdown = "# Hello World";
    const elements = parseMarkdownElements(markdown);
    expect(elements).toEqual([
      {
        type: "h1",
        tags: [
          {
            type: "normal",
            content: "Hello World",
            id: expect.any(String),
          },
        ],
        id: expect.any(String),
      },
    ] satisfies MarkdownElement[]);
  });

  it("should parse heading one with breakpoint", () => {
    const markdown = "# Hello World\n\n";
    const elements = parseMarkdownElements(markdown);
    expect(elements).toEqual([
      {
        type: "h1",
        tags: [
          {
            type: "normal",
            content: "Hello World",
            id: expect.any(String),
          },
        ],
        id: expect.any(String),
      },
      {
        type: "breakpoint",
        id: expect.any(String),
      },
    ] satisfies MarkdownElement[]);
  });

  it("should parse different headings with many breakpoints", () => {
    const markdown = "# Hello World\n\n## Hello World\n\n### Hello World\n\n";
    const elements = parseMarkdownElements(markdown);
    expect(elements).toEqual([
      {
        type: "h1",
        tags: [
          {
            type: "normal",
            content: "Hello World",
            id: expect.any(String),
          },
        ],
        id: expect.any(String),
      },
      {
        type: "breakpoint",
        id: expect.any(String),
      },
      {
        type: "h2",
        tags: [
          {
            type: "normal",
            content: "Hello World",
            id: expect.any(String),
          },
        ],
        id: expect.any(String),
      },
      {
        type: "breakpoint",
        id: expect.any(String),
      },
      {
        type: "h3",
        tags: [
          {
            type: "normal",
            content: "Hello World",
            id: expect.any(String),
          },
        ],
        id: expect.any(String),
      },
      {
        type: "breakpoint",
        id: expect.any(String),
      },
    ] satisfies MarkdownElement[]);
  });

  it("should return # with no space as a paragraph", () => {
    const markdown = "#Hello World";
    const elements = parseMarkdownElements(markdown);
    expect(elements).toEqual([
      {
        type: "p",
        tags: [
          {
            type: "normal",
            content: "#Hello World",
            id: expect.any(String),
          },
        ],
        id: expect.any(String),
      },
    ] satisfies MarkdownElement[]);
  });
});

describe("paragraphs", () => {
  it("should parse a single paragraph", () => {
    const markdown = "Hello World";
    const elements = parseMarkdownElements(markdown);
    expect(elements).toEqual([
      {
        type: "p",
        tags: [
          {
            type: "normal",
            content: "Hello World",
            id: expect.any(String),
          },
        ],
        id: expect.any(String),
      },
    ] satisfies MarkdownElement[]);
  });

  it("should parse a single paragraph with a breakpoint", () => {
    const markdown = "Hello World\n\n";
    const elements = parseMarkdownElements(markdown);
    expect(elements).toEqual([
      {
        type: "p",
        tags: [
          {
            type: "normal",
            content: "Hello World",
            id: expect.any(String),
          },
        ],
        id: expect.any(String),
      },
      {
        type: "breakpoint",
        id: expect.any(String),
      },
    ] satisfies MarkdownElement[]);
  });

  it("should parse multiple paragraphs with many breakpoints", () => {
    const markdown = "Hello World\n\nHello World\n\nHello World\n\n";
    const elements = parseMarkdownElements(markdown);
    expect(elements).toEqual([
      {
        type: "p",
        tags: [
          {
            type: "normal",
            content: "Hello World",
            id: expect.any(String),
          },
        ],
        id: expect.any(String),
      },
      {
        type: "breakpoint",
        id: expect.any(String),
      },
      {
        type: "p",
        tags: [
          {
            type: "normal",
            content: "Hello World",
            id: expect.any(String),
          },
        ],
        id: expect.any(String),
      },
      {
        type: "breakpoint",
        id: expect.any(String),
      },
      {
        type: "p",
        tags: [
          {
            type: "normal",
            content: "Hello World",
            id: expect.any(String),
          },
        ],
        id: expect.any(String),
      },
      {
        type: "breakpoint",
        id: expect.any(String),
      },
    ] satisfies MarkdownElement[]);
  });

  it("should parse multiple paragraphs with many breakpoints and headings", () => {
    const markdown =
      "# Hello World\n\nHello World\n\n## Hello World\n\nHello World\n\n### Hello World\n\nHello World\n\n";
    const elements = parseMarkdownElements(markdown);
    expect(elements).toEqual([
      {
        type: "h1",
        tags: [
          {
            type: "normal",
            content: "Hello World",
            id: expect.any(String),
          },
        ],
        id: expect.any(String),
      },
      {
        type: "breakpoint",
        id: expect.any(String),
      },
      {
        type: "p",
        tags: [
          {
            type: "normal",
            content: "Hello World",
            id: expect.any(String),
          },
        ],
        id: expect.any(String),
      },
      {
        type: "breakpoint",
        id: expect.any(String),
      },
      {
        type: "h2",
        tags: [
          {
            type: "normal",
            content: "Hello World",
            id: expect.any(String),
          },
        ],
        id: expect.any(String),
      },
      {
        type: "breakpoint",
        id: expect.any(String),
      },
      {
        type: "p",
        tags: [
          {
            type: "normal",
            content: "Hello World",
            id: expect.any(String),
          },
        ],
        id: expect.any(String),
      },
      {
        type: "breakpoint",
        id: expect.any(String),
      },
      {
        type: "h3",
        tags: [
          {
            type: "normal",
            content: "Hello World",
            id: expect.any(String),
          },
        ],
        id: expect.any(String),
      },
      {
        type: "breakpoint",
        id: expect.any(String),
      },
      {
        type: "p",
        tags: [
          {
            type: "normal",
            content: "Hello World",
            id: expect.any(String),
          },
        ],
        id: expect.any(String),
      },
      {
        type: "breakpoint",
        id: expect.any(String),
      },
    ] satisfies MarkdownElement[]);
  });
});

describe("bold", () => {
  it.only("should parse a single bold", () => {
    const markdown = "**Hello World**";
    const elements = parseMarkdownElements(markdown);
    expect(elements).toEqual([
      {
        type: "p",
        tags: [
          {
            type: "bold",
            content: "Hello World",
            id: expect.any(String),
          },
        ],
        id: expect.any(String),
      },
    ] satisfies MarkdownElement[]);
  });

  it("should parse a single bold with a breakpoint", () => {
    const markdown = "**Hello World**\n\n";
    const elements = parseMarkdownElements(markdown);
    expect(elements).toEqual([
      {
        type: "p",
        tags: [
          {
            type: "bold",
            content: "Hello World",
            id: expect.any(String),
          },
        ],
        id: expect.any(String),
      },
      {
        type: "breakpoint",
        id: expect.any(String),
      },
    ] satisfies MarkdownElement[]);
  });
});
