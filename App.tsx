import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Check, ChevronRight, Menu, X } from 'lucide-react';

import { ProceduralBackground3D } from './components/ProceduralBackground3D';
import { AppleLogo, LogoMark, AppleButton, SectionEyebrow } from './components/SharedPrimitives';
import { AuthModal } from './components/AuthModal';
import { Simulator } from './components/Simulator';

const gradientStyle: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(to right, #091020 0%, #0B2551 12.5%, #A4F4FD 32.5%, #00d2ff 50%, #0B2551 67.5%, #091020 87.5%, #091020 100%)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
  filter: 'url(#c3-noise)',
};

const navItems = [
  { name: 'Тренажер', href: '#simulator' },
  { name: 'Видеовизитки', href: '#triage' },
  { name: 'Аналитика речи', href: '#features' },
  { name: 'Тарифы', href: '#pricing' },
  { name: 'Отзывы', href: '#reviews' },
];
const menuItems = ['File', 'Edit', 'View', 'Go', 'Window', 'Help'];
const companiesList = ['Yandex', 'T-Bank', 'Sber', 'Ozon', 'VK', 'Avito', 'Kaspersky', 'MTS'];

const plans = [
  {
    tier: 'Free Starter', monthly: '0 ₽', yearly: '0 ₽',
    desc: 'Для кандидатов, готовящихся к первому скринингу и видеовизитке.',
    items: ['До 10 тренировочных сессий', 'Локальная запись видео в 1080p', 'Базовые вопросы по направлениям', 'Хранение в памяти браузера'],
    cta: 'Начать бесплатно', pro: false,
  },
  {
    tier: 'Standard Pro', monthly: '990 ₽/мес', yearly: '790 ₽/мес',
    desc: 'Для специалистов, активно рассылающих отклики и проходящих собеседования.',
    items: ['Неограниченные сессии и видео', 'Распознавание речи & поиск паразитов', 'Вопросы из реальных интервью ТОП-20 компаний', 'Экспорт видео и текстовой расшифровки'],
    cta: 'Выбрать план', pro: false,
  },
  {
    tier: 'Executive AI', monthly: '1 990 ₽/мес', yearly: '1 590 ₽/мес',
    desc: 'Для лидов, руководителей и подготовки к ключевым раундам с топ-менеджментом.',
    items: ['Все функции Standard Pro', 'Голосовой AI-интервьюер с имитацией тона', 'Разбор сложных кейсов и системного дизайна', 'Приоритетная персональная поддержка'],
    cta: 'Выбрать Executive', pro: true,
  },
];

const testimonials = [
  { quote: 'PrepCam помог мне полностью пересобрать рассказ о себе. На скрининге в BigTech я говорил четко по таймингу и без пауз.', name: 'Максим Романов', role: 'Product Lead', company: 'FINTECH PLATFORM' },
  { quote: 'Запись видеовизиток прямо с таймером раздумий убирает стресс. Ты видишь свои ошибки до того, как отправил видео эйчару.', name: 'Алена Воронова', role: 'Senior Financial Analyst', company: 'ECOMMERCE HUB' },
  { quote: 'Никаких платных подписок для старта. Вся запись и транскрипт происходят в браузере, а база вопросов покрывает 99% кейсов.', name: 'Илья Мельников', role: 'Frontend Engineer', company: 'CLOUD SERVICES' },
];

const triageCards = [
  { title: 'Приоритетные вопросы (4)', color: '#ffffff', items: ['Самопрезентация — тайминг превышен на 12 сек', 'Кейс по оптимизации — отличная структура'] },
  { title: 'Чистота речи (7)', color: '#e5e5e5', items: ['Паразит «как бы» — 3 повторения', 'Паразит «в общем» — 2 повторения'] },
  { title: 'Поведенческий раунд (18)', color: '#a3a3a3', items: ['STAR: Действие описано подробно', 'Результат подкреплен метриками'] },
  { title: 'Архивировано в память браузера (13)', color: '#737373', items: ['Видеовизитка · скрининг · BI-кейс'] },
];

