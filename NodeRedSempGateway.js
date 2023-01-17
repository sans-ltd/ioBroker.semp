const Gateway = require("./lib/semp/Gateway").Gateway;

class NodeRedSempGateway {
	constructor(options) {
        this.uuid = "ae245e42-033e-4f68-b48f-9170fbfbf186"
        this.ipAddress = null
        this.sempPort = 9765
        this.sempName = "NodeRED SEMP Gateway"
        this.sempManufacturer = "NodeRED"

        if (typeof(options) != "undefined")
        {
            if (typeof(options.uuid) != "undefined")
            {
                this.uuid = options.uuid
            }
            else 
            {
                console.warn("SEMP: Please specify an uuid if you have multiple instances of of this module running in your network.")
            }  
            if (typeof(options.ipAddress) != "undefined")
            {
                this.ipAddress = options.ipAddress
            } 
            if (typeof(options.sempPort) != "undefined")
            {
                this.sempPort = options.sempPort
            } 
            if (typeof(options.sempName) != "undefined")
            {
                this.sempName = options.sempName
            }
            if (typeof(options.sempManufacturer) != "undefined")
            {
                this.sempManufacturer = options.sempManufacturer
            }    
        } 

        this.registeredDevices = {};
        this.registeredCallbacks = {};

        this.ioBrokerMockAdaptor = {
            log: {
                trace: function(msg) {console.trace(msg)},
                debug: function(msg) {console.debug(msg)},
                info: function(msg) {console.info(msg)},
                warn: function(msg) {console.warn(msg)},
                error: function(msg) {console.error(msg)}
            },
            config: {
                LogToCSV: false
            },

            _parent: {},
            _callCallback: function(key, value)
            {
                if (typeof(this._parent.registeredCallbacks[key]) != "undefined")
                    this._parent.registeredCallbacks[key](value.val)
            },
            
            subscribeForeignStates: function(key)
            {
                console.log("ioBrokerMockAdaptor.subscribeForeignStates: key: " + key);
            },
            setForeignStateAsync: async function(key, value)
            {
                console.log("ioBrokerMockAdaptor.setForeignStateAsync: key: " + key + " value: " + JSON.stringify(value));
                this._callCallback(key, value)
            },
            getForeignStateAsync: async function(key)
            {
                console.log("ioBrokerMockAdaptor.getForeignStateAsync: key: " + key);
                return null;
            },
            setForeignState: function(key, value)
            {
                console.log("ioBrokerMockAdaptor.setForeignState: key: " + key + " value: " + JSON.stringify(value));
                this._callCallback(key, value)
            },
            getForeignState: async function(key)
            {
                console.log("ioBrokerMockAdaptor.getForeignState: key: " + key);
                return null;
            },
            subscribeStates: function(key)
            {
                console.log("ioBrokerMockAdaptor.subscribeStates: key: " + key);
            },
            setStateAsync: async function(key, value)
            {
                console.log("ioBrokerMockAdaptor.setStateAsync: key: " + key + " value: " + JSON.stringify(value));
                this._callCallback(key, value)
            },
            getStateAsync: async function(key)
            {
                console.log("ioBrokerMockAdaptor.getStateAsync: key: " + key);
                return null;
            },
            setState: function(key, value)
            {
                console.log("ioBrokerMockAdaptor.setState: key: " + key + " value: " + JSON.stringify(value));
                this._callCallback(key, value)
            },
            getState: async function(key)
            {
                console.log("ioBrokerMockAdaptor.getState: key: " + key);
                return null;
            },
            getObjectAsync: async function(key)
            {
                console.log("ioBrokerMockAdaptor.getObjectAsync: key: " + key);
                return null;                
            },
            setObjectNotExistsAsync: async function(key, obj)
            {
                console.log("ioBrokerMockAdaptor.setObjectNotExistsAsync: key: " + key + " obj: " + JSON.stringify(obj));
            }
        }

        this.ioBrokerMockAdaptor._parent = this;
    }

