/* ==========================================================================
   Собеседуй.РФ — Логика: База вопросов, чистый синтез речи, распознавание
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. КОНФИГУРАЦИЯ И ОПЦИИ ДЛЯ ВСПЛЫВАЮЩИХ КАРТОЧЕК
   -------------------------------------------------------------------------- */
const MODAL_CONFIGS = {
  role: {
    title: "Выберите направление карьеры",
    options: [
      { id: "pm", icon: "💼", title: "Управление продуктом (PM)", desc: "Приоритеты, метрики, запуск фичей, работа с разработкой и бизнесом." },
      { id: "dev", icon: "💻", title: "Разработка (Frontend / Backend)", desc: "Алгоритмы, веб-стандарты, базы данных, архитектура и пет-проекты." },
      { id: "analytics", icon: "📊", title: "Аналитика данных & BI", desc: "SQL, продуктовые метрики, A/B тесты, поиск точек роста продукта." },
      { id: "econ", icon: "📈", title: "Экономика, Финансы & Закупки", desc: "Оценка рентабельности, сметы, юнит-экономика, аудит поставщиков." },
      { id: "marketing", icon: "🎯", title: "Маркетинг & Привлечение", desc: "Воронки конверсий, перформанс, креативы и привлечение аудитории." }
    ]
  },
  exp: {
    title: "Укажите ваш уровень опыта",
    options: [
      { id: "no_exp", icon: "🎓", title: "Студент / Стажировка (Без опыта)", desc: "Вопросы о мотивации, проектах в вузе, хакатонах, быстрой обучаемости." },
      { id: "junior_plus", icon: "⚡", title: "Младший специалист (до 1 года)", desc: "Базовые боевые задачи, понимание командных процессов и первых ошибок." },
      { id: "exp", icon: "🚀", title: "Опытный специалист (Middle+)", desc: "Архитектурные кейсы, управление рисками, дедлайнами и цифрами бизнеса." }
    ]
  },
  company: {
    title: "Выберите масштаб и культуру компании",
    options: [
      { id: "bigtech", icon: "🏢", title: "Big Tech (Яндекс, Т-Банк, Сбер)", desc: "Строгие скрининги, культура фидбека, системные кейсы и английский язык." },
      { id: "sme", icon: "⚡", title: "Малый & Средний бизнес / Стартапы", desc: "Универсальность, готовность брать ответственность за весь процесс сразу." },
      { id: "corp", icon: "🏛️", title: "Традиционные корпорации & Банки", desc: "Регламенты, безопасность, надежность и структурный документооборот." }
    ]
  },
  mode: {
    title: "Выберите формат прохождения",
    options: [
      { id: "mock", icon: "🎙️", title: "Собеседование с голосом", desc: "Интервьюер задает вопрос вслух четким голосом, вы отвечаете на камеру." },
      { id: "card", icon: "📹", title: "Видеовизитка (Асинхронно)", desc: "Текстовые карточки вопросов с лимитом времени на раздумья." }
    ]
  }
};

let currentSelection = {
  role: "pm",
  exp: "no_exp",
  company: "bigtech",
  mode: "mock"
};

/* --------------------------------------------------------------------------
   2. МАСШТАБНАЯ БАЗА ВОПРОСОВ (1-й вопрос ВСЕГДА о себе, 8 RU + 2 EN)
   -------------------------------------------------------------------------- */
