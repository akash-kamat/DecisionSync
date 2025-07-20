# 🧠 DecisionSync

**DecisionSync** is an AI-powered, agentic assistant that captures and routes important business decisions from meetings using speech or text. It extracts structured information and automatically pushes it to the right tools — like **Jira**, **Notion**, and **Slack** — using smart workflows powered by **n8n**.
- Project live on : https://decision-sync-frontend.vercel.app
---

## 🚀 Features

- 🎙️ Accepts decisions via text or speech (STT)
- 🤖 Extracts title, summary, owners, due date, Jira key using **Gemini AI**
- 🧠 Classifies priority (high/normal/low) and routes automatically
- 🔁 Integrates with **n8n** for condition-based routing
- 🛠️ Sends to:
  - **Jira** (for critical actions)
  - **Notion** (for logging)
  - **Slack** (for team visibility)

---

## 🧰 Tech Stack

| Component      | Tech Used                        |
|----------------|----------------------------------|
| Frontend       | React.js                         |
| Backend        | Node.js, Express.js              |
| AI             | Gemini 2.5 (via @google/gen-ai)  |
| Workflow       | n8n (cloud/self-hosted)          |
| Integrations   | Jira API, Notion API, Slack API  |

---

## 📦 Installation & Setup

1. **Clone the repo**
```bash
git clone https://github.com/your-username/decisionsync.git
cd decisionsync
