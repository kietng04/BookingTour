# Build stage
FROM node:18-alpine as build

WORKDIR /app

ENV CI=false

COPY package.json .npmrc ./

RUN npm install --legacy-peer-deps --force

COPY . .

RUN npm run build && mv dist build

# Production stage
FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
