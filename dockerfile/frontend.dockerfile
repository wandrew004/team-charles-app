FROM node:22

RUN apt -y update && apt -y upgrade

WORKDIR /app
COPY ./frontend .
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
