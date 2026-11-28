export const statuses = ['Planned', 'Reading', 'Finished'];
export function normalizeBook(doc) {
  const workId = String(doc.key || '').replace(/^\/works\//, '');
  if (!/^OL\d+W$/.test(workId)) return null;
  return { id: workId, workId, title: doc.title || 'Untitled', authors: Array.isArray(doc.author_name) ? doc.author_name : [], year: doc.first_publish_year || '', isbn: (doc.isbn || []).find(value => /^(\d{13}|\d{9}[\dX])$/.test(value)) || '', cover: Number.isInteger(doc.cover_i) ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg?default=false` : '' };
}
export function sameBook(a, b) { return a.id === b.id || Boolean(a.isbn && b.isbn && a.isbn === b.isbn); }
export function selectShelf(books, status = 'all', sort = 'newest') {
  return books.filter(book => status === 'all' || book.status === status).sort((a,b) => sort === 'title' ? a.title.localeCompare(b.title) : b.createdAt.localeCompare(a.createdAt));
}
