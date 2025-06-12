IF
    NOT EXISTS (SELECT *
                FROM sys.databases
                WHERE name = 'escaperoom')
    BEGIN
        CREATE
            DATABASE escaperoom;
    END
GO

USE escaperoom;
GO

-- Drop tables
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS fase_devices;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS fases;
DROP TABLE IF EXISTS scenarios;
DROP TABLE IF EXISTS locations;
GO

-- Drop triggers
DROP TRIGGER IF EXISTS tr_fases_insert_sync;
DROP TRIGGER IF EXISTS tr_devices_insert_sync;

-- Drop stored procedure
DROP PROCEDURE IF EXISTS sp_sync_fase_devices;
GO

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
    scenario_id     SMALLINT     NOT NULL,
    name            VARCHAR(255) NOT NULL,
    sequence_number TINYINT      NOT NULL,
    location_name   VARCHAR(255) NOT NULL,
    duration        SMALLINT     NOT NULL,
    CONSTRAINT fases_id_pk PRIMARY KEY (id),
    CONSTRAINT fases_id_location_name_ak UNIQUE (id, location_name),
    CONSTRAINT fases_scenario_id_sequence_nr_ak UNIQUE (scenario_id, sequence_number),
    CONSTRAINT fases_scenario_id_name_ak UNIQUE (scenario_id, name),
    CONSTRAINT fases_scenarios_fk FOREIGN KEY (scenario_id) REFERENCES scenarios (id),
    CONSTRAINT fases_locations_fk FOREIGN KEY (location_name) REFERENCES locations (name)
);
GO

CREATE TABLE devices
(
    id            TINYINT IDENTITY,
    name          VARCHAR(255) NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    nickname      VARCHAR(255) NOT NULL,
    CONSTRAINT devices_id_pk PRIMARY KEY (id),
    CONSTRAINT devices_id_location_name_ak UNIQUE (id, location_name),
    CONSTRAINT devices_locations_fk FOREIGN KEY (location_name) REFERENCES locations (name)
);
GO

CREATE TABLE fase_devices
(
    fase_id       INT          NOT NULL,
    device_id     TINYINT      NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    CONSTRAINT fase_devices_pk PRIMARY KEY (fase_id, device_id),
    CONSTRAINT fase_devices_fases_fk FOREIGN KEY (fase_id, location_name) REFERENCES fases (id, location_name),
    CONSTRAINT fase_devices_devices_fk FOREIGN KEY (device_id, location_name) REFERENCES devices (id, location_name),
    CONSTRAINT fase_devices_location_fk FOREIGN KEY (location_name) REFERENCES locations (name)
);
GO

CREATE TABLE events
(
    id               INT IDENTITY,
    fase_id          INT,
    name             VARCHAR(255) NOT NULL,
    file_name        VARCHAR(512) NOT NULL,
    device_id        TINYINT      NOT NULL,
    channel          TINYINT      NOT NULL,--Every device has 3 channels
    synchronized     BIT          NOT NULL,-- File has been uploaded to TouchDesigner
    type             VARCHAR(512) NOT NULL,
    media            VARCHAR(255) NOT NULL,
    starting_seconds SMALLINT,
    ending_seconds   SMALLINT,
    CONSTRAINT events_id_pk PRIMARY KEY (id),
    CONSTRAINT events_fase_id_name_ak UNIQUE (fase_id, name),
    CONSTRAINT events_fases_fk FOREIGN KEY (fase_id) REFERENCES fases (id),
    CONSTRAINT events_channel_chk CHECK (channel IN (0, 1, 2)),
    CONSTRAINT events_media_chk CHECK (media IN ('MOVIE', 'AUDIO', 'LIGHT')),
    CONSTRAINT events_type_chk CHECK (type IN ('TIMEBOUND', 'OPERATOR', 'BACKUP')),
    CONSTRAINT events_timebound_chk CHECK
        (
        (type = 'TIMEBOUND' AND starting_seconds IS NOT NULL AND ending_seconds IS NOT NULL)
            OR
        (type != 'TIMEBOUND' AND starting_seconds IS NULL AND ending_seconds IS NULL)
        ),
    CONSTRAINT events_devices_fk FOREIGN KEY (device_id) REFERENCES devices (id),
    CONSTRAINT events_fase_devices_fk FOREIGN KEY (fase_id, device_id) REFERENCES fase_devices (fase_id, device_id)
);
GO

CREATE PROCEDURE sp_sync_fase_devices
AS
BEGIN
    INSERT INTO fase_devices (fase_id, device_id, location_name)
    SELECT f.id AS fase_id,
           d.id AS device_id,
           f.location_name
    FROM fases f
             INNER JOIN devices d ON f.location_name = d.location_name
    WHERE NOT EXISTS (
        SELECT 1
        FROM fase_devices fd
        WHERE fd.fase_id = f.id
          AND fd.device_id = d.id
    );
END;
GO

CREATE TRIGGER tr_fases_insert_sync
    ON fases
    AFTER INSERT
    AS
BEGIN
    EXEC sp_sync_fase_devices;
END;
GO

CREATE TRIGGER tr_devices_insert_sync
    ON devices
    AFTER INSERT
    AS
BEGIN
    EXEC sp_sync_fase_devices;
END;
GO