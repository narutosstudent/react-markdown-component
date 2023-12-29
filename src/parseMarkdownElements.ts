import { v4 as uuidv4 } from "uuid";
import { GetTypesStartingWithPrefix, MarkdownElement, Tag } from "./types";

const BREAKPOINT = "\n\n";
const NEWLINE = "\n";

const BOLD_SIGN = "**";
const ITALIC_SIGN = "_";

const REGEX_HEADING = /^#+/; // ^ means start of string, #+ means one or more '#'

function createTextTag(text: string): Tag {
  return { type: "normal", content: text, id: uuidv4() };
}

function getHeadingLevel(text: string): number {
  const match = text.match(REGEX_HEADING);
  const fullMatch = match && match[0];
  return fullMatch ? fullMatch.length : 0;
}

function parseHeading(
  text: string,
  startIndex: number
): { element: MarkdownElement; endIndex: number } {
  const headingLevel = getHeadingLevel(text.slice(startIndex));

  const isNotEndingWithNewline = text.indexOf(NEWLINE, startIndex) === -1;
  const headingEndIndex = isNotEndingWithNewline
    ? text.length
    : text.indexOf(NEWLINE, startIndex);

  const additionToSkipSpaceAfterHash = 1;

  const content = text
    .slice(
      startIndex + headingLevel + additionToSkipSpaceAfterHash,
      headingEndIndex
    )
    .trim(); // only trims beginning and end

  return {
    element: {
      type: `h${headingLevel}` as GetTypesStartingWithPrefix<
        MarkdownElement,
        "h"
      >,
      tags: [createTextTag(content)],
      id: uuidv4(),
    },
    endIndex: headingEndIndex,
  };
}

function parseBoldText(
  text: string
): { tag: Tag; boldStartIndex: number; afterEndBoldIndex: number } | null {
  const boldStartIndex = text.indexOf(BOLD_SIGN);
  if (boldStartIndex === -1) return null;

  const boldEndIndex = text.indexOf(BOLD_SIGN, boldStartIndex + 2);
  if (boldEndIndex === -1) return null;

  const content = text.slice(boldStartIndex + 2, boldEndIndex).trim();

  return {
    tag: {
      type: "bold",
      content,
      id: uuidv4(),
    },
    boldStartIndex,
    afterEndBoldIndex: boldEndIndex + 2, // +2 to account for the '**'
  };
}

function parseItalicText(
  text: string
): { tag: Tag; italicStartIndex: number; afterEndItalicIndex: number } | null {
  const italicStartIndex = text.indexOf(ITALIC_SIGN);
  if (italicStartIndex === -1) return null;

  const italicEndIndex = text.indexOf(ITALIC_SIGN, italicStartIndex + 1);
  if (italicEndIndex === -1) return null;

  const content = text.slice(italicStartIndex + 1, italicEndIndex).trim();

  return {
    tag: {
      type: "italic",
      content,
      id: uuidv4(),
    },
    italicStartIndex,
    afterEndItalicIndex: italicEndIndex + 1, // +1 to account for the '_'
  };
}

