/**
 * Design: 「晨霧工作檯」— 暖米白紙感、鼠尾草綠行動訊號、非對稱工作檯佈局。
 * The interface keeps attention on one calm list, with tactile paper layers and restrained feedback.
 */
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  CirclePlus,
  ListChecks,
  Sparkles,
  Trash2,
} from "lucide-react";

type Filter = "all" | "active" | "completed";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

const starterTodos: Todo[] = [
  { id: "focus", text: "安排 30 分鐘深度工作", completed: false, createdAt: 1 },
  { id: "reply", text: "回覆今天最重要的一封信", completed: false, createdAt: 2 },
  { id: "review", text: "整理下一步的專案筆記", completed: true, createdAt: 3 },
];

const storageKey = "morning-desk-todos";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(starterTodos);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Todo[];
        if (Array.isArray(parsed)) setTodos(parsed);
      }
    } catch {
      // Keep the unobtrusive starter list if local storage is unavailable.
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(storageKey, JSON.stringify(todos));
  }, [loaded, todos]);

  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("zh-TW", {
        month: "long",
        day: "numeric",
        weekday: "long",
      }).format(new Date()),
    [],
  );

  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;
  const progress = todos.length ? Math.round((completedCount / todos.length) * 100) : 0;

  const visibleTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const addTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = newTask.trim();
    if (!text) return;
    setTodos((current) => [
      { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() },
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
          <aside className="relative overflow-hidden rounded-[2rem] bg-[#33463a] px-6 py-7 text-[#f9f6ee] shadow-[0_24px_70px_rgba(36,50,42,0.2)] sm:px-8 lg:flex lg:w-[370px] lg:shrink-0 lg:flex-col lg:px-9 lg:py-10">
            <img
              src="/manus-storage/todo-morning-desk-hero_2439251b.jpg"
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.18] mix-blend-luminosity"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(150deg,rgba(37,57,45,0.96),rgba(53,70,58,0.83))]" />

            <div className="relative z-10 flex items-center justify-between lg:block">
              <div className="flex items-center gap-3">
                <img
                  src="/manus-storage/todo-sage-stamp_fbd4fc25.png"
                  alt="今日清單"
                  className="h-11 w-11 rounded-2xl bg-[#f7f4ec] p-2 shadow-sm"
                />
                <span className="font-serif text-[1.4rem] tracking-[-0.03em]">今日清單</span>
              </div>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-[0.11em] text-[#e6eee6] lg:mt-9 lg:inline-block">
                PERSONAL DESK
              </span>
            </div>

            <div className="relative z-10 mt-10 max-w-[290px] sm:mt-12 lg:mt-auto">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-[#bdd0c0]">TODAY’S FOCUS</p>
              <h1 className="mt-3 font-serif text-4xl leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-[3.5rem]">
                先留一件事<br />給今天。
              </h1>
              <p className="mt-5 max-w-[250px] text-sm leading-6 text-[#d6e0d5]">
                讓清單替你收好雜訊，為真正重要的事留一段專注。
              </p>
            </div>

            <div className="relative z-10 mt-8 grid grid-cols-2 gap-3 border-t border-white/15 pt-6 lg:mt-12">
              <div>
                <span className="block font-serif text-3xl tracking-[-0.04em]">{activeCount}</span>
                <span className="mt-1 block text-[11px] tracking-[0.1em] text-[#bdd0c0]">仍待完成</span>
              </div>
              <div>
                <span className="block font-serif text-3xl tracking-[-0.04em]">{completedCount}</span>
                <span className="mt-1 block text-[11px] tracking-[0.1em] text-[#bdd0c0]">已完成</span>
              </div>
            </div>
          </aside>

          <section className="flex min-w-0 flex-1 flex-col rounded-[2rem] border border-white/75 bg-[#fcfaf5]/90 p-5 shadow-[0_20px_65px_rgba(95,82,58,0.10)] backdrop-blur-sm sm:p-8 lg:p-10">
            <header className="flex flex-wrap items-start justify-between gap-5 border-b border-[#d8d6cc] pb-7">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-[#6f8c7a]">
                  <span className="h-2 w-2 rounded-full bg-[#6f8c7a]" />
                  今日的工作檯
                </div>
                <h2 className="mt-2 font-serif text-3xl tracking-[-0.04em] text-[#26342c] sm:text-4xl">{dateLabel}</h2>
              </div>
              <div className="rounded-2xl bg-[#eef2ea] px-4 py-3 text-right">
                <span className="block text-[10px] font-semibold tracking-[0.12em] text-[#6b7b6e]">完成進度</span>
                <span className="mt-0.5 block font-serif text-2xl tracking-[-0.04em] text-[#33463a]">{progress}%</span>
              </div>
            </header>

            <form onSubmit={addTodo} className="mt-7 flex gap-3 sm:mt-9">
              <label className="sr-only" htmlFor="new-task">新增待辦事項</label>
              <input
                id="new-task"
                value={newTask}
                onChange={(event) => setNewTask(event.target.value)}
                placeholder="寫下下一件重要的事…"
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

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 sm:mt-10">
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

            <div className="mt-5 flex flex-1 flex-col">
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
              ) : (
                <div className="my-auto flex flex-col items-center px-6 py-14 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef2ea] text-[#6f8c7a]">
                    {filter === "completed" ? <Sparkles className="h-6 w-6" /> : <ListChecks className="h-6 w-6" />}
                  </div>
                  <h3 className="mt-5 font-serif text-2xl tracking-[-0.03em] text-[#33463a]">
                    {filter === "completed" ? "還沒有完成項目" : "這裡剛好留白了"}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-[#7d857b]">
                    {filter === "completed" ? "完成一件事，它會安靜地收在這裡。" : "從上方寫下一件小事，讓今天有一個清楚的開始。"}
                  </p>
                </div>
              )}
            </div>

            <footer className="mt-7 flex items-center justify-between border-t border-[#e1ded4] pt-5 text-xs text-[#7d857b]">
              <span className="inline-flex items-center gap-1.5"><ChevronRight className="h-3.5 w-3.5 text-[#6f8c7a]" />所有項目會保留在此裝置</span>
              <span className="hidden items-center gap-1 text-[#6f8c7a] sm:inline-flex">慢慢來 <ArrowUpRight className="h-3.5 w-3.5" /></span>
            </footer>
          </section>
        </div>
      </div>
    </main>
  );
}
