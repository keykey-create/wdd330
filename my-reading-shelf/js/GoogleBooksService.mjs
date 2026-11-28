import { getJSON } from './OpenLibraryService.mjs';
import { GOOGLE_BOOKS_API_KEY } from './config.js';
export async function googleDetails(book) {
  if (!GOOGLE_BOOKS_API_KEY || !book.isbn) return null;
  const params = new URLSearchParams({q:`isbn:${book.isbn}`, key:GOOGLE_BOOKS_API_KEY, maxResults:'5'});
  const data = await getJSON(`https://www.googleapis.com/books/v1/volumes?${params}`);
  const match = data.items?.find(item => item.volumeInfo?.industryIdentifiers?.some(identifier => identifier.identifier.replace(/-/g,'') === book.isbn));
  if (!match) return null;
  const info = match.volumeInfo;
  return {googleVolumeId:match.id, description:info.description || '', categories:info.categories || [], preview:info.previewLink || '', publisher:info.publisher || ''};
}
