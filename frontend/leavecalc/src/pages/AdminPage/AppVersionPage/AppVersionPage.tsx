import { useEffect, useState } from 'react';
import ConfirmModal from '@components/ConfirmModal/ConfirmModal';

/* ==============================
   Types
============================== */

type Platform = 'ios' | 'android' | 'web';

type AppVersionItem = {
  platform: Platform;
  currentVersion: string;
  minimumVersion: string;
  updateMessage: string;
  downloadUrl: string;
};

type ApiResponse = {
  status: string;
  message: string;
  data: AppVersionItem[];
  timestamp: string;
};

type ModalState = {
  open: boolean;
  title: string;
  message: string;
  variant?: 'alert' | 'confirm';
  confirmColor?: 'blue' | 'red';
  onConfirm?: () => void;
};

/* ==============================
   API / Utils
============================== */

const API_BASE = import.meta.env.VITE_API_BASE;
const BASE_URL = `${API_BASE}/v1/admin/app-versions`;

const PLATFORM_LABEL: Record<Platform, string> = {
  ios: 'iOS',
  android: 'Android',
  web: 'Web',
};

function compareVersion(a: string, b: string) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] || 0) - (pb[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/* ==============================
   Page
============================== */

export default function AdminAppVersionPage() {
  const [data, setData] = useState<AppVersionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [addForm, setAddForm] = useState<AppVersionItem>({
    platform: 'android',
    currentVersion: '1.0.0',
    minimumVersion: '1.0.0',
    updateMessage: '',
    downloadUrl: '',
  });

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const [modal, setModal] = useState<ModalState>({
    open: false,
    title: '',
    message: '',
  });

  function closeModal() {
    setModal((p) => ({ ...p, open: false }));
  }

  async function load() {
    const res = await fetch(BASE_URL);
    const json = (await res.json()) as ApiResponse;
    setData(json.data ?? []);
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  /* ==============================
     Handlers
  ============================== */

  async function patchField(platform: Platform, path: string, body: any, validate?: () => boolean) {
    if (validate && !validate()) return;

    const res = await fetch(`${BASE_URL}/${platform}/${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();

    if (!res.ok) {
      setModal({
        open: true,
        title: '수정 실패',
        message: json.message,
        variant: 'alert',
        confirmColor: 'red',
        onConfirm: closeModal,
      });
      return;
    }

    await load();
    setEditingKey(null);

    setModal({
      open: true,
      title: '수정 완료',
      message: json.message || '정상적으로 저장되었습니다.',
      variant: 'alert',
      onConfirm: closeModal,
    });
  }

  function deletePlatform(platform: Platform) {
    setModal({
      open: true,
      title: '플랫폼 삭제',
      message: `${PLATFORM_LABEL[platform]} 설정을 삭제하시겠습니까?`,
      variant: 'confirm',
      confirmColor: 'red',
      onConfirm: async () => {
        const res = await fetch(`${BASE_URL}/${platform}`, { method: 'DELETE' });
        const json = await res.json();

        if (!res.ok) {
          setModal({
            open: true,
            title: '삭제 실패',
            message: json.message,
            variant: 'alert',
            confirmColor: 'red',
            onConfirm: closeModal,
          });
          return;
        }

        await load();
        setModal({
          open: true,
          title: '삭제 완료',
          message: json.message || '삭제되었습니다.',
          variant: 'alert',
          onConfirm: closeModal,
        });
      },
    });
  }

  async function addPlatform() {
    if (compareVersion(addForm.currentVersion, addForm.minimumVersion) < 0) {
      setModal({
        open: true,
        title: '수정 실패',
        message: '현재 버전은 최소 버전보다 같거나 높아야 합니다.',
        variant: 'alert',
        confirmColor: 'red',
        onConfirm: closeModal,
      });
      return;
    }

    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...addForm,
        platform: addForm.platform.toLowerCase(),
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      setModal({
        open: true,
        title: '추가 실패',
        message: json.message,
        variant: 'alert',
        confirmColor: 'red',
        onConfirm: closeModal,
      });
      return;
    }

    await load();
    setAdding(false);

    setModal({
      open: true,
      title: '추가 완료',
      message: json.message || '플랫폼이 추가되었습니다.',
      variant: 'alert',
      onConfirm: closeModal,
    });
  }

  const existingPlatforms = data.map((d) => d.platform);

  /* ==============================
     Render
  ============================== */

  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          {/* 왼쪽: 아이콘 + 제목 */}
          <div>
            <div className="flex items-center gap-2">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M7 8h10" />
                  <path d="M7 12h6" />
                  <path d="M7 16h4" />
                </svg>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
                앱 버전 관리 (Admin)
              </h1>
            </div>

            <p className="mt-1 text-sm text-neutral-500">
              플랫폼별 앱 버전 및 업데이트 정책을 관리합니다.
            </p>
          </div>

          {/* 오른쪽 버튼 */}
          <button
            onClick={() => setAdding((v) => !v)}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            + 플랫폼 추가
          </button>
        </header>

        {/* Summary + Guide */}
        <div className="mb-5 grid gap-3 md:grid-cols-[220px_1fr]">
          <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm grid grid-rows-[auto_1fr]">
            <div className="text-xs font-medium text-neutral-500">관리 중인 플랫폼</div>

            <div className="flex items-end justify-end gap-1">
              <span className="text-xl font-semibold text-neutral-900">{data.length}</span>
              <span className="text-[11px] text-neutral-400 mb-[2px]">개</span>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
            <div className="text-xs font-medium text-neutral-500">이용 방법 안내</div>
            <ul className="mt-2 space-y-1 text-xs text-neutral-600 leading-relaxed">
              <li>
                • 플랫폼은 <b>web, ios, android</b>만 지원합니다. 추가 등록은 <b>관리자에게 문의</b>{' '}
                바랍니다.
              </li>
              <li>
                • 현재 버전은 최소 버전보다 낮을 수 없으며, 최소 버전은 현재 버전보다 높을 수
                없습니다.
              </li>
              <li>
                • 업데이트 메시지는 <b>100자 내외</b>로 작성해 주세요.
              </li>
              <li>
                • 버전은 항상 <b>x.x.x</b> 형식으로 입력해 주세요.
              </li>
            </ul>
          </div>
        </div>

        {/* Add Form */}
        {adding && (
          <section className="mb-8 rounded-xl border border-neutral-200 bg-white px-4 py-4 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-neutral-800">플랫폼 추가</h2>

            <div className="space-y-3 text-sm">
              <select
                value={addForm.platform}
                onChange={(e) => setAddForm({ ...addForm, platform: e.target.value as Platform })}
                className="w-full rounded-md border border-neutral-300 px-2 py-1.5"
              >
                {(['ios', 'android', 'web'] as Platform[]).map(
                  (p) =>
                    !existingPlatforms.includes(p) && (
                      <option key={p} value={p}>
                        {PLATFORM_LABEL[p]}
                      </option>
                    ),
                )}
              </select>

              <input
                value={addForm.currentVersion}
                onChange={(e) => setAddForm({ ...addForm, currentVersion: e.target.value })}
                placeholder="현재 버전"
                className="w-full rounded-md border border-neutral-300 px-2 py-1.5"
              />

              <input
                value={addForm.minimumVersion}
                onChange={(e) => setAddForm({ ...addForm, minimumVersion: e.target.value })}
                placeholder="최소 버전"
                className="w-full rounded-md border border-neutral-300 px-2 py-1.5"
              />

              <input
                value={addForm.updateMessage}
                onChange={(e) => setAddForm({ ...addForm, updateMessage: e.target.value })}
                placeholder="업데이트 메시지"
                className="w-full rounded-md border border-neutral-300 px-2 py-1.5"
              />

              <input
                value={addForm.downloadUrl}
                onChange={(e) => setAddForm({ ...addForm, downloadUrl: e.target.value })}
                placeholder="다운로드 URL"
                className="w-full rounded-md border border-neutral-300 px-2 py-1.5"
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setAdding(false)}
                className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs"
              >
                취소
              </button>
              <button
                onClick={addPlatform}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white"
              >
                추가
              </button>
            </div>
          </section>
        )}

        {/* Platform Cards */}
        {data.map((item) => (
          <section
            key={item.platform}
            className="mb-8 rounded-xl border border-neutral-200 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
              <h2 className="text-sm font-semibold text-neutral-800">
                {PLATFORM_LABEL[item.platform]}
              </h2>
              <button
                onClick={() => deletePlatform(item.platform)}
                className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
              >
                삭제
              </button>
            </div>

            <div className="px-4 py-4 space-y-4 text-sm">
              {(
                [
                  ['currentVersion', '현재 버전'],
                  ['minimumVersion', '최소 버전'],
                  ['updateMessage', '업데이트 메시지'],
                  ['downloadUrl', '다운로드 URL'],
                ] as const
              ).map(([key, label]) => {
                const fieldKey = `${item.platform}-${key}`;
                const isEditing = editingKey === fieldKey;
                const value = item[key];

                return (
                  <div
                    key={key}
                    className="grid grid-cols-[180px_1fr_120px] items-center gap-3 min-h-[44px]"
                  >
                    <div className="text-neutral-600">{label}</div>

                    {isEditing ? (
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="min-h-[36px] rounded-md border border-neutral-300 px-2 py-1.5"
                      />
                    ) : (
                      <div className="min-h-[36px] flex items-center">{value || '-'}</div>
                    )}

                    <div className="flex items-center justify-end min-h-[32px]">
                      {isEditing ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() =>
                              patchField(
                                item.platform,
                                key === 'currentVersion'
                                  ? 'current-version'
                                  : key === 'minimumVersion'
                                    ? 'minimum-version'
                                    : key === 'updateMessage'
                                      ? 'update-message'
                                      : 'download-url',
                                { [key]: editValue },
                                () => {
                                  if (
                                    key === 'currentVersion' &&
                                    compareVersion(editValue, item.minimumVersion) < 0
                                  ) {
                                    setModal({
                                      open: true,
                                      title: '수정 실패',
                                      message: '현재 버전은 최소 버전보다 같거나 높아야 합니다.',
                                      variant: 'alert',
                                      confirmColor: 'red',
                                      onConfirm: closeModal,
                                    });
                                    return false;
                                  }
                                  if (
                                    key === 'minimumVersion' &&
                                    compareVersion(item.currentVersion, editValue) < 0
                                  ) {
                                    setModal({
                                      open: true,
                                      title: '수정 실패',
                                      message: '최소 버전은 현재 버전보다 같거나 낮아야 합니다.',
                                      variant: 'alert',
                                      confirmColor: 'red',
                                      onConfirm: closeModal,
                                    });
                                    return false;
                                  }
                                  return true;
                                },
                              )
                            }
                            className="rounded-md border border-neutral-200 px-2 py-1 text-xs"
                          >
                            저장
                          </button>
                          <button
                            onClick={() => setEditingKey(null)}
                            className="rounded-md border border-neutral-200 px-2 py-1 text-xs"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingKey(fieldKey);
                            setEditValue(value);
                          }}
                          className="text-xs text-neutral-500"
                        >
                          수정
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      <ConfirmModal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        variant={modal.variant}
        confirmColor={modal.confirmColor}
        onConfirm={modal.onConfirm ?? closeModal}
        onCancel={closeModal}
      />
    </div>
  );
}
