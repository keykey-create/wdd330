# My Reading Shelf

WDD 330 personal project for Samson Odunaiya. Initial local implementation, 28 November 2026, built with coding assistance from the submitted proposal. Vanilla HTML, CSS, and JavaScript modules; no installation or framework required. Separate from the Sleep Outside team project.

## Run

Requires Node 22 or newer. From this folder run `npm start`, then open http://127.0.0.1:5174. Do not open index.html directly because browser modules need HTTP. Run `npm test` for storage and model behavior checks and `npm run check` for entry-point syntax.

## Current behavior

Search Open Library by title, author, or ISBN with 12 results per page. Open details, then save to a browser-local shelf. Change reading status, filter by status, sort by title or date added, edit notes and optional ratings, and confirm removals. Duplicate work IDs and matching ISBNs are rejected. Failed writes are reported; corrupt storage is retained instead of overwritten. Search and detail text are inserted using textContent. Missing covers and descriptions have fallbacks. The details dialog uses native modal focus behavior.

## API setup and attribution

Open Library search uses explicit fields and page/limit parameters. Documentation: https://openlibrary.org/dev/docs/api/search. Work descriptions use the work JSON endpoint. Cover images come from covers.openlibrary.org. Search occurs on form submission, with timeout and cancellation of superseded requests.

Google Books enrichment is implemented but disabled until a public catalog key is added to js/config.js. Restrict the key to the intended website origins and Books API in Google Cloud. This is a browser-visible API key, not a secret. Documentation: https://developers.google.com/books/docs/v1/using. Lookup uses ISBN and accepts only an exact returned identifier match. Failed enrichment leaves Open Library information usable. No Google account access is requested.

## Data

ShelfStore.mjs uses my-reading-shelf:v1. Records contain Open Library work ID, optional ISBN and Google volume ID, title, authors, cover, year, reading status, note, optional rating, createdAt and updatedAt. Notes are limited to 2000 characters. Data stays in this browser and is lost if browser storage is cleared. There is no cross-device sync. Simultaneous editing in multiple tabs can overwrite changes; avoid editing the same shelf in multiple tabs.

## Remaining course work

- Configure the Google Books key and verify both APIs from the intended hosted origin.
- Create or confirm the personal project repository and actual Trello board URL; the proposal contains a display label rather than a verified board URL.
- Deploy to the chosen course host and record public application and source URLs.
- Complete keyboard, mobile, contrast, HTML/CSS, and live failure-path checks; collect peer feedback.
- Review and explain the implementation personally, fill self-assessments, and record the final demonstration video.

This is a foundation for continued development, not a final course submission.
