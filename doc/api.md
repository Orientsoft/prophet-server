# API设计

## 说明

如无特别说明，所有List方法均支持page，pageSize的query参数。page的起始值为0，pageSize默认为20，最大为100。  
对于ObjectId类型，HTTP是转换成String类型发送的，前端可以无需处理，直接作为字符串使用。后端收到之后会自动按需转换成ObjectId。  
对于不返回内容的请求，用HTTP状态码判断成败。

---  
## 用户（user）  

简单的用户管理功能，主要用于控制不同用户可以看到的界面。  
原则上不开放用户注册。  
添加用户时使用PBKDF2算法生成密码，推荐使用crypto-js库以保证前后台加密操作一致性，注意传输时要使用BASE64编码：

```js
var salt = CryptoJS.lib.WordArray.random(128/8);
var key256Bits = CryptoJS.PBKDF2("Secret Passphrase", salt, { keySize: 256/32, iterations: 1000 });
```

用户权限由access字段控制。该字段定义了一颗权限树，第一层节点为应用（Application），应用节点内部层级关系与系统结构的“元树”基本上一一对应，从而实现任意层级的显示控制。  
权限树第一级有一个特殊的应用`admin`，用于指定用户是否可以看到管理界面。
后台提供API来获取初始权限树。

userInRequest:

```js
{
    name: String,
    key: String,
    salt: String
    access: {}
}
```

userInResponse:

```js
{
    id: ObjectId,
    name: String,
    access: {},
    createdAt: Date,
    updatedAt: Date
}
```

accessInResponse:

```js
[
    {
        visible: Boolean,
        name: String,
        level: 0,
        categories: [
            {
                visible: Boolean,
                name: String,
                level: 1,
                technology: [
                    {
                        visible: Boolean,
                        name: String,
                        level: 2
                    }
                ]
            }
        ]
    },
    ...,
    {
        visible: Boolean,
        name: 'admin',
        level: 0
    }
]
```

| method | path | query | request | response | remark |
| ------ | ---- | ----- | ------- | -------- | ------ |
| GET | /users | name | | [ userInResponse ] | 用户列表 |
| POST | /users | | userInRequest | userInResponse | 创建用户 |
| GET | /users/:userId | | | userInResponse | 获取指定用户 |
| PUT | /users/:userId | | userInRequest | userInResponse | 更改指定用户 |
| DELETE | /users/:userId | | | | 删除指定用户 |
| GET | /meta-access | | | accessInResponse | 获取初始权限树 |

---  
## 系统结构（structure）   

系统结构作为整体操作，直接存入MongoDB。  
data字段用于绑定附加数据如KPI、告警等，包含数据类型和数据元信息在MongoDB中的ObjectID。  
数据类型type的取值（可以根据需求增加）：

```js
export const DATA_TYPES = {
    DataSource: 0,
    KPI: 1,
    ALERT: 2
};
```

structureInRequest:

```js
{
    name: String,
    level: 0,
    data: [],
    categories: [
        {
            name: String,
            level: 1,
            data: [],
            technology: [
                {
                    name: String,
                    level: 2,
                    data: [ { type: Number, id: ObjectId } ],
                    hosts: [ ObjectId ]
                }
            ]
        }
    ]
}
```

structureInResponse:

```js
{
    id: ObjectId,
    name: String,
    level: 0,
    data: [],
    categories: [
        {
            name: String,
            level: 1,
            data: [],
            technology: [
                {
                    name: String,
                    level: 2,
                    data: [ { type: Number, id: ObjectId } ],
                    hosts: [ ObjectId ]
                }
            ]
        }
    ],
    createdAt: Date,
    updatedAt: Date
}
```

Sample Structure

