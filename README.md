# AI Product Manager Copilot

> An AI-powered product management platform that transforms customer feedback into actionable product insights, priorities, roadmaps, product strategy, and requirements.

## Overview

**AI Product Manager Copilot** is a full-stack application designed to assist Product Managers in converting large volumes of customer feedback into structured, evidence-based product decisions.

The platform combines customer-feedback analytics, machine-learning-based text analysis, deterministic prioritization, roadmap planning, and Generative AI capabilities in one workflow.

Instead of manually reading feedback and converting it into product artifacts, a Product Manager can upload feedback, analyze recurring issues, prioritize them, generate a roadmap, and create product-management documents from the resulting insights.

### Core workflow

```text
Customer Feedback
       |
       v
Data Ingestion & Preprocessing
       |
       v
Issue Clustering & Theme Identification
       |
       v
Sentiment & Priority Analysis
       |
       v
Feature Prioritization
(RICE)
       |
       v
Product Roadmap
       |
       +------------------+-------------------+
       |                  |                   |
       v                  v                   v
      PRD          User Stories &       Product Strategy
                   Acceptance Criteria      Reports
       |                  |                   |
       +------------------+-------------------+
                          |
                          v
                 AI Product Manager
                      Copilot
```

---

## Problem Statement

Product teams receive large volumes of unstructured customer feedback from different sources. Manually identifying recurring issues, understanding customer sentiment, prioritizing product problems, preparing requirements, and planning a roadmap is time-consuming and difficult to scale.

The project addresses this challenge by providing a unified platform that converts raw customer feedback into structured product insights and actionable product-management outputs.

---

## Project Objectives

- Automate customer-feedback ingestion and preprocessing.
- Identify recurring customer issues and themes.
- Group related feedback into issue clusters.
- Analyze customer sentiment.
- Calculate issue priority using feedback-driven signals.
- Rank product initiatives using RICE-based prioritization.
- Generate evidence-based product roadmaps.
- Generate Product Requirement Documents (PRDs).
- Generate user stories and acceptance criteria.
- Generate cluster-specific product strategy reports.
- Provide a conversational AI Product Manager Copilot.
- Present the results through an interactive web dashboard.

---

## Key Features

### 1. Customer Feedback Upload & Analysis

The application accepts customer-feedback datasets and prepares them for downstream analysis.

The analysis pipeline includes:

- Data loading and validation
- Text preprocessing and cleaning
- Feedback categorization
- Issue clustering
- Theme extraction
- Trend analysis
- Sentiment analysis
- Priority analysis

---

### 2. Issue Clustering & Themes

Related customer feedback is grouped into clusters representing common product issues.

The dashboard exposes:

- Cluster ID
- Cluster theme
- Feedback volume
- Cluster-level insights

This allows Product Managers to move from individual comments to recurring customer problems.

---

### 3. Sentiment Analysis

The backend uses the Hugging Face Transformers pipeline with:

```text
cardiffnlp/twitter-roberta-base-sentiment-latest
```

The model provides sentiment signals that contribute to the project's priority analysis.

---

### 4. Priority Analysis

The priority engine combines multiple signals:

- Sentiment
- Critical keywords
- Feedback frequency
- Escalation signals

Priority levels are classified as:

```text
High
Medium
Low
```

This helps identify issues requiring greater product attention.

---

### 5. Feature Prioritization

The application provides deterministic, data-driven feature prioritization.

It calculates:

- Reach
- Impact
- Confidence
- Effort
- RICE Score

The RICE formula used is:

```text
RICE = (Reach × Impact × Confidence) / Effort
```

Features are ranked by their resulting RICE scores.

Importantly, RICE calculation is implemented in the backend rather than delegated to the LLM.

---

### 6. Product Roadmap

Prioritized initiatives are converted into an evidence-based roadmap.

The roadmap engine provides:

- Initiative
- Feedback count
- Priority distribution
- Priority score
- RICE score
- Escalation count
- Roadmap score
- Recommended milestone
- Timeframe
- Reason
- Rank

The roadmap organizes initiatives into planning horizons such as:

- Immediate
- Near Term
- Later

---

### 7. PRD Generator

The PRD module generates a Product Requirement Document for a selected customer issue cluster.

The workflow is:

```text
Select Cluster
      |
      v
Retrieve Cluster Evidence
      |
      v
Build AI Context
      |
      v
Gemini
      |
      v
Structured PRD
```

