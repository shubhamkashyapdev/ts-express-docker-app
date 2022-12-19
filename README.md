# Video URL: [https://youtu.be/9zUHg7xjIqQ]

# Run a process with bind mount (volumes) - auto sync

`docker run --name <process-name-any> -p 5000:5000 -v C:/WebDevelopment/MyProjects/Docker/docker_express_app:/app -v /app/node_modules -d <contianer-name>`

# Read Only bind mount - :ro

`docker run --name <process-name-any> -p 5000:5000 -v C:/WebDevelopment/MyProjects/Docker/docker_express_app:/app:ro -v /app/node_modules -d <contianer-name>`

# Environment Variables

-   In the Dockerfile
    `ENV PORT _5000_ => (any port number)`

-   In Terminal
-   add the --env flag, example:
    `docker run ..... --env PORT=5000`

-   Load environment variables from a file
    `docker run ..... --env-file ./.env(relative path to the environment variable file)`

-   View all environment variables
    `docker exec -it <container-name> sh`
    `printenv`

-   MongoDB connection URI - IPV4 address, PORT is 27017 by default
    `mongodb://username:password@container-ipv4:27017?authSource=admin`
-   MongoDB connection URI - Container Name
    `mongodb://username:password@container-name:specified-port?authSource=admin`

# Run the application in development environment

`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d`

# Run the application in production environment

`docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`

# If installed a new npm package, to rebuild the node_modules volume use the following command

`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build -V`

# Run multiple instance of application using nginx as the load balancer

`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --scale node-app=2`

-   node-app is the container name i had set in the docker-compose.yml file
-   node-app=2 - _2_ is the number of instances that will run, _2_ will start one more instance

# Test if the load balancer is working properly

-   docker ps (sell all running containers)
-   docker logs node-app-1 -f
-   docker logs node-app-2 -f

Nginx will round robin the request to these containers

_By default the application is listening on port: 5000_

# Install docker on production

_[https://get.docker.com/]_

-   `curl -fsSL https://get.docker.com -o get-docker.sh`
-   `sh get-docker.sh`

-   Docker Compose Install: [https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-18-04]

# Env

_Set environment variables with **export**_

-   export SESSION_SECRET=sessionsecret

Export all the variables with this method

-   `printenv`
-   check if variables are exported successfully

# nginx address already in use error then

-   sudo pkill -f nginx & wait $!
-   run the docker-compose up command again

# Running dokcer without sudo

-   echo $USER
-   sudo usermod -aG docker $USER
-   **logout** and then **login** agian
-   sudo systemctl restart docker
-   docker ps

# Docker CICD

-   create your docker hub account and then create a new repository of any name, example: node-app

-   copy the image name, example: dev1800/node-app (listed on right side under docker commands "ignore the tagname for now it will be :latest by default)

-   name your node-app image (currently set to dev1800/node-app)

-   `docker ps`
-   copy the node-app process name
-   `docker run -d --name watchtower -e WATCHTOWER_TRACE=true -e WATCHTOWER_DEBUG=true -e WATCHTOWERe -e WATCHTWOER_POLL_INTERVAL=50 -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower app_node-app-1`
-   example: app_node-app-1 is node-app process name here

-   `docker logs watchtower -f` - watchtower logs

# Deploy new changes

-   do some code cahnges
-   rebuild the image (with docker-compose up command)
-   docker push node-app
-   watchtower will watch the new image update and will update the image on production server

# Deploying with watchtower

-   without using watchtower we would have to rebuild the image on production server manually

-   `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build --no-deps node-app`

-   the **--build** command will rebuild the image, **--no-deps** command will stop the dependency images from rebuilding like mongodb and redis, and by specifying the **node-app** only the _node-app_ image will be rebuild

# Docker Swarm

<hr />

docker-compose is a development tool and is not ment to be used in production therefore we have solutions like _docker swarm_ that are container orchestrators and can handle container on multiple servers so if one server goes down the other one can be used as backup, also it uses rolling updates therefore our production server won't go down when a new push is made to docker hub as the docker-compose will have to tear down the old container and then build a new one which causes server to go down until the container is up again.

-   `ip add` - will list out all the IP addresses
-   copy the eth0 IP address, example: 172.31.39.168

-   `docker swarm init --advertise-addr 172.31.39.168`

-   add the docker swarm configuration in the docker-compose.yml file
-   commit and deploy the changes to github
-   pull the changes on production
-   stop all docker containers (down)

_now instead of docker-compose we will use docker swarm to start the services_

_swarm build command_

-   `docker stack deploy -c docker-compose.yml -c docker-compose.prod.yml myapp` (myapp is the stack name which can be set to anything)

-   `docker node ls`
-   `docker stack ps myapp` - list all services in myapp

-   do some code changes
-   build a new image
-   push the image to hub
-   on production server run the **swarm build command** listed above
