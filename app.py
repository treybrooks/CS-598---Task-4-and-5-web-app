from flask import Flask, render_template, url_for

app = Flask(__name__)

@app.route('/data/<filename>')
def data():
    data_url = url_for('data', filename=filename)
    return app.send_static_file(data_url)

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/dishes')
def dishes():
    return render_template('dishes.html')

@app.route('/resturaunts')
def resturaunts():
    return render_template('resturaunts.html')

if __name__ == "__main__":
    app.run(debug=True)
