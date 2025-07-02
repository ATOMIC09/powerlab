<p align="center">
  <img src="ggg" alt="Icon" width="150" height="150">
    <div align="center">
      <h1 align="center">PowerLab</h1>
      <img src="https://img.shields.io/github/license/ATOMIC09/powerlab">
    </div>
</p>

## What is PowerLab?

PowerLab is an Electron application built with React for monitoring and controlling serial-connected devices. It features a serial monitor, oscilloscope chart, and device control interface.

<br>

## Supported Device

This program is specifically designed to configure the Hantek PPS2320A power supply. It utilizes serial commands to interact with the device, enabling users to set voltage, current, and output modes, as well as monitor real-time data.

<br>

## Command Reference

The application uses commands derived from the Python implementation available at [HantekPPS2320A.py](https://github.com/hgrecco/labosdf/blob/master/software/python/instrumentos/HantekPPS2320A.py). These commands allow precise control and monitoring of the device.

<br>

## Features

- **Power Logging Chart**: Visualize voltage and current measurements in real-time.
- **Device Control**: Configure presets, output modes, and manage device states.
- **Serial Monitor**: View and log serial communication with timestamped entries.
- **Hantek PPS2320A Integration**: Full support for configuring and monitoring the Hantek PPS2320A power supply.

<br>

## Download
You can download the latest release of PowerLab from the [Releases](https://github.com/ATOMIC09/powerlab/releases) page. or click the link below:

- [`Download for Windows (v1.0)`]()

<br>

## Project Setup

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
# For Windows
npm run build:win

# For macOS
npm run build:mac

# For Linux
npm run build:linux
```

<br>

## Usage

1. Connect your device via a serial port.
2. Use the sidebar to select the port and configure settings.
3. Monitor serial communication and visualize data in the chart.

<br>

## License

This project is licensed under the General Public License Version 3 License. See the LICENSE file for details.
