import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ShelfStore, STORAGE_KEY} from '../js/ShelfStore.mjs';
import {normalizeBook, selectShelf} from '../js/BookModel.mjs';
const book = normalizeBook({key:'/works/OL1W',title:'The Hobbit',author_name:['J. R. R. Tolkien'],isbn:['9780000000001']});
function setup() { const values = new Map(); const storage = { getItem:key => values.get(key) ?? null, setItem:(key,value) => values.set(key,value) }; return {storage, store:new ShelfStore(storage)}; }
test('shelf persists status, notes and ratings across store instances and rejects duplicate ISBNs',() => {
  const {storage,store} = setup(); assert.equal(store.add(book),true); assert.equal(store.add({...book,id:'OL2W'}),false);
  store.update(book.id,{status:'Reading',note:'A <script> note',rating:4});
  const loaded = new ShelfStore(storage).read(); assert.equal(loaded.length,1); assert.equal(loaded[0].status,'Reading'); assert.equal(loaded[0].rating,4); assert.equal(loaded[0].note,'A <script> note');
});
test('invalid updates do not alter saved records and removal preserves unrelated books',() => {
  const {store} = setup(); store.add(book); store.add({...book,id:'OL2W',isbn:'',title:'Another book'});
  for(const changes of [{rating:0},{rating:6},{rating:2.5},{status:'Done'},{note:'x'.repeat(2001)}]) assert.throws(() => store.update(book.id,changes));
  assert.equal(store.read()[0].rating,null); store.remove(book.id); assert.equal(store.read()[0].id,'OL2W');
});
test('corrupt storage is preserved and write failures propagate',() => {
  const {storage,store} = setup(); storage.setItem(STORAGE_KEY,'bad json'); assert.throws(() => store.add(book)); assert.equal(storage.getItem(STORAGE_KEY),'bad json');
  const broken = new ShelfStore({getItem:() => null,setItem:() => {throw new Error('Quota exceeded');}}); assert.throws(() => broken.add(book),/Quota/);
});
test('normalization handles missing fields and shelf filtering does not mutate the source',() => {
  assert.equal(normalizeBook({key:'/bad'}),null); assert.equal(normalizeBook({key:'OL2W'}).title,'Untitled');
  const books = [{title:'Zulu',status:'Planned',createdAt:'2026-11-28'},{title:'Alpha',status:'Finished',createdAt:'2026-11-27'}];
  assert.equal(selectShelf(books,'Finished').length,1); assert.equal(selectShelf(books,'all','title')[0].title,'Alpha'); assert.equal(books[0].title,'Zulu');
});
