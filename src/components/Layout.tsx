import React, { useState } from 'react';
import {
  LayoutDashboard,
  Recycle,
  Layers,
  BookOpen,
  ClipboardList,
  CheckSquare,
  BarChart3,
  Settings,
  Sprout,
  Menu,
  X,
  RotateCcw,
  Plus,
} from 'lucide-react';
import { useCompost } from '../context/CompostContext';
import { UI_TEXT } from '../i18n/translations';
import { PageId } from '../types';

const NAV_ITEMS: { id: PageId; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', icon: LayoutDashboard },
  { id: 'sorting', icon: Recycle },
  { id: 'batches', icon: Layers },
  { id: 'guide', icon: BookOpen },
  { id: 'records', icon: ClipboardList },
  { id: 'maturity', icon: CheckSquare },
  { id: 'analytics', icon: BarChart3 },
  { id: 'settings', icon: Settings },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activePage, setActivePage, settings, setLanguage, resetDemoData, wasteEntries, batches } =
    useCompost();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const lang = settings.language;
  const t = UI_TEXT[lang];
  const hasDemoItems =
    settings.demoMode ||
    wasteEntries.some((w) => w.isDemo) ||
    batches.some((b) => b.isDemo);

  const handleNavClick = (id: PageId) => {
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-[#FAF9F5] text-[#18241D]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-[#132A1C] text-white border-r border-[#1E3F2B] z-30">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1E6B3A] flex items-center justify-center shrink-0">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight text-white truncate">
                {t.appTitle}
              </p>
              <p className="text-xs text-[#B7D3C0] mt-0.5 truncate">
                Bannikuppe Station
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Primary Navigation">
          {NAV_ITEMS.map(({ id, icon: Icon }) => {
            const isActive = activePage === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleNavClick(id)}
                className={`w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1E6B3A] text-white'
                    : 'text-[#CFE3D5] hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{t.nav[id]}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="text-xs text-[#B7D3C0]">
            <p className="font-medium text-white truncate">{settings.farmerName}</p>
            <p className="truncate mt-0.5">{settings.village}</p>
          </div>
        </div>
      </aside>

      {/* Mobile Slide-Over Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[85vw] bg-[#132A1C] text-white flex flex-col h-full z-50">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#1E6B3A] flex items-center justify-center shrink-0">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-bold text-white truncate">{t.appTitle}</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[#CFE3D5] hover:bg-white/10"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map(({ id, icon: Icon }) => {
                const isActive = activePage === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleNavClick(id)}
                    className={`w-full min-h-[46px] flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-[#1E6B3A] text-white'
                        : 'text-[#CFE3D5] hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="truncate">{t.nav[id]}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Workspace Bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#E2DDD0]">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-[#18241D]"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-[#526057] truncate">
                  <span className="hidden sm:inline truncate">{t.appTitle}</span>
                  <span className="hidden sm:inline" aria-hidden="true">/</span>
                  <span className="font-semibold text-[#18241D] truncate">{t.nav[activePage]}</span>
                </div>
                <p className="text-xs text-[#526057] truncate hidden md:block mt-0.5">
                  {t.appSubtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Language Switcher */}
              <div
                className="flex items-center p-1 bg-[#F2EFE6] border border-[#E2DDD0] rounded-lg"
                role="group"
                aria-label={t.languageLabel}
              >
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    lang === 'en'
                      ? 'bg-white text-[#18241D] shadow-xs'
                      : 'text-[#526057] hover:text-[#18241D]'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('kn')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    lang === 'kn'
                      ? 'bg-white text-[#18241D] shadow-xs'
                      : 'text-[#526057] hover:text-[#18241D]'
                  }`}
                >
                  ಕನ್ನಡ
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActivePage('sorting')}
                className="hidden sm:inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-lg bg-[#1E6B3A] text-white text-xs font-semibold hover:bg-[#16532C] transition-colors whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{t.quickAddWaste}</span>
              </button>
            </div>
          </div>

          {/* Clear DEMO MODE strip */}
          {hasDemoItems && (
            <div className="px-4 sm:px-6 lg:px-8 py-2 bg-[#F2EFE6] border-t border-[#E2DDD0] flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-[#132A1C] font-medium">
                <span className="font-mono-tabular font-bold tracking-wide px-2 py-0.5 bg-[#132A1C] text-white rounded">
                  DEMO MODE
                </span>
                <span>{t.demoBanner.replace(/^DEMO MODE\s*·\s*/i, '')}</span>
              </div>
              <button
                type="button"
                onClick={resetDemoData}
                className="inline-flex items-center gap-1.5 font-semibold text-[#1E6B3A] hover:text-[#132A1C] underline-offset-2 hover:underline whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.resetDemo}</span>
              </button>
            </div>
          )}
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1320px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
