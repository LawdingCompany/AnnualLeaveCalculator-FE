import React, { useState } from 'react';
import { Textarea, Button } from 'flowbite-react';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    // TODO: 서버에 피드백 전송 로직 추가
    console.log('Submitted feedback:', feedback);
    setFeedback('');
  };

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        placeholder="피드백을 입력해주세요..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={4}
      />
      <Button onClick={handleSubmit}>제출</Button>
    </div>
  );
}
