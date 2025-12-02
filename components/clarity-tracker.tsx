"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

const projectId = "ufdqghsitt";

export default function ClarityTracker() {
  useEffect(() => {
    Clarity.init(projectId);
  }, []);

  return null;
}
