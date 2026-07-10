import { useState, useEffect, useCallback } from 'react';
import { supabase, type Region, type DialectWord, type WordWithRegion } from './lib/supabase';
import { Search, BookOpen, ClipboardCheck, Mountain, ChevronDown, CheckCircle2, XCircle, RotateCcw, Award, MapPin } from 'lucide-react';

type View = 'home' | 'browse' | 'search' | 'test';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('regions').select('*').order('id');
      if (error) {
        console.error('Error loading regions:', error);
        return;
      }
      if (data) setRegions(data as Region[]);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <div className="text-amber-400 text-lg animate-pulse">Зареждане...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 transition-colors duration-500">
      <Header view={view} setView={setView} />
      <main className="pb-20">
        {view === 'home' && <Home regions={regions} setView={setView} setSelectedRegion={setSelectedRegion} />}
        {view === 'browse' && (
          <Browse regions={regions} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
        )}
        {view === 'search' && <SearchView regions={regions} />}
        {view === 'test' && <TestView regions={regions} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />}
      </main>
      <Footer />
    </div>
  );
}

function Header({ view, setView }: { view: View; setView: (v: View) => void }) {
  const navItems: { id: View; label: string; icon: typeof BookOpen }[] = [
    { id: 'home', label: 'Начало', icon: Mountain },
    { id: 'browse', label: 'Речник', icon: BookOpen },
    { id: 'search', label: 'Търсене', icon: Search },
    { id: 'test', label: 'Тест', icon: ClipboardCheck },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-stone-950/80 border-b border-stone-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <button onClick={() => setView('home')} className="flex items-center gap-2 group">
          <Mountain className="w-7 h-7 text-amber-500 group-hover:scale-110 transition-transform" />
          <span className="text-lg font-bold tracking-tight">
            Диалектни <span className="text-amber-500">Думи</span>
          </span>
        </button>
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-amber-500 text-stone-950'
                    : 'text-stone-400 hover:text-amber-400 hover:bg-stone-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function Home({
  regions,
  setView,
  setSelectedRegion,
}: {
  regions: Region[];
  setView: (v: View) => void;
  setSelectedRegion: (r: Region) => void;
}) {
  const features = [
    {
      icon: BookOpen,
      title: 'Речник по региони',
      description: 'Разгледай диалектни думи от всеки регион с различен фон и дизайн.',
      action: () => setView('browse'),
      actionLabel: 'Отвори речника',
    },
    {
      icon: Search,
      title: 'Търсене на думи',
      description: 'Напиши дума и разбери от кой регион произлиза, с пълно значение.',
      action: () => setView('search'),
      actionLabel: 'Търси дума',
    },
    {
      icon: ClipboardCheck,
      title: 'Тест по региони',
      description: 'Провери знанията си с тест на всеки регион. Колко думи познаваш?',
      action: () => setView('test'),
      actionLabel: 'Започни тест',
    },
  ];

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-950 to-black" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(245, 158, 11, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)'
        }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-6 animate-fade-in">
            <MapPin className="w-4 h-4" />
            7 региона | 250+ диалектни думи
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Български <span className="text-amber-500">диалектни</span> думи
          </h1>
          <p className="text-lg sm:text-xl text-stone-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Открий богатството на българските говори. Разгледай речник, търси думи и се тествай
            на знания за всеки регион.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setView('browse')}
              className="px-8 py-3.5 bg-amber-500 text-stone-950 rounded-xl font-semibold hover:bg-amber-400 transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25"
            >
              Разгледай речника
            </button>
            <button
              onClick={() => setView('test')}
              className="px-8 py-3.5 bg-stone-800 text-stone-100 rounded-xl font-semibold hover:bg-stone-700 transition-all hover:scale-105 border border-stone-700"
            >
              Направи тест
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">Какво можеш да правиш?</h2>
        <p className="text-stone-500 text-center mb-12">Три начина да опознаеш българските диалекти</p>
        <div className="grid sm:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="group bg-stone-900 border border-stone-800 rounded-2xl p-6 hover:border-amber-500/50 transition-all hover:-translate-y-1 cursor-pointer"
                onClick={f.action}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                  <Icon className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed mb-4">{f.description}</p>
                <span className="text-amber-500 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  {f.actionLabel} →
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">Региони</h2>
        <p className="text-stone-500 text-center mb-12">Избери регион, за да видиш неговите диалектни думи</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {regions.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setSelectedRegion(r);
                setView('browse');
              }}
              className={`relative overflow-hidden rounded-2xl p-6 text-left bg-gradient-to-br ${r.gradient} hover:scale-[1.02] transition-transform border border-white/10`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 blur-2xl" />
              <h3 className="text-xl font-bold mb-1 text-white">{r.name}</h3>
              <p className="text-white/70 text-sm line-clamp-2">{r.description}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function Browse({
  regions,
  selectedRegion,
  setSelectedRegion,
}: {
  regions: Region[];
  selectedRegion: Region | null;
  setSelectedRegion: (r: Region | null) => void;
}) {
  const [words, setWords] = useState<DialectWord[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentRegion = selectedRegion || regions[0];

  const fetchWords = useCallback(async (regionId: number) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('dialect_words')
      .select('*')
      .eq('region_id', regionId)
      .order('word');
    if (error) {
      console.error('Error fetching words:', error);
    }
    if (data) setWords(data as DialectWord[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (currentRegion) fetchWords(currentRegion.id);
  }, [currentRegion?.id, fetchWords]);

  return (
    <div className={`min-h-[calc(100vh-80px)] bg-gradient-to-br ${currentRegion.gradient} transition-all duration-700`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <label className="text-white/70 text-sm font-medium mb-2 block">Избери регион</label>
          <div className="relative max-w-xs">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white font-semibold hover:bg-white/15 transition-colors"
            >
              <span>{currentRegion.name}</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full mt-2 w-full bg-stone-900/95 backdrop-blur-lg rounded-xl border border-stone-700 overflow-hidden shadow-xl z-10">
                {regions.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setSelectedRegion(r);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-stone-800 transition-colors ${
                      r.id === currentRegion.id ? 'text-amber-400 font-semibold' : 'text-stone-200'
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-8 text-white">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{currentRegion.name} диалект</h1>
          <p className="text-white/80 max-w-2xl leading-relaxed">{currentRegion.description}</p>
        </div>

        {loading ? (
          <div className="text-white/70 text-center py-20 animate-pulse">Зареждане на думите...</div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {words.map((w, i) => (
              <div
                key={w.id}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 hover:bg-white/15 transition-all hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${i * 0.02}s` }}
              >
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-lg font-bold text-white">{w.word}</h3>
                </div>
                <p className="text-white/80 text-sm mb-1">{w.meaning}</p>
                {w.example && (
                  <p className="text-white/50 text-xs italic mt-2 border-l-2 border-white/20 pl-2">{w.example}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchView({ regions }: { regions: Region[] }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WordWithRegion[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    const { data, error } = await supabase
      .from('dialect_words')
      .select('*, regions(*)')
      .ilike('word', `%${q.trim()}%`)
      .order('word')
      .limit(50);
    if (error) console.error('Search error:', error);
    if (data) setResults(data as WordWithRegion[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  const regionColors: Record<string, string> = {};
  regions.forEach((r) => {
    regionColors[r.name] = r.gradient;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">Търсене на диалектна дума</h1>
      <p className="text-stone-400 mb-8">Напиши дума и виж от кой регион произлиза и какво означава</p>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="напр. анайка, сакам, бунар..."
          className="w-full pl-12 pr-4 py-4 bg-stone-900 border border-stone-700 rounded-xl text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-lg"
          autoFocus
        />
      </div>

      {loading && <div className="text-stone-500 text-center py-10 animate-pulse">Търсене...</div>}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-stone-500 text-lg">Не са намерени думи за „{query}“</p>
          <p className="text-stone-600 text-sm mt-2">Опитай с друга дума или разгледай речника по региони.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div>
          <p className="text-stone-500 text-sm mb-4">
            Намерени са {results.length} {results.length === 1 ? 'дума' : 'думи'}
          </p>
          <div className="space-y-3">
            {results.map((w) => (
              <div
                key={w.id}
                className={`relative overflow-hidden rounded-xl p-5 bg-gradient-to-r ${w.regions.gradient} border border-white/10 hover:scale-[1.01] transition-transform`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-white">{w.word}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                        {w.regions.name}
                      </span>
                    </div>
                    <p className="text-white/85 text-sm mb-2">{w.meaning}</p>
                    {w.example && (
                      <p className="text-white/60 text-xs italic border-l-2 border-white/20 pl-2">{w.example}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !searched && (
        <div className="text-center py-16">
          <Search className="w-12 h-12 text-stone-700 mx-auto mb-4" />
          <p className="text-stone-500">Започни да пишеш, за да търсиш диалектни думи</p>
        </div>
      )}
    </div>
  );
}

function TestView({
  regions,
  selectedRegion,
  setSelectedRegion,
}: {
  regions: Region[];
  selectedRegion: Region | null;
  setSelectedRegion: (r: Region | null) => void;
}) {
  const [stage, setStage] = useState<'select' | 'quiz' | 'result'>('select');
  const [words, setWords] = useState<DialectWord[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ word: DialectWord; correct: boolean; chosen: string }[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentRegion = selectedRegion || regions[0];

  const startTest = async (region: Region) => {
    const { data, error } = await supabase
      .from('dialect_words')
      .select('*')
      .eq('region_id', region.id);
    if (error) {
      console.error('Error fetching test words:', error);
      return;
    }
    if (data) {
      const shuffled = (data as DialectWord[]).sort(() => Math.random() - 0.5).slice(0, 10);
      setWords(shuffled);
      setCurrentQ(0);
      setScore(0);
      setAnswers([]);
      setStage('quiz');
      generateOptions(shuffled[0], data as DialectWord[]);
    }
  };

  const generateOptions = (word: DialectWord, allWords: DialectWord[]) => {
    const correct = word.meaning;
    const wrong = allWords
      .filter((w) => w.id !== word.id && w.meaning !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.meaning);
    setOptions([correct, ...wrong].sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (chosen: string) => {
    const word = words[currentQ];
    const correct = chosen === word.meaning;
    if (correct) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, { word, correct, chosen }]);

    if (currentQ + 1 < words.length) {
      const next = currentQ + 1;
      setCurrentQ(next);
      generateOptions(words[next], words);
    } else {
      setStage('result');
    }
  };

  if (stage === 'select') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Тест на диалектните думи</h1>
        <p className="text-stone-400 mb-8">Избери регион и се тествай — 10 въпроса, по 4 възможни отговора</p>

        <div className="mb-6">
          <label className="text-stone-400 text-sm font-medium mb-2 block">Избери регион за теста</label>
          <div className="relative max-w-xs">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-stone-900 rounded-xl border border-stone-700 text-stone-100 font-semibold hover:border-amber-500/50 transition-colors"
            >
              <span>{currentRegion.name}</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full mt-2 w-full bg-stone-900 rounded-xl border border-stone-700 overflow-hidden shadow-xl z-10">
                {regions.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setSelectedRegion(r);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-stone-800 transition-colors ${
                      r.id === currentRegion.id ? 'text-amber-400 font-semibold' : 'text-stone-200'
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={`relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br ${currentRegion.gradient} border border-white/10`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-12 -mt-12 blur-3xl" />
          <div className="relative">
            <h2 className="text-2xl font-bold text-white mb-2">{currentRegion.name} диалект</h2>
            <p className="text-white/80 mb-6 max-w-xl">{currentRegion.description}</p>
            <button
              onClick={() => startTest(currentRegion)}
              className="px-6 py-3 bg-white text-stone-950 rounded-xl font-semibold hover:bg-white/90 transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              <ClipboardCheck className="w-5 h-5" />
              Започни теста
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'quiz' && words.length > 0) {
    const word = words[currentQ];
    const progress = ((currentQ) / words.length) * 100;
    return (
      <div className={`min-h-[calc(100vh-80px)] bg-gradient-to-br ${currentRegion.gradient} transition-all duration-500`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 text-white">
              <span className="text-sm font-medium">Въпрос {currentQ + 1} от {words.length}</span>
              <span className="text-sm font-medium">Точки: {score}</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/15 mb-6">
            <p className="text-white/70 text-sm mb-2">Какво означава думата:</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">{word.word}</h2>
            {word.example && (
              <p className="text-white/60 text-sm italic mt-3 border-l-2 border-white/20 pl-3">„{word.example}"</p>
            )}
          </div>

          <div className="space-y-3">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className="w-full text-left px-5 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 text-white hover:bg-white/20 hover:scale-[1.02] transition-all font-medium"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'result') {
    const percentage = Math.round((score / words.length) * 100);
    const passed = percentage >= 60;
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${passed ? 'bg-emerald-500/15' : 'bg-rose-500/15'}`}>
            {passed ? <Award className="w-10 h-10 text-emerald-400" /> : <RotateCcw className="w-10 h-10 text-rose-400" />}
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {passed ? 'Браво!' : 'Опитай пак!'}
          </h1>
          <p className="text-stone-400">
            {currentRegion.name} диалект — {score} от {words.length} верни ({percentage}%)
          </p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Резултати по въпроси</h3>
          <div className="space-y-2">
            {answers.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-stone-800/50">
                {a.correct ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{a.word.word}</p>
                  <p className="text-stone-400 text-xs">Вярно: {a.word.meaning}</p>
                  {!a.correct && <p className="text-rose-400/80 text-xs">Твоят отговор: {a.chosen}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => startTest(currentRegion)}
            className="flex-1 px-6 py-3 bg-amber-500 text-stone-950 rounded-xl font-semibold hover:bg-amber-400 transition-all inline-flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Нов тест
          </button>
          <button
            onClick={() => setStage('select')}
            className="flex-1 px-6 py-3 bg-stone-800 text-stone-100 rounded-xl font-semibold hover:bg-stone-700 transition-all inline-flex items-center justify-center gap-2"
          >
            Друг регион
          </button>
        </div>
      </div>
    );
  }

  return null;
}

function Footer() {
  return (
    <footer className="border-t border-stone-800 bg-stone-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Mountain className="w-5 h-5 text-amber-500" />
          <span className="font-semibold">Диалектни Думи</span>
        </div>
        <p className="text-stone-500 text-sm">
          Речник на българските диалектни думи по региони
        </p>
      </div>
    </footer>
  );
}
