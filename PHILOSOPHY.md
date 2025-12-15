# Folio Philosophy

## Core Idea

**Folio puts Claude in your folder with you.**

The folder is your shared workspace. Files are how you and Claude collaborate—not hidden state, not proprietary formats, just files you can both see and edit. Like multiplayer for your thinking.

## The Vision: Agentic Workspace for Knowledge Workers

Folio targets the space between consumer note-taking apps (Obsidian, Notion) and developer tools (VS Code, Cursor).

**The ideal user:**

- Works with documents, notes, PDFs, research, media
- Knows files, folders, browsers
- Has used AI chat interfaces (ChatGPT, Claude)
- Wants more than a note-taking app, but doesn't need (or want) a full IDE
- Wants to collaborate with AI without learning to code

Software engineers are already used to this with tools like Cursor. Folio brings that experience to knowledge workers.

## How It Works

**Claude Code does the heavy lifting.** We use the Claude Code extension for AI integration—Anthropic handles making that experience great.

**The collaboration is visible.** You chat with Claude in the sidebar. Claude reads and edits files in your folder. Everything happens in plain sight. Files are the edge objects that let you and Claude work together, synchronously in chat or asynchronously through the file system.

**The workspace is real.** Your files stay yours. No proprietary database, no lock-in. Just a folder and an AI partner who can work in it with you.

## Design Principles

### 1. Progressive Disclosure

Start simple. Reveal power gradually.

You can begin by just chatting and editing documents. Over time you might discover search, multi-file operations, customization. The complexity is there if you need it, invisible if you don't.

### 2. Files Are Real

No proprietary formats. Your documents are yours, readable by any tool, portable to anywhere.

The folder is the source of truth. Folio is just a nice place to work with it.

### 3. AI as Partner, Not Oracle

Claude works *alongside* you in the same environment, not as a magic black box that does things you can't see.

You can see what Claude sees. You can edit what Claude writes. You're collaborating, not delegating.

### 4. Self-Hosting

We build Folio in Folio. This constraint keeps us honest about the UX and ensures the tool actually serves its purpose.

If it's not good enough for us to use every day, it's not good enough to ship.

### 5. Accessibility Over Purity

Serve knowledge workers first, not developer aesthetics.

Sometimes the "right" technical solution isn't the right user experience. We optimize for people who work with ideas and documents, not for architectural elegance.

## Why Start Minimal?

This version of Folio is intentionally scoped down—a test run of the core concept.

**What we're learning:**

- Does the "folder as workspace" model actually work?
- Can knowledge workers adopt this without becoming programmers?
- What's the minimum viable agentic workspace?

**What we're not doing (yet):**

- Custom AI agents with different personas
- Local model support (WebLLM, etc.)
- Complex automation or scripting
- Heavy IDE features

We're building the smallest version of an agentic workspace that could possibly work. Once we validate the concept, we can expand.

## The Bigger Picture

Knowledge workers deserve better tools for thinking. Note-taking apps are too constraining. Developer tools are too intimidating.

Folio aims to be the thing in between: powerful enough to grow with you, simple enough to start today, transparent enough to trust.

**The folder is your canvas. Claude is your collaborator. Folio is where you work together.**

---

*This document captures the vision. The codebase is the conversation. See [README.md](README.md) for what Folio is today, [CONTRIBUTING.md](CONTRIBUTING.md) for how to help build what it could be tomorrow.*
