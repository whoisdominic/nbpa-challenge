# NBPA challenge

To run the demo you can use the following command:

In separate terminals run the following commands to start the server and the web app

```bash
# Run the server
npx nx run nbpa-demo-server:serve --configuration=production

# Run the web app
npx nx run nbpa-demo:preview
```

You can then access the demo server at [http://localhost:3000/api](http://localhost:3000/api)
Along with the web app at [http://localhost:4300/](http://localhost:4300/)

**DOCS ARE AVAILABLE AT [http://localhost:3000/docs](http://localhost:3000/docs) You can use the Swagger UI to test the API**

## About the implementation

This is an NX monorepo with a NestJS server and a React web app.

The server is using a SQLite database, I chose this because it's a lightweight database that doesn't require a server and is easy to setup.

The web app uses regular React since it's a simple app with no complex requirements.
