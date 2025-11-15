FROM node:18-alpine AS build

WORKDIR /app
ENV CI=false

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps --force

COPY . .
ARG VITE_API_BASE_URL=http://localhost:8080/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build && mv dist build

FROM node:18-alpine

WORKDIR /app
RUN npm install -g serve

COPY --from=build /app/build ./build

EXPOSE 5174
CMD ["serve", "-s", "build", "-l", "5174"]
