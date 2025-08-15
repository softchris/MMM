# Testing server

## Create virtual env

```sh
python -m venv venv
source ./venv/bin/activate
```

## install

```sh
pip install openai pytest "mcp[cli]" flask flask_cors
```

## run

```sh
python api.py
```

This starts the API, 

NOTE: Make the port public as well if on GitHub Codespaces.

## run tests

```sh
pytest
```

