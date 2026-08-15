// src/app/manage/model-requests/page.jsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiUser } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ModelRequestCard from '@/components/manageBusiness/modelRequest/ModelRequestCard';
import ModelRequestStats from '@/components/manageBusiness/modelRequest/ModelRequestStats';
import ModelRequestDetailModal from '@/components/manageBusiness/modelRequest/ModelRequestDetailModal';
import { adsService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { MOCK_MODEL_REQUESTS } from '@/data/modelRequests';

export default function ModelRequestsPage() {
const { colors } = useTheme();
const router = useRouter();
const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
const { showToast } = useToast();

const [requests, setRequests] = useState(MOCK_MODEL_REQUESTS);
const [isLoading, setIsLoading] = useState(false);

// ✅ state مدال جزئیات
const [detailVisible, setDetailVisible] = useState(false);
const [selectedRequest, setSelectedRequest] = useState(null);

// ═══════ دریافت لیست من از API ═══════
useEffect(() => {
const fetchMyRequests = async () => {
if (USE_MOCK) return;
setIsLoading(true);
try {
const result = await adsService.getMyModelRequests();
setRequests(result.data || []);
} catch (error) {
console.error('Failed to fetch my model requests:', error);
showToast('خطا در بارگذاری درخواست‌ها', 'error');
} finally {
setIsLoading(false);
}
};
fetchMyRequests();
}, [showToast]);

const handleCreate = useCallback(() => router.push('/manage/model-requests/create'), [router]);

const handleEdit = useCallback(
(request) => router.push(`/manage/model-requests/create?id=${request.id}`),
[router]
);

// ✅ هندلر باز کردن مدال جزئیات
const handleAdPress = useCallback((request) => {
setSelectedRequest(request);
setDetailVisible(true);
}, []);

// ✅ هندلر بستن مدال جزئیات
const handleCloseDetail = useCallback(() => {
setDetailVisible(false);
setSelectedRequest(null);
}, []);

const handleDelete = useCallback(
async (request) => {
try {
if (!USE_MOCK) {
await adsService.deleteModelRequest(request.id);
}
setRequests((prev) => prev.filter((r) => r.id !== request.id));
showToast('درخواست مدل با موفقیت حذف شد', 'success');
setDetailVisible(false);
setSelectedRequest(null);
} catch (error) {
console.error('Failed to delete model request:', error);
showToast(error.message || 'خطا در حذف درخواست', 'error');
}
},
[showToast]
);

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
<Header title="درخواست‌های مدل" onBackPress={() => router.push('/manage')} />

<div className="flex-1 overflow-y-auto p-4 pb-32">
<div className="flex flex-col items-center gap-2 py-4 mb-4">
<div
className="w-[72px] h-[72px] rounded-3xl flex items-center justify-center"
style={{ backgroundColor: '#E91E6315' }}
>
<FiUser size={32} color="#E91E63" />
</div>
<h2 className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
مدیریت درخواست‌های مدل
</h2>
</div>

{isLoading ? (
<div className="flex justify-center py-12">
<LoadingSpinner label="در حال بارگذاری..." />
</div>
) : (
<>
{requests.length > 0 && (
<div className="mb-4">
<ModelRequestStats requests={requests} />
</div>
)}

{requests.length > 0 && (
<button
onClick={handleCreate}
className="w-full flex items-center gap-3 p-3.5 rounded-2xl mb-4 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg"
style={{ backgroundColor: '#43A047' }}
>
<div
className="w-11 h-11 rounded-xl flex items-center justify-center"
style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
>
<FiPlus size={22} color="#fff" />
</div>
<div className="flex-1 text-right">
<p className="text-sm font-[Vazir-Bold] text-white">ایجاد درخواست مدل جدید</p>
<p className="text-[11px] text-white/80">مدل جدیدی برای خدمات خود جذب کنید</p>
</div>
</button>
)}

{requests.length > 0 ? (
requests.map((request) => (
<ModelRequestCard
key={request.id}
request={request}
onPress={handleAdPress}
onEdit={handleEdit}
onDelete={handleDelete}
/>
))
) : (
<EmptyState
icon="🧑‍🎨"
title="هنوز درخواست مدلی ثبت نکرده‌اید"
description="با ثبت درخواست مدل، می‌توانید نمونه‌کارهای جدید بسازید"
actionLabel="ایجاد اولین درخواست"
onAction={handleCreate}
/>
)}
</>
)}
</div>

{/* ✅ مدال جزئیات درخواست مدل */}
<ModelRequestDetailModal
visible={detailVisible}
request={selectedRequest}
onClose={handleCloseDetail}
onEdit={handleEdit}
onDelete={handleDelete}
/>
</ScreenWrapper>
);
}