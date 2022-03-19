<script>
	import { Button } from 'carbon-components-svelte';
	// Import the main module of echarts.
	import * as echarts from 'echarts';
	import { analyzeUploadFileContentApi } from '../../api/dataApi';
	export let title = 'default title xxx';
	// Render line chart and components.
    let rawData = {
		features: [],
		content: []
	};
	var option = {
            title: {
                text: title
            },
            legend: {
                top:0,
                type: 'scroll'
            },
            tooltip: {
            trigger: 'axis',
            showContent: false
            },
            dataset: {
            source: []
            },
            xAxis: { type: 'category' },
            yAxis: { gridIndex: 0 },
            grid: { top: '55%' },
            series: [
            {
                type: 'pie',
                id: 'pie',
                radius: '30%',
                center: ['50%', '25%'],
                // emphasis: {
                // focus: 'self'
                // },
                label: {
                show:false
                },
                // encode: {
                // itemName: 'product',
                // value: '2012',
                // tooltip: '2012'
                // }
            }
            ]
    };
    function receiveData() {
		analyzeUploadFileContentApi('data.xlsx').then((response) => {
			if (response.status == 200) {
				rawData.content = response.data.content;
				rawData.features = response.data.header;
				var arr1 = Object.keys(rawData.content);//key(0)
				var arr2 = [];//key and value(0)
				for(let i = 0; i < arr1.length; i++) {
					let key = arr1[i];
					arr2[i] = rawData.content[key];
				}
				console.log(rawData.features);
				console.log('arr1',arr1);
				console.log('arr2',arr2);
				var arr3 = Object.keys(arr2[0]);//key(1)
                // console.log('arr3',arr3);
				var xarr =[];
                for(let i = 0; i < arr3.length; i++) {
                    if(arr3[i]==rawData.features[0]['key']){
                        xarr.push(arr3[i]);
                    }
                }
				for(let i = 0; i < arr3.length; i++){
					if(arr3[i]!="project"&&arr3[i]!='id'){
                        xarr.push(arr3[i]);
                        // option.legend.push(arr3[i]);
                        let series = {
                            type: 'line',
                            smooth: true,
                            seriesLayoutBy: 'row',
                            emphasis: { focus: 'series' }
                        }
                        option.series.push(series);
                    }
				}
				console.log('xarr',xarr);
                option.dataset.source=[];
                option.dataset.source.push(xarr);
                for(let i = 0;i<arr2.length; i++) {
                    let tarr = [];
                    for(let j = 0; j < xarr.length; j++) {
                        tarr.push(arr2[i][xarr[j]]);
                    }
                    option.dataset.source.push(tarr);
                }
                console.log('sourse',option.dataset.source);
			} else {
				console.log('error!');
			}
		});
	}
    function showCharts(){
        // showAnalysis = !showAnalysis;
        let myChart = echarts.init(document.getElementById('Area'));
        myChart.on('updateAxisPointer', function (event) {
            let xAxisInfo = event.axesInfo[0];
            if (xAxisInfo) {
            let dimension = xAxisInfo.value + 1;
            myChart.setOption({
                legend: {
                    top:0
                },
                series: {
                id: 'pie',
                encode: {
                    value: dimension,
                    tooltip: dimension,
                    center: ['50%', '25%']
                }
                }
            });
            }
        });
        myChart.setOption(option);
    }
</script>
<div class=" m-auto grid-cols-2 gap-4">
	<Button  on:click={receiveData} kind="tertiary">获取数据</Button>
	<Button  on:click= {showCharts} kind="tertiary">展示图表</Button>
</div>


<!-- <div style = "backgroundColor : yellow;width: 800px;height:600px;"></div> -->
<div id="Area" style="width: 800px;height:600px;"/>

