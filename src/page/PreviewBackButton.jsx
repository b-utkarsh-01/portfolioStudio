import { useNavigate } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";

const PreviewBackButton = ({ fallbackPath = "/templates" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallbackPath, { replace: true });
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="fixed left-4 top-4 z-50 inline-flex items-center gap-2 rounded-xl border border-slate-300/70 bg-white/90 px-3 py-2 text-slate-700 shadow-sm backdrop-blur hover:bg-white"
    >
      <ArrowLeftCircle size={16} />
      Back
    </button>
  );
};

export default PreviewBackButton;
