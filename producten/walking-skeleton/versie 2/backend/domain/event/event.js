class Event {
    constructor(id, fase_id, name, file_name, device_id, channel, synchronized, type, media, starting_seconds, ending_seconds){
        this.id = id
        this.fase_id = fase_id
        this.name = name
        this.file_name = file_name
        this.device_id = device_id
        this.channel = channel
        this.synchronized = synchronized
        this.type = type
        this.media = media
        this.starting_seconds = starting_seconds
        this.ending_seconds = ending_seconds
    }
}

module.exports = Event