import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as RandomColor from 'randomcolor';
import {
  allowAll,
  generateCookie,
  getAvailablePosition,
  getNextPosition,
  getUserById,
  IPosition,
  isPlayerEatCookie,
  IUser,
  makeMovementDelayIfNeeded
} from './helpers';

// Init Firebase Admin app.
admin.initializeApp();

/**
 * Create user request.
 */
export const onUserCreate = functions.https.onRequest((request, response) => {
  allowAll(request, response);
  if (request.method === `OPTIONS`) {
    return;
  }

  // Prepare User's data.
  getAvailablePosition()
    .then((position: IPosition) => {
      const data = Object.assign({name: request.body.name, color: RandomColor({luminosity: 'dark'}), score: 0}, position);

      // Create user - push it to Database.
      const userRef = admin.database().ref('/users').push();
      return userRef.set(data)
        .then(() => {
          // Output response for Client.
          response.send({id: userRef.key, name: data.name, color: data.color});
        });
    })
    .catch(err => response.status(500).send(err));
});

/**
 * Make movement, player's action.
 */
export const onMoveAction = functions.https.onRequest((request, response) => {
  allowAll(request, response);
  if (request.method === `OPTIONS`) {
    return;
  }

  const userId = request.body.userId;
  const direction = request.body.direction;

  getUserById(userId)
    .then((user: IUser) => makeMovementDelayIfNeeded(userId, user, direction))
    .then((user: IUser) => {
      const position = getNextPosition(user, direction);
      Object.assign(user, position);
      return isPlayerEatCookie(user);
    })
    .then((user: IUser) => admin.database().ref('/users/' + userId).update(user))
    .then(() => response.status(200).send({status: true}))
    .catch(err => {
      if (err.message === 'user_not_found') {
        return response.status(500).send({code: 'user_not_found'});
      } else {
        return response.status(500).send(err.message);
      }
    });
});

/**
 * Start the game.
 */
export const onStart = functions.https.onRequest((request, response) => {
  allowAll(request, response);
  if (request.method === `OPTIONS`) {
    return;
  }

  generateCookie()
    .then(() => response.status(200).send({status: 'ok'}))
    .catch(err => response.status(500).send(err.message));
});
