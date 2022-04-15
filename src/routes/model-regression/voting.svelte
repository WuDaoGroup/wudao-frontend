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

    // 处理模型的返回结果
    let modelResult=[
      {'indicator': '5%准确率', 'value': '/'},
      {'indicator': '10%准确率', 'value': '/'},
      {'indicator': '15%准确率', 'value': '/'},
      {'indicator': '20%准确率', 'value': '/'},
      {'indicator': 'MAE', 'value': '/'},
      {'indicator': 'MSE', 'value': '/'},
      {'indicator': 'RMSE', 'value': '/'},
      {'indicator': 'R-squared', 'value': '/'}
    ]

    function train(){
      if (handleSplitDataset()==false) {
        return
      }
      modelResult=[
        {'indicator': '5%准确率', 'value': 'training'},
        {'indicator': '10%准确率', 'value': 'training'},
        {'indicator': '15%准确率', 'value': 'training'},
        {'indicator': '20%准确率', 'value': 'training'},
        {'indicator': 'MAE', 'value': 'training'},
        {'indicator': 'MSE', 'value': 'training'},
        {'indicator': 'RMSE', 'value': 'training'},
        {'indicator': 'R-squared', 'value': 'training'}
      ]
      regressionTrainerApi(username, testPercent/100, 'voting').then((response) => {
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

<!--  -->

<h1>Regression Model: Voting Regression</h1>

<div class="card w-full">
  <div class="card-body"> 
    <p>投票法是一种遵循少数服从多数原则的集成学习模型，通过多个模型的集成降低方差，从而提高模型的鲁棒性和泛化能力。投票法最终的预测结果是多个其他回归模型预测结果的平均值。</p>
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
                      <h2 class="mb-5 text-5xl font-bold">Voting Regression</h2>
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