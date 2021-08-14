FROM mongo

EXPOSE 3000

# Disable Prompt During Packages Installation
ARG DEBIAN_FRONTEND=noninteractive

RUN apt update

WORKDIR /usr/src/app

COPY package*.json ./

RUN  apt install -y nodejs npm

RUN npm install && npm cache clean --force

RUN npm install mongoose
RUN npm install --global yarn

COPY . .

CMD ["node", "app.js"]
