"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchDonations = async () => {
    const { data } = await axios.get("/api/donations");
    return data.donations || [];
};

export function useDonations() {
    return useQuery({
        queryKey: ["donations"],
        queryFn: fetchDonations,
    });
}
