

<script>
	import { goto } from '$app/navigation';
</script>

<svelte:head>
  <meta charset="UTF-8" />
  <meta name="keywords" content="结构化数据预测分析系统" />
  <meta
    name="description"
    content="带你快速分析和预测结构化数据，支持多种机器学习模型"
  />
  <title>结构化数据预测分析系统</title>
</svelte:head>

<main>

	<div class="flex justify-between ...">
		<h1 class="text-2xl font-bold text-zinc-600 text-6xl italic">结构化数据预测分析系统</h1>

		<button class="border border-teal-500 bg-teal-500 text-white block rounded-sm font-bold py-4 px-6 ml-2 flex items-center" on:click={() => goto(`auto-pipeline/`)}>
			智能快速预测分析入口
			<svg class="h-5 w-5 ml-2 fill-current" clasversion="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
				 viewBox="-49 141 512 512" style="enable-background:new -49 141 512 512;" xml:space="preserve">
			<path id="XMLID_11_" d="M-24,422h401.645l-72.822,72.822c-9.763,9.763-9.763,25.592,0,35.355c9.763,9.764,25.593,9.762,35.355,0
				l115.5-115.5C460.366,409.989,463,403.63,463,397s-2.634-12.989-7.322-17.678l-115.5-115.5c-9.763-9.762-25.593-9.763-35.355,0
				c-9.763,9.763-9.763,25.592,0,35.355l72.822,72.822H-24c-13.808,0-25,11.193-25,25S-37.808,422-24,422z"/>
			</svg>
		</button>
	</div>

	<div class="divider"></div>

	<img src="https://923259.smushcdn.com/2321054/wp-content/uploads/2019/05/what-is-data-science-1.jpg" alt="数据科学" class="rounded" style="height:500px;">

</main>