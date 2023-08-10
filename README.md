# Archive Notice: This is a great proof of concept for how to build a django-powered app with streaming responses from a large language model. I don't have the time to maintain it and it needs a number of upgrades to be production-ready. Let me know if you're interested in taking over maintenance. 

# Delphic

![](./docs/images/Delphic_Header.png)

A simple framework to use LlamaIndex to build and deploy LLM agents that can be used to analyze and manipulate text data from documents.

[![Built with Cookiecutter Django](https://img.shields.io/badge/built%20with-Cookiecutter%20Django-ff69b4.svg?logo=cookiecutter)](https://github.com/cookiecutter/cookiecutter-django/)
[![Black code style](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/ambv/black)

License: MIT

## Getting Setup

### Word of Caution / Note

The initial release of Delphic is based *solely* on OpenAI's API. We fully plan to support other large language models (LLMs), whether self-hosted or powered by third-party API. At the moment, however, as of April 2023, Open AI's API remains perhaps the most capable and easiest to deploy. Since this framework is based on LlamaIndex and is fully compatible with Langchain, it will be pretty easy to use other LLMs. **At the moment, however, your text WILL be processed with OpenAI, even if you're self-hosting this tool. If OpenAI's terms of service present a problem for you, we leave that to you to resolve. WE ARE NOT RESPONSIBLE FOR ANY ISSUES ARRISING FROM YOUR USE OF THIS TOOL AND OPENAI API.**

### Getting Started Locally

#### Just Run the Application

The fastest way to get up and running is to clone this repo and then deploy the application locally.

You will need Docker and Docker Compose to follow these instructions. DigitalOcean, besides being an excellent cloud host, has some of the easiest-to-follow instructions on setting these up. Please check them out here or go to the Docker official instructions.

1. First, clone the repo:

```commandline
git clone
```

2. Then, change into the directory:

```commandline
cd delphic
```

3. **Don't forget to copy the sample env file to ./.envs/.local/ (you may need to be a super user / use sudo depending on your desired location)**

```commandline
mkdir -p ./.envs/.local/
cp -a ./docs/sample_envs/local/.frontend ./frontend
cp -a ./docs/sample_envs/local/.django ./.envs/.local
cp -a ./docs/sample_envs/local/.postgres ./.envs/.local
```

4. And, next update your .django configuration (you'll probably want to edit `.postgres` as well to give your database user a unique password)
   to include your OPENAI API KEY

5. Then, build the docker images:

```commandline
sudo docker-compose --profile fullstack -f local.yml build
```

6. Finally, to launch the application, type:

```commandline
sudo docker-compose --profile fullstack -f local.yml up
```

Go to `localhost:3000` to see the frontend.

#### I Want to Develop / Modify the Frontend

If you want to actively develop the frontend, we suggest you **NOT** use the `--profile=fullstack` flag as every change will require a full container rebuild.
Instead, see the [Development Environment](#development-environment)  instead of step #5 above,

### Production Deploy

This assumes you want to make the application available to the internet at some kind of fully qualified domain like delphic.opensource.legal. In order to do this, you need to update a couple configurations.

**TODO - insert documentation**

# Using the Application

## Setup Users

In order to actually use the application (at the moment, we intend to make it possible to share certain models with unauthenticated users), you need a login. You can use either a superuser or non-superuser. In either case, someone needs to first create a superuser using the console:

Why set up a Django superuser? A Django superuser has all the permissions in the application and can manage all aspects of the system, including creating, modifying, and deleting users, collections, and other data. Setting up a superuser allows you to fully control and manage the application.

### Warning / Disclaimer

**At the moment, any user who is logged in will have full permissions. We plan to implement the more precise, roles-based access control module we developed for [OpenContracts](https://github.com/JSv4/OpenContracts), but, for now
be aware that anyone with any type of login credentials can create and delete collections. **Creating collections uses OpenAI credits / costs money**

### First, Setup a Django superuser:

1. Run the following command to create a superuser:

```
sudo docker-compose -f local.yml run django python manage.py createsuperuser
```

2. You will be prompted to provide a username, email address, and password for the superuser. Enter the required information.

### Second (if desired), Setup Additional Users

Start your Delphic application locally following the deployment instructions.

1. Visit the Django admin interface by navigating to http://localhost:8000/admin in your browser.
2. Log in with the superuser credentials you created earlier.
3. Click on the "Users" link in the “Users” section.
4. Click on the “Add User +” button in the top right corner.
5. Enter the required information for the new user, such as username and password. Click “Save” to create the user.
6. To grant the new user additional permissions or make them a superuser, click on their username in the user list, scroll down to the “Permissions” section, and configure their permissions accordingly. Save your changes.

## Creating and Querying a Collection

**WARNING - If you're using OpenAI as your LLM engine, any Collection interaction will use API credits / cost money. If you're using your own OpenAI API key, you've also accepted their terms of service which may not be suitable for your use-case. Please do your own diligence.**

To access the question-answering interface, bring up the fullstack, and go to `http://localhost:3000`

https://user-images.githubusercontent.com/5049984/233236432-aa4980b6-a510-42f3-887a-81485c9644e6.mp4

# Development Environment

If you want to contribute to Delphic or roll your own version, you'll want to ensure you setup the development environment.

## Backend Setup

On the backend, you'll need to have a working python environment to run the pre-commit formatting checks. You can use
your system python interpreter, but we recommend using pyenv and creating a virtual env based off of Python>=3.10.

### Pre-Commit Setup

Then, in the root of your local repo, run these commands:

```
pip install -r ./requirements/local.txt
pre-commit install
```

Now, when you stage your commits, ou ar code formatting and style checks will run automatically.

### Running Tests

We have a basic test suite in `./tests`. You can run the tests by typing:

```commandline
sudo docker-compose -f local.yml run django python manage.py test
```

## Frontend Setup

On the frontend, we're using node v18.15.0. We assume you're using nvm. We don't have any frontend tests yet (sorry).

### Setup and Launch Node Development Server

Cd into the frontend directory, install your frontend dependencies and start a development server
(**Note, we assume you have nvm installed. If you don't install it now**):

```commandline
cd frontend
nvm use
npm install yarn
yarn install
```

Typing `yarn start` will bring up your frontend development server at `http://localhost:3000`. You still need
to launch the backend in order for it to work properly.

### Run Backend Compose Stack Without `fullstack` profile flag

Launch the backend without the fullstack flag:

```commandline
sudo docker-compose -f local.yml up
```
