### DEV

build-dev:
	cd client && make build-dev
	cd server && make build

run-dev:
	docker-compose -f docker-compose-dev.yml up

### LOCAL (prod config)

build-local:
	cd client && make build-local
	cd server && make build

run-local:
	ENV=local docker-compose -f docker-compose-production.yml up
		

### PROD

build-production:
	cd client && make build-production
	cd server && make build	

run-production:
	ENV=production docker-compose -f docker-compose-production.yml up
	
stop:
	ENV=production docker-compose -f docker-compose-production.yml down



### REMOTE

SSH_STRING_SERVER:=user@ip

ssh:
	ssh $(SSH_STRING_SERVER)

copy-files:
	scp -r ./* $(SSH_STRING_SERVER):~/