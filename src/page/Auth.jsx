import React from "react";
import AuthModeToggle from "./auth/components/AuthModeToggle";
import LoginForm from "./auth/components/LoginForm";
import RegisterForm from "./auth/components/RegisterForm";
import RegisterStageSidebar from "./auth/components/RegisterStageSidebar";
import useRegisterState from "./auth/hooks/useRegisterState";
import { REGISTER_STAGES } from "./auth/registerStages";

const Auth = () => {
  const {
    mode,
    setMode,
    stageIndex,
    error,
    setError,
    submitting,
    isLastStage,
    activeStage,
    handleSubmit,
    handleCreateAccount,
    handleBack,
    handleNext,
    selectStage,
    values,
    handlers,
  } = useRegisterState();

  return (
    <div
      className={`mx-auto w-full rounded-3xl border border-slate-700 bg-slate-900/70 p-6 transition-all duration-300 ease-out sm:p-8 ${
        mode === "register"
          ? "flex max-w-5xl flex-col overflow-y-auto lg:h-[calc(100dvh-170px)] lg:min-h-0 lg:overflow-hidden"
          : "max-w-md"
      }`}
    >
      <h1 className="text-2xl font-semibold text-slate-100">Portfolio Builder</h1>
      <p className="mt-2 text-sm text-slate-300">
        Sign in and publish your portfolio quickly. On registration, we prefill your dashboard
        data automatically.
      </p>

      <AuthModeToggle
        mode={mode}
        onLogin={() => {
          setMode("login");
          setError("");
        }}
        onRegister={() => {
          setMode("register");
          setError("");
        }}
      />

      {mode === "login" ? (
        <LoginForm
          username={values.username}
          password={values.password}
          error={error}
          submitting={submitting}
          onUsernameChange={handlers.onUsernameChange}
          onPasswordChange={handlers.onPasswordChange}
          onSubmit={handleSubmit}
        />
      ) : (
        <div className="mt-5 grid min-h-0 flex-1 gap-4 transition-opacity duration-300 ease-out lg:grid-cols-[150px_minmax(0,1fr)] xl:grid-cols-[170px_minmax(0,1fr)]">
          <RegisterStageSidebar
            stages={REGISTER_STAGES}
            stageIndex={stageIndex}
            onSelectStage={selectStage}
          />
          <RegisterForm
            stageIndex={stageIndex}
            totalStages={REGISTER_STAGES.length}
            activeStage={activeStage}
            error={error}
            submitting={submitting}
            isLastStage={isLastStage}
            onSubmit={handleSubmit}
            onCreateAccount={handleCreateAccount}
            onBack={handleBack}
            onNext={handleNext}
            values={values}
            handlers={handlers}
          />
        </div>
      )}
    </div>
  );
};

export default Auth;
