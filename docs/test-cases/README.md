# Test Cases

Manual test cases for UniCore, written in the course test case template (header, pre-conditions, steps with expected system response, post-conditions). Each case is run against the live system.

📄 **[UniCore_Test_Cases.pdf](./UniCore_Test_Cases.pdf)** (source: [UniCore_Test_Cases.html](./UniCore_Test_Cases.html))

| # | Test case | Subsystem | Covers |
|---|-----------|-----------|--------|
| 1.1 | Student Sign-in | Authentication | Sign-in through the website; login rejected for a wrong password and an unknown email |
| 1.2 | Student Dashboard | Student Portal | Dashboard shows the signed-in student's live data; unknown roll number returns 404 |
| 1.3 | Student Attendance | Academic – Attendance | Per-course attendance and percentage are correct; unknown roll number returns 404 |

## Running them

1. Print the PDF, or open it next to the browser.
2. Follow the steps of each case in order and fill in **Executed by**, **Execution Date**, and **Pass/Fail** + **Comment** for every step.
3. API steps can be run by opening the URL in a browser (GET) or with `curl` / Postman (POST).

To update the document, edit the HTML and print it to PDF from Chrome (no headers and footers).
