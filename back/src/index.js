const { ApolloServer } = require("apollo-server");

// typeDefs定数は、GraphQLスキーマを定義します
const typeDefs = `
  type Query {
    info: String!
    feed: [Link!]!
  }
  type Link {
    id: ID!
    description: String!
    url: String!
  }
`;

// 1
let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
];

// resolversオブジェクトは、GraphQLスキーマの実際の実装です。
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    // nullを返すとエラーを返す（String! と定義しているため。）
    // info: () => null,
    feed: () => links,
  },
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
  },
};

// どのような API 操作を受け入れ、どのように解決すべきかをサーバに伝えます。
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
