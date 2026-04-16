import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { articles, loadArticleContent } from "@/data/articles";
import { analyzeArticle, type SeoAnalysis } from "@/lib/seo-analyzer";
import { ChevronDown, Download, Search, Lock } from "lucide-react";

const DASHBOARD_PASSWORD = "femradd2026";

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === DASHBOARD_PASSWORD) {
      sessionStorage.setItem("seo-auth", "true");
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 max-w-sm w-full text-center">
        <Lock className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-xl font-bold text-foreground mb-2">SEO Dashboard</h1>
        <p className="text-sm text-muted-foreground mb-6">Vendosni fjalëkalimin për të aksesuar</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Fjalëkalimi..."
          className={`w-full px-4 py-3 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-4 ${error ? "border-red-500 shake" : "border-border"}`}
          autoFocus
        />
        {error && <p className="text-red-500 text-sm mb-3">Fjalëkalim i gabuar</p>}
        <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Hyr
        </button>
      </form>
    </main>
  );
}

type FilterScore = "all" | "passing" | "warning" | "failing";
type SortKey = "score" | "title" | "words" | "links";

function scoreColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
}

function severityDot(severity: string): string {
  if (severity === "good") return "bg-green-500";
  if (severity === "error") return "bg-red-500";
  if (severity === "warning") return "bg-yellow-500";
  return "bg-blue-500";
}

