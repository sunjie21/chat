import { CodeBlock } from "@/components/canvas";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractCodeBlock(content: string): CodeBlock[] {
  const codes: CodeBlock[] = [];

  const r = /```(\w+)?\n/g;

  while (true) {
    const match = r.exec(content);
    if (!match) break;

    const language = match[1];
    if (language) {
      const startIdx = match.index + match[0].length;
      const endIdx = content.indexOf("```\n", startIdx);
      const code = content
        .substring(startIdx, endIdx > startIdx ? endIdx : content.length)
        .trim();

      codes.push({ language, code });
    }
  }
  return codes;
}

const exportDefault = "export default";
export function guessComponentImportName(content: string): string {
  const lines = content.split("\n");
  const lastLine = lines[lines.length - 1].trim();
  if (lastLine.startsWith(exportDefault)) {
    return "./" + lastLine.replace(exportDefault, "").replace(";", "").trim();
  }
  return "";
}