```js
{
    name: "银行核心系统",
    level: 0,
    data: [],
    categories: [
        {
            name: "应用系统",
            level: 1,
            data: [],
            technology: [
                {
                    name: "业务日志",
                    level: 2,
                    hosts: []
                }
            ]
        },
        {
            name: "负载均衡器",
            level: 1,
            data: [],
            technology: [
                {
                    name: "Nginx",
                    level: 2,
                    hosts: []
                },
                {
                    name: "Apache",
                    level: 2,
                    hosts: []
                }
            ]
        },
        {
            name: "中间件",
            level: 1,
            data: [],
            technology: [
                {
                    name: "Tuxedo",
                    level: 2,
                    data: [],
                    hosts: []
                },
                {
                    name: "WebLogic",
                    level: 2,
                    data: [],
                    hosts: []
                },
                {
                    name: "JBOSS",
                    level: 2,
                    data: [],
                    hosts: []
                },
                {
                    name: "Tomcat",
                    level: 2,
                    data: [],
                    hosts: []
                }

            ]
        },
        {
            name: "数据库",
            level: 1,
            data: [],
            technology: [
                {
                    name: "Oracle",
                    level: 2,
                    data: [],
                    hosts: []
                },
                {
                    name: "MySQL",
                    level: 2,
                    data: [],
                    hosts: []
                }

            ]
        },
        {
            name: "操作系统",
            level: 1,
            data: [],
            technology: [
                {
                    name: "AIX",
                    level: 2,
                    data: [],
                    hosts: []
                },
                {
                    name: "Linux",
                    level: 2,
                    data: [],
                    hosts: []
                }

            ]
        },
        {
            name: "网络",
            level: 1,
            data: [],
            technology: [
                {
                    name: "NPM",
                    level: 2,
                    data: [],
                    hosts: []
                },
                {
                    name: "SNMP",
                    level: 2,
                    data: [],
                    hosts: []
                }

            ]
        }
    ],
}
```

| method | path | query | request | response | remark |
| ------ | ---- | ----- | ------- | -------- | ------ |
| GET | /structures | name | | [ structureInResponse ] | 结构列表 |
| POST | /structures | | structureInRequest | structureInResponse | 创建结构 |
| GET | /structures/:structureId | | | structureInResponse | 获取指定结构 |
| PUT | /structures/:structureId | | structureInRequest | structuresInResponse | 更改指定结构 |
| DELETE | /structures/:structureId | | | | 删除指定结构 |
| GET | /meta-structure | | | structureInResponse | 获取“元树” |

---  
## 数据（data）  

为前端提供的对象存储服务，可以存储任意的数据。  
对象的结构可以由前端设计实现，但是需要包含以下字段：  

```js
{
    type: String, // 表示该对象类型
    structure: [ ObjectId ] // 该对象所在的结构ID列表
}
```

dataInRequest:  

```js
{
    type: String,
    structure: [ ObjectId ],
    ...other_data_fileds
}
```

对象保存后，会添加一个`_id`字段，但是不会自动添加时间戳。   
dataInResponse:  

```js
{
    _id: ObjectId,
    type: String,
    structure: [ ObjectId ],
    ...other_data_fileds
}
```

| method | path | query | request | response | remark |
| ------ | ---- | ----- | ------- | -------- | ------ |
| GET | /data | type, structure | | [ dataInResponse ] | 数据列表 |
| POST | /data | | dataInRequest | dataInResponse | 创建数据 |
| GET | /data/:dataId | | | dataInResponse | 获取指定数据 |
| PUT | /data/:dataId | | dataInRequest | dataInResponse | 更改指定数据 |
| DELETE | /data/:dataId | | | | 删除指定数据 |

---  
## 告警（alert）  

归一化的告警严重度评分和分级，可以附加算法自定义信息。  
告警的执行以脚本方式实现，并集成在AI部分，作为Flow执行。**告警的数据保存在ES Index中，后台只保存告警元数据。** 告警可以挂在结构的节点上。  
严重度评分的范围是0-100，由算法执行归一化；告警级别的阀值为：  
```
0 : NORMAL
(0 - 50] : WARNING
(50 - 100] : ERROR 
```

告警级别定义：

```js
export const ALERT_LEVELS = {
    NORMAL: 0,
    WARNING: 1,
    ERROR: 2
};
```

alertIn**ES**:

```js
{
    name: String,
    serverity: Number,
    level: Number,
    timespan: Number, // in ms
    info: {}, // 告警算法的自定义数据
    createdAt: Date,
    updatedAt: Date
}
```

aggregatedAlertIn**ES**:

```js
{
    ....
    "aggregations": {
        "alert": {
            "buckets": [
                {
                    "key": Number, // ts
                    "doc_count": Number,
                    "serverity": {
                        "value": Number // 0 - 100
                    },
                    "level": {
                        "value": Number
                    }
                },
            ]
        }
    }
}
```

alertInRequest:  

```js
{
    structure: [ ObjectId ], // 与该告警关联的结构ID列表
    esIndex: String,
    startTs: Number,
    endTs: Number
}
```

