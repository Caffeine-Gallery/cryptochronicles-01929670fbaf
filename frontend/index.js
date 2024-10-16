import { AuthClient } from "@dfinity/auth-client";
import { backend } from "declarations/backend";

let authClient = null;
let userPrincipal = null;

const init = async () => {
  authClient = await AuthClient.create();
  if (await authClient.isAuthenticated()) {
    handleAuthenticated(await authClient.getIdentity());
  } else {
    document.getElementById("loginButton").onclick = async () => {
      showLoadingButton("loginButton");
      await authClient.login({
        identityProvider: "https://identity.ic0.app/#authorize",
        onSuccess: async () => {
          handleAuthenticated(await authClient.getIdentity());
        },
      });
    };
  }
};

const handleAuthenticated = async (identity) => {
  userPrincipal = identity.getPrincipal();
  document.getElementById("loginButton").style.display = "none";
  document.getElementById("logoutButton").style.display = "inline-block";
  document.getElementById("newPostButton").style.display = "inline-block";

  document.getElementById("logoutButton").onclick = async () => {
    showLoadingButton("logoutButton");
    await authClient.logout();
    window.location.reload();
  };

  initQuillEditor();
  loadPosts();
};

const showLoadingButton = (buttonId) => {
  const button = document.getElementById(buttonId);
  button.disabled = true;
  button.textContent = "Please wait...";
};

const initQuillEditor = () => {
  const newPostButton = document.getElementById("newPostButton");
  const editorContainer = document.getElementById("editorContainer");
  const submitPostButton = document.getElementById("submitPostButton");

  let quill = new Quill("#editor", {
    theme: "snow",
  });

  newPostButton.onclick = () => {
    editorContainer.style.display = "block";
  };

  submitPostButton.onclick = async () => {
    showLoadingButton("submitPostButton");
    const title = document.getElementById("postTitle").value.trim();
    const body = quill.root.innerHTML;
    const timestamp = BigInt(Date.now());
    if (title && body) {
      await backend.addPost(title, body, userPrincipal, timestamp);
      document.getElementById("postTitle").value = "";
      quill.setContents([]);
      editorContainer.style.display = "none";
      loadPosts();
    } else {
      alert("Please provide a title and body for your post.");
    }
    submitPostButton.disabled = false;
    submitPostButton.textContent = "Submit Post";
  };
};

const loadPosts = async () => {
  const postsContainer = document.getElementById("postsContainer");
  const posts = await backend.getPosts();
  postsContainer.innerHTML = "";
  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "post";

    const titleElement = document.createElement("h2");
    titleElement.textContent = post.title;

    const authorElement = document.createElement("p");
    authorElement.className = "author";
    authorElement.textContent = `By ${post.author.toText()}`;

    const timeElement = document.createElement("p");
    timeElement.className = "timestamp";
    const date = new Date(Number(post.timestamp));
    timeElement.textContent = date.toLocaleString();

    const bodyElement = document.createElement("div");
    bodyElement.innerHTML = post.body;

    postElement.appendChild(titleElement);
    postElement.appendChild(authorElement);
    postElement.appendChild(timeElement);
    postElement.appendChild(bodyElement);

    postsContainer.appendChild(postElement);
  });
};

init();
