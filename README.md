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
