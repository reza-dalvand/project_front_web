'use client';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import TeamManagement from '@/components/createbusiness/TeamManagement';

export default function ManageTeamPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const businessData = useBusinessStore((s) => s.businessData);
  const addTeamMember = useBusinessStore((s) => s.addTeamMember);
  const updateTeamMember = useBusinessStore((s) => s.updateTeamMember);
  const deleteTeamMember = useBusinessStore((s) => s.deleteTeamMember);

  const handleChange = (updatedTeam) => {
    const currentTeam = businessData.team || [];

    // اضافه کردن اعضا جدید
    const newMembers = updatedTeam.filter((m) => !currentTeam.find((cm) => cm.id === m.id));
    newMembers.forEach((m) => addTeamMember(m));

    // حذف اعضا
    currentTeam.forEach((cm) => {
      if (!updatedTeam.find((m) => m.id === cm.id)) {
        deleteTeamMember(cm.id);
      }
    });

    // ویرایش اعضا
    updatedTeam.forEach((um) => {
      const current = currentTeam.find((cm) => cm.id === um.id);
      if (current && JSON.stringify(current) !== JSON.stringify(um)) {
        updateTeamMember(um.id, um);
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <ScreenWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <p style={{ color: colors.textMain }}>در حال بارگذاری...</p>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padding={0}>
      <Header title="مدیریت تیم" onBackPress={() => router.back()} />
      <div className="flex-1 overflow-y-auto p-5 pb-32">
        <TeamManagement
          team={businessData.team || []}
          services={businessData.services || []}
          onChange={handleChange}
        />
      </div>
    </ScreenWrapper>
  );
}
