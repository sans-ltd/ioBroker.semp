sma = require("./NodeRedSempGateway.js");

sma.init({ipAddress: "127.0.0.1"});
var deviceID = sma.addDevice({
    id: "F-11223344-DEADBEEF0011-00",
    name: "Boiler Waschküche EG",
    type: "Heater",
    serial: "1234",
    vendor: "SANS LIMITED",
    maxPowerConsumption_W: 2000,
    minPowerConsumption_W: 0,
    interruptionsAllowed: true,
    measurementMethod: "Measurement",
    statusDetection: "FromOnOffStatus",
    isSwitcheable: true  // device can be controlled by the SEMP Energy Manager
})

sma.setPlanningRequest(deviceID, [{
    earliestStartTime: "12:00", 
    latestEndTime: "15:00",
    minRunTime: "1:20:05",
    maxRunTime: "2:10" 
}, {
    earliestStartTime: "18:00", 
    latestEndTime: "20:00",
    minRunTime: "0:30",
    maxRunTime: "0:40" 
}])

/*
sma.setPlanningRequest(deviceID, {
    earliestStartIn_s: 4800, 
    latestEndIn_s: 7800,
    minRunDuration_s: 100,
    maxRunDuration_s: 200 
})
*/

sma.setCallback(deviceID, "CurrentState", function(value) {
    console.warn("CurrentState Callback: " + value)
})

sma.setCallback(deviceID, "RecommendedOnOffStatus", function(value) {
    console.warn("RecommendedOnOffStatus Callback: " + value)
})

sma.setPower_W(deviceID, 1999)
sma.setOnOffStatus(deviceID, true)