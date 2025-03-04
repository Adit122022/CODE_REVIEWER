const mongoose = require('mongoose');

const connect = () => {
    mongoose.connect('mongodb://localhost:27017/KODR_LIVE_PROJECT') 
        .then(() => console.log('🐰🐼🐼MongoDB Connected...✅✅✅ ... 🐼🐼🐰'))
        .catch(err => console.log(err));
}

module.exports = connect;