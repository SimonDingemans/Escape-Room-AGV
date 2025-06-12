export const mediaOptions = ["VIDEO", "AUDIO", "LIGHT"]

export const actionOptions = ["PLAY", "PAUSE", "STOP"]

export class Fase {
    id;
    scenario_id;
    name;
    sequence_number;
    location_name;
    duration;
    editing;

    constructor(id, scenario_id, name, sequence_number, location_name, duration, editing = false) {
        this.id = id;
        this.scenario_id = scenario_id;
        this.name = name;
        this.sequence_number = sequence_number;
        this.location_name = location_name;
        this.duration = duration;
        this.editing = editing;
    }
}

export class Scenario {
    id;
    name;

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

export class Device {
    id;
    name;
    location_name;
    nickname;

    constructor(id, name, location_name, nickname) {
        this.id = id;
        this.name = name;
        this.location_name = location_name;
        this.nickname = nickname;
    }
}

export class Event {
    id;
    fase_id;
    name;
    file_name;
    device_id;
    channel;
    synchronized;
    type;
    media;
    starting_seconds;
    ending_seconds;

    constructor(id, fase_id, name, file_name, device_id, channel, synchronized, type, media, starting_seconds, ending_seconds) {
        this.id = id;
        this.fase_id = fase_id;
        this.name = name;
        this.file_name = file_name;
        this.device_id = device_id;
        this.channel = channel;
        this.synchronized = synchronized;
        this.type = type;
        this.media = media;
        this.starting_seconds = starting_seconds;
        this.ending_seconds = ending_seconds;
    }
}