function SeoDashboardInner() {
  const [analyses, setAnalyses] = useState<SeoAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [indexingStats, setIndexingStats] = useState({ submitted: 0, total: 0 });
  const [progress, setProgress] = useState({ done: 0, total: articles.length });
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterScore, setFilterScore] = useState<FilterScore>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Set noindex
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    document.title = "SEO Dashboard — FemraDD";

    // Analyze all articles
    let cancelled = false;
    const run = async () => {
      const results: SeoAnalysis[] = [];
      for (let i = 0; i < articles.length; i++) {
        if (cancelled) return;
        const a = articles[i];
        try {
          const content = await loadArticleContent(a.slug);
          results.push(analyzeArticle(a, content));
        } catch {
          results.push(analyzeArticle(a, ""));
        }
        if (i % 10 === 0) setProgress({ done: i + 1, total: articles.length });
      }
      if (!cancelled) {
        setAnalyses(results);
        setLoading(false);
        setProgress({ done: articles.length, total: articles.length });
      }
    };
    run();

    // Fetch indexing stats
    fetch("/sitemap.xml").then(r => r.text()).then(xml => {
      const totalUrls = (xml.match(/<loc>/g) || []).length;
      fetch("https://raw.githubusercontent.com/artan-glitch/femradd-voice/main/.github/submitted-urls.txt")
        .then(r => r.text())
        .then(text => {
          const submitted = text.split("\n").filter(Boolean).length;
          setIndexingStats({ submitted, total: totalUrls });
        })
        .catch(() => setIndexingStats({ submitted: 0, total: totalUrls }));
    });

    return () => {
      cancelled = true;
      meta.remove();
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(articles.map(a => a.categoryLabel));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    let result = analyses.slice();

    if (filterScore === "passing") result = result.filter(a => a.score >= 80);
    else if (filterScore === "warning") result = result.filter(a => a.score >= 60 && a.score < 80);
    else if (filterScore === "failing") result = result.filter(a => a.score < 60);

    if (filterCategory !== "all") {
      const catArticles = articles.filter(a => a.categoryLabel === filterCategory);
      const slugs = new Set(catArticles.map(a => a.slug));
      result = result.filter(a => slugs.has(a.slug));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a => a.title.toLowerCase().includes(q) || a.slug.toLowerCase().includes(q));
    }

    result.sort((a, b) => {
      let diff = 0;
      if (sortKey === "score") diff = a.score - b.score;
      else if (sortKey === "title") diff = a.title.localeCompare(b.title);
      else if (sortKey === "words") diff = a.wordCount - b.wordCount;
      else if (sortKey === "links") diff = a.internalLinks - b.internalLinks;
      return sortAsc ? diff : -diff;
    });

    return result;
  }, [analyses, filterScore, filterCategory, search, sortKey, sortAsc]);

  const stats = useMemo(() => {
    if (analyses.length === 0) return null;
    const total = analyses.length;
    const avgScore = Math.round(analyses.reduce((s, a) => s + a.score, 0) / total);
    const passing = analyses.filter(a => a.score >= 80).length;
    const warning = analyses.filter(a => a.score >= 60 && a.score < 80).length;
    const failing = analyses.filter(a => a.score < 60).length;
    const issueCount: Record<string, number> = {};
    analyses.forEach(a => {
      a.issues.forEach(i => {
        if (i.severity !== "good") {
          issueCount[i.category] = (issueCount[i.category] || 0) + 1;
        }
      });
    });
    const topIssues = Object.entries(issueCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return { total, avgScore, passing, warning, failing, topIssues };
  }, [analyses]);

  const exportCsv = () => {
    const header = ["Slug", "Titulli", "Rezultati", "Vleresimi", "Fjalë", "Titulli (karaktere)", "Përshkrimi (karaktere)", "Lidhje brendshme", "Lidhje të jashtme", "H2", "Imazhe", "FAQ"];
    const rows = filtered.map(a => [
      a.slug,
      `"${a.title.replace(/"/g, '""')}"`,
      a.score,
      a.grade,
      a.wordCount,
      a.titleLength,
      a.descriptionLength,
      a.internalLinks,
      a.externalLinks,
      a.h2Count,
      a.imageCount,
      a.hasFaqs ? "Po" : "Jo",
    ]);
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `femradd-seo-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    const percent = Math.round((progress.done / progress.total) * 100);
    return (
      <main className="container py-12 min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Duke analizuar {progress.total} artikuj...</h1>
        <div className="w-full max-w-md bg-muted rounded-full h-3 overflow-hidden">
          <div className="bg-primary h-full transition-all duration-300" style={{ width: `${percent}%` }} />
        </div>
        <p className="text-muted-foreground text-sm mt-2">{progress.done} / {progress.total}</p>
      </main>
    );
  }

  return (
    <main className="container py-8 md:py-12 min-h-[60vh]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">SEO Dashboard</h1>
          <p className="text-muted-foreground mt-1">Analiza e plotë SEO e të gjithë artikujve</p>
        </div>
        <button onClick={exportCsv} className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          <Download className="w-4 h-4" />
          Eksporto CSV
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Total artikuj</div>
            <div className="text-2xl font-bold text-foreground mt-1">{stats.total}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Rezultati mesatar</div>
            <div className="text-2xl font-bold text-foreground mt-1">{stats.avgScore}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Duke kaluar (≥80)</div>
            <div className="text-2xl font-bold text-green-600 mt-1">{stats.passing}</div>
            <div className="text-xs text-muted-foreground">{Math.round(stats.passing / stats.total * 100)}%</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Paralajmërime (60-79)</div>
            <div className="text-2xl font-bold text-yellow-600 mt-1">{stats.warning}</div>
            <div className="text-xs text-muted-foreground">{Math.round(stats.warning / stats.total * 100)}%</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Problematike (&lt;60)</div>
            <div className="text-2xl font-bold text-red-600 mt-1">{stats.failing}</div>
            <div className="text-xs text-muted-foreground">{Math.round(stats.failing / stats.total * 100)}%</div>
          </div>
        </div>
      )}

      {/* Google Indexing Status */}
      {indexingStats.total > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Google Indeksimi (vlerësim)</h3>
            <span className="text-xs text-muted-foreground">Bazuar në URL-t e dërguara në GSC</span>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <span className="text-2xl font-bold text-green-600">{indexingStats.submitted}</span>
              <span className="text-muted-foreground text-sm"> / {indexingStats.total}</span>
              <div className="text-xs text-muted-foreground mt-1">URL të dërguara për indeksim</div>
            </div>
            <div className="flex-1">
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="bg-green-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((indexingStats.submitted / indexingStats.total) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{Math.round((indexingStats.submitted / indexingStats.total) * 100)}% e dërguar</span>
                <span>{indexingStats.total - indexingStats.submitted} në pritje</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {stats && stats.topIssues.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">Problemet më të shpeshta</h3>
          <div className="space-y-2">
            {stats.topIssues.map(([category, count]) => (
              <div key={category} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{category}</span>
                <span className="font-semibold text-foreground">{count} artikuj</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kërko titull ose slug..."
            className="w-full pl-10 pr-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select value={filterScore} onChange={(e) => setFilterScore(e.target.value as FilterScore)} className="px-3 py-2 bg-card border border-border rounded-lg text-sm">
          <option value="all">Të gjitha</option>
          <option value="passing">Duke kaluar (≥80)</option>
          <option value="warning">Paralajmërim (60-79)</option>
          <option value="failing">Problematik (&lt;60)</option>
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-lg text-sm">
          <option value="all">Të gjitha kategoritë</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={`${sortKey}:${sortAsc ? "asc" : "desc"}`}
          onChange={(e) => {
            const [k, dir] = e.target.value.split(":");
            setSortKey(k as SortKey);
            setSortAsc(dir === "asc");
          }}
          className="px-3 py-2 bg-card border border-border rounded-lg text-sm"
        >
          <option value="score:asc">Rezultati (më i ulët → më i lartë)</option>
          <option value="score:desc">Rezultati (më i lartë → më i ulët)</option>
          <option value="title:asc">Titulli (A-Z)</option>
          <option value="words:asc">Fjalë (më pak → më shumë)</option>
          <option value="words:desc">Fjalë (më shumë → më pak)</option>
          <option value="links:asc">Lidhjet e brendshme</option>
        </select>
      </div>

      <p className="text-sm text-muted-foreground mb-4">Shfaqen {filtered.length} nga {analyses.length} artikuj</p>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Rezultati</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Titulli</th>
                <th className="text-right px-4 py-3 font-semibold text-foreground">Fjalë</th>
                <th className="text-right px-4 py-3 font-semibold text-foreground">Lidhje</th>
                <th className="text-right px-4 py-3 font-semibold text-foreground">H2</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <>
                  <tr
                    key={a.slug}
                    className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => setExpanded(expanded === a.slug ? null : a.slug)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${scoreColor(a.score)}`} />
                        <span className="font-bold text-foreground">{a.score}</span>
                        <span className="text-xs text-muted-foreground">{a.grade}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-md">
                      <div className="truncate text-foreground font-medium">{a.title}</div>
                      <div className="truncate text-xs text-muted-foreground">/{a.slug}</div>
                    </td>
                    <td className="text-right px-4 py-3 text-muted-foreground">{a.wordCount}</td>
                    <td className="text-right px-4 py-3 text-muted-foreground">{a.internalLinks}</td>
                    <td className="text-right px-4 py-3 text-muted-foreground">{a.h2Count}</td>
                    <td className="px-4 py-3">
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expanded === a.slug ? "rotate-180" : ""}`} />
                    </td>
                  </tr>
                  {expanded === a.slug && (
                    <tr key={`${a.slug}-details`} className="bg-muted/20">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <Link to={`/artikull/${a.slug}`} target="_blank" className="text-primary hover:underline font-medium text-sm">
                              Hap artikullin →
                            </Link>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Titulli: {a.titleLength}/60 · Përshkrimi: {a.descriptionLength}/155 · Imazhe: {a.imageCount}
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          {a.issues.map((issue, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${severityDot(issue.severity)}`} />
                              <div className="flex-1">
                                <span className="text-xs uppercase font-semibold text-muted-foreground mr-2">[{issue.category}]</span>
                                <span className="text-foreground">{issue.message}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default function SeoDashboard() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("seo-auth") === "true");
  if (!authed) return <PasswordGate onUnlock={() => setAuthed(true)} />;
  return <SeoDashboardInner />;
}
