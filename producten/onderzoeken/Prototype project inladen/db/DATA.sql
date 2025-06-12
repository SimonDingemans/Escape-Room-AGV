Use escaperoom

DELETE From events
DBCC CHECKIDENT ('events', RESEED, 0);
DELETE FROM devices
DBCC CHECKIDENT ('devices', RESEED, 0);
DELETE From fases
DBCC CHECKIDENT ('fases', RESEED, 0);
DELETE FROM scenarios
DBCC CHECKIDENT ('scenarios', RESEED, 0);
DELETE FROM locations

INSERT INTO locations (name)
Values ('gang')

INSERT INTO scenarios (name)
VALUES ('samantha'),
       ('life'),
       ('nope');
GO
SELECT * FROM scenarios

INSERT INTO fases (scenario_id, name, sequence_number, location_name, duration)
VALUES (1, 'introduction',1, 'gang', 30);
GO


INSERT INTO devices (name, location_name, nickname)
VALUES ('\\.\DISPLAY1', 'gang', 'Left Beamer');
GO

INSERT INTO events (fase_id, name, file_path, device_id, channel, synchronized, type, media, starting_seconds, ending_seconds)
VALUES (1, 'CAT WALKING', 'Cat_walking_toward_camera_in_slow_motion.mp4', 1, 0, 0, 'TIMEBOUND', 'MOVIE', 0, 3600);
GO

