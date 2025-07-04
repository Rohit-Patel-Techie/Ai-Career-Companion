export default function Footer() {
  return (
    <footer className="bg-[var(--color-bg)] text-[var(--color-text)] border-t border-[var(--color-muted)] px-6 py-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto text-center space-y-2">
        <p className="text-base font-medium">
          © {new Date().getFullYear()} <span className="text-[var(--color-primary)]">AI Career Companion</span>. All rights reserved.
        </p>
        <p className="text-sm text-[var(--color-primary-dark)]">
          Made with ❤️ by <span className="font-semibold">Rohit Patel</span>
        </p>
      </div>
    </footer>
  );
}
