// src/app/profile/support/page.jsx
'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  FiChevronDown,
  FiChevronUp,
  FiHelpCircle,
  FiPlus,
  FiMessageSquare,
  FiClock,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { supportService } from '@/api';
import { USE_MOCK } from '@/api/config';
import {
  FAQ_ITEMS,
  FAQ_CATEGORIES,
  SUPPORT_CHANNELS,
} from '@/components/profile/support/constants';
import dynamic from 'next/dynamic';
import { toPersianDigit } from '@/utils/numberUtils';
import { useRouter } from 'next/navigation';

const TicketCreateModal = dynamic(() => import('@/components/profile/support/TicketCreateModal'), {
  ssr: false,
  loading: () => null,
});

const TICKET_STATUS_META = {
  open: { label: 'باز', color: '#2196F3' },
  in_progress: { label: 'در حال بررسی', color: '#FF9800' },
  resolved: { label: 'حل شده', color: '#43A047' },
  closed: { label: 'بسته شده', color: '#9E9E9E' },
};

const TICKET_PRIORITY_META = {
  low: { label: 'کم', color: '#9E9E9E' },
  medium: { label: 'متوسط', color: '#FF9800' },
  high: { label: 'بالا', color: '#E53935' },
  urgent: { label: 'فوری', color: '#D32F2F' },
};

