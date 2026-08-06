// src/components/profile/support/FaqSection.jsx
'use client';
import { useState, useMemo } from 'react';
import { FiChevronDown, FiChevronUp, FiHelpCircle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { FAQ_ITEMS, FAQ_CATEGORIES } from './constants';

export default function FaqSection() {
  const { colors } = useTheme();
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filteredFaqs = useMemo(() => {
    if (activeCategory === 'all') return FAQ_ITEMS;
    return FAQ_ITEMS.filter((item) => item.categoryId === activeCategory);
  }, [activeCategory]);

  const toggleFaq = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* هدر بخش */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#9C27B015' }}
        >
          <FiHelpCircle size={20} color="#9C27B0" />
        </div>
        <div className="flex-1 gap-1">
          <p className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            سوالات متداول
          </p>
          <p className="text-xs" style={{ color: colors.textSecondary }}>
            پاسخ به پرسش‌های رایج کاربران
          </p>
        </div>
      </div>

      {/* فیلتر دسته‌بندی */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {FAQ_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count =
            cat.id === 'all'
              ? FAQ_ITEMS.length
              : FAQ_ITEMS.filter((f) => f.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setExpandedId(null);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-[14px] border-[1.5px] whitespace-nowrap transition-all flex-shrink-0"
              style={{
                backgroundColor: isActive ? cat.color : colors.cardBackground,
                borderColor: isActive ? cat.color : colors.border,
              }}
            >
              <span
                className="text-xs font-[Vazir-Bold]"
                style={{ color: isActive ? '#fff' : colors.textMain }}
              >
                {cat.label}
              </span>
              <span
                className="min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center text-[10px] font-[Vazir-Bold]"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : colors.primary + '20',
                  color: isActive ? '#fff' : colors.primary,
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* لیست سوالات */}
      <div className="space-y-2.5">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((item) => {
            const category = FAQ_CATEGORIES.find((c) => c.id === item.categoryId);
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
                    <div
                      className="flex items-center gap-1.5 mt-3 self-start inline-flex px-2.5 py-1 rounded-lg"
                      style={{ backgroundColor: (category?.color || '#607D8B') + '15' }}
                    >
                      <span
                        className="text-[10px] font-[Vazir-Bold]"
                        style={{ color: category?.color || '#607D8B' }}
                      >
                        {category?.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center py-8 gap-3">
            <span className="text-4xl">🔍</span>
            <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              نتیجه‌ای یافت نشد
            </p>
            <p className="text-xs text-center" style={{ color: colors.textSecondary }}>
              عبارت جستجو یا دسته‌بندی را تغییر دهید
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
