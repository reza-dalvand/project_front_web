'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiMapPin, FiStar, FiBookmark, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';
import { toPersianDigit } from '@/utils/numberUtils';

const MOCK_BUSINESSES = [
  {
    id: 'b1',
    name: 'سالن زیبایی نیلارام',
    category: 'کلینیک پوست و مو',
    city: 'تهران، سعادت‌آباد',
    rating: 4.9,
    reviewsCount: 142,
    logo: 'https://picsum.photos/150?random=21',
    VIP: true,
  },
  {
    id: 'b2',
    name: 'مرکز لیزر رویال',
    category: 'مرکز لیزر',
    city: 'تهران، شهرک غرب',
    rating: 4.8,
    reviewsCount: 178,
    logo: 'https://picsum.photos/150?random=25',
    VIP: true,
  },
];

const MOCK_POSTS = [
  {
    id: 'p1',
    businessName: 'کلینیک زیبایی صدف',
    businessLogo: 'https://picsum.photos/100/100?random=1',
    caption: 'فیشیال VIP با ماسک طلا ✨',
    image: 'https://picsum.photos/400/400?random=101',
    imageCount: 2,
  },
  {
    id: 'p2',
    businessName: 'سالن زیبایی ماهرو',
    businessLogo: 'https://picsum.photos/100/100?random=2',
    caption: 'میکاپ عروس اروپایی 👰‍♀️',
    image: 'https://picsum.photos/400/400?random=103',
    imageCount: 3,
  },
];

export default function FavoritesPage() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('businesses');

  const tabs = [
    { id: 'businesses', label: 'کسب‌وکار', count: MOCK_BUSINESSES.length },
    { id: 'posts', label: 'ویترین', count: MOCK_POSTS.length },
  ];

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: colors.background }}>
      {/* Tabs */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-colors"
              style={{
                backgroundColor: activeTab === tab.id ? colors.primary : colors.cardBackground,
                borderColor: activeTab === tab.id ? colors.primary : colors.border,
              }}
            >
              <span
                className="text-sm font-[Vazir-Bold]"
                style={{
                  color: activeTab === tab.id ? '#fff' : colors.textMain,
                }}
              >
                {tab.label}
              </span>
              <span
                className="min-w-[22px] h-5 px-1.5 rounded-full flex items-center justify-center
                           text-[11px] font-[Vazir-Bold]"
                style={{
                  backgroundColor:
                    activeTab === tab.id ? 'rgba(255,255,255,0.3)' : colors.primary + '20',
                  color: activeTab === tab.id ? '#fff' : colors.primary,
                }}
              >
                {toPersianDigit(tab.count)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'businesses' && (
          <div className="flex flex-col gap-3">
            {MOCK_BUSINESSES.map((biz) => (
              <Card key={biz.id} variant="elevated" padding={14} radius={18}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src={biz.logo}
                      alt={biz.name}
                      width={64}
                      height={64}
                      className="rounded-2xl"
                    />
                    {biz.VIP && (
                      <div
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center
                                   justify-center border-2"
                        style={{
                          backgroundColor: colors.primary,
                          borderColor: colors.cardBackground,
                        }}
                      >
                        <span className="text-[10px]">👑</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                      {biz.name}
                    </span>
                    <span className="text-xs font-[Vazir-Medium]" style={{ color: colors.primary }}>
                      {biz.category}
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <FiMapPin size={12} color={colors.textSecondary} />
                      <span className="text-[11px]" style={{ color: colors.textSecondary }}>
                        {biz.city}
                      </span>
                      <div
                        className="w-1 h-1 rounded-full mx-0.5"
                        style={{ backgroundColor: colors.border }}
                      />
                      <FiStar size={12} color="#FFC107" fill="#FFC107" />
                      <span
                        className="text-xs font-[Vazir-Bold]"
                        style={{ color: colors.textMain }}
                      >
                        {toPersianDigit(biz.rating)}
                      </span>
                      <span className="text-[10px]" style={{ color: colors.textSecondary }}>
                        ({toPersianDigit(biz.reviewsCount)})
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: '#E91E6315' }}
                    >
                      <FiBookmark size={20} color="#E91E63" fill="#E91E63" />
                    </div>
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: colors.primary + '15' }}
                    >
                      <FiChevronLeft size={20} color={colors.primary} />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="grid grid-cols-2 gap-3">
            {MOCK_POSTS.map((post) => (
              <Card key={post.id} variant="elevated" padding={0} radius={14}>
                <div className="relative">
                  <Image
                    src={post.image}
                    alt={post.businessName}
                    width={200}
                    height={150}
                    className="w-full h-[150px] object-cover"
                  />
                  {post.imageCount > 1 && (
                    <div
                      className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1
                                 rounded-lg"
                      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                    >
                      <span className="text-white text-[10px]">📷</span>
                      <span className="text-white text-[10px] font-[Vazir-Bold]">
                        {toPersianDigit(post.imageCount)}
                      </span>
                    </div>
                  )}
                  <button
                    className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center
                               justify-center z-10"
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                  >
                    <FiBookmark size={18} color="#E91E63" fill="#E91E63" />
                  </button>
                </div>

                <div className="p-2.5 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Image
                      src={post.businessLogo}
                      alt={post.businessName}
                      width={22}
                      height={22}
                      className="rounded-full"
                    />
                    <span
                      className="text-[11px] font-[Vazir-Bold] flex-1"
                      style={{ color: colors.textMain }}
                    >
                      {post.businessName}
                    </span>
                  </div>
                  <p
                    className="text-[11px] leading-4 line-clamp-2"
                    style={{ color: colors.textSecondary }}
                  >
                    {post.caption}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
