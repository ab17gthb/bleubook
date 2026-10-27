# Bleubook Simulator end-to-end test — 2026-10-27

Site: https://bleubook.web.app — live browser test, teacher flow and student flow.
Result: ALL 13 STEPS PASSED. No errors, broken navigation, or lost answers.

Teacher flow
1. PASS — Teacher Setup loaded: Exam Title field, optional Apps Script URL field, Question 1 with stimulus editor and one prompt editor.
2. PASS — Title entered: "Test Exam - Period 1".
3. PASS — Q1 stimulus entered (Document 1, 1911 speech excerpt).
4. PASS — Q1 Part A prompt entered.
5. PASS — "+ Add Text Box / Part" added Part 2; Part B prompt entered.
6. PASS — "+ Add Another Main Question" added Q2; stimulus and prompt entered.
7. PASS — "Generate Student Link" produced a working ?data= link containing the title, both questions, and all prompts.

Student flow
8. PASS — Student view loaded from the link: title in header, timer counting up, Document 1 left, Part A and Part B editors right. Note: the generated link opened in a new tab (the link markup uses target=_blank); harmless.
9. PASS — Answers typed into Part A and Part B.
10. PASS — Next showed Q2, tracker "Question 2 of 2", Next replaced by Finish Exam.
11. PASS — Previous returned to Q1 with both answers intact (autosave works).
12. PASS — Finish Exam opened the submission modal.
13. PASS — Blank name gave "Please enter your name!"; submitting as "Test Student" with no grading URL gave "Teacher did not provide a grading link. Please copy/paste your answers manually." (expected behavior).

Other: timer stopped when the completion modal opened (by design). Testing only; nothing deployed or changed.

## Database version (v2/v3) test — 2026-10-27, later

Working grader Web App URL (Oakwood copy sheet, unchanged across the v2 redeploy):
https://script.google.com/macros/s/AKfycbxmmKbYwHgYaVMsDClzRYjNn6RhnR8c3cPcs9kFnzr8AMDiVk9gBvEnsmexL_ZcjiwUnA/exec

- Script in "Bleubook Grader Test (Oakwood copy)" replaced with the Database version (saveExam/getExam/submitAnswers) and redeployed as Version 2 via Manage deployments > Edit > New version. URL unchanged.
- Live test on bleubook.web.app: "Database Test Exam" saved from the teacher view; Exam_Database tab row EXAM-35104506 created; short student link loaded the exam from the database; submission as Test Student showed "Success! Your exam has been securely submitted."; the "Database Test Exam" tab holds the row with the answer under "Q1: Part A: Summarize the document."
- All steps passed.

## v4 app + script Version 4 (Timer at Submission) — verified 2026-10-27 09:03 ET
- Grader script updated to the Timer version and deployed as Version 4 (URL unchanged). A fresh exam, "Timer Column Test" (EXAM-142149611), created a tab with headers: Timestamp | Timer at Submission | Student Name | Exam Title | Part A: Why did it matter? | Score | Teacher Feedback.
- Test Student submitted after 38 seconds on the count-up stopwatch; the Timer at Submission cell recorded 0:38, matching the on-screen timer. Quirk: Sheets parses "00:38" as a time of day (formula bar shows 12:38:00 AM) though the cell displays 0:38.
- Site is now at v5 (timer-limit input toggle fix); the setup tutorial embeds the current script for copy-paste.

## Plain-text timer, attempt 1 (script Version 5) — FAILED verification 2026-10-27 09:25 ET
- Added sheet.getRange("B:B").setNumberFormat("@") at tab creation and redeployed as Version 5 (URL unchanged). Fresh exam "Plain Text Timer Test" (EXAM-934194219): B2 grid showed 0:32 but the formula bar still showed 12:32:00 AM. appendRow re-parses the value as a time regardless of the preset column format.
- Attempt 2 (in progress): after appendRow, overwrite the timer cell explicitly with setNumberFormat("@") + setValue(String(...)), redeploy, and re-verify with a fresh tab.

## Plain-text timer, attempt 2 (script Version 6) — VERIFIED 2026-10-27 09:38 ET
- After appendRow, the script overwrites the timer cell with setNumberFormat("@") + setValue(String(...)). Fresh exam "Plain Text Timer Fix Test" (EXAM-678093590): B2 grid 01:13 and formula bar 01:13 — plain text, no time-of-day conversion. This technique is baked into the final grading script (grader-script.js).
- The same test incidentally confirmed the live front end's new period field works (submission required a numeric period).
- Final step launched 2026-10-27: replace the sheet's script with grader-script.js (access code gate, anonymous grading, 0/1/2 color scores, totals, Bleubook menu with reveal + gradebook export) and verify end to end.

## Grading build (script Version 7) — FULLY VERIFIED 2026-10-27 09:52 ET, zero failures
- Code gate: wrong code "wrong1" rejected with "That code is not right. Check with your teacher and try again."; hawks27 opened the exam.
- Submissions: Test Student One (Period 2, timer 00:29) and Test Student Two (Period 1, timer 00:30) both "Success! Your exam has been securely submitted."
- Tab "Grading Build Test" headers: Timestamp | Timer at Submission | Period | Student ID | Part A prompt | Score: Part 1 | Part B prompt | Score: Part 2 | Total | Teacher Feedback | Student Name (hidden; column letters jumped J to L). IDs S-6479 and S-2278, distinct. Timer B2 formula bar plain text 00:29. Totals blank pre-grading with the COUNTA-guarded formula.
- Scoring: 2 -> green #d9ead3; 0 -> red #f4cccc; blank -> gray #e0e0e0; Total computed 2.
- Bleubook menu present after reload. Export tab sorted Period 1 (Student Two, blank total) then Period 2 (Student One, total 2); class summary Average 2, Highest 2, Lowest 2, Scores entered 1. Reveal unhid names and re-sorted by Period then name.
- Launched same morning: swap test sheet to the chunked-storage/title/library script + verification (oversized exam with FINAL SENTINEL check, library listing, Use again incl. the code-prompt path).

## Version 8 verification (2026-10-27, browser task ran 9:54–10:12 AM EDT)

- Script replaced with the chunked-storage version and redeployed as Version 8; Web App URL unchanged (verified exactly).
- Migration PASS: Exam_Database header is now Exam ID | Exam Title | Exam Data; legacy rows have titles filled in (Database Test Exam, Score Columns Test, Timer Column Test, Plain Text Timer Test, Plain Text Timer Fix Test, Grading Build Test).
- Oversized exam PASS: "Oversized Exam Test" (EXAM-47700262) built with ~201 copies of the railroad paragraph (58,000+ characters) ending in "FINAL SENTINEL: The last wagon crossed in 1869." Saved successfully; student view showed the FINAL SENTINEL at the bottom of the stimulus, proving full reassembly with no truncation. Submission by Test Student, Period 3 returned "Success! Your exam has been securely submitted." Database row spans columns A–D (chunks in C and D; E empty).
- Use again (no code) PASS: "Oversized Exam Test (2026-27)" created with fresh link (EXAM-204612749); the copy loads with the full stimulus.
- Use again (with access code) NOT YET VERIFIED: clicking Use again on "Grading Build Test" (code hawks27) depends on a window.prompt dialog that the automated browser cannot operate; the prompt never surfaces and no copy is made. Awaiting Alex doing that one click in person, then the remaining checks are: "Grading Build Test (2026-27)" appears in the library with a fresh EXAM id, its link opens, hawks27 entered in the on-page code gate opens the exam.
