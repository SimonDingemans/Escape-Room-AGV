import {create} from "zustand";
import {TimeboundEvent, Device, Fase, Time} from "./data-structure.js";

const testDevices = [
    new Device('beamer 1', ['foreground-1', 'foreground-2', 'background'], 'Living Room'),
    new Device('beamer 2', ['background'], 'Living Room'),
    new Device('lightbar 1', ['background'], 'Living Room'),
    new Device('speaker 1', ['foreground', 'background'], 'Hallway'),
]

const testEvent = new TimeboundEvent('test.mp4', 'VIDEO', 'Rain', new Device('beamer 1', ['foreground-1', 'foreground-2', 'background'], 'Living Room', 'foreground-1'), new Time('59:20', '55:50'))

const testFases = [
    new Fase(true, "Introduction", new Time("60:00", "45:00"), [testEvent], "Living Room"),
]

export const useEventStore = create((set) => ({
    fases: testFases,
    devices: testDevices,
    getDeviceChannelId: (device, channel) => `${device.hardware}:${channel}`,

    eventForm: null,
    showEventForm: (event) => set(() => ({eventForm: event})),
    hideEventForm: () => set(() => ({eventForm: null})),
    addEvent: (activeFase, event) => set((state) => (
        {
            fases: state.fases.map((fase) => (
                fase.name === activeFase
                    ? new Fase(
                        fase.active,
                        fase.name,
                        fase.time,
                        [...fase.events, event],
                        fase.location
                    ) : fase
            )),
            eventForm: null,
        }
    ))
}))