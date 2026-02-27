import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-white">404</h1>
        <p className="text-slate-300">Page not found.</p>
        <Link
          to="/"
          className="inline-flex rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-orange-400"
        >
          Go Home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
