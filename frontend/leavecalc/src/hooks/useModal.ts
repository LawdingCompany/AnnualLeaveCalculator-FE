import { useState, useCallback } from 'react';

export function useModal() {
  const [show, setShow] = useState(false);
  const open = useCallback(() => setShow(true), []);
  const close = useCallback(() => setShow(false), []);
  return { show, open, close };
}
