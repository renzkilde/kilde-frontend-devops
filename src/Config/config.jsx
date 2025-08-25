import GlobalVariabels from "../Utils/GlobalVariabels";

const devConfig = {
  apiKey: "AIzaSyA2aIHVgEbbbS4z7JbTazlI4MP7v4Ro8Gs",
  authDomain: "safebay-dev.firebaseapp.com",
  projectId: "safebay-dev",
  storageBucket: "safebay-dev.appspot.com",
  messagingSenderId: "445255462606",
  appId: "1:445255462606:web:f6e0b460a324c4da21aa9f",
};

const prodConfig = {
  apiKey: "AIzaSyA2aIHVgEbbbS4z7JbTazlI4MP7v4Ro8Gs",
  authDomain: "safebay-dev.firebaseapp.com",
  projectId: "safebay-dev",
  storageBucket: "safebay-dev.appspot.com",
  messagingSenderId: "445255462606",
  appId: "1:445255462606:web:f6e0b460a324c4da21aa9f",
};

const config = GlobalVariabels.NODE_ENV === "DEV" ? devConfig : prodConfig;

export { config };
