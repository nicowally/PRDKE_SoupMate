import { useState, useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { Sidebar, Recipe, RecipeFilters } from "./components/Sidebar";
import { LoginPage } from "./components/LoginPage";
import { RecipeResults } from "./components/RecipeResults";
import { RecipeSkeleton } from "./components/RecipeSkeleton";
import { FilterChips } from "./components/FilterChips";
import logo from "figma:asset/233fb2be3ee3381c91775cbcdd4d5d0ccf5122a5.png";
import { API_CONFIG, DEV_MODE } from './config';
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import { ArrowUp } from "lucide-react";
import { Button } from "./components/ui/button";

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<RecipeFilters>({ 
    dietType: "alle", 
    difficulty: 0,
    workTime: [0, 120],
    totalTime: [0, 240],
    allergies: [],
    ingredients: "",
    servings: 4
  });

  const handleLogin = (name: string) => {
    setUserName(name);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUserName(undefined);
    setFavorites([]);
    setChatHistory([]);
  };

  const handleSearchResults = (results: any) => {
    setChatHistory(prev => [...prev, {
      type: 'user',
      query: results.query,
      timestamp: new Date()
    }, {
      type: 'ai',
      recipes: results.recipes,
      timestamp: new Date()
    }]);
  };

  const handleBackToHome = () => {
    setChatHistory([]);
  };

  const handleFilterChange = (newFilters: RecipeFilters) => {
    setFilters(newFilters);
  };

  const removeFilter = (filterKey: keyof RecipeFilters) => {
    const resetValues: Partial<RecipeFilters> = {
      dietType: "alle",
      difficulty: 0,
      workTime: [0, 120],
      totalTime: [0, 240],
      allergies: [],
      ingredients: "",
      servings: 4
    };
    
    setFilters(prev => ({
      ...prev,
      [filterKey]: resetValues[filterKey]
    }));
  };

  // Scroll-to-Top functionality
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        setShowScrollTop(contentRef.current.scrollTop > 300);
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('scroll', handleScroll);
      return () => content.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load favorites when user logs in
  useEffect(() => {
    if (userName) {
      loadFavorites(userName);
    }
  }, [userName]);

  const loadFavorites = async (name: string) => {
    if (DEV_MODE.useMockData) {
      // Mock-Modus: Lade aus localStorage
      const stored = localStorage.getItem(`favorites_${name}`);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
      return;
    }

    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.favorites}/${name}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        console.error(`Failed to load favorites: ${response.statusText}`);
        return;
      }
      
      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (error) {
      console.error(`Error loading favorites: ${error}`);
    }
  };

  const addFavorite = async (recipe: Recipe) => {
    if (!userName) {
      toast.error("Bitte melde dich an, um Favoriten zu speichern");
      return;
    }

    // Check if already favorited
    if (favorites.some(f => f.id === recipe.id)) {
      toast.info("Dieses Rezept ist bereits in deinen Favoriten");
      return;
    }

    if (DEV_MODE.useMockData) {
      // Mock-Modus: Speichere in localStorage
      const newFavorites = [...favorites, recipe];
      setFavorites(newFavorites);
      localStorage.setItem(`favorites_${userName}`, JSON.stringify(newFavorites));
      toast.success(`${recipe.name} zu Favoriten hinzugefügt! ❤️`);
      return;
    }

    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.favorites}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userName, recipe }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Failed to add favorite: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      setFavorites(data.favorites);
      toast.success(`${recipe.name} zu Favoriten hinzugefügt! ❤️`);
    } catch (error) {
      console.error(`Error adding favorite: ${error}`);
      toast.error("Fehler beim Hinzufügen zu Favoriten");
    }
  };

  const removeFavorite = async (recipeId: string) => {
    if (!userName) return;

    if (DEV_MODE.useMockData) {
      // Mock-Modus: Entferne aus localStorage
      const newFavorites = favorites.filter(f => f.id !== recipeId);
      setFavorites(newFavorites);
      localStorage.setItem(`favorites_${userName}`, JSON.stringify(newFavorites));
      toast.success("Aus Favoriten entfernt");
      return;
    }

    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.favorites}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userName, recipeId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Failed to remove favorite: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      setFavorites(data.favorites);
      toast.success("Aus Favoriten entfernt");
    } catch (error) {
      console.error(`Error removing favorite: ${error}`);
      toast.error("Fehler beim Entfernen aus Favoriten");
    }
  };

  if (showLogin) {
    return (
      <LoginPage 
        onBack={() => setShowLogin(false)} 
        onLogin={handleLogin}
      />
    );
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className={`flex h-screen overflow-hidden ${isMobile ? 'flex-col' : ''}`}>
        {/* Sidebar - Drawer on Mobile */}
        {isMobile ? (
          isSidebarOpen && (
            <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsSidebarOpen(false)}>
              <div className="absolute bottom-0 left-0 right-0 max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
                <Sidebar 
                  isOpen={isSidebarOpen} 
                  favorites={favorites}
                  onRemoveFavorite={removeFavorite}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>
          )
        ) : (
          <Sidebar 
            isOpen={isSidebarOpen} 
            favorites={favorites}
            onRemoveFavorite={removeFavorite}
            onFilterChange={handleFilterChange}
          />
        )}
        
        <div className="flex-1 flex flex-col min-w-0">
          <Header 
            onLoginClick={() => setShowLogin(true)} 
            userName={userName}
            onLogout={handleLogout}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
          />
          
          <main 
            className="flex-1 flex flex-col bg-gradient-to-br from-[#fef7f3] via-[#ffede6] to-[#ffe8d6] relative overflow-hidden"
            style={{
              backgroundImage: `url(${logo})`,
              backgroundPosition: 'center',
              backgroundSize: '50%',
              backgroundRepeat: 'no-repeat',
              backgroundBlendMode: 'overlay',
            }}
          >
            <div 
              className="absolute inset-0 bg-gradient-to-br from-[#fef7f3]/95 via-[#ffede6]/90 to-[#ffe8d6]/95"
              style={{ zIndex: 0 }}
            />
            
            {/* Content Area - Scrollable */}
            <div ref={contentRef} className="flex-1 overflow-y-auto relative z-10 scroll-smooth">
              {isSearching ? (
                <div className="w-full max-w-5xl mx-auto px-6 pt-4">
                  <RecipeSkeleton />
                </div>
              ) : chatHistory.length > 0 ? (
                <RecipeResults 
                  chatHistory={chatHistory}
                  onAddToFavorites={addFavorite}
                  onBack={handleBackToHome}
                />
              ) : userName ? (
                <div className="h-full flex flex-col items-center justify-center gap-6 px-8">
                  <h2 
                    className="text-3xl md:text-5xl bg-gradient-to-r from-[#ff6b35] via-[#ff8c5a] to-[#ff9966] bg-clip-text text-transparent drop-shadow-2xl animate-fade-in text-center"
                    style={{ fontFamily: 'var(--font-welcome)' }}
                  >
                    Willkommen {userName}!
                  </h2>
                  <p className="text-base md:text-lg text-muted-foreground max-w-2xl text-center animate-fade-in-delayed">
                    Suche nach deinen Lieblingsrezepten oder entdecke neue kulinarische Inspirationen
                  </p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-6 px-8">
                  <h2 
                    className="text-2xl md:text-4xl bg-gradient-to-r from-[#ff6b35] via-[#ff8c5a] to-[#ff9966] bg-clip-text text-transparent drop-shadow-2xl text-center animate-fade-in"
                    style={{ fontFamily: 'var(--font-welcome)' }}
                  >
                    Entdecke köstliche Rezepte
                  </h2>
                  <p className="text-base md:text-lg text-muted-foreground max-w-2xl text-center animate-fade-in-delayed">
                    Melde dich an, um deine Favoriten zu speichern und personalisierte Empfehlungen zu erhalten
                  </p>
                </div>
              )}
            </div>
            
            {/* Scroll to Top Button */}
            {showScrollTop && (
              <Button
                onClick={scrollToTop}
                size="icon"
                className="fixed bottom-24 right-8 z-20 rounded-full shadow-2xl bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] hover:from-[#ff8c5a] hover:to-[#ffb085] animate-fade-in"
              >
                <ArrowUp size={20} />
              </Button>
            )}
            
            {/* Search Bar - Always Visible at Bottom */}
            <div className="relative z-10 border-t border-primary/10 bg-gradient-to-b from-transparent via-[#fef7f3]/80 to-[#fef7f3]/95 backdrop-blur-sm">
              <div className="w-full max-w-3xl mx-auto px-4 md:px-8 py-4 space-y-3">
                {/* Filter Chips */}
                <FilterChips filters={filters} onRemoveFilter={removeFilter} />
                
                <SearchBar 
                  userName={userName} 
                  onSearchResults={(results) => {
                    handleSearchResults(results);
                    // Scroll to top after new search
                    setTimeout(() => scrollToTop(), 100);
                  }}
                  filters={filters}
                  onSearchStart={() => setIsSearching(true)}
                  onSearchEnd={() => setIsSearching(false)}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
