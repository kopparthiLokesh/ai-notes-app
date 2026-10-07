<div align="center">

# 📝 AI-Powered Notes & Task App

**A fast, modern notes app with tagging, search, and AI assistance, built with Next.js, TypeScript, and Prisma.**

[Live Demo](https://your-app.vercel.app) · [Report a Bug](https://github.com/kopparthiLokesh/ai-notes-app/issues) · [Request a Feature](https://github.com/kopparthiLokesh/ai-notes-app/issues)

![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## 📖 Overview

AI-Powered Notes & Task App helps you capture ideas and tasks quickly, organise them with tags, and find them again instantly. An integrated LLM layer adds smart assistance on top of your notes, so you spend less time organising and more time doing.

<!-- TODO: Replace with a real screenshot or GIF -->
![App Screenshot](./public/screenshot.png)

## ✨ Features

- **Create, edit, and delete notes** with a clean, responsive interface
- **Tag support**: add tags to any note and filter by them with one click
- **Instant search**: find notes by title or content as you type
- **AI assistance**: LLM-powered features for your notes <!-- TODO: be specific, e.g. summarisation, auto-tagging, task extraction -->
- **Input validation** on both client and server for reliable data
- **Persistent storage** using Prisma ORM with a relational database
- **Global state management** for a smooth, snappy UI
- **Fully responsive** on desktop, tablet, and mobile

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Database ORM | [Prisma](https://www.prisma.io/) |
| Database | <!-- TODO: PostgreSQL / SQLite / MySQL --> |
| State Management | <!-- TODO: Zustand / Redux / Context --> |
| Styling | <!-- TODO: Tailwind CSS / CSS Modules --> |
| AI / LLM | <!-- TODO: OpenAI / Gemini / Groq / Anthropic --> |
| Linting & Formatting | ESLint, Prettier |
| Deployment | [Vercel](https://vercel.com/) |

## 📁 Project Structure

```
ai-notes-app/
├── prisma/
│   ├── migrations/        # Database migrations
│   └── schema.prisma      # Data model
├── public/                # Static assets
├── scripts/               # Utility scripts
├── src/
│   ├── app/               # Next.js routes and pages
│   ├── components/        # NoteForm, NoteCard, NoteList, SearchBar, TagFilter
│   ├── lib/
│   │   ├── llm.ts         # LLM integration
│   │   ├── notes.ts       # Note data helpers
│   │   ├── parseTags.ts   # Tag parsing logic
│   │   ├── prisma.ts      # Prisma client instance
│   │   └── validations.ts # Input validation schemas
│   ├── store/
│   │   └── useNotesStore.ts  # Global state
│   └── types/
│       └── index.ts       # Shared TypeScript types
├── .env                   # Environment variables (not committed)
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.18 or later
- npm (comes with Node.js)
- A database <!-- TODO: e.g. a PostgreSQL connection string -->
- An API key for your LLM provider

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/kopparthiLokesh/ai-notes-app.git
   cd ai-notes-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the project root:

   ```env
   # Database
   DATABASE_URL="your-database-connection-string"

   # AI / LLM provider
   LLM_API_KEY="your-api-key"   # TODO: use the exact variable name from your code
   ```

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimised production build |
| `npm start` | Run the production build |
| `npm run lint` | Lint the codebase with ESLint |
| `npx prisma studio` | Browse and edit your data in a visual UI |

## ☁️ Deployment

This app is deployed on [Vercel](https://vercel.com/).

1. Push your code to GitHub.
2. Import the repository in Vercel.
3. Add your environment variables under **Project Settings → Environment Variables** (`DATABASE_URL` and your LLM API key).
4. Deploy. Vercel will build and host the app automatically on every push to `main`.

> **Note:** If you use Prisma on Vercel, make sure `prisma generate` runs during the build (for example, add `"postinstall": "prisma generate"` to your `package.json` scripts).

## 🗺️ Roadmap

- [ ] User authentication
- [ ] Task due dates and reminders
- [ ] Dark mode
- [ ] Note sharing and export (Markdown / PDF)
- [ ] Drag-and-drop organisation

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "Add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for details.

## 👤 Author

**Kopparthi Lokesh**

- GitHub: [@kopparthiLokesh](https://github.com/kopparthiLokesh)
- LinkedIn: <!-- TODO: add your LinkedIn URL -->

---

<div align="center">

If you found this project useful, please consider giving it a ⭐

</div>
