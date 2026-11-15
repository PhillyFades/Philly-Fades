"use client";

import { useEffect } from "react";
import { requestPath } from "@/content/requests";

export function EventsHashRedirect() {
  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get("type");
    if (window.location.hash !== "#request" && !type) return;
    window.location.replace(requestPath(type));
  }, []);

  return null;
}
