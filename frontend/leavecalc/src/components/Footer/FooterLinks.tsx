export default function FooterLinks() {
  return (
    <div className="mt-8 border-t pt-4 text-center text-xs text-neutral-500">
      <div className="flex items-center justify-center gap-4">
        <a className="underline" href="/guidelines">
          연차 산정 기준
        </a>
        <span>·</span>
        <a className="underline" href="/terms">
          공지사항
        </a>
        <span>·</span>
        <a className="underline" href="/privacy">
          개인정보처리방침
        </a>
        <span>·</span>
        <a className="underline" href="/changelog">
          이용약관
        </a>
      </div>
      <div className="mt-2">© LAWDING</div>
    </div>
  );
}