    callCallback(key, value)
    {
        if (typeof(this.registeredCallbacks[key]) != "undefined")
            this.registeredCallbacks[key](value.val)
    }

	findIPv4IPs() {
		// Get all network devices
		const ifaces = require('os').networkInterfaces();
		var net_devs = [];

		for (var dev in ifaces) {
			if (ifaces.hasOwnProperty(dev)) {
				
				// Read IPv4 address properties of each device by filtering for the IPv4 external interfaces
				ifaces[dev].forEach(details => {
					if (!details.internal && details.family === 'IPv4') {
						net_devs.push({name: dev, ipaddr: details.address});
					}
				});
			}
		}
		return net_devs;
	}

    async start() {
        if (this.ipAddress == null)
        {
            let ips = this.findIPv4IPs();
            console.log("Found IPs: ", ips);
            if (ips.length > 1)
            {
                console.warn("SEMP: found more than one IP address. Taking the first ethernet device.");
                for (const ip of ips) {
                    if (ip.name.indexOf("en") === 0 || ip.name.indexOf("eth") === 0)
                    {
                        this.ipAddress = ip.ipaddr
                        console.log("SEMP: Using " + this.ipAddress + " from device " + ip.name)
                        break
                    }
                }
            }    
        }
        else
        {
            console.log("SEMP: Using configured " + this.ipAddress)
        }

        this.gw = new Gateway(this.ioBrokerMockAdaptor, 
                              this.uuid, this.ipAddress, this.sempPort, this.sempName, this.sempManufacturer);
        if (this.gw != null) {
            await this.gw.start();
            console.debug("Started all!");
        }
    }

