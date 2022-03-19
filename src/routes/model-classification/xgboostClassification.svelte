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
    import { xgboostClassificationData } from '../../api/modelApi';
    
    let percentOfTestData = 0.3
    let xgboostAnswerSheet = []
    let errorXgboost = true

    function xgboost(percentOfTestData) {
        xgboostClassificationData(localStorage.filename + '_zscore_fill_filter.csv', percentOfTestData)
            .then((response) => {
                let auprc = true
                let code = response.data['code']
                let auroc = response.data['auroc']
                let acc = response.data['accuracy']
                let recall = response.data['recall']
                let precision = response.data['precision']
                let thresholds = response.data['thresholds'] 
                let accuracyOfTestData = response.data['result_accuracy_of_test_data']
                
                if( response.data['auprc'] == 1 )
                    auprc = true;
                else
                    auprc = false;
                
                let theNewAns = {
                    accuracyOfTestData: accuracyOfTestData,
                    code: code,
                    Accuracy: acc,
                    AUROC: auroc,
                    auprc: auprc,
                    precision: precision,
                    recall: recall,
                    thresholds: thresholds,
                };
                xgboostAnswerSheet =  [...xgboostAnswerSheet, theNewAns]
                errorXgboost = true;
            })
            .catch(() => {
                errorXgboost = false;
            });
    }
</script>
<div>
    <h1 class="mb-10 text-center text-blue-600">XGBoost Classification</h1>
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
					on:click={xgboost( percentOfTestData )}>Submit</button
				>
			</div>
        </div>
        <div>
            <Accordion>
                <AccordionItem title="Answers">
                    {#if errorXgboost}
                        {#each xgboostAnswerSheet as { accuracyOfTestData, Accuracy, 
                            code, AUROC, auprc, precision, recall, thresholds }}
                            <DataTable
                                class="w-11/12"
                                headers={[{ key: 'test', value: 'accuracy of test data' }]}
                                rows={[{ test: accuracyOfTestData }]}
                            />
                            <DataTable
                                class="w-11/12"
                                headers={[ { key: 'accuracy', value: 'Accuracy' } ]}
                                rows={[{ accuracy: Accuracy }]}
                            />
                            <DataTable
                                class="w-11/12"
                                headers={[ { key: 'AUROC', value: 'AUROC' } ]}
                                rows={[{AUROC: AUROC}]}
                            />
                            {#if auprc }
                                <DataTable
                                    class="w-11/12"
                                    headers={[{ key: 'precision', value: 'precision' }]}
                                    rows={[{precision: precision}]}
                                />
                                <DataTable
                                    class="w-11/12"
                                    headers={[{ key: 'recall', value: 'recall' }]}
                                    rows={[{recall: recall}]}
                                />
                                <DataTable
                                    class="w-11/12"
                                    headers={[{ key: 'thresholds', value: 'thresholds' }]}
                                    rows={[{thresholds: thresholds}]}
                                />
                            {:else}
                                <div class="flex flex-nowrap justify-start">
                                    <InlineNotification
                                        title="Error:"
                                        subtitle="The file you selected is not suitable for AUPRC."
                                    />
                                    <Tooltip tooltipBodyId="tooltip-body" class="self-center">
                                        <p id="tooltip-body">
                                            This implementation is restricted to the binary classification 
                                            task.
                                        </p>
                                    </Tooltip>
                                </div>
                            {/if}
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