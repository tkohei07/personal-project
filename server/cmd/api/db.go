package main

import (
	"database/sql"
	"log"
	"os"
	"path"
	"runtime"

	_ "github.com/jackc/pgconn"
	_ "github.com/jackc/pgx/v4"
	_ "github.com/jackc/pgx/v4/stdlib"
)

func openDB(dsn string) (*sql.DB, error) {
	db, err := sql.Open("pgx", dsn)
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	return db, nil
}

func (app *application) connectToDB() (*sql.DB, error) {
	connection, err := openDB(app.Config.DSN)
	if err != nil {
		return nil, err
	}

	// for testing
	_, currentFilePath, _, ok := runtime.Caller(1)
	if !ok {
		log.Println("could not get the current file path")
	}
	currentDir := path.Dir(currentFilePath)
	sqlDir := path.Join(currentDir, "../../sql")
	filePath := path.Join(sqlDir, "init.sql")
	data, err := os.ReadFile(filePath)
	if err != nil {
		log.Println(err)
	}
	connection.Exec(string(data))
	// end for testing

	log.Println("Connected to Postgres")
	return connection, nil
}