const QUESTIONS_BASE = [
  // --- БАЗОВЫЕ ВОПРОСЫ О СЕБЕ (СТАРТОВЫЙ ВОПРОС №1) ---
  {
    id: "intro_student",
    role: "all",
    exp: "no_exp",
    lang: "ru",
    theme: "Знакомство",
    text: "Расскажите немного о себе: на кого учитесь, почему выбрали эту специальность и какими учебными или личными проектами больше всего гордитесь?",
    prep: 60,
    hint: "Сделайте упор на практические навыки, инициативность и почему вы хотите начать карьеру именно сейчас."
  },
  {
    id: "intro_exp",
    role: "all",
    exp: "exp",
    lang: "ru",
    theme: "Знакомство",
    text: "Расскажите кратко о своем профессиональном пути: за какие зоны ответственности вы отвечали на последних проектах и какой результат считаете главным?",
    prep: 60,
    hint: "Структура: текущая роль -> главные результаты в цифрах -> мотивация к новым вызовам."
  },

  // --- ВОПРОС №2: МОТИВАЦИЯ И ИНТЕРЕС К КОМПАНИИ ---
  {
    id: "why_company_bigtech",
    role: "all",
    exp: "all",
    lang: "ru",
    theme: "Мотивация",
    text: "Почему вы хотите пройти стажировку именно в нашей компании, а не у конкурентов? Что вы уже знаете о наших продуктах?",
    prep: 60,
    hint: "Назовите конкретные продукты компании, которыми вы пользуетесь, и как стажировка впишется в ваши цели."
  },

  // --- PRODUCT MANAGEMENT ---
  {
    id: "pm_stud_1",
    role: "pm",
    exp: "no_exp",
    lang: "ru",
    theme: "Продуктовое мышление",
    text: "Каким сервисом или мобильным приложением вы пользуетесь каждый день? Какую главную проблему пользователя оно решает и какую одну вещь вы бы в нем улучшили?",
    prep: 60,
    hint: "Не говорите про интерфейс. Опишите сценарий пользователя (Job to be Done) и измеримую пользу."
  },
  {
    id: "pm_stud_2",
    role: "pm",
    exp: "no_exp",
    lang: "ru",
    theme: "Приоритеты задач",
    text: "Вам нужно запустить студенческий проект за 2 недели, но команда не успевает сделать весь функционал. Как вы выберете, что выпустить в первую очередь, а что отрезать?",
    prep: 60,
    hint: "Объясните концепцию MVP (минимально жизнеспособного продукта) и приоритизацию по ценности."
  },
  {
    id: "pm_exp_1",
    role: "pm",
    exp: "exp",
    lang: "ru",
    theme: "Анализ метрик",
    text: "Метрика удержания пользователей (Retention 7-го дня) упала на 12% за неделю. Ваши пошаговые действия по локализации проблемы?",
    prep: 75,
    hint: "Разделяйте на когорты пользователей, сбои релизов, источники трафика и внешние факторы."
  },

  // --- IT И РАЗРАБОТКА ---
  {
    id: "dev_stud_1",
    role: "dev",
    exp: "no_exp",
    lang: "ru",
    theme: "Основы технологий",
    text: "Расскажите простыми словами, что происходит, когда вы вводите адрес сайта в строке браузера и нажимаете Enter?",
    prep: 60,
    hint: "DNS-запрос, IP-адрес, соединение с сервером, получение HTML/CSS/JS и рендеринг страницы браузером."
  },
  {
    id: "dev_stud_2",
    role: "dev",
    exp: "no_exp",
    lang: "ru",
    theme: "Пет-проекты",
    text: "С какими самыми сложными багами или трудностями вы столкнулись при написании своего последнего курсового или личного проекта? Как искали решение?",
    prep: 60,
    hint: "Расскажите про работу с логами, отладку, чтение документации и терпение при поиске ошибки."
  },

  // --- ЭКОНОМИКА И ЗАКУПКИ ---
  {
    id: "econ_stud_1",
    role: "econ",
    exp: "no_exp",
    lang: "ru",
    theme: "Финансовый анализ",
    text: "Как бы вы подошли к оценке целесообразности закупки нового оборудования или платного сервиса для отдела? На какие цифры обратите внимание?",
    prep: 60,
    hint: "Упомяните совокупную стоимость владения (TCO), окупаемость (ROI) и экономию рабочего времени сотрудников."
  },
  {
    id: "econ_stud_2",
    role: "econ",
    exp: "no_exp",
    lang: "ru",
    theme: "Аудит и контроль",
    text: "Представьте, что поставщик прислал коммерческое предложение со стоимостью на 25% выше среднерыночной. Ваши действия?",
    prep: 60,
    hint: "Запрос калькуляции затрат, анализ альтернатив на рынке, переговоры по объему партии и условиям оплаты."
  },

  // --- УНИВЕРСАЛЬНЫЕ ПОВЕДЕНЧЕСКИЕ (STAR) ---
  {
    id: "team_conflict",
    role: "all",
    exp: "all",
    lang: "ru",
    theme: "Командная работа",
    text: "Вспомните ситуацию, когда ваш коллега или одногруппник в совместном проекте сорвал свои сроки. Что именно вы сделали, чтобы проект состоялся?",
    prep: 60,
    hint: "Опишите по методу STAR: Ситуация -> Ваша конкретная задача -> Ваши действия -> Измеримый итог."
  },
  {
    id: "feedback_handling",
    role: "all",
    exp: "all",
    lang: "ru",
    theme: "Обучаемость и критика",
    text: "Как вы относитесь к жесткой критике вашей работы? Приведите пример, когда вам указали на существенную ошибку, и что изменилось после этого.",
    prep: 60,
    hint: "Покажите зрелость: отделение критики от эмоций, благодарность за фидбек и системные выводы."
  },

  // --- АНГЛИЙСКИЙ БЛОК (ВОПРОСЫ 9 И 10) ---
  {
    id: "en_pitch",
    role: "all",
    exp: "all",
    lang: "en",
    theme: "English Screening",
    text: "Could you briefly introduce yourself in English? What are your key strengths and what drives you to apply for this internship?",
    prep: 60,
    hint: "Keep it simple and confident. Focus on your university background, passion for learning, and project focus."
  },
  {
    id: "en_challenge",
    role: "all",
    exp: "all",
    lang: "en",
    theme: "English Behavioral",
    text: "Tell me about a difficult problem or academic assignment you had to solve recently. How did you manage it?",
    prep: 60,
    hint: "Describe the challenge, your thought process, and what you learned from that experience."
  }
];

