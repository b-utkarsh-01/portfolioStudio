import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import {
  checkSlugAvailabilityApi,
  getMyPortfolioApi,
  publishMyPortfolioApi,
  unpublishMyPortfolioApi,
  upsertMyPortfolioApi,
} from "../../features/portfolio/portfolioApi";
import { toast } from "react-toastify";
import useDashboardFormState from "./useDashboardFormState";
import { buildFormState, buildPortfolioData } from "./formData";

const useDashboardState = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const appliedIntentRef = useRef("");
  const publishBusyRef = useRef(false);

  const { form, setForm, savedAt, setSavedAt, statusDetails, setStatusDetails, handlers } = useDashboardFormState();
  const [publishing, setPublishing] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState({ status: "draft", visibility: "private", slug: "" });

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    const loadPortfolio = async () => {
      try {
        const payload = await getMyPortfolioApi();
        if (!cancelled) {
          const nextData = payload?.portfolio?.data;
          const nextTemplateId = payload?.portfolio?.templateId || "premium-v1";
          const nextSlug = payload?.portfolio?.slug || "";
          const nextVisibility = payload?.portfolio?.visibility || "public";
          const nextStatus = payload?.portfolio?.status || "draft";
          const templateIntent = location.state?.templateId || "";

          if (templateIntent && templateIntent !== nextTemplateId && appliedIntentRef.current !== templateIntent) {
            appliedIntentRef.current = templateIntent;
            await upsertMyPortfolioApi({
              templateId: templateIntent,
              data: nextData,
            });
            setForm({
              ...buildFormState(nextData, templateIntent),
              slug: nextSlug,
              visibility: nextVisibility,
            });
            setPublishStatus({ status: nextStatus, visibility: nextVisibility, slug: nextSlug });
            setSavedAt(null);
            toast.success("Template applied. You can now edit and publish.");
            navigate("/dashboard", { replace: true });
            return;
          }

          setForm({
            ...buildFormState(nextData, nextTemplateId),
            slug: nextSlug,
            visibility: nextVisibility,
          });
          setPublishStatus({ status: nextStatus, visibility: nextVisibility, slug: nextSlug });
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(error.message || "Could not load existing portfolio.");
          setStatusDetails(Array.isArray(error?.details) ? error.details : []);
        }
      }
    };

    loadPortfolio();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, location.state, navigate, setForm, setSavedAt, setStatusDetails]);

  const profileUrl = useMemo(
    () => (currentUser?.username ? `/u/${currentUser.username}` : "/"),
    [currentUser?.username]
  );

  const publishedSlugPath = useMemo(() => {
    if (publishStatus?.status !== "published") return "";
    const slug = `${publishStatus?.slug || ""}`.trim();
    return slug ? `/p/${slug}` : "";
  }, [publishStatus?.slug, publishStatus?.status]);

  const urlDataPortfolioPath = useMemo(() => "/my-preview", []);

  const publicPortfolioUrl = useMemo(() => {
    const fallbackPath = currentUser?.username ? profileUrl : "";
    const resolvedPath = publishedSlugPath || fallbackPath;
    if (!resolvedPath) return "";
    if (typeof window === "undefined") return resolvedPath;
    return `${window.location.origin}${resolvedPath}`;
  }, [currentUser?.username, profileUrl, publishedSlugPath]);

  const handleSave = async (event) => {
    if (event?.preventDefault) event.preventDefault();
    if (!isAuthenticated) return;
    setStatusDetails([]);

    try {
      await upsertMyPortfolioApi({
        templateId: form.templateId,
        data: buildPortfolioData(form),
      });
      setSavedAt(Date.now());
      toast.success("Portfolio saved.");
      setStatusDetails([]);
    } catch (error) {
      toast.error(error.message || "Save failed.");
      setStatusDetails(Array.isArray(error?.details) ? error.details : []);
    }
  };

  const handlePublish = async () => {
    if (!isAuthenticated || publishBusyRef.current) return;
    publishBusyRef.current = true;
    setPublishing(true);
    setStatusDetails([]);
    try {
      await upsertMyPortfolioApi({
        templateId: form.templateId,
        data: buildPortfolioData(form),
      });

      const slug = `${form.slug || ""}`.trim();
      if (slug) {
        if (slug.length < 3) {
          throw new Error("Slug must be at least 3 characters.");
        }
        const availability = await checkSlugAvailabilityApi(slug);
        if (!availability?.available) {
          throw new Error(availability?.reason === "reserved" ? "Slug is reserved." : "Slug is already taken.");
        }
      }

      const response = await publishMyPortfolioApi({
        slug,
        visibility: form.visibility || "public",
      });
      const nextMeta = response?.portfolio || {};
      setPublishStatus({
        status: nextMeta.status || "published",
        visibility: nextMeta.visibility || form.visibility || "public",
        slug: nextMeta.slug || slug,
      });
      setForm((prev) => ({
        ...prev,
        slug: nextMeta.slug || prev.slug || "",
        visibility: nextMeta.visibility || prev.visibility || "public",
      }));
      toast.success("Portfolio published.");
    } catch (error) {
      toast.error(error?.message || "Publish failed.");
      setStatusDetails(Array.isArray(error?.details) ? error.details : []);
    } finally {
      setPublishing(false);
      publishBusyRef.current = false;
    }
  };

  const handleUnpublish = async () => {
    if (!isAuthenticated || publishBusyRef.current) return;
    publishBusyRef.current = true;
    setUnpublishing(true);
    try {
      const response = await unpublishMyPortfolioApi();
      const nextMeta = response?.portfolio || {};
      setPublishStatus({
        status: nextMeta.status || "draft",
        visibility: nextMeta.visibility || "private",
        slug: nextMeta.slug || form.slug || "",
      });
      setForm((prev) => ({
        ...prev,
        visibility: nextMeta.visibility || "private",
      }));
      toast.success("Portfolio unpublished.");
    } catch (error) {
      toast.error(error?.message || "Unpublish failed.");
    } finally {
      setUnpublishing(false);
      publishBusyRef.current = false;
    }
  };

  const handleCopyPublicUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicPortfolioUrl);
      toast.success("Public URL copied.");
    } catch {
      toast.error("Copy failed. URL manually copy kar lo.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const resetToDefault = () => {
    handlers.resetToDefault();
    toast.success("Reset to default.");
  };

  return {
    currentUser,
    form,
    savedAt,
    statusDetails,
    publishing,
    unpublishing,
    publishStatus,
    profileUrl,
    urlDataPortfolioPath,
    publicPortfolioUrl,
    handlers: {
      ...handlers,
      handleSave,
      handlePublish,
      handleUnpublish,
      handleCopyPublicUrl,
      handleLogout,
      resetToDefault,
    },
  };
};

export default useDashboardState;
