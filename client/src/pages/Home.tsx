/**
 * Design: “Morning Desk” — warm paper surfaces, sage-green task signals, and an asymmetric desk layout.
 * The page keeps controls compact, groups every task by its chosen calendar day, and leaves generous room for the list.
 */
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  CirclePlus,
  ListChecks,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Filter = "all" | "active" | "completed";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  dateKey: string;
};

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const todayKey = getDateKey(new Date());

const starterTodos: Todo[] = [
  { id: "focus", text: "Block out 30 minutes for deep work", completed: false, createdAt: 1, dateKey: todayKey },
  { id: "reply", text: "Reply to the day’s most important email", completed: false, createdAt: 2, dateKey: todayKey },
  { id: "review", text: "Review notes for the next project step", completed: true, createdAt: 3, dateKey: todayKey },
];

const storageKey = "morning-desk-todos";

const legacyStarterCopy: Record<string, string> = {
  focus: "Block out 30 minutes for deep work",
  reply: "Reply to the day’s most important email",
  review: "Review notes for the next project step",
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(starterTodos);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Todo[];
        if (Array.isArray(parsed)) {
          setTodos(
            parsed.map((todo) => ({
              ...todo,
              text: legacyStarterCopy[todo.id] ?? todo.text,
              dateKey: todo.dateKey ?? todayKey,
            })),
          );
        }
      }
    } catch {
      // Keep the lightweight starter list when browser storage is unavailable.
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(storageKey, JSON.stringify(todos));
  }, [loaded, todos]);

  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        weekday: "long",
      }).format(selectedDate),
    [selectedDate],
  );

  const shortDateLabel = useMemo(
    () => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(selectedDate),
    [selectedDate],
  );

  const deskMonth = useMemo(
    () => new Intl.DateTimeFormat("en-US", { month: "short" }).format(selectedDate).toUpperCase(),
    [selectedDate],
  );

  const deskWeekday = useMemo(
    () => new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(selectedDate).toUpperCase(),
    [selectedDate],
  );

  const selectedDateKey = useMemo(() => getDateKey(selectedDate), [selectedDate]);
  const dateTodos = todos.filter((todo) => todo.dateKey === selectedDateKey);
  const completedCount = dateTodos.filter((todo) => todo.completed).length;
  const activeCount = dateTodos.length - completedCount;
  const progress = dateTodos.length ? Math.round((completedCount / dateTodos.length) * 100) : 0;

  const visibleTodos = dateTodos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const addTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = newTask.trim();
    if (!text) return;
    setTodos((current) => [
      { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now(), dateKey: selectedDateKey },
      ...current,
    ]);
    setNewTask("");
    setFilter("all");
  };

  const toggleTodo = (id: string) => {
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos((current) => current.filter((todo) => todo.dateKey !== selectedDateKey || !todo.completed));
  };

  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#26342c]">
      <div className="min-h-screen bg-[linear-gradient(115deg,rgba(246,243,236,0.94),rgba(246,243,236,0.78)),url('/manus-storage/todo-paper-texture_a7d47a56.jpg')] bg-cover bg-center">
        <div className="mx-auto flex min-h-screen max-w-[1480px] flex-col px-5 py-5 sm:px-8 sm:py-8 lg:flex-row lg:gap-7 lg:px-10 lg:py-10">
          <aside className="relative overflow-hidden rounded-[2rem] border border-[#fffdf7] bg-[#e9e5d8] px-6 py-7 text-[#33463a] shadow-[0_24px_70px_rgba(89,80,57,0.15)] sm:px-8 lg:flex lg:w-[330px] lg:shrink-0 lg:flex-col lg:px-8 lg:py-9">
            <img
              src="/manus-storage/todo-morning-desk-hero_2439251b.jpg"
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.11] mix-blend-multiply"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(150deg,rgba(250,248,241,0.86),rgba(226,231,217,0.76))]" />
            <div className="pointer-events-none absolute left-0 top-32 h-16 w-1.5 rounded-r-full bg-[#6f8c7a]" />

            <div className="relative z-10 flex items-center justify-between lg:block">
              <div className="flex items-center gap-3">
                <img
                  src="/manus-storage/todo-sage-stamp_fbd4fc25.png"
                  alt="Today List brand mark"
                  className="h-11 w-11 rounded-2xl bg-[#f7f4ec] p-2 shadow-[0_3px_10px_rgba(69,83,65,0.12)]"
                />
                <div>
                  <span className="block font-serif text-[1.4rem] tracking-[-0.03em]">今日清單</span>
                  <span className="mt-0.5 block text-[9px] font-semibold tracking-[0.15em] text-[#728072]">TODAY LIST</span>
                </div>
              </div>
              <span className="rounded-full border border-[#a9b8a7] bg-[#f7f7ee]/70 px-3 py-1 text-[11px] font-semibold tracking-[0.11em] text-[#667767] lg:mt-7 lg:inline-block">
                DAILY DESK
              </span>
            </div>

            <div className="relative z-10 mt-10 lg:mt-12">
              <div className="absolute inset-x-3 top-2 h-full rounded-2xl border border-[#cad2c5] bg-[#dce3d8]" />
              <div className="relative overflow-hidden rounded-2xl border border-[#c5cdbc] bg-[#f8f7ef]/90 px-5 py-5 shadow-[0_8px_18px_rgba(89,100,81,0.08)]">
                <div className="absolute right-0 top-0 h-9 w-9 rounded-bl-[1.4rem] border-b border-l border-[#c5cdbc] bg-[#eef2ea]" />
                <span className="block text-[9px] font-semibold tracking-[0.15em] text-[#728072]">DATE NOTE</span>
                <div className="mt-3 flex items-end justify-between">
                  <span className="font-serif text-6xl leading-none tracking-[-0.08em] text-[#33463a]">{selectedDate.getDate()}</span>
                  <div className="pb-1 text-right">
                    <span className="block text-xs font-semibold tracking-[0.13em] text-[#6f8c7a]">{deskMonth}</span>
                    <span className="mt-1 block text-[9px] tracking-[0.1em] text-[#7d887c]">{deskWeekday}</span>
                  </div>
                </div>
                <div className="mt-4 h-px bg-[#d7ddd0]" />
                <span className="mt-3 block text-[10px] tracking-[0.08em] text-[#718070]">YOUR TASKS, ONE DAY AT A TIME</span>
              </div>
            </div>

            <div className="relative z-10 mt-8 grid grid-cols-2 gap-3 border-t border-[#bfc8ba] pt-6 lg:mt-auto">
              <div>
                <span className="block font-serif text-3xl tracking-[-0.04em] text-[#33463a]">{activeCount}</span>
                <span className="mt-1 block text-[11px] tracking-[0.1em] text-[#718070]">TO DO</span>
              </div>
              <div>
                <span className="block font-serif text-3xl tracking-[-0.04em] text-[#33463a]">{completedCount}</span>
                <span className="mt-1 block text-[11px] tracking-[0.1em] text-[#718070]">DONE</span>
              </div>
            </div>
          </aside>

          <section className="relative flex min-h-[min(760px,calc(100vh-5rem))] min-w-0 flex-1 flex-col overflow-hidden rounded-[2rem] border border-white/75 bg-[#fcfaf5]/90 p-5 shadow-[0_20px_65px_rgba(95,82,58,0.10)] backdrop-blur-sm sm:p-8 lg:p-9">
            <div className="pointer-events-none absolute right-8 top-0 h-1 w-20 rounded-b-full bg-[#6f8c7a]/75" />
            <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#d8d6cc] pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-[#6f8c7a]">
                  <span className="h-4 w-1 rounded-full bg-[#6f8c7a]" />
                  SELECTED DAY
                </div>
                <h2 className="mt-2 font-serif text-3xl tracking-[-0.04em] text-[#26342c] sm:text-4xl">{dateLabel}</h2>
              </div>
              <div className="flex items-center gap-3">
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-[#d7d9ce] bg-[#fffdf9] px-3.5 text-left text-xs font-semibold text-[#45554a] transition hover:border-[#6f8c7a] hover:bg-[#f7faf4] active:scale-[0.98] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#6f8c7a]/30"
                    >
                      <CalendarDays className="h-4 w-4 text-[#6f8c7a]" />
                      <span className="hidden sm:inline">{shortDateLabel}</span>
                      <span className="sm:hidden">Pick date</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-auto rounded-2xl border-[#d7d9ce] bg-[#fffdf9] p-2 shadow-[0_18px_45px_rgba(59,66,53,0.18)]">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date);
                          setCalendarOpen(false);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <div className="rounded-2xl bg-[#eef2ea] px-3.5 py-2.5 text-right">
                  <span className="block text-[9px] font-semibold tracking-[0.1em] text-[#6b7b6e]">PROGRESS</span>
                  <span className="mt-0.5 block font-serif text-2xl tracking-[-0.04em] text-[#33463a]">{progress}%</span>
                </div>
              </div>
            </header>

            <form onSubmit={addTodo} className="relative mt-5 flex gap-3 before:absolute before:bottom-4 before:left-0 before:h-5 before:w-1 before:rounded-r-full before:bg-[#6f8c7a]">
              <label className="sr-only" htmlFor="new-task">Add a task for the selected date</label>
              <input
                id="new-task"
                value={newTask}
                onChange={(event) => setNewTask(event.target.value)}
                placeholder={`Add a task for ${shortDateLabel}…`}
                className="min-w-0 flex-1 rounded-2xl border border-[#d7d9ce] bg-[#fffdf9] px-5 py-3.5 pl-6 text-[15px] text-[#26342c] outline-none transition placeholder:text-[#9da69c] focus:border-[#6f8c7a] focus:ring-4 focus:ring-[#6f8c7a]/15"
              />
              <button
                type="submit"
                aria-label="Add task to selected date"
                className="group inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-[#6f8c7a] text-white shadow-[0_8px_20px_rgba(111,140,122,0.28)] transition duration-150 hover:bg-[#5d7968] active:scale-[0.97] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#6f8c7a]/40"
              >
                <CirclePlus className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90" strokeWidth={1.8} />
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-1 rounded-xl bg-[#f0eee7] p-1" role="tablist" aria-label="Task filter">
                {(
                  [
                    ["all", "All"],
                    ["active", "Active"],
                    ["completed", "Done"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    role="tab"
                    aria-selected={filter === value}
                    onClick={() => setFilter(value)}
                    className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition active:scale-[0.97] ${
                      filter === value
                        ? "bg-[#fffdf9] text-[#33463a] shadow-[0_2px_7px_rgba(68,61,46,0.09)]"
                        : "text-[#7d857b] hover:text-[#33463a]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={clearCompleted}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9c6552] transition hover:text-[#7f4f3e] active:scale-[0.97]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear completed
                </button>
              )}
            </div>

            <div className="mt-3 min-h-[340px] flex-1 overflow-y-auto pr-1 sm:mt-4 sm:min-h-[390px]" aria-label={`Task list for ${shortDateLabel}`}>
              <div className="flex items-center gap-3 border-b border-dashed border-[#d8d6cc] py-3">
                <span className="h-2 w-2 rounded-full bg-[#6f8c7a]" />
                <span className="text-[10px] font-semibold tracking-[0.13em] text-[#758274]">TASKS FOR {shortDateLabel.toUpperCase()}</span>
                <span className="h-px flex-1 bg-[#e7e4da]" />
                <span className="text-[11px] text-[#889087]">{dateTodos.length}</span>
              </div>
              {visibleTodos.length > 0 ? (
                <ul className="divide-y divide-[#e5e3da]" aria-live="polite">
                  {visibleTodos.map((todo, index) => (
                    <li
                      key={todo.id}
                      className="todo-row group flex items-center gap-3 py-4 sm:gap-4 sm:py-5"
                      style={{ animationDelay: `${index * 45}ms` }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleTodo(todo.id)}
                        aria-label={todo.completed ? `Mark “${todo.text}” as active` : `Mark “${todo.text}” as complete`}
                        aria-pressed={todo.completed}
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition duration-150 active:scale-90 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#6f8c7a]/30 ${
                          todo.completed
                            ? "border-[#6f8c7a] bg-[#6f8c7a] text-white"
                            : "border-[#b9c1b7] bg-transparent text-transparent hover:border-[#6f8c7a]"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </button>
                      <span
                        className={`min-w-0 flex-1 text-[15px] leading-6 transition ${
                          todo.completed ? "text-[#929b90] line-through decoration-[#aab6a9] decoration-[1.5px]" : "text-[#314036]"
                        }`}
                      >
                        {todo.text}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteTodo(todo.id)}
                        aria-label={`Delete “${todo.text}”`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#a6aaa2] opacity-100 transition hover:bg-[#f7e8e2] hover:text-[#a45c48] active:scale-90 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#a45c48]/20 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.7} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef2ea] text-[#6f8c7a]">
                    {filter === "completed" ? <Sparkles className="h-6 w-6" /> : <ListChecks className="h-6 w-6" />}
                  </div>
                  <h3 className="mt-5 font-serif text-2xl tracking-[-0.03em] text-[#33463a]">
                    {filter === "completed" ? "Nothing completed yet" : "A clear page for this day"}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-[#7d857b]">
                    {filter === "completed" ? "Finish a task and it will settle here quietly." : `Add the first task for ${shortDateLabel}.`}
                  </p>
                </div>
              )}
            </div>

            <footer className="mt-3 flex items-center justify-between border-t border-[#e1ded4] pt-4 text-xs text-[#7d857b]">
              <span className="inline-flex items-center gap-1.5"><ChevronRight className="h-3.5 w-3.5 text-[#6f8c7a]" />Tasks are grouped by their selected date</span>
              <span className="hidden items-center gap-1 text-[#6f8c7a] sm:inline-flex">One day at a time <ArrowUpRight className="h-3.5 w-3.5" /></span>
            </footer>
          </section>
        </div>
      </div>
    </main>
  );
}
