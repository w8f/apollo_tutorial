// 直接データを返すのではなく、AsyncIterator を返し、
// それを GraphQL サーバーが使用してイベントデータをクライアントにプッシュします。

const newLinkSubscribe = (parent, args, context, info) => {
  return context.pubsub.asyncIterator("NEW_LINK");
};

const newVoteSubscribe = (parent, args, context, info) => {
  return context.pubsub.asyncIterator("NEW_VOTE");
};

const newLink = {
  // subscribeフィールドの値にAsyncIteratorを返却する関数を指定する。
  // また、AsyncIteratorが発するデータから実際にデータを返す
  // resolveというフィールドも用意する。
  subscribe: newLinkSubscribe,
  resolve: (payload) => {
    return payload;
  },
};

const newVote = {
  subscribe: newVoteSubscribe,
  resolve: (payload) => {
    return payload;
  },
};

module.exports = {
  newLink,
  newVote,
};
