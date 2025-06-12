export class Time {
    startRemainingTime;
    endRemainingTime;

    constructor(startRemainingTime, endRemainingTime) {
        this.startRemainingTime = startRemainingTime;
        this.endRemainingTime = endRemainingTime;
    }
}

export const mediaOptions = ["VIDEO", "AUDIO", "LIGHT"]

export const actionOptions = ["PLAY", "PAUSE", "STOP"]

class EscapeRoomEvent {
    file;
    media;
    name;
    device;
    
    constructor(file, media, name, device) {
        this.file = file;
        this.media = media;
        this.name = name;
        this.device = device;
    }
}

export class TimeboundEvent extends EscapeRoomEvent {
    time;

    constructor(file, media, name, device, time) {
        super(file, media, name, device);
        this.time = time;
    }
}

export class OperatorEvent extends EscapeRoomEvent {
    action;

    constructor(file, media, name, device, action) {
        super(file, media, name, device);
        this.action = action;
    }
}

export class BackupEvent extends EscapeRoomEvent {
    time;
    action;

    constructor(file, media, name, device, time, action) {
        super(file, media, name, device);
        this.time = time;
        this.action = action;
    }
}

export class Device {
    hardware;
    channels;
    location;
    activeChannel;

    constructor(hardware, channels, location, activeChannel = null) {
        this.hardware = hardware;
        this.channels = channels;
        this.location = location;
        this.activeChannel = activeChannel;
    }
}

export class Fase {
    active;
    name;
    time;
    events;
    location;

    constructor(active, name, time, events, location) {
        this.active = active;
        this.name = name;
        this.time = time;
        this.events = events;
        this.location = location;
    }
}