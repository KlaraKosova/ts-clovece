# Člověče, nezlob se

Multiplayer board game "Člověče, nezlob se" using Websockets and MongoDB.

## Run
### Run FE (development)
```
path/to/cloned/repository> cd fe

path/to/cloned/repository/fe> cp .env.example .env
# (optionally) edit .env
path/to/cloned/repository/fe> npm install
path/to/cloned/repository/fe> npm run dev
```

### Run BE (development)
```
path/to/cloned/repository> cd be

path/to/cloned/repository/be> cp .env.example .env
# (optionally) edit .env
path/to/cloned/repository/be> npm install
path/to/cloned/repository/be> npm run dev
```

## Issues / bugs

- Didn't manage to use [Slim Select](https://slimselectjs.com/) via npm, used CDN instead
- Comments in `.env` are not ignored and are loaded as part of the value. **TODO: use other configuration option** (JSON/js/...)
- Unicode flag characters not displaying correctly in some browsers on some platforms

  - Incorrect: Chrome 114.0.5735.134, Windows 10

    ![Incorrect](/docs/icons_chrome.PNG)

  - Correct: Firefox 114.0.1, Windows 10
  
    ![Correct](/docs/icons_firefox.PNG)
- Ovelaying fields/figures caused by creating some figures before certain fields

    ![Wrong layers](/docs/layers_bug.PNG)