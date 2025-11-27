<template>
    <div class="p-6 flex flex-col gap-2" v-if="results">
        <div
            v-for="d in results.departures"
            class="flex gap-3 bg-surface-100 p-2 rounded"
            :class="{
                'bg-blue-300': d.real_time === actualTime.format('HH:mm'),
            }"
        >
            <div class="name w-9 flex justify-center items-start">
                {{ `${d.category}${d.line}` }}
            </div>
            <div class="destination flex-1 items-start">
                {{ d.destination }}
            </div>
            <div v-if="d.real_time === actualTime.format('HH:mm')"></div>
            <div class="flex ga©p-3" v-else>
                <div class="time w-[4rem] flex justify-end gap-1 items-start">
                    <span>{{ d.planned_time }}</span>
                </div>
                <div
                    class="time w-[1.7rem] flex justify-center gap-1 items-start"
                >
                    <span v-if="d.delay !== 0" class="text-red-500"
                        >+{{ d.delay }}</span
                    >
                </div>
            </div>
        </div>

        <div class="w-full flex justify-center p-3 text-surface-400">
            Dernière actualisation {{ lastRefresh.format("HH:mm:ss") }}
        </div>
        {{ actualTime }}
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import dayjs from "dayjs";

const results = ref(null);
const lastRefresh = ref(null);
const actualTime = ref(null);
let refreshInterval = null;
let verificationInterval = null;

async function fetchDepartures() {
    lastRefresh.value = dayjs(Date());
    try {
        const data = await $fetch("/api/departures");
        results.value = data;
    } catch (err) {
        console.error("Erreur API:", err);
    }
}

function refreshActualTime() {
    actualTime.value = dayjs(Date());
}

onMounted(() => {
    fetchDepartures();
    refreshInterval = setInterval(fetchDepartures, 10000); // 10 sec

    refreshActualTime();
    verificationInterval = setInterval(refreshActualTime, 500); // 1sec
});

onBeforeUnmount(() => {
    clearInterval(refreshInterval);
    clearInterval(verificationInterval);
});
</script>

<style>
body {
    font-size: 13px;
}
</style>
