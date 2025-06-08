import PythonCode from "./python-code";
import { useState, useEffect } from "react";
import Preview from "./preview";

export interface CodeBlock {
  language: string;
  code: string;
}

export default function Canvas({ codeBlocks }: { codeBlocks: CodeBlock[] }) {
  const [reactCodes, setReactCodes] = useState<string[]>([]);

  useEffect(() => {
    const newReactCodes = codeBlocks
      .filter((codeBlock) => codeBlock.language === "jsx")
      .map((codeBlock) => codeBlock.code);
    setReactCodes(newReactCodes);
  }, [codeBlocks]);

  return (
    <div className="flex flex-col flex-1">
      {codeBlocks.map((codeBlock, idx) => {
        if (codeBlock.language === "python") {
          return <PythonCode key={idx} code={codeBlock.code} />;
        }
        return (
          <pre className="bg-amber-50 mb-6" key={idx}>
            {codeBlock.code}
          </pre>
        );
      })}
      {reactCodes.length > 0 && <Preview codes={reactCodes} />}
    </div>
  );
}
