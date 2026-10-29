import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  History,
  RotateCcw,
  Trash2,
  Plus,
  Clock,
  ShieldAlert,
  Sparkles,
  Calendar,
  Check,
  AlertCircle,
  FileText,
  Loader2,
  X,
  Layers,
  Briefcase,
  User,
  Tag,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Code,
  Image as ImageIcon,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getHistoryListApi,
  getSnapshotDetailsApi,
  createManualSnapshotApi,
  rollbackSnapshotApi,
  deleteSnapshotApi,
  clearAllHistoryApi,
  updateRetentionPolicyApi,
} from "../../../features/history/historyApi";
import ConfirmModal from "../../../components/common/ConfirmModal";

const RETENTION_OPTIONS = [
  { value: 2, label: "2 Days" },
  { value: 7, label: "7 Days (Recommended)" },
  { value: 30, label: "30 Days" },
  { value: 0, label: "Never (Keep Forever)" },
];

const HistoryPanel = ({ currentPortfolioData = null, currentTemplateId = "default-v4", onPortfolioRestored }) => {
  const [snapshots, setSnapshots] = useState([]);
  const [retentionDays, setRetentionDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Dedicated Inspection View state (null = list view, object = dedicated inspection view)
  const [inspectingSnapshot, setInspectingSnapshot] = useState(null);
  const [snapshotDetail, setSnapshotDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Manual snapshot creation modal state
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualName, setManualName] = useState("");

  // Reusable Confirmation Modal state
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    variant: "warning",
    icon: null,
    onConfirm: () => {},
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await getHistoryListApi();
      setSnapshots(res.snapshots || []);
      setRetentionDays(res.retentionDays ?? 7);
    } catch (err) {
      toast.error(err.message || "Failed to load version history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Open Dedicated Inspection View
  const handleOpenInspect = async (snapshot) => {
    setInspectingSnapshot(snapshot);
    setDetailLoading(true);
    try {
      const res = await getSnapshotDetailsApi(snapshot._id);
      setSnapshotDetail({
        data: res.snapshot?.data,
        templateId: res.snapshot?.templateId,
      });
    } catch (err) {
      toast.error("Could not fetch detailed snapshot data.");
    } finally {
      setDetailLoading(false);
    }
  };

  // Close Dedicated Inspection View
  const handleCloseInspect = () => {
    setInspectingSnapshot(null);
    setSnapshotDetail(null);
  };

  // Update Retention Policy
  const handleRetentionChange = async (e) => {
    const days = Number(e.target.value);
    setActionBusy(true);
    try {
      await updateRetentionPolicyApi(days);
      setRetentionDays(days);
      toast.success(
        days === 0 ? "Retention set to Never Delete." : `History will automatically expire after ${days} days.`
      );
      loadHistory();
    } catch (err) {
      toast.error(err.message || "Failed to update retention policy.");
    } finally {
      setActionBusy(false);
    }
  };

  // Create Manual Snapshot
  const handleCreateManual = async (e) => {
    e.preventDefault();
    const name = manualName.trim();
    if (!name) {
      toast.error("Please enter a name for the backup.");
      return;
    }

    setActionBusy(true);
    try {
      await createManualSnapshotApi(name);
      toast.success("Backup snapshot created successfully!");
      setManualName("");
      setManualModalOpen(false);
      loadHistory();
    } catch (err) {
      toast.error(err.message || "Failed to create snapshot.");
    } finally {
      setActionBusy(false);
    }
  };

  // Trigger Rollback Confirmation
  const promptRollback = (snapshot) => {
    setConfirmConfig({
      isOpen: true,
      title: `Rollback to Version ${snapshot.version}?`,
      message: (
        <div className="space-y-2">
          <p>
            Your active portfolio will be restored to: <strong>"{snapshot.name}"</strong> saved on{" "}
            {new Date(snapshot.createdAt).toLocaleString()}.
          </p>
          <p className="text-xs text-orange-400">
            A safety backup of your current portfolio state will automatically be saved before rolling back.
          </p>
        </div>
      ),
      confirmText: "Yes, Restore Portfolio",
      variant: "restore",
      icon: RotateCcw,
      onConfirm: async () => {
        setActionBusy(true);
        try {
          const res = await rollbackSnapshotApi(snapshot._id);
          toast.success(res.message || `Portfolio restored to v${snapshot.version}!`);
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
          if (onPortfolioRestored) {
            onPortfolioRestored(res.portfolio);
          }
          handleCloseInspect();
          loadHistory();
        } catch (err) {
          toast.error(err.message || "Failed to rollback portfolio.");
        } finally {
          setActionBusy(false);
        }
      },
    });
  };

  // Trigger Delete Snapshot Confirmation
  const promptDeleteSnapshot = (snapshot) => {
    setConfirmConfig({
      isOpen: true,
      title: `Delete Version ${snapshot.version}?`,
      message: `Are you sure you want to delete snapshot "${snapshot.name}"? This record will be permanently removed.`,
      confirmText: "Delete Snapshot",
      variant: "danger",
      icon: Trash2,
      onConfirm: async () => {
        setActionBusy(true);
        try {
          await deleteSnapshotApi(snapshot._id);
          toast.success("Snapshot deleted.");
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
          if (inspectingSnapshot?._id === snapshot._id) {
            handleCloseInspect();
          }
          loadHistory();
        } catch (err) {
          toast.error(err.message || "Failed to delete snapshot.");
        } finally {
          setActionBusy(false);
        }
      },
    });
  };

  // Trigger Clear All History Confirmation
  const promptClearAll = () => {
    setConfirmConfig({
      isOpen: true,
      title: "Clear All Version History?",
      message: "This will permanently delete all saved portfolio snapshots for your account. You cannot undo this.",
      confirmText: "Clear All History",
      variant: "danger",
      icon: ShieldAlert,
      onConfirm: async () => {
        setActionBusy(true);
        try {
          await clearAllHistoryApi();
          toast.success("All version history cleared.");
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
          handleCloseInspect();
          loadHistory();
        } catch (err) {
          toast.error(err.message || "Failed to clear history.");
        } finally {
          setActionBusy(false);
        }
      },
    });
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Manual Modal rendered through Portal to cover 100% entire viewport
  const manualModal =
    mounted && manualModalOpen
      ? createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
            onClick={() => !actionBusy && setManualModalOpen(false)}
            style={{ isolation: "isolate" }}
          >
            <div
              className="relative w-full max-w-md rounded-3xl border border-slate-700/80 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl animate-scaleUp text-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => !actionBusy && setManualModalOpen(false)}
                className="absolute right-4 top-4 rounded-xl border border-slate-800 p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Create Portfolio Snapshot</h3>
                  <p className="text-xs text-slate-400">Save a named restore point of your current portfolio</p>
                </div>
              </div>

              <form onSubmit={handleCreateManual} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Backup Label / Title
                  </label>
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="e.g. Before Major Bio & Skills Update"
                    maxLength={100}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    autoFocus
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setManualModalOpen(false)}
                    disabled={actionBusy}
                    className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionBusy || !manualName.trim()}
                    className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-400 transition disabled:opacity-50"
                  >
                    {actionBusy ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Snapshot</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )
      : null;

  // =========================================================================
  // VIEW 1: DEDICATED FULL-PANEL INSPECTION & DIFF VIEW
  // (Provides full breathing room, spacious layout, zero popups, zero cramped nesting)
  // =========================================================================
  if (inspectingSnapshot) {
    const preview = snapshotDetail?.data;
    const snapshotTemplate = snapshotDetail?.templateId || inspectingSnapshot.templateId;

    const curProfile = currentPortfolioData?.profile || {};
    const snapProfile = preview?.profile || {};

    const isAvatarDiff = preview && (snapProfile.avatar || "") !== (curProfile.avatar || "");
    const isNameDiff = preview && (snapProfile.name || "") !== (curProfile.name || "");
    const isSummaryDiff = preview && (snapProfile.summary || "") !== (curProfile.summary || "");
    const isTemplateDiff = preview && snapshotTemplate !== currentTemplateId;

    const snapTitles = Array.isArray(snapProfile.title) ? snapProfile.title : [];
    const curTitles = Array.isArray(curProfile.title) ? curProfile.title : [];
    const isTitlesDiff = preview && JSON.stringify(snapTitles) !== JSON.stringify(curTitles);

    const snapSkills = [
      ...(preview?.skills?.primarySkills || []),
      ...(preview?.skills?.secondarySkills || []),
    ];
    const curSkills = [
      ...(currentPortfolioData?.skills?.primarySkills || []),
      ...(currentPortfolioData?.skills?.secondarySkills || []),
    ];
    const isSkillsDiff = preview && JSON.stringify(snapSkills) !== JSON.stringify(curSkills);

    const snapProjects = Array.isArray(preview?.projects) ? preview.projects : [];
    const curProjects = Array.isArray(currentPortfolioData?.projects) ? currentPortfolioData.projects : [];
    const isProjectsDiff =
      preview &&
      JSON.stringify(snapProjects.map((p) => p.title)) !== JSON.stringify(curProjects.map((p) => p.title));

    const snapCustom = Array.isArray(preview?.customStages) ? preview.customStages : [];

    return (
      <div className="flex h-full min-h-0 min-w-0 w-full flex-col rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 shadow-xl backdrop-blur-xl animate-fadeIn">
        {/* Top Header Bar with Back navigation & Restore button */}
        <div className="shrink-0 flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
          {/* Left: Back button & Title */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <button
              type="button"
              onClick={handleCloseInspect}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition active:scale-95 shrink-0 whitespace-nowrap"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-orange-500/20 text-[11px] font-bold text-orange-400 shrink-0">
                  v{inspectingSnapshot.version}
                </span>
                <h2 className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                  {inspectingSnapshot.name}
                </h2>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-slate-500 shrink-0" />
                <span>{formatDate(inspectingSnapshot.createdAt)}</span>
                <span className="text-slate-600">•</span>
                <span className="text-orange-400/90 font-medium truncate">Comparing with live portfolio</span>
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => promptRollback(inspectingSnapshot)}
              disabled={actionBusy || detailLoading}
              className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-orange-400 transition active:scale-95 disabled:opacity-50 shrink-0 whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restore Version {inspectingSnapshot.version}</span>
            </button>

            <button
              type="button"
              onClick={() => promptDeleteSnapshot(inspectingSnapshot)}
              disabled={actionBusy}
              className="rounded-xl border border-slate-800 bg-slate-950/60 p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 hover:border-rose-900/50 transition shrink-0"
              title="Delete Snapshot"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Change Tags Bar */}
        {Array.isArray(inspectingSnapshot.changeSummary) && inspectingSnapshot.changeSummary.length > 0 && (
          <div className="shrink-0 mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
            <span className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1 shrink-0">
              <Tag className="h-3 w-3 text-orange-400" /> Changes in this version:
            </span>
            {inspectingSnapshot.changeSummary.map((tag, idx) => (
              <span
                key={idx}
                className="rounded-lg bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-300 border border-orange-500/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Spacious Content Body */}
        <div className="flex-1 min-h-0 w-full min-w-0 overflow-y-auto frontend-scrollbar pr-1 sm:pr-2 space-y-4">
          {detailLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-orange-400 mb-3" />
              <p className="text-sm font-medium">Loading snapshot details...</p>
            </div>
          ) : !preview ? (
            <div className="text-center py-16 text-slate-400">
              <AlertCircle className="h-8 w-8 mx-auto text-amber-400 mb-2" />
              <p className="text-sm">Snapshot preview content could not be found.</p>
            </div>
          ) : (
            <>
              {/* 1. Profile Picture / Avatar Visual Comparison */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400">
                      <ImageIcon className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
                        Profile Photo (Avatar)
                      </h3>
                      <p className="text-[11px] text-slate-400">Visual comparison of saved vs live photo</p>
                    </div>
                  </div>

                  {isAvatarDiff ? (
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-semibold border border-amber-500/30">
                      Photo Differs
                    </span>
                  ) : (
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-semibold border border-emerald-500/30 flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5" /> Identical Photo
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Snapshot Photo Card */}
                  <div className="flex items-center gap-4 rounded-xl border border-orange-500/30 bg-orange-500/5 p-3.5">
                    {snapProfile.avatar ? (
                      <img
                        src={snapProfile.avatar}
                        alt="Snapshot Avatar"
                        className="h-20 w-20 rounded-2xl object-cover border-2 border-orange-500 shadow-md shrink-0"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-slate-500 text-xs shrink-0">
                        <ImageIcon className="h-6 w-6 text-slate-600 mb-1" />
                        <span>No Photo</span>
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold uppercase text-orange-400 block tracking-wide">
                        In Snapshot (v{inspectingSnapshot.version})
                      </span>
                      <p className="text-xs text-slate-300 mt-1">
                        {snapProfile.avatar ? "Photo stored in this restore point" : "No photo was uploaded"}
                      </p>
                    </div>
                  </div>

                  {/* Current Active Photo Card */}
                  <div className="flex items-center gap-4 rounded-xl border border-sky-500/30 bg-sky-500/5 p-3.5">
                    {curProfile.avatar ? (
                      <img
                        src={curProfile.avatar}
                        alt="Current Live Avatar"
                        className="h-20 w-20 rounded-2xl object-cover border-2 border-sky-500 shadow-md shrink-0"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-slate-500 text-xs shrink-0">
                        <ImageIcon className="h-6 w-6 text-slate-600 mb-1" />
                        <span>No Photo</span>
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold uppercase text-sky-400 block tracking-wide">
                        Current Live Portfolio
                      </span>
                      <p className="text-xs text-slate-300 mt-1">
                        {curProfile.avatar ? "Active live photo on your profile" : "No photo currently active"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Bio & Summary Side-by-Side Comparison */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400">
                      <User className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
                        Bio & Summary Text
                      </h3>
                      <p className="text-[11px] text-slate-400">Compare your biography and introduction</p>
                    </div>
                  </div>

                  {isSummaryDiff ? (
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-semibold border border-amber-500/30">
                      Summary Modified
                    </span>
                  ) : (
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-semibold border border-emerald-500/30 flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5" /> Identical Summary
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Snapshot summary */}
                  <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase text-orange-400 block tracking-wide mb-2">
                        In Snapshot (v{inspectingSnapshot.version}):
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                        "{snapProfile.summary || "(No summary text set in this version)"}"
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-orange-500/20 text-[11px] text-slate-400">
                      Name: <span className="text-slate-200 font-semibold">{snapProfile.name || "-"}</span>
                    </div>
                  </div>

                  {/* Current active summary */}
                  <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase text-sky-400 block tracking-wide mb-2">
                        Current Live Portfolio:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                        "{curProfile.summary || "(No summary text currently active)"}"
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-sky-500/20 text-[11px] text-slate-400">
                      Name: <span className="text-slate-200 font-semibold">{curProfile.name || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Job Titles & Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Titles Card */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Tag className="h-4 w-4 text-orange-400" /> Job Titles
                    </span>
                    {isTitlesDiff && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-semibold">
                        Modified
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1.5">
                      Titles in Snapshot (v{inspectingSnapshot.version}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {snapTitles.length > 0 ? (
                        snapTitles.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-slate-900 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-800 font-medium"
                          >
                            {t}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500 italic">No job titles set</span>
                      )}
                    </div>
                  </div>

                  {isTitlesDiff && curTitles.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80">
                      <span className="text-[11px] text-sky-400 block mb-1.5">Current Live Titles:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {curTitles.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-sky-950/40 text-sky-300 px-2.5 py-1 rounded-lg border border-sky-800/50 font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Technical Skills Card */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Code className="h-4 w-4 text-orange-400" /> Technical Skills ({snapSkills.length})
                    </span>
                    {isSkillsDiff && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-semibold">
                        Modified
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto frontend-scrollbar pr-1">
                    {snapSkills.length > 0 ? (
                      snapSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-slate-900 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-800 font-medium"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">No skills saved in this version</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. Projects & Custom Stages Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Projects Breakdown */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-orange-400" /> Projects ({snapProjects.length})
                    </span>
                    {isProjectsDiff && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-semibold">
                        {snapProjects.length} vs {curProjects.length} live
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto frontend-scrollbar pr-1">
                    {snapProjects.length > 0 ? (
                      snapProjects.map((p, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-semibold text-slate-200 block truncate">
                              {p.title || `Project #${idx + 1}`}
                            </span>
                            {p.description && (
                              <p className="text-[11px] text-slate-400 truncate mt-0.5">{p.description}</p>
                            )}
                          </div>
                          {p.link && (
                            <span className="text-[10px] text-orange-400 shrink-0 font-medium">Link Attached</span>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic py-2">No projects saved in this version.</p>
                    )}
                  </div>
                </div>

                {/* Custom Stages Breakdown */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-orange-400" /> Custom Stages ({snapCustom.length})
                    </span>
                    <span className="text-xs text-slate-400">
                      Template: <span className="text-orange-400 font-bold">{snapshotTemplate}</span>
                    </span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto frontend-scrollbar pr-1">
                    {snapCustom.length > 0 ? (
                      snapCustom.map((cs, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs"
                        >
                          <span className="font-semibold text-orange-300">
                            {cs.title || cs.id || `Custom Stage #${idx + 1}`}
                          </span>
                          <span className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800 uppercase font-mono">
                            {cs.kind || "cards"}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic py-2">No custom stages in this version.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Action Card */}
              {/* <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-slate-900/60 to-orange-500/10 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-200">
                    Ready to restore this version?
                  </h4>
                  <p className="text-xs text-slate-400">
                    Restoring will overwrite your active portfolio with version {inspectingSnapshot.version}. A safety backup will be created automatically.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => promptRollback(inspectingSnapshot)}
                  disabled={actionBusy}
                  className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg hover:bg-orange-400 transition active:scale-95 shrink-0"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Restore Version {inspectingSnapshot.version}</span>
                </button>
              </div> */}
            </>
          )}
        </div>

        {/* Universal Reusable Confirmation Modal rendered at <body> level via React Portal */}
        <ConfirmModal
          isOpen={confirmConfig.isOpen}
          onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={confirmConfig.onConfirm}
          title={confirmConfig.title}
          message={confirmConfig.message}
          confirmText={confirmConfig.confirmText}
          variant={confirmConfig.variant}
          icon={confirmConfig.icon}
          loading={actionBusy}
        />
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: NORMAL TIMELINE LIST VIEW (Clean, fast, non-cramped)
  // =========================================================================
  return (
    <div className="flex h-full min-h-0 min-w-0 w-full flex-col rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 shadow-xl backdrop-blur-xl">
      {/* Header Bar */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
            <History className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">
              Version History & Snapshots
            </h2>
            <p className="text-xs text-slate-400">
              Time Machine: Review previous edits and rollback portfolio changes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setManualModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-orange-400 shadow-sm active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Backup</span>
          </button>

          {snapshots.length > 0 && (
            <button
              type="button"
              onClick={promptClearAll}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/30 hover:border-rose-900 transition active:scale-95"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Retention Policy Controls Banner */}
      <div className="shrink-0 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-3 sm:px-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-orange-400 shrink-0" />
          <div>
            <span className="text-xs font-semibold text-slate-200">Auto-Expiry Policy:</span>
            <span className="ml-1 text-xs text-slate-400">
              {retentionDays === 0 ? "Saved permanently (Never deleted)" : `Automatically cleared after ${retentionDays} days`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="retention-select" className="text-xs text-slate-400">
            Retention:
          </label>
          <select
            id="retention-select"
            value={retentionDays}
            onChange={handleRetentionChange}
            disabled={actionBusy}
            className="rounded-xl border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-200 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            {RETENTION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Snapshots Scrollable List */}
      <div className="flex-1 min-h-0 w-full min-w-0 overflow-y-auto frontend-scrollbar pr-1 sm:pr-2 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-orange-400 mb-2" />
            <p className="text-xs">Loading version history...</p>
          </div>
        ) : snapshots.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/30 py-12 px-4 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 mb-3">
              <History className="h-6 w-6" />
            </span>
            <h3 className="text-sm font-bold text-slate-200">No Version Snapshots Yet</h3>
            <p className="mt-1 max-w-sm text-xs text-slate-400">
              Snapshots are automatically created whenever you save changes to your portfolio in the Dashboard.
            </p>
            <button
              type="button"
              onClick={() => setManualModalOpen(true)}
              className="mt-4 flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-400"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Initial Snapshot</span>
            </button>
          </div>
        ) : (
          snapshots.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-slate-700/80"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3.5 min-w-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-xs font-bold text-orange-400">
                    v{item.version}
                  </span>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-slate-100 tracking-tight">
                        {item.name}
                      </span>

                      {item.type === "manual" && (
                        <span className="rounded-md bg-sky-500/15 px-2 py-0.5 text-[10px] font-semibold text-sky-400 border border-sky-500/30">
                          Manual
                        </span>
                      )}
                      {item.type === "pre-rollback" && (
                        <span className="rounded-md bg-purple-500/15 px-2 py-0.5 text-[10px] font-semibold text-purple-400 border border-purple-500/30">
                          Safety Backup
                        </span>
                      )}
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(item.createdAt)}
                      </span>

                      {item.expiresAt ? (
                        <span className="text-amber-500/90">
                          Expires: {formatDate(item.expiresAt)}
                        </span>
                      ) : (
                        <span className="text-emerald-500/90 font-medium">Permanent</span>
                      )}
                    </div>

                    {/* Change Summary Tags */}
                    {Array.isArray(item.changeSummary) && item.changeSummary.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {item.changeSummary.map((tag, idx) => (
                          <span
                            key={idx}
                            className="rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-slate-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenInspect(item)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-850 hover:border-slate-700 transition"
                  >
                    <FileText className="h-3.5 w-3.5 text-orange-400" />
                    <span>Inspect & Compare</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => promptRollback(item)}
                    disabled={actionBusy}
                    className="flex items-center gap-1.5 rounded-xl bg-orange-500/20 border border-orange-500/40 px-3.5 py-2 text-xs font-semibold text-orange-300 hover:bg-orange-500 hover:text-white transition active:scale-95"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Restore</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => promptDeleteSnapshot(item)}
                    disabled={actionBusy}
                    className="rounded-xl border border-slate-800 p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 hover:border-rose-900/50 transition"
                    title="Delete Snapshot"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Manual Snapshot Modal rendered at <body> level via React Portal */}
      {manualModal}

      {/* Universal Reusable Confirmation Modal rendered at <body> level via React Portal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        variant={confirmConfig.variant}
        icon={confirmConfig.icon}
        loading={actionBusy}
      />
    </div>
  );
};

export default HistoryPanel;
