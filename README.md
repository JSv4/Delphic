# Archive Notice: This is a great proof of concept for how to build a django-powered app with streaming responses from a large language model. I don't have the time to maintain it and it needs a number of upgrades to be production-ready. Let me know if you're interested in taking over maintenance. 

# Delphic

![](./docs/images/Delphic_Header.png)

A simple framework to use LlamaIndex to build and deploy LLM agents that can be used to analyze and manipulate text data from documents.

[![Built with Cookiecutter Django](https://img.shields.io/badge/built%20with-Cookiecutter%20Django-ff69b4.svg?logo=cookiecutter)](https://github.com/cookiecutter/cookiecutter-django/)
[![Black code style](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/ambv/black)

License: MIT

## Caution/note: OpenAI API

The initial release of Delphic is based *solely* on OpenAI's API. We fully plan to support other large language models (LLMs), whether self-hosted or powered by third-party API. At the moment, however, as of April 2023, Open AI's API remains perhaps the most capable and easiest to deploy. Since this framework is based on LlamaIndex and is fully compatible with Langchain, it will be pretty easy to use other LLMs. **At the moment, however, your text WILL be processed with OpenAI, even if you're self-hosting this tool. If OpenAI's terms of service present a problem for you, we leave that to you to resolve. WE ARE NOT RESPONSIBLE FOR ANY ISSUES ARRISING FROM YOUR USE OF THIS TOOL AND OPENAI API.**

## Running the application

### Local deployment

The fastest way to get up and running is to clone this repo and then deploy the application locally.

1. Prerequisites: install Docker and Docker Compose.

   Please see the [Docker Compose official instructions](https://docs.docker.com/compose/install/).

   DigitalOcean (besides being an excellent cloud host) also provides easy-to-follow instructions for installing Docker and Docker Compose on Linux.
   See [How To Install Docker Compose](https://www.digitalocean.com/community/tutorial-collections/how-to-install-docker-compose).

2. Clone the repo:

   ```commandline
   git clone https://github.com/JSv4/Delphic.git delphic
   ```

3. Change into the repository directory:

   ```commandline
   cd delphic
   ```

4. Copy the sample env files to `.envs/.local/` and `frontend/`:

   ```shell
   # in the repository root, i.e. the directory you just cloned
   # which contains this README.md file
   mkdir -p .envs/.local
   cp docs/sample_envs/local/.django .envs/.local
   cp docs/sample_envs/local/.postgres .envs/.local
   cp docs/sample_envs/local/.frontend frontend
   ```

5. Update the sample .env files to set your OpenAI key and optionally the PostgreSQL username and password:
   ```shell
   # .envs/.local/.django
   OPENAI_API_KEY="sk-..."
   ```

   ```shell
   # .envs/.local/.postgres
   POSTGRES_USER=[delphic or any random string, max 31 chars]
   POSTGRES_PASSWORD=[any random string, for compat max 99 chars avoiding special characters]
   ```

6. Build the Docker images:

   ```commandline
   docker-compose --profile fullstack -f local.yml build
   ```

   You may need to run `sudo docker-compose ...` rather than `docker-compose`. Try it without `sudo` first.
   Reviewing the [Docker Engine post-install steps](https://docs.docker.com/engine/install/linux-postinstall/) may also fix the problem.

7. Launch the application:

   ```commandline
   docker-compose --profile fullstack -f local.yml up
   ```

8. Go to http://localhost:3000 to see the frontend.

### Local deployment for development

If you change the backend (Python) code in your repository, Django and Celery will automatically reload the changes.

To modify the frontend (React) code, remove the `--profile=fullstack` flag at step 7 above,
and see the [Development Environment](#development-environment) instructions
to run the frontend in a separate terminal.

If you use the `fullstack` profile for frontend development, frontend changes will require
a manual rebuild/restart of the `frontend` service for every change.

### Production deployment

This assumes you want to make the application available to the internet at some kind of fully qualified domain like delphic.opensource.legal. In order to do this, you need to update a couple configurations.

**TODO - insert documentation**

## Configuring users

### Warning / Disclaimer

At the moment, any user who is logged in will have full permissions.
Anyone with any type of login credentials can create and delete collections.
**Creating collections uses OpenAI credits / costs money.**

We plan to implement the more precise, roles-based access control module we developed for
[OpenContracts](https://github.com/JSv4/OpenContracts).

We plan to allow sharing of specific models with unauthenticated users.

### Set up a Django superuser

The Django superuser has full permissions in the application
and can manage all aspects of the system, including creating, modifying, and deleting users, collections,
and other data. Setting up a superuser allows you to control and manage the application.

1. Run the following command to create a superuser:

   ```shell
   docker-compose -f local.yml run django python manage.py createsuperuser
   ```

2. Enter a username, email address, and password for the superuser as prompted.

### Set up additional users (optional)

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

If you want to contribute to Delphic or roll your own version, set up the development environment.

## Pre-Commit

You need a working Python interpreter in the same environment as `git` to run the
[pre-commit](https://pre-commit.com/) formatting checks.

1. Install `pre-commit` using the [pre-commit installation instructions](https://pre-commit.com/#installation).
You can use your system package manager, `pip` with the system Python interpreter, or `pip` with a virtualenv.

2. In the root of your local repo, run:

   ```
   pre-commit install
   ```

   `pre-commit` will install the dependencies specified in `.pre-commit-config.yaml`.
   You don't need to install Delphic's development requirements in the pre-commit virtualenv.

When you commit changes to your repository, the project's formatting and style checks will run automatically.

## Running Tests

We have a basic test suite in `./tests`. You can run the tests by typing:

```commandline
docker-compose -f local.yml run django python manage.py test
```

## Frontend Setup

On the frontend, we're using node v18.15.0. We assume you're using nvm. We don't have any frontend tests yet (sorry).

1. Prerequisites: [install nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

2. Install frontend dependencies

   ```commandline
   cd frontend
   nvm use
   npm install yarn
   yarn install
   ```

3. Start the development frontend server

    ```shell
    # in the frontend directory where you see package.json
    yarn start
    ```

   The frontend development server is now available at http://localhost:3000.

4. Launch the backend without the `--profile=fullstack` flag.

   ```shell
   # in the repository root where you see this README.md file and local.yml
   docker-compose -f local.yml up
   ```

   This will launch the backend services, but not the `frontend` service.
