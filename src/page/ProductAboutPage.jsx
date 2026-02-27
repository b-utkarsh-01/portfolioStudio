const ProductAboutPage = () => (
  <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:space-y-6 sm:rounded-3xl sm:p-12">
    <h1 className="text-4xl font-semibold leading-tight text-slate-100 sm:text-4xl">About Portfolio Studio</h1>
    <p className="max-w-3xl text-lg leading-relaxed text-slate-300 sm:text-xl">
      Portfolio Studio is a full-stack product for students and developers who want a clean,
      modern portfolio without building everything from scratch.
    </p>

    <div className="grid gap-4 sm:grid-cols-2">
      <article className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
        <h2 className="text-base font-semibold text-slate-100">Structured Resume Data</h2>
        <p className="mt-1 text-sm text-slate-300">
          Dashboard me aap profile, skills, experience, projects aur certifications directly manage
          kar sakte ho.
        </p>
      </article>
      <article className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
        <h2 className="text-base font-semibold text-slate-100">Template Based Rendering</h2>
        <p className="mt-1 text-sm text-slate-300">
          Same data ko multiple portfolio templates me render kiya jata hai, so design switch karna
          easy hota hai.
        </p>
      </article>
      <article className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
        <h2 className="text-base font-semibold text-slate-100">Secure Auth + API</h2>
        <p className="mt-1 text-sm text-slate-300">
          Backend JWT auth, protected APIs aur MongoDB persistence ke saath built hai.
        </p>
      </article>
      <article className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
        <h2 className="text-base font-semibold text-slate-100">Public Shareable URL</h2>
        <p className="mt-1 text-sm text-slate-300">
          Har user ke liye unique public route generate hota hai jise aap resume ya LinkedIn me use
          kar sakte ho.
        </p>
      </article>
    </div>
  </section>
);

export default ProductAboutPage;
