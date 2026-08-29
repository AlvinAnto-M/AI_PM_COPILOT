# 🚀 AI Product Manager Copilot

<p align="center">
  <strong>Turn scattered customer feedback into actionable product decisions.</strong>
</p>

<p align="center">
  AI-powered feedback management, analysis, prioritization, and product planning — all in one place.
</p>

<p align="center">

![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge\&logo=react\&logoColor=white)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge\&logo=fastapi\&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge\&logo=python\&logoColor=white)

</p>

---

## 🌟 Overview

**AI Product Manager Copilot** is a web-based platform designed to help Product Managers **collect, organize, process, analyze, and manage customer feedback** from multiple sources.

Instead of manually going through scattered feedback, the platform provides a structured workflow that transforms raw customer data into **categorized insights, prioritized feature requests, and actionable product intelligence**.

### 🎯 The Goal

> **From customer feedback → to product insights → to better product decisions.**

The system is built using a **modular and scalable architecture**, allowing advanced AI capabilities and analytics to be added easily in the future.

---

# ✨ Key Features

<table>
<tr>
<td width="50%">

### 👤 User Management

* 🔐 Secure authentication
* 🏢 Project/workspace management
* 🛡️ Protected dashboard access
* 🔑 JWT-based authorization

</td>
<td width="50%">

### 📁 Multi-Format Upload

Import customer data from:

* 📄 CSV
* 📊 Excel
* 🗂️ JSON
* 📕 PDF

</td>
</tr>

<tr>
<td>

### ✅ Data Validation

Uploaded files are checked for:

* File format validity
* Empty files
* Duplicate uploads
* Schema consistency
* Data integrity

</td>
<td>

### 🧹 Data Cleaning

Automated preprocessing includes:

* Duplicate removal
* Missing-value handling
* Text normalization
* Special-character removal
* Tokenization
* Stop-word removal
* Lemmatization

</td>
</tr>

<tr>
<td>

### 🏷️ Feedback Categorization

Feedback can be organized into:

* 🐞 Bug Reports
* 💡 Feature Requests
* 🎨 UI/UX
* ⚡ Performance
* 🔒 Security
* 🎧 Support
* 📌 Others

</td>
<td>

### 📊 Interactive Dashboard

Visualize:

* 📤 Upload status
* 📁 File summaries
* 📋 Dataset overview
* 📊 Category distribution
* 📈 Project statistics

</td>
</tr>
</table>

---

# 🧠 Product Intelligence Workflow

The platform is designed to evolve from a simple feedback management system into an **AI-powered Product Management Copilot**.

```text
                    👥 CUSTOMER FEEDBACK
                           │
                           ▼
                  📥 DATA INGESTION
                           │
                           ▼
                  ✅ DATA VALIDATION
                           │
                           ▼
                🧹 DATA PREPROCESSING
                           │
                           ▼
               🏷️ FEEDBACK CLASSIFICATION
                           │
                           ▼
              🔗 REQUEST AGGREGATION
                           │
                           ▼
                🎯 FEATURE PRIORITIZATION
                           │
                           ▼
             🤖 AI PRODUCT ASSISTANT
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
          📄 PRDs      🗺️ ROADMAP     💡 INSIGHTS
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                  📊 PRODUCT DASHBOARD
```

---

# 🏗️ System Architecture

```text
                    👤 PRODUCT MANAGER
                           │
                           ▼
              ┌─────────────────────────┐
              │   React.js + Tailwind   │
              │        Frontend         │
              └────────────┬────────────┘
                           │
                     HTTP REST API
                           │
                           ▼
              ┌─────────────────────────┐
              │      FastAPI Backend    │
              │         Python          │
              └────────────┬────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
   🔐 Authentication   📁 Project Mgmt   📤 File Upload
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │   ✅ Validation Layer   │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │ 🧹 Preprocessing Layer  │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │ 🏷️ Categorization Engine│
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │     🍃 MongoDB Atlas    │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │   📊 Dashboard & Stats  │
              └─────────────────────────┘
```

---

# 🔄 Data Processing Pipeline

```text
📥 Customer Feedback
        │
        ▼
📁 Upload Files
CSV | Excel | JSON | PDF
        │
        ▼
✅ Validate Data
        │
        ▼
🧹 Clean & Preprocess
        │
        ▼
🏷️ Categorize Feedback
        │
        ▼
💾 Store Raw + Processed Data
        │
        ▼
📊 Generate Insights
        │
        ▼
🚀 Product Decisions
```

---

# 🛠️ Technology Stack

| Layer                  | Technologies             |
| :--------------------- | :----------------------- |
| 🎨 **Frontend**        | React.js, Tailwind CSS   |
| ⚙️ **Backend**         | FastAPI, Python          |
| 🍃 **Database**        | MongoDB Atlas            |
| 🔐 **Authentication**  | JWT                      |
| 📊 **Data Processing** | Pandas, NumPy            |
| 🧠 **NLP**             | NLTK, spaCy              |
| 🔗 **API**             | REST API                 |
| 🌿 **Version Control** | Git, GitHub              |
| ☁️ **Deployment**      | Vercel, Render / Railway |

---

# 📁 Project Structure

```text
AI-Product-Manager-Copilot/
│
├── 🎨 frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── assets/
│   └── App.jsx
│
├── ⚙️ backend/
│   ├── api/
│   ├── authentication/
│   ├── preprocessing/
│   ├── validation/
│   ├── uploads/
│   ├── models/
│   ├── database/
│   └── main.py
│
├── 📚 docs/
├── 📊 datasets/
├── 📄 README.md
└── 📦 requirements.txt
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/AI-Product-Manager-Copilot.git

cd AI-Product-Manager-Copilot
```

---

## 2️⃣ Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

