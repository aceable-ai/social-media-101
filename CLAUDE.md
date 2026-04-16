# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An interactive, single-page web tutorial called "Social Media 101: Claude Code for Social Teams" — a Panic! At The Terminal production by Aceable. Teaches social media teams (content creators, schedulers, community managers, analysts) how to use Claude Code for captions, AI video workflows, community management, and analytics.

Sibling course to **Vibe Coding 101** (https://vibe-coding-101-production.up.railway.app). Same design system, different audience.

## Architecture

Three static files, no frameworks, no build tools, no dependencies:

- **index.html** — All content and semantic structure (7 course sections + resources)
- **styles.css** — Token-based design system using CSS custom properties, all component styles, responsive breakpoints (shared with Vibe Coding 101)
- **script.js** — Vanilla JS in an IIFE: progress bar, sidebar nav, typewriter animation, CSV download, copy buttons, scroll animations (shared with Vibe Coding 101)
- **Staticfile** — Railway/Caddy deployment config (`root: .`)

## Development

Open `index.html` directly in a browser — no server or build step required. For Railway deployment, it serves via Caddy on port 8080.

## Design System

Aceable-branded with tokens defined as CSS custom properties in `:root`:
- **Colors**: Teal primary (`#0C5F6B`), cyan accent (`#12BDCD`), pink CTA (`#DB306A`), dark navy text (`#21333F`)
- **Fonts**: Nunito Sans (body, loaded from Google Fonts), JetBrains Mono (terminal blocks)
- **Signature pattern**: Offset box-shadows (`5px 5px 0`) on cards, buttons, and terminal blocks — this is the Aceable brand's distinctive visual element

## Key Conventions

- The `.section--dark` class requires explicit light-colored overrides for all text elements (p, strong, em, code, callout text) — the dark background doesn't inherit readable colors automatically
- Terminal blocks use a macOS-style header with traffic light dots and a title bar
- The typewriter animation (`#typewriter-demo`) is triggered by IntersectionObserver and plays once
- Jargon terms use `<span class="jargon" data-definition="...">` for CSS-only tooltips
- The CSV download reads `.glossary-item` elements dynamically — new glossary cards are automatically included
- The sidebar nav tracks active sections via IntersectionObserver with `rootMargin: '-20% 0px -60% 0px'`

## Content Sections

1. **Welcome** — Hero section, "Social Media 101" title, what you'll learn
2. **The Terminal** — Universal intro, same as Vibe Coding 101
3. **Getting Started** — Claude Code install + first social-media-flavored example
4. **Jargon Decoder** — Tech terms + social-specific terms (Hook, UGC, B-roll, SRT, Brand Voice, etc.)
5. **Real-World Social Workflows** — 5 workflows: platform captions, hashtag research, AI video pipeline, comment reply batch, weekly recap tool builder
6. **Tips, Tricks & Gotchas** — Universal tips tuned with social examples
7. **Try It Yourself** — Exercise: build a Content Starter Kit (brand voice, hashtag library, caption template)

## Deployment

- **Hosting**: Railway (static site via Railpack/Caddy)
- Push to `main` to deploy
