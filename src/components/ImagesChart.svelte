<script>
	let images = [];
	let zscores = [];
	import { Button } from 'carbon-components-svelte';
	import { receiveBasicFileInfoApi } from '../api/fileApi';
	let showImage = false;
	let showZscore = false;
	$: length = 0;

	function receiveData() {
		receiveBasicFileInfoApi(localStorage.filename).then((response) => {
			if (response.status == 200) {
				console.log(response);
				let length = response.data.content.length;
				for (let i = 1; i <= length; i++) {
					let str =
						`https://wudao-backend.herokuapp.com/static/images/${localStorage.filename}_selected_features_` + i + '.png';
					console.log(str);
					let image = {
						key: i,
						str: str
					};
					images.push(image);
				}
				console.log(images);
				showImage = true;
				showZscore = false;
			} else {
				console.log('error!');
			}
		});
	}
	function zscoreChart(){
		showImage = false;
		showZscore = true;
		for(let i = 1;i<6;i++){
			let str =
				`https://wudao-backend.herokuapp.com/static/images/${localStorage.filename}_selected_features_zscore_` + i + '.png';
			console.log(str);
			let zscore = {
				key: i,
				str: str
			};
			zscores.push(zscore);
		}
		console.log(zscores);
	}
</script>

<div class=" m-auto grid-cols-2 gap-4">
	<Button on:click={receiveData} kind="tertiary" class=" col-auto ">展示原始数据</Button>
	<Button on:click={zscoreChart} kind="tertiary" class=" col-auto ">展示预处理后数据</Button>
</div>
{#if showImage == true}
	<div class="grid grid-cols-3 gap-4">
		{#each images as image}
			<img src={image.str} />
		{/each}
	</div>
{/if}
{#if showZscore == true}
	<div class="grid grid-cols-3 gap-4">
		{#each zscores as zscore}
			<img src={zscore.str} />
		{/each}
	</div>
{/if}
