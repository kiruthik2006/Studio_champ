import sqlite3

db_path = 'd:/projects/studio/Studio_champ/backend/instance/facerec.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("UPDATE event_types SET name = 'Wedding' WHERE name = 'Weeding'")
conn.commit()

cursor.execute("SELECT name FROM event_types")
print(cursor.fetchall())
conn.close()
print('Typo fixed')
