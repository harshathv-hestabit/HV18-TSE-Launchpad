# **Service Architecture in Docker Compose File**
* Listed 3 services in the compose.yaml file:
    1. Frontend
    2. Backend
    3. Mongo

* Except for Mongo, Each service had build,networks,ports defined.

* Additionally, in backend service, dependency on mongo service was added

* Mongo service is based on pulling the official docker image for mongo.

* Created a Docker network (Type: Bridge) "d2" for all the services(containers) to communicate with each other.
 
* Services flow can be understood as following: 

    DB container runs first -> Backend container runs and is connected to mongo db -> Frontend container runs and can fetch response from backend