🚀 Jira → n8n → Playwright → GitHub Actions → Qase

Automated E2E Test Generation & Reporting Pipeline

---
📌 Overview

Repository ini berisi end-to-end automation pipeline untuk:

Mengambil requirement dari Jira

Meng-generate Playwright test script secara otomatis

Menyimpan test ke GitHub repository

Menjalankan test via GitHub Actions (CI/CD)

Mengirim hasil eksekusi ke Qase TestOps sebagai Test Run otomatis

Pipeline ini dirancang untuk mengurangi manual scripting, menjaga single source of truth di Jira, dan memastikan traceability dari requirement → test → execution result.
---

🧩 High Level Flow

```Java
Jira Issue
   ↓
n8n Workflow
   ↓
Parse & Normalize Test Intent
   ↓
Generate Playwright Spec (.spec.ts)
   ↓
Commit to GitHub
   ↓
GitHub Actions (CI)
   ↓
Playwright Execution
   ↓
Qase Test Run (Automated)
```

---
🛠️ Tech Stack

Jira – Source of requirement & test intent

n8n – Workflow orchestration & code generation

Playwright – End-to-end testing framework

GitHub Actions – CI/CD execution

Qase TestOps – Test case & execution reporting

Node.js 20
---
---
📂 Repository Structure

```
.
├── .github/workflows/
│   └── playwright-qase.yml
├── tests/
│   ├── SCRUM-8.spec.ts
│   ├── SCRUM-12.spec.ts
│   └── SCRUM-15.spec.ts
├── playwright.config.ts
├── package.json
└── README.md
```
---

---
🧠 Design Decisions & Logic
1️⃣ Jira as Single Source of Truth

Test tidak ditulis manual di repo.
Semua intent test berasal dari Jira Issue:

Summary → Test title

Description → Context

Keyword [NEGATIVE] / invalid → Test type detection

Custom tag (QASE ID) → Mapping ke Qase

Dengan ini:

Product / QA / Dev berbicara di bahasa yang sama

Test selalu mengikuti requirement terbaru
---
---
2️⃣ n8n sebagai Test Generator (Not Just Trigger)

n8n tidak sekadar trigger, tapi:

Parse payload Jira

Menentukan positive / negative flow

Menyusun Playwright test body

Menjamin syntax aman untuk CI

Commit otomatis ke GitHub
---
---
⚠️ Important implementation detail
JavaScript di n8n bukan Node.js murni, sehingga:

Template literal kompleks dihindari

String concatenation dipilih untuk stabilitas parser
---

3️⃣ Playwright Test Structure

Setiap test dihasilkan dengan pola konsisten:

```ts
test.info().annotations.push({
  type: 'qase',
  description: 'NLFWIP-1',
});
```

Hal ini memastikan:

Test terhubung langsung ke Qase

Tidak perlu mapping manual

One-to-one traceability

---
4️⃣ CI/CD via GitHub Actions

Pipeline dijalankan otomatis pada:

push ke main

Manual trigger (workflow_dispatch)

Tahapan CI:

Checkout repo

Install dependencies

Install Playwright browsers

Run tests

Auto-publish result ke Qase
---

---
5️⃣ Qase Reporting Strategy

Test Run dibuat otomatis

Status test mengikuti hasil Playwright

Run diselesaikan otomatis (complete: true)

Link ke Test Run dicetak di CI log
---

Contoh output:

---
[INFO] qase: Test run link: https://app.qase.io/run/***/dashboard/2
---

🔐 Environment Variables

Disimpan sebagai GitHub Actions Secrets:

---
| Variable            | Description            |
| ------------------- | ---------------------- |
| `BASE_URL`          | Target application URL |
| `QASE_API_TOKEN`    | Qase API token         |
| `QASE_PROJECT_CODE` | Qase project code      |
---

🧪 Example Test Case (Generated)

```ts
test('SCRUM-15 - [NEGATIVE] Login fails with invalid password', async ({ page }) => {
  test.info().annotations.push({
    type: 'qase',
    description: 'NLFWIP-1',
  });

  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'wrong_password');
  await page.click('#login-button');

  const errorMessage = page.locator('[data-test="error"]');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toHaveText(
    'Epic sadface: Username and password do not match any user in this service'
  );
});
```
---
🧯 Error Handling & Stability

Legacy test files terdeteksi via CI failure

Generator memastikan full URL untuk menghindari invalid navigation

CI tetap melaporkan partial success ke Qase

Pipeline fail jika ada test gagal (quality gate)
---
---
🎯 What This Pipeline Solves

✅ Eliminates manual test scripting
✅ Ensures Jira ↔ Test ↔ Result traceability
✅ Scales test creation with minimal effort
✅ CI-first, TestOps-ready
✅ Production-grade automation flow
---

---
🚧 Future Improvements

Auto-deduplication test files per Jira key

Step-level mapping (Given / When / Then → Qase Steps)

Auto-close Jira issue on test pass

Support multi-feature routing (login, checkout, etc.)
---
---
👤 Author
---
---
Reza Paramarta
QA Engineer | Automation | CI/CD | TestOps
---
