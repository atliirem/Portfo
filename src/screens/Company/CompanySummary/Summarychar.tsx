import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";

import { PieChart, BarChart, LineChart } from "react-native-chart-kit";
import { RootState } from "../../../redux/store";


const screenWidth = Dimensions.get("window").width;
const chartWidth = screenWidth - 80;

const chartConfig = {
  backgroundGradientFrom: "#29c5d3",
  backgroundGradientTo: "#1a8b95",
  backgroundGradientFromOpacity: 1,
  backgroundGradientToOpacity: 1,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  decimalPlaces: 0,
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: "#fff",
  },
  propsForBackgroundLines: {
    strokeDasharray: "5,5",
    stroke: "rgba(255,255,255,0.3)",
  },
  propsForLabels: {
    fontSize: 11,
    fontWeight: "500" as const,
  },
};

const SummaryCharts: React.FC = () => {
  const { company, loadingSummary } = useSelector(
    (state: RootState) => state.company
  );

  const graphs = company?.summary?.graphs;

  if (loadingSummary) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#29c5d3" />
      </View>
    );
  }

  if (!graphs) {
    return null;
  }


  const pieChartData =
    graphs.types?.map((item) => ({
      name: `${item.data} ${item.name}`,
      population: item.data,
      color: item.color,
      legendFontColor: item.legendFontColor || "#7F7F7F",
      legendFontSize: item.legendFontSize || 10,
    })) || [];


  const reviewLabels = graphs.review?.labels || [];
  const reviewData = graphs.review?.datasets?.data || [];

  const barChartData = {
    labels: reviewLabels.map((label) => label.replace(" Yıldız", "")),
    datasets: [{ data: reviewData.length > 0 ? reviewData : [0] }],
  };


  const visitLabels = graphs.visits?.labels || [];
  const visitData = graphs.visits?.datasets?.data || [];

  const formatDateLabel = (dateStr: string) => {
    const parts = dateStr.split(" ");
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[1].substring(0, 3)}`;
    }
    return dateStr;
  };

  const lineChartData = {
    labels: visitLabels.map(formatDateLabel),
    datasets: [
      {
        data: visitData.length > 0 ? visitData : [0],
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>

      {pieChartData.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Kategorisine Göre İlanlar</Text>
          <View style={styles.pieChartContainer}>
            <PieChart
              data={pieChartData}
              width={chartWidth+40}
              height={195}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute={false}
              hasLegend={true}
            />
          </View>
        </View>
      )}

 
      {reviewData.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Değerlendirmeler</Text>
          <View style={styles.gradientChartContainer}>
            <BarChart
              data={barChartData}
              width={chartWidth+40}
              height={300}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              style={styles.chartStyle}
              fromZero
              showValuesOnTopOfBars={false}
              withInnerLines={true}
              segments={4}
            />
          </View>
        </View>
      )}

  
      {visitData.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Son Profil Ziyaretleri</Text>
          <View style={styles.gradientChartContainer}>
            <LineChart
              data={lineChartData}
              width={chartWidth}
              height={300}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              style={styles.chartStyle}
              bezier={false}
              fromZero
              withInnerLines={true}
              withDots={true}
              withShadow={false}
              segments={4}
              verticalLabelRotation={45}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default SummaryCharts;

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    paddingBottom: 70,
  },
  loadingContainer: {
    paddingVertical: 10,
    alignItems: "center",
  },
  chartSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 16,
  },
  pieChartContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 10,
  },
  gradientChartContainer: {
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
  },
  chartStyle: {
    borderRadius: 16,
  },
});
