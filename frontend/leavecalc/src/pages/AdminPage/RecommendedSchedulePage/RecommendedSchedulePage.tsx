import { useEffect, useMemo, useState } from 'react';
import ConfirmModal from '@components/ConfirmModal/ConfirmModal';

type RecommendedSchedule = {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
};

type ScheduleForm = Omit<RecommendedSchedule, 'id'>;

const INITIAL_SCHEDULES: RecommendedSchedule[] = [
  { id: 1, title: '광복절 연휴', startDate: '2026-08-15', endDate: '2026-08-17' },
  { id: 2, title: '추석 연휴', startDate: '2026-09-24', endDate: '2026-09-27' },
  { id: 3, title: '개천절 연휴', startDate: '2026-10-03', endDate: '2026-10-05' },
  { id: 4, title: '한글날 연휴', startDate: '2026-10-09', endDate: '2026-10-11' },
  { id: 5, title: '성탄절 연휴', startDate: '2026-12-25', endDate: '2026-12-27' },
  { id: 6, title: '신정 연휴', startDate: '2027-01-01', endDate: '2027-01-03' },
  { id: 7, title: '설 연휴', startDate: '2027-02-06', endDate: '2027-02-09' },
  { id: 8, title: '삼일절 연휴', startDate: '2027-02-27', endDate: '2027-03-01' },
  { id: 9, title: '노동절 연휴', startDate: '2027-05-01', endDate: '2027-05-03' },
  { id: 10, title: '제헌절 연휴', startDate: '2027-07-17', endDate: '2027-07-19' },
  { id: 11, title: '광복절 연휴', startDate: '2027-08-14', endDate: '2027-08-16' },
  { id: 12, title: '추석 연휴', startDate: '2027-09-14', endDate: '2027-09-16' },
  { id: 13, title: '개천절 연휴', startDate: '2027-10-02', endDate: '2027-10-04' },
  { id: 14, title: '한글날 연휴', startDate: '2027-10-09', endDate: '2027-10-11' },
  { id: 15, title: '성탄절 연휴', startDate: '2027-12-25', endDate: '2027-12-27' },
];

