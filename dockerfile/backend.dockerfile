FROM node:22

RUN apt -y update && apt -y upgrade && apt install -y postgresql-client

ARG PG_USER
ARG PG_HOST=localhost
ARG DB_NAME=postgres
ARG PG_PASSWORD
ARG PG_PORT=5432

WORKDIR /
COPY dockerfile/backend_entrypoint.sh /dockerfile/backend_entrypoint.sh
COPY ./backend .

RUN chmod +x /dockerfile/backend_entrypoint.sh
ENTRYPOINT ["/dockerfile/backend_entrypoint.sh"]