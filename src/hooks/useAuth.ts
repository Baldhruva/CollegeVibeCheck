"use client";

import { useAuthContext } from "@/context/AuthContext";

/**
 * Custom hook to consume the AuthContext client-side state.
 */
export function useAuth() {
  return useAuthContext();
}
