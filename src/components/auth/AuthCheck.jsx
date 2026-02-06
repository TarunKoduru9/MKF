"use client";

import { useUser } from "@/hooks/useUser";

export default function AuthCheck() {
    // This hook automatically checks auth on mount and syncs to store
    // It also handles background revalidation
    useUser();

    return null;
}
