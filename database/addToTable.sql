-- SQLite
-- INSERT INTO photos (url, date) VALUES ("asd", "2021_02_01");
-- INSERT INTO photos (url, date) VALUES ("asd", "2022_02_01");
-- INSERT INTO photos (url, date) VALUES ("asd", "2025_02_01");
-- INSERT INTO photos (url, date) VALUES ("asd", "2021_02_01");

select substr(min(date), 0, 5)||"_"||substr(max(date), 0, 5) as year from photos;