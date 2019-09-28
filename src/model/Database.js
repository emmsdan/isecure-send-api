import fs from "fs";
import path from "path";
import mysql from "mysql";

import { env } from "./../utils/utils";

class Database {
  constructor() {
    let connection = env("DB_URL", null);
    if (!connection) {
      connection = {
        connectionLimit: 4,
        host: env("DB_HOST"),
        user: env("DB_USER"),
        password: env("DB_PASSWORD"),
        port: env("DB_PORT", 3306),
        database: env("DB_NAME", "iss_files")
      };
    }
    this.connection = mysql.createPool(connection);
  }

  refreshDB() {
    const sql = fs
      .readFileSync(path.join(__dirname, "./tables.sql"))
      .toString()
      .replace(/\s/g, " ")
      .split(";");
    delete sql[sql.length - 1];
    return this.transaction(sql, result => {
      this.__isConnected = true;
      return result;
    });
  }

  isConnected() {
    return this.__isConnected;
  }

  errorMessage() {
    return this.__connectErrorMessage;
  }

  transaction(sql, callback) {
    this.connection.getConnection((err, connection) => {
      if (err) return callback(err);

      sql.forEach(sqlStatement => {
        connection.query(sqlStatement, (error, results, fields) => {
          callback(error, results, fields);
          if (error) Promise.reject(error);

          Promise.resolve(results, fields);
        });
      });
      connection.release();
    });
  }

  select(table, fields = "*", condition = "") {
    const sql = `SELECT ? FROM ? ?`;
    const args = [
      mysql.escape(table),
      mysql.escape(fields),
      mysql.escape(condition)
    ];
    return this.query(sql, args);
  }

  async create(table, { fields, values }) {
    const sql = `INSERT INTO ${table} (${fields.join()}) VALUES(? ${", ?".repeat(
      fields.length - 1
    )}) `;
    const args = [...values];
    return this.query(sql, args);
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows, fields) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
}

export default Database;
