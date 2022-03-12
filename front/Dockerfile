FROM node:16

WORKDIR /app

COPY package*.json /app/

RUN npm install -g npm@latest \
	&& npm install -g @vue/cli && npm update -g @vue/cli \
	&& npm install --save vuex  \
	&& npm install --save vue-3-socket.io  \
	&& npm install --save vue-socket.io \
	&& npm install --save axios vue-property-decorator \
	&& npm install

COPY . /app/

CMD ["npm", "run", "serve"]

EXPOSE 8080
