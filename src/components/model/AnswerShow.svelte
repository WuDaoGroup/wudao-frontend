<script>
    import {
		Accordion,
		AccordionItem,
		CodeSnippet,
		DataTable,
		InlineNotification,
		Tooltip,
	} from 'carbon-components-svelte';
    import {
        ordinaryLeastSquaresAnswerSheetS,
        boostedDecisionTreeRegressionAnswerSheetS,
        ridgeRegressionAnswerSheetS,
        lassoAnswerSheetS,
        lassoLarsAnswerSheetS,
        SVCAnswerSheetS,
        SGDClassifierAnswerSheetS,
        xgboostAnswerSheetS,

        ordinaryLeastSquaresAppearance,
        boostedDecisionTreeRegressionAppearance,
        ridgeRegressionAppearance,
        lassoAppearance,
        lassoLarsAppearance,
        SVCAppearance,
        SGDClassifierAppearance,
        xgboostAppearance,

        errorOrdinaryLeastSquares,
        errorBoostedDecisionTreeRegression,
        errorRidgeRegression,
        errorLasso,
        errorLassoLars,
        errorSVC,
        errorSGDClassifier,
        errorXgboost,
        judge,
    } from '../../stores/ansStore.js'

    let ordinaryLeastSquaresAnswerSheet = [];
    let boostedDecisionTreeRegressionAnswerSheet = [];
    let ridgeRegressionAnswerSheet = [];
    let lassoAnswerSheet = [];
    let lassoLarsAnswerSheet = [];
    let SVCAnswerSheet = [];
    let SGDClassifierAnswerSheet = [];
    let xgboostAnswerSheet = [];

    ordinaryLeastSquaresAnswerSheetS.subscribe(value => {
        ordinaryLeastSquaresAnswerSheet = value;
    });
    boostedDecisionTreeRegressionAnswerSheetS.subscribe(value => {
        boostedDecisionTreeRegressionAnswerSheet = value;
    });
    ridgeRegressionAnswerSheetS.subscribe(value => {
        ridgeRegressionAnswerSheet = value;
    });
    lassoAnswerSheetS.subscribe(value => {
        lassoAnswerSheet = value;
    });
    lassoLarsAnswerSheetS.subscribe(value => {
        lassoLarsAnswerSheet = value;
    });
    SVCAnswerSheetS.subscribe(value => {
        SVCAnswerSheet = value;
    });
    xgboostAnswerSheetS.subscribe(value => {
        xgboostAnswerSheet = value;
    });
    SGDClassifierAnswerSheetS.subscribe(value => {
        SGDClassifierAnswerSheet = value;
    });

</script>


