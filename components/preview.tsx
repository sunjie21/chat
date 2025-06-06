"use client";

import React from "react";
import { Runner } from "react-runner";

export default function Preview({ code }: { code: string }) {
  return (
    <div>
      <Runner code={code} scope={{ ...React, import: { react: React } }} />
    </div>
  );
}
