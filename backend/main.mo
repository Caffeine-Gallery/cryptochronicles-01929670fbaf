import Func "mo:base/Func";
import Int "mo:base/Int";
import Text "mo:base/Text";

import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Array "mo:base/Array";

actor {
  // Define the Post type
  public type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Principal;
    timestamp: Int;
  };

  // Stable variable to store posts
  stable var posts: [Post] = [];

  // Function to add a new post
  public func addPost(title: Text, body: Text, author: Principal, timestamp: Int) : async Nat {
    let postId = Nat.fromInt(posts.size());
    let newPost : Post = {
      id = postId;
      title = title;
      body = body;
      author = author;
      timestamp = timestamp;
    };
    // Prepend the new post to display the most recent at the top
    posts := Array.append([newPost], posts);
    return postId;
  };

  // Function to get all posts
  public query func getPosts() : async [Post] {
    return posts;
  };
};
