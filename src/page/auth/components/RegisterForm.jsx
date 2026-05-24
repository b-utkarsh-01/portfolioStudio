import RegisterStageFields from "./RegisterStageFields";

const RegisterForm = ({
  stageIndex,
  totalStages,
  activeStage,
  error,
  submitting,
  isLastStage,
  values,
  handlers,
  onSubmit,
  onCreateAccount,
  onBack,
  onNext,
}) => (
  <div className="space-y-4 rounded-2xl border border-slate-700 bg-slate-950/30 p-4 sm:p-5">
    <p className="text-xs text-slate-400">
      Step {stageIndex + 1} of {totalStages}
    </p>

    <RegisterStageFields activeStage={activeStage} values={values} handlers={handlers} />

    {error ? <p className="text-sm text-rose-300">{error}</p> : null}

    <div className="flex flex-wrap gap-2">
      {stageIndex > 0 ? (
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
        >
          Back
        </button>
      ) : null}
      {!isLastStage ? (
        <button
          type="button"
          onClick={onNext}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-400"
        >
          Next
        </button>
      ) : (
        <button
          type="button"
          onClick={onCreateAccount}
          disabled={submitting}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-400"
        >
          {submitting ? "Please wait..." : "Create account"}
        </button>
      )}
    </div>
  </div>
);

export default RegisterForm;
