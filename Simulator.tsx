import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Video, Sparkles, RotateCcw, Square } from 'lucide-react';

type Track = 'pm' | 'econ' | 'dev';
interface Q { company: string; title: string; badge: string; sec: number; text: string; tip: string }

const TRACKS: { id: Track; label: string; color: string }[] = [
  { id: 'pm', label: 'Product & Project', color: '#00d2ff' },
  { id: 'econ', label: 'Экономика & Закупки', color: '#A4F4FD' },
  { id: 'dev', label: 'Dev / Engineering', color: '#10b981' },
];

const QUESTIONS: Record<Track, Q[]> = {
  pm: [
    { company: 'Яндекс', title: 'Конфликт сроков и бизнеса', badge: 'STAR', sec: 120, text: 'Расскажите о ситуации, когда сроки проекта конфликтовали с ожиданиями бизнеса. Что вы сделали?', tip: 'Ситуация — 15 с, действия — 60 с, результат с цифрами — 30 с.' },
    { company: 'Сбер / Т-Банк', title: 'Рассказ о себе', badge: 'Скрининг', sec: 90, text: 'Расскажите о себе: бэкграунд, сильные стороны и проект, которым гордитесь.', tip: '20 с — кто вы, 50 с — результат, 20 с — зачем вам эта роль.' },
    { company: 'Общий', title: 'Приоритизация задач', badge: 'Hard Skills', sec: 120, text: 'У вас 5 задач и ресурсов на 2. Как вы выберете, что делать?', tip: 'Назовите критерий (ценность/срочность/риск) и покажите на примере.' },
  ],
  econ: [
    { company: 'Закупки', title: 'Выбор поставщика', badge: 'Кейс', sec: 120, text: 'Два поставщика предлагают одинаковую цену. По каким критериям вы выберете одного?', tip: 'Качество, сроки, надёжность, условия оплаты, риски — и как проверите каждый.' },
    { company: 'Корпоративный кейс', title: 'ROI нового софта', badge: 'Hard Skills', sec: 180, text: 'Как оценить окупаемость внедрения нового ПО в отделе?', tip: 'Затраты → эффект в деньгах/часах → срок окупаемости → риски.' },
    { company: 'Общий', title: 'Почему мы?', badge: 'Мотивация', sec: 90, text: 'Почему вы хотите работать именно в нашей компании?', tip: 'Один факт о компании + один ваш навык, который ей полезен.' },
  ],
  dev: [
    { company: 'Яндекс', title: 'Сложный баг', badge: 'STAR', sec: 120, text: 'Расскажите о самом сложном баге, который вы находили. Как искали причину?', tip: 'Гипотезы, инструменты, как убедились, что починили.' },
    { company: 'Kaspersky', title: 'Code review', badge: 'Процесс', sec: 90, text: 'Что для вас важно при ревью чужого кода?', tip: 'Читаемость, тесты, риски, тон обратной связи.' },
    { company: 'Ozon', title: 'Производительность', badge: 'Hard Skills', sec: 150, text: 'Страница стала грузиться медленно. С чего начнёте?', tip: 'Сначала измерьте (Lighthouse/профайлер), потом оптимизируйте узкое место.' },
  ],
};

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export const Simulator: React.FC<{ onSignup: () => void }> = ({ onSignup }) => {
  const [track, setTrack] = useState<Track>('econ');
  const [idx, setIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(QUESTIONS.econ[0].sec);
  const [camError, setCamError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const q = QUESTIONS[track][idx];

  const stopCam = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const select = (t: Track, i: number) => {
    setRunning(false);
    stopCam();
    setCamError('');
    setTrack(t);
    setIdx(i);
    setLeft(QUESTIONS[t][i].sec);
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (running && left === 0) {
      setRunning(false);
      stopCam();
    }
  }, [left, running]);

  useEffect(() => stopCam, []);

  const start = async () => {
    setCamError('');
    setLeft(q.sec);
    setRunning(true);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = s;
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch {
      setCamError('Камера недоступна — тренируйтесь только с таймером.');
    }
  };

  const finished = !running && left === 0;
  const progress = (left / q.sec) * 100;

  return (
    <section id="simulator" className="max-w-6xl mx-auto px-6 py-16 md:py-24 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl overflow-hidden border border-white/10 bg-[#0e1014]/90 backdrop-blur-2xl shadow-2xl"
      >
        <div className="h-10 bg-black/40 border-b border-white/10 px-4 flex items-center justify-between">
          <div className="flex gap-2" aria-hidden>
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs text-white/50 font-medium">PrepCam Studio — попробуйте прямо здесь</span>
          <span className="w-12" />
        </div>

        <div className="grid md:grid-cols-12 min-h-[520px]">
          <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-white/10 p-4">
            <div className="flex flex-wrap gap-2 mb-4" role="tablist">
              {TRACKS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={track === t.id}
                  onClick={() => select(t.id, 0)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition ${
                    track === t.id ? 'bg-white text-black font-semibold' : 'bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                  {t.label}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {QUESTIONS[track].map((item, i) => (
                <button
                  key={item.title}
                  onClick={() => select(track, i)}
                  className={`w-full text-left p-3 rounded-xl border transition ${
                    i === idx ? 'bg-white/10 border-white/20' : 'bg-white/[0.02] border-white/5 hover:bg-white/5'
                  }`}
                >
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-cyan-400 font-medium">{item.company}</span>
                    <span className="text-white/40">{fmt(item.sec)}</span>
                  </div>
                  <div className="text-xs font-semibold text-white mb-1.5">{item.title}</div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-white/60">{item.badge}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-7 p-5 flex flex-col gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-white/40 font-semibold">
                Вопрос {idx + 1} из {QUESTIONS[track].length}
              </span>
              <h3 className="text-base font-semibold text-white mt-1 leading-snug">«{q.text}»</h3>
            </div>

            <div className="rounded-xl p-3.5 bg-cyan-950/20 border border-cyan-500/20">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Подсказка по структуре
              </div>
              <p className="text-xs text-white/70 leading-relaxed">{q.tip}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/60 p-3">
              <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${running ? 'bg-red-500 animate-ping' : 'bg-white/30'}`} />
                  {running ? 'Идёт запись' : finished ? 'Время вышло' : 'Готов к старту'}
                </span>
                <span className="font-mono text-cyan-400" aria-live="off">{fmt(left)}</span>
              </div>
              <div className="h-1 rounded-full bg-white/10 mb-3 overflow-hidden">
                <div className="h-full bg-cyan-400 transition-[width] duration-1000 ease-linear" style={{ width: `${progress}%` }} />
              </div>
              <div className="h-40 rounded-lg bg-white/[0.03] border border-dashed border-white/10 flex items-center justify-center overflow-hidden relative">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`absolute inset-0 w-full h-full object-cover -scale-x-100 ${running && !camError ? '' : 'hidden'}`}
                />
                {!(running && !camError) && (
                  <div className="text-center text-xs text-white/50 px-4">
                    <Video className="w-6 h-6 mx-auto mb-1 text-white/40" />
                    {camError || 'Камера включится после старта. Видео не покидает ваш браузер.'}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-auto">
              <button
                onClick={running ? () => select(track, idx) : start}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition"
              >
                {running ? <Square className="w-3.5 h-3.5" /> : finished ? <RotateCcw className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                {running ? 'Остановить' : finished ? 'Ещё раз' : 'Начать ответ'}
              </button>
              <button onClick={onSignup} className="text-xs text-white/60 hover:text-white transition">
                Сохранять записи → создать аккаунт
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
