# Drip backend

### A browser based cross platform application to share data

## Tech-stack

- Node.js
- Typescript
- Express.js (API)
- Socket.io (Socket)
- SQLite3 (Database)

## Features

- Dependency injection
- Request validation
- Realtime notifications through socket connection
- REST API for requests

## Initial install

#### Install the dependency packages

```bash
npm install
```

#### Start the backend server (this will reset and then migrate the database and start the server in dev mode)

```bash
npm start
```

## Hosting in production mode

#### 1. Build the application with

```bash
npm run build
```

#### 2. Use Systemd to run the app as a service
```bash
cp ./drip.service /lib/systemd/system/drip.service
```
```bash
systemctl daemon-reload
```
```bash
systemctl enable drip
```
```bash
systemctl start drip
```
