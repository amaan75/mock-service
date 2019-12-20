




const randomInt = function (max) {
    return Math.floor(Math.random() * Math.floor(max));
};

const isFail = (failRate) => {
    return failRate > randomInt(10);
}
const sleep = (millis) => {
    return new Promise(resolve => setTimeout(resolve, millis));
}
const controller = (express, config = []) => {
    config = JSON.parse(config);
    config.forEach((routeConfig, index, arr) => {
        express[routeConfig.method.toLowerCase()](routeConfig.path, function (req, res, next) {

            // res.status(200).send("Welcome to our restful API");
            let responseArray = [];
            let responseCode = 200;
            if (isFail(routeConfig.failRate || 1)) {
                console.log("failed")
                responseArray = routeConfig.failureResponse || [{ "status": "failed" }];
                responseCode = routeConfig.failCode || 500;
            } else {
                responseArray = routeConfig.successResponse || [{ "status": "success" }];
                responseCode = routeConfig.successCode || 200;
            }

            const responseIndexToSend = randomInt(responseArray.length);
            // console.log(responseArray);

            const responseToSend = routeConfig.bulk ? responseArray : responseArray[responseIndexToSend] || { "status": "failed", "data": "check config" };
            console.log("sending response ", responseToSend)
            const responseTimeIndex = randomInt(routeConfig.responseTimes.length);
            // console.log("response time index", responseTimeIndex)
            const sleepTime = routeConfig.responseTimes[responseTimeIndex] || 0;
            console.log("resposne delay time", sleepTime)

            sleep(sleepTime).then(() => res.status(responseCode).send(responseToSend));
        });


    })



}
//DEBUG=mock-ser:* npm start                   





module.exports = controller;
