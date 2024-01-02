/** Extract the display text and URL from Markdown Text.
 * @param linkText The Text containing only the Markdown Link.
 * @returns An object containing Link display text and URL, or null.
 */
export function decodeMarkdownLink(
  linkText: string
) : { displayText: string, url: string } | null {
  const firstChar = linkText.charAt(0);

  if (firstChar == "<") {
    const url = linkText.slice(1, linkText.length - 1);
    return {
      displayText: url,
      url
    };
  } else if (firstChar == "[") {
    const middleIndex = linkText.indexOf("](");
    if (middleIndex === -1) return null;

    const endIndex = linkText.indexOf(")", middleIndex + 2);
    if (endIndex === -1) return null;

    return {
      displayText: linkText.slice(1, middleIndex),
      url: linkText.slice(middleIndex + 2, linkText.length - 1)
    };
  } else if (firstChar == "!") {
    // todo: possibly implement Image Links
  }
  return null;
}
