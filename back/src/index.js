const { PrismaClient } = require("@prisma/client");
const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");
const { getUserId } = require("./utils");
const prisma = new PrismaClient();

// 1
let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
];

const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");

// resolversオブジェクトは、GraphQLスキーマの実際の実装です。
const resolvers = {
  Query,
  Mutation,
  User,
  Link,
  // Query: {
  //   info: () => `This is the API of a Hackernews Clone`,
  //   // nullを返すとエラーを返す（String! と定義しているため。）
  //   // info: () => null,
  //   feed: async (parent, args, context) => {
  //     return context.prisma.link.findMany();
  //   },
  //   link: (parent, args) => {
  //     return links.find((link) => link.id == args.id);
  //   },
  // },
  // Mutation: {
  //   post: (parent, args, context, info) => {
  //     // let idCount = links.length;
  //     // const link = {
  //     //   id: `link-${idCount++}`,
  //     //   url: args.url,
  //     //   description: args.description,
  //     // };
  //     // links.push(link);
  //     // return link;
  //     const newLink = context.prisma.link.create({
  //       data: {
  //         url: args.url,
  //         description: args.description,
  //       },
  //     });
  //     return newLink;
  //   },
  //   updateLink: (parent, args) => {
  //     links = links
  //       .filter((link) => link.id == args.id)
  //       .map((link) => ({
  //         id: link.id,
  //         url: args.url,
  //         description: args.description,
  //       }));
  //     return links.find((link) => link.id == args.id);
  //   },
  //   deleteLink: (parent, args) => {
  //     links = links.filter((link) => link.id !== args.id);
  //     return null;
  //   },
  // },
};

const myPlugin = {
  async requestDidStart(requestContext) {
    console.log("Request started! Query:\n" + requestContext.request.query);
    return {
      async parsingDidStart(requestContext) {
        console.log("parsing started");
      },
      async validationDidStart(requestContext) {
        console.log("validation started");
      },
    };
  },
};

// どのような API 操作を受け入れ、どのように解決すべきかをサーバに伝えます。
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.gql"), "utf-8"),
  resolvers,
  plugins: [myPlugin],
  // PrismaClientのインスタンスを（prismaとして）アタッチしているので、
  // すべてのリゾルバでcontext.prismaにアクセスできるようになっています。

  // コンテキストを返す関数として、
  // 入力されたGraphQLクエリ（またはミューテーション）を伝えるHTTPリクエストをコンテキストに添付できる。
  // これにより、リゾルバはAuthorizationヘッダを読み取り、
  // リクエストを送信したユーザーが要求された操作を実行する資格があるかどうかを検証することができます。
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
