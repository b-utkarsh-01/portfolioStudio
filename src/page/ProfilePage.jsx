import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { getMyPortfolioApi, upsertMyPortfolioApi } from "../features/portfolio/portfolioApi";
import { toast } from "react-toastify";
import ProfileHeader from "./profile/components/ProfileHeader";
import ProfileStageSidebar from "./profile/components/ProfileStageSidebar";
import AccountPanel from "./profile/components/AccountPanel";
import PortfolioPanel from "./profile/components/PortfolioPanel";
import HistoryPanel from "./profile/components/HistoryPanel";
import ConfirmModal from "../components/common/ConfirmModal";
import { LogOut } from "lucide-react";

const ProfilePage = () => {
  const { currentUser, logout, updateCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [templateId, setTemplateId] = useState("default-v4");
  const [portfolioData, setPortfolioData] = useState(null);
  const [portfolioInfo, setPortfolioInfo] = useState(null);
  const [draft, setDraft] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [accountDraft, setAccountDraft] = useState({ displayName: "" });
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState("account");
  const [copied, setCopied] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const payload = await getMyPortfolioApi();
        if (!cancelled) {
          const nextPortfolio = payload?.portfolio || null;
          const nextData = nextPortfolio?.data || null;
          setPortfolioData(nextData);
          setPortfolioInfo(nextPortfolio);
          setDraft(nextData ? JSON.parse(JSON.stringify(nextData)) : null);
          setTemplateId(nextPortfolio?.templateId || "default-v4");
        }
      } catch {
        if (!cancelled) {
          setPortfolioData(null);
          setPortfolioInfo(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setAccountDraft({ displayName: `${currentUser?.displayName || ""}`.trim() });
  }, [currentUser?.displayName]);

  // Compute public portfolio link
  const portfolioPath = useMemo(() => {
    if (portfolioInfo?.status === "published" && portfolioInfo?.slug) {
      return `/p/${portfolioInfo.slug}`;
    }
    const uname = portfolioInfo?.username || currentUser?.username;
    return uname ? `/u/${uname}` : "";
  }, [portfolioInfo, currentUser?.username]);

  const portfolioUrl = useMemo(() => {
    if (!portfolioPath) return "";
    if (typeof window === "undefined") return portfolioPath;
    return `${window.location.origin}${portfolioPath}`;
  }, [portfolioPath]);

  const handleCopyPortfolioLink = async () => {
    if (!portfolioUrl) {
      toast.info("Portfolio link is not ready yet.");
      return;
    }
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(portfolioUrl);
      } else {
        throw new Error("Clipboard API not available");
      }
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = portfolioUrl;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    setCopied(true);
    toast.success("Portfolio link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const titleLine = useMemo(() => {
    const raw = portfolioData?.profile?.title;
    if (Array.isArray(raw)) return raw.filter(Boolean).join(" | ");
    return `${raw || ""}`.trim();
  }, [portfolioData]);

  const contactLine = useMemo(() => {
    const contacts = Array.isArray(portfolioData?.profile?.contacts) ? portfolioData.profile.contacts : [];
    return contacts
      .map((item) => `${item?.type || "contact"}: ${item?.text || "-"}`)
      .filter((item) => item.trim().length)
      .join(" | ");
  }, [portfolioData]);

  const handleLogout = () => {
    setLogoutConfirmOpen(true);
  };

  const confirmLogout = async () => {
    await logout();
    navigate("/auth", { replace: true });
  };

  const toContactHref = (type, text, hrefInput = "") => {
    const normalizedType = `${type || "contact"}`.trim().toLowerCase();
    const safeText = `${text || ""}`.trim();
    const givenHref = `${hrefInput || ""}`.trim();
    if (givenHref) return givenHref;
    if (normalizedType === "email" && safeText) return safeText.startsWith("mailto:") ? safeText : `mailto:${safeText}`;
    if (normalizedType === "phone" && safeText) return safeText.startsWith("tel:") ? safeText : `tel:${safeText.replace(/\s+/g, "")}`;
    if (normalizedType === "github" && safeText) return /^https?:\/\//i.test(safeText) ? safeText : `https://${safeText}`;
    return safeText;
  };

  const handleStartEdit = () => {
    const next = portfolioData ? JSON.parse(JSON.stringify(portfolioData)) : null;
    if (next?.profile) {
      next.profile.title = Array.isArray(next.profile.title) && next.profile.title.length ? next.profile.title : [""];
      next.profile.highlights = Array.isArray(next.profile.highlights) && next.profile.highlights.length ? next.profile.highlights : [""];
      next.profile.contacts =
        Array.isArray(next.profile.contacts) && next.profile.contacts.length
          ? next.profile.contacts
          : [{ type: "", text: "", href: "", external: false }];
    }
    setDraft(next);
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setDraft(portfolioData ? JSON.parse(JSON.stringify(portfolioData)) : null);
    setEditing(false);
  };

  const handleDraftChange = (path, value) => {
    setDraft((prev) => {
      const next = prev ? JSON.parse(JSON.stringify(prev)) : {};
      if (path === "profile.name") next.profile.name = value;
      if (path === "profile.avatar") next.profile.avatar = value;
      if (path === "profile.summary") next.profile.summary = value;
      return next;
    });
  };

  const updateTitleItem = (index, value) => {
    setDraft((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const items = Array.isArray(next?.profile?.title) ? [...next.profile.title] : [""];
      items[index] = value;
      next.profile.title = items;
      return next;
    });
  };

  const addTitleItem = () => {
    setDraft((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const items = Array.isArray(next?.profile?.title) ? [...next.profile.title] : [];
      items.push("");
      next.profile.title = items;
      return next;
    });
  };

  const removeTitleItem = (index) => {
    setDraft((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const items = (Array.isArray(next?.profile?.title) ? [...next.profile.title] : []).filter((_, i) => i !== index);
      next.profile.title = items.length ? items : [""];
      return next;
    });
  };

  const updateHighlightItem = (index, value) => {
    setDraft((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const items = Array.isArray(next?.profile?.highlights) ? [...next.profile.highlights] : [""];
      items[index] = value;
      next.profile.highlights = items;
      return next;
    });
  };

  const addHighlightItem = () => {
    setDraft((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const items = Array.isArray(next?.profile?.highlights) ? [...next.profile.highlights] : [];
      items.push("");
      next.profile.highlights = items;
      return next;
    });
  };

  const removeHighlightItem = (index) => {
    setDraft((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const items = (Array.isArray(next?.profile?.highlights) ? [...next.profile.highlights] : []).filter((_, i) => i !== index);
      next.profile.highlights = items.length ? items : [""];
      return next;
    });
  };

  const updateContactItem = (index, field, value) => {
    setDraft((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const contacts = Array.isArray(next?.profile?.contacts) ? [...next.profile.contacts] : [];
      const current = contacts[index] || { type: "", text: "", href: "", external: false };
      contacts[index] = { ...current, [field]: value };
      const type = field === "type" ? value : contacts[index].type;
      const text = field === "text" ? value : contacts[index].text;
      const href = field === "href" ? value : contacts[index].href;
      contacts[index].href = toContactHref(type, text, href);
      contacts[index].external = ["github", "website", "linkedin"].includes(`${type || ""}`.toLowerCase()) || /^https?:\/\//i.test(contacts[index].href || "");
      next.profile.contacts = contacts;
      return next;
    });
  };

  const addContactItem = () => {
    setDraft((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const contacts = Array.isArray(next?.profile?.contacts) ? [...next.profile.contacts] : [];
      contacts.push({ type: "", text: "", href: "", external: false });
      next.profile.contacts = contacts;
      return next;
    });
  };

  const removeContactItem = (index) => {
    setDraft((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const contacts = (Array.isArray(next?.profile?.contacts) ? [...next.profile.contacts] : []).filter((_, i) => i !== index);
      next.profile.contacts = contacts.length ? contacts : [{ type: "", text: "", href: "", external: false }];
      return next;
    });
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const nextDisplayName = `${accountDraft?.displayName || ""}`.trim();
      if (!nextDisplayName) {
        toast.error("Display Name is required.");
        setSaving(false);
        return;
      }

      const cleaned = JSON.parse(JSON.stringify(draft));
      cleaned.profile.title = (Array.isArray(cleaned?.profile?.title) ? cleaned.profile.title : []).map((item) => `${item || ""}`.trim()).filter(Boolean);
      cleaned.profile.highlights = (Array.isArray(cleaned?.profile?.highlights) ? cleaned.profile.highlights : []).map((item) => `${item || ""}`.trim()).filter(Boolean);
      cleaned.profile.contacts = (Array.isArray(cleaned?.profile?.contacts) ? cleaned.profile.contacts : [])
        .map((item) => ({
          type: `${item?.type || "contact"}`.trim().toLowerCase(),
          text: `${item?.text || ""}`.trim(),
          href: `${item?.href || ""}`.trim(),
          external: Boolean(item?.external),
        }))
        .filter((item) => item.text || item.href);

      await upsertMyPortfolioApi({ templateId, data: cleaned });
      const profileUpdate = await updateCurrentUser({ displayName: nextDisplayName });
      if (!profileUpdate.ok) throw new Error(profileUpdate.error || "Failed to update display name.");
      setPortfolioData(JSON.parse(JSON.stringify(cleaned)));
      setEditing(false);
      toast.success("Profile details updated.");
    } catch (error) {
      toast.error(error?.message || "Failed to save profile details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-3.5 sm:gap-4 lg:h-[calc(100dvh-150px)] lg:min-h-0 lg:overflow-hidden">
      {/* Fixed Header Banner at the top */}
      <div className="shrink-0 w-full min-w-0">
        <ProfileHeader
          currentUser={currentUser}
          portfolioData={portfolioData}
          portfolioInfo={portfolioInfo}
          portfolioUrl={portfolioUrl}
          editing={editing}
          saving={saving}
          onEdit={handleStartEdit}
          onCancel={handleCancelEdit}
          onSave={handleSave}
          onLogout={handleLogout}
          onCopy={handleCopyPortfolioLink}
          copied={copied}
        />
      </div>

      {/* Main Row: Left Sidebar & Right Content Panel have identical full height */}
      <div className="grid flex-1 min-h-0 w-full min-w-0 gap-3.5 sm:gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:overflow-hidden">
        <div className="h-full w-full min-w-0 min-h-0">
          <ProfileStageSidebar activeStage={activeStage} setActiveStage={setActiveStage} />
        </div>

        <div className="flex h-full min-h-0 min-w-0 w-full flex-col">
          {activeStage === "account" ? (
            <AccountPanel
              editing={editing}
              currentUser={currentUser}
              accountDraft={accountDraft}
              setAccountDraft={setAccountDraft}
              portfolioUrl={portfolioUrl}
              onCopy={handleCopyPortfolioLink}
              copied={copied}
              templateId={templateId}
              isPublished={portfolioInfo?.status === "published"}
            />
          ) : activeStage === "history" ? (
            <HistoryPanel
              currentPortfolioData={portfolioData}
              currentTemplateId={templateId}
              onPortfolioRestored={(newPortfolio) => {
                const nextData = newPortfolio?.data || null;
                setPortfolioData(nextData);
                setPortfolioInfo(newPortfolio);
                setDraft(nextData ? JSON.parse(JSON.stringify(nextData)) : null);
                if (newPortfolio?.templateId) {
                  setTemplateId(newPortfolio.templateId);
                }
              }}
            />
          ) : (
            <PortfolioPanel
              loading={loading}
              editing={editing}
              portfolioData={portfolioData}
              titleLine={titleLine}
              contactLine={contactLine}
              draft={draft}
              activeStage={activeStage}
              onDraftChange={handleDraftChange}
              addTitleItem={addTitleItem}
              updateTitleItem={updateTitleItem}
              removeTitleItem={removeTitleItem}
              addHighlightItem={addHighlightItem}
              updateHighlightItem={updateHighlightItem}
              removeHighlightItem={removeHighlightItem}
              addContactItem={addContactItem}
              updateContactItem={updateContactItem}
              removeContactItem={removeContactItem}
            />
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={confirmLogout}
        title="Log Out of Portfolio Studio?"
        message="Are you sure you want to log out? You will need to sign in again to access your dashboard and settings."
        confirmText="Log Out"
        variant="warning"
        icon={LogOut}
      />
    </div>
  );
};

export default ProfilePage;
