<script>
	let images = [];
	import { Button } from 'carbon-components-svelte';
	import { receiveBasicImageInfoApi } from '../api/fileApi';
	let showImage = false;
	function receiveData() {
		receiveBasicImageInfoApi('movie_data.xlsx').then((response) => {
			if (response.status == 200) {
				console.log(response);
				$: length = response.data.data;
				for (let i = 1; i <= length; i++) {
					let str =
						'http://localhost:8123/static/images/movie_data.xlsx_selected_features_' + i + '.png';
					console.log(str);
					let image = {
						key: i,
						str: str
					};
					images.push(image);
				}
				console.log(images);
				showImage = true;
			} else {
				console.log('error!');
			}
		});
	}
</script>

<div class=" m-auto grid-cols-2 gap-4">
	<Button on:click={receiveData} kind="tertiary" class=" col-auto ">获取数据</Button>
</div>
{#if showImage == true}
	<!-- <div class="flex flex-nowrap"> -->
	{#if length <=1}
		{#each images as image}
			<div class="flex-initial"><img src={image.str} /></div>
		{/each}
	{:else if length % 2 == 1}
		<div class="grid grid-cols-2 gap-4">
			{#each images as image}
				{#if image.key == length}
					<img class="col-span-2" src={image.str} />
				{:else}
					<img src={image.str} />
				{/if}
			{/each}
		</div>
	{:else}
		<div class="grid grid-cols-2 gap-4">
			{#each images as image}
				<img src={image.str} />
			{/each}
		</div>
	{/if}
	<!-- </div> -->
{/if}
