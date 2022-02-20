<script>
	import { Button } from 'carbon-components-svelte';
	// Import the main module of echarts.
	import * as echarts from 'echarts';
	import { analyzeUploadFileContentApi } from '../../api/fileApi';
	export let title = 'default title xxx';
	// Render line chart and components.
	let rawData = {
		features: [],
		content: []
	};
	let showAnalysis = false;
	let dataReceived = false;
	var option ={
			color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
			title: {
				text: title,
				subtext: "chart analysis",
				left: "center",
				textStyle: {
				fontSize: 20,
				fontFamily: "monospace"
				},
				subtextStyle: {
				fontSize: 10
				}
			},
			tooltip: {
				trigger: 'axis',
				// axisPointer: {
				// 	type: 'cross',
				// 	label: {
				// 		backgroundColor: '#6a7985'
				// 	}
				// }
			},
			legend: {
				type: 'scroll',
				bottom: 0,
    			left: '10%',
				right: '50%'
			},
			toolbox: {
				show: true,
				feature: {
				dataZoom: {
					yAxisIndex: 'none'
				},
				dataView: { readOnly: false },
				magicType: { type: ['line', 'bar' ] },
				restore: {},
				saveAsImage: {}
				}
			},
			grid: {
				bottom: '10%',
				containLabel: false
			},
			xAxis: [
				{
					type: 'category',
					boundaryGap: false,
					data: []
				}
			],
			yAxis: [
				{
					type: 'value',

				}
			],
			series: []
		}

	function receiveData() {
		analyzeUploadFileContentApi('data.xlsx').then((response) => {
			if (response.status == 200) {
				// console.log('response_data:', response.data)
				rawData.content = response.data.content;
				rawData.features = response.data.header;
				option.legend.data=[];
				option.xAxis.data =[];
				var arr1 = Object.keys(rawData.content);//key(0)
				var arr2 = [];//key and value(0)
				for(let i = 0; i < arr1.length; i++) {
					let key = arr1[i];
					arr2[i] = rawData.content[key];
				}
				console.log(rawData.features)
				console.log('arr1',arr1);
				console.log('arr2',arr2);
				var arr3 = Object.keys(arr2[0]);//key(1)
				var xarr =[];
				for(let i = 0; i < arr3.length; i++){
					if(arr3[i]!='Unnamed: 0'&&arr3[i]!='id') xarr.push(arr3[i]);
				}
				console.log('xarr',xarr);
				option.xAxis[0].data =xarr;
				option.series=[];
				option.legend.data =[];
				for (let i = 0; i < arr2.length; i++) {
					let series ={
						name: arr2[i]['Unnamed: 0'],
						type: 'line',
						smooth: true,
						data:[],
						emphasis: {
							focus: 'series'
						}
					};
					// series.data.push(series.name);
					for(let j = 0; j < xarr.length; j++) {
						series.data.push(arr2[i][xarr[j]]);
					}
					console.log('series.data',series.data);
					option.series.push(series);
					option.legend.data.push(arr2[i]['Unnamed: 0']);
				}
				console.log(rawData);
				dataReceived = true;
			} else {
				console.log('error!');
			}
		});
	}
	function showCharts(){
		// showAnalysis = !showAnalysis;
		const myChart = echarts.init(document.getElementById('Area'));
		myChart.setOption(option);
	}
</script>
<div class=" m-auto grid-cols-2 gap-4">
	<Button on:click={receiveData} kind="tertiary">获取数据</Button>
	<Button on:click={showCharts} kind="tertiary">展示图表</Button>
</div>

{#if dataReceived == true}
<!-- <div style = "backgroundColor : yellow;width: 800px;height:600px;"></div> -->
<div id="Area" style="width: 800px;height:600px;"/>
{/if}
