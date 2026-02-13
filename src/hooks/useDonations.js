"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_ROUTES } from "@/lib/routes";

const fetchDonations = async () => {
    const { data } = await axios.get(API_ROUTES.DONATION.CREATE);
    return data.donations || [];
};

export function useDonations() {
    return useQuery({
        queryKey: ["donations"],
        queryFn: fetchDonations,
    });
}
