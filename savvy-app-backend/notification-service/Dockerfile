FROM golang:1.24.2-alpine

WORKDIR /app

COPY . .

RUN go mod tidy

RUN go build -o notifications-service

EXPOSE 5000

CMD ["./notifications-service"]