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
```
✅ Eliminates manual test scripting
✅ Ensures Jira ↔ Test ↔ Result traceability
✅ Scales test creation with minimal effort
✅ CI-first, TestOps-ready
✅ Production-grade automation flow
```
---

<img width="1891" height="871" alt="image" src="https://github.com/user-attachments/assets/41661066-a4b5-48e4-b332-c6af710e1e74" />
<img width="1890" height="873" alt="image" src="https://github.com/user-attachments/assets/7dc29674-2f7a-44ab-87df-d84ca0b8b477" />
<img width="1917" height="880" alt="image" src="https://github.com/user-attachments/assets/198c8440-f42b-40fb-adf2-5b80b41d8961" />
<img width="510" height="789" alt="image" src="https://github.com/user-attachments/assets/9baab937-2605-4d28-9408-e6159bb09c52" />
<img width="1901" height="985" alt="image" src="https://github.com/user-attachments/assets/03ddcbf3-2750-4055-b6dc-dced2b165977" />

```json
{
  "name": "Jira → Playwright → Qase (Negative Login)",
  "nodes": [
    {
      "parameters": {
        "events": [
          "jira:issue_created"
        ],
        "additionalFields": {}
      },
      "type": "n8n-nodes-base.jiraTrigger",
      "typeVersion": 1.1,
      "position": [
        0,
        0
      ],
      "id": "f52f545f-ac77-4e78-a6f1-63f8e6f180b0",
      "name": "Jira Trigger",
      "webhookId": "da3df29f-0e9b-4ec0-a3c0-1b76a2768833",
      "credentials": {
        "jiraSoftwareCloudApi": {
          "id": "7GC755U2PVPhASwL",
          "name": "Jira SW Cloud account 2"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "const issue = $json.issue;\nconst fields = issue.fields;\n\nconst jiraKey = issue.key;\nconst summary = fields.summary || '';\n\nconst description =\n  typeof fields.description === 'string'\n    ? fields.description\n    : JSON.stringify(fields.description || '');\n\nconst qaseMatch = description.match(/QASE:\\s*([A-Z]+-\\d+)/i);\nconst qaseId = qaseMatch ? qaseMatch[1].toUpperCase() : null;\n\nif (!qaseId) {\n  throw new Error(`QASE ID not found in Jira description for ${jiraKey}`);\n}\n\nconst isNegative =\n  summary.toLowerCase().includes('negative') ||\n  summary.toLowerCase().includes('invalid') ||\n  description.toLowerCase().includes('invalid');\n\nreturn [\n  {\n    json: {\n      jiraKey,\n      summary,\n      type: isNegative ? 'negative' : 'positive',\n      qaseId,\n    },\n  },\n];\n"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        208,
        0
      ],
      "id": "63d553f8-087e-430c-846b-c338e3991d9b",
      "name": "Parse Jira Issue"
    },
    {
      "parameters": {
        "jsCode": "const data = items[0].json;\n\nconst testName = data.jiraKey + ' - ' + data.summary;\nconst isNegative = data.type === 'negative';\n\nlet testBody = '';\n\nif (isNegative) {\n  testBody =\n    \"  await page.goto('https://www.saucedemo.com/');\\n\\n\" +\n    \"  await page.fill('#user-name', 'standard_user');\\n\" +\n    \"  await page.fill('#password', 'wrong_password');\\n\" +\n    \"  await page.click('#login-button');\\n\\n\" +\n    \"  const errorMessage = page.locator('[data-test=\\\"error\\\"]');\\n\\n\" +\n    \"  await expect(errorMessage).toBeVisible();\\n\" +\n    \"  await expect(errorMessage).toHaveText(\\n\" +\n    \"    'Epic sadface: Username and password do not match any user in this service'\\n\" +\n    \"  );\\n\";\n} else {\n  testBody =\n    \"  await page.goto('https://www.saucedemo.com/');\\n\\n\" +\n    \"  await page.fill('#user-name', 'standard_user');\\n\" +\n    \"  await page.fill('#password', 'secret_sauce');\\n\" +\n    \"  await page.click('#login-button');\\n\\n\" +\n    \"  await expect(page).toHaveURL(/inventory/);\\n\";\n}\n\nconst fileContent =\n  \"import { test, expect } from '@playwright/test';\\n\\n\" +\n  \"test('\" + testName + \"', async ({ page }) => {\\n\" +\n  \"  test.info().annotations.push({\\n\" +\n  \"    type: 'qase',\\n\" +\n  \"    description: '\" + data.qaseId + \"',\\n\" +\n  \"  });\\n\\n\" +\n  testBody +\n  \"});\\n\";\n\nreturn [\n  {\n    json: {\n      filename: data.jiraKey + '.spec.ts',\n      content: fileContent,\n    },\n  },\n];\n"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        448,
        -256
      ],
      "id": "a22b905d-3303-4481-9d7f-b9ab7d564ea6",
      "name": "Generate Playwright Spec"
    },
    {
      "parameters": {
        "authentication": "oAuth2",
        "resource": "file",
        "owner": {
          "__rl": true,
          "value": "rezaparamarta",
          "mode": "list",
          "cachedResultName": "rezaparamarta",
          "cachedResultUrl": "https://github.com/rezaparamarta"
        },
        "repository": {
          "__rl": true,
          "value": "n8n-Jira-Playwright-GithubActions-Qaseio",
          "mode": "list",
          "cachedResultName": "n8n-Jira-Playwright-GithubActions-Qaseio",
          "cachedResultUrl": "https://github.com/rezaparamarta/n8n-Jira-Playwright-GithubActions-Qaseio"
        },
        "filePath": "=tests/{{ $json.filename }}",
        "fileContent": "={{ $json.content }}",
        "commitMessage": "=test: add {{ $json.jiraKey }} from Jira"
      },
      "type": "n8n-nodes-base.github",
      "typeVersion": 1.1,
      "position": [
        656,
        -256
      ],
      "id": "72e07394-3571-4940-a156-3da7de2243c4",
      "name": "Create a file",
      "webhookId": "cf39bbc7-5970-47c4-877f-4685ad447ea6",
      "credentials": {
        "githubOAuth2Api": {
          "id": "JBUHUjRPe5Nh7bkW",
          "name": "GitHub account"
        }
      }
    }
  ],
  "pinData": {},
  "connections": {
    "Jira Trigger": {
      "main": [
        [
          {
            "node": "Parse Jira Issue",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Parse Jira Issue": {
      "main": [
        [
          {
            "node": "Generate Playwright Spec",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate Playwright Spec": {
      "main": [
        [
          {
            "node": "Create a file",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": false,
  "settings": {
    "executionOrder": "v1",
    "availableInMCP": false
  },
  "versionId": "4ad1cc52-f91a-422f-b090-445a18c35bc5",
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "db91d8a3bed32cbfd608e405f33672381ecbc8d1ac1db715fc002d6e538238bf"
  },
  "id": "MvQGOxRXYYJR6AbAkxzQD",
  "tags": []
}
```

```
🚧 Future Improvements

Auto-deduplication test files per Jira key

Step-level mapping (Given / When / Then → Qase Steps)

Auto-close Jira issue on test pass

Support multi-feature routing (login, checkout, etc.)
```

```
👤 Author
Reza Paramarta
TestOps | QA Engineer | Automation | CI/CD
```