    addDevice(device, periods)
    {
/* 
Device.js IO Broker admin interface

DeviceIsActive						devices[id].IsActive
DeviceID 							devices[id].ID
DeviceVendor						devices[id].Vendor
DeviceName							devices[id].Name
DeviceType							devices[id].Type
      <xs:enumeration value="AirConditioning"/>
      <xs:enumeration value="Charger"/>
      <xs:enumeration value="DishWasher"/>
      <xs:enumeration value="Dryer"/>
      <xs:enumeration value="ElectricVehicle"/>
      <xs:enumeration value="EVCharger"/>
      <xs:enumeration value="Freezer"/>
      <xs:enumeration value="Fridge"/>
      <xs:enumeration value="Heater"/>
      <xs:enumeration value="HeatPump"/>
      <xs:enumeration value="Motor"/>
      <xs:enumeration value="Pump"/>
      <xs:enumeration value="WashingMachine"/>
      <xs:enumeration value="Other"/>
DeviceSerialnumber					devices[id].SerialNr
DeviceMaxPower						devices[id].MaxPower
DeviceMinPower						devices[id].MinPower
DeviceInterruptionAllowed			devices[id].InterruptionsAllowed
DeviceMinOnTime						devices[id].MinOnTime
DeviceMaxOnTime						devices[id].MaxOnTime
DeviceMinOffTime					devices[id].MinOffTime
DeviceMaxOffTime					devices[id].MaxOffTime
DeviceMeasurementMethod				devices[id].MeasurementMethod
      <xs:enumeration value="Measurement"/>
      <xs:enumeration value="Estimation"/>
      <xs:enumeration value="None"/>
DeviceOIDPower						devices[id].OID_Power   ioBroker Property ID for measured power (subscribed only when MeasurementMethod == "Measurement")
DeviceStatusDetectionType			devices[id].StatusDetection
        <option value="SeparateOID" class="translate">SeparateOID</option>  --> OID_Status is used
        <option value="FromPowerValue" class="translate">FromPowerValue</option>  --> Determine state from power value
        <option value="AlwaysOn" class="translate">AlwaysOn</option> 
DeviceOIDStatus						devices[id].OID_Status  ioBroker Property ID On or Off, represents the current state of the device
DeviceHasOIDSwitch					devices[id].HasOIDSwitch
DeviceOIDSwitch						devices[id].OID_Switch  ioBroker Property ID the outgoing new state, as set by the Energy Manager
DeviceTimerActive					devices[id].TimerActive
DeviceMeasurementUnit				devices[id].MeasurementUnit default assumption: W 


DeviceStatusDetectionLimit          devices[id].StatusDetectionLimit
DeviceStatusDetectionLimitTimeOn    devices[id].StatusDetectionLimitTimeOn
DeviceStatusDetectionLimitTimeOff   devices[id].StatusDetectionLimitTimeOff
DeviceStatusDetectionMinRunTime     devices[id].StatusDetectionMinRunTime

DeviceSwitchOffAtEndOfTimer         devices[id].SwitchOffAtEndOfTimer

//cancel request: see issue #14
DeviceTimerCancelIfNotOn            devices[id].TimerCancelIfNotOn
DeviceTimerCancelIfNotOnTime        devices[id].TimerCancelIfNotOnTime

*/
        let statusDetectionMethods = {
            FromOnOffStatus: "SeparateOID",
            FromPowerValue: "FromPowerValue",
            AlwaysOn: "AlwaysOn"
        }

        if (typeof(statusDetectionMethods[device.statusDetection]) === "undefined")
        {
            console.warn("SEMP: addDevice: device.statusDetection '" + device.statusDetection + "' is not supported. Supported are " + JSON.stringify(Object.keys(statusDetectionMethods)));
            return
        }

        this.gw.addDevice({
            ID:                   device.id,
            Name:                 device.name,
            Type:                 device.type,
            SerialNr:             device.serial,
            Vendor:               device.vendor,
            MaxPower:             device.maxPowerConsumption_W,
            MinPower:             device.minPowerConsumption_W,
            InterruptionsAllowed: device.interruptionsAllowed,
            MeasurementMethod:    device.measurementMethod,
            StatusDetection:      statusDetectionMethods[device.statusDetection],
            HasOIDSwitch:         device.isSwitchable,
            TimerActive:          typeof(periods) !== "undefined",
            OID_Power:            "not_used",   // statte property identifier of ioBroker 
            OID_Status:           "not_used",   // statte property identifier of ioBroker
            EnergyRequestPeriods: periods 
        });

        this.registeredDevices[device.id] = device;
        return device.id;
    }

/*
    //energy request list
table EnergyRequestPeriods          devices[id].EnergyRequestPeriods
    -> ID
    -> Days
    -> EarliestStartTime
    -> LatestEndTime
    -> MinRunTime
    -> MaxRunTime
*/
    
    secondsToTime(seconds)
    {
        let mins = Math.floor(seconds / 60)
        let hours = Math.floor(mins / 60)
        return hours + ":" + (mins % 60) 
    }

    addPlanningRequest(deviceID, periods)
    {
        if (typeof(this.registeredDevices[deviceID]) === "undefined") 
        {
            console.warn("SEMP: addPlanningRequest: Device " + deviceID + " does not exist!")
            return
        }

        if (typeof(periods.length) === "undefined")
        {
            // only one period was given directly, not as array.
            periods = [periods]
        }

        let energyRequestPeriods = []
        for (const period of periods)
        {
            if (typeof(period.earliestStartTime) === "undefined" && typeof(period.earliestStartIn_s !== "undefined"))
                period.earliestStartTime = this.secondsToTime(period.earliestStartIn_s) 
            if (typeof(period.latestEndTime) === "undefined" && typeof(period.latestEndIn_s !== "undefined"))
                period.latestEndTime = this.secondsToTime(period.latestEndIn_s) 
            if (typeof(period.minRunTime) === "undefined" && typeof(period.minRunDuration_s !== "undefined"))
                period.minRunTime = this.secondsToTime(period.minRunDuration_s) 
            if (typeof(period.maxRunTime) === "undefined" && typeof(period.maxRunDuration_s !== "undefined"))
                period.maxRunTime = this.secondsToTime(period.maxRunDuration_s) 
            
            if (typeof(period.earliestStartTime) === "undefined")
            {
                console.warn("SEMP: addPlanningRequest: Device " + deviceID + " Either earliestStartTime or earliestStartIn_s has to be given in periods object/array of objects")
                return
            }
            if (typeof(period.latestEndTime) === "undefined")
            {
                console.warn("SEMP: addPlanningRequest: Device " + deviceID + " Either latestEndTime or latestEndIn_s has to be given in periods object/array of objects")
                return
            }
            if (typeof(period.minRunTime) === "undefined")
            {
                console.warn("SEMP: addPlanningRequest: Device " + deviceID + " Either minRunTime or minRunDuration_s has to be given in periods object/array of objects")
                return
            }
            if (typeof(period.maxRunTime) === "undefined")
            {
                console.warn("SEMP: addPlanningRequest: Device " + deviceID + " Either maxRunTime or maxRunDuration_s has to be given in periods object/array of objects")
                return
            }

            energyRequestPeriods.push({
                ID: deviceID,
                EarliestStartTime: period.earliestStartTime,
                LatestEndTime:     period.latestEndTime,
                MinRunTime:        period.minRunTime,
                MaxRunTime:        period.maxRunTime,
                Days:              "everyDay"
            })
        }

        this.gw.deleteDevice(deviceID)
        this.addDevice(this.registeredDevices[deviceID], energyRequestPeriods)
    }

