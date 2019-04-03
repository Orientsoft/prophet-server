# prophet-server
AI flow control backend

<a href="https://996.icu"><img src="https://img.shields.io/badge/link-996.icu-red.svg" alt="996.icu" /></a>

### Prerequisites
1. MongoDB  
2. Redis  
3. Prophet-Suite  

### Development
1. Install dependency
```
yarn install
```

2. Start webpack dev server
```
yarn dev
```

### Build and Package
Run the following command, it `tar.gz` package of back-end will be created
```
yarn build
```

Start backend service
```
yarn install
yarn start
or
pm2 start yarn -- start
```
[PM2](https://github.com/Unitech/pm2) is a production process manager for Node.js applications with a built-in load balancer. It allows you to keep applications alive forever, to reload them without downtime and to facilitate common system admin tasks.

### Simple test
run following command, check whether you could get a response successfully
```
wget http://localhost:5000/api/v1.0/greeting
curl http://localhost:5000/api/v1.0/greeting # on mac
```
Test Jenkins on new server.