const PARASITE_WORDS = [
  "как бы", "в общем", "типа", "короче", "ну", "эээ", "ммм", "собственно", 
  "значит", "так сказать", "по сути", "в целом", "like", "you know", "basically"
];

/* --------------------------------------------------------------------------
   3. УПРАВЛЕНИЕ ВСПЛЫВАЮЩИМИ КАРТОЧКАМИ ВЫБОРА
   -------------------------------------------------------------------------- */
let activeModalType = null;

function openModalSelector(type) {
  activeModalType = type;
  const config = MODAL_CONFIGS[type];
  document.getElementById('modalTitle').innerText = config.title;

  const container = document.getElementById('modalCardsContainer');
  container.innerHTML = "";

  config.options.forEach(opt => {
    const card = document.createElement('div');
    card.className = "pop-card-option";
    card.onclick = () => selectOptionAndClose(type, opt);
    card.innerHTML = `
      <span class="pop-card-icon">${opt.icon}</span>
      <h4 class="pop-card-title">${opt.title}</h4>
      <p class="pop-card-desc">${opt.desc}</p>
    `;
    container.appendChild(card);
  });

  document.getElementById('cardsModal').classList.add('open');
}

function selectOptionAndClose(type, option) {
  currentSelection[type] = option.id;

  if (type === 'role') {
    document.getElementById('selectedRoleText').innerText = option.title;
    document.getElementById('roleIcon').innerText = option.icon;
  } else if (type === 'exp') {
    document.getElementById('selectedExpText').innerText = option.title;
    document.getElementById('expIcon').innerText = option.icon;
  } else if (type === 'company') {
    document.getElementById('selectedCompanyText').innerText = option.title;
    document.getElementById('companyIcon').innerText = option.icon;
  } else if (type === 'mode') {
    document.getElementById('selectedModeText').innerText = option.title;
    document.getElementById('modeIcon').innerText = option.icon;
  }

  closeModalSelector();
}

function closeModalSelector() {
  document.getElementById('cardsModal').classList.remove('open');
}

/* --------------------------------------------------------------------------
   4. СБОРКА 10 ВОПРОСОВ (1-Й О СЕБЕ + 7 ПРОФИЛЬНЫХ + 2 НА АНГЛИЙСКОМ)
   -------------------------------------------------------------------------- */