请求告警的时候，后端会自动查询ES，并将结果聚合返回。  
告警的结果是不分页的，不支持分页参数。  
通过`*Ts`字段可以指定查询的时间范围，通过`interval`字段指定查询的[时间粒度](https://www.elastic.co/guide/en/elasticsearch/reference/current/common-options.html#time-units)。  

alertInResponse:  

```js
{
    _id: ObjectId,
    structure: [ ObjectId ],
    esIndex: String,
    value: aggregatedAlertInES, // 经过聚合的告警信息
    createdAt: Date,
    updatedAt: Date
}
```

| method | path | query | request | response | remark |
| ------ | ---- | ----- | ------- | -------- | ------ |
| GET | /alerts | structure, [ id ], startTs, endTs, interval | | { alerts: [ alertInResponse ], aggregatedAlert: aggregatedAlertInES } | 告警列表 |
| POST | /alerts | | alertInRequest | alertInResponse | 创建告警 |
| GET | /alerts/:alertId | | | alertInResponse | 获取指定告警 |
| PUT | /alerts/:alertId | | alertInRequest | alertInResponse | 更改指定告警 |
| DELETE | /alert/:alertId | | | | 删除指定告警 |

---  
## 主机（host）  

主机可以是Container。

hostInRequest:

```js
{
    hostname: String,
    ip: String
}
```

hostInResponse:

```js
{
    id: ObjectId,
    hostname: String,
    ip: String,
    createdAt: Date,
    updatedAt: Date
}
```

| method | path | query | request | response | remark |
| ------ | ---- | ----- | ------- | -------- | ------ |
| GET | /hosts | hostname, ip | | [ hostInResponse ] | 主机列表 |
| POST | /hosts | | hostInRequest | hostInResponse | 创建主机 |
| GET | /hosts/:hostId | | | hostInResponse | 获取指定主机 |
| PUT | /hosts/:hostId | | hostInRequest | hostInResponse | 更改指定主机 |
| DELETE | /hosts/:hostId | | | | 删除指定主机 |

---  
## IO端口（port）  

AI Task使用的输入输出端口。  
端口类型定义（根据需求可以增加）：  

```js
export const PORT_TYPES = {
    REDIS_CHANNEL: 0,
    NSQ_QUEUE: 1,
    MONGODB_COLLECTION: 2,
    ES_INDEX: 3
};
```

portInRequest:  

```js
{
    name: String,
    type: Number
}
```

portInResponse:  

```js
{
    id: ObjectId,
    name: String,
    type: Number,
    createdAt: Date,
    updatedAt: Date
}
```

| method | path | query | request | response | remark |
| ------ | ---- | ----- | ------- | -------- | ------ |
| GET | /ports | name, type | | [ portInResponse ] | 端口列表 |
| POST | /ports | | portInRequest | portInResponse | 创建端口 |
| GET | /ports/:portId | | | portInResponse | 获取指定端口 |
| PUT | /ports/:portId | | portInRequest | portInResponse | 更改指定端口 |
| DELETE | /ports/:portId | | | | 删除指定端口 |

---  
## 任务（task）  

AI Task定义和执行进程管理，任务是AI系统的核心。  
Task是静态的任务定义，Job是实际任务执行的进程。  
用户创建Task之后，可以直接测试，系统会短时间启停Task测试脚本是否可以正常执行。  
任务类型定义：  

```js
export const TASK_TYPES = {
    NORMAL: 0,
    CRON: 1
}
```

进程状态定义：  

```js
export const JOB_STATUS_TYPES = {
    online: 0,
    stopping: 1,
    stopped: 2,
    launching: 3,
    errored: 4,
    one-launch-status: 5
};
```

taskInRequest:  

```js
{
    name: String,
    input: ObjectId,
    output: ObjectId,
    script: String,
    params: Array,
    type: Number,
    cron: String,
    running: Boolean
}
```

taskInResponse:  

```js
{
    name: String,
    input: ObjectId,
    output: ObjectId,
    script: String,
    params: Array,
    type: Number,
    cron: String,
    running: Boolean,
    createAt: Date,
    updatedAt: Date
}
```

jobInRequest:  

```js
{
    taskId: [ ObjectId ] // 可以一次性发送整个Flow的taskId
}
```

jobInResponse: 

```js
{
    taskId: ObjectId,
    status: {
        uptime: Number,
        restart: Number,
        status: Number
    },
    createAt: Date,
    updatedAt: Date
}
``` 

testInResponse:

```js
{
    taskId: ObjectId,
    result: { status: 'OK' / 'Error', error }
}
```

| method | path | query | request | response | remark |
| ------ | ---- | ----- | ------- | -------- | ------ |
| GET | /tasks | name, input, output, type, running | | [ taskInResponse ] | 任务列表 |
| POST | /tasks | | taskInRequest | taskInResponse | 创建任务 |
| GET | /tasks/:taskId | | | taskInResponse | 获取指定任务 |
| PUT | /tasks/:taskId | | taskInRequest | taskInResponse | 更改指定任务 |
| DELETE | /tasks/:taskId | | | | 删除指定任务 |
| GET | /jobs | taskId, name, input, output, type, running | | [ jobInResponse ] | 进程列表 |
| POST | /jobs | | jobInRequest | [ jobInResponse ] | 启动任务（组） |
| DELETE | /jobs | jobInRequest | | | 停止任务（组） |
| GET | /jobs/:taskId | | | jobInResponse | 获取指定进程详情 |
| DELETE | /jobs/:taskId | | | | 停止指定任务 |
| GET | /tests/:taskId | | | testInResponse | 测试定义好的任务 |

---  
## 触发器（trigger）  

为了实现流程控制，引入触发器，用于在流程中某些任务开始前或结束后，自动对指定的任务进行启停控制。  
触发器类型定义：  

```js
export const TRIGGER_TYPES = {
    PRE: 0,
    POST: 1
};
```

触发器动作定义：  

```js
export const TRIGGER_ACTIONS = {
    START: 0,
    STOP: 1,
    RESTART 2
}
```

triggerInRequest:  

```js
{
    name: String,
    type: Number,
    task: ObjectId,
    action: Number,
    target: ObjectId
}
```

triggerInResponse:  

```js
{
    id: ObjectId,
    name: String,
    type: Number,
    task: ObjectId,
    action: Number,
    target: ObjectId,
    createdAt: Date,
    updatedAt: Date
}
```

| method | path | query | request | response | remark |
| ------ | ---- | ----- | ------- | -------- | ------ |
| GET | /triggers | name, type, task, action, target | | [ triggerInResponse ] | 触发器列表 |
| POST | /triggers | | triggerInRequest | triggerInResponse | 创建触发器 |
| GET | /triggers/:triggerId | | | triggerInResponse | 获取指定触发器 |
| PUT | /triggers/:triggerId | | triggerInRequest | triggerInResponse | 更改指定触发器 |
| DELETE | /triggers/:triggerId | | | | 删除指定触发器 |

---  
## 流程（flow）  

AI执行流程的定义和控制。  
在Task中已经可以实现整个Flow的操作，所以Flow就不再提供启停接口，直接调用Task相关接口即可。  

flowInRequest:  

```js
{
    name: String,
    tasks: [ ObjectId ],
    triggers: [ ObjectId ]
}
```

flowInResponse:  

```js
{
    id: ObjectId,
    name: String,
    tasks: [ ObjectId ],
    triggers: [ ObjectId ],
    createAt: Date,
    updatedAt: Date
}
```

| method | path | query | request | response | remark |
| ------ | ---- | ----- | ------- | -------- | ------ |
| GET | /flows | name | | [ flowInResponse ] | 流程列表 |
| POST | /flows | | flowInRequest | flowInResponse | 创建流程 |
| GET | /flows/:flowId | | | flowInResponse | 获取指定流程 |
| PUT | /flows/:flowId | | flowInRequest | flowInResponse | 更改指定流程 |
| DELETE | /flows/:flowId | | | | 删除指定流程 |

---  
## 历史状态（status）  

用于记录AI任务的历史状态。  
状态代码另开文档记录。  
状态级别定义：  

```js
export const STATUS_LEVEL = {
    DEBUG: 0,
    LOG: 1,
    WARNING: 2,
    ERROR: 3
};
```

statusInRequest:  

```js
{
    source: ObjectId,
    code: Number,
    level: Number,
    content: String
}
```

statusInResponse:

```js
{
    id: ObjectId,
    source: ObjectId,
    code: Number,
    level: Number,
    content: String,
    createdAt: Date,
    updatedAt: Date
}
```

| method | path | query | request | response | remark |
| ------ | ---- | ----- | ------- | -------- | ------ |
| GET | /status | source, code, level, from, to | | [ statusInResponse ] | 状态列表 |
| POST | /status | | statusInRequest | statusInResponse | 创建状态 |
