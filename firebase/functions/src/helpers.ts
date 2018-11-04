import * as random from 'random';
import * as admin from 'firebase-admin';
import {IDirection, IPosition, IUser} from './types';


/**
 * Set map size, config.
 */
const maxX = 16 - 1;
const maxY = 12 - 1;

/**
 * Helper-functions bellow.
 */

export function allowAll(request, response) {
  response.set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Methods', '*')
    .set('Access-Control-Allow-Headers', '*');

  if (request.method === `OPTIONS`) {
    response.status(200).send('ok');
    return;
  }
}

export function getAvailablePosition(): Promise<IPosition> {
  let availablePositionFound = false;
  const position: IPosition = {x: 0, y: 0};

  return admin.database().ref('/users').once('value')
    .then((snapshot) => {
      const usersById = snapshot.val();
      const users = Object.keys(usersById).map(key => usersById[key]);

      let counter = 0;

      while (!availablePositionFound) {
        counter++;
        const newPosition: IPosition = getRandomPosition();
        const isPositionAvailable: boolean = !users.find(user => user.x === newPosition.x && user.y === newPosition.y);

        if (isPositionAvailable) {
          availablePositionFound = true;
          Object.assign(position, newPosition);
        }

        console.log('try', counter, newPosition, new Date().getTime());
      }

      return position;
    });
}

function getRandomPosition(): IPosition {
  return {x: random.int(0, maxX), y: random.int(0, maxY)};
}

export function getUserById(userId: string): Promise<IUser> {
  return admin.database().ref('users/' + userId).once('value')
    .then((snapshot) => {
      const user = snapshot.val();

      if (!user) {
        throw new Error('user_not_found');
      }

      return user;
    });
}

export function getNextPosition(user: IUser, direction: IDirection): IPosition {
  const position: IPosition = {x: user.x, y: user.y};

  switch (direction) {
    case IDirection.UP:
      position.y = getNextStep(position.y, -1, position.y <= 0, maxY);
      break;
    case IDirection.DOWN:
      position.y = getNextStep(position.y, 1, position.y >= maxY, 0);
      break;
    case IDirection.LEFT:
      position.x = getNextStep(position.x, -1, position.x <= 0, maxX);
      break;
    case IDirection.RIGHT:
      position.x = getNextStep(position.x, 1, position.x >= maxX, 0);
      break;
    default:
      throw new Error('No direction detected.');
  }

  return position;
}

export function makeMovementDelayIfNeeded(userId: string, user: IUser, direction: IDirection): Promise<IUser> {
  const position: IPosition = {x: user.x, y: user.y};
  let moveOutOfTheMap = false;

  switch (direction) {
    case IDirection.UP:
      moveOutOfTheMap = position.y <= 0;
      break;
    case IDirection.DOWN:
      moveOutOfTheMap = position.y >= maxY;
      break;
    case IDirection.LEFT:
      moveOutOfTheMap = position.x <= 0;
      break;
    case IDirection.RIGHT:
      moveOutOfTheMap = position.x >= maxX;
      break;
    default:
      throw new Error('No direction detected.');
  }

  return Promise.resolve()
    .then(() => {
      if (moveOutOfTheMap) {
        return admin.database().ref('users/' + userId).update({x: -1, y: -1})
          .then(() => new Promise((resolve) => setTimeout(resolve, 500))); // delay effect.
      }

      return null;
    })
    .then(() => user);
}

function getNextStep(position: number, step: number, isCase: boolean, value: number) {
  if (isCase) {
    position = value;
  } else {
    position = position + step;
  }

  return position;
}

export function isPlayerEatCookie(user: IUser): Promise<IUser> {
  return admin.database().ref('cookie').once('value')
    .then((snapshot) => {
      const cookie = snapshot.val();
      if (!cookie) {
        return true;
      }

      if (user.x === cookie.x && user.y === cookie.y) {
        user.score = user.score + 1;
        setTimeout(generateCookie, 10); // async function;
      }

      return true;
    })
    .then(() => user);
}

export function generateCookie() {
  return admin.database().ref('cookie').set({x: -1, y: -1}) // Hide the cookie from the map.
    .then(() => new Promise((resolve) => setTimeout(resolve, 250))) // delay effect.
    .then(() => getAvailablePosition())
    .then((position: IPosition) => admin.database().ref('cookie').set(position));
}
