# project

this is two parts, a frontend, and a backend

- frontend, start with:

    ```sh
    cd web
    npx http-server -p 7000
    ```

    Change `BASE_URL` to fit the chosen backend URL, for example `http://localhost:5000`.

- backend, start with

    ```sh
    cd python
    python api.py
    ```

    Should start on port 5000 by default. If in Codespaces, you need to make the backend port **public**. 
    