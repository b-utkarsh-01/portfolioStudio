const makeId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const useWorkFormState = (setForm) => {
  const addWorkItem = (collectionKey, emptyItem) => {
    setForm((prev) => ({
      ...prev,
      [collectionKey]: [
        ...(Array.isArray(prev[collectionKey]) ? prev[collectionKey] : []),
        { id: makeId("work-item"), ...emptyItem },
      ],
    }));
  };

  const removeWorkItem = (collectionKey, itemId) => {
    setForm((prev) => ({
      ...prev,
      [collectionKey]: (Array.isArray(prev[collectionKey]) ? prev[collectionKey] : []).filter((item) => item.id !== itemId),
    }));
  };

  const updateWorkItemField = (collectionKey, itemId, field, value) => {
    setForm((prev) => ({
      ...prev,
      [collectionKey]: (Array.isArray(prev[collectionKey]) ? prev[collectionKey] : []).map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addCollectionItem = (collectionKey, emptyItem) => {
    setForm((prev) => ({
      ...prev,
      [collectionKey]: [
        ...(Array.isArray(prev[collectionKey]) ? prev[collectionKey] : []),
        { id: makeId("collection-item"), ...emptyItem },
      ],
    }));
  };

  const removeCollectionItem = (collectionKey, itemId) => {
    setForm((prev) => ({
      ...prev,
      [collectionKey]: (Array.isArray(prev[collectionKey]) ? prev[collectionKey] : []).filter((item) => item.id !== itemId),
    }));
  };

  const updateCollectionItemField = (collectionKey, itemId, field, value) => {
    setForm((prev) => ({
      ...prev,
      [collectionKey]: (Array.isArray(prev[collectionKey]) ? prev[collectionKey] : []).map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    }));
  };

  return {
    addWorkItem,
    removeWorkItem,
    updateWorkItemField,
    addCollectionItem,
    removeCollectionItem,
    updateCollectionItemField,
  };
};

export default useWorkFormState;
