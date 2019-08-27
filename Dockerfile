FROM debian:stretch-slim

RUN apt-get update && apt-get install -qq libpq5

WORKDIR /opt

ENV FE_STATIC static

COPY dist ./static
COPY backend ./backend
COPY .env ./.env

CMD ["./backend"]
