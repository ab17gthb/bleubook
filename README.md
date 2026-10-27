# Bleubook Simulator

A Bluebook-style FRQ exam simulator for the classroom, in a single HTML file.

**Live site:** https://bleubook.web.app

## How it works

- **Teacher setup:** Open the page with no parameters. Build an exam with as many main questions as you need. Each question has a stimulus/document pane (shown on the left for students) and one or more prompt parts (shown on the right), all edited with a rich text editor.
- **Student link:** Click "Generate Student Link" and the whole exam is encoded into the URL itself. There is no server and no database. Students open the link and get the split-screen testing view with a timer, question navigation, and autosaved answers.
- **Grading (optional):** Paste in a Google Apps Script Web App URL during setup and student submissions post straight into a Google Sheet, one tab per exam title. The setup page includes the full Apps Script code and step-by-step deploy instructions for the "Magic Tab" auto-grader.

## Files

- `index.html` — the entire app (markup, styles, and logic). Quill.js loads from a CDN; everything else is self-contained.
