# Delphic

![](./docs/images/Delphic Header.png)

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

*If you want to actively develop the frontend, we suggest you **NOT** use the `--profile=fullstack` flag as every change will require a full container rebuild. Instead, instead of step #5 above,

5. First, launch the backend without the fullstack flag:

```commandline
sudo docker-compose -f local.yml up
```

6. In one terminal window, launch your backend:

```commandline
sudo docker-compose -f local.yml up
```

7. Now, in a separate terminal, cd into the frontend directory and start a development server (**Note, we assume you have nvm installed. If you don't install it now**):

```commandline
cd frontend
nvm use
npm install yarn
yarn install
yarn run start
```

Go to `localhost:3000` to see the frontend.

### Production Deploy

This assumes you want to make the application available to the internet at some kind of fully qualified domain like delphic.opensource.legal. In order to do this, you need to update a couple configurations.

**TODO - insert documentation**

### Development

If you want to contribute to Delphic or roll your own version, you'll want to ensure you setup the development environment.

#### Backend Setup

On the backend, you'll need to have a working python environment to run the pre-commit formatting checks. You can use
your system python interpreter, but we recommend using pyenv and creating a virtual env based off of Python>=3.10.

##### Pre-Commit Setup

Then, in the root of your local repo, run these commands:

```
pip install -r ./requirements/local.txt
pre-commit install
```

Now, when you stage your commits, ou ar code formatting and style checks will run automatically.

##### Running Tests

We have a basic test suite in `./tests`. You can run the tests by typing:

```commandline
sudo docker-compose -f local.yml run django python manage.py test
```

#### Frontend Setup

On the frontend, we're using node v18.15.0. We assume you're using nvm. We don't have any frontend tests yet (sorry).
You'll use want to cd into the frontend directory (`cd frontend`) and type `nvm use` to activate the appropriate node
version. Then you can type `yarn install` and finally `yarn run start` to get started.

## Using the Application

### Warning / Disclaimer

At the moment, any user who is logged in will have full permissions. We plan to implement the more precise, roles-based access control module we developed for [OpenContracts](https://github.com/JSv4/OpenContracts), but, for now
be aware that anyone with any type of login credentials can create and delete collections. **Creating collections uses OpenAI credits / costs money**.

If you want to create a super user, you can follow the typical django command (from the repo root in your local filesystem):

```commandline
sudo docker-compose -f local.yml run django python manage.py createsuperuser
```

Once you have a super user, you can sign-in at `http://localhost:8000/admin`, and, from there, you can create additional users. If you make someone a superuser, they can create new users, delete users and basically do anything they want. See Django's user admin guide [here]().


### Interacting with a Collection

**WARNING - If you're using OpenAI as your LLM engine, any Collection interaction will use API credits / cost money. If you're using your own OpenAI API key, you've also accepted their terms of service which may not be suitable for your use-case. Please do your own diligence.**

https://user-images.githubusercontent.com/5049984/233236432-aa4980b6-a510-42f3-887a-81485c9644e6.mp4

### Creating a Collection

**TODO - add gif**
