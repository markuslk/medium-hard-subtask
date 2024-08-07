# Medium & Hard subtask

### Things you need

-   node.js
-   npm
-   access to mongodb database(connection string) - you can use free version of MongoDB Atlas - https://www.mongodb.com/products/platform/atlas-database
-   code editor

### Testing task

-   Clone this repo
-   Open repo in code editor or terminal
-   cd to server folder


    Install dependencies

    ```
    npm i
    ```

    ##### change .env.example file name to .env and provide your database connection string and auth_secret(for testing you can use a random string value)in the .env file

    Start server

    ```
    npm run dev
    ```

-  open another terminal (don't close the first one)
-  cd to client folder


Install dependencies

    ```
    npm i
    ```


  ##### Start client dev server


    ```
    npm run dev
    ```


Now you can open http://localhost:5173 (localhost on port 5173 is default when using vite)

- You will be redirected to /register page you need to create an account before you can sign in(username must use only uselowercase letters).
- You need at least two accounts to use chat app (open another browser on same url and create another account)
- Log in to both of your accounts on two different browsers with your username and password
- After successful login you should see other users who have create an account - Icon in front of the username will display "online" and "offline" status.
- Clicking on another user opens chat window, type to input and press send to send a message to other user(if other user has same chat open at the same time they will see message appear instantly)


