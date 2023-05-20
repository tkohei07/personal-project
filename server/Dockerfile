# FROM golang:1.19-alpine
FROM golang:1.19

WORKDIR /usr/local/go/src/app

COPY ./go.mod .

ENV APP_ENV="development"
ENV DEV_DSN="host=db port=5432 user=postgres password=postgres dbname=buildings sslmode=disable timezone=UTC connect_timeout=5"

# RUN apk update && \
#     apk add --no-cache bash gcc libc-dev git && \
RUN apt-get update && \
    apt-get install -y bash gcc libc-dev git
RUN go get -u github.com/jackc/pgx/v4 && \
    go get -u github.com/jackc/pgconn && \
    go get github.com/gin-gonic/gin
RUN git clone https://github.com/go-delve/delve.git /go/src/github.com/go-delve/delve && \
    cd /go/src/github.com/go-delve/delve && \
    make install

EXPOSE 8080 40000
