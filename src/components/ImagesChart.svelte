<script>
	let images = [];
	let zscores = [];
	import { Button } from 'carbon-components-svelte';
	import { receiveBasicFileInfoApi } from '../api/fileApi';
	export let showImage = false;
	export let showZscore = false;
	$: length = 0;

	function receiveData() {
		receiveBasicFileInfoApi(localStorage.filename).then((response) => {
			if (response.status == 200) {
				console.log(response);
				let length = response.data.content.length;
				if (images.length == 0) {
					for (let i = 1; i <= length; i++) {
						let str =
							`http://localhost:8123/static/images/${localStorage.filename}_selected_features_` +
							i +
							'.png';
						console.log(str);
						let image = {
							key: i,
							str: str
						};
						images.push(image);
					}
				}
				console.log(images);
				showImage = true;
				showZscore = false;
				console.log('error!');
			}
		});
	}
	function zscoreChart() {
		showImage = false;
		showZscore = true;
		if (zscores.length == 0) {
			for (let i = 1; i < 6; i++) {
				let str =
					`https://wudao-backend.herokuapp.com/static/images/${localStorage.filename}_selected_features_zscore_` +
					i +
					'.png';
				console.log(str);
				let zscore = {
					key: i,
					str: str
				};
				zscores.push(zscore);
			}
		}
		console.log(zscores);
	}
</script>

<div class=" m-auto grid-cols-2 gap-4">
	<Button on:click={receiveData} kind="tertiary" class=" col-auto ">展示原始数据</Button>
	<Button on:click={zscoreChart} kind="tertiary" class=" col-auto ">展示预处理后数据</Button>
</div>
{#if showImage == true && showZscore == false}
	<div class="grid grid-cols-3 gap-4">
		{#each images as image}
			<img src={image.str} />
		{/each}
	</div>
{/if}
{#if showZscore == true && showImage == false}
	<div class="grid grid-cols-3 gap-4">
		{#each zscores as zscore}
			<img src={zscore.str} />
		{/each}
	</div>
{/if}