---

## 3️⃣ Backend Setup

Create a Python virtual environment:

```bash
python -m venv venv
```

### 🪟 Windows

```bash
venv\Scripts\activate
```

### 🐧 Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn main:app --reload
```

Backend:

```text
http://localhost:8000
```

---

## 4️⃣ 🔐 Environment Variables

Create a `.env` file inside the `backend` directory:

```env
MONGODB_URI=your_mongodb_connection_string

DATABASE_NAME=ai_product_manager

JWT_SECRET=your_secret_key
```

> ⚠️ Never commit your `.env` file or expose secret credentials publicly.

---

## 5️⃣ 🍃 MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster
2. Create your database
3. Configure database access
4. Copy your MongoDB connection string
5. Add it to the `.env` file

---

# 🚀 Deployment

### 🎨 Frontend — Vercel

Build the application:

```bash
npm run build
```

Deploy the frontend using **Vercel**.

### ⚙️ Backend — Render / Railway

Start the application using:

```bash
uvicorn main:app
```

### 🍃 Database — MongoDB Atlas

The application uses **MongoDB Atlas** as the cloud database.

---

# 📋 Requirements

### 🎨 Frontend

* React.js
* Tailwind CSS
* React Router
* Axios

### ⚙️ Backend

* Python 3.10+
* FastAPI
* Uvicorn
* Pydantic
* Python-dotenv

### 🧠 Data & NLP

* Pandas
* NumPy
* NLTK
* spaCy

### 🗄️ Database

* MongoDB Atlas

### 🧰 Development

* Git
* GitHub
* VS Code

---

# 🗺️ Roadmap & Future Enhancements

The platform can be extended with advanced AI-powered product intelligence.

| Feature                         | Description                              |
| :------------------------------ | :--------------------------------------- |
| 😊 **Sentiment Analysis**       | Understand customer sentiment            |
| 📝 **Feedback Summarization**   | Generate concise feedback summaries      |
| 🔑 **Keyword Extraction**       | Identify recurring topics                |
| 🧠 **Named Entity Recognition** | Extract important entities               |
| 🎯 **Feature Prioritization**   | Rank features using demand & impact      |
| 🤖 **Recommendation Engine**    | Generate product recommendations         |
| 📊 **Advanced Analytics**       | Deeper product insights                  |
| 📄 **Executive Reports**        | Generate stakeholder-ready reports       |
| 🗺️ **Roadmap Generation**      | Convert priorities into roadmaps         |
| 🔗 **Jira Integration**         | Connect product decisions to development |
| 🐙 **GitHub Integration**       | Connect feedback with GitHub Issues      |

---

# 👤 User Stories

## 🔐 1. Secure Workspace Access

**As a Product Manager**, I want to securely log in and access my team's workspace so that my product data stays private and organized by project.

**Acceptance Criteria**

* Only authenticated users can access their workspace data.

---

## 📥 2. Multi-Source Data Ingestion

**As a Product Manager**, I want to import customer feedback, support tickets, and feature requests from multiple sources into one system so that I don't have to manually consolidate data from scattered channels.

**Acceptance Criteria**

* System successfully imports and stores data from at least two different source formats.

---

## 🏷️ 3. Automated Feedback Classification

**As a Product Manager**, I want incoming feedback and tickets to be automatically categorized by theme and sentiment so that I can quickly identify recurring pain points.

**Acceptance Criteria**

* Every imported entry receives a theme and sentiment label.

---

## 🔗 4. Feature Request Aggregation

**As a Product Manager**, I want similar feature requests from different sources grouped together so that I can understand actual demand instead of seeing scattered duplicate requests.

**Acceptance Criteria**

* Similar requests are grouped into a single cluster.
* Each cluster displays the request count.

---

## 🎯 5. AI-Driven Prioritization

**As a Product Manager**, I want the system to score and rank features by business impact and user demand so that I can make faster, data-backed prioritization decisions.

**Acceptance Criteria**

* Each feature receives a priority score.
* Features are displayed in ranked order.

---

## 📄 6. Automated PRD & User Story Generation

**As a Product Manager**, I want the assistant to draft PRDs and user stories from prioritized feature data so that I can accelerate documentation and reduce manual writing effort.

**Acceptance Criteria**

* A draft PRD with user stories can be generated for any selected feature.

---

## 🗺️ 7. Roadmap Visualization

**As a Product Manager**, I want prioritized features displayed on a visual roadmap timeline so that I can communicate plans clearly with stakeholders and engineering teams.

**Acceptance Criteria**

* Prioritized features appear correctly on a timeline.

---

## 💬 8. Conversational Insights Assistant

**As a Product Manager**, I want to ask the copilot natural-language questions about my product data so that I can get instant answers without manually digging through dashboards or reports.

**Acceptance Criteria**

* The assistant returns a relevant answer to a natural-language query.

---

# 🤝 Contributing

Contributions are welcome! 🎉

### 1️⃣ Fork the repository

### 2️⃣ Create a feature branch

```bash
git checkout -b feature/feature-name
```

### 3️⃣ Make your changes

### 4️⃣ Commit your changes

```bash
git commit -m "Add feature"
```

### 5️⃣ Push your branch

```bash
git push origin feature/feature-name
```

### 6️⃣ Open a Pull Request 🚀

---

# 🙌 Acknowledgments

Built with the help of amazing open-source technologies:

<p align="center">

**React.js** • **Tailwind CSS** • **FastAPI** • **MongoDB Atlas** • **Pandas** • **NumPy** • **NLTK** • **spaCy** • **Git** • **GitHub**

</p>

---

<p align="center">

### 🚀 Built to help Product Managers build better products, faster.

⭐ **If you find this project useful, consider giving it a star!**

</p>
