import { useEffect, useMemo, useState } from 'react';

type FeedbackTypeApi = 'ERROR_REPORT' | 'IMPROVEMENT' | 'QUESTION' | 'SATISFACTION' | 'OTHER';

type FeedbackTypeUI = '오류제보' | '개선요청' | '문의' | '이용 후기' | '기타';

type FeedbackItem = {
  id: number;
  platform: 'ios' | 'web';
  type: FeedbackTypeApi;
  content: string | null;
  email: string | null;
  rating: number | null;
  calculationId: number | null;
  status: string;
  createdAt: string;
};

type ApiResponse = {
  status: string;
  message: string;
  data: FeedbackItem[];
  timestamp: string;
};

const FEEDBACK_API = `${import.meta.env.VITE_API_BASE}/annual-leaves/feedback`;

const PLATFORM_LABEL: Record<'ios' | 'web', string> = {
  ios: 'iOS',
  web: 'Web',
};

const FEEDBACK_TYPE_MAP: Record<FeedbackTypeApi, FeedbackTypeUI> = {
  ERROR_REPORT: '오류제보',
  IMPROVEMENT: '개선요청',
  QUESTION: '문의',
  SATISFACTION: '이용 후기',
  OTHER: '기타',
};

function formatDateTime(dt: string) {
  const d = new Date(dt);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
}

export default function AdminFeedbackPage() {
  const [data, setData] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(FEEDBACK_API);
        const json = (await res.json()) as ApiResponse;
        setData(json.data ?? []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = data.length;

    const platformCount = {
      ios: data.filter((d) => d.platform === 'ios').length,
      web: data.filter((d) => d.platform === 'web').length,
    };

    const typeCount: Record<FeedbackTypeUI, number> = {
      오류제보: 0,
      개선요청: 0,
      문의: 0,
      '이용 후기': 0,
      기타: 0,
    };

    data.forEach((d) => {
      typeCount[FEEDBACK_TYPE_MAP[d.type]]++;
    });

    const lastWeekCount = data.filter((d) => {
      const created = new Date(d.createdAt).getTime();
      const now = Date.now();
      return now - created <= 7 * 24 * 60 * 60 * 1000;
    }).length;

    /** ⭐ Rating 계산 */
    const ratings = data
      .map((d) => d.rating)
      .filter((r): r is number => r !== null && r !== undefined);

    const averageRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

    const ratingCount: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    ratings.forEach((r) => {
      ratingCount[r]++;
    });

    return {
      total,
      platformCount,
      typeCount,
      lastWeekCount,
      averageRating,
      ratingCount,
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-2 md:mb-8">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 5h18M3 12h18M3 19h18" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
              사용자 피드백 (Admin)
            </h1>
          </div>
          <p className="text-sm text-neutral-500">
            이용자가 남긴 의견, 오류제보, 문의, 만족도 평가 등을 확인할 수 있습니다.
          </p>
        </header>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-neutral-200 bg-white px-4 py-6 text-sm text-neutral-500">
            데이터를 불러오는 중입니다…
          </div>
        )}

        {!loading && data.length > 0 && (
          <>
            {/* Summary Cards */}
            <section className="mb-8 grid gap-3 md:grid-cols-5">
              <SummaryCard label="총 피드백 수" value={metrics.total} />

              <SummaryCard
                label="iOS 비율"
                value={`${metrics.platformCount.ios} (${(
                  (metrics.platformCount.ios / metrics.total) *
                  100
                ).toFixed(1)}%)`}
              />

              <SummaryCard
                label="WEB 비율"
                value={`${metrics.platformCount.web} (${(
                  (metrics.platformCount.web / metrics.total) *
                  100
                ).toFixed(1)}%)`}
              />

              <SummaryCard label="최근 7일" value={metrics.lastWeekCount} />

              {/* ⭐ 평균 별점 */}
              <SummaryCard label="평균 별점" value={`${metrics.averageRating.toFixed(2)} / 5`} />
            </section>

            {/* Type + Rating Stats */}
            <section className="mb-8 grid gap-3 md:grid-cols-10">
              {Object.entries(metrics.typeCount).map(([k, v]) => (
                <SummaryCard key={k} label={k} value={v} />
              ))}

              {/* ⭐ 별점 분포 */}
              <SummaryCard label="5점" value={metrics.ratingCount[5]} />
              <SummaryCard label="4점" value={metrics.ratingCount[4]} />
              <SummaryCard label="3점" value={metrics.ratingCount[3]} />
              <SummaryCard label="2점" value={metrics.ratingCount[2]} />
              <SummaryCard label="1점" value={metrics.ratingCount[1]} />
            </section>

            {/* Feedback Table */}
            <section className="rounded-xl border border-neutral-200 bg-white px-4 py-4 md:px-5 md:py-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-neutral-800">피드백 목록</h2>

              <div className="max-h-[520px] overflow-auto rounded-lg border border-neutral-100">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="bg-neutral-50">
                    <tr>
                      <Th>ID</Th>
                      <Th>날짜</Th>
                      <Th>플랫폼</Th>
                      <Th>유형</Th>
                      <Th>별점</Th>
                      <Th>내용</Th>
                      <Th>이메일</Th>
                      <Th>계산 ID</Th>
                      <Th>상태</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {data
                      .slice()
                      .sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                      )
                      .map((f) => (
                        <tr
                          key={f.id}
                          className="border-t border-neutral-100 hover:bg-neutral-50/60"
                        >
                          <Td>{f.id}</Td>
                          <Td>{formatDateTime(f.createdAt)}</Td>
                          <Td>{PLATFORM_LABEL[f.platform]}</Td>
                          <Td>{FEEDBACK_TYPE_MAP[f.type]}</Td>

                          {/* ⭐ Rating */}
                          <Td>{f.rating ? `${f.rating}점` : '-'}</Td>

                          <Td>{f.content ?? '-'}</Td>
                          <Td>{f.email ?? '-'}</Td>
                          <Td>{f.calculationId ?? '-'}</Td>

                          <Td>
                            <span className="inline-flex rounded-full bg-blue-50 px-2 py-[2px] text-[11px] font-medium text-blue-700">
                              {f.status}
                            </span>
                          </Td>
                        </tr>
                      ))}
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

/* ---------- UI Components ---------- */

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  // 숫자 여부 판별
  const isNumeric = typeof value === 'number' || /^\d+$/.test(String(value)); // 순수 숫자 문자열도 허용

  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
      <div className="text-xs font-medium text-neutral-500">{label}</div>

      <div className="mt-1 flex items-baseline gap-1">
        {/* 메인 값 */}
        <span className="text-xl font-semibold text-neutral-900 tabular-nums">{value}</span>

        {/* 숫자일 때만 '개' 표시 */}
        {isNumeric && <span className="text-[11px] text-neutral-400">개</span>}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="sticky top-0 bg-neutral-50 px-3 py-2 text-left text-xs font-medium text-neutral-500">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2 text-xs text-neutral-700">{children}</td>;
}
