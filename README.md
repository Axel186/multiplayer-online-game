# Simple multiplayer game

This project was created for learning purpose and was presented in meetups.

[![Demo](./demo.gif)](Demo)

## Demo
You have to use 2 apps - Map & Controller.
You can see your player on the "Map" once you login by using "Controller" app.
* Map: https://game-map.romanaxelrod.com
* Controller: https://game-ctrl.romanaxelrod.com


## Tutorial (Hebrew language)
Part 01 - https://www.youtube.com/watch?v=BnUMBJFKaoM

Part 02 - https://www.youtube.com/watch?v=Wd_WlIWMd3k

## Build

1. Before you start, make sure to copy and edit the `config.default.ts` file to `config.ts`.

2. Go to firebase directory, configure and deploy `Cloud functions`. (Make sure you have firebase cli tool).

3. Run:
```
npm install
```

4. Go to `./firebase/functions` and run:
```
npm install
```

5. Get back to firebase folder `cd ../`, and deploy the Cloud Functions `firebase deploy`.


### Controller app
```
ng serve --project controller
```

### Map app
```
ng serve --project map --port 4201
```

-------------

Enjoy and feel free to ask me any questions!
