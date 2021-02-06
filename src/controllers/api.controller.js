const scheduleTDT = require('../services/schedule-tdt')


module.exports.getTimeTable = (req, res) => {
    var data = req.query;
    scheduleTDT.scheduleAPI(data)
        .then((schedule) => {
            res.json(schedule);
        })
        .catch(() => console.log('Wrong info!'));
}