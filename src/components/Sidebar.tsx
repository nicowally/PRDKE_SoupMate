import { useState } from "react";
import { Star, Leaf, Sprout, Heart, X, Clock, Users, AlertCircle, ChefHat, Zap, UtensilsCrossed, Cookie } from "lucide-react";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

type DietType = "alle" | "vegetarisch" | "vegan";

export interface Recipe {
  id: string;
  name: string;
  difficulty: number;
  diet: DietType;
}

export interface RecipeFilters {
  dietType: DietType;
  difficulty: number;
  workTime: number[];
  totalTime: number[];
  allergies: string[];
  ingredients: string;
  servings: number;
}

interface SidebarProps {
  isOpen: boolean;
  favorites: Recipe[];
  onRemoveFavorite: (recipeId: string) => void;
  onFilterChange?: (filters: RecipeFilters) => void;
}

export function Sidebar({ isOpen, favorites, onRemoveFavorite, onFilterChange }: SidebarProps) {
  const [selectedDiet, setSelectedDiet] = useState<DietType>("alle");
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(0);
  const [workTime, setWorkTime] = useState<number[]>([0, 120]);
  const [totalTime, setTotalTime] = useState<number[]>([0, 240]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string>("");
  const [servings, setServings] = useState<number>(4);

  const notifyFilterChange = (updates: Partial<RecipeFilters> = {}) => {
    if (onFilterChange) {
      onFilterChange({
        dietType: selectedDiet,
        difficulty: selectedDifficulty,
        workTime,
        totalTime,
        allergies: selectedAllergies,
        ingredients,
        servings,
        ...updates
      });
    }
  };

  const handleDietChange = (diet: DietType) => {
    setSelectedDiet(diet);
    notifyFilterChange({ dietType: diet });
  };

  const handleDifficultyChange = (difficulty: number) => {
    setSelectedDifficulty(difficulty);
    notifyFilterChange({ difficulty });
  };

  const handleWorkTimeChange = (value: number[]) => {
    setWorkTime(value);
    notifyFilterChange({ workTime: value });
  };

  const handleTotalTimeChange = (value: number[]) => {
    setTotalTime(value);
    notifyFilterChange({ totalTime: value });
  };

  const handleAllergyToggle = (allergy: string) => {
    const newAllergies = selectedAllergies.includes(allergy)
      ? selectedAllergies.filter(a => a !== allergy)
      : [...selectedAllergies, allergy];
    setSelectedAllergies(newAllergies);
    notifyFilterChange({ allergies: newAllergies });
  };

  const handleIngredientsChange = (value: string) => {
    setIngredients(value);
    notifyFilterChange({ ingredients: value });
  };

  const handleServingsChange = (value: string) => {
    const num = parseInt(value) || 1;
    setServings(num);
    notifyFilterChange({ servings: num });
  };

  const dietOptions: { value: DietType; label: string; icon: typeof Leaf }[] = [
    { value: "alle", label: "Alles", icon: Sprout },
    { value: "vegetarisch", label: "Vegetarisch", icon: Leaf },
    { value: "vegan", label: "Vegan", icon: Leaf },
  ];

  const commonAllergies = [
    "Gluten",
    "Laktose",
    "Nüsse",
    "Soja",
    "Eier",
    "Fisch",
    "Schalentiere",
    "Sellerie"
  ];

  // Berechne aktive Filter
  const activeFilterCount = [
    selectedDiet !== "alle",
    selectedDifficulty > 0,
    workTime[0] !== 0 || workTime[1] !== 120,
    totalTime[0] !== 0 || totalTime[1] !== 240,
    selectedAllergies.length > 0,
    ingredients.trim() !== "",
    servings !== 4
  ].filter(Boolean).length;

  // Quick Filter Presets
  const applyQuickFilter = (preset: string) => {
    switch (preset) {
      case "quick-easy":
        setSelectedDifficulty(1);
        setWorkTime([0, 20]);
        setTotalTime([0, 40]);
        notifyFilterChange({ difficulty: 1, workTime: [0, 20], totalTime: [0, 40] });
        break;
      case "vegan-healthy":
        setSelectedDiet("vegan");
        setSelectedDifficulty(0);
        notifyFilterChange({ dietType: "vegan", difficulty: 0 });
        break;
      case "gourmet":
        setSelectedDifficulty(4);
        setTotalTime([60, 240]);
        notifyFilterChange({ difficulty: 4, totalTime: [60, 240] });
        break;
    }
  };

  return (
    <aside className={`${isOpen ? 'w-80' : 'w-0'} bg-gradient-to-b from-[#3d2817] via-[#5a3d2b] to-[#3d2817] text-white h-screen shadow-2xl overflow-x-hidden overflow-y-auto transition-all duration-300 ease-in-out relative`}>
      {/* Header mit Filter Badge */}
      {isOpen && (
        <div className="px-5 pt-5 pb-3 border-b border-white/10 bg-gradient-to-r from-[#ff6b35]/10 to-transparent sticky top-0 z-10 bg-[#3d2817]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#ff8c5a]">Filter</h2>
            {activeFilterCount > 0 && (
              <Badge className="bg-[#ff6b35] hover:bg-[#ff6b35] text-white">
                {activeFilterCount}
              </Badge>
            )}
          </div>
        </div>
      )}
      
      <div className={`${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        <Tabs defaultValue="filters" className="w-full">
          <TabsList className="w-full flex bg-white/5 mx-2 mt-3 mb-2 p-1">
            <TabsTrigger value="filters" className="data-[state=active]:bg-[#ff6b35] text-sm py-2 flex-1 flex items-center justify-center gap-1.5">
              <UtensilsCrossed className="h-4 w-4 flex-shrink-0" />
              <span>Filter</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-[#ff6b35] text-sm py-2 flex-1 flex items-center justify-center gap-1.5">
              <Heart className="h-4 w-4 flex-shrink-0" />
              <span>Favoriten</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="filters" className="mt-0">
            <nav className="space-y-4 px-4 py-3 pb-6">
        {/* Quick Filter Presets */}
        <div className="flex-shrink-0">
          <h3 className="mb-2 text-sm font-bold text-[#ff8c5a] tracking-wide uppercase">Quick Filter</h3>
          <div className="flex gap-2">
            <button
              onClick={() => applyQuickFilter("quick-easy")}
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 flex flex-col items-center gap-1 group"
            >
              <Zap size={18} className="text-[#ff8c5a] group-hover:scale-110 transition-transform" />
              <span className="text-xs">Schnell</span>
            </button>
            <button
              onClick={() => applyQuickFilter("vegan-healthy")}
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 flex flex-col items-center gap-1 group"
            >
              <Leaf size={18} className="text-green-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs">Vegan</span>
            </button>
            <button
              onClick={() => applyQuickFilter("gourmet")}
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 flex flex-col items-center gap-1 group"
            >
              <Cookie size={18} className="text-yellow-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs">Gourmet</span>
            </button>
          </div>
        </div>

        {/* Ernährungstyp Filter */}
        <div className="flex-shrink-0">
          <h3 className="mb-2 text-sm font-bold text-[#ff8c5a] tracking-wide uppercase">Ernährung</h3>
          <div className="flex gap-2">
            {dietOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleDietChange(option.value)}
                className={`flex-1 px-3 py-2 rounded-lg transition-all duration-300 group ${
                  selectedDiet === option.value
                    ? "bg-[#ff6b35] text-white shadow-lg"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <span className="text-sm">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Schwierigkeitsgrad Filter */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#ff8c5a] tracking-wide uppercase flex-1">Schwierigkeit</h3>
            {selectedDifficulty > 0 && (
              <button
                onClick={() => handleDifficultyChange(0)}
                className="text-xs text-white/60 hover:text-[#ff6b35] transition-colors ml-2"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex items-center justify-center gap-1 px-3 py-2 bg-white/5 rounded-lg">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => handleDifficultyChange(level === selectedDifficulty ? 0 : level)}
                className="transition-transform duration-200 hover:scale-125 active:scale-110"
              >
                <Star
                  size={22}
                  className={`${
                    level <= selectedDifficulty
                      ? "fill-[#ff6b35] text-[#ff6b35]"
                      : "text-white/40 hover:text-[#ff6b35]/60"
                  } transition-all duration-200`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Arbeitszeit & Gesamtzeit kombiniert */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#ff8c5a] tracking-wide uppercase flex items-center gap-2 flex-1">
              <Clock size={16} />
              Zeit
            </h3>
            {((workTime[0] !== 0 || workTime[1] !== 120) || (totalTime[0] !== 0 || totalTime[1] !== 240)) && (
              <button
                onClick={() => {
                  handleWorkTimeChange([0, 120]);
                  handleTotalTimeChange([0, 240]);
                }}
                className="text-xs text-white/60 hover:text-[#ff6b35] transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="bg-white/5 rounded-lg p-3 space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/90 flex items-center gap-1.5">
                  <ChefHat size={14} />
                  Arbeitszeit
                </span>
                <span className="text-xs text-white/70">{workTime[0]}-{workTime[1] === 120 ? '120+' : workTime[1]} Min</span>
              </div>
              <Slider
                value={workTime}
                onValueChange={handleWorkTimeChange}
                max={120}
                min={0}
                step={5}
                className="[&_[role=slider]]:bg-[#ff6b35] [&_[role=slider]]:border-[#ff6b35]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/90 flex items-center gap-1.5">
                  <Clock size={14} />
                  Gesamtzeit
                </span>
                <span className="text-xs text-white/70">{totalTime[0]}-{totalTime[1] === 240 ? '240+' : totalTime[1]} Min</span>
              </div>
              <Slider
                value={totalTime}
                onValueChange={handleTotalTimeChange}
                max={240}
                min={0}
                step={10}
                className="[&_[role=slider]]:bg-[#ff6b35] [&_[role=slider]]:border-[#ff6b35]"
              />
            </div>
          </div>
        </div>

        {/* Allergien Filter */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#ff8c5a] tracking-wide uppercase flex items-center gap-2 flex-1">
              <AlertCircle size={16} />
              Allergien
            </h3>
            {selectedAllergies.length > 0 && (
              <button
                onClick={() => {
                  setSelectedAllergies([]);
                  notifyFilterChange({ allergies: [] });
                }}
                className="text-xs text-white/60 hover:text-[#ff6b35] transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="px-2 py-2 bg-white/5 rounded-lg space-y-2">
            {commonAllergies.map((allergy) => (
              <div key={allergy} className="flex items-center gap-2">
                <Checkbox
                  id={allergy}
                  checked={selectedAllergies.includes(allergy)}
                  onCheckedChange={() => handleAllergyToggle(allergy)}
                  className="border-white/30 data-[state=checked]:bg-[#ff6b35] data-[state=checked]:border-[#ff6b35]"
                />
                <Label
                  htmlFor={allergy}
                  className="text-sm text-white/90 cursor-pointer"
                >
                  {allergy}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Zutaten & Portionen kombiniert */}
        <div className="flex-shrink-0 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#ff8c5a] tracking-wide uppercase flex-1">
                Zutaten
              </h3>
              {ingredients.trim() && (
                <button
                  onClick={() => handleIngredientsChange("")}
                  className="text-xs text-white/60 hover:text-[#ff6b35] transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder="z.B. Tomaten, Nudeln, Käse..."
                value={ingredients}
                onChange={(e) => handleIngredientsChange(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#ff6b35] focus:ring-[#ff6b35]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#ff8c5a] tracking-wide uppercase flex items-center gap-2 flex-1">
                <Users size={16} />
                Portionen
              </h3>
              {servings !== 4 && (
                <button
                  onClick={() => handleServingsChange("4")}
                  className="text-xs text-white/60 hover:text-[#ff6b35] transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div>
              <Input
                type="number"
                min="1"
                max="20"
                value={servings}
                onChange={(e) => handleServingsChange(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#ff6b35] focus:ring-[#ff6b35]"
              />
            </div>
          </div>
        </div>

        {/* Alle Filter zurücksetzen */}
        <div className="flex-shrink-0">
          <button
            onClick={() => {
              setSelectedDiet("alle");
              setSelectedDifficulty(0);
              setWorkTime([0, 120]);
              setTotalTime([0, 240]);
              setSelectedAllergies([]);
              setIngredients("");
              setServings(4);
              notifyFilterChange({
                dietType: "alle",
                difficulty: 0,
                workTime: [0, 120],
                totalTime: [0, 240],
                allergies: [],
                ingredients: "",
                servings: 4
              });
            }}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-[#ff6b35]/20 to-[#ff8c5a]/20 hover:from-[#ff6b35]/30 hover:to-[#ff8c5a]/30 text-white rounded-lg transition-all duration-300 border border-[#ff6b35]/30 hover:scale-105"
          >
            <div className="flex items-center justify-center gap-2">
              <X size={16} />
              <span className="text-sm">Alle zurücksetzen</span>
            </div>
          </button>
        </div>
      </nav>
          </TabsContent>

          <TabsContent value="favorites" className="mt-0">
            <div className="p-4 space-y-2 pb-6">
              {favorites.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Heart size={48} className="mx-auto text-white/20" />
                  <p className="text-sm text-white/60 italic">
                    Keine Favoriten gespeichert
                  </p>
                  <p className="text-xs text-white/40">
                    Klicke auf das Herz bei einem Rezept
                  </p>
                </div>
              ) : (
                favorites.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="bg-white/5 hover:bg-white/10 rounded-lg p-3 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0 space-y-2">
                        <p className="text-sm truncate">{recipe.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(recipe.difficulty)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className="fill-[#ff6b35] text-[#ff6b35]"
                              />
                            ))}
                          </div>
                          {recipe.diet === "vegan" && (
                            <span className="text-[10px] px-2 py-0.5 bg-green-500/80 rounded-full">
                              V
                            </span>
                          )}
                          {recipe.diet === "vegetarisch" && (
                            <span className="text-[10px] px-2 py-0.5 bg-green-400/80 rounded-full">
                              VG
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveFavorite(recipe.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white/60 hover:text-red-400 flex-shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}
