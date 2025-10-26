// ========================================================================
// 📦 IMPORTS
// ========================================================================
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

// ========================================================================
// 🟡 DATENBANK-IMPORT (Supabase KV-Store)
// ========================================================================
// AKTUELL: Key-Value Store für einfache Daten
// OPTIONAL: Füge PostgreSQL hinzu mit:
// import { createClient } from 'npm:@supabase/supabase-js@2';
// const supabase = createClient(
//   Deno.env.get('SUPABASE_URL'),
//   Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
// );
// ========================================================================
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-b187574e/health", (c) => {
  return c.json({ status: "ok" });
});

// ========================================================================
// 🟡 DATENBANK: FAVORITEN ABRUFEN
// ========================================================================
// HIER werden gespeicherte Favoriten aus der Datenbank geladen
// ========================================================================
app.get("/make-server-b187574e/favorites/:userName", async (c) => {
  try {
    const userName = c.req.param("userName");
    const key = `favorites_${userName}`;
    
    // 🟡 Datenbank-Zugriff (KV-Store)
    const favorites = await kv.get(key);
    
    // OPTIONAL: PostgreSQL verwenden
    /*
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_name', userName);
    */
    
    return c.json({ favorites: favorites || [] });
  } catch (error) {
    console.log(`Error fetching favorites: ${error}`);
    return c.json({ error: "Failed to fetch favorites", details: String(error) }, 500);
  }
});

// Add a favorite
app.post("/make-server-b187574e/favorites", async (c) => {
  try {
    const { userName, recipe } = await c.req.json();
    
    if (!userName || !recipe) {
      return c.json({ error: "userName and recipe are required" }, 400);
    }
    
    const key = `favorites_${userName}`;
    const favorites = (await kv.get(key)) || [];
    
    // Check if recipe already exists
    const exists = favorites.some((fav: any) => fav.id === recipe.id);
    if (exists) {
      return c.json({ error: "Recipe already in favorites" }, 400);
    }
    
    favorites.push(recipe);
    await kv.set(key, favorites);
    
    return c.json({ success: true, favorites });
  } catch (error) {
    console.log(`Error adding favorite: ${error}`);
    return c.json({ error: "Failed to add favorite", details: String(error) }, 500);
  }
});

// Remove a favorite
app.delete("/make-server-b187574e/favorites", async (c) => {
  try {
    const { userName, recipeId } = await c.req.json();
    
    if (!userName || !recipeId) {
      return c.json({ error: "userName and recipeId are required" }, 400);
    }
    
    const key = `favorites_${userName}`;
    const favorites = (await kv.get(key)) || [];
    
    const updatedFavorites = favorites.filter((fav: any) => fav.id !== recipeId);
    await kv.set(key, updatedFavorites);
    
    return c.json({ success: true, favorites: updatedFavorites });
  } catch (error) {
    console.log(`Error removing favorite: ${error}`);
    return c.json({ error: "Failed to remove favorite", details: String(error) }, 500);
  }
});

// ========================================================================
// 🔴 HIER: REZEPT-SUCHE MIT GEMINI AI
// ========================================================================
// Dieser Endpoint wird aufgerufen, wenn ein Benutzer nach Rezepten sucht.
// 
// INTEGRATIONEN:
// 1. GEMINI API: Zeile 100-221 (aktuell aktiv)
// 2. EIGENE API: Ersetze den kompletten Code in diesem Endpoint
// 3. DATENBANK: Verwende `await kv.get()` oder `supabase.from('recipes').select()`
//
// Siehe /INTEGRATION_GUIDE.md für detaillierte Anweisungen
// ========================================================================

