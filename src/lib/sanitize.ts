import DOMPurify from "isomorphic-dompurify";

const HTML_PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "br", "hr",
    "ul", "ol", "li",
    "a", "strong", "b", "em", "i", "u", "s", "del",
    "blockquote", "pre", "code",
    "img", "figure", "figcaption",
    "table", "thead", "tbody", "tr", "th", "td",
    "div", "span", "section",
    "caption",
  ] as string[],
  ALLOWED_ATTR: [
    "href", "target", "rel",
    "src", "alt", "width", "height", "loading",
    "class", "id",
  ] as string[],
  ALLOW_DATA_ATTR: false,
};

export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, HTML_PURIFY_CONFIG);
}

export function sanitizeJSONLD(str: string): string {
  return str
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export function escapeScriptBody(script: string): string {
  return script.replace(/<\/script>/gi, "<\\/script>");
}