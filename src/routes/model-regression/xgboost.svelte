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
      Tabs, Tab, TabContent,
      Loading
    } from 'carbon-components-svelte';
    import {baseLink} from '../../services/api.js'
    import { toast } from '@zerodevx/svelte-toast';
    import { user } from '../../stores/userStore';
    import {regressionTrainerApi} from '../../api/modelApi.js';
    import { code } from '../../services/codeGen.js';

    let username;
    user.subscribe((value) => {
      username = value.username;
      console.log('username:', username)
    });

    let testPercent;

    function handleSplitDataset(){
      if (testPercent >= 50 && testPercent <= 95){
        toast.push('数据集划分成功')
        return true
      } else {
        toast.push('数据集划分失败，需在50%到95%之间', {
            theme: {
              '--toastBackground': '#F56565',
              '--toastBarBackground': '#C53030'
            }
        });
        return false
      }
    }

      // 当前状态
      let currentState = '等待训练...';

      // 处理模型的返回结果
      let modelResult=[]

      function train(){
        if (handleSplitDataset()==false) {
          return
        }
        currentState = '训练中...'
        regressionTrainerApi(username, testPercent/100, 'xgboost').then((response) => {
          if (response.status == 200) {
            currentState = '完成训练'
            console.log('response_data:', response.data);
            modelResult = response.data
            toast.push('模型成功训练');
            let image = document.getElementById('feature-importance-image');
            image.src = `${baseLink}/static/data/${username}/images/xgboost/feature_importance.png`
            image.alt = `特征重要性图`
            image = document.getElementById('xgboost-tree-image');
            image.src = `${baseLink}/static/data/${username}/images/xgboost/xgboost_tree.png`
            image.alt = `XGBoost Tree 图`
          } else {
            console.log('error!');
            toast.push('模型训练失败', {
              theme: {
                '--toastBackground': '#F56565',
                '--toastBarBackground': '#C53030'
              }
            });
          }
        });
    }
</script>

<svelte:head>
  <meta charset="UTF-8" />
  <title>回归: XGBoost</title>
</svelte:head>

<h1>Regression Model: XGBoost</h1>

<div class="card w-full">
  <div class="card-body">
    <p>XGBoost是陈天奇等人开发的一个开源机器学习项目，高效地实现了GBDT算法并进行了算法和工程上的许多改进，被广泛应用在Kaggle竞赛及其他许多机器学习竞赛中并取得了不错的成绩。</p>
  </div>
</div>

<div class="divider"></div>

<div class="grid grid-cols-2 gap-4 w-full">
    <div class="grid flex-grow card rounded-box">
        <Tabs>
            <Tab label="Step 1: 划分数据集" />
            <Tab label="Step 2: 模型训练" />

            <svelte:fragment slot="content">
              <TabContent>

                <div class="hero bg-base-200 h-96">
                    <div class="hero-overlay bg-opacity-60 rounded-lg"></div>
                    <div class="hero-content text-left text-neutral-content">
                      <div class="max-w-md">
                        <h2 class="mb-5 text-5xl font-bold">数据集划分</h2>
                        <p class="mb-5">在机器学习任务中，我们通常将已有的数据集划分为训练集和验证集两部分，其中训练集用来训练模型，而验证集则用来验证模型对于新样本的判别能力。</p>
                        <div class="flex items-end justify-between px-4 pt-4 items-center">
                          <input type="number" min="50" max="95" placeholder="输入训练集的比例(%)" class="input input-bordered input-primary text-zinc-900 w-[14rem]" bind:value={testPercent}>
                          <button class="btn btn-primary" on:click={handleSplitDataset}>确定划分比例</button>
                        </div>
                      </div>
                    </div>
                  </div>

              </TabContent>
              <TabContent>

                <div class="hero bg-base-200 h-96">
                  <div class="hero-overlay bg-opacity-60 rounded-lg"></div>
                  <div class="hero-content text-left text-neutral-content">
                    <div class="max-w-md">
                      <h2 class="mb-5 text-5xl font-bold">XGBoost</h2>
                      <p class="mb-5">炼丹师，开始你的训练！</p>
                      <button class="btn btn-primary" on:click={train}>一键训练</button>
                    </div>
                  </div>
                </div>

              </TabContent>

            </svelte:fragment>
        </Tabs>
    </div>

    <div class="grid flex-grow card rounded-box">

      <Tabs>
        <Tab label="模型评估结果" />
        <Tab label="特征重要性图" />
        <Tab label="XGBoost Tree 图" />
        <svelte:fragment slot="content">
          <TabContent>

            {#if currentState != '完成训练'}
              <div class="alert shadow-lg mt-4">
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-info flex-shrink-0 w-6 h-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span class="flex items-center ml-1">{currentState}</span>
                </div>
              </div>
              <div class="flex flex-col items-center justify-center mt-8">
                  <Loading withOverlay={false} />
              </div>
            {:else}
                <div class="px-4 mx-auto container align-middle">
                <div class="grid grid-cols-4 gap-2">

                    {#each modelResult as result}
                    <div class="shadow rounded-lg py-4 px-5 bg-white">
                        <div class="flex flex-row justify-center items-center">
                        <div>
                            <h6 class="text-sm">{result.indicator}</h6>
                            <h4 class="text-black text-xl font-bold text-left">{result.value}</h4>
                        </div>
                        </div>
                    </div>
                    {/each}

                </div>
                </div>
            {/if}
          </TabContent>
          <TabContent>
            <div class="px-4 mx-auto container align-middle h-[32rem]">
              <div class="flex flex-row justify-center items-center">
                <img src='../../favicon.png' alt='尚未加载' id='feature-importance-image'/>
              </div>
            </div>
          </TabContent>
          <TabContent>
            <div class="px-4 mx-auto container align-middle h-[32rem]">
              <div class="flex flex-row justify-center items-center">
                <img src='../../favicon.png' alt='尚未加载' id='xgboost-tree-image'/>
              </div>
            </div>
          </TabContent>
        </svelte:fragment>
    </Tabs>

    </div>
 
  </div>