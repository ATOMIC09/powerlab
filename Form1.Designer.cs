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
            splitContainer = new SplitContainer();
            tabControl = new TabControl();
            tabPageControl = new TabPage();
            groupBoxPowerControl = new GroupBox();
            numericUpDownCurrent = new NumericUpDown();
            numericUpDownVoltage = new NumericUpDown();
            buttonSetOutput = new Button();
            checkBoxOutputEnable = new CheckBox();
            labelCurrent = new Label();
            labelVoltage = new Label();
            groupBoxConnection = new GroupBox();
            comboBoxBaudRate = new ComboBox();
            comboBoxComPort = new ComboBox();
            buttonConnect = new Button();
            buttonRefreshPorts = new Button();
            labelBaudRate = new Label();
            labelComPort = new Label();
            groupBoxStatus = new GroupBox();
            labelPowerValue = new Label();
            labelCurrentValue = new Label();
            labelVoltageValue = new Label();
            labelPower = new Label();
            labelCurrentReading = new Label();
            labelVoltageReading = new Label();
            labelConnectionStatus = new Label();
            tabPageSettings = new TabPage();
            groupBoxLogging = new GroupBox();
            buttonExportCSV = new Button();
            buttonClearLog = new Button();
            checkBoxAutoLog = new CheckBox();
            numericUpDownSampleRate = new NumericUpDown();
            labelSampleRate = new Label();
            plotView = new ScottPlot.WinForms.FormsPlot();
            statusStrip = new StatusStrip();
            toolStripStatusLabel = new ToolStripStatusLabel();
            toolStripProgressBar = new ToolStripProgressBar();
            timerUpdateReadings = new System.Windows.Forms.Timer(components);
            ((System.ComponentModel.ISupportInitialize)splitContainer).BeginInit();
            splitContainer.Panel1.SuspendLayout();
            splitContainer.Panel2.SuspendLayout();
            splitContainer.SuspendLayout();
            tabControl.SuspendLayout();
            tabPageControl.SuspendLayout();
            groupBoxPowerControl.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)numericUpDownCurrent).BeginInit();
            ((System.ComponentModel.ISupportInitialize)numericUpDownVoltage).BeginInit();
            groupBoxConnection.SuspendLayout();
            groupBoxStatus.SuspendLayout();
            tabPageSettings.SuspendLayout();
            groupBoxLogging.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)numericUpDownSampleRate).BeginInit();
            statusStrip.SuspendLayout();
            SuspendLayout();
            // 
            // splitContainer
            // 
            splitContainer.Dock = DockStyle.Fill;
            splitContainer.Location = new Point(0, 0);
            splitContainer.Name = "splitContainer";
            splitContainer.Orientation = Orientation.Horizontal;
            // 
            // splitContainer.Panel1
            // 
            splitContainer.Panel1.Controls.Add(tabControl);
            // 
            // splitContainer.Panel2
            // 
            splitContainer.Panel2.Controls.Add(plotView);
            splitContainer.Panel2MinSize = 200;
            splitContainer.Size = new Size(1024, 742);
            splitContainer.SplitterDistance = 338;
            splitContainer.TabIndex = 0;
            // 
            // tabControl
            // 
            tabControl.Controls.Add(tabPageControl);
            tabControl.Controls.Add(tabPageSettings);
            tabControl.Dock = DockStyle.Fill;
            tabControl.Location = new Point(0, 0);
            tabControl.Name = "tabControl";
            tabControl.SelectedIndex = 0;
            tabControl.Size = new Size(1024, 338);
            tabControl.TabIndex = 0;
            // 
            // tabPageControl
            // 
            tabPageControl.Controls.Add(groupBoxPowerControl);
            tabPageControl.Controls.Add(groupBoxConnection);
            tabPageControl.Controls.Add(groupBoxStatus);
            tabPageControl.Location = new Point(4, 29);
            tabPageControl.Name = "tabPageControl";
            tabPageControl.Padding = new Padding(3);
            tabPageControl.Size = new Size(1016, 305);
            tabPageControl.TabIndex = 0;
            tabPageControl.Text = "Control";
            tabPageControl.UseVisualStyleBackColor = true;
            // 
            // groupBoxPowerControl
            // 
            groupBoxPowerControl.Controls.Add(numericUpDownCurrent);
            groupBoxPowerControl.Controls.Add(numericUpDownVoltage);
            groupBoxPowerControl.Controls.Add(buttonSetOutput);
            groupBoxPowerControl.Controls.Add(checkBoxOutputEnable);
            groupBoxPowerControl.Controls.Add(labelCurrent);
            groupBoxPowerControl.Controls.Add(labelVoltage);
            groupBoxPowerControl.Location = new Point(342, 15);
            groupBoxPowerControl.Name = "groupBoxPowerControl";
            groupBoxPowerControl.Size = new Size(330, 288);
            groupBoxPowerControl.TabIndex = 2;
            groupBoxPowerControl.TabStop = false;
            groupBoxPowerControl.Text = "Power Supply Control";
            // 
            // numericUpDownCurrent
            // 
            numericUpDownCurrent.DecimalPlaces = 3;
            numericUpDownCurrent.Increment = new decimal(new int[] { 1, 0, 0, 65536 });
            numericUpDownCurrent.Location = new Point(159, 90);
            numericUpDownCurrent.Maximum = new decimal(new int[] { 10, 0, 0, 0 });
            numericUpDownCurrent.Name = "numericUpDownCurrent";
            numericUpDownCurrent.Size = new Size(150, 27);
            numericUpDownCurrent.TabIndex = 5;
            numericUpDownCurrent.Value = new decimal(new int[] { 1, 0, 0, 0 });
            // 
            // numericUpDownVoltage
            // 
            numericUpDownVoltage.DecimalPlaces = 2;
            numericUpDownVoltage.Increment = new decimal(new int[] { 1, 0, 0, 65536 });
            numericUpDownVoltage.Location = new Point(159, 39);
            numericUpDownVoltage.Maximum = new decimal(new int[] { 30, 0, 0, 0 });
            numericUpDownVoltage.Name = "numericUpDownVoltage";
            numericUpDownVoltage.Size = new Size(150, 27);
            numericUpDownVoltage.TabIndex = 4;
            numericUpDownVoltage.Value = new decimal(new int[] { 5, 0, 0, 0 });
            // 
            // buttonSetOutput
            // 
            buttonSetOutput.Location = new Point(159, 140);
            buttonSetOutput.Name = "buttonSetOutput";
            buttonSetOutput.Size = new Size(150, 29);
            buttonSetOutput.TabIndex = 3;
            buttonSetOutput.Text = "Set Output";
            buttonSetOutput.UseVisualStyleBackColor = true;
            // 
            // checkBoxOutputEnable
            // 
            checkBoxOutputEnable.AutoSize = true;
            checkBoxOutputEnable.Location = new Point(31, 144);
            checkBoxOutputEnable.Name = "checkBoxOutputEnable";
            checkBoxOutputEnable.Size = new Size(100, 24);
            checkBoxOutputEnable.TabIndex = 2;
            checkBoxOutputEnable.Text = "Output On";
            checkBoxOutputEnable.UseVisualStyleBackColor = true;
            // 
            // labelCurrent
            // 
            labelCurrent.AutoSize = true;
            labelCurrent.Location = new Point(31, 92);
            labelCurrent.Name = "labelCurrent";
            labelCurrent.Size = new Size(84, 20);
            labelCurrent.TabIndex = 1;
            labelCurrent.Text = "Current (A):";
            // 
            // labelVoltage
            // 
            labelVoltage.AutoSize = true;
            labelVoltage.Location = new Point(31, 41);
            labelVoltage.Name = "labelVoltage";
            labelVoltage.Size = new Size(86, 20);
            labelVoltage.TabIndex = 0;
            labelVoltage.Text = "Voltage (V):";
            // 
            // groupBoxConnection
            // 
            groupBoxConnection.Controls.Add(comboBoxBaudRate);
            groupBoxConnection.Controls.Add(comboBoxComPort);
            groupBoxConnection.Controls.Add(buttonConnect);
            groupBoxConnection.Controls.Add(buttonRefreshPorts);
            groupBoxConnection.Controls.Add(labelBaudRate);
            groupBoxConnection.Controls.Add(labelComPort);
            groupBoxConnection.Location = new Point(6, 15);
            groupBoxConnection.Name = "groupBoxConnection";
            groupBoxConnection.Size = new Size(330, 288);
            groupBoxConnection.TabIndex = 1;
            groupBoxConnection.TabStop = false;
            groupBoxConnection.Text = "Connection";
            // 
            // comboBoxBaudRate
            // 
            comboBoxBaudRate.FormattingEnabled = true;
            comboBoxBaudRate.Items.AddRange(new object[] { "4800", "9600", "19200", "38400", "57600", "115200" });
            comboBoxBaudRate.Location = new Point(122, 90);
            comboBoxBaudRate.Name = "comboBoxBaudRate";
            comboBoxBaudRate.Size = new Size(183, 28);
            comboBoxBaudRate.TabIndex = 5;
            comboBoxBaudRate.Text = "9600";
            // 
            // comboBoxComPort
            // 
            comboBoxComPort.FormattingEnabled = true;
            comboBoxComPort.Location = new Point(122, 39);
            comboBoxComPort.Name = "comboBoxComPort";
            comboBoxComPort.Size = new Size(183, 28);
            comboBoxComPort.TabIndex = 4;
            // 
            // buttonConnect
            // 
            buttonConnect.Location = new Point(122, 184);
            buttonConnect.Name = "buttonConnect";
            buttonConnect.Size = new Size(183, 29);
            buttonConnect.TabIndex = 3;
            buttonConnect.Text = "Connect";
            buttonConnect.UseVisualStyleBackColor = true;
            // 
            // buttonRefreshPorts
            // 
            buttonRefreshPorts.Location = new Point(122, 140);
            buttonRefreshPorts.Name = "buttonRefreshPorts";
            buttonRefreshPorts.Size = new Size(183, 29);
            buttonRefreshPorts.TabIndex = 2;
            buttonRefreshPorts.Text = "Refresh Ports";
            buttonRefreshPorts.UseVisualStyleBackColor = true;
            // 
            // labelBaudRate
            // 
            labelBaudRate.AutoSize = true;
            labelBaudRate.Location = new Point(18, 93);
            labelBaudRate.Name = "labelBaudRate";
            labelBaudRate.Size = new Size(80, 20);
            labelBaudRate.TabIndex = 1;
            labelBaudRate.Text = "Baud Rate:";
            // 
            // labelComPort
            // 
            labelComPort.AutoSize = true;
            labelComPort.Location = new Point(18, 42);
            labelComPort.Name = "labelComPort";
            labelComPort.Size = new Size(75, 20);
            labelComPort.TabIndex = 0;
            labelComPort.Text = "COM Port:";
            // 
            // groupBoxStatus
            // 
            groupBoxStatus.Controls.Add(labelPowerValue);
            groupBoxStatus.Controls.Add(labelCurrentValue);
            groupBoxStatus.Controls.Add(labelVoltageValue);
            groupBoxStatus.Controls.Add(labelPower);
            groupBoxStatus.Controls.Add(labelCurrentReading);
            groupBoxStatus.Controls.Add(labelVoltageReading);
            groupBoxStatus.Controls.Add(labelConnectionStatus);
            groupBoxStatus.Location = new Point(678, 15);
            groupBoxStatus.Name = "groupBoxStatus";
            groupBoxStatus.Size = new Size(330, 288);
            groupBoxStatus.TabIndex = 0;
            groupBoxStatus.TabStop = false;
            groupBoxStatus.Text = "Status";
            // 
            // labelPowerValue
            // 
            labelPowerValue.AutoSize = true;
            labelPowerValue.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            labelPowerValue.Location = new Point(167, 146);
            labelPowerValue.Name = "labelPowerValue";
            labelPowerValue.Size = new Size(46, 20);
            labelPowerValue.TabIndex = 6;
            labelPowerValue.Text = "0.0W";
            // 
            // labelCurrentValue
            // 
            labelCurrentValue.AutoSize = true;
            labelCurrentValue.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            labelCurrentValue.Location = new Point(167, 110);
            labelCurrentValue.Name = "labelCurrentValue";
            labelCurrentValue.Size = new Size(42, 20);
            labelCurrentValue.TabIndex = 5;
            labelCurrentValue.Text = "0.0A";
            // 
            // labelVoltageValue
            // 
            labelVoltageValue.AutoSize = true;
            labelVoltageValue.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            labelVoltageValue.Location = new Point(167, 74);
            labelVoltageValue.Name = "labelVoltageValue";
            labelVoltageValue.Size = new Size(41, 20);
            labelVoltageValue.TabIndex = 4;
            labelVoltageValue.Text = "0.0V";
            // 
            // labelPower
            // 
            labelPower.AutoSize = true;
            labelPower.Location = new Point(20, 146);
            labelPower.Name = "labelPower";
            labelPower.Size = new Size(52, 20);
            labelPower.TabIndex = 3;
            labelPower.Text = "Power:";
            // 
            // labelCurrentReading
            // 
            labelCurrentReading.AutoSize = true;
            labelCurrentReading.Location = new Point(20, 110);
            labelCurrentReading.Name = "labelCurrentReading";
            labelCurrentReading.Size = new Size(60, 20);
            labelCurrentReading.TabIndex = 2;
            labelCurrentReading.Text = "Current:";
            // 
            // labelVoltageReading
            // 
            labelVoltageReading.AutoSize = true;
            labelVoltageReading.Location = new Point(20, 74);
            labelVoltageReading.Name = "labelVoltageReading";
            labelVoltageReading.Size = new Size(63, 20);
            labelVoltageReading.TabIndex = 1;
            labelVoltageReading.Text = "Voltage:";
            // 
            // labelConnectionStatus
            // 
            labelConnectionStatus.AutoSize = true;
            labelConnectionStatus.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            labelConnectionStatus.ForeColor = Color.Red;
            labelConnectionStatus.Location = new Point(20, 38);
            labelConnectionStatus.Name = "labelConnectionStatus";
            labelConnectionStatus.Size = new Size(103, 20);
            labelConnectionStatus.TabIndex = 0;
            labelConnectionStatus.Text = "Disconnected";
            // 
            // tabPageSettings
            // 
            tabPageSettings.Controls.Add(groupBoxLogging);
            tabPageSettings.Location = new Point(4, 29);
            tabPageSettings.Name = "tabPageSettings";
            tabPageSettings.Padding = new Padding(3);
            tabPageSettings.Size = new Size(1016, 317);
            tabPageSettings.TabIndex = 1;
            tabPageSettings.Text = "Settings";
            tabPageSettings.UseVisualStyleBackColor = true;
            // 
            // groupBoxLogging
            // 
            groupBoxLogging.Controls.Add(buttonExportCSV);
            groupBoxLogging.Controls.Add(buttonClearLog);
            groupBoxLogging.Controls.Add(checkBoxAutoLog);
            groupBoxLogging.Controls.Add(numericUpDownSampleRate);
            groupBoxLogging.Controls.Add(labelSampleRate);
            groupBoxLogging.Location = new Point(18, 15);
            groupBoxLogging.Name = "groupBoxLogging";
            groupBoxLogging.Size = new Size(330, 288);
            groupBoxLogging.TabIndex = 0;
            groupBoxLogging.TabStop = false;
            groupBoxLogging.Text = "Logging";
            // 
            // buttonExportCSV
            // 
            buttonExportCSV.Location = new Point(160, 193);
            buttonExportCSV.Name = "buttonExportCSV";
            buttonExportCSV.Size = new Size(150, 29);
            buttonExportCSV.TabIndex = 4;
            buttonExportCSV.Text = "Export CSV";
            buttonExportCSV.UseVisualStyleBackColor = true;
            // 
            // buttonClearLog
            // 
            buttonClearLog.Location = new Point(160, 146);
            buttonClearLog.Name = "buttonClearLog";
            buttonClearLog.Size = new Size(150, 29);
            buttonClearLog.TabIndex = 3;
            buttonClearLog.Text = "Clear Log";
            buttonClearLog.UseVisualStyleBackColor = true;
            // 
            // checkBoxAutoLog
            // 
            checkBoxAutoLog.AutoSize = true;
            checkBoxAutoLog.Checked = true;
            checkBoxAutoLog.CheckState = CheckState.Checked;
            checkBoxAutoLog.Location = new Point(30, 99);
            checkBoxAutoLog.Name = "checkBoxAutoLog";
            checkBoxAutoLog.Size = new Size(129, 24);
            checkBoxAutoLog.TabIndex = 2;
            checkBoxAutoLog.Text = "Automatic Log";
            checkBoxAutoLog.UseVisualStyleBackColor = true;
            // 
            // numericUpDownSampleRate
            // 
            numericUpDownSampleRate.Location = new Point(160, 43);
            numericUpDownSampleRate.Maximum = new decimal(new int[] { 10000, 0, 0, 0 });
            numericUpDownSampleRate.Minimum = new decimal(new int[] { 100, 0, 0, 0 });
            numericUpDownSampleRate.Name = "numericUpDownSampleRate";
            numericUpDownSampleRate.Size = new Size(150, 27);
            numericUpDownSampleRate.TabIndex = 1;
            numericUpDownSampleRate.Value = new decimal(new int[] { 1000, 0, 0, 0 });
            // 
            // labelSampleRate
            // 
            labelSampleRate.AutoSize = true;
            labelSampleRate.Location = new Point(30, 45);
            labelSampleRate.Name = "labelSampleRate";
            labelSampleRate.Size = new Size(129, 20);
            labelSampleRate.TabIndex = 0;
            labelSampleRate.Text = "Sample Rate (ms):";
            // 
            // plotView
            // 
            plotView.DisplayScale = 1.25F;
            plotView.Dock = DockStyle.Fill;
            plotView.Location = new Point(0, 0);
            plotView.Name = "plotView";
            plotView.Size = new Size(1024, 400);
            plotView.TabIndex = 0;
            // 
            // statusStrip
            // 
            statusStrip.ImageScalingSize = new Size(20, 20);
            statusStrip.Items.AddRange(new ToolStripItem[] { toolStripStatusLabel, toolStripProgressBar });
            statusStrip.Location = new Point(0, 742);
            statusStrip.Name = "statusStrip";
            statusStrip.Size = new Size(1024, 26);
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
            // Form1
            // 
            AutoScaleDimensions = new SizeF(8F, 20F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1024, 768);
            Controls.Add(splitContainer);
            Controls.Add(statusStrip);
            MinimumSize = new Size(1000, 700);
            Name = "Form1";
            Text = "Power Logger Meter";
            splitContainer.Panel1.ResumeLayout(false);
            splitContainer.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainer).EndInit();
            splitContainer.ResumeLayout(false);
            tabControl.ResumeLayout(false);
            tabPageControl.ResumeLayout(false);
            groupBoxPowerControl.ResumeLayout(false);
            groupBoxPowerControl.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)numericUpDownCurrent).EndInit();
            ((System.ComponentModel.ISupportInitialize)numericUpDownVoltage).EndInit();
            groupBoxConnection.ResumeLayout(false);
            groupBoxConnection.PerformLayout();
            groupBoxStatus.ResumeLayout(false);
            groupBoxStatus.PerformLayout();
            tabPageSettings.ResumeLayout(false);
            groupBoxLogging.ResumeLayout(false);
            groupBoxLogging.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)numericUpDownSampleRate).EndInit();
            statusStrip.ResumeLayout(false);
            statusStrip.PerformLayout();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private SplitContainer splitContainer;
        private TabControl tabControl;
        private TabPage tabPageControl;
        private TabPage tabPageSettings;
        private GroupBox groupBoxStatus;
        private GroupBox groupBoxConnection;
        private Label labelBaudRate;
        private Label labelComPort;
        private Button buttonConnect;
        private Button buttonRefreshPorts;
        private ComboBox comboBoxBaudRate;
        private ComboBox comboBoxComPort;
        private GroupBox groupBoxPowerControl;
        private Label labelCurrent;
        private Label labelVoltage;
        private NumericUpDown numericUpDownCurrent;
        private NumericUpDown numericUpDownVoltage;
        private Button buttonSetOutput;
        private CheckBox checkBoxOutputEnable;
        private Label labelPowerValue;
        private Label labelCurrentValue;
        private Label labelVoltageValue;
        private Label labelPower;
        private Label labelCurrentReading;
        private Label labelVoltageReading;
        private Label labelConnectionStatus;
        private GroupBox groupBoxLogging;
        private Button buttonExportCSV;
        private Button buttonClearLog;
        private CheckBox checkBoxAutoLog;
        private NumericUpDown numericUpDownSampleRate;
        private Label labelSampleRate;
        private ScottPlot.WinForms.FormsPlot plotView;
        private StatusStrip statusStrip;
        private ToolStripStatusLabel toolStripStatusLabel;
        private ToolStripProgressBar toolStripProgressBar;
        private System.Windows.Forms.Timer timerUpdateReadings;
    }
}