The generated PRD is based on customer-feedback evidence rather than being generated as an unrelated generic document.

---

### 8. User Stories & Acceptance Criteria

The system converts identified customer problems into structured product requirements.

It generates:

- User stories
- Testable acceptance criteria

The intended format includes:

```text
As a [user],
I want [capability],
so that [benefit].
```

Acceptance criteria are expressed as testable conditions, including Given/When/Then-style statements where appropriate.

---

### 9. Product Strategy Reports

Product Strategy Reports are generated for individual issue clusters.

The strategy module considers available evidence such as:

- Cluster theme
- Feedback volume
- Priority distribution
- Escalations
- Priority score
- RICE score
- Reach
- Impact
- Confidence
- Effort
- Important feedback patterns
- Customer feedback

The generated report includes:

1. Executive Summary
2. Problem Definition
3. Customer Pain Points
4. Customer Evidence
5. Strategic Importance
6. Product Goal
7. Strategic Objectives
8. Recommended Product Strategy
9. Key Product Initiatives
10. Success Metrics
11. Risks & Considerations
12. Expected Customer Impact
13. Recommended Next Steps

The next-step flow connects naturally to the rest of the product-management workflow:

```text
Strategy
   |
   v
PRD
   |
   v
User Stories
   |
   v
Acceptance Criteria
   |
   v
Prioritization
   |
   v
Roadmap
```

---

## AI Product Manager Copilot

The Copilot provides a natural-language interface for interacting with analyzed product data.

Users can ask questions about:

- Customer feedback
- Major themes
- Issue clusters
- Trends
- High-priority issues
- Feature prioritization
- Product recommendations
- PRDs
- User stories
- Roadmaps
- Product strategy

### Intent Detection

The Copilot uses an intent-detection layer before constructing the final AI request.

This allows product questions to be handled according to their purpose, including intents such as:

- Summary
- High priority
- PRD
- User story
- Acceptance criteria
- Priority
- Roadmap
- Recommendation
- Cluster
- General

### Dataset-Aware Context

The Copilot builds context from the analyzed dataset before sending a product question to the Generative AI model.

It is instructed to:

- Answer the exact question asked.
- Avoid automatically returning a full dataset summary.
- Avoid unrelated information.
- Use available project data as evidence.
- Clearly state when sufficient evidence is unavailable.
- Avoid inventing facts, features, metrics, or customer problems.

### Greeting Handling

Simple greetings such as `Hi`, `Hello`, and `Hey` are handled locally so they do not unnecessarily trigger dataset loading and AI analysis.

---

## AI & Machine Learning

### Large Language Model

The project uses:

**Google Gemini 2.5 Flash**

It is used for Generative AI capabilities including:

- AI Product Manager Copilot
- PRD generation
- User story generation
- Acceptance criteria generation
- Product strategy report generation

### Sentiment Model

The project uses:

**CardiffNLP Twitter-RoBERTa Sentiment Latest**

Model identifier:

```text
cardiffnlp/twitter-roberta-base-sentiment-latest
```

It is used for customer-feedback sentiment analysis.

### Other ML / NLP Components

The backend dependencies include:

- scikit-learn
- sentence-transformers
- KeyBERT
- NLTK
- pandas
- NumPy
- joblib

These support the project's preprocessing, NLP, clustering, keyword/theme, and analytical workflows.

---

## System Architecture

```text
                    +----------------------+
                    |      Product Manager |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |    Next.js Frontend  |
                    | React + TypeScript   |
                    | Tailwind CSS         |
                    +----------+-----------+
                               |
                         REST / Axios
                               |
                               v
                    +----------------------+
                    |    FastAPI Backend   |
                    +----------+-----------+
                               |
        +----------------------+----------------------+
        |                      |                      |
        v                      v                      v
+---------------+      +---------------+      +---------------+
| Data Analysis |      | Product Mgmt  |      | Generative AI|
|               |      |               |      |               |
| Preprocessing |      | Prioritization|      | Gemini 2.5    |
| Clustering    |      | Roadmap       |      | Flash         |
| Themes        |      | PRD           |      +---------------+
| Sentiment     |      | User Stories  |
| Priority      |      | Strategy      |
| Trends        |      | Copilot       |
+---------------+      +---------------+
```

---

## Technology Stack

### Frontend

- Next.js `16.2.12`
- React `19.2.4`
- TypeScript
- Tailwind CSS
- Axios
- Recharts
- Lucide React
- React Markdown
- Remark GFM

### Backend

