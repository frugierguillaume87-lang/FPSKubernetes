

INSERT INTO saves (user_id, json_data) VALUES
(, '{"level": 1, "hp": 100, "x": 0, "y": 0}'),
(, '{"level": 2, "hp": 90, "x": 10, "y": 5}'),
(, '{"level": 5, "hp": 70, "x": 25, "y": 40}');

INSERT into users (email, password, created_at) VALUES
('jean@gmail.com','test','2026-02-16'),
('pierre@gmail.com','test','2026-02-18'),
('henry@gmail.com','test','2026-02-20');

INSERT INTO scores(user_id, score, wave_reached, created_at) VALUES
(,790,9, '2026-07-16'),
(,990,10, '2026-07-17'),
(,1290,19, '2026-08-16');