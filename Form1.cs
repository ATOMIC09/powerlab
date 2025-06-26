using System.IO.Ports;
using ScottPlot;
using System.Text;
using System.Diagnostics;
using System.Drawing;

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
        private Stopwatch sessionTimer = new Stopwatch();
        private double lastVoltage = 0;
        private double lastCurrent = 0;
        private double lastPower = 0;
        private double maxPower = 0;
        private double avgPower = 0;
        private int dataPointCount = 0;
        private readonly object dataLock = new object();
        private bool outputEnabled = false;
        private bool autoScroll = true;

        // Performance testing variables
        private Stopwatch plotUpdateTimer = new Stopwatch();
        private List<double> plotUpdateTimes = new List<double>();
        private int plotUpdateCount = 0;
        private bool performanceTestMode = false;
        private System.Windows.Forms.Timer? simulationTimer;
        private Random random = new Random();

        // Optimized plotting variables
        private const int MAX_REAL_TIME_POINTS = 1000; // Limit real-time points for better performance
        private int plotUpdateSkipCounter = 0;
        private const int PLOT_UPDATE_SKIP_FRAMES = 2; // Update plot every 3rd frame for better performance

        // Add these new variables for better plot performance
        private int regularPlotUpdateCounter = 0;
        private const int REGULAR_PLOT_UPDATE_INTERVAL = 3; // Update plots every 3rd timer tick
        private DateTime lastHistoricalPlotUpdate = DateTime.MinValue;
        private const int HISTORICAL_PLOT_UPDATE_INTERVAL_SECONDS = 5; // Update historical plot every 5 seconds

        public Form1()
        {
            InitializeComponent();
            InitializeUI();
            ConfigurePlots();
            InitializePerformanceTest();
        }

        private void InitializePerformanceTest()
        {
            // Add a test button to the Power Logger tab
            var testButton = new Button
            {
                Text = "?? START PERFORMANCE TEST",
                Size = new Size(240, 40),
                Location = new Point(14, 5), // Position at the very top of the panel
                BackColor = System.Drawing.Color.Orange,
                ForeColor = System.Drawing.Color.White,
                Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Bold),
                FlatStyle = FlatStyle.Flat,
                Name = "buttonPerformanceTest",
                Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right
            };
            testButton.FlatAppearance.BorderSize = 1;
            testButton.FlatAppearance.BorderColor = System.Drawing.Color.DarkOrange;
            testButton.Click += TestButton_Click;
            
            // Add it to the power logger controls panel with highest z-order
            if (panelLoggerControls != null)
            {
                panelLoggerControls.Controls.Add(testButton);
                testButton.BringToFront(); // Ensure it's on top
                
                // Adjust the positions of existing controls to make room
                AdjustLoggerControlsLayout();
                
                // Debug output to confirm the button was added
                System.Diagnostics.Debug.WriteLine($"Performance test button added to panelLoggerControls. Control count: {panelLoggerControls.Controls.Count}");
                System.Diagnostics.Debug.WriteLine($"Button location: {testButton.Location}, Size: {testButton.Size}");
            }
            else
            {
                System.Diagnostics.Debug.WriteLine("ERROR: panelLoggerControls is null!");
            }
        }
        
        private void AdjustLoggerControlsLayout()
        {
            // Move existing group boxes down to make room for the performance test button
            const int buttonHeight = 50; // Button height + margin
            
            // Find and adjust the Session Info group box
            var sessionInfoBox = panelLoggerControls.Controls.Find("groupBoxSessionInfo", false).FirstOrDefault();
            if (sessionInfoBox != null)
            {
                var newLocation = new Point(sessionInfoBox.Location.X, sessionInfoBox.Location.Y + buttonHeight);
                sessionInfoBox.Location = newLocation;
                System.Diagnostics.Debug.WriteLine($"Moved groupBoxSessionInfo to: {newLocation}");
            }
            
            // Find and adjust the Logging Controls group box
            var loggingControlsBox = panelLoggerControls.Controls.Find("groupBoxLoggingControls", false).FirstOrDefault();
            if (loggingControlsBox != null)
            {
                var newLocation = new Point(loggingControlsBox.Location.X, loggingControlsBox.Location.Y + buttonHeight);
                loggingControlsBox.Location = newLocation;
                System.Diagnostics.Debug.WriteLine($"Moved groupBoxLoggingControls to: {newLocation}");
            }
        }

        private void TestButton_Click(object sender, EventArgs e)
        {
            var button = sender as Button;
            if (button != null)
            {
                if (!performanceTestMode)
                {
                    StartPerformanceTest();
                    button.Text = "Stop Performance Test";
                    button.BackColor = System.Drawing.Color.Red;
                }
                else
                {
                    StopPerformanceTest();
                    button.Text = "Start Performance Test";
                    button.BackColor = System.Drawing.Color.Orange;
                }
            }
        }

        private void StartPerformanceTest()
        {
            performanceTestMode = true;
            plotUpdateTimes.Clear();
            plotUpdateCount = 0;
            
            // Reset data for clean test
            ResetData();
            
            // Start simulation timer for high-frequency data generation
            simulationTimer = new System.Windows.Forms.Timer();
            simulationTimer.Interval = 50; // 20 Hz data generation
            simulationTimer.Tick += SimulationTimer_Tick;
            simulationTimer.Start();
            
            // Start session timer
            sessionTimer.Restart();
            stopwatch.Restart();
            timerElapsedTime.Start();
            
            toolStripStatusLabel.Text = "Performance test started - Generating 20Hz data";
        }

        private void StopPerformanceTest()
        {
            performanceTestMode = false;
            
            if (simulationTimer != null)
            {
                simulationTimer.Stop();
                simulationTimer.Dispose();
                simulationTimer = null;
            }
            
            // Calculate performance statistics
            if (plotUpdateTimes.Count > 0)
            {
                double avgUpdateTime = plotUpdateTimes.Average();
                double maxUpdateTime = plotUpdateTimes.Max();
                double minUpdateTime = plotUpdateTimes.Min();
                
                string performanceReport = $"Performance Test Results:\n" +
                    $"Total Plot Updates: {plotUpdateCount}\n" +
                    $"Average Update Time: {avgUpdateTime:F2}ms\n" +
                    $"Max Update Time: {maxUpdateTime:F2}ms\n" +
                    $"Min Update Time: {minUpdateTime:F2}ms\n" +
                    $"Data Points Generated: {dataPointCount}\n" +
                    $"Test Duration: {sessionTimer.Elapsed.TotalSeconds:F1}s\n" +
                    $"Effective Data Rate: {dataPointCount / sessionTimer.Elapsed.TotalSeconds:F1} Hz";
                    
                MessageBox.Show(performanceReport, "Performance Test Results", 
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            
            toolStripStatusLabel.Text = "Performance test completed";
        }

        private void SimulationTimer_Tick(object sender, EventArgs e)
        {
            if (!performanceTestMode) return;
            
            // Generate simulated data with realistic variations
            double time = stopwatch.ElapsedMilliseconds / 1000.0;
            
            // Simulate realistic power supply behavior
            lastVoltage = 5.0 + 0.1 * Math.Sin(time * 2 * Math.PI * 0.1) + (random.NextDouble() - 0.5) * 0.02;
            lastCurrent = 1.0 + 0.2 * Math.Sin(time * 2 * Math.PI * 0.05) + (random.NextDouble() - 0.5) * 0.01;
            lastPower = lastVoltage * lastCurrent;
            
            // Update statistics
            if (lastPower > maxPower)
            {
                maxPower = lastPower;
            }
            
            dataPointCount++;
            avgPower = ((avgPower * (dataPointCount - 1)) + lastPower) / dataPointCount;
            
            // Add data point
            lock (dataLock)
            {
                timeData.Add(time);
                voltageData.Add(lastVoltage);
                currentData.Add(lastCurrent);
                powerData.Add(lastPower);
                
                // Limit data size for performance
                if (timeData.Count > 10000)
                {
                    timeData.RemoveAt(0);
                    voltageData.RemoveAt(0);
                    currentData.RemoveAt(0);
                    powerData.RemoveAt(0);
                }
            }
            
            // Update UI
            UpdateReadingsDisplay();
            UpdateSessionInfo();
            
            // Update plots with performance optimization
            UpdatePlotsOptimized();
        }

        private void UpdatePlotsOptimized()
        {
            // Skip some plot updates for better performance
            plotUpdateSkipCounter++;
            if (plotUpdateSkipCounter < PLOT_UPDATE_SKIP_FRAMES)
                return;
            
            plotUpdateSkipCounter = 0;
            
            if (InvokeRequired)
            {
                Invoke(new Action(UpdatePlotsOptimized));
                return;
            }
            
            // Measure plot update performance
            plotUpdateTimer.Restart();
            
            lock (dataLock)
            {
                if (timeData.Count == 0)
                    return;

                var timeArray = timeData.ToArray();
                var voltageArray = voltageData.ToArray();
                var currentArray = currentData.ToArray();
                var powerArray = powerData.ToArray();

                // Real-time plot optimization - limit data points shown
                plotViewRealTime.Plot.Clear();

                int startIndex = 0;
                int maxPoints = Math.Min(MAX_REAL_TIME_POINTS, timeData.Count);
                
                if (autoScroll && timeData.Count > maxPoints)
                {
                    startIndex = timeData.Count - maxPoints;
                }

                int count = Math.Min(maxPoints, timeData.Count - startIndex);

                if (count > 0)
                {
                    double[] recentTimeData = new double[count];
                    double[] recentVoltageData = new double[count];
                    double[] recentCurrentData = new double[count];
                    double[] recentPowerData = new double[count];

                    Array.Copy(timeArray, startIndex, recentTimeData, 0, count);
                    Array.Copy(voltageArray, startIndex, recentVoltageData, 0, count);
                    Array.Copy(currentArray, startIndex, recentCurrentData, 0, count);
                    Array.Copy(powerArray, startIndex, recentPowerData, 0, count);

                    // Add voltage data - blue
                    var voltageLine = plotViewRealTime.Plot.Add.Scatter(recentTimeData, recentVoltageData);
                    voltageLine.LineStyle.Width = 2;
                    voltageLine.LineStyle.Color = new ScottPlot.Color(0, 0, 255);
                    voltageLine.LegendText = "Voltage (V)";

                    // Add current data - red
                    var currentLine = plotViewRealTime.Plot.Add.Scatter(recentTimeData, recentCurrentData);
                    currentLine.LineStyle.Width = 2;
                    currentLine.LineStyle.Color = new ScottPlot.Color(255, 0, 0);
                    currentLine.LegendText = "Current (A)";

                    // Add power data - green
                    var powerLine = plotViewRealTime.Plot.Add.Scatter(recentTimeData, recentPowerData);
                    powerLine.LineStyle.Width = 2;
                    powerLine.LineStyle.Color = new ScottPlot.Color(0, 192, 0);
                    powerLine.LegendText = "Power (W)";

                    plotViewRealTime.Plot.ShowLegend();
                }

                // Only update historical plot occasionally during performance test
                if (!performanceTestMode || plotUpdateCount % 10 == 0)
                {
                    UpdateHistoricalPlot(timeArray, voltageArray, currentArray, powerArray);
                }

                // Refresh only the real-time plot for better performance
                plotViewRealTime.Refresh();
            }
            
            plotUpdateTimer.Stop();
            plotUpdateCount++;
            
            // Record performance metrics
            if (performanceTestMode)
            {
                plotUpdateTimes.Add(plotUpdateTimer.Elapsed.TotalMilliseconds);
                
                // Keep only recent performance data
                if (plotUpdateTimes.Count > 1000)
                {
                    plotUpdateTimes.RemoveAt(0);
                }
            }
        }

        private void UpdateHistoricalPlot(double[] timeArray, double[] voltageArray, double[] currentArray, double[] powerArray)
        {
            plotViewHistorical.Plot.Clear();

            // Downsample data for historical plot if too many points
            int downsampleFactor = Math.Max(1, timeArray.Length / 5000); // Max 5000 points in historical view
            
            if (downsampleFactor > 1)
            {
                var downsampledTime = DownsampleArray(timeArray, downsampleFactor);
                var downsampledVoltage = DownsampleArray(voltageArray, downsampleFactor);
                var downsampledCurrent = DownsampleArray(currentArray, downsampleFactor);
                var downsampledPower = DownsampleArray(powerArray, downsampleFactor);
                
                timeArray = downsampledTime;
                voltageArray = downsampledVoltage;
                currentArray = downsampledCurrent;
                powerArray = downsampledPower;
            }

            // Add voltage data - blue
            var voltageLineHist = plotViewHistorical.Plot.Add.Scatter(timeArray, voltageArray);
            voltageLineHist.LineStyle.Width = 1;
            voltageLineHist.LineStyle.Color = new ScottPlot.Color(0, 0, 255);
            voltageLineHist.LegendText = "Voltage (V)";

            // Add current data - red
            var currentLineHist = plotViewHistorical.Plot.Add.Scatter(timeArray, currentArray);
            currentLineHist.LineStyle.Width = 1;
            currentLineHist.LineStyle.Color = new ScottPlot.Color(255, 0, 0);
            currentLineHist.LegendText = "Current (A)";

            // Add power data - green
            var powerLineHist = plotViewHistorical.Plot.Add.Scatter(timeArray, powerArray);
            powerLineHist.LineStyle.Width = 1;
            powerLineHist.LineStyle.Color = new ScottPlot.Color(0, 192, 0);
            powerLineHist.LegendText = "Power (W)";

            plotViewHistorical.Plot.ShowLegend();
            plotViewHistorical.Refresh();
        }

        private double[] DownsampleArray(double[] input, int factor)
        {
            int outputLength = (input.Length + factor - 1) / factor;
            double[] output = new double[outputLength];
            
            for (int i = 0; i < outputLength; i++)
            {
                int sourceIndex = i * factor;
                if (sourceIndex < input.Length)
                {
                    output[i] = input[sourceIndex];
                }
            }
            
            return output;
        }

        private void InitializeUI()
        {
            // Set up event handlers
            Load += Form1_Load;
            FormClosing += Form1_FormClosing;

            // Connection tab
            buttonRefreshPorts.Click += ButtonRefreshPorts_Click;
            buttonConnect.Click += ButtonConnect_Click;

            // Power Supply tab
            buttonApplySettings.Click += ButtonApplySettings_Click;
            buttonOutputToggle.Click += ButtonOutputToggle_Click;

            // Power Logger tab
            buttonClearData.Click += ButtonClearData_Click;
            buttonExportData.Click += ButtonExportData_Click;
            checkBoxAutoLog.CheckedChanged += CheckBoxAutoLog_CheckedChanged;
            checkBoxAutoScroll.CheckedChanged += CheckBoxAutoScroll_CheckedChanged;
            numericUpDownSampleRate.ValueChanged += NumericUpDownSampleRate_ValueChanged;

            // Timers
            timerUpdateReadings.Tick += TimerUpdateReadings_Tick;
            timerElapsedTime.Tick += TimerElapsedTime_Tick;

            // Tab events
            mainTabControl.SelectedIndexChanged += MainTabControl_SelectedIndexChanged;

            // Initial state
            UpdateConnectionStatus(false);
            PopulateComPorts();
            autoScroll = checkBoxAutoScroll.Checked;
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            // Start with disconnected state
            UpdateUIState(false);

            // Set initial plot visibility
            mainTabControl.SelectedIndex = 0;
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            StopPerformanceTest();
            DisconnectSerial();
        }

        private void MainTabControl_SelectedIndexChanged(object sender, EventArgs e)
        {
            // Only update plots when switching to power logger tab and we have data
            if (mainTabControl.SelectedIndex == 2) // Power Logger Tab
            {
                tabControlCharts.SelectedIndex = 0; // Real-time tab
                
                // Only update if not in performance test mode and we have data
                if (!performanceTestMode && timeData.Count > 0)
                {
                    // Use throttled update instead of full update
                    UpdateRealTimePlotOnly();
                    UpdateHistoricalPlotThrottled();
                }
            }
        }

        private void ConfigurePlots()
        {
            // Configure Real-Time Plot
            plotViewRealTime.Plot.Title("Real-Time Power Measurements");
            plotViewRealTime.Plot.XLabel("Time (s)");
            plotViewRealTime.Plot.YLabel("Value");

            // Set grid visibility
            plotViewRealTime.Plot.Axes.Bottom.IsVisible = true;
            plotViewRealTime.Plot.Axes.Left.IsVisible = true;

            // Configure Historical Plot
            plotViewHistorical.Plot.Title("Historical Power Measurements");
            plotViewHistorical.Plot.XLabel("Time (s)");
            plotViewHistorical.Plot.YLabel("Value");

            // Set grid visibility
            plotViewHistorical.Plot.Axes.Bottom.IsVisible = true;
            plotViewHistorical.Plot.Axes.Left.IsVisible = true;

            // Refresh plots
            plotViewRealTime.Refresh();
            plotViewHistorical.Refresh();
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

                // Start timers
                timerUpdateReadings.Start();
                stopwatch.Start();
                timerElapsedTime.Start();
                sessionTimer.Start();

                // Initialize the data arrays
                ResetData();

                // Switch to power supply tab after connecting
                mainTabControl.SelectedIndex = 1;
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
                    if (outputEnabled)
                    {
                        SendCommand("OUTPUT:STATE OFF");
                        outputEnabled = false;
                        UpdateOutputStatus(false);
                    }

                    timerUpdateReadings.Stop();
                    timerElapsedTime.Stop();
                    stopwatch.Reset();
                    sessionTimer.Reset();

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

                    // Update max power
                    if (lastPower > maxPower)
                    {
                        maxPower = lastPower;
                    }

                    // Update average power
                    dataPointCount++;
                    avgPower = ((avgPower * (dataPointCount - 1)) + lastPower) / dataPointCount;

                    // Record the data point if auto logging is enabled
                    if (checkBoxAutoLog.Checked)
                    {
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

                // Update session information
                UpdateSessionInfo();

                // Update the plots with throttling to prevent GUI freezing
                if (!performanceTestMode)
                {
                    UpdatePlotsThrottled();
                }
            }
        }

        private void UpdatePlotsThrottled()
        {
            // Only update plots every few timer ticks to reduce GUI load
            regularPlotUpdateCounter++;
            if (regularPlotUpdateCounter >= REGULAR_PLOT_UPDATE_INTERVAL)
            {
                regularPlotUpdateCounter = 0;
                
                // Only update if we're on the Power Logger tab and have data
                if (mainTabControl.SelectedIndex == 2 && timeData.Count > 0)
                {
                    UpdateRealTimePlotOnly();
                    
                    // Update historical plot less frequently
                    var now = DateTime.Now;
                    if ((now - lastHistoricalPlotUpdate).TotalSeconds >= HISTORICAL_PLOT_UPDATE_INTERVAL_SECONDS)
                    {
                        lastHistoricalPlotUpdate = now;
                        UpdateHistoricalPlotThrottled();
                    }
                }
            }
        }

        private void UpdateRealTimePlotOnly()
        {
            if (InvokeRequired)
            {
                Invoke(new Action(UpdateRealTimePlotOnly));
                return;
            }

            lock (dataLock)
            {
                if (timeData.Count == 0)
                    return;

                // Limit data points for performance - show last 100 points maximum
                int maxPoints = Math.Min(100, timeData.Count);
                int startIndex = Math.Max(0, timeData.Count - maxPoints);
                int count = timeData.Count - startIndex;

                if (count > 0)
                {
                    double[] recentTimeData = new double[count];
                    double[] recentVoltageData = new double[count];
                    double[] recentCurrentData = new double[count];
                    double[] recentPowerData = new double[count];

                    // Copy only recent data
                    for (int i = 0; i < count; i++)
                    {
                        int sourceIndex = startIndex + i;
                        recentTimeData[i] = timeData[sourceIndex];
                        recentVoltageData[i] = voltageData[sourceIndex];
                        recentCurrentData[i] = currentData[sourceIndex];
                        recentPowerData[i] = powerData[sourceIndex];
                    }

                    // Clear and update real-time plot only
                    plotViewRealTime.Plot.Clear();

                    // Add voltage data - blue
                    var voltageLine = plotViewRealTime.Plot.Add.Scatter(recentTimeData, recentVoltageData);
                    voltageLine.LineStyle.Width = 2;
                    voltageLine.LineStyle.Color = new ScottPlot.Color(0, 0, 255);
                    voltageLine.LegendText = "Voltage (V)";

                    // Add current data - red
                    var currentLine = plotViewRealTime.Plot.Add.Scatter(recentTimeData, recentCurrentData);
                    currentLine.LineStyle.Width = 2;
                    currentLine.LineStyle.Color = new ScottPlot.Color(255, 0, 0);
                    currentLine.LegendText = "Current (A)";

                    // Add power data - green
                    var powerLine = plotViewRealTime.Plot.Add.Scatter(recentTimeData, recentPowerData);
                    powerLine.LineStyle.Width = 2;
                    powerLine.LineStyle.Color = new ScottPlot.Color(0, 192, 0);
                    powerLine.LegendText = "Power (W)";

                    plotViewRealTime.Plot.ShowLegend();
                    
                    // Refresh only the real-time plot
                    plotViewRealTime.Refresh();
                }
            }
        }

        private void UpdateHistoricalPlotThrottled()
        {
            if (InvokeRequired)
            {
                Invoke(new Action(UpdateHistoricalPlotThrottled));
                return;
            }

            lock (dataLock)
            {
                if (timeData.Count == 0)
                    return;

                var timeArray = timeData.ToArray();
                var voltageArray = voltageData.ToArray();
                var currentArray = currentData.ToArray();
                var powerArray = powerData.ToArray();

                // Use the existing optimized historical plot update
                UpdateHistoricalPlot(timeArray, voltageArray, currentArray, powerArray);
            }
        }

        private void ButtonApplySettings_Click(object sender, EventArgs e)
        {
            if (!isConnected || serialPort == null || !serialPort.IsOpen)
                return;

            double voltage = (double)numericUpDownVoltageSetpoint.Value;
            double current = (double)numericUpDownCurrentLimit.Value;

            // Send commands to set voltage and current limits
            SendCommand($"VOLTAGE {voltage:F2}");
            SendCommand($"CURRENT {current:F3}");

            toolStripStatusLabel.Text = $"Applied settings: {voltage:F2}V, {current:F3}A";
        }

        private void ButtonOutputToggle_Click(object sender, EventArgs e)
        {
            if (!isConnected || serialPort == null || !serialPort.IsOpen)
                return;

            outputEnabled = !outputEnabled;
            SendCommand($"OUTPUT:STATE {(outputEnabled ? "ON" : "OFF")}");
            UpdateOutputStatus(outputEnabled);

            toolStripStatusLabel.Text = $"Output {(outputEnabled ? "enabled" : "disabled")}";
        }

        private void UpdateOutputStatus(bool enabled)
        {
            if (InvokeRequired)
            {
                Invoke(new Action<bool>(UpdateOutputStatus), enabled);
                return;
            }

            outputEnabled = enabled;
            labelOutputStatus.Text = enabled ? "ON" : "OFF";
            labelOutputStatus.ForeColor = enabled ? System.Drawing.Color.Green : System.Drawing.Color.Red;
            buttonOutputToggle.BackColor = enabled ? System.Drawing.Color.Green : System.Drawing.Color.FromArgb(192, 0, 0);
        }

        private void CheckBoxAutoLog_CheckedChanged(object sender, EventArgs e)
        {
            // Toggle auto logging
            toolStripStatusLabel.Text = checkBoxAutoLog.Checked ? "Auto logging enabled" : "Auto logging disabled";
        }

        private void CheckBoxAutoScroll_CheckedChanged(object sender, EventArgs e)
        {
            // Toggle auto scrolling
            autoScroll = checkBoxAutoScroll.Checked;
            if (!performanceTestMode)
            {
                UpdatePlots();
            }
        }

        private void NumericUpDownSampleRate_ValueChanged(object sender, EventArgs e)
        {
            // Update the timer interval
            timerUpdateReadings.Interval = (int)numericUpDownSampleRate.Value;
        }

        private void ButtonClearData_Click(object sender, EventArgs e)
        {
            // Clear the logged data
            ResetData();

            // Clear the plots
            if (!performanceTestMode)
            {
                UpdatePlots();
            }

            toolStripStatusLabel.Text = "Data cleared";
        }

        private void ResetData()
        {
            lock (dataLock)
            {
                timeData.Clear();
                voltageData.Clear();
                currentData.Clear();
                powerData.Clear();
                maxPower = 0;
                avgPower = 0;
                dataPointCount = 0;
            }

            UpdateSessionInfo();
        }

        private void ButtonExportData_Click(object sender, EventArgs e)
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
                        toolStripStatusLabel.Text = $"Data exported to {Path.GetFileName(saveFileDialog.FileName)}";
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
                Debug.WriteLine($"Sent: {command.Trim()}");
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
            labelConnectionStatus.Text = connected ? "CONNECTED" : "DISCONNECTED";
            labelConnectionStatus.ForeColor = connected ? System.Drawing.Color.Green : System.Drawing.Color.Red;
            buttonConnect.Text = connected ? "Disconnect" : "Connect";
            buttonConnect.BackColor = connected ? System.Drawing.Color.FromArgb(192, 0, 0) : System.Drawing.Color.FromArgb(0, 122, 204);
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

            // Tab availability
            tabPagePowerSupply.Enabled = connected;
            tabPagePowerLogger.Enabled = connected;

            // Update status bar
            toolStripStatusLabel.Text = connected ? $"Connected to {comboBoxComPort.Text}" : "Ready";
        }

        private void TimerElapsedTime_Tick(object sender, EventArgs e)
        {
            UpdateElapsedTime();
        }

        private void UpdateElapsedTime()
        {
            if (InvokeRequired)
            {
                Invoke(new Action(UpdateElapsedTime));
                return;
            }

            TimeSpan elapsed = sessionTimer.Elapsed;
            labelElapsedTimeValue.Text = $"{elapsed.Hours:00}:{elapsed.Minutes:00}:{elapsed.Seconds:00}";
        }

        private void UpdateSessionInfo()
        {
            if (InvokeRequired)
            {
                Invoke(new Action(UpdateSessionInfo));
                return;
            }

            labelDataPointsValue.Text = dataPointCount.ToString();
            labelMaxPowerValue.Text = $"{maxPower:F2} W";
            labelAveragePowerValue.Text = $"{avgPower:F2} W";
        }

        private void UpdateReadingsDisplay()
        {
            // Update UI with latest readings
            if (InvokeRequired)
            {
                Invoke(new Action(UpdateReadingsDisplay));
                return;
            }

            labelVoltageValue.Text = $"{lastVoltage:F2} V";
            labelCurrentValue.Text = $"{lastCurrent:F3} A";
            labelPowerValue.Text = $"{lastPower:F2} W";
        }

        private void UpdatePlots()
        {
            // For backward compatibility, redirect to throttled update
            UpdatePlotsThrottled();
        }

        private void checkBoxAutoLog_CheckedChanged_1(object sender, EventArgs e)
        {

        }
    }
}
