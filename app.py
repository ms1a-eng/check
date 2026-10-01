from flask import Flask, request, jsonify
import time
import os

url = os.environ.get("DATABASE_URL")
if url and url.startswith("postgres://"):
    url = url.replace("postgres://", "postgresql://", 1)
APIKey = os.environ.get("API_KEY")
if url: 
    import psycopg2

app = Flask(__name__)

@app.route("/api/save", methods=["POST", "OPTIONS"])
def save(): 
    if request.method == "OPTIONS":
        return ("", 204)
    
    currenttab = request.get_json(silent=True) #kept silent to avoid crash. The global request variable contains the json of the extension 
    key = request.headers.get("API-KEY")

    #key not allowed to be none and not allowed to be wrong!
    if not APIKey or key != APIKey: 
        return "unauthorized acsses.", 401
    database = psycopg2.connect(url)
    cursor = database.cursor(); 

    cursor.execute(
        """CREATE TABLE IF NOT EXISTS focustable
        (id SERIAL PRIMARY KEY , name TEXT, time INTEGER, created_at DOUBLE PRECISION)
        """
    )


    if "ocw" in currenttab["url"] or "ombplus" in currenttab["url"]: 
        name = "math"
    elif "cs50" in currenttab["url"]: 
        name = "cs50"

    elif "https://vigilant-spoon-wvv745474x57cg95r.github.dev" in currenttab["url"]:
        name = "cs50"
    else:
        displayname = currenttab["title"]
        name = currenttab["title"]
     
    cursor.execute(
        "INSERT INTO focustable (name, time, created_at) VALUES (%s, %s, %s)", (name, 1, time.time())
    )


    database.commit()
    database.close()

    return jsonify({"status": "saved", "code": 200})


@app.route("/api/get")
def get():
    search = request.args.get("name")
    database = psycopg2.connect(url)
    cursor = database.cursor()
    cursor.execute(
        """CREATE TABLE IF NOT EXISTS focustable
        (id SERIAL PRIMARY KEY , name TEXT, time INTEGER, created_at DOUBLE PRECISION)
        """
    )
    if search:
        cursor.execute("SELECT SUM(time) FROM focustable WHERE name = (%s)", (search,))  #comma to remind python thats not just a word 
    else: 
        cursor.execute("SELECT SUM(time) FROM focustable")
    
    result = cursor.fetchone()
    result = result[0] or 0 

    cursor.execute(
           "SELECT name, created_at FROM focustable ORDER BY id DESC LIMIT 1"
        )
    #give me the result of the execution
    row = cursor.fetchone()
    if row: 
        name = row[0]
        #the time in row index 1
        last_time = row[1]
    else:
        name = "IDLE"
        last_time = 0
    database.close()

    diff =  time.time() -last_time
    is_online = (diff < 120)
    if not is_online:
        name = "IDLE"

    return jsonify({"name": name ,"minutes": result, "is_online": is_online})


@app.after_request
def allow(response):
    response.headers["Access-Control-Allow-Origin"] = "*" #allowing requests from anyone even if its a chrome extension
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, API-KEY" #the sender is allowed to send this header
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    return response

if __name__ == "__main__":  
    app.run(port = 5001 , debug=True)