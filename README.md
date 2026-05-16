# dev-thread 🧵 | Full-Stack Reddit Clone MVP

A high-performance, responsive Minimum Viable Product (MVP) clone of Reddit designed for developers to share text posts, media links, build custom communities, and engage in real-time discussions.

---

## 📌 Introduction
**dev-thread** is a full-stack, forum-style social platform engineered to mimic core community-driven aggregates like Reddit. The platform bridges structured relational content with a modern, fast, single-page application user experience. It allows authenticated individuals to curate specialized communities, publish versatile micro-content, cast programmatic votes, and manage interactive conversational comment threads.

---

## 💡 Use Cases
* **Developer Knowledge Aggregator:** A dedicated hub where engineers can post coding tips, ask questions, and share architectural resources inside curated niches like `r/coding-tips`.
* **Asynchronous Team Discussions:** Ideal for closed-group or open-source community forums requiring structured, threaded topic tracking rather than noisy chat timelines.
* **Content Curation & Upvoting:** Crowdsourcing high-value learning materials where the community dynamically determines content visibility via real-time score optimization.

---

## 🚀 Industry Value
Building a platform with this level of structural architecture demonstrates competency in handling production-grade patterns:
1. **Relational Data Complexity:** Managing deeply nested self-referential relationships (Users ↔ Posts ↔ Comments ↔ Votes ↔ Communities) at scale using a relational database engine.
2. **State Optimization:** Showcasing seamless state synchronization between local React components and persistent server-side storage without stale data overhead.
3. **Secure Identity Provisioning:** Implementing standard token-based session guardrails across API entry points to prevent unauthorized network actions.

---

## 👥 User Roles & Permissions

| Role | Permissions |
| :--- | :--- |
| **Guest / Unauthenticated User** | Browse global feeds, visit unique community sub-pages, expand comment sections, read existing text/media posts. |
| **Authenticated Member** | All Guest actions, plus: Create custom communities, publish new posts with optional image links, upvote/downvote content, submit comments, and delete their own historical data. |

---

## 💻 Tech Stack & Rationale

### **Frontend**
* **Next.js (App Router):** Chosen for its exceptional file-based layouts, optimized client-side transition management, and performance ecosystem.
* **Tailwind CSS:** Provides low-level utility styling enabling rapid curation of a dense, scannable user interface mimicking standard layout constraints.
* **Lucide React:** Used for a clean, consistent, and lightweight vector iconography suite across interactive states.

### **Backend & Database**
* **Node.js & Express:** Lightweight runtime environment rendering ultra-fast HTTP request-response loops with granular middleware control.
* **PostgreSQL:** Selected over NoSQL alternatives because forum content models inherently demand strict structural consistency, foreign key constraints, and transactional integrity.
* **Prisma ORM:** Provides an absolute type-safe data modeling mapping layer, streamlining complex SQL joins and multi-nested model inclusions into safe programmatic calls.
* **Supabase:** Leveraged for enterprise-grade, cloud-hosted relational database computing with seamless network connection connection pooling.

---

## ⚙️ Technologies Explained

* **NextAuth.js:** Handles secure multi-provider session management, storing secure user tokens to manage layout rendering guards on the frontend.
* **TypeScript:** Mitigates production bugs by enforcing strict structural contract types between API payload expectations and local data rendering states.
* **Date-fns:** Programmatically calculates dynamic, relative chronological intervals (e.g., *"3 hours ago"*) across variable post creation timestamps.

---

## 📊 System Architecture & Data Flow

```text
[ Client Frontend (Next.js) ]
            │
            ▼ (HTTP Requests: GET/POST/PATCH/DELETE)
 [ Express Backend API (Node.js) ]
            │
            ▼ (Type-Safe Query Layer via Prisma)
   [ Supabase Cloud Instance (PostgreSQL) ]