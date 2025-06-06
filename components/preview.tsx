"use client";

import { guessComponentImportName } from "@/lib/utils";
import React, { useMemo } from "react";
import { importCode, Runner, Scope } from "react-runner";

const withFiles = (scope: Scope, files: Record<string, string>) => {
  const imports: Scope = { ...scope.import };
  const lookup = new Set<string>();
  const importsProxy = new Proxy(imports, {
    getOwnPropertyDescriptor(target, prop) {
      if (target.hasOwnProperty(prop)) {
        return Object.getOwnPropertyDescriptor(target, prop);
      }
      if (files.hasOwnProperty(prop)) {
        return { writable: true, enumerable: true, configurable: true };
      }
    },
    get(target, prop: string) {
      if (prop in target) return target[prop];
      if (files.hasOwnProperty(prop)) {
        if (lookup.has(prop)) {
          throw new Error(
            `Circular dependency detected: ${[...lookup, prop].join(" -> ")}`
          );
        }
        lookup.add(prop);
        return (target[prop] = importCode(files[prop], {
          ...scope,
          import: importsProxy,
        }));
      }
    },
  });

  Object.keys(files).forEach((file) => {
    try {
      imports[file] = importsProxy[file];
      lookup.clear();
    } catch (error) {
      error.filename = file;
      throw error;
    }
  });

  return { ...scope, import: imports };
};

const baseScope = {
  ...React,
  import: {
    react: React,
  },
};

export default function Preview({ codes }: { codes: string[] }) {
  const [error, setError] = React.useState<Error | undefined>();
  const scope = useMemo(() => {
    if (codes.length > 1) {
      try {
        const files: Record<string, string> = {};
        codes.slice(0, -1).forEach((code) => {
          const fileName = guessComponentImportName(code);
          if (fileName) {
            files[fileName] = code;
          }
        });
        return withFiles(baseScope, files);
      } catch (error) {
        console.error("Error processing files:", error);
      }
    }
    return baseScope;
  }, [codes]);

  return (
    <div>
      <Runner
        code={codes[codes.length - 1]}
        scope={scope}
        onRendered={setError}
      />
      {error && <div className="bg-amber-700">{error?.message}</div>}
    </div>
  );
}
