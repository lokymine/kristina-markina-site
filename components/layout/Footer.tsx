export default function Footer() {
  return (
    <footer className="mt-24 border-t border-neutral-200 py-10">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} Кристина Маркина
        <br />
        Все права защищены.
      </div>
    </footer>
  );
}