const EMPTY_FORM: ScheduleForm = { title: '', startDate: '', endDate: '' };
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function parseYmd(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(value: string) {
  const date = parseYmd(value);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
    date.getDate(),
  ).padStart(2, '0')} (${WEEKDAYS[date.getDay()]})`;
}

function inclusiveDays(startDate: string, endDate: string) {
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.round((parseYmd(endDate).getTime() - parseYmd(startDate).getTime()) / dayMs) + 1;
}

export default function AdminRecommendedSchedulePage() {
  const [schedules, setSchedules] = useState(INITIAL_SCHEDULES);
  const [selectedYear, setSelectedYear] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ScheduleForm>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<RecommendedSchedule | null>(null);

  const yearOptions = useMemo(
    () => [...new Set(schedules.map((schedule) => schedule.startDate.slice(0, 4)))].sort(),
    [schedules],
  );

  const sortedSchedules = useMemo(
    () =>
      schedules
        .filter(
          (schedule) => selectedYear === 'all' || schedule.startDate.startsWith(selectedYear),
        )
        .sort((a, b) => a.startDate.localeCompare(b.startDate)),
    [schedules, selectedYear],
  );

  useEffect(() => {
    if (selectedYear !== 'all' && !yearOptions.includes(selectedYear)) {
      setSelectedYear('all');
    }
  }, [selectedYear, yearOptions]);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
    setFormOpen(true);
  }

  function openEdit(schedule: RecommendedSchedule) {
    setEditingId(schedule.id);
    setForm({ title: schedule.title, startDate: schedule.startDate, endDate: schedule.endDate });
    setError('');
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setError('');
  }

  function saveSchedule() {
    const title = form.title.trim();
    if (!title) return setError('일정 이름을 입력해 주세요.');
    if (!form.startDate || !form.endDate) return setError('시작일과 종료일을 모두 선택해 주세요.');
    if (form.startDate > form.endDate) return setError('종료일은 시작일보다 빠를 수 없습니다.');

    if (editingId === null) {
      const nextId = schedules.length ? Math.max(...schedules.map((item) => item.id)) + 1 : 1;
      setSchedules((current) => [...current, { id: nextId, ...form, title }]);
    } else {
      setSchedules((current) =>
        current.map((item) => (item.id === editingId ? { ...item, ...form, title } : item)),
      );
    }
    closeForm();
  }

  function deleteSchedule() {
    if (!deleteTarget) return;
    setSchedules((current) => current.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        <header className="mb-6 flex items-center justify-between md:mb-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M16 3v4M8 3v4M3 10h18M8 14h3M8 17h7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl">
                연차 추천일정 관리 (Admin)
              </h1>
            </div>
            <p className="mt-1 text-sm text-neutral-500">
              사용자에게 노출할 연휴 및 연차 추천일정을 관리합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            + 추천일정 추가
          </button>
        </header>

        <div className="mb-5 grid gap-3 md:grid-cols-[220px_1fr]">
          <SummaryCard label="등록된 추천일정" value={schedules.length} unit="개" />
          <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
            <div className="text-xs font-medium text-neutral-500">이용 방법 안내</div>
            <ul className="mt-2 space-y-1 text-xs leading-relaxed text-neutral-600">
              <li>• 일정 이름과 시작일, 종료일을 입력해 추천일정을 등록합니다.</li>
              <li>• 시작일이 빠른 일정부터 자동으로 정렬되어 표시됩니다.</li>
              <li>• 현재 데이터는 API 연결 전 확인을 위한 화면용 목업 데이터입니다.</li>
            </ul>
          </div>
        </div>

        <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-neutral-800">추천일정 목록</h2>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-neutral-500">
                연도
                <select
                  value={selectedYear}
                  onChange={(event) => setSelectedYear(event.target.value)}
                  className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs text-neutral-700 focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">전체 연도</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}년
                    </option>
                  ))}
                </select>
              </label>
              <span className="text-xs text-neutral-400">{sortedSchedules.length}개 표시</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <Th className="w-16">번호</Th>
                  <Th>일정 이름</Th>
                  <Th>시작일</Th>
                  <Th>종료일</Th>
                  <Th className="w-24">기간</Th>
                  <Th className="w-32">관리</Th>
                </tr>
              </thead>
              <tbody>
                {sortedSchedules.map((schedule, index) => (
                  <tr key={schedule.id} className="border-t border-neutral-100 hover:bg-neutral-50/70">
                    <Td className="text-neutral-400">{index + 1}</Td>
                    <Td>
                      <span className="font-medium text-neutral-800">{schedule.title}</span>
                    </Td>
                    <Td>{formatDate(schedule.startDate)}</Td>
                    <Td>{formatDate(schedule.endDate)}</Td>
                    <Td>{inclusiveDays(schedule.startDate, schedule.endDate)}일</Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => openEdit(schedule)} className="text-xs text-blue-600 hover:underline">
                          수정
                        </button>
                        <button type="button" onClick={() => setDeleteTarget(schedule)} className="text-xs text-red-600 hover:underline">
                          삭제
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
                {sortedSchedules.length === 0 && (
                  <tr className="border-t border-neutral-100">
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-neutral-400">
                      {selectedYear === 'all'
                        ? '등록된 추천일정이 없습니다.'
                        : `${selectedYear}년에 등록된 추천일정이 없습니다.`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={closeForm}>
          <section className="w-full max-w-lg rounded-xl border border-neutral-200 bg-white shadow-lg" onClick={(event) => event.stopPropagation()}>
            <div className="border-b border-neutral-100 px-5 py-4">
              <h2 className="text-base font-semibold text-neutral-900">
                추천일정 {editingId === null ? '추가' : '수정'}
              </h2>
              <p className="mt-1 text-xs text-neutral-500">추천일정에 표시할 이름과 기간을 입력해 주세요.</p>
            </div>

            <div className="space-y-4 px-5 py-5 text-sm">
              <label className="block">
                <span className="mb-1.5 block font-medium text-neutral-700">일정 이름</span>
                <input
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  maxLength={50}
                  placeholder="예: 광복절 연휴"
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block font-medium text-neutral-700">시작일</span>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-medium text-neutral-700">종료일</span>
                  <input
                    type="date"
                    value={form.endDate}
                    min={form.startDate || undefined}
                    onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </label>
              </div>

              {error && <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
            </div>

            <div className="flex justify-end gap-2 border-t border-neutral-100 px-5 py-4">
              <button type="button" onClick={closeForm} className="rounded-md border border-blue-200 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50">
                취소
              </button>
              <button type="button" onClick={saveSchedule} className="rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700">
                {editingId === null ? '추가' : '저장'}
              </button>
            </div>
          </section>
        </div>
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="추천일정 삭제"
        message={deleteTarget ? `‘${deleteTarget.title}’ 일정을 삭제하시겠습니까?` : ''}
        confirmText="삭제"
        confirmColor="red"
        onConfirm={deleteSchedule}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function SummaryCard({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="grid grid-rows-[auto_1fr] rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
      <div className="text-xs font-medium text-neutral-500">{label}</div>
      <div className="flex items-end justify-end gap-1">
        <span className="text-xl font-semibold text-neutral-900">{value}</span>
        <span className="mb-[2px] text-[11px] text-neutral-400">{unit}</span>
      </div>
    </div>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-neutral-500 ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`whitespace-nowrap px-4 py-3 text-neutral-600 ${className}`}>{children}</td>;
}
