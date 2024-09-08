const authRoutes = require('../routes/auth.routes');
const userRoutes = require('../routes/user.routes');
const bookRoutes = require('../routes/book.routes');
const commentRoutes = require('../routes/comment.routes');
const paymentRoutes = require('../routes/payment.routes');


module.exports = function(app){
    app.use('/api/auth', authRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/book', bookRoutes);
    app.use('/api/comment', commentRoutes);
    app.use('/api/payment', paymentRoutes);
}