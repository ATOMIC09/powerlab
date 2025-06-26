namespace serial_power_logger
{
    partial class Form1
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            components = new System.ComponentModel.Container();
            mainTabControl = new TabControl();
            tabPageSerialConnection = new TabPage();
            groupBoxConnection = new GroupBox();
            comboBoxBaudRate = new ComboBox();
            comboBoxComPort = new ComboBox();
            buttonConnect = new Button();
            buttonRefreshPorts = new Button();
            labelBaudRate = new Label();
            labelComPort = new Label();
            labelConnectionStatus = new Label();
            tabPagePowerSupply = new TabPage();
            panelPowerSupplyControls = new Panel();
            groupBoxOutputControls = new GroupBox();
            labelOutputStatus = new Label();
            buttonOutputToggle = new Button();
            groupBoxChannelSettings = new GroupBox();
            labelCurrentUnit = new Label();
            labelVoltageUnit = new Label();
            numericUpDownCurrentLimit = new NumericUpDown();
            numericUpDownVoltageSetpoint = new NumericUpDown();
            labelCurrentLimit = new Label();
            labelVoltageSetpoint = new Label();
            buttonApplySettings = new Button();
            groupBoxMeasurements = new GroupBox();
            labelPowerReading = new Label();
            labelPowerValue = new Label();
            labelCurrentReading = new Label();
            labelCurrentValue = new Label();
            labelVoltageReading = new Label();
            labelVoltageValue = new Label();
            panelPowerSupplyHeader = new Panel();
            labelPowerSupplyHeader = new Label();
            pictureBoxPowerSupply = new PictureBox();
            tabPagePowerLogger = new TabPage();
            splitContainerLogger = new SplitContainer();
            panelLoggerControls = new Panel();
            groupBoxLoggingControls = new GroupBox();
            checkBoxAutoScroll = new CheckBox();
            buttonExportData = new Button();
            buttonClearData = new Button();
            checkBoxAutoLog = new CheckBox();
            numericUpDownSampleRate = new NumericUpDown();
            labelSampleRate = new Label();
            groupBoxSessionInfo = new GroupBox();
            labelElapsedTimeValue = new Label();
            labelElapsedTime = new Label();
            labelDataPointsValue = new Label();
            labelDataPoints = new Label();
            labelMaxPowerValue = new Label();
            labelMaxPower = new Label();
            labelAveragePowerValue = new Label();
            labelAveragePower = new Label();
            tabControlCharts = new TabControl();
            tabPageRealTime = new TabPage();
            plotViewRealTime = new ScottPlot.WinForms.FormsPlot();
            tabPageHistorical = new TabPage();
            plotViewHistorical = new ScottPlot.WinForms.FormsPlot();
            statusStrip = new StatusStrip();
            toolStripStatusLabel = new ToolStripStatusLabel();
            toolStripProgressBar = new ToolStripProgressBar();
            timerUpdateReadings = new System.Windows.Forms.Timer(components);
            timerElapsedTime = new System.Windows.Forms.Timer(components);
            mainTabControl.SuspendLayout();
            tabPageSerialConnection.SuspendLayout();
            groupBoxConnection.SuspendLayout();
            tabPagePowerSupply.SuspendLayout();
            panelPowerSupplyControls.SuspendLayout();
            groupBoxOutputControls.SuspendLayout();
            groupBoxChannelSettings.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)numericUpDownCurrentLimit).BeginInit();
            ((System.ComponentModel.ISupportInitialize)numericUpDownVoltageSetpoint).BeginInit();
            groupBoxMeasurements.SuspendLayout();
            panelPowerSupplyHeader.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)pictureBoxPowerSupply).BeginInit();
            tabPagePowerLogger.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)splitContainerLogger).BeginInit();
            splitContainerLogger.Panel1.SuspendLayout();
            splitContainerLogger.Panel2.SuspendLayout();
            splitContainerLogger.SuspendLayout();
            panelLoggerControls.SuspendLayout();
            groupBoxLoggingControls.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)numericUpDownSampleRate).BeginInit();
            groupBoxSessionInfo.SuspendLayout();
            tabControlCharts.SuspendLayout();
            tabPageRealTime.SuspendLayout();
            tabPageHistorical.SuspendLayout();
            statusStrip.SuspendLayout();
            SuspendLayout();
            // 
            // mainTabControl
            // 
            mainTabControl.Controls.Add(tabPageSerialConnection);
            mainTabControl.Controls.Add(tabPagePowerSupply);
            mainTabControl.Controls.Add(tabPagePowerLogger);
            mainTabControl.Dock = DockStyle.Fill;
            mainTabControl.Location = new Point(0, 0);
            mainTabControl.Name = "mainTabControl";
            mainTabControl.SelectedIndex = 0;
            mainTabControl.Size = new Size(1200, 768);
            mainTabControl.TabIndex = 0;
            // 
            // tabPageSerialConnection
            // 
            tabPageSerialConnection.Controls.Add(groupBoxConnection);
            tabPageSerialConnection.Controls.Add(labelConnectionStatus);
            tabPageSerialConnection.Location = new Point(4, 29);
            tabPageSerialConnection.Name = "tabPageSerialConnection";
            tabPageSerialConnection.Padding = new Padding(3);
            tabPageSerialConnection.Size = new Size(1192, 735);
            tabPageSerialConnection.TabIndex = 0;
            tabPageSerialConnection.Text = "Connection";
            tabPageSerialConnection.UseVisualStyleBackColor = true;
            // 
            // groupBoxConnection
            // 
            groupBoxConnection.Anchor = AnchorStyles.None;
            groupBoxConnection.Controls.Add(comboBoxBaudRate);
            groupBoxConnection.Controls.Add(comboBoxComPort);
            groupBoxConnection.Controls.Add(buttonConnect);
            groupBoxConnection.Controls.Add(buttonRefreshPorts);
            groupBoxConnection.Controls.Add(labelBaudRate);
            groupBoxConnection.Controls.Add(labelComPort);
            groupBoxConnection.Font = new Font("Segoe UI", 10F);
            groupBoxConnection.Location = new Point(380, 248);
            groupBoxConnection.Name = "groupBoxConnection";
            groupBoxConnection.Size = new Size(440, 240);
            groupBoxConnection.TabIndex = 2;
            groupBoxConnection.TabStop = false;
            groupBoxConnection.Text = "Serial Connection";
            // 
            // comboBoxBaudRate
            // 
            comboBoxBaudRate.FormattingEnabled = true;
            comboBoxBaudRate.Items.AddRange(new object[] { "4800", "9600", "19200", "38400", "57600", "115200" });
            comboBoxBaudRate.Location = new Point(178, 90);
            comboBoxBaudRate.Name = "comboBoxBaudRate";
            comboBoxBaudRate.Size = new Size(215, 31);
            comboBoxBaudRate.TabIndex = 5;
            comboBoxBaudRate.Text = "9600";
            // 
            // comboBoxComPort
            // 
            comboBoxComPort.FormattingEnabled = true;
            comboBoxComPort.Location = new Point(178, 39);
            comboBoxComPort.Name = "comboBoxComPort";
            comboBoxComPort.Size = new Size(215, 31);
            comboBoxComPort.TabIndex = 4;
            // 
            // buttonConnect
            // 
            buttonConnect.BackColor = Color.FromArgb(0, 122, 204);
            buttonConnect.FlatStyle = FlatStyle.Flat;
            buttonConnect.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            buttonConnect.ForeColor = Color.White;
            buttonConnect.Location = new Point(239, 184);
            buttonConnect.Name = "buttonConnect";
            buttonConnect.Size = new Size(154, 40);
            buttonConnect.TabIndex = 3;
            buttonConnect.Text = "Connect";
            buttonConnect.UseVisualStyleBackColor = false;
            // 
            // buttonRefreshPorts
            // 
            buttonRefreshPorts.Location = new Point(81, 184);
            buttonRefreshPorts.Name = "buttonRefreshPorts";
            buttonRefreshPorts.Size = new Size(152, 40);
            buttonRefreshPorts.TabIndex = 2;
            buttonRefreshPorts.Text = "Refresh Ports";
            buttonRefreshPorts.UseVisualStyleBackColor = true;
            // 
            // labelBaudRate
            // 
            labelBaudRate.AutoSize = true;
            labelBaudRate.Location = new Point(47, 93);
            labelBaudRate.Name = "labelBaudRate";
            labelBaudRate.Size = new Size(92, 23);
            labelBaudRate.TabIndex = 1;
            labelBaudRate.Text = "Baud Rate:";
            // 
            // labelComPort
            // 
            labelComPort.AutoSize = true;
            labelComPort.Location = new Point(47, 42);
            labelComPort.Name = "labelComPort";
            labelComPort.Size = new Size(89, 23);
            labelComPort.TabIndex = 0;
            labelComPort.Text = "COM Port:";
            // 
            // labelConnectionStatus
            // 
            labelConnectionStatus.Anchor = AnchorStyles.None;
            labelConnectionStatus.AutoSize = true;
            labelConnectionStatus.Font = new Font("Segoe UI", 16F, FontStyle.Bold);
            labelConnectionStatus.ForeColor = Color.Red;
            labelConnectionStatus.Location = new Point(487, 175);
            labelConnectionStatus.Name = "labelConnectionStatus";
            labelConnectionStatus.Size = new Size(221, 37);
            labelConnectionStatus.TabIndex = 0;
            labelConnectionStatus.Text = "DISCONNECTED";
            // 
            // tabPagePowerSupply
            // 
            tabPagePowerSupply.Controls.Add(panelPowerSupplyControls);
            tabPagePowerSupply.Controls.Add(panelPowerSupplyHeader);
            tabPagePowerSupply.Location = new Point(4, 29);
            tabPagePowerSupply.Name = "tabPagePowerSupply";
            tabPagePowerSupply.Padding = new Padding(3);
            tabPagePowerSupply.Size = new Size(1192, 735);
            tabPagePowerSupply.TabIndex = 1;
            tabPagePowerSupply.Text = "Power Supply";
            tabPagePowerSupply.UseVisualStyleBackColor = true;
            // 
            // panelPowerSupplyControls
            // 
            panelPowerSupplyControls.Controls.Add(groupBoxOutputControls);
            panelPowerSupplyControls.Controls.Add(groupBoxChannelSettings);
            panelPowerSupplyControls.Controls.Add(groupBoxMeasurements);
            panelPowerSupplyControls.Dock = DockStyle.Fill;
            panelPowerSupplyControls.Location = new Point(3, 113);
            panelPowerSupplyControls.Name = "panelPowerSupplyControls";
            panelPowerSupplyControls.Size = new Size(1186, 619);
            panelPowerSupplyControls.TabIndex = 1;
            // 
            // groupBoxOutputControls
            // 
            groupBoxOutputControls.Anchor = AnchorStyles.None;
            groupBoxOutputControls.Controls.Add(labelOutputStatus);
            groupBoxOutputControls.Controls.Add(buttonOutputToggle);
            groupBoxOutputControls.Font = new Font("Segoe UI", 10.2F);
            groupBoxOutputControls.Location = new Point(774, 190);
            groupBoxOutputControls.Name = "groupBoxOutputControls";
            groupBoxOutputControls.Size = new Size(338, 240);
            groupBoxOutputControls.TabIndex = 2;
            groupBoxOutputControls.TabStop = false;
            groupBoxOutputControls.Text = "Output Control";
            // 
            // labelOutputStatus
            // 
            labelOutputStatus.AutoSize = true;
            labelOutputStatus.Font = new Font("Segoe UI", 13.8F, FontStyle.Bold);
            labelOutputStatus.ForeColor = Color.Red;
            labelOutputStatus.Location = new Point(135, 47);
            labelOutputStatus.Name = "labelOutputStatus";
            labelOutputStatus.Size = new Size(55, 31);
            labelOutputStatus.TabIndex = 1;
            labelOutputStatus.Text = "OFF";
            // 
            // buttonOutputToggle
            // 
            buttonOutputToggle.BackColor = Color.FromArgb(192, 0, 0);
            buttonOutputToggle.FlatStyle = FlatStyle.Flat;
            buttonOutputToggle.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
            buttonOutputToggle.ForeColor = Color.White;
            buttonOutputToggle.Location = new Point(84, 125);
            buttonOutputToggle.Name = "buttonOutputToggle";
            buttonOutputToggle.Size = new Size(170, 70);
            buttonOutputToggle.TabIndex = 0;
            buttonOutputToggle.Text = "OUTPUT";
            buttonOutputToggle.UseVisualStyleBackColor = false;
            // 
            // groupBoxChannelSettings
            // 
            groupBoxChannelSettings.Anchor = AnchorStyles.None;
            groupBoxChannelSettings.Controls.Add(labelCurrentUnit);
            groupBoxChannelSettings.Controls.Add(labelVoltageUnit);
            groupBoxChannelSettings.Controls.Add(numericUpDownCurrentLimit);
            groupBoxChannelSettings.Controls.Add(numericUpDownVoltageSetpoint);
            groupBoxChannelSettings.Controls.Add(labelCurrentLimit);
            groupBoxChannelSettings.Controls.Add(labelVoltageSetpoint);
            groupBoxChannelSettings.Controls.Add(buttonApplySettings);
            groupBoxChannelSettings.Font = new Font("Segoe UI", 10.2F);
            groupBoxChannelSettings.Location = new Point(74, 190);
            groupBoxChannelSettings.Name = "groupBoxChannelSettings";
            groupBoxChannelSettings.Size = new Size(338, 240);
            groupBoxChannelSettings.TabIndex = 1;
            groupBoxChannelSettings.TabStop = false;
            groupBoxChannelSettings.Text = "Channel Settings";
            // 
            // labelCurrentUnit
            // 
            labelCurrentUnit.AutoSize = true;
            labelCurrentUnit.Font = new Font("Segoe UI", 10.2F);
            labelCurrentUnit.Location = new Point(265, 98);
            labelCurrentUnit.Name = "labelCurrentUnit";
            labelCurrentUnit.Size = new Size(21, 23);
            labelCurrentUnit.TabIndex = 6;
            labelCurrentUnit.Text = "A";
            // 
            // labelVoltageUnit
            // 
            labelVoltageUnit.AutoSize = true;
            labelVoltageUnit.Font = new Font("Segoe UI", 10.2F);
            labelVoltageUnit.Location = new Point(265, 47);
            labelVoltageUnit.Name = "labelVoltageUnit";
            labelVoltageUnit.Size = new Size(21, 23);
            labelVoltageUnit.TabIndex = 5;
            labelVoltageUnit.Text = "V";
            // 
            // numericUpDownCurrentLimit
            // 
            numericUpDownCurrentLimit.DecimalPlaces = 3;
            numericUpDownCurrentLimit.Font = new Font("Segoe UI", 10.2F);
            numericUpDownCurrentLimit.Increment = new decimal(new int[] { 1, 0, 0, 65536 });
            numericUpDownCurrentLimit.Location = new Point(159, 96);
            numericUpDownCurrentLimit.Maximum = new decimal(new int[] { 20, 0, 0, 0 });
            numericUpDownCurrentLimit.Name = "numericUpDownCurrentLimit";
            numericUpDownCurrentLimit.Size = new Size(100, 30);
            numericUpDownCurrentLimit.TabIndex = 4;
            numericUpDownCurrentLimit.Value = new decimal(new int[] { 1, 0, 0, 0 });
            // 
            // numericUpDownVoltageSetpoint
            // 
            numericUpDownVoltageSetpoint.DecimalPlaces = 2;
            numericUpDownVoltageSetpoint.Font = new Font("Segoe UI", 10.2F);
            numericUpDownVoltageSetpoint.Increment = new decimal(new int[] { 1, 0, 0, 65536 });
            numericUpDownVoltageSetpoint.Location = new Point(159, 45);
            numericUpDownVoltageSetpoint.Maximum = new decimal(new int[] { 30, 0, 0, 0 });
            numericUpDownVoltageSetpoint.Name = "numericUpDownVoltageSetpoint";
            numericUpDownVoltageSetpoint.Size = new Size(100, 30);
            numericUpDownVoltageSetpoint.TabIndex = 3;
            numericUpDownVoltageSetpoint.Value = new decimal(new int[] { 5, 0, 0, 0 });
            // 
            // labelCurrentLimit
            // 
            labelCurrentLimit.AutoSize = true;
            labelCurrentLimit.Font = new Font("Segoe UI", 10.2F);
            labelCurrentLimit.Location = new Point(41, 98);
            labelCurrentLimit.Name = "labelCurrentLimit";
            labelCurrentLimit.Size = new Size(114, 23);
            labelCurrentLimit.TabIndex = 2;
            labelCurrentLimit.Text = "Current Limit:";
            // 
            // labelVoltageSetpoint
            // 
            labelVoltageSetpoint.AutoSize = true;
            labelVoltageSetpoint.Font = new Font("Segoe UI", 10.2F);
            labelVoltageSetpoint.Location = new Point(18, 47);
            labelVoltageSetpoint.Name = "labelVoltageSetpoint";
            labelVoltageSetpoint.Size = new Size(141, 23);
            labelVoltageSetpoint.TabIndex = 1;
            labelVoltageSetpoint.Text = "Voltage Setpoint:";
            // 
            // buttonApplySettings
            // 
            buttonApplySettings.BackColor = Color.FromArgb(0, 122, 204);
            buttonApplySettings.FlatStyle = FlatStyle.Flat;
            buttonApplySettings.Font = new Font("Segoe UI", 10.2F, FontStyle.Bold);
            buttonApplySettings.ForeColor = Color.White;
            buttonApplySettings.Location = new Point(84, 160);
            buttonApplySettings.Name = "buttonApplySettings";
            buttonApplySettings.Size = new Size(170, 50);
            buttonApplySettings.TabIndex = 0;
            buttonApplySettings.Text = "Apply Settings";
            buttonApplySettings.UseVisualStyleBackColor = false;
            // 
            // groupBoxMeasurements
            // 
            groupBoxMeasurements.Anchor = AnchorStyles.None;
            groupBoxMeasurements.Controls.Add(labelPowerReading);
            groupBoxMeasurements.Controls.Add(labelPowerValue);
            groupBoxMeasurements.Controls.Add(labelCurrentReading);
            groupBoxMeasurements.Controls.Add(labelCurrentValue);
            groupBoxMeasurements.Controls.Add(labelVoltageReading);
            groupBoxMeasurements.Controls.Add(labelVoltageValue);
            groupBoxMeasurements.Font = new Font("Segoe UI", 10.2F);
            groupBoxMeasurements.Location = new Point(424, 190);
            groupBoxMeasurements.Name = "groupBoxMeasurements";
            groupBoxMeasurements.Size = new Size(338, 240);
            groupBoxMeasurements.TabIndex = 0;
            groupBoxMeasurements.TabStop = false;
            groupBoxMeasurements.Text = "Measurements";
            // 
            // labelPowerReading
            // 
            labelPowerReading.AutoSize = true;
            labelPowerReading.Font = new Font("Segoe UI", 10.2F);
            labelPowerReading.Location = new Point(35, 150);
            labelPowerReading.Name = "labelPowerReading";
            labelPowerReading.Size = new Size(60, 23);
            labelPowerReading.TabIndex = 5;
            labelPowerReading.Text = "Power:";
            // 
            // labelPowerValue
            // 
            labelPowerValue.AutoSize = true;
            labelPowerValue.Font = new Font("Segoe UI", 13.8F, FontStyle.Bold);
            labelPowerValue.Location = new Point(174, 143);
            labelPowerValue.Name = "labelPowerValue";
            labelPowerValue.Size = new Size(75, 31);
            labelPowerValue.TabIndex = 4;
            labelPowerValue.Text = "0.0 W";
            // 
            // labelCurrentReading
            // 
            labelCurrentReading.AutoSize = true;
            labelCurrentReading.Font = new Font("Segoe UI", 10.2F);
            labelCurrentReading.Location = new Point(35, 98);
            labelCurrentReading.Name = "labelCurrentReading";
            labelCurrentReading.Size = new Size(72, 23);
            labelCurrentReading.TabIndex = 3;
            labelCurrentReading.Text = "Current:";
            // 
            // labelCurrentValue
            // 
            labelCurrentValue.AutoSize = true;
            labelCurrentValue.Font = new Font("Segoe UI", 13.8F, FontStyle.Bold);
            labelCurrentValue.Location = new Point(174, 91);
            labelCurrentValue.Name = "labelCurrentValue";
            labelCurrentValue.Size = new Size(68, 31);
            labelCurrentValue.TabIndex = 2;
            labelCurrentValue.Text = "0.0 A";
            // 
            // labelVoltageReading
            // 
            labelVoltageReading.AutoSize = true;
            labelVoltageReading.Font = new Font("Segoe UI", 10.2F);
            labelVoltageReading.Location = new Point(35, 47);
            labelVoltageReading.Name = "labelVoltageReading";
            labelVoltageReading.Size = new Size(72, 23);
            labelVoltageReading.TabIndex = 1;
            labelVoltageReading.Text = "Voltage:";
            // 
            // labelVoltageValue
            // 
            labelVoltageValue.AutoSize = true;
            labelVoltageValue.Font = new Font("Segoe UI", 13.8F, FontStyle.Bold);
            labelVoltageValue.Location = new Point(174, 40);
            labelVoltageValue.Name = "labelVoltageValue";
            labelVoltageValue.Size = new Size(67, 31);
            labelVoltageValue.TabIndex = 0;
            labelVoltageValue.Text = "0.0 V";
            // 
            // panelPowerSupplyHeader
            // 
            panelPowerSupplyHeader.BackColor = Color.FromArgb(32, 32, 32);
            panelPowerSupplyHeader.Controls.Add(labelPowerSupplyHeader);
            panelPowerSupplyHeader.Controls.Add(pictureBoxPowerSupply);
            panelPowerSupplyHeader.Dock = DockStyle.Top;
            panelPowerSupplyHeader.Location = new Point(3, 3);
            panelPowerSupplyHeader.Name = "panelPowerSupplyHeader";
            panelPowerSupplyHeader.Size = new Size(1186, 110);
            panelPowerSupplyHeader.TabIndex = 0;
            // 
            // labelPowerSupplyHeader
            // 
            labelPowerSupplyHeader.Anchor = AnchorStyles.None;
            labelPowerSupplyHeader.AutoSize = true;
            labelPowerSupplyHeader.Font = new Font("Segoe UI", 18F, FontStyle.Bold);
            labelPowerSupplyHeader.ForeColor = Color.White;
            labelPowerSupplyHeader.Location = new Point(420, 34);
            labelPowerSupplyHeader.Name = "labelPowerSupplyHeader";
            labelPowerSupplyHeader.Size = new Size(698, 41);
            labelPowerSupplyHeader.TabIndex = 1;
            labelPowerSupplyHeader.Text = "PROGRAMMABLE DC POWER SUPPLY CONTROL";
            // 
            // pictureBoxPowerSupply
            // 
            pictureBoxPowerSupply.Location = new Point(20, 10);
            pictureBoxPowerSupply.Name = "pictureBoxPowerSupply";
            pictureBoxPowerSupply.Size = new Size(90, 90);
            pictureBoxPowerSupply.SizeMode = PictureBoxSizeMode.StretchImage;
            pictureBoxPowerSupply.TabIndex = 0;
            pictureBoxPowerSupply.TabStop = false;
            // 
            // tabPagePowerLogger
            // 
            tabPagePowerLogger.Controls.Add(splitContainerLogger);
            tabPagePowerLogger.Location = new Point(4, 29);
            tabPagePowerLogger.Name = "tabPagePowerLogger";
            tabPagePowerLogger.Padding = new Padding(3);
            tabPagePowerLogger.Size = new Size(1192, 735);
            tabPagePowerLogger.TabIndex = 2;
            tabPagePowerLogger.Text = "Power Logger";
            tabPagePowerLogger.UseVisualStyleBackColor = true;
            // 
            // splitContainerLogger
            // 
            splitContainerLogger.Dock = DockStyle.Fill;
            splitContainerLogger.FixedPanel = FixedPanel.Panel1;
            splitContainerLogger.Location = new Point(3, 3);
            splitContainerLogger.Name = "splitContainerLogger";
            // 
            // splitContainerLogger.Panel1
            // 
            splitContainerLogger.Panel1.Controls.Add(panelLoggerControls);
            // 
            // splitContainerLogger.Panel2
            // 
            splitContainerLogger.Panel2.Controls.Add(tabControlCharts);
            splitContainerLogger.Size = new Size(1186, 729);
            splitContainerLogger.SplitterDistance = 285;
            splitContainerLogger.TabIndex = 0;
            // 
            // panelLoggerControls
            // 
            panelLoggerControls.Controls.Add(groupBoxLoggingControls);
            panelLoggerControls.Controls.Add(groupBoxSessionInfo);
            panelLoggerControls.Dock = DockStyle.Fill;
            panelLoggerControls.Location = new Point(0, 0);
            panelLoggerControls.Name = "panelLoggerControls";
            panelLoggerControls.Size = new Size(285, 729);
            panelLoggerControls.TabIndex = 0;
            // 
            // groupBoxLoggingControls
            // 
            groupBoxLoggingControls.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            groupBoxLoggingControls.Controls.Add(checkBoxAutoScroll);
            groupBoxLoggingControls.Controls.Add(buttonExportData);
            groupBoxLoggingControls.Controls.Add(buttonClearData);
            groupBoxLoggingControls.Controls.Add(checkBoxAutoLog);
            groupBoxLoggingControls.Controls.Add(numericUpDownSampleRate);
            groupBoxLoggingControls.Controls.Add(labelSampleRate);
            groupBoxLoggingControls.Font = new Font("Segoe UI", 10.2F);
            groupBoxLoggingControls.Location = new Point(14, 306);
            groupBoxLoggingControls.Name = "groupBoxLoggingControls";
            groupBoxLoggingControls.Size = new Size(257, 355);
            groupBoxLoggingControls.TabIndex = 1;
            groupBoxLoggingControls.TabStop = false;
            groupBoxLoggingControls.Text = "Logging Controls";
            // 
            // checkBoxAutoScroll
            // 
            checkBoxAutoScroll.AutoSize = true;
            checkBoxAutoScroll.Checked = true;
            checkBoxAutoScroll.CheckState = CheckState.Checked;
            checkBoxAutoScroll.Location = new Point(33, 142);
            checkBoxAutoScroll.Name = "checkBoxAutoScroll";
            checkBoxAutoScroll.Size = new Size(115, 27);
            checkBoxAutoScroll.TabIndex = 5;
            checkBoxAutoScroll.Text = "Auto Scroll";
            checkBoxAutoScroll.UseVisualStyleBackColor = true;
            // 
            // buttonExportData
            // 
            buttonExportData.BackColor = Color.FromArgb(0, 122, 204);
            buttonExportData.FlatStyle = FlatStyle.Flat;
            buttonExportData.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            buttonExportData.ForeColor = Color.White;
            buttonExportData.Location = new Point(33, 285);
            buttonExportData.Name = "buttonExportData";
            buttonExportData.Size = new Size(185, 40);
            buttonExportData.TabIndex = 4;
            buttonExportData.Text = "Export Data";
            buttonExportData.UseVisualStyleBackColor = false;
            // 
            // buttonClearData
            // 
            buttonClearData.Location = new Point(33, 231);
            buttonClearData.Name = "buttonClearData";
            buttonClearData.Size = new Size(185, 40);
            buttonClearData.TabIndex = 3;
            buttonClearData.Text = "Clear Data";
            buttonClearData.UseVisualStyleBackColor = true;
            // 
            // checkBoxAutoLog
            // 
            checkBoxAutoLog.AutoSize = true;
            checkBoxAutoLog.Checked = true;
            checkBoxAutoLog.CheckState = CheckState.Checked;
            checkBoxAutoLog.Location = new Point(33, 98);
            checkBoxAutoLog.Name = "checkBoxAutoLog";
            checkBoxAutoLog.Size = new Size(102, 27);
            checkBoxAutoLog.TabIndex = 2;
            checkBoxAutoLog.Text = "Auto Log";
            checkBoxAutoLog.UseVisualStyleBackColor = true;
            checkBoxAutoLog.CheckedChanged += checkBoxAutoLog_CheckedChanged_1;
            // 
            // numericUpDownSampleRate
            // 
            numericUpDownSampleRate.Location = new Point(142, 45);
            numericUpDownSampleRate.Maximum = new decimal(new int[] { 10000, 0, 0, 0 });
            numericUpDownSampleRate.Minimum = new decimal(new int[] { 100, 0, 0, 0 });
            numericUpDownSampleRate.Name = "numericUpDownSampleRate";
            numericUpDownSampleRate.Size = new Size(100, 30);
            numericUpDownSampleRate.TabIndex = 1;
            numericUpDownSampleRate.Value = new decimal(new int[] { 1000, 0, 0, 0 });
            // 
            // labelSampleRate
            // 
            labelSampleRate.AutoSize = true;
            labelSampleRate.Location = new Point(33, 47);
            labelSampleRate.Name = "labelSampleRate";
            labelSampleRate.Size = new Size(107, 23);
            labelSampleRate.TabIndex = 0;
            labelSampleRate.Text = "Sample (ms):";
            // 
            // groupBoxSessionInfo
            // 
            groupBoxSessionInfo.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            groupBoxSessionInfo.Controls.Add(labelElapsedTimeValue);
            groupBoxSessionInfo.Controls.Add(labelElapsedTime);
            groupBoxSessionInfo.Controls.Add(labelDataPointsValue);
            groupBoxSessionInfo.Controls.Add(labelDataPoints);
            groupBoxSessionInfo.Controls.Add(labelMaxPowerValue);
            groupBoxSessionInfo.Controls.Add(labelMaxPower);
            groupBoxSessionInfo.Controls.Add(labelAveragePowerValue);
            groupBoxSessionInfo.Controls.Add(labelAveragePower);
            groupBoxSessionInfo.Font = new Font("Segoe UI", 10.2F);
            groupBoxSessionInfo.Location = new Point(14, 14);
            groupBoxSessionInfo.Name = "groupBoxSessionInfo";
            groupBoxSessionInfo.Size = new Size(257, 275);
            groupBoxSessionInfo.TabIndex = 0;
            groupBoxSessionInfo.TabStop = false;
            groupBoxSessionInfo.Text = "Session Information";
            // 
            // labelElapsedTimeValue
            // 
            labelElapsedTimeValue.AutoSize = true;
            labelElapsedTimeValue.Font = new Font("Segoe UI", 10.2F, FontStyle.Bold);
            labelElapsedTimeValue.Location = new Point(142, 205);
            labelElapsedTimeValue.Name = "labelElapsedTimeValue";
            labelElapsedTimeValue.Size = new Size(80, 23);
            labelElapsedTimeValue.TabIndex = 7;
            labelElapsedTimeValue.Text = "00:00:00";
            // 
            // labelElapsedTime
            // 
            labelElapsedTime.AutoSize = true;
            labelElapsedTime.Location = new Point(31, 205);
            labelElapsedTime.Name = "labelElapsedTime";
            labelElapsedTime.Size = new Size(90, 23);
            labelElapsedTime.TabIndex = 6;
            labelElapsedTime.Text = "Elapsed T.:";
            // 
            // labelDataPointsValue
            // 
            labelDataPointsValue.AutoSize = true;
            labelDataPointsValue.Font = new Font("Segoe UI", 10.2F, FontStyle.Bold);
            labelDataPointsValue.Location = new Point(142, 155);
            labelDataPointsValue.Name = "labelDataPointsValue";
            labelDataPointsValue.Size = new Size(20, 23);
            labelDataPointsValue.TabIndex = 5;
            labelDataPointsValue.Text = "0";
            // 
            // labelDataPoints
            // 
            labelDataPoints.AutoSize = true;
            labelDataPoints.Location = new Point(31, 155);
            labelDataPoints.Name = "labelDataPoints";
            labelDataPoints.Size = new Size(101, 23);
            labelDataPoints.TabIndex = 4;
            labelDataPoints.Text = "Data Points:";
            // 
            // labelMaxPowerValue
            // 
            labelMaxPowerValue.AutoSize = true;
            labelMaxPowerValue.Font = new Font("Segoe UI", 10.2F, FontStyle.Bold);
            labelMaxPowerValue.Location = new Point(142, 105);
            labelMaxPowerValue.Name = "labelMaxPowerValue";
            labelMaxPowerValue.Size = new Size(57, 23);
            labelMaxPowerValue.TabIndex = 3;
            labelMaxPowerValue.Text = "0.0 W";
            // 
            // labelMaxPower
            // 
            labelMaxPower.AutoSize = true;
            labelMaxPower.Location = new Point(31, 105);
            labelMaxPower.Name = "labelMaxPower";
            labelMaxPower.Size = new Size(97, 23);
            labelMaxPower.TabIndex = 2;
            labelMaxPower.Text = "Max Power:";
            // 
            // labelAveragePowerValue
            // 
            labelAveragePowerValue.AutoSize = true;
            labelAveragePowerValue.Font = new Font("Segoe UI", 10.2F, FontStyle.Bold);
            labelAveragePowerValue.Location = new Point(142, 55);
            labelAveragePowerValue.Name = "labelAveragePowerValue";
            labelAveragePowerValue.Size = new Size(57, 23);
            labelAveragePowerValue.TabIndex = 1;
            labelAveragePowerValue.Text = "0.0 W";
            // 
            // labelAveragePower
            // 
            labelAveragePower.AutoSize = true;
            labelAveragePower.Location = new Point(31, 55);
            labelAveragePower.Name = "labelAveragePower";
            labelAveragePower.Size = new Size(47, 23);
            labelAveragePower.TabIndex = 0;
            labelAveragePower.Text = "Avg.:";
            // 
            // tabControlCharts
            // 
            tabControlCharts.Controls.Add(tabPageRealTime);
            tabControlCharts.Controls.Add(tabPageHistorical);
            tabControlCharts.Dock = DockStyle.Fill;
            tabControlCharts.Location = new Point(0, 0);
            tabControlCharts.Name = "tabControlCharts";
            tabControlCharts.SelectedIndex = 0;
            tabControlCharts.Size = new Size(897, 729);
            tabControlCharts.TabIndex = 0;
            // 
            // tabPageRealTime
            // 
            tabPageRealTime.Controls.Add(plotViewRealTime);
            tabPageRealTime.Location = new Point(4, 29);
            tabPageRealTime.Name = "tabPageRealTime";
            tabPageRealTime.Padding = new Padding(3);
            tabPageRealTime.Size = new Size(889, 696);
            tabPageRealTime.TabIndex = 0;
            tabPageRealTime.Text = "Real-Time";
            tabPageRealTime.UseVisualStyleBackColor = true;
            // 
            // plotViewRealTime
            // 
            plotViewRealTime.DisplayScale = 1.25F;
            plotViewRealTime.Dock = DockStyle.Fill;
            plotViewRealTime.Location = new Point(3, 3);
            plotViewRealTime.Name = "plotViewRealTime";
            plotViewRealTime.Size = new Size(883, 690);
            plotViewRealTime.TabIndex = 0;
            // 
            // tabPageHistorical
            // 
            tabPageHistorical.Controls.Add(plotViewHistorical);
            tabPageHistorical.Location = new Point(4, 29);
            tabPageHistorical.Name = "tabPageHistorical";
            tabPageHistorical.Padding = new Padding(3);
            tabPageHistorical.Size = new Size(889, 696);
            tabPageHistorical.TabIndex = 1;
            tabPageHistorical.Text = "Historical";
            tabPageHistorical.UseVisualStyleBackColor = true;
            // 
            // plotViewHistorical
            // 
            plotViewHistorical.DisplayScale = 1.25F;
            plotViewHistorical.Dock = DockStyle.Fill;
            plotViewHistorical.Location = new Point(3, 3);
            plotViewHistorical.Name = "plotViewHistorical";
            plotViewHistorical.Size = new Size(883, 690);
            plotViewHistorical.TabIndex = 0;
            // 
            // statusStrip
            // 
            statusStrip.ImageScalingSize = new Size(20, 20);
            statusStrip.Items.AddRange(new ToolStripItem[] { toolStripStatusLabel, toolStripProgressBar });
            statusStrip.Location = new Point(0, 768);
            statusStrip.Name = "statusStrip";
            statusStrip.Size = new Size(1200, 26);
            statusStrip.TabIndex = 1;
            statusStrip.Text = "statusStrip1";
            // 
            // toolStripStatusLabel
            // 
            toolStripStatusLabel.Name = "toolStripStatusLabel";
            toolStripStatusLabel.Size = new Size(50, 20);
            toolStripStatusLabel.Text = "Ready";
            // 
            // toolStripProgressBar
            // 
            toolStripProgressBar.Name = "toolStripProgressBar";
            toolStripProgressBar.Size = new Size(100, 18);
            // 
            // timerUpdateReadings
            // 
            timerUpdateReadings.Interval = 1000;
            // 
            // timerElapsedTime
            // 
            timerElapsedTime.Interval = 1000;
            // 
            // Form1
            // 
            AutoScaleDimensions = new SizeF(8F, 20F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1200, 794);
            Controls.Add(mainTabControl);
            Controls.Add(statusStrip);
            MinimumSize = new Size(1000, 700);
            Name = "Form1";
            Text = "Serial Power Logger & Supply Control";
            mainTabControl.ResumeLayout(false);
            tabPageSerialConnection.ResumeLayout(false);
            tabPageSerialConnection.PerformLayout();
            groupBoxConnection.ResumeLayout(false);
            groupBoxConnection.PerformLayout();
            tabPagePowerSupply.ResumeLayout(false);
            panelPowerSupplyControls.ResumeLayout(false);
            groupBoxOutputControls.ResumeLayout(false);
            groupBoxOutputControls.PerformLayout();
            groupBoxChannelSettings.ResumeLayout(false);
            groupBoxChannelSettings.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)numericUpDownCurrentLimit).EndInit();
            ((System.ComponentModel.ISupportInitialize)numericUpDownVoltageSetpoint).EndInit();
            groupBoxMeasurements.ResumeLayout(false);
            groupBoxMeasurements.PerformLayout();
            panelPowerSupplyHeader.ResumeLayout(false);
            panelPowerSupplyHeader.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)pictureBoxPowerSupply).EndInit();
            tabPagePowerLogger.ResumeLayout(false);
            splitContainerLogger.Panel1.ResumeLayout(false);
            splitContainerLogger.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerLogger).EndInit();
            splitContainerLogger.ResumeLayout(false);
            panelLoggerControls.ResumeLayout(false);
            groupBoxLoggingControls.ResumeLayout(false);
            groupBoxLoggingControls.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)numericUpDownSampleRate).EndInit();
            groupBoxSessionInfo.ResumeLayout(false);
            groupBoxSessionInfo.PerformLayout();
            tabControlCharts.ResumeLayout(false);
            tabPageRealTime.ResumeLayout(false);
            tabPageHistorical.ResumeLayout(false);
            statusStrip.ResumeLayout(false);
            statusStrip.PerformLayout();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private TabControl mainTabControl;
        private TabPage tabPageSerialConnection;
        private TabPage tabPagePowerSupply;
        private TabPage tabPagePowerLogger;
        private GroupBox groupBoxConnection;
        private ComboBox comboBoxBaudRate;
        private ComboBox comboBoxComPort;
        private Button buttonConnect;
        private Button buttonRefreshPorts;
        private Label labelBaudRate;
        private Label labelComPort;
        private Label labelConnectionStatus;
        private StatusStrip statusStrip;
        private ToolStripStatusLabel toolStripStatusLabel;
        private ToolStripProgressBar toolStripProgressBar;
        private System.Windows.Forms.Timer timerUpdateReadings;
        private SplitContainer splitContainerLogger;
        private Panel panelLoggerControls;
        private GroupBox groupBoxSessionInfo;
        private Label labelElapsedTimeValue;
        private Label labelElapsedTime;
        private Label labelDataPointsValue;
        private Label labelDataPoints;
        private Label labelMaxPowerValue;
        private Label labelMaxPower;
        private Label labelAveragePowerValue;
        private Label labelAveragePower;
        private TabControl tabControlCharts;
        private TabPage tabPageRealTime;
        private TabPage tabPageHistorical;
        private ScottPlot.WinForms.FormsPlot plotViewRealTime;
        private ScottPlot.WinForms.FormsPlot plotViewHistorical;
        private GroupBox groupBoxLoggingControls;
        private CheckBox checkBoxAutoScroll;
        private Button buttonExportData;
        private Button buttonClearData;
        private CheckBox checkBoxAutoLog;
        private NumericUpDown numericUpDownSampleRate;
        private Label labelSampleRate;
        private Panel panelPowerSupplyHeader;
        private Label labelPowerSupplyHeader;
        private PictureBox pictureBoxPowerSupply;
        private Panel panelPowerSupplyControls;
        private GroupBox groupBoxMeasurements;
        private Label labelVoltageReading;
        private Label labelVoltageValue;
        private Label labelPowerReading;
        private Label labelPowerValue;
        private Label labelCurrentReading;
        private Label labelCurrentValue;
        private GroupBox groupBoxChannelSettings;
        private Label labelCurrentUnit;
        private Label labelVoltageUnit;
        private NumericUpDown numericUpDownCurrentLimit;
        private NumericUpDown numericUpDownVoltageSetpoint;
        private Label labelCurrentLimit;
        private Label labelVoltageSetpoint;
        private Button buttonApplySettings;
        private GroupBox groupBoxOutputControls;
        private Label labelOutputStatus;
        private Button buttonOutputToggle;
        private System.Windows.Forms.Timer timerElapsedTime;
    }
}
