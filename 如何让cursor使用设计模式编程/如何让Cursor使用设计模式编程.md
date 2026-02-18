# 背景
有一个legacy的metric库，所有的指标混在一起，配置支持有限，希望把它变成一个可配置，可拓展的新的库

# 步骤

## 1. 使用通用的rules，要求重构

[general.mdc](general.mdc)

[python.mdc](python.mdc)

重构后效果并不理想，只使用了依赖倒置，没有对旧的metric进行改写

## 2. 使用更明确的prompt

```
设计一个metric库，使用注册机制实现每个metric的灵活添加；每个指标需要实现显示名称，需求topic的配置；topic不要重复消费；需要添加 @metric_60m (1)  中的五个指标，每个指标分开实现；另外还需要支持topic频率指标的监控
```
opus4.6正确地完成了任务

## 3. 要求模型总结principle

```
将以上设计原则和思路整理成通用的rules文件
```

[principle.mdc](principle.mdc)

## 4. 修改general.mdc，把principle包含进去

# 验证

将项目的rules复制到新的目录下，要求cursor给出俄罗斯方块游戏新的plan，并给出对应设计与rules中的mdc对应关系

```
使用python设计完成一个俄罗斯方块小游戏，给出完整的类定义，以及每个设计对应的mdc
```

## 未使用principle.mdc的设计

[未使用principle的俄罗斯方块代码设计](plan_without_principle.md)

## 使用principle.mdc的设计

[使用principle的俄罗斯方块代码设计](plan_with_principle.md)
