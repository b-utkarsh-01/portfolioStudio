import AiStudioPanel from "../features/ai/AiStudioPanel";

const AiStudioPage = () => {
  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <h1 className="text-3xl font-semibold text-slate-100 sm:text-4xl">AI Portfolio Studio</h1>
      <p className="text-sm text-slate-300">
        Resume + idea do, AI scratch se draft banayega, phir one-click apply karke dashboard me refine/publish karo.
      </p>
      <AiStudioPanel applyRedirectPath="/dashboard" />
    </section>
  );
};

export default AiStudioPage;
