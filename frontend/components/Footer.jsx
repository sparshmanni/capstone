export default function Footer() {
  return (
    <footer className="h-[72px] border-t bg-[var(--card)]">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between text-sm opacity-80">
        <p>© {new Date().getFullYear()} AI Tutor (Capstone)</p>
        <p>Inclusive chat • Text • Voice • Gestures</p>
        <p>AI tutor can make mistakes</p>
      </div>
    </footer>
  );
}
