/**
 * List of HTML tags that we want to ignore when finding the top level readable elements
 * These elements should not be chosen while rendering the hover player
 */
const IGNORE_LIST = [
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "BUTTON",
  "LABEL",
  "SPAN",
  "IMG",
  "PRE",
  "SCRIPT",
];

const hasNonEmptyTextNode = (element: HTMLElement): boolean => {
  for (const child of element?.childNodes) {
    if (child.nodeType === Node.TEXT_NODE && child?.nodeValue?.trim() !== "") {
      return true;
    }
  }

  return false;
};

const isIgnoredElement = (element: HTMLElement): boolean => {
  // TODO: (YildirimE) There is a problem with span: John Doe
  return IGNORE_LIST.includes(element?.tagName);
};

const isOnlyChild = (element: HTMLElement): boolean => {
  const parent = element?.parentElement;
  return parent?.children?.length === 1;
};

/**
 *  **TBD:**
 *  Implement a function that returns all the top level readable elements on the page, keeping in mind the ignore list.
 *  Start Parsing inside the body element of the HTMLPage.
 *  A top level readable element is defined as follows:
 *      1. The text node contained in the element should not be empty
 *      2. The element should not be in the ignore list
 *      3. The element should not be a child of another element that has only one child.
 *            For example: <div><blockquote>Some text here</blockquote></div>. div is the top level readable element and not blockquote
 *      4. A top level readable element should not contain another top level readable element.
 *            For example: Consider the following HTML document:
 *            <body>
 *              <div id="root"></div>
 *              <div id="content-1">
 *                <article>
 *                  <header>
 *                    <h1 id="title">An Interesting HTML Document</h1>
 *                    <span>
 *                      <address id="test">John Doe</address>
 *                    </span>
 *                  </header>
 *                  <section></section>
 *                </article>
 *              </div>
 *            </body>;
 *            In this case, #content-1 should not be considered as a top level readable element.
 */
export function getTopLevelReadableElementsOnPage(): HTMLElement[] {
  const allElements: HTMLCollectionOf<Element> =
    document.body.getElementsByTagName("*");
  let topLevelElements: HTMLElement[] = [];

  for (const element of Array.from(allElements)) {
    if (
      element instanceof HTMLElement &&
      hasNonEmptyTextNode(element) &&
      !isIgnoredElement(element)
    ) {
      if (isOnlyChild(element) && element?.parentElement) {
        topLevelElements.push(element.parentElement);
      } else {
        topLevelElements.push(element);
      }
    }
  }

  return topLevelElements;
}