- Python
- FastAPI
- Uvicorn
- Pandas
- NumPy
- scikit-learn
- Sentence Transformers
- KeyBERT
- NLTK
- OpenPyXL
- Joblib
- python-multipart

### AI / NLP

- Google Gemini 2.5 Flash
- Google Generative AI SDK
- Google GenAI SDK
- Hugging Face Transformers
- CardiffNLP Twitter-RoBERTa sentiment model

---

## Project Structure

```text
AI_PM_COPILOT/
|
+-- backend/
|   |
|   +-- app.py
|   +-- config.py
|   +-- requirements.txt
|   |
|   +-- routes/
|   |   +-- analyze.py
|   |   +-- clusters.py
|   |   +-- copilot.py
|   |   +-- dashboard.py
|   |   +-- prd.py
|   |   +-- prioritization.py
|   |   +-- roadmap.py
|   |   +-- strategy.py
|   |   +-- user_stories.py
|   |
|   +-- services/
|       +-- analyzer.py
|       +-- clustering.py
|       +-- context_builder.py
|       +-- copilot.py
|       +-- embedding.py
|       +-- intent_detector.py
|       +-- milestone_engine.py
|       +-- preprocessing.py
|       +-- prioritization.py
|       +-- priority.py
|       +-- prd_generator.py
|       +-- storage.py
|       +-- strategy_generator.py
|       +-- themes.py
|       +-- trend.py
|       +-- user_story_generator.py
|
+-- frontend/
|   |
|   +-- app/
|   |   +-- page.tsx
|   |   +-- prd-generator/
|   |   +-- prioritization/
|   |   +-- roadmap/
|   |   +-- strategy/
|   |   +-- user-stories/
|   |
|   +-- components/
|   |   +-- ai-copilot/
|   |   +-- product-modules/
|   |   +-- roadmap/
|   |   +-- ClusterList.tsx
|   |   +-- DetailPanel.tsx
|   |   +-- Recommendations.tsx
|   |   +-- SummaryCards.tsx
|   |   +-- TrendAnalysis.tsx
|   |   +-- UploadSection.tsx
|   |
|   +-- lib/
|       +-- api.ts
|       +-- copilot.ts
|       +-- prd.ts
|       +-- prioritization.ts
|       +-- roadmap.ts
|       +-- strategy.ts
|
+-- Datasets/
|   +-- AI_PM_Copilot_1000rows_15clusters.xlsx
|   +-- AI_PM_Copilot_2000rows_15clusters.xlsx
|   +-- AI_PM_Copilot_clustered_dataset.xlsx
|
+-- LICENSE
+-- README.md
```

---

## Backend API Modules

The FastAPI backend registers the following route modules:

| Module | Purpose |
|---|---|
| `/analyze` | Upload/analyze customer feedback |
| `/dashboard` | Dashboard-level analysis data |
| `/clusters` | Cluster and issue information |
| `/copilot` | AI Product Manager Copilot |
| `/prd` | PRD generation |
| `/user_stories` | User stories and acceptance criteria |
| `/prioritization` | Feature prioritization |
| `/roadmap` | Product roadmap |
| `/strategy` | Product strategy reports |

The backend also provides:

```text
GET /
GET /health
```

The health endpoint returns:

```json
{
  "status": "OK"
}
```

---

## Prerequisites

Make sure the following are installed:

- Python 3.x
- Node.js
- npm
- Git

A Google Gemini API key is required for the Generative AI features.

---

## Environment Variables

Create a `.env` file inside the backend directory:

```env
GEMINI_API_KEY=your_gemini_api_key
```

**Never commit your real API key to GitHub.**

The repository should keep secrets in `.env`, while `.gitignore` should prevent them from being committed.

---

## Backend Setup

Open a terminal in the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn app:app --reload
```

The backend runs at:

```text
http://127.0.0.1:8000
```

Health check:

```text
http://127.0.0.1:8000/health
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:3000
```

---

## Running the Complete Application

Run the backend and frontend in separate terminals.

### Terminal 1

```bash
cd backend
venv\Scripts\activate
uvicorn app:app --reload
```

### Terminal 2

```bash
cd frontend
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## Typical Usage

### Step 1 — Upload Feedback

Upload a customer-feedback dataset through the dashboard.

### Step 2 — Analyze

Run the analysis pipeline to generate:

- Cleaned feedback
- Clusters
- Themes
- Trends
- Sentiment
- Priority information

### Step 3 — Explore Clusters