function generate10QuestionsSession() {
  const { role, exp } = currentSelection;
  let result = [];

  // 1. Первый вопрос ВСЕГДА рассказ о себе
  const introQuestion = (exp === 'no_exp') 
    ? QUESTIONS_BASE.find(q => q.id === "intro_student")
    : QUESTIONS_BASE.find(q => q.id === "intro_exp");
  result.push(introQuestion);

  // 2. Второй вопрос — мотивация и компания
  result.push(QUESTIONS_BASE.find(q => q.id === "why_company_bigtech"));

  // 3. Профильные и поведенческие вопросы (набираем еще 6 вопросов)
  let poolRu = QUESTIONS_BASE.filter(q => 
    q.lang === 'ru' && 
    q.id !== "intro_student" && 
    q.id !== "intro_exp" && 
    q.id !== "why_company_bigtech" &&
    (q.role === role || q.role === 'all')
  );

  // Если не хватает, берем любые релевантные
  if (poolRu.length < 6) {
    const extra = QUESTIONS_BASE.filter(q => q.lang === 'ru' && !poolRu.includes(q));
    poolRu = poolRu.concat(extra);
  }

  // Перемешиваем и берем 6
  const shuffledRu = poolRu.sort(() => 0.5 - Math.random()).slice(0, 6);
  result = result.concat(shuffledRu);

  // 4. Вопросы 9 и 10 — английский блок
  const enQuestions = QUESTIONS_BASE.filter(q => q.lang === 'en').slice(0, 2);
  result = result.concat(enQuestions);

  return result;
}

/* --------------------------------------------------------------------------
   5. ЧЕТКИЙ СИНТЕЗ РЕЧИ (WEB SPEECH API БЕЗ КАШИ)
   -------------------------------------------------------------------------- */
let preferredVoiceRu = null;
let preferredVoiceEn = null;

function loadBestVoices() {
  if (!('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();

  // Выбираем самые четкие голоса (Microsoft Pavel/Irina, Google Русский, Apple Yuri/Milena)
  preferredVoiceRu = voices.find(v => v.lang.includes('ru') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Pavel') || v.name.includes('Yuri'))) ||
                     voices.find(v => v.lang.includes('ru'));

  preferredVoiceEn = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))) ||
                     voices.find(v => v.lang.includes('en'));
}

if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadBestVoices;
  loadBestVoices();
}

function speakQuestionClearly(text, lang, onEndCallback) {
  if (!('speechSynthesis' in window)) {
    if (onEndCallback) onEndCallback();
    return;
  }

  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);

  // Скорость 0.92 — оптимально для чистого разборчивого произношения
  utter.rate = 0.92;
  utter.pitch = 1.0;

  if (lang === 'en') {
    utter.lang = 'en-US';
    if (preferredVoiceEn) utter.voice = preferredVoiceEn;
  } else {
    utter.lang = 'ru-RU';
    if (preferredVoiceRu) utter.voice = preferredVoiceRu;
  }

  const avatar = document.getElementById('aiAvatar');
  const status = document.getElementById('aiSpeechStatus');

  utter.onstart = () => {
    avatar.classList.add('speaking');
    status.innerText = "Озвучивает вопрос...";
  };
  utter.onend = () => {
    avatar.classList.remove('speaking');
    status.innerText = "Внимательно слушает вас";
    if (onEndCallback) onEndCallback();
  };
  utter.onerror = () => {
    avatar.classList.remove('speaking');
    if (onEndCallback) onEndCallback();
  };

  window.speechSynthesis.speak(utter);
}

/* --------------------------------------------------------------------------
   6. ХОД ИНТЕРВЬЮ: ШТОРКА ГОТОВНОСТИ И ТАЙМЕРЫ
   -------------------------------------------------------------------------- */
let activeQuestions = [];
let currentQIndex = 0;
let prepTimer = null;
let secondsLeft = 0;
let answerStartTime = null;

let webcamStream = null;
let mediaRecorder = null;
let recordedChunks = [];
let interviewResults = [];

let speechRecognizer = null;
let currentAnswerTranscript = "";

