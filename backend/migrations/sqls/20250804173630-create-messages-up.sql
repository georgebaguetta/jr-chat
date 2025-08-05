CREATE TABLE messages (
	message_id SERIAL PRIMARY KEY,
	text TEXT,
	created_at TIMESTAMP default current_timestamp,
	user_id INTEGER REFERENCES users ON DELETE SET NULL
); 
