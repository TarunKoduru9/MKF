"use client";

import { useEffect } from "react";
import useStore from "@/lib/store";
import { API_ROUTES } from "@/lib/routes";
import axios from "axios";

export default function AuthCheck() {
    const setUser = useStore((state) => state.setUser);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check if we have a valid session
                const res = await axios.get(API_ROUTES.AUTH.ME);
                if (res.data.user) {
                    setUser(res.data.user);
                }
            } catch (error) {
                // Not authenticated, do nothing (store is already null)
            }
        };

        checkAuth();
    }, [setUser]);

    return null; // This component renders nothing
}