export const App: React.FC = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [yearly, setYearly] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const clock = now.toLocaleString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const openAuth = () => { setMobileMenuOpen(false); setAuthOpen(true); };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c0c] text-white">
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <filter id="c3-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
          <feComposite in2="SourceGraphic" operator="in" result="noise" />
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
        </filter>
      </svg>

      <ProceduralBackground3D />

      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+36rem)] w-px bg-white/10 z-[5]" />
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+36rem)] w-px bg-white/10 z-[5]" />

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} defaultTab="register" />

      {/* NAVBAR */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-20 max-w-6xl mx-auto px-6 py-5 flex items-center justify-between"
      >
        <button aria-label="Наверх" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <LogoMark className="w-8 h-8 text-white hover:text-cyan-400 transition" />
        </button>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a key={item.name} href={item.href} className="text-white/70 text-sm font-medium hover:text-white transition">
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button onClick={openAuth} className="text-white/80 hover:text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-white/5 transition">
            Войти
          </button>
          <AppleButton label="Регистрация" onClick={openAuth} />
        </div>
        <button
          aria-label="Меню"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </motion.nav>

      {mobileMenuOpen && (
        <div className="md:hidden liquid-glass mx-6 rounded-2xl p-6 mb-6 space-y-4 relative z-30">
          {navItems.map((item) => (
            <a key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white/80">
              {item.name}
            </a>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            <button onClick={openAuth} className="w-full py-2.5 text-sm font-medium rounded-full bg-white/10">Войти в аккаунт</button>
            <AppleButton full label="Регистрация" onClick={openAuth} />
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative z-10 pt-16 md:pt-28 pb-20 text-center flex flex-col items-center px-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
          <SectionEyebrow label="PrepCam AI 2.0" tag="Интервью & Визитки" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-7xl font-semibold tracking-tight leading-[0.9] max-w-4xl"
        >
          <span className="block text-white">Your interview.</span>
          <span className="block animate-shiny mt-2" style={gradientStyle}>Revitalized</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 text-white/60 max-w-lg text-base leading-[1.6]"
        >
          PrepCam — персональная платформа подготовки к собеседованиям нового поколения. AI-интервьюер озвучивает реальные вопросы компаний, оценивает тайминг, слова-паразиты и структурирует ваши видеовизитки.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <div className="flex flex-wrap justify-center gap-3">
            <AppleButton label="Начать тренировку бесплатно" onClick={openAuth} />
            <a href="#simulator" className="rounded-full border border-white/15 text-sm font-medium px-5 py-3 hover:bg-white/5 transition">
              Попробовать без регистрации
            </a>
          </div>
          <span className="text-xs text-white/40">Поддерживает Chrome, Safari & Edge · Без плагинов</span>
        </motion.div>
      </section>

      {/* MENU BAR */}
      <div className="w-full h-10 bg-black/40 backdrop-blur-md border-y border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <AppleLogo className="w-3.5 h-3.5 text-white/80" />
            <span className="font-bold tracking-wide">PrepCam</span>
            {menuItems.map((item, idx) => (
              <span key={item} className={`text-white/60 ${idx > 2 ? 'hidden sm:inline' : ''} ${idx > 3 ? 'hidden md:inline' : ''}`}>
                {item}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 text-white/60">
            <Search className="w-3.5 h-3.5" />
            <span>{clock}</span>
          </div>
        </div>
      </div>

      {/* SIMULATOR */}
      <Simulator onSignup={openAuth} />

      {/* TRIAGE */}
      <section id="triage" className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <SectionEyebrow label="Triage" tag="AI-native" />
            <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02]">
              Отточите самопрезентацию <br /> в один клик.
            </h2>
            <p className="mt-6 text-white/60 text-base leading-[1.6] max-w-md">
              PrepCam распознает каждый записанный ответ, разделяет структуру речи, находит слова-паразиты и подсказывает, как звучать уверенно на собеседованиях любого масштаба.
            </p>
            <div id="features" className="mt-8 flex flex-wrap gap-2">
              {['Автоматический транскрипт', 'Детектор слов-паразитов', 'Таймер на раздумья 60–120с', 'Сохранение в IndexedDB'].map((chip) => (
                <span key={chip} className="text-xs text-white/70 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03]">{chip}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="liquid-glass rounded-2xl p-5 border border-white/10"
          >
            <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Пример отчёта (демо-данные)</span>
              <span className="text-cyan-400">94% готовность</span>
            </div>
            <div className="space-y-3">
              {triageCards.map((card) => (
                <div key={card.title} className="liquid-glass rounded-lg p-3 border border-white/10">
                  <div className="flex items-center justify-between text-xs font-medium mb-2">
                    <span style={{ color: card.color }}>{card.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                  </div>
                  <div className="space-y-1">
                    {card.items.map((it) => (
                      <div key={it} className="text-xs text-white/50 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-cyan-400" />
                        <span>{it}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* LOGOCLOUD */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 relative z-10 text-center">
        <span className="text-xs uppercase tracking-widest text-white/40 font-semibold">
          Сценарии вдохновлены собеседованиями в ведущих компаниях
        </span>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
          {companiesList.map((company, i) => (
            <motion.div
              key={company}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="text-sm font-semibold tracking-tight text-white/50 py-2"
            >
              {company}
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="reviews" className="max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10 relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <figure key={t.name} className="liquid-glass rounded-2xl p-6 flex flex-col justify-between border border-white/10">
              <blockquote className="text-sm text-white/80 leading-[1.6]">«{t.quote}»</blockquote>
              <figcaption className="mt-6 pt-5 border-t border-white/10">
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-white/50">{t.role}</div>
                <div className="text-xs font-semibold tracking-wide uppercase mt-1">{t.company}</div>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-center text-[11px] text-white/30">Примеры отзывов — демонстрационный контент</p>
      </section>

      {/* PRICING */}
      <section id="pricing" className="c3-pricing-section">
        <div className="c3-watermark-container">
          <div className="c3-watermark-main">
            <span className="c3-watermark-line-1">Your interview.</span>
            <span className="c3-watermark-line-2">Revitalized</span>
          </div>
        </div>

        <div className="c3-toggle-wrap">
          <span className="text-xs font-medium text-white/60">Годовая подписка (-20%)</span>
          <button
            onClick={() => setYearly(!yearly)}
            className={`c3-toggle ${yearly ? 'active' : ''}`}
            role="switch"
            aria-checked={yearly}
            aria-label="Годовая подписка"
          >
            <span className="c3-toggle-knob" />
          </button>
        </div>

        <div className="c3-grid">
          {plans.map((p) => (
            <div key={p.tier} className={`c3-card ${p.pro ? 'c3-card-pro' : ''}`}>
              <span className="c3-tier-small">{p.tier}</span>
              <div className="c3-tier-large">{yearly ? p.yearly : p.monthly}</div>
              <div className="c3-desc">{p.desc}</div>
              <ul className="c3-list">
                {p.items.map((it) => (
                  <li key={it}>
                    <span className="c3-check"><Check className="w-3.5 h-3.5 text-white" /></span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
              <button onClick={openAuth} className="c3-btn">{p.cta}</button>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="liquid-glass relative overflow-hidden rounded-3xl px-8 py-16 md:py-24 text-center border border-white/10"
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{ background: 'radial-gradient(600px circle at 50% 0%, rgba(255,255,255,0.15), transparent 70%)' }}
          />
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.02] relative z-10">
            Оставьте волнение позади. <br /> Запишите лучший ответ.
          </h2>
          <p className="mt-6 text-white/60 max-w-md mx-auto text-sm leading-[1.6] relative z-10">
            Тренируйтесь системно и приходите на собеседование подготовленными.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 relative z-10">
            <AppleButton label="Создать аккаунт" onClick={openAuth} />
            <a href="#simulator" className="rounded-full border border-white/15 text-sm font-medium px-5 py-3 hover:bg-white/5 transition flex items-center gap-1.5">
              <span>Попробовать в браузере</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-white/10 py-10 text-xs text-white/40 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LogoMark className="w-5 h-5 text-white/80" />
            <span>PrepCam Studio © {now.getFullYear()}. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#simulator" className="hover:text-white transition">Тренажер</a>
            <a href="#triage" className="hover:text-white transition">Видеовизитки</a>
            <a href="#pricing" className="hover:text-white transition">Тарифы</a>
            <button onClick={openAuth} className="hover:text-white transition">Регистрация</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