export default function SupportPage() {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const router = useRouter(); 
  const [activeTab, setActiveTab] = useState('faq'); // 'faq' | 'tickets'
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ticketModalVisible, setTicketModalVisible] = useState(false);

  // ═══ دریافت FAQ از API ═══
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        if (USE_MOCK) {
          setFaqs(FAQ_ITEMS);
        } else {
          const result = await supportService.getFAQ();
          setFaqs(result.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch FAQs:', error);
        setFaqs(FAQ_ITEMS);
      }
    };
    fetchFaqs();
  }, []);

  // ═══ دریافت تیکت‌ها از API ═══
  useEffect(() => {
    if (activeTab !== 'tickets') return;
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        if (USE_MOCK) {
          setTickets([]);
        } else {
          const result = await supportService.getMyTickets();
          setTickets(result.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, [activeTab]);

  // ═══ فیلتر FAQ ═══
  const filteredFaqs = useMemo(() => {
    if (activeCategory === 'all') return faqs;
    return faqs.filter(
      (item) => item.category === activeCategory || item.categoryId === activeCategory
    );
  }, [faqs, activeCategory]);

  const toggleFaq = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleTicketCreated = (ticket) => {
    setTickets((prev) => [ticket, ...prev]);
    setTicketModalVisible(false);
    showToast('تیکت با موفقیت ایجاد شد', 'success');
  };

  return (
    <ScreenWrapper padding={0}>
      {/* هدر */}
      <div className="rounded-b-3xl pb-7 px-5 pt-8" style={{ backgroundColor: colors.primary }}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <FiChevronDown size={20} color="#fff" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-[Vazir-Bold] text-white">پشتیبانی و راهنما</h1>
            <p className="text-xs text-white/70 mt-1">تیم ما آماده پاسخگویی به شماست</p>
          </div>
        </div>

        {/* تب‌ها */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setActiveTab('faq')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-[Vazir-Bold] transition-all"
            style={{
              backgroundColor:
                activeTab === 'faq' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.15)',
              color: activeTab === 'faq' ? colors.primary : '#fff',
            }}
          >
            <FiHelpCircle size={16} />
            سوالات متداول
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-[Vazir-Bold] transition-all"
            style={{
              backgroundColor:
                activeTab === 'tickets' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.15)',
              color: activeTab === 'tickets' ? colors.primary : '#fff',
            }}
          >
            <FiMessageSquare size={16} />
            تیکت‌های من
            {tickets.length > 0 && (
              <span
                className="min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center text-[10px] font-[Vazir-Bold]"
                style={{ backgroundColor: colors.primary, color: '#fff' }}
              >
                {toPersianDigit(tickets.length)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* محتوا */}
      <div className="px-5 pt-5 pb-32">
        {activeTab === 'faq' ? (
          <>
            {/* فیلتر دسته‌بندی */}
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
              {FAQ_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                const count =
                  cat.id === 'all'
                    ? faqs.length
                    : faqs.filter((f) => f.category === cat.id || f.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setExpandedId(null);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-[14px] border-[1.5px] whitespace-nowrap text-xs font-[Vazir-Bold] transition-all flex-shrink-0"
                    style={{
                      backgroundColor: isActive ? cat.color : colors.cardBackground,
                      borderColor: isActive ? cat.color : colors.border,
                      color: isActive ? '#fff' : colors.textMain,
                    }}
                  >
                    {cat.label}
                    <span
                      className="min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center text-[10px] font-[Vazir-Bold]"
                      style={{
                        backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : colors.primary + '20',
                        color: isActive ? '#fff' : colors.primary,
                      }}
                    >
                      {toPersianDigit(count)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* لیست سوالات */}
            <div className="space-y-2.5 mt-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((item) => {
                  const category = FAQ_CATEGORIES.find(
                    (c) => c.id === item.category || c.id === item.categoryId
                  );
                  const isExpanded = expandedId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border overflow-hidden transition-all"
                      style={{
                        backgroundColor: isExpanded ? colors.primary + '05' : colors.cardBackground,
                        borderColor: isExpanded ? colors.primary : colors.border,
                      }}
                    >
                      <button
                        onClick={() => toggleFaq(item.id)}
                        className="flex items-center gap-3 p-3.5 w-full text-right"
                      >
                        <div
                          className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: (category?.color || '#607D8B') + '20' }}
                        >
                          <FiHelpCircle size={16} color={category?.color || '#607D8B'} />
                        </div>
                        <span
                          className="flex-1 text-[13px] font-[Vazir-Bold] leading-[21px] text-right"
                          style={{ color: colors.textMain }}
                        >
                          {item.question}
                        </span>
                        {isExpanded ? (
                          <FiChevronUp size={18} color={colors.primary} />
                        ) : (
                          <FiChevronDown size={18} color={colors.textSecondary} />
                        )}
                      </button>
                      {isExpanded && (
                        <div
                          className="px-3.5 pb-3.5 pt-2.5 border-t mx-2"
                          style={{ borderTopColor: colors.border }}
                        >
                          <p
                            className="text-[13px] leading-[23px] text-justify"
                            style={{ color: colors.textSecondary }}
                          >
                            {item.answer}
                          </p>
                          {category && (
                            <div
                              className="flex items-center gap-1.5 mt-3 self-start inline-flex px-2.5 py-1 rounded-lg"
                              style={{ backgroundColor: category.color + '15' }}
                            >
                              <span
                                className="text-[10px] font-[Vazir-Bold]"
                                style={{ color: category.color }}
                              >
                                {category.label}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <EmptyState
                  icon="🔍"
                  title="نتیجه‌ای یافت نشد"
                  description="دسته‌بندی دیگری را انتخاب کنید"
                />
              )}
            </div>
          </>
        ) : (
          <>
            {/* دکمه ایجاد تیکت */}
            <button
              onClick={() => setTicketModalVisible(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed transition-all mb-4"
              style={{ borderColor: colors.primary + '50', backgroundColor: colors.primary + '05' }}
            >
              <FiPlus size={18} style={{ color: colors.primary }} />
              <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.primary }}>
                ایجاد تیکت جدید
              </span>
            </button>

            {/* لیست تیکت‌ها */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner label="در حال بارگذاری..." />
              </div>
            ) : tickets.length > 0 ? (
              <div className="space-y-3">
                {tickets.map((ticket) => {
                  const statusMeta = TICKET_STATUS_META[ticket.status] || TICKET_STATUS_META.open;
                  const priorityMeta =
                    TICKET_PRIORITY_META[ticket.priority] || TICKET_PRIORITY_META.medium;
                  return (
                    <div
                      key={ticket.id}
                      className="p-3.5 rounded-2xl border"
                      style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className="text-sm font-[Vazir-Bold] line-clamp-1"
                          style={{ color: colors.textMain }}
                        >
                          {ticket.subject}
                        </span>
                        <span
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-[Vazir-Bold] flex-shrink-0"
                          style={{
                            backgroundColor: statusMeta.color + '18',
                            color: statusMeta.color,
                          }}
                        >
                          {statusMeta.label}
                        </span>
                      </div>
                      <p
                        className="text-xs leading-5 line-clamp-2 mb-2"
                        style={{ color: colors.textSecondary }}
                      >
                        {ticket.message}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-lg"
                          style={{
                            backgroundColor: priorityMeta.color + '15',
                            color: priorityMeta.color,
                          }}
                        >
                          اولویت: {priorityMeta.label}
                        </span>
                        <span className="text-[10px]" style={{ color: colors.textSecondary }}>
                          {ticket.created_at}
                        </span>
                      </div>
                      {ticket.response && (
                        <div
                          className="mt-3 p-3 rounded-xl border"
                          style={{
                            backgroundColor: colors.primary + '08',
                            borderColor: colors.primary + '25',
                          }}
                        >
                          <p
                            className="text-[11px] font-[Vazir-Bold] mb-1"
                            style={{ color: colors.primary }}
                          >
                            پاسخ پشتیبانی:
                          </p>
                          <p className="text-xs leading-5" style={{ color: colors.textSecondary }}>
                            {ticket.response}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon="🎧"
                title="تیکتی ثبت نکرده‌اید"
                description="در صورت نیاز به پشتیبانی، تیکت جدید ایجاد کنید"
              />
            )}
          </>
        )}
      </div>

      {/* مدال ایجاد تیکت */}
      <TicketCreateModal
        visible={ticketModalVisible}
        onClose={() => setTicketModalVisible(false)}
        onTicketCreated={handleTicketCreated}
      />
    </ScreenWrapper>
  );
}
