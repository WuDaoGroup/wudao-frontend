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
    import { user } from '../../stores/userStore';
    import {classificationTrainerApi} from '../../api/modelApi.js';
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

    // 处理模型的返回结果
    let modelResult=[
      {'indicator': '准确率', 'value': '/'},
      {'indicator': 'F1 score', 'value': '/'},
    ]

    function train(){
      if (handleSplitDataset()==false) {
        return
      }
      modelResult=[
        {'indicator': '准确率', 'value': 'training'},
        {'indicator': 'F1 score', 'value': 'training'},
      ]
      classificationTrainerApi(username, testPercent/100, 'naive_bayes').then((response) => {
        if (response.status == 200) {
          console.log('response_data:', response.data);
          modelResult = response.data
          toast.push('模型成功训练');
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



<h1>Regression Model: 朴素贝叶斯</h1>

<div class="card w-full">
  <div class="card-body">
    <p>朴素贝叶斯（Naive Bayes）是以贝叶斯定理为基础并且假设特征条件之间相互独立的方法，先通过已给定的训练集，以特征词之间独立作为前提假设，学习从输入到输出的联合概率分布，再基于学习到的模型，由输入求出使得后验概率最大的输出。</p>
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
                        <p class="mb-5">在机器学习任务中，我们通常将已有的数据集划分为训练集和测试集两部分，其中训练集用来训练模型，而测试集则用来评估模型对于新样本的判别能力。</p>
                        <div class="flex items-end justify-between px-4 pt-4 items-center">
                          <input type="number" min="50" max="95" placeholder="输入训练集的比例(%)" class="input input-bordered input-primary text-zinc-900 w-[14rem]" bind:value={testPercent}>
                          <button class="btn btn-primary" on:click={handleSplitDataset}>确定测试集划分比例</button>
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
                      <h2 class="mb-5 text-5xl font-bold">朴素贝叶斯</h2>
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
        <svelte:fragment slot="content">
          <TabContent>

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

          </TabContent>
 

        </svelte:fragment>
    </Tabs>

    </div>
 
  </div>