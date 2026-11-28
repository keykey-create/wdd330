export function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
export function cover(book) {
  const wrapper = element('div', undefined, 'cover');
  wrapper.textContent = 'No cover available';
  if (typeof book.cover === 'string' && book.cover.startsWith('https://covers.openlibrary.org/')) {
    const image = element('img'); image.src = book.cover; image.alt = ''; image.loading = 'lazy';
    image.addEventListener('error', () => wrapper.replaceChildren(document.createTextNode('No cover available')));
    wrapper.replaceChildren(image);
  }
  return wrapper;
}
export function safeLink(url, label) {
  try { const parsed = new URL(url); if (parsed.protocol !== 'https:') return null;
    const link = element('a', label); link.href = parsed.href; link.target = '_blank'; link.rel = 'noopener noreferrer'; return link;
  } catch { return null; }
}
