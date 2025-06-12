import {create} from "zustand";

export const useScenarioStore = create((set, get) => ({
    activeScenarioId: null,
    scenario: null,
    fases: null,
    events: null,
    devices: null,

    getTimingsOfFase: (faseId) => {
        if (!get().fases) return null;

        const fasesInOrder = get().fases.sort((a, b) => a.sequence_number - b.sequence_number);

        const fase = get().fases.filter(fase => fase.id === faseId)[0];

        const startingTime = fasesInOrder
            .filter(fase => fase.id < faseId)
            .reduce((acc, fase) => acc + fase.duration, 0);

        return {startingTime, endingTime: startingTime + fase.duration};
    },
    getDeviceChannelId: (device, channel) => `${device.nickname}:${channel}`,

    getFaseDeviceChannels: () => {
        const location = get().fases.filter((fase) => fase.editing === true)
            .map(fase => fase.location_name)[0];
        const faseDevices = get().devices.filter(device => device.location_name === location);

        return faseDevices.flatMap(device => [0, 1, 2].map(channel => ({
            deviceId: device.id, channel: channel, deviceChannelId: `${device.nickname}:${channel}`
        })))
    },

    eventForm: null,
    showEventForm: (event) => set(() => ({eventForm: event})),
    hideEventForm: () => set(() => ({eventForm: null})),
    addEvent: (event) => set((state) => ({
        events: [...state.events, event], eventForm: null,
    })),

    setScenario: (scenario) => set(() => ({scenario})),
    setFases: (fases) => set(() => ({fases})),
    setEvents: (events) => set(() => ({events})),
    setDevices: (devices) => set(() => ({devices})),
    setActiveScenarioId: (activeScenarioId) => set(() => ({activeScenarioId}))
}))
