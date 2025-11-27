import dayjs from "dayjs";

export default defineEventHandler(async () => {
    const STOP_NAME = "LANCY Palettes";

    try {
        const url = `https://transport.opendata.ch/v1/stationboard?station=${encodeURIComponent(STOP_NAME)}&limit=10`;

        const r = await $fetch(url);
        const data = r;

        const departures = data.stationboard.map((dep) => {
            const planned = dayjs(dep.stop.departure);
            const real = dep.stop.prognosis?.departure
                ? dayjs(dep.stop.prognosis.departure)
                : planned;
            const delay = real.diff(planned, "minute");

            return {
                line: dep.number,
                category: dep.category,
                destination: dep.to,
                planned_time: planned.format("HH:mm"),
                real_time: real.format("HH:mm"),
                platform: dep.stop.platform || "N/A",
                delay: delay > 0 ? delay : 0,
            };
        });

        return { stop: STOP_NAME, departures };
    } catch (err) {
        return {
            error: "Erreur lors de la récupération",
            details: err.message,
        };
    }
});
