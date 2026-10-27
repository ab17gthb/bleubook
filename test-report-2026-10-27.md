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
