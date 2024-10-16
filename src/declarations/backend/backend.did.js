export const idlFactory = ({ IDL }) => {
  const Post = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'body' : IDL.Text,
    'author' : IDL.Principal,
    'timestamp' : IDL.Int,
  });
  return IDL.Service({
    'addPost' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Principal, IDL.Int],
        [IDL.Nat],
        [],
      ),
    'getPosts' : IDL.Func([], [IDL.Vec(Post)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
