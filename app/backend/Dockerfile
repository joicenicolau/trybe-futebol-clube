FROM node:14-alpine
WORKDIR /app-backend 
EXPOSE 3001
COPY . .
RUN npm install
ENTRYPOINT [ "npm" ]
CMD [ "start" ]