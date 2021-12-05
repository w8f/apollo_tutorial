const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");

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
    link: (parent, args) => {
      return links.find((link) => link.id == args.id);
    },
  },
  Mutation: {
    post: (parent, args) => {
      let idCount = links.length;
      const link = {
        id: `link-${idCount++}`,
        url: args.url,
        description: args.description,
      };
      links.push(link);
      return link;
    },
    updateLink: (parent, args) => {
      links = links
        .filter((link) => link.id == args.id)
        .map((link) => ({
          id: link.id,
          url: args.url,
          description: args.description,
        }));
      return links.find((link) => link.id == args.id);
    },
    deleteLink: (parent, args) => {
      links = links.filter((link) => link.id !== args.id);
      return null;
    },
  },
};

// どのような API 操作を受け入れ、どのように解決すべきかをサーバに伝えます。
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.gql"), "utf-8"),
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));