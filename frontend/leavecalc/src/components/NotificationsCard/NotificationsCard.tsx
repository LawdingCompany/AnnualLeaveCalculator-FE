import { Card, Button } from 'flowbite-react';

interface Props {
  onViewMore(): void;
}

export default function NotificationsCard({ onViewMore }: Props) {
  return (
    <Card className="bg-blue-50">
      <h5 className="text-lg font-semibold mb-2">공지사항</h5>
      <ul className="text-sm space-y-1">
        <li>연차 계산기 버전 업데이트(v1.0.2)</li>
        <li>법정공휴일(2016–2026) 적용</li>
        <li>…</li>
      </ul>
      <Button size="sm" className="mt-4" onClick={onViewMore}>
        더보기
      </Button>
    </Card>
  );
}
