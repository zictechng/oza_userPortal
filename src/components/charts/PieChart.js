import React from "react";
import ReactApexChart from "react-apexcharts";

class PieChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: this.props.chartData || [], // default to an empty array if no data is passed
      chartOptions: this.props.chartOptions || {}, // default to an empty object if no options are passed
    };
  }

  componentDidMount() {
    // Update state with props if required
    if (this.props.chartData) {
      this.setState({
        chartData: this.props.chartData,
      });
    }
    if (this.props.chartOptions) {
      this.setState({
        chartOptions: this.props.chartOptions,
      });
    }
  }

  render() {
    return (
      <ReactApexChart
        options={this.state.chartOptions}
        series={this.state.chartData}
        type="pie"
        width="100%"
        height="60%"
      />
    );
  }
}

export default PieChart;
