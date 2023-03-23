# nestJs

在 NestJS 中，Controller、Service 和 Module 是三个最基本和常用的概念。它们分别处理以下逻辑：

+ Controller：Controller 处理 HTTP 请求和响应。它们接收来自客户端的请求，并调用相应的 Service 来处理这些请求。Controller 中包含一些 API 端点，以及在这些端点上执行的处理逻辑。 Controller 主要关注于处理输入和输出。

+ Service：Service 负责处理业务逻辑。它们包含了应用程序的核心处理逻辑。它们接收来自 Controller 的请求，并执行相应的处理逻辑，然后将结果返回给 Controller。 Service 主要关注于执行业务逻辑，如数据处理、条件流程等。

+ Module： Module 将 Controller 和 Service 组织在一起。它们定义了如何将应用程序的各个部分进行组装、配置和提供。 Module 负责初始化应用程序，并注册和管理它所需要的组件和依赖项。 Module 还可以定义各种提供者、控制器和服务，并将它们所有的组件绑定在一起以构建应用程序。

> 总之，Controller 主要处理输入和输出，Service 处理业务逻辑，Module 则负责组织和管理它们。这些概念极其重要，有助于构建高度可维护、松耦合的应用程序。