app.post("/make-server-b187574e/search", async (c) => {
  try {
    const { query, filters } = await c.req.json();
    
    if (!query) {
      return c.json({ error: "Search query is required" }, 400);
    }
    
    // ========================================================================
    // 🟢 GEMINI API-SCHLÜSSEL (aus Umgebungsvariablen)
    // ========================================================================
    // Stelle sicher, dass GEMINI_API_KEY in deiner .env Datei gesetzt ist!
    // Für Supabase: Verwende `supabase secrets set GEMINI_API_KEY=dein_key`
    // ========================================================================
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      return c.json({ error: "Gemini API key not configured" }, 500);
    }
    
    // Build prompt based on filters
    let prompt = `Du bist ein hilfreicher Kochassistent. Ein Benutzer sucht nach: "${query}".`;
    
    // Diet type filter
    if (filters?.dietType && filters.dietType !== "alle") {
      prompt += ` Der Benutzer bevorzugt ${filters.dietType === "vegan" ? "vegane" : "vegetarische"} Rezepte.`;
    }
    
    // Difficulty filter - only apply if set (> 0)
    if (filters?.difficulty && filters.difficulty > 0) {
      prompt += ` Die Schwierigkeit sollte ${filters.difficulty} Sterne (von 1-5) sein.`;
    }
    
    // Work time filter - only apply if not default range
    if (filters?.workTime && Array.isArray(filters.workTime) && (filters.workTime[0] !== 0 || filters.workTime[1] !== 120)) {
      const maxTime = filters.workTime[1] === 120 ? "mehr" : `${filters.workTime[1]} Minuten`;
      prompt += ` Die Arbeitszeit sollte zwischen ${filters.workTime[0]} und ${maxTime} liegen.`;
    }
    
    // Total time filter - only apply if not default range
    if (filters?.totalTime && Array.isArray(filters.totalTime) && (filters.totalTime[0] !== 0 || filters.totalTime[1] !== 240)) {
      const maxTime = filters.totalTime[1] === 240 ? "mehr" : `${filters.totalTime[1]} Minuten`;
      prompt += ` Die Gesamtzeit (inklusive Koch- und Wartezeit) sollte zwischen ${filters.totalTime[0]} und ${maxTime} liegen.`;
    }
    
    // Allergies filter - only apply if allergies are selected
    if (filters?.allergies && Array.isArray(filters.allergies) && filters.allergies.length > 0) {
      prompt += ` WICHTIG: Die Rezepte dürfen KEINE der folgenden Allergene enthalten: ${filters.allergies.join(", ")}.`;
    }
    
    // Available ingredients filter - only apply if ingredients are specified
    if (filters?.ingredients && filters.ingredients.trim()) {
      const userIngredients = filters.ingredients.split(',').map((i: string) => i.trim()).filter(Boolean);
      if (userIngredients.length > 0) {
        prompt += ` Der Benutzer hat folgende Zutaten zu Hause: ${userIngredients.join(", ")}. Bevorzuge Rezepte, die diese Zutaten verwenden.`;
      }
    }
    
    // Servings filter - use provided value or default to 4
    const servings = (filters?.servings && filters.servings > 0) ? filters.servings : 4;
    prompt += ` Die Rezepte sollten für ${servings} Person(en) berechnet sein.`;
    
    prompt += `\n\nBitte gib 3-5 passende Rezeptvorschläge als JSON-Array zurück. Jedes Rezept sollte folgende Struktur haben:
{
  "id": "eindeutige-id",
  "name": "Rezeptname",
  "description": "Kurze Beschreibung",
  "difficulty": 1-5 (Sterne),
  "workTime": "Arbeitszeit in Minuten als Zahl",
  "totalTime": "Gesamtzeit in Minuten als Zahl",
  "servings": ${servings},
  "ingredients": ["Zutat 1 mit Menge", "Zutat 2 mit Menge", ...],
  "instructions": ["Schritt 1", "Schritt 2", ...],
  "isVegan": true/false,
  "isVegetarian": true/false,
  "allergens": ["Liste der enthaltenen Allergene wie Gluten, Laktose, Nüsse, Soja, Eier, Fisch, Schalentiere, Sellerie"]
}

Antworte NUR mit dem JSON-Array, ohne zusätzlichen Text oder Markdown-Formatierung.`;

    // ========================================================================
    // 🟢 GEMINI API AUFRUF
    // ========================================================================
    // HIER wird die Gemini API aufgerufen, um Rezepte zu generieren
    //
    // Um EIGENE API zu verwenden, ERSETZE diesen gesamten Block mit:
    /*
    const response = await fetch("https://deine-api.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("DEINE_API_KEY")}`
      },
      body: JSON.stringify({ query, filters })
    });
    */
    // ========================================================================
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Gemini API error: ${response.status} - ${errorText}`);
      return c.json({ error: "Failed to get AI response", details: errorText }, 500);
    }
    
    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      console.log("No AI response received");
      return c.json({ error: "No response from AI" }, 500);
    }
    
    // Parse JSON from AI response
    let recipes;
    try {
      // Remove markdown code blocks if present
      const jsonText = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      recipes = JSON.parse(jsonText);
    } catch (parseError) {
      console.log(`Failed to parse AI response: ${parseError}\nResponse: ${aiResponse}`);
      return c.json({ error: "Failed to parse AI response", details: String(parseError) }, 500);
    }
    
    // ========================================================================
    // 🟡 DATENBANK: SUCHVERLAUF SPEICHERN
    // ========================================================================
    // HIER werden Suchanfragen in der Datenbank gespeichert
    //
    // AKTUELL: Supabase KV-Store (Key-Value)
    // OPTIONAL: Ersetze mit PostgreSQL:
    /*
    const { error } = await supabase
      .from('search_history')
      .insert({
        query,
        filters,
        results: recipes,
        timestamp: new Date().toISOString()
      });
    */
    // ========================================================================
    const searchKey = `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(searchKey, {
      query,
      filters,
      results: recipes,
      timestamp: new Date().toISOString()
    });
    
    return c.json({ recipes, query, filters });
  } catch (error) {
    console.log(`Error in search endpoint: ${error}`);
    return c.json({ error: "Search failed", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);