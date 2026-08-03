// src/app/page.jsx
import ThemeToggle from '@/components/common/ThemeToggle';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold text-[var(--color-text-main)]">
        🌸 به زیبانو خوش آمدید
      </h1>
      <p className="text-lg text-[var(--color-text-secondary)]">
        پروژه با موفقیت راه‌اندازی شد!
      </p>

      <ThemeToggle />

      <div className="w-full max-w-md p-6 rounded-2xl border-2 bg-[var(--color-card)] border-[var(--color-border)]">
        <h2 className="text-xl font-bold mb-4 text-[var(--color-text-main)]">
          تست تم
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          این کارت با تغییر تم، رنگ‌هایش عوض می‌شود
        </p>
        <button
          className="w-full mt-4 py-3 rounded-xl text-white font-bold bg-[var(--color-primary)]"
        >
          دکمه Primary
        </button>
      </div>
    </main>
  );
}