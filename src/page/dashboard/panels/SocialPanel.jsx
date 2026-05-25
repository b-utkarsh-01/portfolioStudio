import { Trash2 } from "lucide-react";
import { inputClassName } from "../dashboardFormConfig";

const emptyService = { name: "", description: "" };
const emptyTestimonial = { name: "", role: "", quote: "" };
const removeBtnClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-rose-500/70 text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/60";

const SocialPanel = ({ form, onCollectionItemAdd, onCollectionItemRemove, onCollectionItemChange }) => {
  const services = Array.isArray(form.serviceItems) ? form.serviceItems : [];
  const testimonials = Array.isArray(form.testimonialItems) ? form.testimonialItems : [];

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-700 bg-slate-900/30 p-4">
        <div className="mb-3">
          <div>
            <p className="text-sm font-semibold text-slate-100">Services</p>
            <p className="text-xs text-slate-400">Add each service as a separate card.</p>
          </div>
        </div>
        <div className="space-y-3">
          {services.map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-700 bg-slate-950/40 p-3">
              <div className="mb-3 flex items-center justify-between gap-2">
                <input
                  value={item.name}
                  onChange={(event) => onCollectionItemChange?.("serviceItems", item.id, "name", event.target.value)}
                  placeholder="Service name"
                  className={`${inputClassName} mt-0`}
                />
                <button
                  type="button"
                  onClick={() => onCollectionItemRemove?.("serviceItems", item.id)}
                  className={removeBtnClass}
                  title="Remove service"
                  aria-label="Remove service"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <textarea
                value={item.description}
                onChange={(event) =>
                  onCollectionItemChange?.("serviceItems", item.id, "description", event.target.value)
                }
                rows={3}
                placeholder="Service description"
                className={`${inputClassName} mt-0`}
              />
            </div>
          ))}
        </div>
        <div className="mt-3">
          <button
            type="button"
            onClick={() => onCollectionItemAdd?.("serviceItems", emptyService)}
            className="w-full rounded-lg border border-cyan-400/60 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10"
          >
            + Add Service
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/30 p-4">
        <div className="mb-3">
          <div>
            <p className="text-sm font-semibold text-slate-100">Testimonials</p>
            <p className="text-xs text-slate-400">Add feedback/testimonial cards with name, role and quote.</p>
          </div>
        </div>
        <div className="space-y-3">
          {testimonials.map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-700 bg-slate-950/40 p-3">
              <div className="mb-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                <input
                  value={item.name}
                  onChange={(event) =>
                    onCollectionItemChange?.("testimonialItems", item.id, "name", event.target.value)
                  }
                  placeholder="Name"
                  className={`${inputClassName} mt-0`}
                />
                <input
                  value={item.role}
                  onChange={(event) =>
                    onCollectionItemChange?.("testimonialItems", item.id, "role", event.target.value)
                  }
                  placeholder="Role / Company"
                  className={`${inputClassName} mt-0`}
                />
                <button
                  type="button"
                  onClick={() => onCollectionItemRemove?.("testimonialItems", item.id)}
                  className={removeBtnClass}
                  title="Remove testimonial"
                  aria-label="Remove testimonial"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <textarea
                value={item.quote}
                onChange={(event) =>
                  onCollectionItemChange?.("testimonialItems", item.id, "quote", event.target.value)
                }
                rows={3}
                placeholder="Quote"
                className={`${inputClassName} mt-0`}
              />
            </div>
          ))}
        </div>
        <div className="mt-3">
          <button
            type="button"
            onClick={() => onCollectionItemAdd?.("testimonialItems", emptyTestimonial)}
            className="w-full rounded-lg border border-cyan-400/60 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10"
          >
            + Add Testimonial
          </button>
        </div>
      </section>
    </div>
  );
};

export default SocialPanel;
