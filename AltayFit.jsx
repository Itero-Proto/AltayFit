import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Mountain, PlayCircle, Image as ImageIcon, Filter, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// ==========================
// ⚙️ Быстрая настройка
// 1) Замени ссылки mediaUrl на свои фото/видео (mp4, webm, jpg, png, gif).
// 2) При необходимости добавь новые программы и уровни (см. массив PROGRAMS ниже).
// 3) Скачай как один файл или попроси меня упаковать это в ZIP с ассетами.
// ==========================

const PROGRAMS = [
  {
    id: "energy-mountains",
    title: "Энергия гор",
    tagline: "Функциональная силовая тренировка без оборудования",
    levels: ["Лёгкий", "Оздоровительный", "Средний", "Жёсткий"],
    description:
      "Классика с собственным весом: приседания, отжимания, мост, планка, выпады и пресс. Меняем тайминги и вариации под уровень.",
    cover: "/media/energy-cover.jpg", // 🔁 Замени на своё изображение
    days: [
      {
        name: "День 1: База",
        level: "Оздоровительный",
        scheme: "2 круга × 40с работа / 20с отдых",
        exercises: [
          {
            name: "Приседания классические",
            cues: "Ноги на ширине плеч, спина ровная",
            duration: "40с",
            mediaUrl: "/media/exercises/squat.jpg",
          },
          {
            name: "Отжимания от колен",
            cues: "Локти ~45°, корпус прямой",
            duration: "40с",
            mediaUrl: "/media/exercises/pushup-knees.mp4",
          },
          {
            name: "Ягодичный мост",
            cues: "Стопы под коленями, пауза вверху 1–2с",
            duration: "40с",
            mediaUrl: "/media/exercises/glute-bridge.jpg",
          },
          {
            name: "Планка на локтях",
            cues: "Живот подтянут, не проваливай поясницу",
            duration: "20–30с",
            mediaUrl: "/media/exercises/plank-elbows.gif",
          },
          {
            name: "Выпады назад",
            cues: "Колено над стопой, шаг комфортный",
            duration: "40с",
            mediaUrl: "/media/exercises/reverse-lunge.jpg",
          },
          {
            name: "Скручивания лёжа",
            cues: "Подъём плеч от пола, шея расслаблена",
            duration: "40с",
            mediaUrl: "/media/exercises/crunch.gif",
          },
        ],
      },
      {
        name: "День 2: Ноги + пресс",
        level: "Оздоровительный",
        scheme: "3 круга × 35с работа / 25с отдых",
        exercises: [
          {
            name: "Присед с паузой",
            cues: "Задержка 2с внизу",
            duration: "35с",
            mediaUrl: "/media/exercises/squat-pause.jpg",
          },
          {
            name: "Мост с задержкой",
            cues: "Пауза 2с вверху, сжимай ягодицы",
            duration: "35с",
            mediaUrl: "/media/exercises/glute-bridge-hold.gif",
          },
          {
            name: "Боковая планка",
            cues: "По 15–20с на сторону",
            duration: "35–40с",
            mediaUrl: "/media/exercises/side-plank.jpg",
          },
          {
            name: "Выпады в стороны",
            cues: "Таз назад, колено смотрит в носок",
            duration: "35с",
            mediaUrl: "/media/exercises/lateral-lunge.mp4",
          },
          {
            name: "Пресс ‘велосипед’",
            cues: "Темп контролируемый",
            duration: "35с",
            mediaUrl: "/media/exercises/bicycle-crunch.gif",
          },
          {
            name: "Планка касание плеч",
            cues: "Таз стабилен, касаемся поочерёдно",
            duration: "35с",
            mediaUrl: "/media/exercises/plank-shoulder-tap.jpg",
          },
        ],
      },
      {
        name: "День 3: Всё тело + выносливость",
        level: "Оздоровительный",
        scheme: "2–3 круга × 45с работа / 15с отдых",
        exercises: [
          {
            name: "Полуприсед с руками вверх",
            cues: "Движение контролируем, дыхание ровное",
            duration: "45с",
            mediaUrl: "/media/exercises/squat-arms-up.jpg",
          },
          {
            name: "Отжимания (по возможности классика)",
            cues: "Можно начинать с колен, затем прогрессия",
            duration: "45с",
            mediaUrl: "/media/exercises/pushup.mp4",
          },
          {
            name: "Планка динамическая (локти↔ладони)",
            cues: "Кор стабилен, темп средний",
            duration: "45с",
            mediaUrl: "/media/exercises/plank-updown.gif",
          },
          {
            name: "Выпад назад → шаг вперёд",
            cues: "Контроль колена, шаг средней длины",
            duration: "45с",
            mediaUrl: "/media/exercises/reverse-lunge-step.jpg",
          },
          {
            name: "Альпинист",
            cues: "Колени к груди, не ‘проваливайся’ в плечах",
            duration: "45с",
            mediaUrl: "/media/exercises/mountain-climber.mp4",
          },
          {
            name: "Лодочка (удержание)",
            cues: "Ноги и лопатки приподняты, поясница прижата",
            duration: "30–40с",
            mediaUrl: "/media/exercises/boat-hold.jpg",
          },
        ],
      },
    ],
  },
];

// Вспомогалки
function isVideo(url) {
  const u = (url || "").toLowerCase();
  return u.endsWith(".mp4") || u.endsWith(".webm") || u.endsWith(".mov");
}

const LevelBadge = ({ level }) => (
  <Badge className="rounded-2xl px-3 py-1 text-xs font-medium">{level}</Badge>
);

