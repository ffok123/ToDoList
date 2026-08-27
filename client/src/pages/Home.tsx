/**
 * Design: 「晨霧工作檯」— 暖米白紙感、鼠尾草綠行動訊號、非對稱工作檯佈局。
 * The calendar controls a task’s date, while the long-form list remains ordered in clear date groups.
 */
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
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

const parseDateKey = (dateKey: string) => new Date(`${dateKey}T12:00:00`);
const todayKey = getDateKey(new Date());
const storageKey = "morning-desk-todos";

const starterTodos: Todo[] = [
  { id: "focus", text: "安排 30 分鐘的深度工作", completed: false, createdAt: 1, dateKey: todayKey },
  { id: "reply", text: "回覆今天最重要的一封信", completed: false, createdAt: 2, dateKey: todayKey },
  { id: "review", text: "整理下一步的專案筆記", completed: true, createdAt: 3, dateKey: todayKey },
];

const starterCopy: Record<string, string> = {
  focus: "安排 30 分鐘的深度工作",
  reply: "回覆今天最重要的一封信",
  review: "整理下一步的專案筆記",
};

const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "short",
});

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
          setTodos(parsed.map((todo) => ({
            ...todo,
            text: starterCopy[todo.id] ?? todo.text,
            dateKey: todo.dateKey ?? todayKey,
          })));
        }
      }
    } catch {
      // Keep the starter list when browser storage is unavailable.
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(storageKey, JSON.stringify(todos));
  }, [loaded, todos]);

  const selectedDateKey = useMemo(() => getDateKey(selectedDate), [selectedDate]);
  const selectedDateLabel = useMemo(() => dateFormatter.format(selectedDate), [selectedDate]);
  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;
  const progress = todos.length ? Math.round((completedCount / todos.length) * 100) : 0;

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const groupedTodos = useMemo(() => {
    const groups = new Map<string, Todo[]>();
    filteredTodos.forEach((todo) => groups.set(todo.dateKey, [...(groups.get(todo.dateKey) ?? []), todo]));
    return Array.from(groups.entries()).sort(([firstDate], [secondDate]) => firstDate.localeCompare(secondDate));
  }, [filteredTodos]);

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
    setTodos((current) => current.filter((todo) => !todo.completed));
  };

  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#26342c]">
      <div className="min-h-screen bg-[linear-gradient(115deg,rgba(246,243,236,0.94),rgba(246,243,236,0.78)),url('/manus-storage/todo-paper-texture_a7d47a56.jpg')] bg-cover bg-center">
        <div className="mx-auto flex min-h-screen max-w-[1480px] flex-col px-5 py-5 sm:px-8 sm:py-8 lg:flex-row lg:gap-7 lg:px-10 lg:py-10">
          <aside className="relative overflow-hidden rounded-[2rem] border border-[#fffdf8] bg-[#e8e7dc] px-6 py-7 text-[#33463a] shadow-[0_24px_70px_rgba(89,80,57,0.15)] sm:px-8 lg:flex lg:w-[370px] lg:shrink-0 lg:flex-col lg:px-9 lg:py-10">
            <img
              src="/manus-storage/todo-morning-desk-hero_2439251b.jpg"
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.12] mix-blend-multiply"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(150deg,rgba(251,249,242,0.88),rgba(223,229,216,0.79))]" />
            <div className="pointer-events-none absolute left-0 top-28 h-16 w-1.5 rounded-r-full bg-[#6f8c7a]" />

            <div className="relative z-10 flex items-center justify-between lg:block">
              <div className="flex items-center gap-3">
                <img
                  src="/manus-storage/todo-sage-stamp_fbd4fc25.png"
                  alt="To-Do-List"
                  className="h-11 w-11 rounded-2xl bg-[#f7f4ec] p-2 shadow-[0_3px_10px_rgba(69,83,65,0.12)]"
                />
                <span className="font-serif text-[1.4rem] tracking-[-0.03em]">To-Do-List</span>
              </div>
              <span className="rounded-full border border-[#adb9a8] bg-[#f8f8ef]/70 px-3 py-1 text-[11px] font-semibold tracking-[0.11em] text-[#687768] lg:mt-9 lg:inline-block">
                PERSONAL DESK
              </span>
            </div>

            <div className="relative z-10 mt-10 grid grid-cols-2 gap-3 border-t border-[#bfc8ba] pt-6 lg:mt-auto">
              <div>
                <span className="block font-serif text-3xl tracking-[-0.04em] text-[#33463a]">{activeCount}</span>
                <span className="mt-1 block text-[11px] tracking-[0.1em] text-[#718070]">仍待完成</span>
              </div>
              <div>
                <span className="block font-serif text-3xl tracking-[-0.04em] text-[#33463a]">{completedCount}</span>
                <span className="mt-1 block text-[11px] tracking-[0.1em] text-[#718070]">已完成</span>
              </div>
            </div>
          </aside>

          <section className="flex min-h-[min(760px,calc(100vh-5rem))] min-w-0 flex-1 flex-col rounded-[2rem] border border-white/75 bg-[#fcfaf5]/90 p-5 shadow-[0_20px_65px_rgba(95,82,58,0.10)] backdrop-blur-sm sm:p-8 lg:p-10">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d8d6cc] pb-6">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-[#6f8c7a]">
                <span className="h-2 w-2 rounded-full bg-[#6f8c7a]" />
                選擇任務日期
              </div>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label={`選擇任務日期，目前為 ${selectedDateLabel}`}
                    className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-[#d7d9ce] bg-[#fffdf9] px-4 text-left text-sm font-semibold text-[#33463a] shadow-[0_3px_10px_rgba(89,81,63,0.06)] transition hover:border-[#6f8c7a] hover:bg-[#f7faf4] active:scale-[0.98] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#6f8c7a]/30"
                  >
                    <CalendarDays className="h-4 w-4 text-[#6f8c7a]" />
                    <span>{selectedDateLabel}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-[#788878]" />
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
              <div className="rounded-2xl bg-[#eef2ea] px-4 py-3 text-right">
                <span className="block text-[10px] font-semibold tracking-[0.12em] text-[#6b7b6e]">完成進度</span>
                <span className="mt-0.5 block font-serif text-2xl tracking-[-0.04em] text-[#33463a]">{progress}%</span>
              </div>
            </header>

            <form onSubmit={addTodo} className="mt-6 flex gap-3">
              <label className="sr-only" htmlFor="new-task">新增待辦事項</label>
              <input
                id="new-task"
                value={newTask}
                onChange={(event) => setNewTask(event.target.value)}
                placeholder={`新增 ${selectedDateLabel} 的待辦事項…`}
                className="min-w-0 flex-1 rounded-2xl border border-[#d7d9ce] bg-[#fffdf9] px-5 py-4 text-[15px] text-[#26342c] outline-none transition placeholder:text-[#9da69c] focus:border-[#6f8c7a] focus:ring-4 focus:ring-[#6f8c7a]/15"
              />
              <button
                type="submit"
                aria-label="新增待辦事項"
                className="group inline-flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-2xl bg-[#6f8c7a] text-white shadow-[0_8px_20px_rgba(111,140,122,0.28)] transition duration-150 hover:bg-[#5d7968] active:scale-[0.97] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#6f8c7a]/40"
              >
                <CirclePlus className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90" strokeWidth={1.8} />
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-1 rounded-xl bg-[#f0eee7] p-1" role="tablist" aria-label="篩選待辦事項">
                {(
                  [
                    ["all", "全部"],
                    ["active", "進行中"],
                    ["completed", "已完成"],
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
                  清除已完成
                </button>
              )}
            </div>

            <div className="mt-5 min-h-[340px] flex-1 overflow-y-auto pr-1 sm:min-h-[390px]" aria-label="依日期分組的待辦事項">
              {groupedTodos.length > 0 ? (
                <div className="space-y-7" aria-live="polite">
                  {groupedTodos.map(([dateKey, tasks]) => (
                    <section key={dateKey} aria-labelledby={`date-group-${dateKey}`}>
                      <div className="flex items-center gap-3 border-b border-dashed border-[#d8d6cc] pb-2">
                        <span className="h-2 w-2 rounded-full bg-[#6f8c7a]" />
                        <h2 id={`date-group-${dateKey}`} className="text-[11px] font-semibold tracking-[0.08em] text-[#586a5d]">
                          {dateFormatter.format(parseDateKey(dateKey))}
                        </h2>
                        <span className="h-px flex-1 bg-[#e8e5dc]" />
                        <span className="text-[11px] text-[#899188]">{tasks.length}</span>
                      </div>
                      <ul className="divide-y divide-[#e5e3da]">
                        {tasks.map((todo, index) => (
                          <li
                            key={todo.id}
                            className="todo-row group flex items-center gap-3 py-4 sm:gap-4 sm:py-5"
                            style={{ animationDelay: `${index * 45}ms` }}
                          >
                            <button
                              type="button"
                              onClick={() => toggleTodo(todo.id)}
                              aria-label={todo.completed ? `標示「${todo.text}」為未完成` : `標示「${todo.text}」為已完成`}
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
                              aria-label={`刪除「${todo.text}」`}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#a6aaa2] opacity-100 transition hover:bg-[#f7e8e2] hover:text-[#a45c48] active:scale-90 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#a45c48]/20 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={1.7} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef2ea] text-[#6f8c7a]">
                    {filter === "completed" ? <Sparkles className="h-6 w-6" /> : <ListChecks className="h-6 w-6" />}
                  </div>
                  <h2 className="mt-5 font-serif text-2xl tracking-[-0.03em] text-[#33463a]">
                    {filter === "completed" ? "還沒有完成項目" : "還沒有待辦事項"}
                  </h2>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-[#7d857b]">
                    選擇日期後新增一件事，它會出現在對應的日期群組。
                  </p>
                </div>
              )}
            </div>

            <footer className="mt-5 flex items-center justify-between border-t border-[#e1ded4] pt-5 text-xs text-[#7d857b]">
              <span className="inline-flex items-center gap-1.5"><ChevronRight className="h-3.5 w-3.5 text-[#6f8c7a]" />待辦事項依日期分組並保留在此裝置</span>
              <span className="hidden items-center gap-1 text-[#6f8c7a] sm:inline-flex">慢慢來 <ArrowUpRight className="h-3.5 w-3.5" /></span>
            </footer>
          </section>
        </div>
      </div>
    </main>
  );
}
