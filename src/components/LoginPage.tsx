import { useState, FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import logo from "figma:asset/233fb2be3ee3381c91775cbcdd4d5d0ccf5122a5.png";

interface LoginPageProps {
  onBack: () => void;
  onLogin: (name: string) => void;
}

export function LoginPage({ onBack, onLogin }: LoginPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-[#ff9966] via-[#ffb085] to-[#ff9966] text-primary-foreground px-8 py-8 shadow-2xl relative">
        <div className="flex items-center justify-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff6b35] via-[#ff8c5a] to-[#ffb085] blur-md opacity-60"></div>
            <img 
              src={logo} 
              alt="SoupMate Logo" 
              className="w-20 h-20 rounded-full border-4 border-white shadow-2xl relative z-10 object-cover"
            />
          </div>
          <h1 className="text-5xl bg-gradient-to-br from-white via-orange-50 to-orange-100 bg-clip-text text-transparent drop-shadow-lg tracking-wide" style={{ fontFamily: 'var(--font-welcome)' }}>
            <span className="font-bold">S</span>oup<span className="font-bold">M</span>ate
          </h1>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 left-8">
          <Button 
            onClick={onBack}
            variant="outline" 
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <ArrowLeft size={18} className="mr-2" />
            Zurück
          </Button>
        </div>
      </header>

      <main 
        className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-[#fef7f3] via-[#ffede6] to-[#ffe8d6] relative"
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
        <div className="w-full max-w-md bg-gradient-to-br from-white to-orange-50/30 rounded-2xl shadow-2xl p-8 border-2 border-primary/20 relative z-10 animate-fade-in">
          <h2 className="text-3xl text-center mb-8 bg-gradient-to-r from-[#ff6b35] via-[#ff8c5a] to-[#ff9966] bg-clip-text text-transparent drop-shadow-lg" style={{ fontFamily: 'var(--font-welcome)' }}>
            Willkommen zurück!
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Dein Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-primary/30 focus-visible:border-primary bg-gradient-to-r from-white to-orange-50/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="deine@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-primary/30 focus-visible:border-primary bg-gradient-to-r from-white to-orange-50/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-primary/30 focus-visible:border-primary bg-gradient-to-r from-white to-orange-50/30"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-primary/30" />
                <span className="text-muted-foreground">Angemeldet bleiben</span>
              </label>
              <a href="#" className="text-primary hover:text-accent transition-colors">
                Passwort vergessen?
              </a>
            </div>

            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] hover:from-[#ff8c5a] hover:to-[#ffb085] transition-all duration-300 shadow-lg hover:shadow-xl text-white py-6 hover:scale-105 active:scale-95"
            >
              Anmelden
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Noch kein Konto?{" "}
              <a href="#" className="text-primary hover:text-accent transition-colors">
                Jetzt registrieren
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