const Media = ({ url, alt }) => {
  if (!url) return (
    <div className="aspect-video flex items-center justify-center bg-muted rounded-xl">
      <ImageIcon className="h-8 w-8 opacity-50" />
    </div>
  );
  if (isVideo(url))
    return (
      <video
        src={url}
        controls
        className="w-full aspect-video rounded-xl"
        preload="metadata"
      />
    );
  return (
    <img
      src={url}
      alt={alt || "exercise"}
      className="w-full aspect-video object-cover rounded-xl"
      loading="lazy"
    />
  );
};

const ExerciseItem = ({ ex, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.25, delay: index * 0.04 }}
  >
    <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
      <CardContent className="p-4 grid gap-3 md:grid-cols-3">
        <div className="md:col-span-1">
          <Media url={ex.mediaUrl} alt={ex.name} />
        </div>
        <div className="md:col-span-2 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-2xl">{ex.duration}</Badge>
            <h4 className="text-base font-semibold">{ex.name}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{ex.cues}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const DayCard = ({ day }) => (
  <Card className="border-0 shadow-sm bg-white/70 dark:bg-zinc-900/60">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg flex items-center gap-2"><Dumbbell className="h-5 w-5" />{day.name}</CardTitle>
      <div className="flex items-center gap-2">
        <LevelBadge level={day.level} />
        <Badge variant="outline" className="rounded-2xl text-xs">{day.scheme}</Badge>
      </div>
    </CardHeader>
    <CardContent className="grid gap-3">
      {day.exercises.map((ex, i) => (
        <ExerciseItem key={ex.name + i} ex={ex} index={i} />
      ))}
    </CardContent>
  </Card>
);

const ProgramCard = ({ program }) => (
  <section className="grid gap-6">
    <motion.div initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="relative h-40 w-full">
          <img src={program.cover} alt={program.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-4 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Mountain className="h-6 w-6" />{program.title}</h2>
            <p className="text-sm opacity-90">{program.tagline}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {program.levels.map((lvl) => (
                <Badge key={lvl} variant="secondary" className="bg-white/90 text-black rounded-2xl">
                  {lvl}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">{program.description}</p>
        </CardContent>
      </Card>
    </motion.div>

    <div className="grid gap-6">
      {program.days.map((d, idx) => (
        <DayCard key={d.name + idx} day={d} />
      ))}
    </div>
  </section>
);

const Toolbar = ({ search, setSearch, levelFilter, setLevelFilter }) => (
  <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4" />
      <span className="text-sm text-muted-foreground">Фильтр</span>
    </div>
    <div className="flex gap-2">
      <Input
        placeholder="Поиск по упражнениям…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-72"
      />
      <select
        value={levelFilter}
        onChange={(e) => setLevelFilter(e.target.value)}
        className="rounded-xl border bg-background px-3 text-sm"
      >
        <option value="">Все уровни</option>
        <option value="Лёгкий">Лёгкий</option>
        <option value="Оздоровительный">Оздоровительный</option>
        <option value="Средний">Средний</option>
        <option value="Жёсткий">Жёсткий</option>
      </select>
    </div>
  </div>
);

export default function App() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  const filteredPrograms = useMemo(() => {
    return PROGRAMS.map((p) => {
      let days = p.days;
      if (levelFilter) days = days.filter((d) => d.level === levelFilter);
      if (search.trim()) {
        const q = search.toLowerCase();
        days = days
          .map((d) => ({
            ...d,
            exercises: d.exercises.filter(
              (ex) => ex.name.toLowerCase().includes(q) || (ex.cues || "").toLowerCase().includes(q)
            ),
          }))
          .filter((d) => d.exercises.length > 0);
      }
      return { ...p, days };
    }).filter((p) => p.days.length > 0);
  }, [search, levelFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 dark:from-zinc-900 dark:to-zinc-950 text-foreground">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/60 border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mountain className="h-6 w-6" />
            <span className="font-semibold">Алтайские тренировки</span>
          </div>
          <Button className="rounded-2xl" variant="secondary" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
            Пролистать вниз <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 grid gap-6">
        <section className="grid gap-2">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Dumbbell className="h-7 w-7" /> Каталог программ
          </h1>
          <p className="text-sm text-muted-foreground">
            Вставь свои фото/видео и используй страницу как мини-приложение для гостей отеля или как медиа-план для занятий.
          </p>
        </section>

        <Toolbar
          search={search}
          setSearch={setSearch}
          levelFilter={levelFilter}
          setLevelFilter={setLevelFilter}
        />

        {filteredPrograms.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Ничего не найдено. Сними фильтры или измени запрос.
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-10">
          {filteredPrograms.map((p) => (
            <ProgramCard key={p.id} program={p} />
          ))}
        </div>

        <section className="grid gap-3 mt-6">
          <Card className="border-0 bg-emerald-100/60 dark:bg-emerald-900/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><PlayCircle className="h-5 w-5" /> Как заменить медиа</CardTitle>
            </CardHeader>
            <CardContent className="text-sm grid gap-2 leading-relaxed">
              <p>1) Подготовь короткие ролики (15–30с) и картинки для каждого упражнения.</p>
              <p>2) В массиве <code>PROGRAMS</code> укажи свои пути: <code>mediaUrl</code> принимает mp4/webm/mov (видео) и jpg/png/gif (изображения).</p>
              <p>3) Для обложки тренировки замени <code>cover</code>. При необходимости добавь новые дни и уровни.</p>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="py-10 text-center text-xs text-muted-foreground">
        Сделано для гостевых программ на Алтае • Собственный вес • Только коврики
      </footer>
    </div>
  );
}
