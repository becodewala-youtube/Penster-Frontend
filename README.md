

# 🚀 PitchMint — AI-Powered Startup Idea Validator & Pitch Deck Generator (SaaS)

**Validate, Visualize, Venture.**
PitchMint is an AI-powered SaaS platform that empowers entrepreneurs to validate their startup ideas, generate investor-ready pitch decks, simulate investor Q\&A, and analyze competitors using Google's Gemini API.

---

## 🧩 Features

* ✅ **Startup Idea Validator** – Evaluate startup ideas with AI-driven feedback.
* 📊 **Pitch Deck Generator** – Auto-create professional 10-slide editable pitch decks.
* 🧠 **Lean Canvas Editor** – Interactive drag-and-drop Lean Business Canvas.
* 📌 **Competitor Analysis Generator** – Get AI-generated SWOT analysis of potential competitors.
* 🎤 **Investor Pitch Simulator** – Simulate investor Q\&A sessions and receive AI feedback.
* 🔐 **User Authentication** – Secure JWT-based login with cookie handling.
* 💳 **Subscription Plans** – Free vs Pro plans with Stripe integration.
* 🌙 **Dark/Light Mode** – Theme toggling with Context API & localStorage.
* 📁 **Personal Dashboards** – Access saved ideas, decks, and canvases.

---

## 🖥️ Frontend Tech Stack

* **React.js** (Vite or CRA)
* **Tailwind CSS** – Responsive, with dark/light mode support
* **React Router DOM** – Routing
* **Redux Toolkit** – Auth, subscription, deck & idea state
* **Axios** – API integration
* **Context API** – Theme toggling
* **Framer Motion** – Page/component animations
* **Stripe Elements** – Payment UI

---

## 📄 Pages

| Page                     | Description                                       |
| ------------------------ | ------------------------------------------------- |
| Landing Page             | Product intro, tagline, pricing, CTAs             |
| Signup/Login             | Email/password authentication                     |
| Dashboard                | Personalized summary of ideas, decks, and actions |
| Idea Validator           | Submit idea → AI feedback via Gemini              |
| Validation Results       | Scores, suggestions, and deck generation          |
| Pitch Deck Generator     | Editable, exportable pitch decks                  |
| Competitor Analysis      | SWOT comparison of AI-identified competitors      |
| Investor Pitch Simulator | Simulated investor Q\&A with feedback             |
| My Pitch Decks           | List, edit, download decks (PDF for Pro users)    |
| Business Canvas          |  Lean Canvas tool                    |
| Pricing Page             | Plan comparison with Stripe checkout              |


---

## 🔌 API Endpoints (Frontend → Backend)

| Method | Endpoint                      | Purpose                     |
| ------ | ----------------------------- | --------------------------- |
| POST   | `/api/auth/register`          | Register user               |
| POST   | `/api/auth/login`             | Login user                  |
| GET    | `/api/user/dashboard`         | Get dashboard data          |
| POST   | `/api/idea/validate`          | Validate idea using Gemini  |
| GET    | `/api/idea/:id`               | Retrieve validation results |
| POST   | `/api/pitchdeck/generate`     | Generate pitch deck         |
| GET    | `/api/pitchdeck/user`         | Get all pitch decks         |
| PATCH  | `/api/pitchdeck/:id`          | Edit pitch deck             |
| POST   | `/api/canvas/save`            | Save business canvas        |
| GET    | `/api/canvas/user`            | Get canvas data             |
| POST   | `/api/competitor/analyze`     | Generate competitor SWOT    |
| POST   | `/api/pitch/simulate`         | Simulate investor Q\&A      |
| POST   | `/api/stripe/create-checkout` | Start Stripe checkout       |
| GET    | `/api/stripe/subscription`    | Subscription details        |

---

## 🧠 Backend Tech Stack

* **Node.js + Express.js**
* **MongoDB + Mongoose**
* **Google Gemini API** – AI processing
* **Stripe** – Payment gateway
* **JWT** – Secure user authentication
* **Bcrypt.js** – Hashing passwords
* **dotenv** – Secure environment variables
* **Cookie-Parser** – Token handling middleware

---


### APIs

* [Google Gemini API](https://ai.google.dev)
* [Stripe API](https://stripe.com)




## 🔄 Workflow

1. **User registers or logs in**
2. Accesses **dashboard** for saved ideas and decks
3. Submits **startup idea** → Gemini returns validation
4. User views **results**, feedback, and generates pitch deck
5. Uses **competitor analysis** and **pitch simulator**
6. Builds **Lean Canvas**, saves data to DB
7. Upgrades via **Stripe checkout** for Pro access
8. Views/downloads decks  anytime

---

## 🔮 Future Enhancements

* 👥 Co-founder/team collaboration
* 🌐 Language translation/localization
* 📱 Mobile App (React Native)
* 🧾 Auto-generated business plans & forecasts
* 🎨 GPT-4 Vision-based pitch deck image creation
* 📊 Analytics dashboard for startup insights

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

* [Google Gemini API](https://ai.google.dev)
* [Stripe](https://stripe.com)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
* [Tailwind CSS](https://tailwindcss.com)

---

