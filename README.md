# Realtime todo list

# Project structure

```
├── package.json                # package
├── .gitignore                  # File to be ignored.
├── README.md                   # Documentation.
├── assets                      # (CSS, JS, IMG).
├── server.js                   # Node js server file.
├── /views                      # *.ejs file
```

# Default server port ```3000```

# How to install ?
```
# Install dependencies
npm install

# Run server 
npm run serve
```

An user can :

* When a client access the public route he gets the latest todo in the array storage.
* Client can create a new todo
* Client can remove a todo

# Public route 
| path
| ---
| /

# Api Route
| path | param | return
| --- | --- | ---
| /todo/all | null | [{id: id, message: message}]
| /todo/add | message | {id: id, message: message}
| /todo/delete | id | {id: id}

* Each route return error or success if the request failed or not.
