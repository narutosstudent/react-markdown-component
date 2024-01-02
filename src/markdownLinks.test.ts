import { decodeMarkdownLink } from "./markdownLinks";
import { it, expect, describe } from "vitest";


describe("Simple Markdown Links", () => {
  it("should have same display text and link", () => {
    const expectedLink = "https://github.com";
    const markdown = "<" + expectedLink + ">";

    const result = decodeMarkdownLink(markdown);
    expect(result).toEqual({
      displayText: expectedLink,
      url: expectedLink,
    });
  });
});

describe("Two Part Links", () => {
  it("should have different display text and link", () => {
    const expectedUrl = "https://github.com";
    const expectedDisplayText = "Go To GitHub..."
    const markdown = "[" + expectedDisplayText + "](" + expectedUrl + ")";

    const result = decodeMarkdownLink(markdown);
    expect(result).toEqual({
      displayText: expectedDisplayText,
      url: expectedUrl
    });
  });

  it("should return null when closing bracket is missing", () => {
    const inputUrl = "https://github.com";
    const inputDisplayText = "Go To GitHub..."
    const markdown = "[" + inputDisplayText + "](" + inputUrl;

    const result = decodeMarkdownLink(markdown);
    expect(result).toBeNull();
  });

  it("should return null when middle brackets are incorrect", () => {
    const inputUrl = "https://github.com";
    const inputDisplayText = "Go To GitHub..."
    const markdown = "[" + inputDisplayText + "]" + inputUrl + ")";

    const result = decodeMarkdownLink(markdown);
    expect(result).toBeNull();
  });

  it("should return null when middle brackets are incorrect", () => {
    const inputUrl = "https://github.com";
    const inputDisplayText = "Go To GitHub..."
    const markdown = "[" + inputDisplayText + ")[" + inputUrl + ")";

    const result = decodeMarkdownLink(markdown);
    expect(result).toBeNull();
  });

  it("should return null when brackets are swapped", () => {
    const inputUrl = "https://github.com";
    const inputDisplayText = "Go To GitHub..."
    const markdown = "(" + inputDisplayText + ")[" + inputUrl + "]";

    const result = decodeMarkdownLink(markdown);
    expect(result).toBeNull();
  });

});