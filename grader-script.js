function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var data = JSON.parse(e.postData.contents);

  if (data.action === "saveExam") {
    var dbSheet = ss.getSheetByName("Exam_Database");
    if (!dbSheet) {
      dbSheet = ss.insertSheet("Exam_Database");
      dbSheet.appendRow(["Exam ID", "Exam Data"]);
    }
    var examId = "EXAM-" + Math.floor(Math.random() * 1000000000);
    dbSheet.appendRow([examId, JSON.stringify(data.examData)]);
    return ContentService.createTextOutput(JSON.stringify({"status": "success", "examId": examId})).setMimeType(ContentService.MimeType.JSON);
  }

  if (data.action === "getExam") {
    var dbSheet = ss.getSheetByName("Exam_Database");
    var records = dbSheet.getDataRange().getValues();
    for (var i = 1; i < records.length; i++) {
      if (records[i][0] === data.examId) {
        return ContentService.createTextOutput(records[i][1]).setMimeType(ContentService.MimeType.JSON);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({"error": "Exam not found"})).setMimeType(ContentService.MimeType.JSON);
  }

  if (data.action === "submitAnswers") {
    var examTitle = data.examTitle || "Untitled Exam";
    var sheet = ss.getSheetByName(examTitle);
    var n = data.responses.length;
    var totalCol = 5 + 2 * n;
    var feedbackCol = totalCol + 1;
    var nameCol = feedbackCol + 1;

    if (!sheet) {
      sheet = ss.insertSheet(examTitle);
      var headers = ["Timestamp", "Timer at Submission", "Period", "Student ID"];
      for (var i = 0; i < n; i++) {
        headers.push(data.prompts && data.prompts[i] ? data.prompts[i] : "Response " + (i + 1));
        headers.push("Score: Part " + (i + 1));
      }
      headers.push("Total", "Teacher Feedback", "Student Name");
      sheet.appendRow(headers);
      sheet.setFrozenRows(1);
      sheet.setFrozenColumns(4);
      sheet.getRange("1:1").setFontWeight("bold");
      sheet.getRange("B:B").setNumberFormat("@");

      var rules = [];
      for (var i = 0; i < n; i++) {
        var respCol = 5 + 2 * i;
        var scoreCol = respCol + 1;
        var colLetter = columnLetter_(scoreCol);
        sheet.setColumnWidth(respCol, 380);
        sheet.getRange(1, respCol, 1000, 1).setWrap(true);
        sheet.setColumnWidth(scoreCol, 75);
        var scoreRange = sheet.getRange(2, scoreCol, 998, 1);
        var dv = SpreadsheetApp.newDataValidation().requireValueInList([0, 1, 2], true).setAllowInvalid(false).build();
        scoreRange.setDataValidation(dv);
        rules.push(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied("=" + colLetter + "2=\"\"").setBackground("#e0e0e0").setRanges([scoreRange]).build());
        rules.push(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied("=AND(" + colLetter + "2<>\"\",VALUE(" + colLetter + "2)=0)").setBackground("#f4cccc").setRanges([scoreRange]).build());
        rules.push(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied("=AND(" + colLetter + "2<>\"\",VALUE(" + colLetter + "2)>0)").setBackground("#d9ead3").setRanges([scoreRange]).build());
      }
      var periodRange = sheet.getRange(2, 3, 998, 1);
      rules.push(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied("=AND(C2<>\"\",NOT(ISNUMBER(C2)))").setBackground("#f4cccc").setRanges([periodRange]).build());
      sheet.setConditionalFormatRules(rules);

      var phrases = ["Strong evidence use", "Needs a citation", "Explain the significance", "Check the sourcing", "Good analysis", "Develop this further", "See me about this"];
      var fbRange = sheet.getRange(2, feedbackCol, 998, 1);
      var fbDv = SpreadsheetApp.newDataValidation().requireValueInList(phrases, true).setAllowInvalid(true).build();
      fbRange.setDataValidation(fbDv);
      sheet.setColumnWidth(feedbackCol, 220);
      sheet.hideColumns(nameCol);
    }

    var studentId = makeStudentId_(sheet);
    var row = [new Date(), data.timerAtSubmission, data.period, studentId];
    for (var i = 0; i < n; i++) { row.push(data.responses[i]); row.push(""); }
    row.push("", "", data.studentName);
    sheet.appendRow(row);
    var lastRow = sheet.getLastRow();

    var timerCell = sheet.getRange(lastRow, 2);
    timerCell.setNumberFormat("@");
    timerCell.setValue(String(data.timerAtSubmission || ""));

    var cells = [];
    var exprs = [];
    for (var i = 0; i < n; i++) {
      var ref = columnLetter_(6 + 2 * i) + lastRow;
      cells.push(ref);
      exprs.push("IF(" + ref + "=\"\",0,VALUE(" + ref + "))");
    }
    var totalFormula = "=IF(COUNTA(" + cells.join(",") + ")=0," + "\"\"" + "," + exprs.join("+") + ")";
    sheet.getRange(lastRow, totalCol).setFormula(totalFormula);

    return ContentService.createTextOutput(JSON.stringify({"status": "success"})).setMimeType(ContentService.MimeType.JSON);
  }
}

