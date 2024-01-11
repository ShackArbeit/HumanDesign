const express = require('express');
const app = express();
const connectToDB = require('../Databse/ConnectToMongoDB');
const NoAuthModel = require('../Model/ForNoAuth');

const AuthsessionMiddleware = require('../Databse/NoAuthSession');

app.use(AuthsessionMiddleware);

const router = require('express').Router();

router.delete('/noAuthDelete/:bookingIdToDelete', async (req, res) => {
    try {
        await connectToDB();
        const bookingId = req.params.bookingIdToDelete;
        if (!bookingId ) {
            return res.status(400).json({ success: false, message: 'Invalid ID provided for deletion' });
          }
        const result = await NoAuthModel.deleteOne({ _id: bookingId });
        if (result.deletedCount === 1) {
            return res.json({ success: true, message: 'Booking deleted successfully' });
          } else {
            return res.status(404).json({ success: false, message: 'Booking not found' });
          }
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
module.exports = router;
