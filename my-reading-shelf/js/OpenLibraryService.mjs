import { normalizeBook } from './BookModel.mjs';
export async function getJSON(url, signal) {
  const response = await fetch(url, {signal: signal || AbortSignal.timeout(15000)});
  if (!response.ok) throw new Error(`Catalog request failed (${response.status}). Please try again.`);
  return response.json();
}
export async function searchBooks(query, page = 1, signal) {
  const params = new URLSearchParams({q:query, page:String(page), limit:'12', fields:'key,title,author_name,first_publish_year,isbn,cover_i'});
  const data = await getJSON(`https://openlibrary.org/search.json?${params}`, signal);
  return { books: (data.docs || []).map(normalizeBook).filter(Boolean), total: data.numFound ?? data.num_found ?? 0 };
}
export async function workDescription(book) {
  const data = await getJSON(`https://openlibrary.org/works/${book.workId}.json`);
  return typeof data.description === 'string' ? data.description : data.description?.value || '';
}
