# Bleubook Simulator

A Bluebook-style FRQ exam simulator for the classroom, in a single HTML file.

**Live site:** https://bleubook.web.app

## How it works

Exams are stored in a Google Sheet through an Apps Script web app, so exams can include images and student links stay short.

- **One-time database setup:** In any Google Sheet, open Extensions > Apps Script, paste in the database script code (the setup page carries the full current code in its tutorial), and deploy it as a Web app (Execute as: Me, Who has access: Anyone). Copy the Web App URL. When the script code changes, redeploy with Deploy > Manage deployments > Edit > New Version > Deploy so the URL stays the same.
- **Teacher setup:** Open the site, paste in the Web App URL (required), and build the exam: each main question has a stimulus/document pane (shown on the left for students, images supported) and one or more prompt parts (shown on the right), all edited with a rich text editor. Teachers pick a count-up stopwatch or a count-down timer with a minute limit that auto-locks the answer boxes at zero, and can set an optional access code students must enter before the exam opens.
- **Student link:** "Save Exam & Generate Student Link" saves the exam to the sheet's `Exam_Database` tab and returns a short link (`?id=EXAM-...&url=...`). Students open it and the exam loads from the sheet into a single scrolling split view (all stimuli on the left, all prompts on the right). Students can hide the timer, see a live word count per answer, and their answers autosave in the browser so a refresh does not lose work.
- **Saved exams library:** Every saved exam is listed at the bottom of the setup page by title. Copy a student link to hand an exam out again as-is, choose "Use again" to run the same exam under a fresh link and its own grading tab (tagged with the school year), or choose "Edit in setup" to pull the exam back into the form and change it first.
- **Load and share:** The Load an Exam Into Setup box takes a student link, an Exam ID, or a setup code and fills the whole exam into the form. The Share This Exam as a Setup Code button turns the exam in the form into a portable code any teacher can paste into that box to get the exam in their own setup.
- **Grading:** Submissions land in a tab named for the exam, set up for anonymous grading: timestamp, the timer reading at submission, class period, and a random Student ID are shown, with each response beside a 0/1/2 score selector and the student's name kept hidden in the last column. Totals fill in on their own, a Teacher Feedback column offers common phrases, and the sheet's Bleubook menu can reveal the names sorted by period and build a gradebook export tab with a class summary.

## Files

- `index.html` — the entire app (markup, styles, and logic). Quill.js loads from a CDN; everything else is self-contained.
- `grader-script.js` — the current Apps Script database code, the same code the setup page tutorial carries for copy-paste.
