FROM node:14-alpine
WORKDIR /app-backend 
EXPOSE 3001
COPY package* ./
RUN npm install
COPY . .
ENTRYPOINT [ "npm", "run" ]
CMD [ "start" ]