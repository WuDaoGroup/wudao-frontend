<script>
	// import ImagesChart from '../components/ImagesChart.svelte';
	import { onMount } from 'svelte';
  	import {
      Button,
      DataTable,
      Pagination,
      Select,
      SelectItem,
      InlineNotification,
      ProgressIndicator,
      ProgressStep,
      TextInput,
      Tabs, Tab, TabContent
    } from 'carbon-components-svelte';
</script>

<h1>数据观察</h1>

<div class="divider"></div>

<!-- <ImagesChart /> -->


<div class="grid flex-grow card rounded-box place-items-center">
	<Tabs>
		<Tab label="原始数据观察" />
		<Tab label="处理后数据观察" />
		<svelte:fragment slot="content">

		  <TabContent>

		  </TabContent>

		  <TabContent>



		  </TabContent>
		</svelte:fragment>
	</Tabs>
</div>