async function startInterviewFlow() {
  activeQuestions = generate10QuestionsSession();
  currentQIndex = 0;
  interviewResults = [];

  try {
    webcamStream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
      audio: true
    });
    document.getElementById('userCameraStream').srcObject = webcamStream;

    openScreen('interviewScreen');
    presentQuestionGate(0);
  } catch (err) {
    alert("Пожалуйста, разрешите доступ к камере и микрофону, чтобы пройти видеособеседование.");
    console.error(err);
  }
}

// Показываем подтверждение: пользователь должен нажать «Готов слушать»
function presentQuestionGate(index) {
  if (index >= activeQuestions.length) {
    finishInterviewSession();
    return;
  }

  currentQIndex = index;
  const q = activeQuestions[index];

  // Сбрасываем видимость самого вопроса
  document.getElementById('questionGateBox').style.display = 'block';
  document.getElementById('questionContentBox').classList.remove('active');

  // Обновляем верхние плашки
  document.getElementById('questionStepPill').innerText = `Вопрос ${index + 1} из 10`;
  document.getElementById('questionThemePill').innerText = q.theme;
  document.getElementById('timerBadge').innerText = "Ожидание готовности...";
  document.getElementById('transcriptPanel').innerText = "Расшифровка начнется во время ответа...";

  document.getElementById('btnStartAnswerNow').style.display = 'inline-block';
  document.getElementById('btnFinishAnswer').style.display = 'none';
}

// Пользователь подтвердил готовность — открываем текст и озвучиваем
function revealAndSpeakQuestion() {
  const q = activeQuestions[currentQIndex];

  document.getElementById('questionGateBox').style.display = 'none';
  document.getElementById('questionContentBox').classList.add('active');

  document.getElementById('activeQuestionText').innerText = q.text;
  document.getElementById('activeQuestionHint').innerText = q.hint ? `Подсказка: ${q.hint}` : '';

  // Озвучиваем, если выбран режим интервьюера
  if (currentSelection.mode === 'mock') {
    speakQuestionClearly(q.text, q.lang, () => {
      startPrepCountdown(q.prep);
    });
  } else {
    startPrepCountdown(q.prep);
  }
}

function startPrepCountdown(seconds) {
  secondsLeft = seconds;
  updateTimerUI("Подготовка");
  clearInterval(prepTimer);

  prepTimer = setInterval(() => {
    secondsLeft--;
    updateTimerUI("Подготовка");
    if (secondsLeft <= 0) {
      clearInterval(prepTimer);
      startRecordingAnswer();
    }
  }, 1000);
}

function skipPrepAndAnswer() {
  clearInterval(prepTimer);
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  document.getElementById('aiAvatar').classList.remove('speaking');
  startRecordingAnswer();
}

function startRecordingAnswer() {
  recordedChunks = [];
  currentAnswerTranscript = "";
  answerStartTime = Date.now();

  const q = activeQuestions[currentQIndex];

  // Запуск Speech Recognition
  startSpeechRecognition(q.lang);

  // Запуск записи видео
  try {
    mediaRecorder = new MediaRecorder(webcamStream, { mimeType: 'video/webm' });
  } catch (e) {
    mediaRecorder = new MediaRecorder(webcamStream);
  }

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) recordedChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
    const duration = Math.max(1, Math.round((Date.now() - answerStartTime) / 1000));
    const analysis = analyzeSpeechPurity(currentAnswerTranscript, duration);

    interviewResults.push({
      question: q.text,
      theme: q.theme,
      lang: q.lang,
      videoBlob: videoBlob,
      transcript: currentAnswerTranscript.trim(),
      analysis: analysis
    });

    // Переходим к следующему вопросу (через карточку подтверждения)
    presentQuestionGate(currentQIndex + 1);
  };

  mediaRecorder.start();

  document.getElementById('recBadge').classList.add('active');
  document.getElementById('btnStartAnswerNow').style.display = 'none';
  document.getElementById('btnFinishAnswer').style.display = 'inline-block';

  // Лимит на ответ — 2.5 минуты
  secondsLeft = 150;
  updateTimerUI("Идёт ответ");
  clearInterval(prepTimer);
  prepTimer = setInterval(() => {
    secondsLeft--;
    updateTimerUI("Идёт ответ");
    if (secondsLeft <= 0) {
      finishCurrentAnswer();
    }
  }, 1000);
}

