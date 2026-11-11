# PetPal — Pet Care Companion

A web application for organizing pet profiles and everyday care routines. PetPal brings pet information, reminders, a calendar, weather context, and optional AI-generated care guidance into one interface.

> **Project status:** Academic/personal portfolio project. Review the limitations and security notes below before deploying it publicly.

## Features

- **Pet profiles:** Create and edit profiles with species, breed, sex, date of birth, weight, notes, and photos.
- **Care reminders:** Create reminders for feeding, medication, vaccination, grooming, walks, veterinary visits, and other tasks. Set a date, time, and recurrence.
- **Reminder alarms:** In-app alarm handling with sound, volume, vibration, snooze, and Do Not Disturb settings.
- **Calendar:** View reminders by date and browse monthly schedules.
- **Weather context:** Retrieve forecast information from Open-Meteo using browser geolocation, with a fallback location if permission is denied.
- **AI care assistant:** Optional Gemini-powered responses and suggested care schedules. AI guidance is informational and is not a substitute for a qualified veterinarian.
- **Language and appearance:** English and Simplified Chinese interface resources, plus theme preferences.

## Technology Stack

- React 19
- TypeScript
- Vite 6
- React Router
- Tailwind CSS (utility-class styling)
- i18next and react-i18next
- Google Gen AI SDK
- date-fns
- Lucide React

## Run Locally

### Requirements

- Node.js (LTS recommended)
- npm

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/alichoukrane/pet-app.git
   cd pet-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL printed by Vite (the project is configured to use port 3000).

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the production bundle |
| `npm run preview` | Preview the production build locally |

## Data Storage and Privacy

Pet and reminder data are stored in the browser using `localStorage`. This means the data is associated with the browser/device in use; this repository does not currently provide a cloud database or account synchronization.

The calendar can request browser location permission to retrieve local weather information. If location access is denied, the current implementation uses a fallback forecast location.

## Important Security Note — Gemini API Key

The current Vite configuration injects `GEMINI_API_KEY` into the frontend bundle through `process.env.API_KEY`. **A key used this way can be extracted by anyone who can access the deployed application.** Do not use a private, unrestricted, or production Gemini API key in a public frontend deployment.

Before deploying with AI features enabled, move Gemini requests to a server-side API or serverless function and keep the key in server-side environment variables. Until that change is made, use only a disposable, restricted test key and rotate it if it has ever been exposed.

For local development, the Vite configuration reads `GEMINI_API_KEY` from the local environment. Keep local environment files out of Git; never commit API keys or secrets.

## Project Structure

```text
pet-app/
├── components/       # Reusable UI components
├── context/          # Pet and theme state providers
├── data/             # Local trainer/demo data
├── i18n/             # English and Chinese translations
├── pages/            # Dashboard, pets, calendar, assistant
├── services/         # Storage, AI, weather, audio, notifications
├── App.tsx
├── index.tsx
├── types.ts
└── vite.config.ts
```

## Current Limitations

- Data is stored locally in the browser; there is no backend synchronization.
- AI functionality requires a Gemini API key and should not be deployed with a frontend-exposed secret.
- The trainer directory contains demonstration profiles; it should not be treated as a verified booking marketplace.
- Browser notifications and alarms depend on browser permissions and runtime behavior.

## Author

**Ali Choukrane**  
Software Engineering undergraduate — Hangzhou Dianzi University

- GitHub: [@alichoukrane](https://github.com/alichoukrane)
- LinkedIn: [Ali Choukrane](https://www.linkedin.com/in/ali-choukrane-993ab61b6/)

---

This README describes the current repository implementation. Features, deployment guidance, and screenshots should be updated as the project evolves.
