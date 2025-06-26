using System.IO.Ports;
using ScottPlot;
using System.Text;
using System.Diagnostics;

namespace serial_power_logger
{
    public partial class Form1 : Form
    {
        private SerialPort? serialPort;
        private bool isConnected = false;
        private List<double> timeData = new List<double>();
        private List<double> voltageData = new List<double>();
        private List<double> currentData = new List<double>();
        private List<double> powerData = new List<double>();
        private Stopwatch stopwatch = new Stopwatch();
        private double lastVoltage = 0;
        private double lastCurrent = 0;
        private double lastPower = 0;
        private readonly object dataLock = new object();

        public Form1()
        {
            InitializeComponent();
            InitializeUI();
            ConfigurePlot();
        }

        private void InitializeUI()
        {
            // Set up event handlers
            Load += Form1_Load;
            FormClosing += Form1_FormClosing;
            buttonRefreshPorts.Click += ButtonRefreshPorts_Click;
            buttonConnect.Click += ButtonConnect_Click;
            buttonSetOutput.Click += ButtonSetOutput_Click;
            checkBoxOutputEnable.CheckedChanged += CheckBoxOutputEnable_CheckedChanged;
            buttonClearLog.Click += ButtonClearLog_Click;
            buttonExportCSV.Click += ButtonExportCSV_Click;
            timerUpdateReadings.Tick += TimerUpdateReadings_Tick;
            numericUpDownSampleRate.ValueChanged += NumericUpDownSampleRate_ValueChanged;

            // Initial state
            UpdateConnectionStatus(false);
            PopulateComPorts();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            // Start with disconnected state
            UpdateUIState(false);
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            DisconnectSerial();
        }

        private void ConfigurePlot()
        {
            plotView.Plot.Title("Power Supply Measurements");
            plotView.Plot.XLabel("Time (s)");
            plotView.Plot.YLabel("Value");
            
            // Create signal plots for voltage, current, and power
            plotView.Plot.Legend();
            
            // Configure axes
            plotView.Plot.Axes.Bottom.MajorGrid.Enable = true;
            plotView.Plot.Axes.Left.MajorGrid.Enable = true;
            
            // Configure auto-scaling behavior
            plotView.Plot.Axes.AutoScaleY();
            
            // Update the plot
            plotView.Refresh();
        }

        private void PopulateComPorts()
        {
            comboBoxComPort.Items.Clear();
            foreach (string port in SerialPort.GetPortNames())
            {
                comboBoxComPort.Items.Add(port);
            }

            if (comboBoxComPort.Items.Count > 0)
            {
                comboBoxComPort.SelectedIndex = 0;
            }
        }

        private void ButtonRefreshPorts_Click(object sender, EventArgs e)
        {
            PopulateComPorts();
        }

        private void ButtonConnect_Click(object sender, EventArgs e)
        {
            if (!isConnected)
            {
                ConnectSerial();
            }
            else
            {
                DisconnectSerial();
            }
        }

