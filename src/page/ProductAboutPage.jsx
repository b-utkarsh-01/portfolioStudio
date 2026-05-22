const ProductAboutPage = () => (
  <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:space-y-6 sm:rounded-3xl sm:p-12">
    <h1 className="text-4xl font-semibold leading-tight text-slate-100 sm:text-4xl">About Portfolio Studio</h1>
    <p className="max-w-3xl text-lg leading-relaxed text-slate-300 sm:text-xl">
      Portfolio Studio is a full-stack platform designed to help professionals, students, and
      creators build polished portfolios quickly without starting from zero.
    </p>

    <div className="grid gap-4 sm:grid-cols-2">
      <article className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
        <h2 className="text-base font-semibold text-slate-100">Structured Profile Management</h2>
        <p className="mt-1 text-sm text-slate-300">
          Manage profile details, skills, education, projects, services, and certifications from one
          unified dashboard.
        </p>
      </article>
      <article className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
        <h2 className="text-base font-semibold text-slate-100">Template-Driven Rendering</h2>
        <p className="mt-1 text-sm text-slate-300">
          Use the same data across multiple template styles, so you can switch design direction
          without rewriting content.
        </p>
      </article>
      <article className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
        <h2 className="text-base font-semibold text-slate-100">Secure Authentication and APIs</h2>
        <p className="mt-1 text-sm text-slate-300">
          Built with JWT-based authentication, protected API routes, and reliable MongoDB persistence
          for production-grade workflows.
        </p>
      </article>
      <article className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
        <h2 className="text-base font-semibold text-slate-100">Public Shareable Portfolio URL</h2>
        <p className="mt-1 text-sm text-slate-300">
          Generate a unique public portfolio link for each user and share it confidently in job
          applications, resumes, or LinkedIn.
        </p>
      </article>
    </div>
  </section>
);

export default ProductAboutPage;
