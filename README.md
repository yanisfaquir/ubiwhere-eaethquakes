# Earthquake Events Platform - Yanis Faquir

A responsive, secure and interactive earthquake visualization platform built with **React**, **TypeScript**, **Leaflet**, and **Zustand**. Designed for Ubiwhere's recruitment exercise.


---

## 🌍 Features

- 🔒 **Secure authentication** with access & refresh token flow
- 🗺️ **Interactive map** with [Leaflet](https://leafletjs.com/) showing recent earthquakes
- 📍 **Filter** earthquakes by location
- 🧭 **Zoomable map** with legend and categorized markers by time range
- 🌐 **Responsive** layout with split-screen login and full-screen map
- 🪝 Built with **React Hooks**, **Zustand** for state, **React Router v7**

---

## 🚀 Tech Stack

| Type       | Stack                                 |
|------------|----------------------------------------|
| Frontend   | React 18 + TypeScript                  |
| Styling    | Tailwind CSS (via `@tailwindcss/postcss`) |
| Map        | Leaflet + React Leaflet                |
| Auth       | Zustand store + localStorage + Axios interceptors |
| Routing    | React Router v7                        |
| Build Tool | Vite v7                                |

---

## 🧪 Installation & Usage

```bash
# Clone
git clone https://github.com/your-repo/ubiwhere-earthquakes.git
cd ubiwhere-earthquakes

# Install dependencies
npm install

# Start dev server
npm run dev
```

---

## 🔐 Authentication Flow

- Login via `/api/token` returns `access_token` and `refresh_token`
- Tokens are stored in Zustand + `localStorage`
- Axios interceptors:
  - Automatically **attach token** to headers
  - If 401: send `/api/refresh` to get new `access_token` using `refresh_token`

---

## 🌐 Environment & API

- Base URL is proxied via `/api` using Vite proxy to avoid CORS issues.
- `refresh_token` sent directly to:

```
https://recruitment.ubiwhere.com/api/refresh
```

---

## 🗺️ Map Functionality

- Centered on `[38.4237, 27.1428]` (Portugal)
- Marker color based on time:
  - 🟢 Last 24h
  - 🟡 Last 2–7 days
  - 🟠 Last 8–30 days
- Filter earthquakes by location (input bar)
- Popups show coordinates, location & timestamp

---

## 🧱 Project Structure

```
src/
├── components/
│   ├── Map.tsx
│   ├── Navbar.tsx
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
├── store/
│   └── authStore.ts
├── routes/
│   └── AppRouter.tsx
├── services/
│   └── api.ts
```

---


---

## 📦 Dependencies

```json
"react": "^18.2.0",
"react-router-dom": "^7.6.3",
"zustand": "^5.0.6",
"axios": "^1.10.0",
"leaflet": "^1.9.4",
"react-leaflet": "^4.2.1",
"tailwindcss": "^4.1.11",
"vite": "^7.0.0"
```

---

## 📅 Last Updated

2025-07-02

---

## 🧑‍💻 Author

[Yanis Marina Faquir](yanismarinafaquir@gmail.com)
