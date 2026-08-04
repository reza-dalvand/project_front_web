'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiUser } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import EmptyState from '@/components/common/EmptyState';
import ModelRequestCard from '@/components/manageBusiness/modelRequest/ModelRequestCard';
import ModelRequestStats from '@/components/manageBusiness/modelRequest/ModelRequestStats';
import ModelRequestDetailModal from '@/components/manageBusiness/modelRequest/ModelRequestDetailModal';

const MOCK_MODEL_REQUESTS = [
  {
    id: 'mr_1',
    serviceId: 'svc_1',
    serviceName: 'فیشیال تخصصی پوست',
    serviceImage: 'https://picsum.photos/200/200?random=50',
    title: 'مدل برای فیشیال VIP عروس',
    description: 'نیاز به مدل برای تست محصولات جدید فیشیال. این خدمت شامل پاکسازی عمیق پوست، استفاده از ماسک طلای ۲۴ عیار و ماساژ صورت با روغن‌های طبیعی است.',
    costType: 'paid',
    status: 'active',
    contactPhone: '09121234567',
    createdAt: '۱۴۰۳/۰۴/۲۲',
    expiresAt: '۱۴۰۳/۰۵/۲۱',
  },
  {
    id: 'mr_2',
    serviceId: 'svc_2',
    serviceName: 'کاشت ناخن ژله‌ای',
    serviceImage: 'https://picsum.photos/200/200?random=51',
    title: 'مدل برای طراحی ناخن جدید',
    description: 'طراحی‌های جدید و خاص برای نمونه‌کار با تکنیک‌های روز دنیا. مناسب ناخن‌های طبیعی و سالم.',
    costType: 'material_cost',
    status: 'active',
    contactPhone: '09129876543',
    createdAt: '۱۴۰۳/۰۴/۲۰',
    expiresAt: '۱۴۰۳/۰۵/۱۹',
  },
  {
    id: 'mr_3',
    serviceId: 'svc_3',
    serviceName: 'رنگ و لایت مو',
    serviceImage: 'https://picsum.photos/200/200?random=52',
    title: 'مدل برای تکنیک جدید بالیاژ',
    description: 'تست تکنیک جدید بالیاژ فرانسوی با مواد اورجینال ایتالیایی. مناسب موهای بلند و سالم.',
    costType: 'free',
    status: 'inactive',
    contactPhone: '09121112233',
    createdAt: '۱۴۰۳/۰۳/۱۵',
    expiresAt: '۱۴۰۳/۰۴/۱۴',
  },
];

export default function ModelRequestsPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();
  const [requests, setRequests] = useState(MOCK_MODEL_REQUESTS);

  // 🆕 state مدال جزئیات
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const handleCreate = () => router.push('/manage/model-requests/create');
  const handleEdit = (request) => {
    router.push(`/manage/model-requests/create?id=${request.id}`);
  };
  const handleDelete = (request) => {
    setRequests((prev) => prev.filter((r) => r.id !== request.id));
    setDetailVisible(false);
    setSelectedRequest(null);
    showToast('درخواست مدل با موفقیت حذف شد', 'success');
  };

  // 🆕 هندلر باز کردن جزئیات
  const openDetail = (request) => {
    setSelectedRequest(request);
    setDetailVisible(true);
  };
  const closeDetail = () => {
    setDetailVisible(false);
    setTimeout(() => setSelectedRequest(null), 300);
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
      <Header title="درخواست‌های مدل" onBackPress={() => router.push('/manage')} />
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {/* Hero */}
        <div className="flex flex-col items-center gap-2 py-4 mb-4">
          <div
            className="w-[72px] h-[72px] rounded-3xl flex items-center justify-center"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <FiUser size={32} style={{ color: colors.primary }} />
          </div>
          <h2 className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            درخواست‌های مدل
          </h2>
          <p className="text-xs font-[Vazir] text-center px-5" style={{ color: colors.textSecondary }}>
            برای مشاهده جزئیات، روی هر درخواست ضربه بزنید
          </p>
        </div>

        {requests.length > 0 && (
          <div className="mb-4"><ModelRequestStats requests={requests} /></div>
        )}

        {/* دکمه ایجاد */}
        {requests.length > 0 && (
          <button
            onClick={handleCreate}
            className="w-full flex items-center gap-3 p-3.5 rounded-2xl mb-4 transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{ backgroundColor: '#43A047' }}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <FiPlus size={22} color="#fff" />
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm font-[Vazir-Bold] text-white">ثبت درخواست مدل جدید</p>
              <p className="text-[11px] text-white/80">مدل جدیدی برای خدمات خود جذب کنید</p>
            </div>
          </button>
        )}

        {/* لیست */}
        {requests.length > 0 ? (
          requests.map((request) => (
            <ModelRequestCard
              key={request.id}
              request={request}
              onPress={openDetail}
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
      </div>

      {/* 🆕 مدال جزئیات */}
      <ModelRequestDetailModal
        visible={detailVisible}
        request={selectedRequest}
        onClose={closeDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </ScreenWrapper>
  );
}