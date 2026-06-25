# Scan & Register Capability 扫描与注册能力

> status: active
> updated_at: 2026-06-24
> layer: capabilities
> scope: System Core

本文件定义系统最基础的**扫描探测 (Scan)**与**本地注册 (Register)**核心能力边界。
此处的定义不包含具体数据字段，数据结构见 [candidate.md](../contracts/objects/candidate.md) 与 [card.md](../contracts/objects/card.md)。

---

## 1. 能力定义

### 1.1 扫描探测能力 (Scan Capability)
**能力目标**：主动探测当前运行环境（操作系统文件树），发现已安装但尚未被系统纳管的合法 AI Agent。
**核心原则**：
- **无破坏性**：Scan 必须是只读操作，不能对任何被发现的 Agent 的文件、进程造成干扰。
- **强制脱敏**：探测结果一旦流出探测模块（进入 Mock 环境或通过接口透出），必须完成脱敏（Masking），绝不允许暴露用户的家目录或隐私路径。
- **身份不唯一性**：由于同一个 Agent 可能存在多个工作区实例或残留配置，Scan 可能产生同一个 Agent 对应的多个侯选对象 (Candidate)。

### 1.2 本地注册能力 (Register Capability)
**能力目标**：将一个通过 Scan 探测到的 `Candidate`，经过用户确认后，固化为系统长期追踪的 `Registered Agent` 实例。
**核心原则**：
- **确认驱动**：注册能力必须带有“人工确认”前置条件。系统不可静默批量注册。
- **唯一性固化**：注册动作完成后，将针对该实例颁发唯一的系统凭证，并绑定唯一的真实物理路径。
- **私有区写盘**：Register 是写操作，所有注册产生的真相数据必须写入私有运行区（`~/.ai-trace/`），严禁将其推入开源规范仓。

---

## 2. 能力边界与约束

| 能力特性 | 强制要求 (Must) | 禁止行为 (Must Not) |
| --- | --- | --- |
| 作用范围 | 本地环境可见的符合契约特征的目录 | 禁止跨网络扫描、禁止非特征猜测 |
| 数据可见性 | 返回脱敏后的候选人信息用于展示 | 严禁展示或缓存原生会话日志 |
| 阶段准入 | Phase 2 开启并全程存续 | 禁止在没有 Candidate 的情况下凭空 Register |
