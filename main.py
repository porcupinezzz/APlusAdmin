from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def main():
    return render_template("index.html")

@app.route("/mark")
def mark():
    return render_template("mark.html")

@app.route("/view")
def view():
    return render_template("view.html")

@app.route("/amend")
def amend():
    return render_template("amend.html")

@app.route("/generate")
def generate():
    return render_template("generate.html")

@app.route("/update")
def update():
    return render_template("update.html")


app.run()