Review recurring customer problems and their supporting feedback.

### Step 4 — Prioritize

Use the Feature Prioritization module to compare initiatives using RICE.

### Step 5 — Build the Roadmap

Use the Product Roadmap module to organize prioritized initiatives into milestones.

### Step 6 — Generate Product Artifacts

For relevant clusters, generate:

- PRD
- User Stories
- Acceptance Criteria
- Product Strategy Report

### Step 7 — Ask the Copilot

Use the AI Product Manager Copilot to ask product-related questions using natural language.

---

## Example Copilot Questions

```text
What are the highest priority customer issues?

What are the major customer pain points?

Which features should we prioritize?

Summarize the most important feedback themes.

What issues should be included in the immediate roadmap?

Generate a PRD for the selected issue.

What user stories can be created for this problem?

What acceptance criteria should be used?

What product strategy should we follow for this cluster?
```

---

## Product Management Workflow

The platform connects multiple product-management activities into one continuous workflow:

```text
                 CUSTOMER FEEDBACK
                        |
                        v
              +-------------------+
              |   ANALYZE DATA    |
              +---------+---------+
                        |
                        v
              +-------------------+
              | CLUSTERS & THEMES |
              +---------+---------+
                        |
                        v
              +-------------------+
              | SENTIMENT /       |
              | PRIORITY ANALYSIS |
              +---------+---------+
                        |
                        v
              +-------------------+
              | RICE PRIORITIZATION|
              +---------+---------+
                        |
                        v
              +-------------------+
              | PRODUCT ROADMAP   |
              +---------+---------+
                        |
           +------------+------------+
           |            |            |
           v            v            v
         PRD      USER STORIES    STRATEGY
           |            |            |
           +------------+------------+
                        |
                        v
              PRODUCT DECISIONS
                        |
                        v
                AI COPILOT
```

---

## Milestone Structure

The project follows an Agile milestone-based development approach.

### Milestone 1 — Foundation & Feedback Processing

- System foundation
- Feedback ingestion
- Data validation
- Cleaning
- Preprocessing
- Categorization

### Milestone 2 — Feedback Intelligence

- Theme identification
- Pain-point analysis
- Issue clustering
- Feature grouping
- Trend analysis
- Dashboard insights

### Milestone 3 — AI Product Management

- PRD generation
- User story generation
- Acceptance criteria
- Feature prioritization
- RICE scoring
- AI Product Manager Copilot

### Milestone 4 — Product Planning & Strategy

- Product roadmap
- Milestone recommendations
- Executive/product strategy reports
- End-to-end testing
- AI output evaluation
- Final integration and presentation

---

## Design Principles

### Evidence-Based

Product recommendations should be grounded in analyzed customer feedback whenever the available evidence supports the decision.

### Modular

Backend functionality is separated into route and service modules, while frontend functionality is organized into reusable components and feature pages.

### AI-Assisted, Not AI-Dependent

Deterministic calculations such as RICE prioritization are handled by backend logic, while Generative AI is used where natural-language reasoning and document generation are appropriate.

### Product-Manager Focused

The system is designed around practical Product Management activities rather than being only a generic chatbot.

---

## Current Project Scope

The current repository contains the implemented workflow for:

- Customer feedback analysis
- Clustering
- Themes
- Trends
- Sentiment analysis
- Priority analysis
- Feature prioritization
- RICE scoring
- Product roadmap
- PRD generation
- User stories
- Acceptance criteria
- Product strategy reports
- AI Product Manager Copilot
- Interactive dashboard

---

## Future Enhancements

Potential future improvements include:

- Support for additional feedback sources
- Persistent database storage
- Authentication and role-based access
- Advanced feedback deduplication
- More configurable prioritization frameworks
- Roadmap editing and collaboration
- Export of PRDs and strategy reports
- Historical feedback trend comparison
- Model evaluation and monitoring
- Production deployment
- Automated feedback ingestion from external platforms

---

## Security

- Store API credentials in environment variables.
- Never commit `.env` files containing secrets.
- Rotate exposed API keys immediately.
- Configure production CORS origins explicitly.
- Use appropriate authentication and authorization before production deployment.

---

## License

This project is distributed under the license included in the repository's `LICENSE` file.

---

## Project

**AI Product Manager Copilot**

An AI-assisted product management platform for turning customer feedback into actionable product decisions.

**Technology:** Next.js + React + TypeScript + FastAPI + Python + Gemini + Transformer-based NLP
