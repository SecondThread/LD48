import express from 'express';
import addPlayerToRoom from './backendCalls/addPlayerToRoom';
import createPrivateRoom from './backendCalls/createPrivateRoom';
import getRoomInfo from './backendCalls/getRoomInfo';
import joinPublicRoom from './backendCalls/joinPublicRoom';
import updatePlayerLocation from './backendCalls/updatePlayerLocation';
import killPlayer from './backendCalls/killPlayer';

const router=express.Router();

router.post('/addPlayerToRoom', addPlayerToRoom);
router.post('/createPrivateRoom', createPrivateRoom);
router.post('/getRoomInfo', getRoomInfo);
router.post('/joinPublicRoom', joinPublicRoom);
router.post('/updatePlayerLocation', updatePlayerLocation);
router.post('/killPlayer', killPlayer);

export default router;