import { useState } from "react";

export default function PythonCode({ code }: { code: string }) {
  const [result, setResult] = useState<string | null>(null);

  const runCode = async () => {
    const response = await fetch("/api/run-python", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });
    const data = await response.json();
    setResult(data.stdout || data.stderr);
  };

  return (
    <>
      <pre className="bg-amber-50 mb-6">{code}</pre>
      <button onClick={runCode}>Run</button>
      <span>{result}</span>
    </>
  );
}
