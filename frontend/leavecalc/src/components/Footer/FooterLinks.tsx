// src/components/Footer/FooterLinks.tsx

type FooterLinksProps = {
  onOpenGuide: (section?: 'accuracy' | 'glossary' | 'disclaimer') => void;
  onOpenFAQ: () => void;
};

export default function FooterLinks({ onOpenGuide, onOpenFAQ }: FooterLinksProps) {
  return (
    <footer className="mt-6 text-center text-[11px] text-neutral-500">
      <nav className="flex justify-center gap-2">
        <button onClick={() => onOpenGuide()} className="hover:underline">
          서비스 가이드
        </button>
        <span>·</span>
        <button onClick={onOpenFAQ} className="hover:underline">
          자주 묻는 질문
        </button>
        <span>·</span>
        <button onClick={() => onOpenGuide('disclaimer')} className="hover:underline">
          법적 고지
        </button>
      </nav>
      <p className="mt-1">© LAWDING</p>
      <p className="">문의 : jaeyun1723@naver.com</p>
    </footer>
  );
}
