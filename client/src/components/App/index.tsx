import React, { useEffect, useState } from 'react';
import 'client/src/components/App/index.scss';

function useMessage(): string | null {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/sample')
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  return message;
}

export default function App() {
  const message = useMessage();
  return <div>Message: {message}</div>;
}
