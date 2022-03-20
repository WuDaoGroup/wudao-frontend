<script>
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
    import { toast } from '@zerodevx/svelte-toast';
    import { user } from '../stores/userStore';
    import {zscoreDataApi, fillDataApi, filterDataApi, getDataStatisticsInfoApi} from '../api/dataApi.js';
    import { code } from '../services/codeGen.js';

    let username;
    user.subscribe((value) => {
      username = value.username;
      console.log('username:', username)
    });


    // function sleep(ms) {
    //     return new Promise(resolve => setTimeout(resolve, ms));
    // }

    // zscore 数据标准化部分
    async function handleZscoreData(){
      await zscoreDataApi(username).then((response) => {
        if (response.status == 200) {
          console.log('response_data:', response.data);
          toast.push('标准化成功');
        } else {

          console.log('error!');
          toast.push('标准化失败', {
            theme: {
              '--toastBackground': '#F56565',
              '--toastBarBackground': '#C53030'
            }
          });
        }
      });

      // await sleep(1000);

      await getDataStatisticsInfoApi(username, 'data_zscore').then((response) => {
        if (response.status == 200) {
          console.log('response_data:', response.data);
          curData = response.data;
          toast.push('统计量信息更新查询成功');
        } else {

          console.log('error!');
          toast.push('统计量信息更新查询失败', {
            theme: {
              '--toastBackground': '#F56565',
              '--toastBarBackground': '#C53030'
            }
          });
        }
      });
    }

    // 数据填充部分
    
    const fillDataOptions = ['均值填充', '中位数填充'];
    // const defaultChoice = fillDataOptions[0];
    let selectedFillOption
    $: console.log('option:', selectedFillOption)

    async function handleFillData(){
      await fillDataApi(username, selectedFillOption).then((response) => {
        if (response.status == 200) {
          console.log('response_data:', response.data);
          toast.push('数据填充成功');
        } else {

          console.log('error!');
          toast.push('数据填充失败', {
            theme: {
              '--toastBackground': '#F56565',
              '--toastBarBackground': '#C53030'
            }
          });
        }
      });

      // await sleep(1000);

      await getDataStatisticsInfoApi(username, 'data_zscore_fill').then((response) => {
        if (response.status == 200) {
          console.log('response_data:', response.data);
          curData = response.data;
          toast.push('统计量信息更新查询成功');
        } else {

          console.log('error!');
          toast.push('统计量信息更新查询失败', {
            theme: {
              '--toastBackground': '#F56565',
              '--toastBarBackground': '#C53030'
            }
          });
        }
      });
    }


    // 数据筛选部分
    let filterBar = 3.5
    $: console.log('bar', filterBar)
    async function handleFilterData(){
      if (filterBar < 2) {
        toast.push('筛选阈值太小了，至少为2', {
          theme: {
            '--toastBackground': '#F56565',
            '--toastBarBackground': '#C53030'
          }
        });
        return;
      }

      await filterDataApi(username, filterBar).then((response) => {
        if (response.status == 200) {
          console.log('response_data:', response.data);
          toast.push('数据筛选成功');
        } else {

          console.log('error!');
          toast.push('数据筛选失败', {
            theme: {
              '--toastBackground': '#F56565',
              '--toastBarBackground': '#C53030'
            }
          });
        }
      });

      // await sleep(1000);
      
      await getDataStatisticsInfoApi(username, 'data_zscore_fill_filter').then((response) => {
        if (response.status == 200) {
          console.log('response_data:', response.data);
          curData = response.data;
          toast.push('统计量信息更新查询成功');
        } else {

          console.log('error!');
          toast.push('统计量信息更新查询失败', {
            theme: {
              '--toastBackground': '#F56565',
              '--toastBarBackground': '#C53030'
            }
          });
        }
      });
    }


    // 显示统计信息表格
    let pagination = {
      pageSize: 6,
      page: 1
    };

    let rawData = {
      content: [],
      header: []
    };

    let pagination2 = {
      pageSize: 6,
      page: 1
    };
    let curData = {
      content: [],
      header: []
    };


    onMount(async () => {
      getDataStatisticsInfoApi(username, 'data_target_confirmed').then((response) => {
        if (response.status == 200) {
          console.log('response_data:', response.data);
          rawData = response.data;
          curData = rawData
          console.log('len raw', rawData.content.length)
          toast.push('统计量信息查询成功');
        } else {

          console.log('error!');
          toast.push('统计量信息查询失败', {
            theme: {
              '--toastBackground': '#F56565',
              '--toastBarBackground': '#C53030'
            }
          });
        }
      });
    });


    // 下载代码
    
    let codeFile
    code.subscribe((value) => {
      codeFile = value;
      console.log('username:', codeFile)
    });

    function handleDownload(){
      codeFile.cells[6]['source'][2]=`df = fill_data(df, fill_type='${selectedFillOption}')\n`
      codeFile.cells[6]['source'][3]=`df = filter_data(df, bar=${filterBar})\n`
      code.set(codeFile)
      console.log(codeFile.cells[6])
      const url = window.URL.createObjectURL(new Blob([JSON.stringify(codeFile)]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'code.ipynb'); //or any other extension
      document.body.appendChild(link);
      link.click();
    }

</script>



<h1>数据预处理</h1>

<div class="divider"></div>

<div class="flex w-full">
    <div class="grid flex-grow card rounded-box place-items-center">
        <Tabs>
            <Tab label="Step 1: 数据标准化" />
            <Tab label="Step 2: 缺失填充" />
            <Tab label="Step 3: 离群值筛选" />
            <Tab label="Step 4: 下载代码" />
            <svelte:fragment slot="content">
              <TabContent>

                <div class="hero" style="background-image: url(http://pic.616pic.com/bg_w1180/00/00/44/AWmPutVSXZ.jpg);">
                    <div class="hero-overlay bg-opacity-60"></div>
                    <div class="hero-content text-center text-neutral-content">
                      <div class="max-w-md">
                        <h2 class="mb-5 text-5xl font-bold">数据标准化</h2>
                        <p class="mb-5">由于不同特征的数据的尺度、范围不同，为了消除特征的不齐性，我们需要将数据作标准化处理，使其scale到均值为0，方差为1的分布。</p>
                        <button class="btn btn-primary" on:click={handleZscoreData}>使用Z-Score标准化</button>
                      </div>
                    </div>
                  </div>

              </TabContent>
              <TabContent>
                <div class="hero" style="background-image: url(http://pic.616pic.com/bg_w1180/00/00/44/AWmPutVSXZ.jpg);">
                    <div class="hero-overlay bg-opacity-60"></div>
                    <div class="hero-content text-center text-neutral-content">
                      <div class="max-w-md">
                        <h2 class="mb-5 text-5xl font-bold">缺失值填充</h2>
                        <p class="mb-5">对于机器学习模型而言，我们必须为每一个特征赋上值，因此需要作补全处理。常用的补全方式有：均值填充以及中位数填充。</p>
                        <div class="flex items-end justify-between px-4 pt-4 items-center">
                          <select class="select select-bordered w-30 text-zinc-900" bind:value={selectedFillOption}>
                            {#each fillDataOptions as opt}
                            <option value={opt} class="font-mono">
                              {opt}
                              </option>
                            {/each}
                          </select>
                          <button class="btn btn-primary" on:click={handleFillData}>开始填充缺失数据</button>
                        </div>
                      </div>
                    </div>
                  </div>
              </TabContent>
              <TabContent>
                <div class="hero" style="background-image: url(http://pic.616pic.com/bg_w1180/00/00/44/AWmPutVSXZ.jpg);">
                    <div class="hero-overlay bg-opacity-60"></div>
                    <div class="hero-content text-center text-neutral-content">
                      <div class="max-w-md">
                        <h2 class="mb-5 text-5xl font-bold">数据筛选</h2>
                        <p class="mb-5">很多时候，数据中会出现异常分布，极大或极小，这通常是因为错误输入等原因导致。我们可根据Z-Score值的大小作筛选。(为了筛选效果，至少为2)</p>
                        
                        <div class="flex items-end justify-between px-4 pt-4 items-center">
                          <input type="number" min="2" placeholder="输入阈值" class="input input-bordered input-primary text-zinc-900" bind:value={filterBar}>
                          <button class="btn btn-primary" on:click={handleFilterData}>确定筛选阈值</button>
                        </div>

                        
                      </div>
                    </div>
                  </div>
              </TabContent>
              <TabContent>

                <div class="hero" style="background-image: url(http://pic.616pic.com/bg_w1180/00/00/44/AWmPutVSXZ.jpg);">
                    <div class="hero-overlay bg-opacity-60"></div>
                    <div class="hero-content text-center text-neutral-content">
                      <div class="max-w-md">
                        <h2 class="mb-5 text-5xl font-bold">代码下载</h2>
                        <p class="mb-5">我们为您提供了当前位置所有数据处理部分的代码，以Python Jupyter Notebook的形式呈现，便于您的调试。</p>
                        <button class="btn btn-primary" on:click={handleDownload}>下载Jupyter代码</button>
                      </div>
                    </div>
                  </div>

              </TabContent>
            </svelte:fragment>
        </Tabs>
    </div>

    <div class="grid flex-grow card rounded-box">

      <Tabs>
        <Tab label="初始态" />
        <Tab label="处理后" />
        <svelte:fragment slot="content">
          <TabContent>

            <h2>
              初始状态的数据统计信息
            </h2>
            <div class="divider divider-horizontal"></div>

            <DataTable
              size="compact"
              sortable
              headers={[
                { key: "name", value: "name" },
                { key: "mean", value: "mean" },
                { key: "std", value: "std" },
                { key: "median", value: "median" },
                { key: "missing", value: "missing" }
              ]}
              pageSize={pagination.pageSize}
              page={pagination.page}
              rows={rawData.content}
            />
            <Pagination
              bind:pageSize={pagination.pageSize}
              bind:page={pagination.page}
              totalItems={rawData.content.length}
              pageSizeInputDisabled
            />
          </TabContent>
          <TabContent>
            <h2>
              处理后的数据的统计信息
            </h2>
            <div class="divider divider-horizontal"></div>

            <DataTable
              size="compact"
              sortable
              headers={[
                { key: "name", value: "name" },
                { key: "mean", value: "mean" },
                { key: "std", value: "std" },
                { key: "median", value: "median" },
                { key: "missing", value: "missing" }
              ]}
              pageSize={pagination2.pageSize}
              page={pagination2.page}
              rows={curData.content}
            />
            <Pagination
              bind:pageSize={pagination2.pageSize}
              bind:page={pagination2.page}
              totalItems={curData.content.length}
              pageSizeInputDisabled
            />


          </TabContent>

        </svelte:fragment>
    </Tabs>

    </div>
 
  </div>