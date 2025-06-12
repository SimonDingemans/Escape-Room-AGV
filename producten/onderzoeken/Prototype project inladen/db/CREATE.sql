use escaperoom
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS fases;
DROP TABLE IF EXISTS scenarios;
DROP TABLE IF EXISTS locations;

CREATE TABLE locations
(
    name varchar(255) NOT NULL,
    CONSTRAINT location_name_pk PRIMARY KEY (name)
);
GO

CREATE TABLE scenarios
(
    id   SMALLINT IDENTITY,
    name VARCHAR(255) NOT NULL,
    CONSTRAINT scenarios_id_pk PRIMARY KEY (id),
    CONSTRAINT scenarios_name_ak UNIQUE (name)
);
GO


CREATE TABLE fases
(
    id              INT IDENTITY,
    scenario_id     SMALLINT,
    name            VARCHAR(255),
    sequence_number TINYINT,
    location_name   VARCHAR(255),
    duration        SMALLINT,
    CONSTRAINT fases_id_pk PRIMARY KEY (id),
    CONSTRAINT fases_sequence_nr_scenario_ak UNIQUE (scenario_id, sequence_number),
    CONSTRAINT fases_scenario_id_name_ak UNIQUE (scenario_id, name),
    CONSTRAINT fases_scenario_id_fk FOREIGN KEY (scenario_id) REFERENCES scenarios (id),
    CONSTRAINT fases_location_name_fk FOREIGN KEY (location_name) REFERENCES locations (name)
);
GO

CREATE TABLE devices
(
    id            TINYINT IDENTITY,
    name          VARCHAR(255) NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    nickname      VARCHAR(255) NOT NULL,
    CONSTRAINT devices_id_pk PRIMARY KEY (id),
    CONSTRAINT devices_location_name_fk FOREIGN KEY (location_name) REFERENCES locations (name)
);
GO

CREATE TABLE events
(
    id               INT IDENTITY,
    fase_id          INT,
    name             VARCHAR(255) NOT NULL,
    file_path        VARCHAR(512) NOT NULL,
    device_id        TINYINT      NOT NULL,
    channel          TINYINT      NOT NULL,--Every device has 3 channels
    synchronized     BIT          NOT NULL,-- File has been uploaded to TouchDesigner
    type             VARCHAR(512) NOT NULL,
    media            VARCHAR(255) NOT NULL,
    starting_seconds SMALLINT,
    ending_seconds   SMALLINT,
    CONSTRAINT events_id_pk PRIMARY KEY (id),
    CONSTRAINT events_fase_id_name UNIQUE (fase_id, name),
    CONSTRAINT events_fase_id_fk FOREIGN KEY (fase_id) REFERENCES fases (id),
    CONSTRAINT events_channel_check CHECK (channel IN (0, 1, 2)),
    CONSTRAINT events_media CHECK (media IN ('MOVIE', 'AUDIO', 'LIGHT')),
    CONSTRAINT events_type_check CHECK (type IN ('TIMEBOUND', 'OPERATOR', 'BACKUP')),
    CONSTRAINT events_timebound_check CHECK
        (
        (type = 'TIMEBOUND' AND starting_seconds IS NOT NULL AND ending_seconds IS NOT NULL)
            OR
        (type != 'TIMEBOUND' AND starting_seconds IS NULL AND ending_seconds IS NULL)
        ),
    CONSTRAINT events_device_id_fk FOREIGN KEY (device_id) REFERENCES devices (id)
);
GO