    setCallback(deviceID, eventName, callback)
    {
        let knownEvents = {
            RecommendedOnOffStatus: "RecommendedState",
            CurrentState: "State"
        }

        if (typeof(this.registeredDevices[deviceID]) === "undefined") 
        {
            console.warn("SEMP: addCallback: Device " + deviceID + " does not exist!")
            return
        }

        if (typeof(knownEvents[eventName]) === "undefined") 
        {
            console.warn("SEMP: addCallback: eventName '" + eventName + "' is not defined. Please use " + JSON.stringify(Object.keys(knownEvents)))
            return
        }

        let callbackID = "Devices." + this.registeredDevices[deviceID].name + "." + knownEvents[eventName]
        this.registeredCallbacks[callbackID] = callback
    }

    setPower_W(deviceID, power_W)
    {
        if (typeof(this.registeredDevices[deviceID]) === "undefined") 
        {
            console.warn("SEMP: setPower_W: Device " + deviceID + " does not exist!")
            return
        }
        this.gw.setPowerDevice(deviceID, power_W)
    }

    setOnOffStatus(deviceID, status)
    {
        if (typeof(this.registeredDevices[deviceID]) === "undefined") 
        {
            console.warn("SEMP: setOnOffStatus: Device " + deviceID + " does not exist!")
            return
        }
        this.gw.setOnOffDevice(deviceID, status)
    }
}

var instance = null

module.exports = {
    init: function(options)
    {
        if (instance !== null)
        {
            console.warn("SEMP: already initialized.");
            return;
        }
        instance = new NodeRedSempGateway(options);
        instance.start();
    },
    addDevice: function(device)
    {
        if (instance === null)
        {
            console.warn("SEMP: addDevice: NOT initialized.");
            return;
        }
        return instance.addDevice(device);
    },
    addPlanningRequest: function(deviceID, periods)
    {
        if (instance === null)
        {
            console.warn("SEMP: addEnergyRequest: NOT initialized.");
            return;
        }
        instance.addPlanningRequest(deviceID, periods);
    },
    setCallback: function(deviceID, eventName, callback)
    {
        if (instance === null)
        {
            console.warn("SEMP: addCallback: NOT initialized.");
            return;
        }
        instance.setCallback(deviceID, eventName, callback);
    },
    setPower_W: function(deviceID, power_W)
    {
        if (instance === null)
        {
            console.warn("SEMP: setPower_W: NOT initialized.");
            return;
        }
        instance.setPower_W(deviceID, power_W);
    },
    setOnOffStatus: function(deviceID, status)
    {
        if (instance === null)
        {
            console.warn("SEMP: setOnOffStatus: NOT initialized.");
            return;
        }
        instance.setOnOffStatus(deviceID, status);
    }
}
