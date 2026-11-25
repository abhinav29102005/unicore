# Manual test cases

[UniCore_Test_Cases.pdf](./UniCore_Test_Cases.pdf) contains three cases in the course template: student sign-in, dashboard access, and attendance. [HTML source](./UniCore_Test_Cases.html) carries the same cases.

The cases target the current Java backend: CSRF token plus a session cookie for sign-in, 401 for an unauthenticated request, and 403 when a student requests another student's records. Expected record values are checked against the account actually provisioned for the test. No credentials are included in the document.

Before execution, start a reachable Java API and obtain an active Student account from the administrator. Record its API base as `<API>`, its roll number as `<OWN_ROLL>`, and use one browser or API-client cookie jar throughout each authenticated case. Fill in the execution date, executor, pass/fail cells, and actual-result notes while running the tests. The PDF deliberately leaves these blank because the live Java deployment has not been verified.
