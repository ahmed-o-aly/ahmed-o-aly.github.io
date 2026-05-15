# Ahmed Aly Personal Website

Source for [ahmed-o-aly.github.io](https://ahmed-o-aly.github.io/).

This is a Jekyll site based on al-folio, customized into a personal portfolio and writing space for:

- optimization and operations research projects,
- energy-system modeling and decision support,
- KU MetaHub AI/XR lab-specialist work,
- public-policy simulations with ADSG at Khalifa University,
- books, notes, and regular writing.

## Content

- Homepage: `_pages/about.md`
- Writing: `_posts/`
- Projects: `_projects/`
- Books: `_books/`
- Scheduled posts: `_scheduled/`
- CV data: `_data/cv.yml`
- Publications: `_bibliography/papers.bib`
- Visual styling: `_sass/_base.scss` and `_sass/_themes.scss`

Draft helpers live in `_drafts/` and are not published by default.
Future-dated posts can live in `_scheduled/` until the scheduled-post workflow publishes them.

## Local Setup

Ruby/Jekyll is required for a full local build:

```bash
bundle install
bundle exec jekyll serve
```

On Windows, native Ruby gems may require the RubyInstaller MSYS2 toolchain. GitHub Actions builds the site on Linux through `.github/workflows/deploy.yml`.

## Theme Credit

The site uses the open-source al-folio Jekyll theme as its base, with personal content, styling, project structure, and workflow cleanup applied in this repository.
