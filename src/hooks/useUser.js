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
    const logout = useStore((state) => state.logout);

    const query = useQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
        staleTime: 5 * 60 * 1000,
        retry: false, // Don't retry on auth errors
        onError: (error) => {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                logout();
            }
        }
    });

    useEffect(() => {
        if (query.data) {
            setUser(query.data);
        } else if (query.isError && query.error.response?.status === 401) {
            logout();
        }
    }, [query.data, query.isError, query.error, setUser, logout]);

    return query;
}
