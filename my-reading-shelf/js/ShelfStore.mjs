import { sameBook, statuses } from './BookModel.mjs';
export const STORAGE_KEY = 'my-reading-shelf:v1';
export class ShelfStore {
  constructor(storage) { this.storage = storage; }
  read() {
    const raw = this.storage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    let data;
    try { data = JSON.parse(raw); } catch { throw new Error('Saved shelf data could not be read. Existing data has been kept.'); }
    if (!Array.isArray(data) || !data.every(b => b && typeof b.id === 'string' && typeof b.title === 'string' && Array.isArray(b.authors) && statuses.includes(b.status) && typeof b.createdAt === 'string')) throw new Error('Saved shelf format is unsupported. Existing data has been kept.');
    return data;
  }
  write(books) { this.storage.setItem(STORAGE_KEY, JSON.stringify(books)); }
  add(book) {
    const books = this.read();
    if (books.some(saved => sameBook(saved, book))) return false;
    const now = new Date().toISOString();
    this.write([...books, {...book, status: 'Planned', note: '', rating: null, createdAt: now, updatedAt: now}]);
    return true;
  }
  update(id, changes) {
    if (changes.status !== undefined && !statuses.includes(changes.status)) throw new Error('Choose a valid reading status.');
    if (changes.rating !== undefined && changes.rating !== null && (!Number.isInteger(changes.rating) || changes.rating < 1 || changes.rating > 5)) throw new Error('Choose a whole-number rating from 1 to 5.');
    if (changes.note !== undefined && (typeof changes.note !== 'string' || changes.note.length > 2000)) throw new Error('Notes must be 2000 characters or fewer.');
    const allowed = Object.fromEntries(Object.entries(changes).filter(([key]) => ['status','note','rating'].includes(key)));
    this.write(this.read().map(book => book.id === id ? {...book, ...allowed, updatedAt: new Date().toISOString()} : book));
  }
  remove(id) { this.write(this.read().filter(book => book.id !== id)); }
}