function finishCurrentAnswer() {
  clearInterval(prepTimer);
  document.getElementById('recBadge').classList.remove('active');

  if (speechRecognizer) {
    try { speechRecognizer.stop(); } catch (e) {}
  }

  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
}

function updateTimerUI(label) {
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  document.getElementById('timerBadge').innerText = `${label}: ${m}:${s < 10 ? '0' : ''}${s}`;
}

/* --------------------------------------------------------------------------
   7. РАСПОЗНАВАНИЕ РЕЧИ И АНАЛИЗАТОР ПАРАЗИТОВ
   -------------------------------------------------------------------------- */
function startSpeechRecognition(lang) {
  const SpeechApi = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechApi) return;

  speechRecognizer = new SpeechApi();
  speechRecognizer.continuous = true;
  speechRecognizer.interimResults = true;
  speechRecognizer.lang = lang === 'en' ? 'en-US' : 'ru-RU';

  speechRecognizer.onresult = (e) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; ++i) {
      if (e.results[i].isFinal) {
        currentAnswerTranscript += " " + e.results[i][0].transcript;
      } else {
        interim += e.results[i][0].transcript;
      }
    }
    const full = (currentAnswerTranscript + " " + interim).trim();
    document.getElementById('transcriptPanel').innerText = full || "Слушаю вас...";

    // Живой подсчет темпа (WPM)
    const words = full.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(0.08, (Date.now() - answerStartTime) / 60000);
    document.getElementById('livePace').innerText = `${Math.round(words / minutes)} сл/мин`;
  };

  try { speechRecognizer.start(); } catch (e) {}
}

function analyzeSpeechPurity(transcript, durationSec) {
  if (!transcript || transcript.trim().length === 0) {
    return { wordCount: 0, wpm: 0, purity: 100, parasiteCount: 0, highlighted: "Речь не была зафиксирована." };
  }

  const words = transcript.toLowerCase().match(/[a-zA-Zа-яА-Я0-9]+/g) || [];
  const wordCount = words.length;
  const minutes = durationSec / 60;
  const wpm = Math.round(wordCount / minutes);

  let parasiteCount = 0;
  let highlighted = transcript;

  PARASITE_WORDS.forEach(p => {
    const reg = new RegExp(`\\b${p}\\b`, 'gi');
    const matches = transcript.match(reg);
    if (matches) {
      parasiteCount += matches.length;
      highlighted = highlighted.replace(reg, `<mark>${p}</mark>`);
    }
  });

  const purity = wordCount > 0 ? Math.max(0, Math.round(100 - (parasiteCount / wordCount) * 100)) : 100;

  return { wordCount, wpm, purity, parasiteCount, highlighted };
}

/* --------------------------------------------------------------------------
   8. ФИНАЛИЗАЦИЯ И ИСТОРИЯ (IndexedDB)
   -------------------------------------------------------------------------- */
