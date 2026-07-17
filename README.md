# AI Resume Analyzer

Compares a candidate's resume against a Job Description using AI. It extracts technical skills from both documents, matches them (including generic requirements like "Databases" against specific tools like MongoDB), calculates a match percentage, evaluates experience fit, and generates an AI hiring verdict (`Qualified` / `Almost There` / `Not Yet`) with three supporting reasons.

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js
- **AI:** Google Gemini API
- **File handling:** Multer (upload), pdf-parse (text extraction)

## Setup Instructions

### Prerequisites

- Node.js v18+
- A [Gemini API key](https://ai.google.dev/)

### Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the server:

```bash
npm run dev
```

Runs at `http://localhost:5000`.

### Frontend

```bash
cd client
npm install
npm run dev
```

Runs at `http://localhost:5173`.

### API

`POST /api/analyze` — `multipart/form-data` with fields `resume` (PDF file) and `jobDescription` (text). Returns matched/missing skills, match percentage, experience comparison, and the AI verdict with reasons.

## Assumptions

- Resumes are PDF only — no DOCX or plain-text support.
- Candidate years of experience is an AI estimate from resume text (internships/jobs only, not education), not an exact calculation.
- The overall score weights skills at 70% and experience at 30% — a reasonable default for a technical role, not a fixed standard.
- No authentication or database — the app is stateless; each analysis is a single request/response.
- Only one resume vs. one JD per request; no batch comparison.

## Trade-offs

- **Deterministic matching first, AI as fallback only.** Skill comparison uses a hardcoded alias/category dictionary (e.g. MongoDB → Databases, Git/GitHub → Version Control) as the primary matcher instead of asking AI to judge every comparison. This is faster, free, and 100% reproducible for common tech stacks. Anything the dictionary doesn't recognize falls back to a scoped AI call, so unusual JD wording still works, just slightly slower and with an API cost.
- **Gemini free-tier limits.** The free tier has daily/per-minute request caps, so heavy use can hit rate-limit errors. A production deployment would need a paid tier.
- **No cleanup of uploaded files.** Uploaded resumes are saved to `server/uploads/` but never deleted — fine for a demo, not for production.
