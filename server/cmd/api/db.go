package main

import (
	"backend/utils"
	"database/sql"
	"log"

	_ "github.com/jackc/pgconn"
	_ "github.com/jackc/pgx/v4"
	_ "github.com/jackc/pgx/v4/stdlib"
)

func openDB(dsn string) (*sql.DB, error) {
	db, err := sql.Open("pgx", dsn)
	if err != nil {
		return nil, err
	}

	if err = db.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}

func (app *application) connectToDB() (*sql.DB, error) {
	connection, err := openDB(app.Config.DSN)
	if err != nil {
		return nil, err
	}

	// for initialization
	script, err := utils.ReadSQLFile("../../sql", app.Config.InitSQL)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	_, err = connection.Exec(script)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	// end for initialization

	log.Println("Connected to Postgres")
	return connection, nil
}
