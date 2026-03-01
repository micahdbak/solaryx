// Local mock data store to replace the deleted $lib/bets.js
import { writable } from "svelte/store";

export const bets = [
    {
        id: "1",
        title: "Cure Childhood Leukemia vs Heart Disease Research",
        category: "Medical",
        subcategory: "Research",
        timeRemaining: "12 hours",
        vol: "$240.5K",
        chance: 65,
        isEvil: false,
        tags: ["Trending", "Medical"],
        optionA: {
            name: "Leukemia",
            image: "https://via.placeholder.com/150",
        },
        optionB: {
            name: "Heart",
            image: "https://via.placeholder.com/150",
        },
    },
    {
        id: "101",
        title: "Fund Cyber Warfare Group vs Private Military Contractors",
        category: "Conflict",
        subcategory: "Global",
        timeRemaining: "2 days",
        vol: "$1.2M",
        chance: 80,
        isEvil: true,
        tags: ["Trending", "Conflict"],
        optionA: {
            name: "Cyber",
            image: "https://via.placeholder.com/150",
        },
        optionB: {
            name: "PMC",
            image: "https://via.placeholder.com/150",
        },
    }
];
