# Video URL: [https://youtu.be/9zUHg7xjIqQ]

4:00:00 - Deployment to production

# Run a process with bind mount (volumes) - auto sync

`docker run --name <process-name-any> -p 5000:5000 -v C:/WebDevelopment/MyProjects/Docker/docker_express_app:/app -v /app/node_modules -d <contianer-name>`

# Read Only bind mount - :ro

`docker run --name <process-name-any> -p 5000:5000 -v C:/WebDevelopment/MyProjects/Docker/docker_express_app:/app:ro -v /app/node_modules -d <contianer-name>`

# Environment Variables

- In the Dockerfile
  `ENV PORT _5000_ => (any port number)`

- In Terminal
- add the --env flag, example:
  `docker run ..... --env PORT=5000`

- Load environment variables from a file
  `docker run ..... --env-file ./.env(relative path to the environment variable file)`

- View all environment variables
  `docker exec -it <container-name> sh`
  `printenv`

- MongoDB connection URI - IPV4 address, PORT is 27017 by default
  `mongodb://username:password@container-ipv4:27017?authSource=admin`
- MongoDB connection URI - Container Name
  `mongodb://username:password@container-name:specified-port?authSource=admin`

# Run the application in development environment

`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d`

# Run the application in production environment

`docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`

# If installed a new npm package, to rebuild the node_modules volume use the following command

`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build -V`

# Run multiple instance of application using nginx as the load balancer

`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --scale node-app=2`

- node-app is the container name i had set in the docker-compose.yml file
- node-app=2 - _2_ is the number of instances that will run, _2_ will start one more instance

# Test if the load balancer is working properly

- docker ps (sell all running containers)
- docker logs node-app-1 -f
- docker logs node-app-2 -f

Nginx will round robin the request to these containers

_By default the application is listening on port: 5000_
