# Bleubook Simulator

A Bluebook-style FRQ exam simulator for the classroom, in a single HTML file.

**Live site:** https://bleubook.web.app

## How it works

Exams are stored in a Google Sheet through an Apps Script web app, so exams can include images and student links stay short.

- **One-time database setup:** In any Google Sheet, open Extensions > Apps Script, paste in the Database version of the `doPost` code (it handles three actions: `saveExam`, `getExam`, `submitAnswers`), and deploy it as a Web app (Execute as: Me, Who has access: Anyone). Copy the Web App URL. When the script code changes, redeploy with Deploy > Manage deployments > Edit > New Version > Deploy so the URL stays the same.
- **Teacher setup:** Open the site, paste in the Web App URL (required), and build the exam: each main question has a stimulus/document pane (shown on the left for students, images supported) and one or more prompt parts (shown on the right), all edited with a rich text editor.
- **Student link:** "Save Exam & Generate Student Link" saves the exam to the sheet's `Exam_Database` tab and returns a short link (`?id=EXAM-...&url=...`). Students open it and the exam loads from the sheet into the split-screen testing view with a timer, question navigation, and autosaved answers.
- **Grading:** Student submissions post back to the same sheet, one tab per exam title, with a timestamp, the student's name, and one column per prompt.

## Files

- `index.html` — the entire app (markup, styles, and logic). Quill.js loads from a CDN; everything else is self-contained.