function parseParagraph(
  text: string,
  startIndex: number,
  endIndex: number
): MarkdownElement {
  let index = startIndex;
  const tags: Tag[] = [];

  while (index < endIndex) {
    const remainingText = text.slice(index, endIndex);
    const italicResult = parseItalicText(remainingText);
    const boldResult = parseBoldText(remainingText);

    if (boldResult || italicResult) {
      if (italicResult && boldResult) {
        // 1. Check if italic is before bold
        // else we know bold is before italic
        // we can do so with the start index, whichever is smaller is first
        // after we know which is first, we can add the text before the first tag
        // we have to parse the text after the first tag again, because the index will be different
        // after that we need to check start index again, and add the normal text before the second tag

        const isItalicBeforeBold =
          italicResult.italicStartIndex < boldResult.boldStartIndex;
        if (isItalicBeforeBold) {
          if (italicResult.italicStartIndex > 0) {
            // `italicResult.startIndex > 0` means italic text is not at the beginning of the paragraph, so from the beginning of the paragraph to the start of the italic text is normal text
            const textBeforeItalic = remainingText.slice(
              0,
              italicResult.italicStartIndex
            );
            tags.push(createTextTag(textBeforeItalic));
          }

          tags.push(italicResult.tag);
          index += italicResult.afterEndItalicIndex; // Move index past the italic text

          const remainingTextAfterItalic = remainingText.slice(
            italicResult.afterEndItalicIndex
          );
          const boldResultAfterItalic = parseBoldText(remainingTextAfterItalic);

          if (boldResultAfterItalic) {
            if (boldResultAfterItalic.boldStartIndex > 0) {
              // `boldResult.startIndex > 0` means bold text is not at the beginning of the paragraph, so from the beginning of the paragraph to the start of the bold text is normal text
              const textBeforeBold = remainingTextAfterItalic.slice(
                0,
                boldResultAfterItalic.boldStartIndex
              );
              tags.push(createTextTag(textBeforeBold));
            }

            tags.push(boldResultAfterItalic.tag);

            index += boldResultAfterItalic.afterEndBoldIndex; // Move index past the bold text, we need to do += because we are in the remainingTextAfterItalic
          }
        } else {
          if (boldResult.boldStartIndex > 0) {
            // `boldResult.startIndex > 0` means bold text is not at the beginning of the paragraph, so from the beginning of the paragraph to the start of the bold text is normal text
            const textBeforeBold = remainingText.slice(
              0,
              boldResult.boldStartIndex
            );
            tags.push(createTextTag(textBeforeBold));
          }

          tags.push(boldResult.tag);
          index += boldResult.afterEndBoldIndex; // Move index past the bold text

          const remainingTextAfterBold = remainingText.slice(
            boldResult.afterEndBoldIndex
          );
          const italicResultAfterBold = parseItalicText(remainingTextAfterBold);

          if (italicResultAfterBold) {
            if (italicResultAfterBold.italicStartIndex > 0) {
              // `italicResult.startIndex > 0` means italic text is not at the beginning of the paragraph, so from the beginning of the paragraph to the start of the italic text is normal text
              const textBeforeItalic = remainingTextAfterBold.slice(
                0,
                italicResultAfterBold.italicStartIndex
              );
              tags.push(createTextTag(textBeforeItalic));
            }

            tags.push(italicResultAfterBold.tag);

            index += italicResultAfterBold.afterEndItalicIndex; // Move index past the italic text, we need to do += because we are in the remainingTextAfterBold
          }
        }
      }

      if (italicResult && !boldResult) {
        if (italicResult.italicStartIndex > 0) {
          // `italicResult.startIndex > 0` means italic text is not at the beginning of the paragraph, so from the beginning of the paragraph to the start of the italic text is normal text
          const textBeforeItalic = remainingText.slice(
            0,
            italicResult.italicStartIndex
          );
          tags.push(createTextTag(textBeforeItalic));
        }

        tags.push(italicResult.tag);
        index += italicResult.afterEndItalicIndex; // Move index past the italic text
      }

      if (!italicResult && boldResult) {
        if (boldResult.boldStartIndex > 0) {
          // `boldResult.startIndex > 0` means bold text is not at the beginning of the paragraph, so from the beginning of the paragraph to the start of the bold text is normal text
          const textBeforeBold = remainingText.slice(
            0,
            boldResult.boldStartIndex
          );
          tags.push(createTextTag(textBeforeBold));
        }

        // Add the bold text
        tags.push(boldResult.tag);
        index += boldResult.afterEndBoldIndex; // Move index past the bold text
      }
    }

    if (!boldResult && !italicResult) {
      tags.push(createTextTag(remainingText));
      break;
    }
  }

  return {
    type: "p",
    tags,
    id: uuidv4(),
  };
}

export function parseMarkdownElements(text: string): MarkdownElement[] {
  const elements: MarkdownElement[] = [];
  let index = 0;

  while (index < text.length) {
    const isHeading =
      text[index] === "#" &&
      text[index + getHeadingLevel(text.slice(index))] === " "; // make sure it is an actual heading

    const isBreakpoint = text.startsWith(BREAKPOINT, index);

    if (isHeading) {
      const parsedHeading = parseHeading(text, index);
      if (parsedHeading) {
        elements.push(parsedHeading.element);
        index = parsedHeading.endIndex;
      }

      // If not a valid heading, let the paragraph logic handle it
    } else if (isBreakpoint) {
      elements.push({ type: "breakpoint", id: uuidv4() });
      index += BREAKPOINT.length;
    } else {
      const endOfCurrentLineIndex =
        text.indexOf(NEWLINE, index) === -1
          ? text.length
          : text.indexOf(NEWLINE, index);

      const element = parseParagraph(text, index, endOfCurrentLineIndex);

      elements.push(element);
      index = endOfCurrentLineIndex;
    }

    const isIndexLessThanTextLength = index < text.length;
    const isAtNewline = text[index] === NEWLINE;
    const isNotAtBreakpoint = !text.startsWith(BREAKPOINT, index);
    if (isIndexLessThanTextLength && isAtNewline && isNotAtBreakpoint) {
      index++; // skip newline
    }
  }

  return elements;
}
