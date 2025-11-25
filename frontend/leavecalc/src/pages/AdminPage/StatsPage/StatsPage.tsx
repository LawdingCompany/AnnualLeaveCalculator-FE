// src/pages/AdminStatsPage.tsx
import { useEffect, useMemo, useState } from 'react';

type RequestStat = {
  recordDate: string; // '2025-11-19'
  web: number;
  ios: number;
};

type ApiResponse = {
  status: string;
  message: string;
  data: RequestStat[];
  timestamp: string;
};

const API_BASE = import.meta.env.VITE_API_BASE;
const API_URL = `${API_BASE}/annual-leaves/stats`;

function parseDate(dateStr: string): Date {
  // 'YYYY-MM-DD' 기준
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatKR(dateStr: string) {
  const d = parseDate(dateStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}

function todayKR() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function StatCard({
  label,
  value,
  unit = '개',
  subLabel,
}: {
  label: string;
  value: string | number | React.ReactNode;
  unit?: string;
  subLabel?: string;
}) {
  const isPrimitive = typeof value === 'string' || typeof value === 'number';

  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 md:px-5 md:py-4 shadow-sm">
      <div className="text-xs font-medium text-neutral-500">{label}</div>

      <div className="mt-1">
        {isPrimitive ? (
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold tracking-tight text-neutral-900">{value}</span>
            <span className="text-[11px] text-neutral-400">{unit}</span>
          </div>
        ) : (
          value
        )}
      </div>

      {subLabel && <div className="mt-1 text-[11px] text-neutral-400">{subLabel}</div>}
    </div>
  );
}

export default function AdminStatsPage() {
  const [data, setData] = useState<RequestStat[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to load stats');
        const json = (await res.json()) as ApiResponse;
        setData(json.data ?? []);
      } catch (e) {
        setError('요청 통계 데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const metrics = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalWeb: 0,
        totalIos: 0,
        totalAll: 0,
        avgPerDay: 0,
        avgWebPerDay: 0,
        avgIosPerDay: 0,
        last7Total: 0,
        last30Total: 0,
        latestDate: null as string | null,
      };
    }

    let totalWeb = 0;
    let totalIos = 0;
    let last7Total = 0;
    let last30Total = 0;
    let latestTime = 0;

    for (const row of data) {
      totalWeb += row.web;
      totalIos += row.ios;

      const t = parseDate(row.recordDate).getTime();
      if (t > latestTime) latestTime = t;
    }

    const totalAll = totalWeb + totalIos;
    const avgPerDay = totalAll / data.length;
    const avgWebPerDay = totalWeb / data.length;
    const avgIosPerDay = totalIos / data.length;

    const latest = new Date(latestTime);
    latest.setHours(0, 0, 0, 0);

    const last7Start = new Date(latest);
    last7Start.setDate(latest.getDate() - 6);

    const last30Start = new Date(latest);
    last30Start.setDate(latest.getDate() - 29);

    for (const row of data) {
      const dayTotal = row.web + row.ios;
      const t = parseDate(row.recordDate);
      t.setHours(0, 0, 0, 0);

      if (t >= last7Start && t <= latest) last7Total += dayTotal;
      if (t >= last30Start && t <= latest) last30Total += dayTotal;
    }

    const yyyy = latest.getFullYear();
    const mm = String(latest.getMonth() + 1).padStart(2, '0');
    const dd = String(latest.getDate()).padStart(2, '0');

    let maxWeb = 0;
    let maxIos = 0;

    // inside loop...
    for (const row of data) {
      if (row.web > maxWeb) maxWeb = row.web;
      if (row.ios > maxIos) maxIos = row.ios;
    }

    return {
      totalWeb,
      totalIos,
      totalAll,
      avgPerDay,
      avgWebPerDay,
      avgIosPerDay,
      last7Total,
      last30Total,
      latestDate: `${yyyy}-${mm}-${dd}`,
      maxWeb,
      maxIos,
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        {/* 헤더 */}
        <header className="mb-6 flex flex-col gap-2 md:mb-8">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              {/* 달력 + 차트 느낌의 아이콘 (간단한 SVG) */}
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
                <path d="M8 18v-4l2-2 2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">요청 통계 (Admin)</h1>
          </div>
          <p className="text-sm text-neutral-500">
            LAWDING 연차 계산 요청량을 한눈에 확인할 수 있는 관리자 전용 페이지입니다.
          </p>
          {metrics.latestDate && (
            <p className="text-xs text-neutral-400">조회일 : {formatKR(todayKR())} (현재 날짜)</p>
          )}
        </header>

        {/* 로딩/에러 상태 */}
        {loading && (
          <div className="rounded-xl border border-neutral-200 bg-white px-4 py-6 text-sm text-neutral-500">
            데이터를 불러오는 중입니다…
          </div>
        )}
        {error && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && data && (
          <>
            {/* 상단 요약 카드들 */}
            <section className="mb-8 grid gap-3 md:grid-cols-5">
              <StatCard
                label="총 요청 수"
                value={metrics.totalAll.toLocaleString()}
                subLabel="총 합계(Web + iOS)"
              />
              <StatCard
                label="WEB"
                value={metrics.totalWeb.toLocaleString()}
                subLabel="2025.09.29 ~"
              />
              <StatCard
                label="iOS"
                value={metrics.totalIos.toLocaleString()}
                subLabel="2025.09.29 ~"
              />
              <StatCard
                label="일일 평균 요청 수"
                value={
                  <div className="flex items-baseline gap-1">
                    {/* 메인 평균 */}
                    <span className="text-2xl font-semibold tracking-tight text-neutral-900">
                      {metrics.avgPerDay.toFixed(1)}({metrics.avgWebPerDay.toFixed(1)}+
                      {metrics.avgIosPerDay.toFixed(1)})
                    </span>
                    <span className="text-[11px] text-neutral-400">번</span>
                  </div>
                }
                subLabel="전체(Web + iOS)"
              />

              <StatCard
                label="최근 7일 합계"
                value={metrics.last7Total.toLocaleString()}
                subLabel="조회일 기준 7일 내"
              />
            </section>

            {/* 두 번째 줄 : 최근 30일 + 마지막 기준일 */}
            <section className="mb-8 grid gap-3 md:grid-cols-[2fr_1fr]">
              <div className="rounded-xl border border-neutral-200 bg-white px-4 py-4 shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h2 className="text-sm font-semibold text-neutral-800">최근 30일 요청량</h2>
                  <span className="rounded-full bg-neutral-100 px-2 py-[2px] text-[11px] text-neutral-500">
                    합계 기준
                  </span>
                </div>
                <div className="mt-1 text-2xl font-semibold text-neutral-900">
                  {metrics.last30Total.toLocaleString()}
                  <span className="text-[11px] text-neutral-400"> 개</span>
                </div>
                <p className="mt-1 text-[11px] text-neutral-400">
                  최신 기록일을 포함한 30일 이내의 총 요청 수입니다. (데이터가 30일 미만이면 전체를
                  기준으로 계산)
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white px-4 py-4 shadow-sm">
                <h2 className="text-sm font-semibold text-neutral-800">데이터 개요</h2>
                <ul className="mt-2 space-y-1 text-xs text-neutral-600">
                  <li className="flex justify-between">
                    <span>기록 일수</span>
                    <span>{data.length} 일</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Web 비율</span>
                    <span>
                      {metrics.totalAll
                        ? ((metrics.totalWeb / metrics.totalAll) * 100).toFixed(1)
                        : '0.0'}{' '}
                      %
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>iOS 비율</span>
                    <span>
                      {metrics.totalAll
                        ? ((metrics.totalIos / metrics.totalAll) * 100).toFixed(1)
                        : '0.0'}{' '}
                      %
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* 일자별 상세 테이블 */}
            <section className="rounded-xl border border-neutral-200 bg-white px-4 py-4 md:px-5 md:py-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-neutral-800">일자별 요청량</h2>
                <span className="text-[11px] text-neutral-400">조회일 기준 내림차순 정렬</span>
              </div>

              <div className="max-h-[520px] overflow-auto rounded-lg border border-neutral-100">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="sticky top-0 bg-neutral-50 px-3 py-2 text-left text-xs font-medium text-neutral-500">
                        날짜
                      </th>
                      <th className="sticky top-0 bg-neutral-50 px-3 py-2 text-right text-xs font-medium text-neutral-500">
                        WEB
                      </th>
                      <th className="sticky top-0 bg-neutral-50 px-3 py-2 text-right text-xs font-medium text-neutral-500">
                        iOS
                      </th>
                      <th className="sticky top-0 bg-neutral-50 px-3 py-2 text-right text-xs font-medium text-neutral-500">
                        합계
                      </th>
                      <th className="sticky top-0 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-500">
                        비고
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data
                      .slice()
                      .sort(
                        (a, b) =>
                          parseDate(b.recordDate).getTime() - parseDate(a.recordDate).getTime(),
                      )
                      .map((row) => {
                        const total = row.web + row.ios;
                        const isToday = metrics.latestDate === row.recordDate;
                        return (
                          <tr
                            key={row.recordDate}
                            className="border-t border-neutral-100 hover:bg-neutral-50/60"
                          >
                            <td className="px-3 py-2 text-xs text-neutral-700">
                              {formatKR(row.recordDate)}
                            </td>
                            <td className="px-3 py-2 text-right text-neutral-800">
                              {row.web.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 text-right text-neutral-800">
                              {row.ios.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 text-right font-semibold text-neutral-900">
                              {total.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 text-xs space-x-1 text-center">
                              {isToday && (
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-[2px] text-[11px] font-medium text-blue-700">
                                  최신일
                                </span>
                              )}
                              {row.web === metrics.maxWeb && (
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-[2px] text-[11px] font-medium text-emerald-700">
                                  WEB 최대 요청
                                </span>
                              )}

                              {row.ios === metrics.maxIos && (
                                <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-[2px] text-[11px] font-medium text-purple-700">
                                  iOS 최대 요청
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
