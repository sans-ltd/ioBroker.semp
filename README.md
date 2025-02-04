![Logo](admin/semp.png)
# ioBroker.semp

![Number of Installations](http://iobroker.live/badges/semp-installed.svg) ![Number of Installations](http://iobroker.live/badges/semp-stable.svg)
[![Downloads](https://img.shields.io/npm/dm/iobroker.semp.svg)](https://www.npmjs.com/package/iobroker.semp)
[![NPM version](http://img.shields.io/npm/v/iobroker.semp.svg)](https://www.npmjs.com/package/iobroker.semp)

[![Known Vulnerabilities](https://snyk.io/test/github/rg-engineering/ioBroker.semp/badge.svg)](https://snyk.io/test/github/rg-engineering/ioBroker.semp)
![GitHub Actions](https://github.com/rg-engineering/ioBroker.semp/workflows/Test%20and%20Release/badge.svg)

[![NPM](https://nodei.co/npm/iobroker.semp.png?downloads=true)](https://nodei.co/npm/iobroker.sempt/)


**This adapter uses Sentry libraries to automatically report exceptions and code errors to the developers.** 
For more details and for information how to disable the error reporting see [Sentry-Plugin Documentation](https://github.com/ioBroker/plugin-sentry#plugin-sentry)! Sentry reporting is used starting with js-controller 3.0.

**If you like it, please consider a donation:**
                                                                          
[![paypal](https://www.paypalobjects.com/en_US/DK/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YBAZTEBT9SYC2&source=url) 


## SMA SEMP adapter for ioBroker

Interface to SMA SunnyPortal via SunnyHomeManager and SEMP

Add your devices from ioBroker in SunnyPortal. 
SunnyPortal can then better estimate your energy consumption and thus make better predictions and recommendations. But 
you can also have your devices controlled by SunnyPortal. If there is enough solar energy, the SunnyPortal can switch your 
devices on or, if there is not enough solar energy, switch them off again. In this way you optimize your own consumption, 
but you are not dependent on the few devices supported in SunnyPortal. With the adapter, any device from the ioBroker can 
be integrated into the SunnyPortal.
It is not even necessary for the consumption of a single device to be measured. Even estimated values are sufficient.


## user documentation

see [docu](docu/docu_en.md)

For details about protocol and usage check [SMA docu](docu/SMA/SEMP-11ZE3315-Specification-1.0.6.pdf).

An description about general usage of energy requests see [SMA docu](docu/SMA/SSH_KANN-Zeitfenster-TI-de-10.pdf). (german only)

## Features
* add devices from ioBroker in SunnyPortal via SMA SEMP
* informs the SunnyPortal about the current consumption
* let SunnyPortal control these devices (switch on when there is enough PV power and switch off when there is not enough solar energy)

## Requirements
* node v16 or higher

## known issues
* please create issues at [github](https://github.com/rg-engineering/ioBroker.semp/issues) if you find bugs or whish new features

## Changelog

### 0.1.0 (in progress)
* (René) wallboxes: minimum and maximum energy for charging is adjustable by datapoint, default: battery capacity (10% and 100%)

### 0.0.5 (2022-12-27)
* (René) MinPowerConsumption added
* (René) see issue #20: support of wallboxes

### 0.0.4 (2022-11-07)
* (René) see issue #15: support of more then one time periods for energy requests
* (René) some bug fixes (0.0.3)

### 0.0.2 (2022-10-16)
* (René) threshold for status detection with timer
* (René) csv logger for data to be sent to SHM (for debugging)
* (René) see issue #14: cancel request if device does not turn on
* (René) bug fix issue #19: turn off device at the end of maximum operation time


### 0.0.1 (2022-10-01)
* (René) initial release

## License
MIT License

Copyright (c) 2022-2023 rg-engineering info@rg-engineering.eu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
