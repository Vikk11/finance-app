FROM golang:1.26rc3-alpine

WORKDIR /app

COPY . .

RUN go mod tidy

RUN go build -o notifications-service

EXPOSE 5000

CMD ["./notifications-service"]