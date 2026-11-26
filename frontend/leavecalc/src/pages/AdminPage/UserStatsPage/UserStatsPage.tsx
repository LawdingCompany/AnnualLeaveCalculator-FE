import { useEffect, useMemo, useState } from 'react';

type UserItem = {
  id: number;
  username: string | null;
  email: string | null;
  provider: string | null;
  nickname: string | null;
  lastLoginAt: string | null;
};

type ApiResponse = {
  status: string;
  message: string;
  data: UserItem[];
  timestamp: string;
};

const API_URL = `${import.meta.env.VITE_API_BASE}/v1/admin/users/stats`;

function formatDateTime(value: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm md:px-5 md:py-4">
      <div className="text-xs font-medium text-neutral-500">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-semibold tracking-tight text-neutral-900">
          {value.toLocaleString()}
        </span>
        <span className="text-[11px] text-neutral-400">명</span>
      </div>
    </div>
  );
}

export default function UserStatsPage() {
  const [data, setData] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(API_URL, {
          headers: { 'X-Platform': 'web' },
        });
        if (!response.ok) throw new Error('Failed to load users');
        const json = (await response.json()) as ApiResponse;
        setData(json.data ?? []);
      } catch {
        setError('가입 사용자 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const providerCounts = useMemo(() => {
    const counts = new Map<string, number>();
    data.forEach((user) => {
      const provider = user.provider?.trim() || 'UNKNOWN';
      counts.set(provider, (counts.get(provider) ?? 0) + 1);
    });
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [data]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        <header className="mb-6 flex flex-col gap-2 md:mb-8">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="10" cy="7" r="4" />
                <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl">가입 사용자 통계 (Admin)</h1>
          </div>
          <p className="text-sm text-neutral-500">가입 사용자 정보와 로그인 제공자별 인원을 확인합니다.</p>
        </header>

        {loading && <div className="rounded-xl border border-neutral-200 bg-white px-4 py-6 text-sm text-neutral-500">데이터를 불러오는 중입니다…</div>}
        {error && !loading && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">{error}</div>}

        {!loading && !error && (
          <>
            <section className="mb-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              <SummaryCard label="전체 가입자" value={data.length} />
              {providerCounts.map(([provider, count]) => (
                <SummaryCard key={provider} label={provider} value={count} />
              ))}
            </section>

            <section className="rounded-xl border border-neutral-200 bg-white px-4 py-4 shadow-sm md:px-5 md:py-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-neutral-800">가입 사용자 목록</h2>
                <span className="text-[11px] text-neutral-400">총 {data.length.toLocaleString()}명</span>
              </div>
              {data.length === 0 ? (
                <div className="rounded-lg bg-neutral-50 px-4 py-10 text-center text-sm text-neutral-500">조회된 사용자가 없습니다.</div>
              ) : (
                <div className="max-h-[620px] overflow-auto rounded-lg border border-neutral-100">
                  <table className="min-w-[760px] w-full border-collapse text-sm">
                    <thead className="bg-neutral-50">
                      <tr>
                        {['Username', 'Email', 'Provider', 'Nickname', '마지막 로그인'].map((label) => (
                          <th key={label} className="sticky top-0 bg-neutral-50 px-3 py-2 text-left text-xs font-medium text-neutral-500">{label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((user) => (
                        <tr key={user.id} className="border-t border-neutral-100 hover:bg-neutral-50/60">
                          <td className="px-3 py-2 text-xs text-neutral-700">{user.username || '-'}</td>
                          <td className="px-3 py-2 text-xs text-neutral-700">{user.email || '-'}</td>
                          <td className="px-3 py-2 text-xs text-neutral-700">{user.provider || '-'}</td>
                          <td className="px-3 py-2 text-xs text-neutral-700">{user.nickname || '-'}</td>
                          <td className="px-3 py-2 text-xs text-neutral-700">{formatDateTime(user.lastLoginAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
