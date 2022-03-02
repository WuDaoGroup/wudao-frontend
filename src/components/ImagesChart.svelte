<script>
	let images = [];
	import { Button } from 'carbon-components-svelte';
	import { receiveBasicFileInfoApi } from '../api/fileApi';
	let showImage = false;
	$: length = 0;

	function receiveData() {
		receiveBasicFileInfoApi(localStorage.filename).then((response) => {
			if (response.status == 200) {
				console.log(response);
				let length = response.data.content.length;
				for (let i = 1; i <= length; i++) {
					let str =
						`http://wudao-backend.herokuapp.com/static/images/${localStorage.filename}_selected_features_` + i + '.png';
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
	<div class="grid grid-cols-3 gap-4">
		{#each images as image}
			<img src={image.str} />
		{/each}
	</div>
{/if}
