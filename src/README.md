# 🍜 SoupMate - AI-Powered Recipe Search

Eine moderne Web-Anwendung zum Suchen und Verwalten von Rezepten mit KI-Unterstützung (Gemini AI).

![SoupMate](https://img.shields.io/badge/Status-Ready%20for%20Deployment-success)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## ✨ Features

### 🎨 UI Features
- ✅ **Modernes Orange Design** mit Farbverläufen und Gradienten
- ✅ **Responsive Layout** für Desktop & Mobile
- ✅ **Ausklappbare Sidebar** mit umfangreichen Filteroptionen
- ✅ **Login-System** mit personalisierten Begrüßungen
- ✅ **Favoriten-System** zum Speichern von Lieblingsrezepten
- ✅ **Such-Verlauf** mit intelligenter Autocomplete-Funktion

### 🔍 Such- und Filter-Features
- ✅ **Ernährung:** Vegan, Vegetarisch oder Alles
- ✅ **Schwierigkeit:** 1-5 Sterne (interaktive Auswahl)
- ✅ **Arbeitszeit:** Einstellbarer Zeitbereich
- ✅ **Gesamtzeit:** Inklusive Koch- und Wartezeit
- ✅ **Allergien:** Ausschluss bestimmter Allergene
- ✅ **Verfügbare Zutaten:** Rezepte basierend auf vorhandenen Zutaten
- ✅ **Portionenanzahl:** Anpassbare Personenzahl

### 🤖 KI-Integration
- ✅ **Gemini AI** für intelligente Rezeptvorschläge
- ✅ **Filterbasierte Suche** - alle Filter werden bei der AI-Suche berücksichtigt
- ✅ **Detaillierte Rezeptinformationen** mit Zutaten, Anleitung und Allergenen

## 🚀 Schnellstart

### Voraussetzungen
- Node.js 18+ und npm
- (Optional) Eigenes Backend für Produktion

### 1. Installation

```bash
# Repository klonen oder Dateien kopieren
cd soupmate

# Dependencies installieren
npm install
```

### 2. Entwicklung starten (Mock-Modus)

```bash
npm run dev
```

Die App läuft auf **http://localhost:5173** und verwendet Mock-Daten - **kein Backend erforderlich!**

### 3. Eigenes Backend konfigurieren (optional)

Siehe **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** für die vollständige Anleitung.

## 📁 Projektstruktur

```
soupmate/
├── App.tsx                    # Hauptkomponente
├── config.tsx                 # ⭐ Konfigurationsdatei (Backend-URLs)
├── BACKEND_SETUP.md          # Backend-Implementierungsguide
├── deployment-guide.md       # Deployment-Anleitung für IntelliJ
│
├── components/
│   ├── Header.tsx            # Header mit Logo und Login
│   ├── SearchBar.tsx         # Suchleiste mit Verlauf
│   ├── Sidebar.tsx           # Filter-Sidebar
│   ├── LoginPage.tsx         # Login-Seite
│   ├── RecipeResults.tsx     # Rezept-Ergebnisse
│   └── ui/                   # Shadcn UI Komponenten
│
├── styles/
│   └── globals.css           # Tailwind CSS & Design Tokens
│
├── supabase/
│   └── functions/server/     # ⭐ Referenz-Backend (optional)
│       ├── index.tsx         # Hono Server mit allen Endpoints
│       └── kv_store.tsx      # Datenbank-Utilities
│
└── utils/
    └── supabase/
        └── info.tsx          # (Legacy - nicht mehr benötigt)
```

## ⚙️ Konfiguration

### Frontend-Konfiguration (`config.tsx`)

```typescript
// Mock-Modus (Standard - kein Backend erforderlich)
export const DEV_MODE = {
  useMockData: true,  // true = Mock-Daten, false = echtes Backend
  mockDelay: 1000
};

// Produktiv-Modus (mit eigenem Backend)
export const API_CONFIG = {
  baseUrl: "http://localhost:3000",  // Ändere zu deiner Backend-URL
  endpoints: {
    search: "/api/search",
    favorites: "/api/favorites",
    health: "/api/health"
  }
};

// Für Produktion: 
// 1. Setze useMockData: false
// 2. Passe baseUrl an (z.B. "https://api.soupmate.com")
```

## 🎯 Verwendung

### Mock-Modus (Entwicklung)

1. **Starte die App:** `npm run dev`
2. **Keine Backend-Konfiguration nötig** - verwendet lokale Mock-Daten
3. **Favoriten** werden in localStorage gespeichert
4. **Perfekt zum Testen** der UI und aller Features

### Produktiv-Modus (mit Backend)

1. **Backend implementieren** (siehe BACKEND_SETUP.md)
2. **config.tsx anpassen:**
   - `useMockData: false`
   - `baseUrl` auf deine Backend-URL setzen
3. **Backend starten** und App mit `npm run dev` testen

## 🛠️ Verfügbare Scripts

```bash
npm run dev      # Entwicklungsserver starten
npm run build    # Production Build erstellen
npm run preview  # Production Build testen
```

## 📚 Dokumentation

- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Vollständige Backend-Implementierung
- **[deployment-guide.md](./deployment-guide.md)** - IntelliJ Deployment-Anleitung
- **[Attributions.md](./Attributions.md)** - Verwendete Libraries & Credits

## 🔑 API Keys

### Gemini AI API Key (erforderlich für Produktiv-Modus)

1. Gehe zu [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Erstelle einen neuen API Key
3. Füge ihn in dein Backend ein (`.env` Datei)

**⚠️ Wichtig:** Der Gemini API Key gehört **nur ins Backend**, niemals ins Frontend!

## 🎨 Design

- **Primary Color:** Orange (#ff6b35 - #ff9966)
- **Typography:** Poppins (Header), System Fonts (Content)
- **Design System:** Tailwind CSS 4.0
- **UI Components:** Shadcn/ui (Radix UI)
- **Icons:** Lucide React

## 🌐 Deployment

### Option 1: Vercel (empfohlen)
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

### Option 3: Eigener Server
```bash
npm run build
# Deploye den /dist Ordner
```

Siehe **[deployment-guide.md](./deployment-guide.md)** für Details.

## 🤝 Entwicklung

### Projekt-Setup für IntelliJ IDEA

Vollständige Anleitung: **[deployment-guide.md](./deployment-guide.md)**

### Wichtige Hinweise

1. **Figma Assets:** Die `figma:asset/*` Imports müssen durch lokale Bilder ersetzt werden
2. **Backend optional:** Die App funktioniert komplett im Mock-Modus
3. **TypeScript:** Alle Komponenten sind voll typisiert

## 📝 Lizenz

Dieses Projekt wurde mit Figma Make erstellt.

## 🎉 Los geht's!

```bash
# Installation
npm install

# Starte im Mock-Modus (kein Backend erforderlich)
npm run dev

# Öffne http://localhost:5173
# Viel Spaß beim Kochen! 🍜
```

---

**Entwickelt mit ❤️ und Figma Make**
