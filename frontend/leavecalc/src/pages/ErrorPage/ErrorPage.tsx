export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-800 px-6">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gray-700 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-3">페이지를 찾을 수 없습니다</h2>

        <p className="text-gray-600 mb-8 leading-relaxed">
          요청하신 페이지가 존재하지 않거나
          <br />
          잘못된 주소로 접근하셨어요.
        </p>

        <button
          onClick={() => (window.location.href = '/')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