async function finishInterviewSession() {
  if (webcamStream) {
    webcamStream.getTracks().forEach(t => t.stop());
  }

  openScreen('resultsScreen');

  let totalWords = 0;
  let totalWpm = 0;
  let totalPurity = 0;

  interviewResults.forEach(r => {
    totalWords += r.analysis.wordCount;
    totalWpm += r.analysis.wpm;
    totalPurity += r.analysis.purity;
  });

  const avgWpm = Math.round(totalWpm / interviewResults.length) || 0;
  const avgPurity = Math.round(totalPurity / interviewResults.length) || 100;

  document.getElementById('resTotalWords').innerText = totalWords;
  document.getElementById('resAvgPace').innerText = avgWpm;
  document.getElementById('resAvgPurity').innerText = `${avgPurity}%`;

  const container = document.getElementById('resultsAnswersList');
  container.innerHTML = "";

  interviewResults.forEach((ans, idx) => {
    const card = document.createElement('div');
    card.className = "answer-item-card";
    const vUrl = URL.createObjectURL(ans.videoBlob);

    const purityClass = ans.analysis.purity > 90 ? "green" : (ans.analysis.purity > 70 ? "yellow" : "red");

    card.innerHTML = `
      <div>
        <video src="${vUrl}" controls playsinline></video>
        <div style="margin-top:6px;">
          <a href="${vUrl}" download="sobeseduy_otvet_${idx + 1}.webm" style="color:var(--brand-cyan); font-size:12px; text-decoration:none;">
            📥 Скачать видео (.webm)
          </a>
        </div>
      </div>
      <div class="answer-content">
        <div class="metric-pills">
          <span class="metric-pill ${purityClass}">Чистота речи: ${ans.analysis.purity}%</span>
          <span class="metric-pill green">${ans.analysis.wpm} сл/мин</span>
          <span class="metric-pill yellow">${ans.theme}</span>
        </div>
        <h4>Вопрос ${idx + 1}:</h4>
        <p class="q-desc">${ans.question}</p>
        <div class="transcript-quote">${ans.analysis.highlighted}</div>
      </div>
    `;
    container.appendChild(card);
  });

  await saveToLocalDB({
    date: new Date().toLocaleString('ru-RU'),
    answers: interviewResults,
    avgWpm,
    avgPurity
  });
}

function emergencyStopInterview() {
  if (confirm("Вы уверены, что хотите завершить текущую тренировку?")) {
    if (prepTimer) clearInterval(prepTimer);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (webcamStream) webcamStream.getTracks().forEach(t => t.stop());
    openScreen('setupScreen');
  }
}

/* --------------------------------------------------------------------------
   9. ХРАНИЛИЩЕ INDEXEDDB
   -------------------------------------------------------------------------- */
const DB_NAME = "SobeseduyRF_DB";
const STORE = "sessions";

function openDB() {
  return new Promise((resolve) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
  });
}

async function saveToLocalDB(item) {
  const db = await openDB();
  const tx = db.transaction([STORE], "readwrite");
  tx.objectStore(STORE).add(item);
}

async function renderHistory() {
  const container = document.getElementById('historyListContainer');
  container.innerHTML = "<p>Загрузка архива...</p>";

  const db = await openDB();
  const tx = db.transaction([STORE], "readonly");
  const req = tx.objectStore(STORE).getAll();

  req.onsuccess = () => {
    const items = req.result || [];
    if (items.length === 0) {
      container.innerHTML = "<p style='color:var(--text-secondary);'>У вас пока нет сохраненных сессий.</p>";
      return;
    }

    container.innerHTML = "";
    items.reverse().forEach((sess) => {
      const div = document.createElement('div');
      div.className = "history-item";
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <b>Тренировка от ${sess.date}</b>
          <span style="color:var(--brand-cyan);">${sess.answers.length} ответов</span>
        </div>
        <div style="font-size:13px; color:var(--text-secondary);">
          Темп речи: ${sess.avgWpm} сл/мин · Чистота: ${sess.avgPurity}%
        </div>
      `;
      container.appendChild(div);
    });
  };
}

async function clearAllHistory() {
  if (!confirm("Очистить все сохраненные сессии?")) return;
  const db = await openDB();
  const tx = db.transaction([STORE], "readwrite");
  tx.objectStore(STORE).clear();
  tx.oncomplete = () => renderHistory();
}

/* --------------------------------------------------------------------------
   10. НАВИГАЦИЯ И ОКНА
   -------------------------------------------------------------------------- */
function openScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');

  if (screenId === 'historyScreen') {
    renderHistory();
  }
}

function openAuthModal() { document.getElementById('authModal').classList.add('open'); }
function closeAuthModal() { document.getElementById('authModal').classList.remove('open'); }

function switchAuthTab(type) {
  document.getElementById('tabLogin').classList.toggle('active', type === 'login');
  document.getElementById('tabReg').classList.toggle('active', type === 'reg');
  document.getElementById('regNameGroup').style.display = type === 'reg' ? 'block' : 'none';
}

function handleAuthSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('userNameInput').value || "Студент";
  alert(`Добро пожаловать, ${name}! Профиль сохранен локально.`);
  closeAuthModal();
}