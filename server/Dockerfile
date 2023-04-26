FROM golang:1.19-alpine

WORKDIR /usr/local/go/src/app

COPY ./go.mod .

ENV APP_ENV="development"
ENV DEV_DSN="host=db port=5432 user=postgres password=postgres dbname=movies sslmode=disable timezone=UTC connect_timeout=5"

RUN apk update && \
    apk add --no-cache bash && \
    go get -u github.com/jackc/pgx/v4 && \
    go get -u github.com/jackc/pgconn && \
    go get github.com/gin-gonic/gin

RUN apk add --no-cache gcc
RUN apk add --no-cache libc-dev

EXPOSE 8080