function columnLetter_(col) {
  var letter = "";
  while (col > 0) {
    var rem = (col - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    col = Math.floor((col - 1) / 26);
  }
  return letter;
}

function makeStudentId_(sheet) {
  var lastRow = sheet.getLastRow();
  var existing = {};
  if (lastRow > 1) {
    var vals = sheet.getRange(2, 4, lastRow - 1, 1).getValues();
    for (var i = 0; i < vals.length; i++) { existing[String(vals[i][0])] = true; }
  }
  var id;
  do { id = "S-" + Math.floor(1000 + Math.random() * 9000); } while (existing[id]);
  return id;
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu("Bleubook")
    .addItem("Reveal student names", "bleubookRevealNames")
    .addItem("Hide student names", "bleubookHideNames")
    .addItem("Build gradebook export", "bleubookBuildExport")
    .addToUi();
}

function bleubookFindCols_(sheet) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var map = {};
  for (var i = 0; i < headers.length; i++) { map[String(headers[i])] = i + 1; }
  return map;
}

function bleubookRevealNames() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var cols = bleubookFindCols_(sheet);
  if (!cols["Student Name"] || !cols["Period"]) { SpreadsheetApp.getUi().alert("This is not a Bleubook exam tab."); return; }
  sheet.showColumns(cols["Student Name"]);
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).sort([{column: cols["Period"], ascending: true}, {column: cols["Student Name"], ascending: true}]);
  }
}

function bleubookHideNames() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var cols = bleubookFindCols_(sheet);
  if (!cols["Student Name"]) { SpreadsheetApp.getUi().alert("This is not a Bleubook exam tab."); return; }
  sheet.hideColumns(cols["Student Name"]);
}

function bleubookBuildExport() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = SpreadsheetApp.getActiveSheet();
  var cols = bleubookFindCols_(sheet);
  if (!cols["Student Name"] || !cols["Total"]) { SpreadsheetApp.getUi().alert("This is not a Bleubook exam tab."); return; }
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var data = lastRow > 1 ? sheet.getRange(2, 1, lastRow - 1, lastCol).getValues() : [];
  var rows = [];
  for (var i = 0; i < data.length; i++) {
    rows.push([data[i][cols["Period"] - 1], data[i][cols["Student Name"] - 1], data[i][cols["Total"] - 1], data[i][cols["Teacher Feedback"] - 1]]);
  }
  rows.sort(function(a, b) {
    if (a[0] !== b[0]) { return (a[0] < b[0]) ? -1 : 1; }
    return String(a[1]).localeCompare(String(b[1]));
  });
  var name = sheet.getName() + " Export";
  var out = ss.getSheetByName(name);
  if (out) { ss.deleteSheet(out); }
  out = ss.insertSheet(name);
  out.appendRow(["Period", "Student Name", "Total", "Teacher Feedback"]);
  out.getRange("1:1").setFontWeight("bold");
  out.setFrozenRows(1);
  for (var i = 0; i < rows.length; i++) { out.appendRow(rows[i]); }
  var lastDataRow = rows.length + 1;
  out.getRange("F1").setValue("Class summary");
  out.getRange("F1").setFontWeight("bold");
  out.getRange("F2").setValue("Average total");
  out.getRange("F3").setValue("Highest total");
  out.getRange("F4").setValue("Lowest total");
  out.getRange("F5").setValue("Scores entered");
  if (rows.length > 0) {
    out.getRange("G2").setFormula("=AVERAGE(C2:C" + lastDataRow + ")");
    out.getRange("G3").setFormula("=MAX(C2:C" + lastDataRow + ")");
    out.getRange("G4").setFormula("=MIN(C2:C" + lastDataRow + ")");
    out.getRange("G5").setFormula("=COUNT(C2:C" + lastDataRow + ")");
  }
  SpreadsheetApp.getUi().alert("Gradebook export built on the tab: " + name);
}
