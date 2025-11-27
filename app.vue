<template>
    <div class="p-3 h-screen flex flex-col gap-2">
        <div class="flex flex-col gap-2 overflow-y-auto flex-1" v-if="results">
            <div
                class="bg-surface-100 p-2 rounded flex gap-2"
                v-for="(dep, id) in results.departures"
            >
                <div class="w-[2rem] font-bold">
                    {{ dep.category }}{{ dep.line }}
                </div>
                <div
                    class="w-[19.5px] h-[19.5px] bg-blue-500 text-xs text-white flex justify-center items-center rounded font-bold"
                >
                    {{ dep.platform }}
                </div>
                <div class="flex-1">{{ dep.destination }}</div>
                <div class="flex">
                    <div class="time w-[2.6rem]">
                        <Icon
                            v-if="dep.real_time === actualTime"
                            icon="material-symbols:train-outline"
                            width="19.5"
                            height="19.5"
                        />
                        <span v-else>{{ dep.planned_time }}</span>
                    </div>
                    <div class="delay w-[1.8rem] flex-1 flex justify-start">
                        <span
                            class="text-red-500"
                            v-if="
                                dep.delay !== 0 && dep.real_time !== actualTime
                            "
                            >+{{ dep.delay }}</span
                        >
                    </div>
                </div>
            </div>
        </div>
        <div
            class="flex flex-col gap-2 overflow-y-auto flex-1 justify-center items-center"
            v-else
        >
            <i
                class="pi pi-spin pi-spinner text-surface-400"
                style="font-size: 3rem"
            ></i>
        </div>
        <div class="flex justify-center text-surface-400" v-if="lastRefresh">
            Dernière actualisation : {{ lastRefresh }}
        </div>
    </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import dayjs from "dayjs";

const results = ref(null);
const lastRefresh = ref(null);
const actualTime = ref(null);
let refreshInterval = null;
let verificationInterval = null;

async function fetchDepartures() {
    lastRefresh.value = dayjs(Date()).format("HH:mm");
    try {
        const data = await $fetch("/api/departures");
        results.value = data;
    } catch (err) {
        console.error("Erreur API:", err);
    }
}

function refreshActualTime() {
    actualTime.value = dayjs(Date()).format("HH:mm");
}

onMounted(() => {
    fetchDepartures();
    refreshInterval = setInterval(fetchDepartures, 1000); // 10 sec

    refreshActualTime();
    verificationInterval = setInterval(refreshActualTime, 1000); // 1sec
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
