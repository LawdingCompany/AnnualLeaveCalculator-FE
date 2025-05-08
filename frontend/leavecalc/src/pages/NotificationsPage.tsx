import React from 'react';
import { ListGroup, ListGroupItem } from 'flowbite-react';

export default function NotificationsPage() {
  const notifications = [
    '연차 계산기 버전 업데이트(v1.0.2)',
    '법정공휴일(2016–2026) 적용',
    '새로운 기능 추가 예정',
  ];

  return (
    <div className="space-y-2">
      <ListGroup>
        {notifications.map((note, idx) => (
          <ListGroupItem key={idx}>{note}</ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}
