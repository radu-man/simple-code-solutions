# Simple Code Solutions — website

Static company website (plain HTML/CSS/JS, no build step), hosted on GitHub Pages.

- `index.html` — page content
- `assets/css/styles.css` — styles
- `assets/js/main.js` — interactions; set `CONTACT_EMAIL` at the top to enable the contact form

## Local preview

```sh
python3 -m http.server 8000
```

## Custom domain

When the domain is ready: add a `CNAME` file containing the domain, point DNS at GitHub Pages,
and set the domain under the repository's Settings → Pages.
