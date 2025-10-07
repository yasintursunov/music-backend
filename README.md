
# Music Backend 

**No native deps.** Cover images are generated as **SVG** (pure text), so Windows install works without Cairo/GTK.

Run:
```bash
npm install
npm run dev    # http://localhost:4000
```

(Node.js + Express)

Generates song data on the server: title, artist, album or “Single”, genre, and likes.
Deterministic: same (language + seed + page + index) always produces the same songs and audio.
Likes are independent: changing “likes” only changes the like counts, not titles or audio.
Cover images are SVG with the correct title and artist rendered on them.
Audio previews are WAV and play directly in the browser.
Optional lyrics: time-coded, generated lines for live scrolling.
No storage of random data; everything is generated in memory on request.
Key endpoints (described informally):
        /api/songs – returns a page (batch) of songs.
        /api/cover – returns the cover image (SVG) for a song.
        /api/preview – returns the audio preview (WAV) for a song.
        /api/lyrics – returns time-coded lyric lines (optional).
        /healthz – simple health check.

Parameters supported everywhere: lang (en-US or de-DE), seed (64-bit string), likes (0–10), page (≥1), pageSize (1–100).