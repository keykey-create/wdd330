import {searchBooks, workDescription} from './OpenLibraryService.mjs';
import {googleDetails} from './GoogleBooksService.mjs';
import {ShelfStore} from './ShelfStore.mjs';
import {statuses, selectShelf} from './BookModel.mjs';
import {element, cover, safeLink} from './ui.mjs';
const $ = selector => document.querySelector(selector);
// Access storage lazily so blocked browser storage does not prevent discovery.
const store = new ShelfStore({getItem:key => localStorage.getItem(key), setItem:(key,value) => localStorage.setItem(key,value)});
let query = '', page = 1, searchController, detailVersion = 0, feedbackTimer;
function feedback(message) { $('#feedback').textContent = message; clearTimeout(feedbackTimer); feedbackTimer = setTimeout(() => $('#feedback').textContent = '', 8000); }
function failure(error) { feedback(`${error.message || 'The action failed.'} Changes were not saved. Check browser storage permissions and available space.`); }
function updateCount() { try { $('#count').textContent = store.read().length; } catch { $('#count').textContent = '—'; } }
function baseCard(book) {
  const card = element('article', undefined, 'card');
  card.append(cover(book), element('h3',book.title), element('p', book.authors.join(', ') || 'Author unavailable'), element('p', book.year ? `First published ${book.year}` : 'Publication year unavailable', 'meta'));
  return card;
}
async function runSearch() {
  searchController?.abort(); searchController = new AbortController();
  const controller = searchController;
  $('#search-message').className = ''; $('#search-message').textContent = 'Looking through the catalog…'; $('#results').replaceChildren(); $('#pagination').hidden = true;
  $('#results').setAttribute('aria-busy','true');
  try {
    const data = await searchBooks(query, page, AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]));
    if (controller !== searchController) return;
    $('#search-message').textContent = data.books.length ? '' : 'No books found. Try another title, author, or ISBN.';
    $('#result-summary').textContent = `${data.total.toLocaleString()} results for “${query}”`;
    for (const book of data.books) { const card = baseCard(book); const button = element('button','View details'); button.addEventListener('click',() => showDetails(book)); card.append(button); $('#results').append(card); }
    $('#pagination').hidden = data.total <= 12; $('#page').textContent = `Page ${page}`; $('#previous').disabled = page === 1; $('#next').disabled = page * 12 >= data.total;
  } catch (error) {
    if (controller !== searchController) return;
    $('#search-message').className = 'error'; $('#search-message').textContent = 'Search could not load. Check your connection and try again.';
    const retry = element('button','Retry search'); retry.addEventListener('click',runSearch); $('#search-message').append(document.createTextNode(' '),retry);
    $('#result-summary').textContent = '';
  } finally { if (controller === searchController) $('#results').removeAttribute('aria-busy'); }
}
$('#search').addEventListener('submit',event => {event.preventDefault(); const value = $('#query').value.trim(); if (!value) { $('#search-message').textContent = 'Enter a title, author, or ISBN.'; $('#query').focus(); return; } query = value; page = 1; runSearch(); });
$('#previous').addEventListener('click',() => {page--; runSearch();});
$('#next').addEventListener('click',() => {page++; runSearch();});
async function showDetails(book) {
  const version = ++detailVersion;
  const content = $('#detail-content'); content.replaceChildren(cover(book));
  const heading = element('h2',book.title); heading.id = 'detail-title';
  content.append(heading, element('p',book.authors.join(', ') || 'Author unavailable'));
  const description = element('p','Loading book details…'); const source = element('p','Catalog record: Open Library','meta');
  const actions = element('div',undefined,'detail-actions'); const save = element('button','Add to my shelf');
  save.addEventListener('click',() => { try { const added = store.add(book); feedback(added ? 'Book added to your shelf.' : 'This book is already on your shelf.'); updateCount(); } catch(error) { failure(error); } });
  actions.append(save); content.append(description,source,actions); $('#details').showModal();
  const [work, google] = await Promise.allSettled([workDescription(book), googleDetails(book)]);
  if (version !== detailVersion || !$('#details').open) return;
  const enrichment = google.status === 'fulfilled' ? google.value : null;
  description.textContent = enrichment?.description || (work.status === 'fulfilled' ? work.value : '') || 'No description is available. You can still save this book.';
  if (enrichment) {
    source.textContent = 'Catalog record: Open Library · Additional details: Google Books';
    const preview = safeLink(enrichment.preview,'Preview on Google Books ↗'); if(preview) actions.append(preview);
    if (enrichment.categories.length) content.insertBefore(element('p',enrichment.categories.join(' · '),'meta'),actions);
    book = {...book, googleVolumeId:enrichment.googleVolumeId};
  }
  if (google.status === 'rejected') source.append(document.createTextNode(' · Additional details are temporarily unavailable.'));
}
$('#close-details').addEventListener('click',() => $('#details').close());
$('#details').addEventListener('close',() => detailVersion++);
function labelled(text, control) {const label = element('label',text); label.append(control); return label;}
function renderShelf() {
  const container = $('#shelf-books'); container.replaceChildren();
  try {
    const all = store.read(); const books = selectShelf(all,$('#filter').value,$('#sort').value);
    $('#shelf-message').textContent = all.length ? (books.length ? `${books.length} book${books.length === 1 ? '' : 's'}` : 'No books have this status yet.') : 'Your shelf is waiting for its first book. ';
    if(!all.length) { const link = element('a','Discover a book'); link.href = '#discover'; $('#shelf-message').append(link); }
    for (const book of books) {
      const card = baseCard(book); card.append(element('span',book.status,'tag'));
      const status = element('select'); for (const value of statuses) {const option = element('option',value); option.value = value; option.selected = value === book.status; status.append(option);}
      status.addEventListener('change',() => { try {store.update(book.id,{status:status.value}); feedback('Reading status saved.'); renderShelf();} catch(error){status.value = book.status; failure(error);} });
      const form = element('form'); const note = element('textarea'); note.maxLength = 2000; note.value = book.note || ''; note.rows = 3;
      const rating = element('input'); rating.type = 'number'; rating.min = '1'; rating.max = '5'; rating.step = '1'; rating.value = book.rating ?? '';
      const save = element('button','Save notes'); save.type = 'submit';
      const remove = element('button','Remove','danger'); remove.type = 'button';
      remove.addEventListener('click',() => { if (!confirm(`Remove “${book.title}” and its notes from your shelf?`)) return; try {store.remove(book.id); renderShelf(); updateCount(); feedback('Book removed.'); $('#shelf-message').tabIndex = -1; $('#shelf-message').focus();} catch(error) {failure(error);} });
      form.addEventListener('submit',event => {event.preventDefault(); try {store.update(book.id,{note:note.value, rating:rating.value === '' ? null : Number(rating.value)}); feedback('Notes and rating saved.');} catch(error){failure(error);} });
      const actions = element('div',undefined,'actions'); actions.append(save,remove);
      form.append(labelled('Notes',note),labelled('Rating (1–5, optional)',rating),actions);
      card.append(labelled('Reading status',status),form); container.append(card);
    }
  } catch(error) { $('#shelf-message').textContent = `Your shelf could not be loaded. ${error.message}`; }
}
function route() {
  const shelf = location.hash === '#shelf'; $('#discover').hidden = shelf; $('#shelf').hidden = !shelf;
  for(const [id,active] of [['#discover-link',!shelf],['#shelf-link',shelf]]) {if(active) $(id).setAttribute('aria-current','page'); else $(id).removeAttribute('aria-current');}
  if(shelf) renderShelf(); updateCount();
}
$('#filter').addEventListener('change',renderShelf); $('#sort').addEventListener('change',renderShelf);
window.addEventListener('hashchange',route); window.addEventListener('storage',() => {updateCount(); if(location.hash === '#shelf') renderShelf();}); route();
