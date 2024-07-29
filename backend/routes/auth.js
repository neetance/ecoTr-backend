import { Router } from 'express';
const router = Router();
import { registerUser, loginUser, updateUser, deleteUser, getAllUsers, additionalInfo, authenticateUser, forgotPassword, getUser, allotCoins } from '../controllers/UserController.js';

router.post('/register', registerUser)
router.post('/login', loginUser)
router.patch('/update', authenticateUser, updateUser)
router.delete('/delete', authenticateUser, deleteUser)
router.get('/users', getAllUsers)
router.post('/additionalInfo', additionalInfo)
router.post('/forgotPass', forgotPassword)
router.get('/getUser', authenticateUser, getUser)
router.post('/coins', allotCoins)

export default router
