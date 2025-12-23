// import { useEffect, useMemo, useState } from 'react';
// import type { ApiResponse, Category, DictionaryItem } from './types';
// /* ---------- API ---------- */
// const API_BASE = import.meta.env.VITE_API_BASE;

// const CATEGORY_API = `${API_BASE}/admin/dictionary-categories`;
// const DICTIONARY_API = `${API_BASE}/admin/dictionaries`;

// /* ---------- Types ---------- */
// type ApiResponse<T> = {
//   status: string;
//   message: string;
//   data: T;
//   timestamp: string;
// };

// type Category = {
//   id: number;
//   name: string;
// };

// type DictionaryItem = {
//   id: number;
//   category: Category;
//   question: string;
//   content: string;
//   deleted: boolean;
//   deletedAt: string | null;
// };

// /* ---------- Utils ---------- */
// function formatDate(dt?: string | null) {
//   if (!dt) return '-';
//   const d = new Date(dt);
//   return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
// }

// /* ---------- Page ---------- */
// export default function AdminDictionaryPage() {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [dictionaries, setDictionaries] = useState<DictionaryItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function load() {
//       try {
//         const [catRes, dicRes] = await Promise.all([fetch(CATEGORY_API), fetch(DICTIONARY_API)]);

//         const catJson = (await catRes.json()) as ApiResponse<Category[]>;
//         const dicJson = (await dicRes.json()) as ApiResponse<DictionaryItem[]>;

//         setCategories(catJson.data);
//         setDictionaries(dicJson.data);
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, []);

//   /* ---------- Metrics ---------- */
//   const metrics = useMemo(() => {
//     const total = dictionaries.length;
//     const disabled = dictionaries.filter((d) => d.deleted).length;

//     return {
//       total,
//       disabled,
//       categories: categories.length,
//     };
//   }, [categories, dictionaries]);

//   return (
//     <div className="min-h-screen bg-neutral-50">
//       <main className="mx-auto max-w-6xl px-4 py-6 md:py-10">
//         {/* Header */}
//         <header className="mb-6">
//           <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">연차 백과사전 관리</h1>
//           <p className="text-sm text-neutral-500">사전 카테고리 및 항목을 관리합니다.</p>
//         </header>

//         {/* Loading */}
//         {loading && (
//           <div className="rounded-xl border bg-white px-4 py-6 text-sm text-neutral-500">
//             데이터를 불러오는 중입니다…
//           </div>
//         )}

//         {!loading && (
//           <>
//             {/* Summary */}
//             <section className="mb-8 grid gap-3 md:grid-cols-3">
//               <SummaryCard label="전체 사전" value={metrics.total} />
//               <SummaryCard label="비활성화" value={metrics.disabled} />
//               <SummaryCard label="카테고리" value={metrics.categories} />
//             </section>

//             {/* Category Table */}
//             <section className="mb-10 rounded-xl border bg-white px-4 py-5 shadow-sm">
//               <h2 className="mb-3 text-sm font-semibold">카테고리</h2>

//               <table className="min-w-full text-sm">
//                 <thead className="bg-neutral-50">
//                   <tr>
//                     <Th>ID</Th>
//                     <Th>이름</Th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {categories.map((c) => (
//                     <tr key={c.id} className="border-t">
//                       <Td>{c.id}</Td>
//                       <Td>{c.name}</Td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </section>

//             {/* Dictionary Table */}
//             <section className="rounded-xl border bg-white px-4 py-5 shadow-sm">
//               <h2 className="mb-3 text-sm font-semibold">사전 항목</h2>

//               <div className="max-h-[520px] overflow-auto">
//                 <table className="min-w-full text-sm">
//                   <thead className="bg-neutral-50">
//                     <tr>
//                       <Th>ID</Th>
//                       <Th>카테고리</Th>
//                       <Th>질문</Th>
//                       <Th>상태</Th>
//                       <Th>삭제일</Th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {dictionaries.map((d) => (
//                       <tr key={d.id} className="border-t hover:bg-neutral-50">
//                         <Td>{d.id}</Td>
//                         <Td>{d.category.name}</Td>
//                         <Td className="max-w-[420px] truncate">{d.question}</Td>
//                         <Td>
//                           <StatusBadge deleted={d.deleted} />
//                         </Td>
//                         <Td>{formatDate(d.deletedAt)}</Td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </section>
//           </>
//         )}
//       </main>
//     </div>
//   );
// }

// /* ---------- UI ---------- */

// function SummaryCard({ label, value }: { label: string; value: number }) {
//   return (
//     <div className="rounded-xl border bg-white px-4 py-3 shadow-sm">
//       <div className="text-xs text-neutral-500">{label}</div>
//       <div className="mt-1 text-xl font-semibold">{value}개</div>
//     </div>
//   );
// }

// function StatusBadge({ deleted }: { deleted: boolean }) {
//   return deleted ? (
//     <span className="rounded-full bg-red-50 px-2 py-[2px] text-[11px] font-medium text-red-600">
//       비활성
//     </span>
//   ) : (
//     <span className="rounded-full bg-green-50 px-2 py-[2px] text-[11px] font-medium text-green-600">
//       활성
//     </span>
//   );
// }

// function Th({ children }: { children: React.ReactNode }) {
//   return <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500">{children}</th>;
// }

// function Td({ children, className }: { children: React.ReactNode; className?: string }) {
//   return <td className={`px-3 py-2 text-xs text-neutral-700 ${className || ''}`}>{children}</td>;
// }
