<script>
    import { onMount } from "svelte";
    // Import the main module of echarts.
    import * as echarts from "echarts";
    export let title = "default title xxx"
    // Render line chart and components.
    onMount(async () => {
      echarts.init(document.getElementById("Line")).setOption({
        title: { text: title },
        tooltip: {},
        toolbox: {
          feature: {
            dataView: {},
            saveAsImage: {
              pixelRatio: 2
            },
            restore: {}
          }
        },
        xAxis: {},
        yAxis: {},
        series: [
          {
            type: "line",
            smooth: true,
            data: [[12, 5], [24, 20], [36, 36], [48, 10], [60, 10], [72, 20]]
          }
        ]
      });
    });
  </script>
  
  <div id="Line" style="width: 600px;height:400px;"></div>