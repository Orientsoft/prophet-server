# 查询系统结构设计  

## 系统抽象  

设计查询系统的目标是对客户的业务系统状态进行整合，使用户可以在不同层级查看系统状态，从上至下追查系统问题来源。  
业务系统可以抽象为一个多叉树状的拓扑结构，分为4级：  

1. 应用（Application，核心、手机等）  
2. 技术分类（Category，DB、中间件等）  
3. 技术（Technology，OracleDB、Tux等）  
4. 主机（Host）  

某一个应用可以包含的技术分类是有一定范围的，而某一个技术分类可能包含的技术也是有一定的范围的，这就形成了一种模式。这种模式依然是多叉树状结构，是一颗“元树”。元树实际上是系统中可能存在的最大的**应用**树，实际的应用都是元树剪支的结果。  
多颗应用树可以再组合起来形成业务系统树。  

## Schema设计  

元树的结构：  
```
{
    level: 0,
    categories: [
        {
            name: String,
            level: 1,
            technology: [
                name: String,
                level: 2,
                hosts: [ ObjectId ]
            ]
        }
    ]
}
```

元树不存储Mapper和Reducer，因为Mapper和Reducer是具体实例化应用树的时候才给出的。  

主机（Host）有一些特殊，因为某一台主机可以同时安装多种技术。  
这里我们把主机作为一种资源，不纳入树的结构层次中，不同的技术节点可以指向同一个主机记录：  

```
{
    hostname: String,
    ip: String
}
```

## 聚合  
从查询系统的角度看，分级的作用在于每一级的数据聚合，不同的层级所需要的聚合操作不尽相同。这就给聚合设计和实现带来了难度。  
为了统一聚合计算，我们可以采用Map-Reduce架构，即，为每一个节点提供Mapper和Reducer。Mapper用于对本节点数据进行变换，Reducer用于对本节点的子节点数据进行聚合。  
从实现的角度来考虑，具体的应用树是查询系统部署时进行设计，不能要求部署人员去现场开发Mapper和Reducer。所以，我们应该直接给出几种Mapper和Reducer供选择。比如，Reducer可以是Avg、Max、Min等等。Mapper目前看起来用处不大，主要是用于数据归一化，设置上下限等，可以暂不实现。  

## 其他资源  
除了Host之外，还有其他资源如KPI等定义，可以附加在实例树上，由节点保存资源ID。  
