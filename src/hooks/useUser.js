"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_ROUTES } from "@/lib/routes";
import useStore from "@/lib/store";
import { useEffect } from "react";

const fetchUser = async () => {
    const { data } = await axios.get(API_ROUTES.AUTH.ME);
    return data.user;
};

export function useUser() {
    const setUser = useStore((state) => state.setUser);

    const query = useQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        onError: () => {
            // Optional: Handle specific auth errors
        }
    });

    // Sync with Zustand store if needed for legacy components
    useEffect(() => {
        if (query.data) {
            setUser(query.data);
        }
    }, [query.data, setUser]);

    return query;
}
