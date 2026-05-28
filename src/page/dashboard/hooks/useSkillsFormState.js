const makeId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const useSkillsFormState = (setForm) => {
  const addSkillGroup = () => {
    setForm((prev) => ({
      ...prev,
      skillsAdditionalGroups: [
        ...(Array.isArray(prev.skillsAdditionalGroups) ? prev.skillsAdditionalGroups : []),
        { id: makeId("skill-group"), name: "", skills: [""] },
      ],
    }));
  };

  const removeSkillGroup = (groupId) => {
    setForm((prev) => ({
      ...prev,
      skillsAdditionalGroups: (Array.isArray(prev.skillsAdditionalGroups) ? prev.skillsAdditionalGroups : []).filter(
        (group) => group.id !== groupId
      ),
    }));
  };

  const updateSkillGroupName = (groupId, name) => {
    setForm((prev) => ({
      ...prev,
      skillsAdditionalGroups: (Array.isArray(prev.skillsAdditionalGroups) ? prev.skillsAdditionalGroups : []).map(
        (group) => (group.id === groupId ? { ...group, name } : group)
      ),
    }));
  };

  const addSkillToGroup = (groupId) => {
    setForm((prev) => ({
      ...prev,
      skillsAdditionalGroups: (Array.isArray(prev.skillsAdditionalGroups) ? prev.skillsAdditionalGroups : []).map(
        (group) =>
          group.id === groupId
            ? { ...group, skills: [...(Array.isArray(group.skills) ? group.skills : []), ""] }
            : group
      ),
    }));
  };

  const removeSkillFromGroup = (groupId, skillIndex) => {
    setForm((prev) => ({
      ...prev,
      skillsAdditionalGroups: (Array.isArray(prev.skillsAdditionalGroups) ? prev.skillsAdditionalGroups : []).map(
        (group) => {
          if (group.id !== groupId) return group;
          const nextSkills = (Array.isArray(group.skills) ? group.skills : []).filter((_, index) => index !== skillIndex);
          return { ...group, skills: nextSkills.length ? nextSkills : [""] };
        }
      ),
    }));
  };

  const updateSkillInGroup = (groupId, skillIndex, value) => {
    setForm((prev) => ({
      ...prev,
      skillsAdditionalGroups: (Array.isArray(prev.skillsAdditionalGroups) ? prev.skillsAdditionalGroups : []).map(
        (group) => {
          if (group.id !== groupId) return group;
          const nextSkills = [...(Array.isArray(group.skills) ? group.skills : [])];
          nextSkills[skillIndex] = value;
          return { ...group, skills: nextSkills };
        }
      ),
    }));
  };

  return {
    addSkillGroup,
    removeSkillGroup,
    updateSkillGroupName,
    addSkillToGroup,
    removeSkillFromGroup,
    updateSkillInGroup,
  };
};

export default useSkillsFormState;
