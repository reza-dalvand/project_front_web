// src/app/search/page.jsx
'use client';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiArrowRight, FiSearch, FiX, FiMapPin, FiStar } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toPersianDigit } from '@/utils/numberUtils';
import { searchService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { MOCK_BUSINESSES_LIST } from '@/data/businesses';

const TAB_OPTIONS = [
  { id: 'all', label: 'همه' },
  { id: 'businesses', label: 'کسب‌وکار' },
  { id: 'services', label: 'خدمات' },
];

export default function SearchPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [searchResults, setSearchResults] = useState({ businesses: [], services: [], total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (USE_MOCK) {
          setSearchHistory([]);
        } else {
          const result = await searchService.getSearchHistory();
          setSearchHistory(result.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch search history:', error);
      }
    };
    fetchHistory();
  }, []);

  // ✅ FIX (فاز ۴): cancelled flag + cleanup timer
  // جلوگیری از setState بعد از unmount و race condition
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults({ businesses: [], services: [], total: 0 });
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        if (USE_MOCK) {
          const q = searchQuery.trim().toLowerCase();
          const businesses = MOCK_BUSINESSES_LIST.filter(
            (b) =>
              b.name.toLowerCase().includes(q) ||
              b.serviceType.toLowerCase().includes(q) ||
              b.category.toLowerCase().includes(q)
          );
          if (!cancelled) {
            setSearchResults({ businesses, services: [], total: businesses.length });
          }
        } else {
          const result = await searchService.search(searchQuery, activeTab, 20);
          if (!cancelled) {
            setSearchResults({
              businesses: result.data.businesses || [],
              services: result.data.services || [],
              total: result.data.total || 0,
            });
          }
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Search failed:', error);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery, activeTab]);

  const filteredResults = useMemo(() => {
    if (activeTab === 'all') return searchResults;
    if (activeTab === 'businesses')
      return {
        businesses: searchResults.businesses,
        services: [],
        total: searchResults.businesses.length,
      };
    if (activeTab === 'services')
      return {
        businesses: [],
        services: searchResults.services,
        total: searchResults.services.length,
      };
    return searchResults;
  }, [searchResults, activeTab]);

  const handleBusinessPress = useCallback(
    (business) => {
      router.push(`/business/${business.id}`);
    },
    [router]
  );

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setSearchResults({ businesses: [], services: [], total: 0 });
    setActiveTab('all');
  }, []);

  return (
    <ScreenWrapper scrollable padding={0}>
      <div
        className="px-4 py-3 border-b"
        style={{ backgroundColor: colors.background, borderBottomColor: colors.border }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl flex items-center justify-center border"
            style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
          >
            <FiArrowRight size={20} style={{ color: colors.textMain }} />
          </button>
          <div
            className="flex-1 flex items-center gap-2.5 px-4 h-12 rounded-2xl border transition-all"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            <FiSearch size={20} style={{ color: colors.textSecondary }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی خدمات، کسب‌وکارها..."
              className="flex-1 bg-transparent outline-none text-sm font-[Vazir] text-right"
              style={{ color: colors.textMain }}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <button onClick={handleClear} className="p-1">
                <FiX size={16} style={{ color: colors.textSecondary }} />
              </button>
            )}
          </div>
        </div>
        {searchQuery.trim().length >= 2 && (
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
            {TAB_OPTIONS.map((tab) => {
              const isActive = activeTab === tab.id;
              const count =
                tab.id === 'all'
                  ? searchResults.total
                  : tab.id === 'businesses'
                    ? searchResults.businesses.length
                    : searchResults.services.length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-[14px] border-[1.5px] whitespace-nowrap text-xs font-[Vazir-Bold] transition-all flex-shrink-0"
                  style={{
                    backgroundColor: isActive ? colors.primary : colors.cardBackground,
                    borderColor: isActive ? colors.primary : colors.border,
                    color: isActive ? '#fff' : colors.textMain,
                  }}
                >
                  {tab.label}
                  {count > 0 && (
                    <span
                      className="min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center text-[10px] font-[Vazir-Bold]"
                      style={{
                        backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : colors.primary + '20',
                        color: isActive ? '#fff' : colors.primary,
                      }}
                    >
                      {toPersianDigit(count)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className="px-4 py-4 pb-32">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="در حال جستجو..." />
          </div>
        ) : searchQuery.trim().length < 2 ? (
          <div className="flex flex-col items-center py-12 gap-4">
            <span className="text-5xl">🔍</span>
            <h3
              className="text-base font-[Vazir-Bold] text-center"
              style={{ color: colors.textMain }}
            >
              چه چیزی می‌خواهید جستجو کنید؟
            </h3>
            <p
              className="text-sm text-center leading-6 max-w-xs"
              style={{ color: colors.textSecondary }}
            >
              نام کسب‌وکار، خدمت یا دسته‌بندی مورد نظر را وارد کنید
            </p>
          </div>
        ) : filteredResults.total > 0 ? (
          <div className="space-y-4">
            {filteredResults.businesses.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                  کسب‌وکارها ({toPersianDigit(filteredResults.businesses.length)})
                </h3>
                {filteredResults.businesses.map((business) => (
                  <button
                    key={business.id}
                    onClick={() => handleBusinessPress(business)}
                    className="w-full flex items-center gap-3 p-3.5 rounded-2xl border text-right transition-all hover:shadow-md active:scale-[0.99]"
                    style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
                  >
                    {business.logo && (
                      <Image
                        src={business.logo}
                        alt={business.name}
                        width={48}
                        height={48}
                        className="rounded-xl"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-[Vazir-Bold] line-clamp-1"
                        style={{ color: colors.textMain }}
                      >
                        {business.name}
                      </p>
                      <p
                        className="text-xs font-[Vazir-Medium] line-clamp-1"
                        style={{ color: colors.primary }}
                      >
                        {business.category_name || business.category || ''}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {business.city_name && (
                          <span className="text-[10px]" style={{ color: colors.textSecondary }}>
                            📍 {business.city_name}
                          </span>
                        )}
                        {business.rating > 0 && (
                          <span
                            className="flex items-center gap-1 text-[10px] font-[Vazir-Bold]"
                            style={{ color: colors.textMain }}
                          >
                            <FiStar size={10} color="#FFC107" fill="#FFC107" />
                            {toPersianDigit(business.rating)}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {filteredResults.services.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                  خدمات ({toPersianDigit(filteredResults.services.length)})
                </h3>
                {filteredResults.services.map((service) => (
                  <div
                    key={service.id}
                    className="w-full p-3.5 rounded-2xl border"
                    style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
                  >
                    <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                      {service.name}
                    </p>
                    <p
                      className="text-xs font-[Vazir-Medium] mt-1"
                      style={{ color: colors.primary }}
                    >
                      {service.business_name}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.primary }}>
                        {toPersianDigit((service.final_price || 0).toLocaleString('en-US'))} تومان
                      </span>
                      {service.has_deposit && (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-lg"
                          style={{ backgroundColor: '#FF980018', color: '#FF9800' }}
                        >
                          بیعانه
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            icon="🔍"
            title="نتیجه‌ای یافت نشد"
            description={`عبارت «${searchQuery}» نتیجه‌ای نداشت`}
          />
        )}
      </div>
    </ScreenWrapper>
  );
}