import { useEffect, useState } from 'react';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import DictionaryFormModal from '../../../components/DictionaryFormModal/DictionaryFormModal';

/* ---------- API ---------- */
const API_BASE = import.meta.env.VITE_API_BASE;
const CATEGORY_API = `${API_BASE}/v1/admin/dictionary-categories`;
const DICTIONARY_API = `${API_BASE}/v1/admin/dictionaries`;

/* ---------- Types ---------- */
type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
  timestamp: string;
};

type Category = {
  id: number;
  name: string;
};

type DictionaryItem = {
  id: number;
  category: Category;
  question: string;
  content: string;
  deleted: boolean;
  deletedAt: string | null;
};

/* ---------- Utils ---------- */
function formatDate(dt?: string | null) {
  if (!dt) return '-';
  const d = new Date(dt);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

const DEFAULT_CATEGORY_ID = 99;
const DEFAULT_CATEGORY_NAME = '기타';

/* ---------- Page ---------- */
export default function AdminDictionaryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dictionaries, setDictionaries] = useState<DictionaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- Category CRUD ---------- */
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nameInput, setNameInput] = useState('');

  /* ---------- Dictionary CRUD ---------- */
  const [dictionaryModalOpen, setDictionaryModalOpen] = useState(false);
  const [dictionaryMode, setDictionaryMode] = useState<'create' | 'edit'>('create');
  const [editingDictionaryId, setEditingDictionaryId] = useState<number | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
  const [questionInput, setQuestionInput] = useState('');
  const [contentInput, setContentInput] = useState('');

  /* ---------- Confirm Modal ---------- */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    variant?: 'alert' | 'confirm';
    confirmText?: string;
    confirmColor?: 'blue' | 'red';
    onConfirm: () => void;
  } | null>(null);

  /* ---------- Load ---------- */
  async function loadCategories() {
    const res = await fetch(CATEGORY_API);
    const json = (await res.json()) as ApiResponse<Category[]>;
    setCategories(json.data ?? []);
  }

  async function loadDictionaries() {
    const res = await fetch(DICTIONARY_API);
    const json = (await res.json()) as ApiResponse<DictionaryItem[]>;
    setDictionaries(json.data ?? []);
  }

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([loadCategories(), loadDictionaries()]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------- Helpers ---------- */
  function openAlert(message: string) {
    setModalConfig({
      title: '알림',
      message,
      variant: 'alert',
      confirmText: '확인',
      onConfirm: () => setModalOpen(false),
    });
    setModalOpen(true);
  }

  function isDuplicateName(name: string, exceptId?: number) {
    const n = name.trim().toLowerCase();
    return categories.some((c) => c.id !== exceptId && c.name.toLowerCase() === n);
  }

  /* ---------- Category Handlers ---------- */
  async function createCategory() {
    const name = nameInput.trim();

    if (categories.length >= 10) return openAlert('카테고리는 최대 10개까지 등록할 수 있습니다.');
    if (!name) return openAlert('카테고리 이름을 입력해주세요.');
    if (name.length > 20) return openAlert('카테고리 이름은 최대 20자 이내입니다.');
    if (isDuplicateName(name)) return openAlert('이미 존재하는 카테고리 이름입니다.');

    await fetch(CATEGORY_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    setCreating(false);
    setNameInput('');
    await loadCategories();
  }

  async function updateCategory(id: number) {
    const name = nameInput.trim();

    if (!name) return openAlert('카테고리 이름을 입력해주세요.');
    if (name.length > 20) return openAlert('카테고리 이름은 최대 20자 이내입니다.');
    if (isDuplicateName(name, id)) return openAlert('이미 존재하는 카테고리 이름입니다.');

    await fetch(`${CATEGORY_API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    setEditingId(null);
    setNameInput('');
    await Promise.all([
      loadCategories(),
      loadDictionaries(), // ⭐ 추가
    ]);
  }

  function confirmDeleteCategory(c: Category) {
    if (c.id === DEFAULT_CATEGORY_ID && c.name === DEFAULT_CATEGORY_NAME) return;

    setModalConfig({
      title: '카테고리 삭제',
      message: `‘${c.name}’ 카테고리를 삭제하시겠습니까?`,
      variant: 'confirm',
      confirmText: '삭제',
      confirmColor: 'red',
      onConfirm: async () => {
        await fetch(`${CATEGORY_API}/${c.id}`, { method: 'DELETE' });
        setModalOpen(false);
        await Promise.all([
          loadCategories(),
          loadDictionaries(), // ⭐️ 이 줄이 핵심
        ]);
      },
    });
    setModalOpen(true);
  }

  /* ---------- Dictionary Handlers ---------- */
  function openCreateDictionary() {
    setDictionaryMode('create');
    setEditingDictionaryId(null);
    setSelectedCategoryId('');
    setQuestionInput('');
    setContentInput('');
    setDictionaryModalOpen(true);
  }

  function openEditDictionary(d: DictionaryItem) {
    setDictionaryMode('edit');
    setEditingDictionaryId(d.id);
    setSelectedCategoryId(d.category.id);
    setQuestionInput(d.question);
    setContentInput(d.content);
    setDictionaryModalOpen(true);
  }

  function submitDictionary() {
    if (!selectedCategoryId) return openAlert('카테고리를 선택해주세요.');
    if (!questionInput.trim()) return openAlert('질문을 입력해주세요.');
    if (!contentInput.trim()) return openAlert('답변을 입력해주세요.');

    setModalConfig({
      title: dictionaryMode === 'create' ? '사전 항목 등록' : '사전 항목 수정',
      message:
        dictionaryMode === 'create'
          ? '사전 항목을 등록하시겠습니까?'
          : '사전 항목을 수정하시겠습니까?',
      variant: 'confirm',
      confirmText: '확인',
      onConfirm: async () => {
        const body = {
          categoryId: selectedCategoryId,
          question: questionInput,
          content: contentInput,
        };

        if (dictionaryMode === 'create') {
          await fetch(DICTIONARY_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
        } else {
          // ✅ 백엔드가 PATCH 업데이트라서 PATCH로 맞춤 (UI/UX 변화 없음)
          await fetch(`${DICTIONARY_API}/${editingDictionaryId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
        }

        setModalOpen(false);
        setDictionaryModalOpen(false);
        await loadDictionaries();
      },
    });

    setModalOpen(true);
  }

  // ✅ 삭제 대신: 비활성화/활성화 토글
  function toggleDictionaryActive(d: DictionaryItem) {
    const isDisable = !d.deleted;

    setModalConfig({
      title: isDisable ? '사전 항목 비활성화' : '사전 항목 활성화',
      message: isDisable
        ? '이 사전 항목을 비활성화하시겠습니까?'
        : '이 사전 항목을 활성화하시겠습니까?',
      variant: 'confirm',
      confirmText: isDisable ? '비활성화' : '활성화',
      confirmColor: isDisable ? 'red' : 'blue',
      onConfirm: async () => {
        await fetch(`${DICTIONARY_API}/${d.id}/${isDisable ? 'disable' : 'enable'}`, {
          method: 'PATCH',
        });
        setModalOpen(false);
        await loadDictionaries();
      },
    });
    setModalOpen(true);
  }

  const sortedCategories = [...categories].sort((a, b) => b.id - a.id);
  const sortedDictionaries = [...dictionaries].sort((a, b) => b.id - a.id);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        {/* ---------- Header ---------- */}
        <header className="mb-6 flex flex-col gap-2 md:mb-8">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H3z" />
                <path d="M21 4h-7a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
              백과사전 관리 (Admin)
            </h1>
          </div>
          <p className="text-sm text-neutral-500">사전 카테고리 및 항목을 관리합니다.</p>
        </header>

        {/* ---------- Category ---------- */}
        <section className="mb-10 rounded-xl border border-neutral-200 bg-white px-4 py-4 md:px-5 md:py-5 shadow-sm">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-800">카테고리</h2>
            <button
              onClick={() => {
                if (creating || editingId !== null) return;
                if (categories.length >= 10)
                  return openAlert('카테고리는 최대 10개까지 등록할 수 있습니다.');
                setCreating(true);
                setNameInput('');
              }}
              className="text-xs text-blue-600 hover:underline"
            >
              + 카테고리 추가
            </button>
          </div>
          {/* ✅ 설명 문구 */}
          <p className="mb-3 text-xs text-neutral-500">
            카테고리 개수는 최대 10개, 이름은 최대 20자입니다. 이와 관련된 사항은 관리자에게
            문의해주세요.
          </p>
          <div className="max-h-[360px] overflow-auto rounded-lg border border-neutral-100">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <Th>번호</Th>
                  <Th>이름</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {creating && (
                  <tr className="border-t border-neutral-100">
                    <Td>{sortedCategories.length + 1}</Td>
                    <Td>
                      <input
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        maxLength={20}
                        className="w-full rounded border border-neutral-200 bg-white px-2 py-1 text-xs focus:border-blue-400 focus:outline-none"
                      />
                    </Td>
                    <Td className="text-right">
                      <button
                        onClick={createCategory}
                        className="mr-2 text-xs text-blue-600 hover:underline"
                      >
                        등록
                      </button>
                      <button
                        onClick={() => {
                          setCreating(false);
                          setNameInput('');
                        }}
                        className="text-xs text-red-600 hover:underline"
                      >
                        취소
                      </button>
                    </Td>
                  </tr>
                )}

                {sortedCategories.map((c, index) => {
                  const isDefault =
                    c.id === DEFAULT_CATEGORY_ID && c.name === DEFAULT_CATEGORY_NAME;

                  return (
                    <tr key={c.id} className="border-t border-neutral-100 hover:bg-neutral-50/60">
                      <Td>{sortedCategories.length - index}</Td>
                      <Td>
                        {editingId === c.id ? (
                          <input
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            maxLength={20}
                            className="w-full rounded border border-neutral-200 bg-white px-2 py-1 text-xs focus:border-blue-400 focus:outline-none"
                          />
                        ) : (
                          <>
                            {c.name}
                            {isDefault && (
                              <span className="ml-2 rounded-full bg-blue-50 px-2 py-[1px] text-[10px] font-medium text-blue-600">
                                기본
                              </span>
                            )}
                          </>
                        )}
                      </Td>
                      <Td className="text-right">
                        {!isDefault &&
                          (editingId === c.id ? (
                            <>
                              <button
                                onClick={() => updateCategory(c.id)}
                                className="mr-2 text-xs text-blue-600 hover:underline"
                              >
                                저장
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null);
                                  setNameInput('');
                                }}
                                className="text-xs text-red-600 hover:underline"
                              >
                                취소
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingId(c.id);
                                  setNameInput(c.name);
                                }}
                                className="mr-2 text-xs text-blue-600 hover:underline"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => confirmDeleteCategory(c)}
                                className="text-xs text-red-600 hover:underline"
                              >
                                삭제
                              </button>
                            </>
                          ))}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ---------- Dictionary ---------- */}
        <section className="rounded-xl border border-neutral-200 bg-white px-4 py-4 md:px-5 md:py-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-800">사전 항목</h2>
            <button
              onClick={openCreateDictionary}
              className="text-xs text-blue-600 hover:underline"
            >
              + 사전 항목 추가
            </button>
          </div>

          {/* ✅ 설명 문구 */}
          <div className="mb-3 space-y-1 text-xs text-neutral-500">
            <p>
              질문은 최대 200자, 답변은 최대 500자까지 입력할 수 있습니다. 카테고리를 삭제할 경우,
              해당 사전 항목은 <span className="font-medium text-neutral-700">기타</span>로 자동
              분류됩니다.
            </p>
            <p>또한, 비활성화된 사전 항목은 사용자 화면에 노출되지 않습니다.</p>
          </div>

          <div className="max-h-[520px] overflow-auto rounded-lg border border-neutral-100">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <Th>번호</Th>
                  <Th>카테고리</Th>
                  <Th>질문</Th>
                  <Th>답변</Th>
                  <Th>상태</Th>
                  <Th>비활성화일</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {sortedDictionaries.map((d, index) => (
                  <tr key={d.id} className="border-t border-neutral-100 hover:bg-neutral-50/60">
                    <Td>{sortedDictionaries.length - index}</Td>
                    <Td>{d.category.name}</Td>
                    <Td className="max-w-[280px] truncate">{d.question}</Td>
                    <Td className="max-w-[420px] truncate text-neutral-600">{d.content}</Td>
                    <Td>
                      <StatusBadge deleted={d.deleted} />
                    </Td>
                    <Td>{formatDate(d.deletedAt)}</Td>
                    <Td className="text-right">
                      <button
                        onClick={() => openEditDictionary(d)}
                        className="mr-2 text-xs text-blue-600 hover:underline"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => toggleDictionaryActive(d)}
                        className={`text-xs ${
                          d.deleted ? 'text-green-600' : 'text-red-600'
                        } hover:underline`}
                      >
                        {d.deleted ? '활성화' : '비활성화'}
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* ---------- Modals ---------- */}
      {modalConfig && (
        <ConfirmModal
          open={modalOpen}
          title={modalConfig.title}
          message={modalConfig.message}
          variant={modalConfig.variant}
          confirmText={modalConfig.confirmText}
          confirmColor={modalConfig.confirmColor}
          onConfirm={modalConfig.onConfirm}
          onCancel={() => setModalOpen(false)}
        />
      )}

      <DictionaryFormModal
        open={dictionaryModalOpen}
        mode={dictionaryMode}
        categories={sortedCategories}
        categoryId={selectedCategoryId}
        question={questionInput}
        content={contentInput}
        onChangeCategory={setSelectedCategoryId}
        onChangeQuestion={setQuestionInput}
        onChangeContent={setContentInput}
        onSubmit={submitDictionary}
        onClose={() => setDictionaryModalOpen(false)}
      />
    </div>
  );
}

/* ---------- UI ---------- */
function StatusBadge({ deleted }: { deleted: boolean }) {
  return deleted ? (
    <span className="rounded-full bg-red-50 px-2 py-[2px] text-[11px] font-medium text-red-600">
      비활성
    </span>
  ) : (
    <span className="rounded-full bg-green-50 px-2 py-[2px] text-[11px] font-medium text-green-600">
      활성
    </span>
  );
}

function Th({
  children,
  className,
}: {
  children?: React.ReactNode; // ⭐ optional
  className?: string;
}) {
  return (
    <th
      className={`sticky top-0 bg-neutral-50 px-3 py-2 text-left text-xs font-medium text-neutral-500 ${
        className ?? ''
      }`}
    >
      {children}
    </th>
  );
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 text-xs text-neutral-700 ${className ?? ''}`}>{children}</td>;
}
