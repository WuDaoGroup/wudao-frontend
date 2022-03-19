import { writable } from 'svelte/store';

const template = {
    "cells": [
     {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
       "## Data Analysis Platform Generated Code\n"
      ]
     },
     {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {},
      "outputs": [],
      "source": [
       "# import necessary packages\n",
       "import pandas as pd\n",
       "import numpy as np\n",
       "import matplotlib.pyplot as plt\n",
       "import seaborn as sns"
      ]
     },
     {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {},
      "outputs": [],
      "source": [
       "# 数据已经过`目标选择`步骤处理，第一列是预测目标，其余列为feature\n",
       "data_path = '/home/zhuyh/projects/wudao-backend/static/data/a/data_target_confirmed.csv'\n",
       "\n",
       "# 读CSV数据文件\n",
       "df = pd.read_csv(data_path)\n",
       "\n",
       "# 大致观察一下数据情况\n",
       "print(df)\n",
       "print(df.describe())"
      ]
     },
     {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {},
      "outputs": [],
      "source": [
       "# Z-Score数据标准化\n",
       "def zscore_data(df):\n",
       "    # 由于第一列为预测目标，无需作标准化\n",
       "    df_features = df.iloc[:, 1:]\n",
       "    df_features = df_features.apply(lambda x: (x - x.mean()) / (x.std()+1e-12))\n",
       "    df = pd.concat([df.iloc[:,0], df_features], axis=1)\n",
       "    return df"
      ]
     },
     {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {},
      "outputs": [],
      "source": [
       "# 缺失填充\n",
       "def fill_data(df, fill_type):\n",
       "    if fill_type == '均值填充':\n",
       "        # 因为已经zscore好了，所以只需补0即可，0即为均值\n",
       "        df.fillna(value=0, inplace=True)\n",
       "    elif fill_type == '中位数填充':\n",
       "        # 先计算出原始feature的中位数\n",
       "        info = []\n",
       "        for _, e in enumerate(df.columns):\n",
       "            h = {}\n",
       "            h['name'] = e\n",
       "            h['median'] = float(df[e].median())\n",
       "            info.append(h)\n",
       "        for idx, e in enumerate(df.columns):\n",
       "            df[e].fillna(value=info[idx]['median'], inplace=True)\n",
       "    return df"
      ]
     },
     {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {},
      "outputs": [],
      "source": [
       "# 离群值筛选\n",
       "def filter_data(df, bar):\n",
       "    # 除第一列外，如果该行存在大于bar的值，则删除该行\n",
       "    for f in df.iloc[:,1:].columns:\n",
       "        df = df[abs(df[f]) < bar]\n",
       "    return df"
      ]
     },
     {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {},
      "outputs": [],
      "source": [
       "# Call functions above\n",
       "df = zscore_data(df)\n",
       "df = fill_data(df, fill_type='均值填充')\n",
       "df = filter_data(df, bar=3)\n",
       "df.describe()"
      ]
     },
     {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {},
      "outputs": [],
      "source": [
       "# 绘制各特征的频率分布直方图\n",
       "def plot_hist(df):\n",
       "    for _, f in enumerate(df.columns):\n",
       "        plt.figure(figsize=(5,3))\n",
       "        plt.title(f,fontsize=18)\n",
       "        sns.histplot(data=df[f], color=\"dodgerblue\")\n",
       "        plt.show()\n",
       "        plt.clf()\n",
       "plot_hist(df)"
      ]
     }
    ],
    "metadata": {
     "language_info": {
      "codemirror_mode": {
       "name": "ipython",
       "version": 3
      },
      "file_extension": ".py",
      "mimetype": "text/x-python",
      "name": "python",
      "nbconvert_exporter": "python",
      "pygments_lexer": "ipython3",
     },
     "orig_nbformat": 4
    },
    "nbformat": 4,
    "nbformat_minor": 2
   }
   

export const code = writable(template);

