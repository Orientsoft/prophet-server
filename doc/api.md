# API设计  

## 说明  

如无特别说明，所有List方法均支持page，pageSize的query参数。page的起始值为0，pageSize默认为20，最大为100。  
对于ObjectId类型，HTTP是转换成String类型发送的，前端可以无需处理，直接作为字符串使用。后端收到之后会自动按需转换成ObjectId。  

---  

## 用户（user）  


*TODO: 用户认证和权限还需要设计。*  

userInRequest:  
```
{
    name: String,
    key: String,
    salt: String,
    access: String
}
```

userInResponse:
```
{
    id: ObjectId,
    name: String,
    access: String,
    createdAt: Date,
    updatedAt: Date
}
```

| method | path | query | request | response | remark |
| ------ | ---- | ----- | ------- | -------- | ------ |
| GET | /users | name | | [ userInResponse ] | 用户列表 |
| POST | /users | | userInRequest | userInResponse | 创建用户 |
| GET | /users/:userId | | | userInResponse | 获取指定用户 |
| PUT | /users/:userId | | userInRequest | userInResponse | 更改指定用户 |
| DELETE | /users/:userId | | | | 删除指定用户 |

---  

## 系统结构（structure）   

系统结构作为整体操作，直接存入MongoDB。  
data字段用于绑定附加数据如KPI、告警等，包含数据类型和数据元信息在MongoDB中的ObjectID。  
数据类型type的取值（可以根据需求增加）：  
```
export const DATA_TYPES = {
    KPI: 0,
    ALERT: 1
}
```

structureInRequest:
```
{
    name: String,
    level: 0,
    data: [ { type: Number, id: ObjectId } ],
    categories: [
        {
            name: String,
            level: 1,
            data: [ { type: Number, id: ObjectId } ],
            technology: [
                name: String,
                level: 2,
                data: [ { type: Number, id: ObjectId } ],
                hosts: [ ObjectId ]
            ]
        }
    ]
}
```

structureInResponse:
```
{
    id: ObjectId,
    name: String,
    level: 0,
    data: [ { type: Number, id: ObjectId } ],
    categories: [
        {
            name: String,
            level: 1,
            data: [ { type: Number, id: ObjectId } ],
            technology: [
                name: String,
                level: 2,
                data: [ { type: Number, id: ObjectId } ],
                hosts: [ ObjectId ]
            ]
        }
    ],
    createdAt: Date,
    updatedAt: Date
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
## 指标（KPI）  

*TBF*  

---  
## 告警（Alert）  

*TBF*  

---  
## 主机（Host）  

主机可以是Container。  

hostInRequest:
```
{
    hostname: String,
    ip: String
}
```

hostInResponse:
```
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
## IO端口（Port）  

AI Task使用的输入输出端口。  
端口类型定义（根据需求可以增加）：  
```
export const PORT_TYPES = {
    REDIS_CHANNEL: 0,
    NSQ_QUEUE: 1,
    MONGODB_COLLECTION: 2,
    ES_INDEX: 3
}
```

portInRequest:  
```
{
    name: String,
    type: Number
}
```

portInResponse:  
```
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
## 任务（Task）  

AI Task定义和执行进程管理，任务是AI系统的核心。  
任务类型定义：  
```
export const TASK_TYPES = {
    NORMAL: 0,
    CRON: 1
}
```

进程状态定义：  
```
export const JOB_STATUS_TYPES = {
    online: 0,
    stopping: 1,
    stopped: 2,
    launching: 3,
    errored: 4,
    one-launch-status: 5
}
```

taskInRequest:  
```
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
```
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
```
{
    taskId: ObjectId
}
```

jobInResponse: 
```
{
    jobId: String,
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
```
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
| POST | /jobs | | jobInRequest | jobInResponse | 启动任务 |
| GET | /jobs/:jobId | | | jobInResponse | 获取指定进程详情 |
| DELETE | /jobs/:jobId | | | | 停止任务 |
| GET | /tests/:taskId | | | testInResponse | 测试定义好的任务 |

---  
## 流程（Flow）  

AI执行流程的定义和控制。  
虽然从用户角度，任务的启停是由流程统一控制的，但是API实现上流程本身并不能启停，前端需要调用Task API进行任务控制。  

flowInRequest:  
```
{
    name: String,
    tasks: [ ObjectId ]
}
```

flowInResponse:  
```
{
    id: ObjectId,
    name: String,
    tasks: [ ObjectId ],
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
## 历史状态（Status）  

用于记录AI任务的历史状态。  
状态代码另开文档记录。  
状态级别定义：  
```
export const STATUS_LEVEL = {
    DEBUG: 0,
    LOG: 1,
    WARNING: 2,
    ERROR: 3
};
```

statusInRequest:  
```
{
    source: ObjectId,
    code: Number,
    level: Number,
    content: String
}
```

statusInResponse:
```
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
