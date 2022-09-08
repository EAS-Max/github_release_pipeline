FROM golang:1.19-alpine as builder
RUN mkdir /build
COPY src/ /build
WORKDIR /build
RUN go build -o ./bin/github
FROM  alpine:3.15
RUN addusr -D -H -h /app app app
COPY --from=builder --chown=app:app /build/bin/github /app/
WORKDIR /app
USER app
ENTRYPOINT ["./github"]