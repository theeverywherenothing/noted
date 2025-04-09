To run the application, follow these steps:

### Frontend (React App)

1.  **Navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

2.  **Install dependencies:**

    *   **Windows:**

        ```bash
        npm install
        ```

    *   **Linux/macOS:**

        ```bash
        npm install
        ```

3.  **Start the development server:**

    *   **Windows:**

        ```bash
        npm run dev
        ```

    *   **Linux/macOS:**

        ```bash
        npm run dev
        ```

    This will typically start the frontend on `http://localhost:5173`.

### Worker (Cloudflare Worker)

1.  **Navigate to the worker directory:**

    ```bash
    cd worker
    ```

2.  **Install dependencies:**

    *   **Windows:**

        ```bash
        npm install
        ```

    *   **Linux/macOS:**

        ```bash
        npm install
        ```

3.  **Initialize and migrate the D1 database (in development):**

    *   **Windows:**

        ```bash
        npx wrangler d1 execute noted -e development
        ```

    *   **Linux/macOS:**

        ```bash
        npx wrangler d1 execute noted -e development
        ```

4.  **Start the worker in development mode:**

    *   **Windows:**

        ```bash
        wrangler dev -e development
        ```

    *   **Linux/macOS:**

        ```bash
        wrangler dev -e development
        ```

This will start the Cloudflare Worker in development mode, allowing you to test it locally.

### Accessing the Application

Once both the frontend and worker are running, you can access the application in your browser at `http://localhost:5173`.

