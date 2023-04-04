# nestJs

在 NestJS 中，Controller、Service 和 Module 是三个最基本和常用的概念。它们分别处理以下逻辑：

+ Controller：Controller 处理 HTTP 请求和响应。它们接收来自客户端的请求，并调用相应的 Service 来处理这些请求。Controller 中包含一些 API 端点，以及在这些端点上执行的处理逻辑。 Controller 主要关注于处理输入和输出。

+ Service：Service 负责处理业务逻辑。它们包含了应用程序的核心处理逻辑。它们接收来自 Controller 的请求，并执行相应的处理逻辑，然后将结果返回给 Controller。 Service 主要关注于执行业务逻辑，如数据处理、条件流程等。

+ Module： Module 将 Controller 和 Service 组织在一起。它们定义了如何将应用程序的各个部分进行组装、配置和提供。 Module 负责初始化应用程序，并注册和管理它所需要的组件和依赖项。 Module 还可以定义各种提供者、控制器和服务，并将它们所有的组件绑定在一起以构建应用程序。

> 总之，Controller 主要处理输入和输出，Service 处理业务逻辑，Module 则负责组织和管理它们。这些概念极其重要，有助于构建高度可维护、松耦合的应用程序。

## 管道验证

```typescript
@Query(
    new ValidationPipe({
        transform: true,
        forbidUnknownValues: true,
        validationError: { target: false },
    }),
)
options: QueryPostDto,
```

在实例化ValidationPipe这个验证管道时，传入的参数的作用如下
● transform 如果设置成true则代码在验证之后对数据进行序列化
● forbidUnknownValues 代表如果请求数据中有多余的数据(比如没有在验证管道中定义的属性)则会报出403错误
● validationError.target 代表不会在响应数据中使我们的验证类也暴露传来
● groups用于设置验证组

ValidationPipe这个验证管道流程如下
一，在验证前先把自动把传入的请求数据先通过class-transformer导出的plainToInstance函数把普通对象的请求数据转换成通过验证数据类型提示的类的实例，比如data: UpdatePostDto，会是传入的{"id": "xxx","title": "yyy"}变成

```ts
const data = new UpdatePostDto()
data.id = 'xxx'
data.title = 'yyy'
```

二，通过每个属性的验证约束对它们进行验证(如果有转译则转译之后对该属性进行验证)
三，验证失败则响应403给前端
四，如果transform选项设置成true，则在验证无误后调用instanceToPlain函数(也是class-transformer的内置函数)把前面生成的DTO实例再次转换为普通对象(这时候那些加了@Transform装饰器的属性已经被转译了的)
五，把对象转入到控制器，以便传给服务进行数据操作

### provider

> 提供者就是通过类型提示或者标识符的方式使某个类或函数以依赖注入的方式在其它需要使用到它的地方进行实例化
> 提供者需要在模块元元素的providers中注册才可以被本模块的其它类注入，需要在exports中导出后才能被其它模块调用

自定义提供者
● 值提供者: 使用useValue来构建一个提供者
● 字符串提供者: 使用字符串，比如CONNECT来构建一个提供者
● 类映射提供者: 使用一个类映射另一个类来构建一个提供者
● 构造器提供者: 使用factory来构建一个提供者
● 别名提供者: 使用useExisting来为一个提供者指定一个别名
● 异步提供者: 使用async关键字+factory构建异步提供者
