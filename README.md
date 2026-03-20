# Welcome to your Lovable project

TODO: Document your project here
# ⚖️ Verdict AI – Smart Legal Case Analysis Platform

🚀 **Verdict AI** is an AI-powered legal platform designed to simplify legal case analysis, prediction, and understanding. It allows users to input case details, explore legal insights, and understand complex legal terminology through an integrated Legal Glossary.

---

## 🌟 Features

* 🧾 **Case Input System**
  Add structured case details including facts, parties, and legal sections.

* ⚖️ **Legal Classification**
  Supports Civil, Criminal, Consumer, and Cyber cases.

* 📚 **Legal Glossary (Smart Search)**
  Search any legal term (e.g., *bail, FIR, jurisdiction*) and get instant, easy-to-understand meanings.

* 🧠 **AI-Based Insights (Planned / MVP)**
  Predict possible outcomes based on input case data.

* 🔍 **Smart Case Structuring**
  Organizes facts, arguments, and judgments in a clean format.

* 📊 **Dynamic Form Flow**
  Intelligent UI that adapts (e.g., hides IPC fields for civil cases).

---

## 📚 Legal Glossary Feature

The platform includes a built-in **Legal Glossary** that:

* 🔎 Enables real-time search for legal terms
* 📖 Provides simple, beginner-friendly definitions
* ⚡ Returns instant results
* 🎯 Helps non-legal users understand legal language

### 💡 Example

**Search:** `Bail`
**Result:** Temporary release of an accused person awaiting trial, sometimes on a security or bond.

---

## 🖥️ Tech Stack

**Frontend**

* HTML, CSS, JavaScript
* Vite / React (optional)

**Backend**

* FastAPI (Python)

**AI / ML (Planned)**

* Natural Language Processing (NLP)
* Case classification & prediction models

---

## 📂 Project Structure

```bash
Verdict-AI/
│── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
│── backend/
│   ├── main.py
│   ├── models/
│   └── routes/
│
│── data/
│   ├── sample_cases.json
│   └── legal_glossary.json
│
│── README.md
```

---

## 🧪 Sample Case Input

```json
{
  "case_title": "Anita Sharma vs Rajesh Sharma",
  "facts": [
    "Dispute over ancestral property",
    "Will presented by defendant",
    "Plaintiff challenged validity"
  ],
  "parties": [
    { "name": "Anita Sharma", "role": "Plaintiff" },
    { "name": "Rajesh Sharma", "role": "Defendant" }
  ],
  "law": "Hindu Succession Act",
  "jurisdiction": "District Civil Court, Bangalore",
  "judgment": "Equal distribution of property"
}
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/verdict-ai.git
cd verdict-ai
```

### 2️⃣ Setup Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3️⃣ Run Frontend

```bash
npm install
npm run dev
```

OR simply open `index.html` in your browser.

---

## 📸 UI Flow

* Case Input Form
* Party Details Section
* Legal Sections & Jurisdiction
* Legal Glossary Search
* AI Insights (Planned)

---

## 🚀 Future Enhancements

* 🤖 AI Judgment Prediction with confidence score
* 📊 Case Timeline Visualization
* 🔗 Integration with real legal databases / APIs
* 🧑‍⚖️ Lawyer consultation system
* 🌐 Multi-language legal glossary
* 🗣️ Voice-based legal search

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork this repository and submit a pull request.

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Adithya Nayak**
🔗 GitHub: https://github.com/Adithya2005-spec

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!

---
