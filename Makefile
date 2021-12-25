# .PHONY: all
# all:

all: build

#
# Phony targets.
#
.PHONY: help build tag push tag-and-push build-devenv build-prodenv build-push-devenv build-push-prodenv

#
# Iterated after major releases.
#
VERSION ?= latest

#
# App image name: <user>/<appname>
#
# IMAGE_NAME ?= react-automated-deployment
#lvsdm-client-app-devenv
IMAGE_NAME ?= client-app

#
# Environment name: 
#
ENV_NAME ?= devenv

#
# Site env vars react build deployment
#
DEPLOY_SITE ?= celeste

#
# Site env vars react build deployment
#
DEPLOY_SITES ?= celeste chappie bunker


DOCKER_TAG ?= devenv-bunker

#
# Gitlab registry URL
#
REGISTRY_URL ?= registry.the-wallrus.com

#
# Gitlab registry user
#
REGISTRY_USER ?= dockeruser

#
# Gitlab registry category
#
REGISTRY_CATEGORY ?= orangerine/la-vie-secrete-des-monstres

#
# App deploy tag
#
APP_DEPLOY_TAG ?= $(ENV_NAME)-$(DEPLOY_SITE)

#
# App image name: compilation
#
# APP_IMAGE_NAME ?= $(IMAGE_NAME)-$(DEPLOY_SITE):$(VERSION)
APP_IMAGE_NAME ?= $(IMAGE_NAME):$(APP_DEPLOY_TAG)

#
# App image name: <user>/<appname>
#
APP_IMAGE_TAG ?= $(REGISTRY_URL)/$(REGISTRY_CATEGORY)/$(APP_IMAGE_NAME)

help:
	@echo "\nDocker-React Automatisation.\n"
	@echo "Usage: \n\
make build        This builds the $(APP_IMAGE_NAME) image. \n\
make update       This builds and updates the $(APP_IMAGE_NAME) image in the registry. \n\
"

build:
	@echo "\033[0mBuilding docker image. \033[0m"
	@docker build \
	-t $(APP_IMAGE_NAME) \
	--build-arg DEPLOY_SITE=${DEPLOY_SITE} \
	--rm .

tag:
	@echo "\033[0mTagging docker image $(APP_IMAGE_NAME) as $(APP_IMAGE_TAG). \033[0m"
	@docker image tag \
	$(APP_IMAGE_NAME) $(APP_IMAGE_TAG)

push:
	@echo "\033[0mPushing docker image $(APP_IMAGE_TAG) to $(REGISTRY_URL). \033[0m"
	@docker push $(APP_IMAGE_TAG)

tag-and-push: tag push

build-devenv:
	@echo "\033[0mBuilding development environment docker image $(APP_IMAGE_NAME). \033[0m"
	@docker build \
	-f dev.Dockerfile \
	-t $(APP_IMAGE_NAME) \
	--build-arg DEPLOY_SITE=$(DEPLOY_SITE) \
	--rm .

build-prodenv:
	@echo "\033[0mBuilding production environment docker image $(APP_IMAGE_NAME). \033[0m"
	@docker build \
	-f Dockerfile \
	-t $(APP_IMAGE_NAME) \
	--build-arg DEPLOY_SITE=$(DEPLOY_SITE) \
	--rm .

build-push-devenv: build-devenv tag-and-push

build-push-prodenv: build-prodenv tag-and-push

build-devenv-all:
	@echo "\033[0mBuilding devenv docker images for all environments. \033[0m"

	@echo "\033[0mBuilding devenv docker images for celeste. \033[0m"
	@docker build \
	-f dev.Dockerfile \
	-t lvsdm-client-devenv-celeste \
	--build-arg celeste \
	--rm .
	
	@echo "\033[0mBuilding devenv docker images for chappie. \033[0m"
	@docker build \
	-f dev.Dockerfile \
	-t lvsdm-client-devenv-chappie \
	--build-arg chappie \
	--rm .

	@echo "\033[0mBuilding devenv docker images for bunker. \033[0m"
	@docker build \
	-f dev.Dockerfile \
	-t lvsdm-client-devenv-bunker \
	--build-arg bunker \
	--rm .

deploy-devenv:
	@echo "\033[0mDeploying dev environment for $(DOCKER_TAG). \033[0m"
	@DOCKER_TAG=$(DOCKER_TAG) \
	&& docker-compose \
	-f dev.docker-compose.yml \
	--env-file .dev.bunker.docker-compose.env \
	-d --remove-orphans \
	up