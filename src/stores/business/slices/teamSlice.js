// src/stores/business/slices/teamSlice.js

/**
 * Slice تیم
 * اکشن‌های مدیریت اعضای تیم کسب‌وکار
 */
export const createTeamSlice = (set) => ({
  // ─── افزودن عضو تیم ───
  addTeamMember: (member) =>
    set((state) => ({
      businessData: {
        ...state.businessData,
        team: [...state.businessData.team, { ...member, id: member.id || `emp_${Date.now()}` }],
      },
    })),

  // ─── ویرایش عضو تیم ───
  updateTeamMember: (memberId, updates) =>
    set((state) => ({
      businessData: {
        ...state.businessData,
        team: state.businessData.team.map((m) => (m.id === memberId ? { ...m, ...updates } : m)),
      },
    })),

  // ─── حذف عضو تیم ───
  deleteTeamMember: (memberId) =>
    set((state) => ({
      businessData: {
        ...state.businessData,
        team: state.businessData.team.filter((m) => m.id !== memberId),
      },
    })),
});
