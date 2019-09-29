const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const redFraction = 0.15;

// open the database
class DB {
  constructor (fileName='my_sqlite.db') {
    this.fileName = path.join(__dirname, fileName);
    this.db = null;
    this.colors = {
      red: 0,
      blue: 0,
      total: 0
    };
  }

  async init () {
    const promise = new Promise(async (resolve, reject) => {
      this.db = new sqlite3.Database(this.fileName, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, async (err) => {
        if (this.error) {
          reject(new Error(`Unable to open database file ${this.file}`));
        } else {
          console.log(`Connected to sqlite3 DB file ${this.fileName}`);
          await this.createColorTable();
          await this.readColorTable();
          resolve(this);
        }
      });
    })
    return promise;
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          console.log('Error running sql ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(arguments);
        }
      })
    })
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, function (err, rows) {
        if (err) {
          console.log('Error running sql ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(rows);
        }
      })
    })
  }

  async createColorTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS colors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        red INTEGER DEFAULT 0,
        blue INTEGER DEFAULT 0
      )`;
    await this.run(sql);
  }

  async readColorTable() {
    return new Promise(async (resolve, reject) => {
      let sql = 'SELECT red, blue FROM colors';
      /*
       * There is at most one row
       */
      let colors;
      const rows = await this.all(sql);
      if (rows.length) {
        const row = rows[0];
        colors = row;
      } else {
        colors = { red: 0, blue: 0 };
        await this.writeColorTable(colors);
      }
      resolve(colors);
    })
  }

  async writeColorTable(colors) {
    const red = colors.red ? colors.red : 0;
    const blue = colors.blue ? colors.blue : 0;
    await this.db.run(`INSERT INTO colors (red, blue) values (${red}, ${blue})`);
  }

  async updateColorTable(colors) {
    const red = colors.red ? colors.red : 0;
    const blue = colors.blue ? colors.blue : 0;
    await this.db.run(`UPDATE colors SET red = ${red}, blue = ${blue} where id = 1`);
  }

  async getNextColor() {
    if (!this.db) {
      throw new Error('Must call init on the SQLITE3 first');
    }
    const colors = await this.readColorTable();
    const total = colors.red + colors.blue;
    let nextColor = '';
    let i = total + 1;
    let red;
    let blue;
    if (redFraction < 0.5) {
      red = Math.floor(i * redFraction);
      blue = i - red;
    } else {
      blue = Math.floor(i * (1 - redFraction));
      red = i - blue;
    }
    if (red > colors.red) {
      colors.red += 1;
      nextColor = 'red';
    } else {
      colors.blue += 1;
      nextColor = 'blue';
    }
    await this.updateColorTable(colors);
    return nextColor;
  }
}


module.exports = DB;