        private void ConnectSerial()
        {
            if (comboBoxComPort.SelectedItem == null)
            {
                MessageBox.Show("Please select a COM port.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            try
            {
                string portName = comboBoxComPort.SelectedItem.ToString() ?? "";
                int baudRate = int.Parse(comboBoxBaudRate.Text);

                serialPort = new SerialPort(portName, baudRate)
                {
                    DataBits = 8,
                    Parity = Parity.None,
                    StopBits = StopBits.One,
                    Handshake = Handshake.None,
                    ReadTimeout = 1000,
                    WriteTimeout = 1000
                };

                serialPort.DataReceived += SerialPort_DataReceived;
                serialPort.Open();

                isConnected = true;
                UpdateConnectionStatus(true);
                UpdateUIState(true);

                // Start timer for updating UI with readings
                timerUpdateReadings.Start();
                stopwatch.Start();

                // Initialize the data arrays
                timeData.Clear();
                voltageData.Clear();
                currentData.Clear();
                powerData.Clear();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error connecting to serial port: {ex.Message}", "Connection Error", 
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void DisconnectSerial()
        {
            if (serialPort != null && serialPort.IsOpen)
            {
                try
                {
                    // Disable output before disconnecting
                    if (checkBoxOutputEnable.Checked)
                    {
                        SendCommand("OUTPUT:STATE OFF");
                        checkBoxOutputEnable.Checked = false;
                    }

                    timerUpdateReadings.Stop();
                    stopwatch.Reset();

                    serialPort.DataReceived -= SerialPort_DataReceived;
                    serialPort.Close();
                    serialPort.Dispose();
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Error disconnecting: {ex.Message}", "Disconnection Error", 
                        MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
                finally
                {
                    serialPort = null;
                    isConnected = false;
                    UpdateConnectionStatus(false);
                    UpdateUIState(false);
                }
            }
        }

        private void SerialPort_DataReceived(object sender, SerialDataReceivedEventArgs e)
        {
            if (serialPort == null || !serialPort.IsOpen)
                return;

            try
            {
                string data = serialPort.ReadLine().Trim();
                ParseSerialData(data);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Serial receive error: {ex.Message}");
            }
        }

        private void ParseSerialData(string data)
        {
            // This is a simple implementation and will need to be adjusted 
            // based on the actual protocol of your power supply
            try
            {
                // Example format: "VOLTAGE:5.00,CURRENT:1.00"
                if (data.Contains("VOLTAGE") && data.Contains("CURRENT"))
                {
                    string[] parts = data.Split(',');
                    
                    foreach (string part in parts)
                    {
                        string[] keyValue = part.Split(':');
                        if (keyValue.Length == 2)
                        {
                            if (keyValue[0].Contains("VOLTAGE") && double.TryParse(keyValue[1], out double voltage))
                            {
                                lastVoltage = voltage;
                            }
                            else if (keyValue[0].Contains("CURRENT") && double.TryParse(keyValue[1], out double current))
                            {
                                lastCurrent = current;
                            }
                        }
                    }

                    // Calculate power
                    lastPower = lastVoltage * lastCurrent;
                    
                    // Record the data point
                    lock (dataLock)
                    {
                        double timeSeconds = stopwatch.ElapsedMilliseconds / 1000.0;
                        timeData.Add(timeSeconds);
                        voltageData.Add(lastVoltage);
                        currentData.Add(lastCurrent);
                        powerData.Add(lastPower);
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Parse error: {ex.Message}");
            }
        }

        private void TimerUpdateReadings_Tick(object sender, EventArgs e)
        {
            // Query power supply for measurements
            if (isConnected && serialPort != null && serialPort.IsOpen)
            {
                // Request voltage and current readings
                SendCommand("MEASURE:VOLTAGE?");
                SendCommand("MEASURE:CURRENT?");

                // Update UI with the latest readings
                UpdateReadingsDisplay();
                
                // Update the plot
                UpdatePlot();
            }
        }

        private void UpdateReadingsDisplay()
        {
            // Update UI with latest readings
            if (InvokeRequired)
            {
                Invoke(new Action(UpdateReadingsDisplay));
                return;
            }

            labelVoltageValue.Text = $"{lastVoltage:F2}V";
            labelCurrentValue.Text = $"{lastCurrent:F3}A";
            labelPowerValue.Text = $"{lastPower:F2}W";
        }

        private void UpdatePlot()
        {
            if (InvokeRequired)
            {
                Invoke(new Action(UpdatePlot));
                return;
            }

            lock (dataLock)
            {
                if (timeData.Count == 0)
                    return;

                // Clear previous data
                plotView.Plot.Clear();

                // Add new data
                var timeArray = timeData.ToArray();
                plotView.Plot.Add.Scatter(timeArray, voltageData.ToArray(), Color.Blue, label: "Voltage (V)");
                plotView.Plot.Add.Scatter(timeArray, currentData.ToArray(), Color.Red, label: "Current (A)");
                plotView.Plot.Add.Scatter(timeArray, powerData.ToArray(), Color.Green, label: "Power (W)");
                
                // Update legend
                plotView.Plot.Legend();
                
                // Refresh the plot
                plotView.Refresh();
            }
        }

        private void ButtonSetOutput_Click(object sender, EventArgs e)
        {
            if (!isConnected || serialPort == null || !serialPort.IsOpen)
                return;

            double voltage = (double)numericUpDownVoltage.Value;
            double current = (double)numericUpDownCurrent.Value;

            // Send commands to set voltage and current limits
            SendCommand($"VOLTAGE {voltage:F2}");
            SendCommand($"CURRENT {current:F3}");

            toolStripStatusLabel.Text = $"Set output: {voltage:F2}V, {current:F3}A";
        }

        private void CheckBoxOutputEnable_CheckedChanged(object sender, EventArgs e)
        {
            if (!isConnected || serialPort == null || !serialPort.IsOpen)
                return;

            bool enable = checkBoxOutputEnable.Checked;
            SendCommand($"OUTPUT:STATE {(enable ? "ON" : "OFF")}");
            
            toolStripStatusLabel.Text = $"Output {(enable ? "enabled" : "disabled")}";
        }

        private void NumericUpDownSampleRate_ValueChanged(object sender, EventArgs e)
        {
            // Update the timer interval
            timerUpdateReadings.Interval = (int)numericUpDownSampleRate.Value;
        }

        private void ButtonClearLog_Click(object sender, EventArgs e)
        {
            // Clear the logged data
            lock (dataLock)
            {
                timeData.Clear();
                voltageData.Clear();
                currentData.Clear();
                powerData.Clear();
            }
            
            // Clear the plot
            plotView.Plot.Clear();
            plotView.Refresh();
            
            toolStripStatusLabel.Text = "Log cleared";
        }

        private void ButtonExportCSV_Click(object sender, EventArgs e)
        {
            if (timeData.Count == 0)
            {
                MessageBox.Show("No data to export.", "Export Error", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            SaveFileDialog saveFileDialog = new SaveFileDialog
            {
                Filter = "CSV Files (*.csv)|*.csv",
                DefaultExt = "csv",
                FileName = $"PowerLog_{DateTime.Now:yyyyMMdd_HHmmss}"
            };

            if (saveFileDialog.ShowDialog() == DialogResult.OK)
            {
                try
                {
                    lock (dataLock)
                    {
                        StringBuilder csv = new StringBuilder();
                        csv.AppendLine("Time (s),Voltage (V),Current (A),Power (W)");

                        for (int i = 0; i < timeData.Count; i++)
                        {
                            csv.AppendLine($"{timeData[i]:F3},{voltageData[i]:F3},{currentData[i]:F3},{powerData[i]:F3}");
                        }

                        File.WriteAllText(saveFileDialog.FileName, csv.ToString());
                        toolStripStatusLabel.Text = $"Data exported to {saveFileDialog.FileName}";
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Error exporting data: {ex.Message}", "Export Error", 
                        MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        private void SendCommand(string command)
        {
            if (serialPort == null || !serialPort.IsOpen)
                return;

            try
            {
                // Add newline if not present
                if (!command.EndsWith("\r\n"))
                    command += "\r\n";

                serialPort.Write(command);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error sending command: {ex.Message}");
            }
        }

        private void UpdateConnectionStatus(bool connected)
        {
            if (InvokeRequired)
            {
                Invoke(new Action<bool>(UpdateConnectionStatus), connected);
                return;
            }

            isConnected = connected;
            labelConnectionStatus.Text = connected ? "Connected" : "Disconnected";
            labelConnectionStatus.ForeColor = connected ? Color.Green : Color.Red;
            buttonConnect.Text = connected ? "Disconnect" : "Connect";
        }

        private void UpdateUIState(bool connected)
        {
            if (InvokeRequired)
            {
                Invoke(new Action<bool>(UpdateUIState), connected);
                return;
            }

            // Connection controls
            comboBoxComPort.Enabled = !connected;
            comboBoxBaudRate.Enabled = !connected;
            buttonRefreshPorts.Enabled = !connected;

            // Power supply controls
            groupBoxPowerControl.Enabled = connected;

            // Update other UI elements
            toolStripStatusLabel.Text = connected ? $"Connected to {comboBoxComPort.Text}" : "Ready";
        }
    }
}
