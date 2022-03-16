<script>
    import {
		TextInput,
        Accordion,
		AccordionItem,
        CodeSnippet,
		DataTable,
		InlineNotification,
		Tooltip,
	} from 'carbon-components-svelte';
    import { filename } from '../../stores/dataStore';
    import { ordinaryLeastSquaresData } from '../../api/modelApi';
    
    let percentOfTestData = 0.3
    let ordinaryLeastSquaresAnswerSheet = []

    let errorOrdinaryLeastSquares = true

    function ordinaryLeastSquares( percentOfTestData ) {
        console.log(percentOfTestData)
		ordinaryLeastSquaresData(localStorage.filename + '_zscore_afterFilter.csv', percentOfTestData)
			.then((response) => {
                let coef = response.data['result_coef']
                let intercept = response.data['result_intercept']
                let perTestData = response.data['result_accuracy_of_testdata']
                let perTrainData = response.data['result_accuracy_of_traindata']
                let code = response.data['code']
                let mae = response.data['mae']
                let mse = response.data['mse']
                let r2 = response.data['r2']
                let theNewAns = {
                    coef: coef,
                    intercept: intercept,
                    perTestData: perTestData,
                    perTrainData: perTrainData,
                    code: code,
                    mae: mae,
                    mse: mse,
                    r2: r2,
                };
                console.log(theNewAns)
                ordinaryLeastSquaresAnswerSheet = [...ordinaryLeastSquaresAnswerSheet, theNewAns];
        })
        .catch(() => {
			errorOrdinaryLeastSquares = false;
		});
	}
</script>
<div>
    <h1 class="mb-10 text-center text-blue-600">Ordinary Least Squares</h1>
    <div class = "grid grid-cols-2 gap-4">
        <div>
            <div class="flex justify-center mb-5">
                <TextInput 
                    labelText="Choose the percentage of the test data:" 
                    type="Number" 
                    placeholder="Please make sure percent is in the range of 0 to 1" 
                    bind:value={percentOfTestData} 
                />
            </div>
            <div class="m-2 flex justify-center">
				<button
					class="h-14 bg-white text-blue-600 border-blue-600 border-2 pl-4 pr-16 
					hover:bg-blue-600 hover:text-white"
					type="submit"
					on:click={ordinaryLeastSquares( percentOfTestData )}>Submit</button
				>
			</div>
        </div>
        <div>
            <Accordion>
                <AccordionItem title="Answers">
                    {#if errorOrdinaryLeastSquares}
                        {#each ordinaryLeastSquaresAnswerSheet as { perTestData, perTrainData, 
                            code, mae, mse, r2, coef, intercept  }}
                            <DataTable
                                class="w-11/12"
                                headers={[{ key: 'test', value: 'accuracy of test data' }]}
                                rows={[{ test: perTestData }]}
                            />
                            <DataTable
                                class="w-11/12"
                                headers={[ { key: 'train', value: 'accuracy of train data' } ]}
                                rows={[{ train: perTrainData }]}
                            />
                            <DataTable
                                class="w-11/12"
                                headers={[ { key: 'MAE', value: 'MAE' } ]}
                                rows={[{MAE: mae}]}
                            />
                            <DataTable
                                class="w-11/12"
                                headers={[{ key: 'MSE', value: 'MSE' }]}
                                rows={[{MSE: mse}]}
                            />
                            <DataTable
                                class="w-11/12"
                                headers={[{ key: 'R2', value: 'R2' }]}
                                rows={[{R2: r2}]}
                            />
                            <DataTable
                                class="w-11/12"
                                headers={[{ key: 'coef', value: 'coef' }]}
                                rows={[{coef: coef}]}
                            />
                            <DataTable
                                class="w-11/12"
                                headers={[{ key: 'intercept', value: 'intercept' }]}
                                rows={[{intercept: intercept}]}
                            />
                            <CodeSnippet class="w-40" code={code} type="multi" />
                        {/each}
                    {:else}
                        <div class="flex flex-nowrap justify-start">
                            <InlineNotification
                                title="Error:"
                                subtitle="The file you selected is not suitable for this method."
                            />
                            <Tooltip tooltipBodyId="tooltip-body" class="self-center">
                                <p id="tooltip-body">
                                    Make sure that every value that is a feature is of numeric type.
                                </p>
                            </Tooltip>
                        </div>
                    {/if}
                </AccordionItem>
            </Accordion>
        </div>
    </div>
</div>