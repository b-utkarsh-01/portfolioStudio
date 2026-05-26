import { Plus, Trash2 } from "lucide-react";

const AiResumeInputStage = ({
  inputMode,
  setInputMode,
  resumeFile,
  setResumeFile,
  fileError,
  setFileError,
  handleResetResumeForm,
  resumeSubStages,
  visibleResumeSubStages,
  resumeSubStage,
  setResumeSubStage,
  handleToggleResumeSubStage,
  handleAddResumeSubStage,
  structuredResume,
  setStructuredResume,
  skillSections,
  setSkillSections,
  educationItems,
  setEducationItems,
  experienceItems,
  setExperienceItems,
  projectItems,
  setProjectItems,
  customResumeStageContent,
  setCustomResumeStageContent,
  handleResumeStageLabelChange,
  isResumeSubStageLast,
}) => (
  <div className="flex h-full min-h-0 flex-col overflow-hidden">
    <div className="mb-3 flex gap-2">
      <button
        type="button"
        onClick={() => setInputMode("text")}
        className={[
          "rounded-md border px-3 py-1.5 text-xs font-semibold",
          inputMode === "text"
            ? "border-cyan-400 bg-cyan-500/10 text-cyan-200"
            : "border-slate-700 text-slate-300",
        ].join(" ")}
      >
        Paste Text
      </button>
      <button
        type="button"
        onClick={() => setInputMode("upload")}
        className={[
          "rounded-md border px-3 py-1.5 text-xs font-semibold",
          inputMode === "upload"
            ? "border-cyan-400 bg-cyan-500/10 text-cyan-200"
            : "border-slate-700 text-slate-300",
        ].join(" ")}
      >
        Upload File
      </button>
    </div>

    {inputMode === "upload" ? (
      <label className="block text-sm text-slate-200">
        Resume File (.txt or .pdf)
        <input
          type="file"
          accept=".txt,.pdf,text/plain,application/pdf"
          onChange={(event) => {
            const selected = event.target.files?.[0] || null;
            const lowerName = `${selected?.name || ""}`.toLowerCase();
            const mime = `${selected?.type || ""}`;
            const ok =
              !selected ||
              mime === "text/plain" ||
              mime === "application/pdf" ||
              lowerName.endsWith(".txt") ||
              lowerName.endsWith(".pdf");
            if (!ok) {
              setResumeFile(null);
              setFileError("Only .txt and .pdf files are accepted.");
              event.target.value = "";
              return;
            }
            setFileError("");
            setResumeFile(selected);
          }}
          className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100"
        />
        <p className="mt-2 text-xs text-slate-400">
          {resumeFile ? `Selected: ${resumeFile.name}` : "No file selected"}
        </p>
        {fileError ? <p className="mt-1 text-xs text-rose-300">{fileError}</p> : null}
      </label>
    ) : (
      <div className="min-h-0 flex flex-1 flex-col gap-3 overflow-hidden">
        <div className="grid h-full min-h-0 flex-1 gap-3 overflow-hidden lg:grid-cols-[190px_minmax(0,1fr)]">
          <aside className="flex h-full min-h-0 flex-col rounded-xl border border-slate-700 bg-slate-950/40 p-2">
            <div className="flex items-center justify-between gap-2 px-2">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Resume Stages</p>
              <button
                type="button"
                onClick={handleResetResumeForm}
                className="rounded border border-slate-600 px-2 py-1 text-[10px] font-semibold uppercase text-slate-200 hover:bg-slate-800"
              >
                Reset
              </button>
            </div>
            <div className="frontend-scrollbar mt-2 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
              {resumeSubStages.map((stage, index) => {
                const visibleIndex = visibleResumeSubStages.findIndex((x) => x.key === stage.key);
                const isActive = stage.enabled && visibleIndex === resumeSubStage;
                return (
                  <div
                    key={stage.key}
                    className={[
                      "w-full rounded-md border px-2 py-2 text-xs",
                      isActive
                        ? "border-cyan-400 bg-cyan-500/10 text-cyan-200"
                        : "border-slate-700 text-slate-200",
                      stage.enabled ? "" : "opacity-55",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        disabled={!stage.enabled}
                        onClick={() => {
                          if (visibleIndex >= 0) setResumeSubStage(visibleIndex);
                        }}
                        className="min-w-0 flex-1 truncate text-left disabled:cursor-not-allowed"
                      >
                        {index + 1}. {stage.label}
                      </button>
                      <button
                        type="button"
                        title={stage.enabled ? "Delete/Hide stage" : "Restore stage"}
                        onClick={() => handleToggleResumeSubStage(stage.key)}
                        className={[
                          "rounded-md border p-1 transition-colors",
                          stage.enabled
                            ? "border-rose-500/60 text-rose-300 hover:bg-rose-500/20"
                            : "border-emerald-500/60 text-emerald-300 hover:bg-emerald-500/20",
                        ].join(" ")}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={handleAddResumeSubStage}
              className="mt-2 flex w-full items-center justify-center rounded-md border border-slate-700 py-2 text-slate-200 hover:bg-slate-800"
              title="Add new stage"
            >
              <Plus className="h-4 w-4" />
            </button>
          </aside>

          <div className="frontend-scrollbar flex h-full min-h-0 flex-col overflow-y-auto rounded-xl border border-slate-700 bg-slate-950/30 p-3">
            {!visibleResumeSubStages.length ? (
              <p className="text-sm text-slate-300">No active stage. Restore or add a stage from the left.</p>
            ) : null}
            {visibleResumeSubStages[resumeSubStage]?.key === "profile" ? (
              <div className="space-y-2 pb-2">
                <input value={structuredResume.name} onChange={(event)=>setStructuredResume((prev)=>({ ...prev, name: event.target.value }))} className="w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Full Name" />
                <input value={structuredResume.email} onChange={(event)=>setStructuredResume((prev)=>({ ...prev, email: event.target.value }))} className="w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Email" />
                <input value={structuredResume.phone} onChange={(event)=>setStructuredResume((prev)=>({ ...prev, phone: event.target.value }))} className="w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Phone" />
                <textarea value={structuredResume.summary} onChange={(event)=>setStructuredResume((prev)=>({ ...prev, summary: event.target.value }))} className="h-28 w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Professional summary" />
              </div>
            ) : null}

            {visibleResumeSubStages[resumeSubStage]?.key === "skills" ? (
              <div className="space-y-2 pb-2">
                {skillSections.map((section, sectionIdx) => (
                  <div key={section.id} className="rounded-lg border border-slate-700 bg-slate-950/40 p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <input value={section.name} onChange={(e)=>setSkillSections((prev)=>prev.map((x,i)=>(i===sectionIdx?{...x,name:e.target.value}:x)))} className="w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Section Name (e.g., Frontend)" />
                      <button type="button" onClick={()=>setSkillSections((prev)=>prev.length>1?prev.filter((_,i)=>i!==sectionIdx):prev)} className="rounded border border-rose-500/70 px-2 py-1 text-xs text-rose-300">Delete</button>
                    </div>
                    <div className="space-y-2">
                      {(Array.isArray(section.skills) ? section.skills : [""]).map((skill, skillIdx) => (
                        <div key={`${section.id}-${skillIdx}`} className="flex items-center gap-2">
                          <input value={skill} onChange={(e)=>setSkillSections((prev)=>prev.map((x,i)=>{ if(i!==sectionIdx) return x; const nextSkills=[...(x.skills||[])]; nextSkills[skillIdx]=e.target.value; return { ...x, skills: nextSkills }; }))} className="w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Skill name (e.g., HTML)" />
                          <button type="button" onClick={()=>setSkillSections((prev)=>prev.map((x,i)=>{ if(i!==sectionIdx) return x; const current=x.skills||[]; const nextSkills=current.length>1?current.filter((_,idx)=>idx!==skillIdx):current; return { ...x, skills: nextSkills }; }))} className="rounded border border-slate-600 px-2 py-1 text-xs text-slate-300">Remove</button>
                        </div>
                      ))}
                      <button type="button" onClick={()=>setSkillSections((prev)=>prev.map((x,i)=>i===sectionIdx?{...x,skills:[...(x.skills||[]),""]}:x))} className="w-full rounded-lg border border-slate-500 px-3 py-2 text-xs font-semibold text-slate-200">+ Add Skills</button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={()=>setSkillSections((prev)=>[...prev,{id:`skill-sec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`,name:"",skills:[""]}])} className="w-full rounded-lg border border-cyan-500/60 px-3 py-2 text-sm text-cyan-300">+ Add Section</button>
              </div>
            ) : null}

            {visibleResumeSubStages[resumeSubStage]?.key === "education" ? (
              <div className="space-y-2 pb-2">
                {educationItems.map((item, idx) => (
                  <div key={`edu-${idx}`} className="rounded-lg border border-slate-700 p-2">
                    <div className="grid gap-2 sm:grid-cols-3">
                      <input value={item.year} onChange={(e)=>setEducationItems((prev)=>prev.map((x,i)=>(i===idx?{...x,year:e.target.value}:x)))} className="rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Year" />
                      <input value={item.institute} onChange={(e)=>setEducationItems((prev)=>prev.map((x,i)=>(i===idx?{...x,institute:e.target.value}:x)))} className="rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Institute" />
                      <input value={item.degree} onChange={(e)=>setEducationItems((prev)=>prev.map((x,i)=>(i===idx?{...x,degree:e.target.value}:x)))} className="rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Degree" />
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button type="button" onClick={()=>setEducationItems((prev)=>prev.length>1?prev.filter((_,i)=>i!==idx):prev)} className="rounded border border-rose-500/70 px-2 py-1 text-xs text-rose-300">Delete</button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={()=>setEducationItems((prev)=>[...prev,{year:"",institute:"",degree:""}])} className="w-full rounded-lg border border-cyan-500/60 px-3 py-2 text-sm text-cyan-300">+ Add Education</button>
              </div>
            ) : null}

            {visibleResumeSubStages[resumeSubStage]?.key === "projects" ? (
              <div className="space-y-2 pb-2">
                <p className="text-xs uppercase text-slate-400">Experience</p>
                {experienceItems.map((item, idx) => (
                  <div key={`exp-${idx}`} className="rounded-lg border border-slate-700 p-2 space-y-2">
                    <div className="grid gap-2 sm:grid-cols-3">
                      <input value={item.title} onChange={(e)=>setExperienceItems(prev=>prev.map((x,i)=>i===idx?{...x,title:e.target.value}:x))} className="rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Role" />
                      <input value={item.company} onChange={(e)=>setExperienceItems(prev=>prev.map((x,i)=>i===idx?{...x,company:e.target.value}:x))} className="rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Company" />
                      <input value={item.period} onChange={(e)=>setExperienceItems(prev=>prev.map((x,i)=>i===idx?{...x,period:e.target.value}:x))} className="rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Period" />
                    </div>
                    <textarea value={item.description} onChange={(e)=>setExperienceItems(prev=>prev.map((x,i)=>i===idx?{...x,description:e.target.value}:x))} className="h-20 w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Description" />
                    <div className="flex justify-end"><button type="button" onClick={()=>setExperienceItems(prev=>prev.length>1?prev.filter((_,i)=>i!==idx):prev)} className="rounded border border-rose-500/70 px-2 py-1 text-xs text-rose-300">Delete</button></div>
                  </div>
                ))}
                <button type="button" onClick={()=>setExperienceItems(prev=>[...prev,{title:"",company:"",period:"",description:""}])} className="w-full rounded-lg border border-cyan-500/60 px-3 py-2 text-sm text-cyan-300">+ Add Experience</button>
                <p className="pt-2 text-xs uppercase text-slate-400">Projects</p>
                {projectItems.map((item, idx) => (
                  <div key={`proj-${idx}`} className="rounded-lg border border-slate-700 p-2 space-y-2">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input value={item.name} onChange={(e)=>setProjectItems(prev=>prev.map((x,i)=>i===idx?{...x,name:e.target.value}:x))} className="rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Project Name" />
                      <input value={item.tech} onChange={(e)=>setProjectItems(prev=>prev.map((x,i)=>i===idx?{...x,tech:e.target.value}:x))} className="rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Tech Stack" />
                    </div>
                    <textarea value={item.description} onChange={(e)=>setProjectItems(prev=>prev.map((x,i)=>i===idx?{...x,description:e.target.value}:x))} className="h-20 w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Description" />
                    <input value={item.link} onChange={(e)=>setProjectItems(prev=>prev.map((x,i)=>i===idx?{...x,link:e.target.value}:x))} className="w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Project Link" />
                    <div className="flex justify-end"><button type="button" onClick={()=>setProjectItems(prev=>prev.length>1?prev.filter((_,i)=>i!==idx):prev)} className="rounded border border-rose-500/70 px-2 py-1 text-xs text-rose-300">Delete</button></div>
                  </div>
                ))}
                <button type="button" onClick={()=>setProjectItems(prev=>[...prev,{name:"",tech:"",description:"",link:""}])} className="w-full rounded-lg border border-cyan-500/60 px-3 py-2 text-sm text-cyan-300">+ Add Project</button>
              </div>
            ) : null}

            {visibleResumeSubStages[resumeSubStage]?.key?.startsWith("custom-") ? (
              <div className="space-y-2">
                <input value={visibleResumeSubStages[resumeSubStage]?.label || ""} onChange={(event)=>handleResumeStageLabelChange(visibleResumeSubStages[resumeSubStage]?.key,event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Stage Name" />
                <select value={customResumeStageContent?.[visibleResumeSubStages[resumeSubStage]?.key]?.kind || "paragraph"} onChange={(event)=>setCustomResumeStageContent((prev)=>({ ...prev, [visibleResumeSubStages[resumeSubStage]?.key]: { ...(prev?.[visibleResumeSubStages[resumeSubStage]?.key] || {}), kind: event.target.value, paragraph: (prev?.[visibleResumeSubStages[resumeSubStage]?.key]?.paragraph || ""), cards: prev?.[visibleResumeSubStages[resumeSubStage]?.key]?.cards || [], }, }))} className="w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100">
                  <option value="paragraph">Paragraph</option>
                  <option value="cards">Cards</option>
                </select>
                {(customResumeStageContent?.[visibleResumeSubStages[resumeSubStage]?.key]?.kind || "paragraph") === "paragraph" ? (
                  <textarea value={customResumeStageContent?.[visibleResumeSubStages[resumeSubStage]?.key]?.paragraph || ""} onChange={(event)=>setCustomResumeStageContent((prev)=>({ ...prev, [visibleResumeSubStages[resumeSubStage]?.key]: { ...(prev?.[visibleResumeSubStages[resumeSubStage]?.key] || {}), kind: "paragraph", paragraph: event.target.value, cards: prev?.[visibleResumeSubStages[resumeSubStage]?.key]?.cards || [], }, }))} className="h-36 w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Custom paragraph content" />
                ) : (
                  <div className="space-y-2">
                    {(customResumeStageContent?.[visibleResumeSubStages[resumeSubStage]?.key]?.cards || []).map((card, idx) => (
                      <div key={`c-${idx}`} className="rounded-lg border border-slate-700 p-2 space-y-2">
                        <input value={card.title || ""} onChange={(e)=>setCustomResumeStageContent(prev=>{ const key=visibleResumeSubStages[resumeSubStage]?.key; const cards=[...(prev?.[key]?.cards||[])]; cards[idx]={...cards[idx],title:e.target.value}; return {...prev,[key]:{...(prev?.[key]||{}),kind:"cards",cards,paragraph:prev?.[key]?.paragraph||""}};})} className="w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Card title" />
                        <input value={card.subtitle || ""} onChange={(e)=>setCustomResumeStageContent(prev=>{ const key=visibleResumeSubStages[resumeSubStage]?.key; const cards=[...(prev?.[key]?.cards||[])]; cards[idx]={...cards[idx],subtitle:e.target.value}; return {...prev,[key]:{...(prev?.[key]||{}),kind:"cards",cards,paragraph:prev?.[key]?.paragraph||""}};})} className="w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Card subtitle" />
                        <textarea value={card.description || ""} onChange={(e)=>setCustomResumeStageContent(prev=>{ const key=visibleResumeSubStages[resumeSubStage]?.key; const cards=[...(prev?.[key]?.cards||[])]; cards[idx]={...cards[idx],description:e.target.value}; return {...prev,[key]:{...(prev?.[key]||{}),kind:"cards",cards,paragraph:prev?.[key]?.paragraph||""}};})} className="h-20 w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Card description" />
                        <input value={card.link || ""} onChange={(e)=>setCustomResumeStageContent(prev=>{ const key=visibleResumeSubStages[resumeSubStage]?.key; const cards=[...(prev?.[key]?.cards||[])]; cards[idx]={...cards[idx],link:e.target.value}; return {...prev,[key]:{...(prev?.[key]||{}),kind:"cards",cards,paragraph:prev?.[key]?.paragraph||""}};})} className="w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100" placeholder="Card link" />
                        <div className="flex justify-end"><button type="button" onClick={()=>setCustomResumeStageContent(prev=>{ const key=visibleResumeSubStages[resumeSubStage]?.key; const cards=(prev?.[key]?.cards||[]).filter((_,i)=>i!==idx); return {...prev,[key]:{...(prev?.[key]||{}),kind:"cards",cards,paragraph:prev?.[key]?.paragraph||""}};})} className="rounded border border-rose-500/70 px-2 py-1 text-xs text-rose-300">Delete</button></div>
                      </div>
                    ))}
                    <button type="button" onClick={()=>setCustomResumeStageContent((prev)=>{ const key=visibleResumeSubStages[resumeSubStage]?.key; const cards=[...(prev?.[key]?.cards||[]), { title: "", subtitle: "", description: "", link: "" }]; return { ...prev, [key]: { ...(prev?.[key] || {}), kind: "cards", cards, paragraph: prev?.[key]?.paragraph || "", }, }; })} className="w-full rounded-lg border border-cyan-500/60 px-3 py-2 text-sm text-cyan-300">+ Add Card</button>
                  </div>
                )}
              </div>
            ) : null}

            <div className="mt-3 flex items-center gap-2 border-t border-slate-700/70 pt-3">
              <button type="button" disabled={resumeSubStage === 0} onClick={() => setResumeSubStage((prev) => Math.max(0, prev - 1))} className="rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-200 disabled:opacity-50">Back</button>
              <button type="button" disabled={!visibleResumeSubStages.length || isResumeSubStageLast} onClick={() => setResumeSubStage((prev) => Math.min(Math.max(visibleResumeSubStages.length - 1, 0), prev + 1))} className="rounded-md bg-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default AiResumeInputStage;
