# HOUND
Application to help Cloud operations team

## Prerequisites

1. Python 3.7.9
2. PostgreSQL


## Setup

1. The first thing to do is to clone the repository:

```sh
$ git clone https://github.wdf.sap.corp/S4CD-Test/HOUND.git
$ cd HOUND
```

2. Create a virtual environment to install dependencies in and activate it:

```sh
$ virtualenv env
$ env\Scripts\activate
$ set APPENV=local
$ python manage.py runserver
```

3. Install the dependencies:

```sh
(env)$ pip install -r requirements.txt
```

4. Apply the migrations to the database:
```sh
(env)$ python manage.py migrate
```

5. Add the below environment variables to the **activate** file inside the **env\Scripts**:
```
APPENV="local" (it changes based on the environment)
TEAM_ID="S4"
```

6. Run the server:
```sh
(env)$ python manage.py runserver
```
And navigate to `http://127.0.0.1:8000/`, you can see the HOUND Login.