<div>
    {#if $judge}
        {#if $ordinaryLeastSquaresAppearance}
            <Accordion>
                <AccordionItem title="Ordinary Least Squares">
                    {#if $errorOrdinaryLeastSquares}
                        {#each ordinaryLeastSquaresAnswerSheet as { coef, intercept, accuracyOfTestData, accuracyOfTrainData, code, mae, mse, r2 }}
                            <DataTable
                                class="w-11/12"
                                headers={[
                                    { key: 'coefficient', value: 'coefficient' },
                                    { key: 'intercept', value: 'intercept' },
                                    { key: 'test', value: 'accuracy of test-data' },
                                    { key: 'train', value: 'accuracy of train-data' }
                                ]}
                                rows={[
                                    {
                                        coefficient: coef,
                                        intercept: intercept,
                                        test: accuracyOfTestData,
                                        train: accuracyOfTrainData
                                    }
                                ]}
                            />
                            <DataTable
                                class="w-11/12"
                                headers={[
                                    { key: 'MAE', value: 'MAE' },
                                    { key: 'MSE', value: 'MSE' },
                                    { key: 'R2', value: 'R2' },
                                ]}
                                rows={[
                                    {
                                        MAE: mae,
                                        MSE: mse,
                                        R2: r2,
                                    }
                                ]}
                            />
                            <CodeSnippet code={code} type="multi" />
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
        {/if}
        {#if $ridgeRegressionAppearance}
            <Accordion>
                <AccordionItem title="Ridge regression">
                    {#if $errorRidgeRegression}
                        {#each ridgeRegressionAnswerSheet as { coef, intercept, alpha, accuracyOfTestData, accuracyOfTrainData, code, mae, mse, r2  }}
                            <DataTable
                                class="w-11/12"
                                headers={[
                                    { key: 'alpha', value: 'alpha' },
                                    { key: 'coefficient', value: 'coefficient' },
                                    { key: 'intercept', value: 'intercept' },
                                    { key: 'test', value: 'accuracy of test-data' },
                                    { key: 'train', value: 'accuracy of train-data' }
                                ]}
                                rows={[
                                    {
                                        alpha: alpha,
                                        coefficient: coef,
                                        intercept: intercept,
                                        test: accuracyOfTestData,
                                        train: accuracyOfTrainData
                                    }
                                ]}
                            />
                            <DataTable
                                class="w-11/12"
                                headers={[
                                    { key: 'MAE', value: 'MAE' },
                                    { key: 'MSE', value: 'MSE' },
                                    { key: 'R2', value: 'R2' },
                                ]}
                                rows={[
                                    {
                                        MAE: mae,
                                        MSE: mse,
                                        R2: r2,
                                    }
                                ]}
                            />
                            <CodeSnippet code={code} type="multi" />
                            <div class="divider"></div>
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
        {/if}
        {#if $lassoAppearance}
            <Accordion>
                <AccordionItem title="Lasso">
                    {#if $errorLasso}
                        {#each lassoAnswerSheet as { coef, intercept, alpha, accuracyOfTestData, accuracyOfTrainData, code, mae, mse, r2  }}
                            <DataTable
                                class="w-11/12"
                                headers={[
                                    { key: 'alpha', value: 'alpha' },
                                    { key: 'coefficient', value: 'coefficient' },
                                    { key: 'intercept', value: 'intercept' },
                                    { key: 'test', value: 'accuracy of test-data' },
                                    { key: 'train', value: 'accuracy of train-data' }
                                ]}
                                rows={[
                                    {
                                        alpha: alpha,
                                        coefficient: coef,
                                        intercept: intercept,
                                        test: accuracyOfTestData,
                                        train: accuracyOfTrainData
                                    }
                                ]}
                            />
                            <DataTable
                                class="w-11/12"
                                headers={[
                                    { key: 'MAE', value: 'MAE' },
                                    { key: 'MSE', value: 'MSE' },
                                    { key: 'R2', value: 'R2' },
                                ]}
                                rows={[
                                    {
                                        MAE: mae,
                                        MSE: mse,
                                        R2: r2,
                                    }
                                ]}
                            />
                            <CodeSnippet code={code} type="multi" />
                            <div class="divider"></div>
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
        {/if}
        {#if $lassoLarsAppearance}
            <Accordion>
                <AccordionItem title="LARS Lasso">
                    {#if $errorLassoLars}
                        {#each lassoLarsAnswerSheet as { coef, intercept, alpha, normalize, accuracyOfTestData, 
                            accuracyOfTrainData, code, mae, mse, r2  }}
                            <DataTable
                                class="w-11/12"
                                headers={[
                                    { key: 'alpha', value: 'alpha' },
                                    { key: 'normalize', value: 'normalize' },
                                    { key: 'coefficient', value: 'coefficient' },
                                    { key: 'intercept', value: 'intercept' },
                                    { key: 'test', value: 'accuracy of test-data' },
                                    { key: 'train', value: 'accuracy of train-data' }
                                ]}
                                rows={[
                                    {
                                        alpha: alpha,
                                        normalize: normalize,
                                        coefficient: coef,
                                        intercept: intercept,
                                        test: accuracyOfTestData,
                                        train: accuracyOfTrainData
                                    }
                                ]}
                            />
                            <DataTable
                                class="w-11/12"
                                headers={[
                                    { key: 'MAE', value: 'MAE' },
                                    { key: 'MSE', value: 'MSE' },
                                    { key: 'R2', value: 'R2' },
                                ]}
                                rows={[
                                    {
                                        MAE: mae,
                                        MSE: mse,
                                        R2: r2,
                                    }
                                ]}
                            />
                            <CodeSnippet code={code} type="multi" />
                            <div class="divider"></div>
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
        {/if}
        {#if $SVCAppearance}
            <Accordion>
                <AccordionItem title="SVC">
                    {#if  $errorSVC }
                        {#each SVCAnswerSheet as { accuracyOfTestData, code, recall,
                            Accuracy, AUROC, auprc, precision, thresholds }}
                            <DataTable
                                class="w-11/12"
                                headers={[
                                    { key: 'test', value: 'accuracy of test-data' },
                                    { key: 'Accuracy', value: 'Accuracy' },
                                    { key: 'AUROC', value: 'AUROC'},
                                ]}
                                rows={[
                                    {
                                        test: accuracyOfTestData,
                                        Accuracy: Accuracy,
                                        AUROC: AUROC,
                                    }
                                ]}
                            />
                            {#if auprc }
                                <DataTable
                                    class="w-11/12"
                                    headers={[
                                        { key: 'recall', value: 'recall' },
                                        { key: 'precision', value: 'precision' },
                                        { key: 'thresholds', value: 'thresholds'},
                                    ]}
                                    rows={[
                                        {
                                            recall: recall,
                                            precision: precision,
                                            thresholds: thresholds,
                                        }
                                    ]}
                                />
                            {:else}
                                <div class="flex flex-nowrap justify-start">
                                    <InlineNotification
                                        title="Error:"
                                        subtitle="The file you selected is not suitable for AUPRC."
                                    />
                                    <Tooltip tooltipBodyId="tooltip-body" class="self-center">
                                        <p id="tooltip-body">
                                            This implementation is restricted to the binary classification task.
                                        </p>
                                    </Tooltip>
                                </div>
                            {/if}
                            <CodeSnippet code={code} type="multi" />
                        {/each}
                    {:else}
                        <div class="flex flex-nowrap justify-start">
                            <InlineNotification
                                title="Error:"
                                subtitle="The file you selected is not suitable for this method."
                            />
                            <Tooltip tooltipBodyId="tooltip-body" class="self-center">
                                <p id="tooltip-body">
                                    ValueError: Unknown label type: 'continuous' or we got 1 class but the number of
                                    classes has to be greater than one.
                                </p>
                            </Tooltip>
                        </div>
                    {/if}
                </AccordionItem>
            </Accordion>
        {/if}
        {#if $xgboostAppearance}
            <Accordion>
                <AccordionItem title="xgboost">
                    {#if $errorXgboost}
                        {#each xgboostAnswerSheet as { accuracyOfTestData, code, mae, mse, r2  }}
                            <DataTable
                                class="w-11/12"
                                headers={[{ key: 'test', value: 'accuracy of test-data' }]}
                                rows={[
                                    {
                                        test: accuracyOfTestData
                                    }
                                ]}
                            />
                            <DataTable
                                class="w-11/12"
                                headers={[
                                    { key: 'MAE', value: 'MAE' },
                                    { key: 'MSE', value: 'MSE' },
                                    { key: 'R2', value: 'R2' },
                                ]}
                                rows={[
                                    {
                                        MAE: mae,
                                        MSE: mse,
                                        R2: r2,
                                    }
                                ]}
                            />
                            <CodeSnippet code={code} type="multi" />
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
        {/if}
        {#if $boostedDecisionTreeRegressionAppearance}
            <Accordion>
                <AccordionItem title="Decision Tree Regression with AdaBoost">
                    {#if $errorBoostedDecisionTreeRegression}
                        {#each boostedDecisionTreeRegressionAnswerSheet as ans}
                            <div class="flex mb-10 justify-center">
                                <img src={ans.picAdd} alt="the result" />
                            </div>
                            <CodeSnippet code={ans.code} type="multi" />
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
        {/if}
        {#if $SGDClassifierAppearance}
            <Accordion>
                <AccordionItem title="SGD Classifier">
                    {#if $errorSGDClassifier}
                        {#each SGDClassifierAnswerSheet as { loss, penalty, accuracyOfTestData, code, Accuracy, AUROC }}
                            <DataTable
                                class="w-11/12"
                                headers={[
                                    { key: 'loss', value: 'loss' },
                                    { key: 'penalty', value: 'penalty' },
                                    { key: 'test', value: 'accuracy of test-data' },
                                    { key: 'Accuracy', value: 'Accuracy' },
                                    { key: 'AUROC', value: 'AUROC'},
                                ]}
                                rows={[
                                    {
                                        loss: loss,
                                        penalty: penalty,
                                        test: accuracyOfTestData,
                                        Accuracy: Accuracy,
                                        AUROC: AUROC,
                                    }
                                ]}
                            />
                            <CodeSnippet code={code} type="multi" />
                        {/each}
                    {:else}
                        <div class="flex flex-nowrap justify-start">
                            <InlineNotification
                                title="Error:"
                                subtitle="The file you selected is not suitable for this method."
                            />
                            <Tooltip tooltipBodyId="tooltip-body" class="self-center">
                                <p id="tooltip-body">
                                    ValueError: Unknown label type: 'continuous' or we got 1 class but the number of
                                    classes has to be greater than one.
                                </p>
                            </Tooltip>
                        </div>
                    {/if}
                </AccordionItem>
            </Accordion>
        {/if}
    {/if}
</div>