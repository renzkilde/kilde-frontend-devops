import { useEffect, useState } from "react";

const JivoChat = ({ user }) => {
  const [secretKey, setSecretKey] = useState("");

  const JIVOCHAT_SECRET_KEY = process.env.REACT_APP_JIVOCHAT_SECRET_KEY;
  const JIVOCHAT_WIDGET_ID = process.env.REACT_APP_JIVOCHAT_WIDGET_ID;

  useEffect(() => {
    const base64UrlEncode = (str) => {
      return btoa(str)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    };

    const generateJWT = async (header, payload, secret) => {
      const encodedHeader = base64UrlEncode(JSON.stringify(header));
      const encodedPayload = base64UrlEncode(JSON.stringify(payload));
      const headerAndPayload = `${encodedHeader}.${encodedPayload}`;
      const signature = await createSignature(headerAndPayload, secret);
      return `${headerAndPayload}.${signature}`;
    };

    const createSignature = async (headerAndPayload, secret) => {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(headerAndPayload)
      );

      return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
    };

    if (user?.number && user?.email && JIVOCHAT_SECRET_KEY) {
      const header = {
        alg: "HS256",
        typ: "JWT",
      };

      const payload = {
        name: user.firstName + " " + user.lastName,
        id: user.number,
      };

      generateJWT(header, payload, JIVOCHAT_SECRET_KEY).then((token) => {
        setSecretKey(token);
      });
    }
  }, [user, JIVOCHAT_SECRET_KEY]);

  useEffect(() => {
    const loadJivoChatScript = () => {
      const jivoScript = document.createElement("script");
      jivoScript.setAttribute("src", `//code.jivosite.com/widget/${JIVOCHAT_WIDGET_ID}`);
      jivoScript.setAttribute("async", true);
      document.head.appendChild(jivoScript);

      jivoScript.onload = () => {
        const checkJivoApi = setInterval(() => {
          if (window.jivo_api) {
            clearInterval(checkJivoApi);
            window.jivo_api.setUserToken(secretKey);

            window.jivo_api.setContactInfo({
              name: user.name,
              email: user.email,
              phone: user.mobilePhone,
            });

            window.jivo_api.setCustomData([
              {
                title: "User ID",
                content: user.number,
              },
              {
                title: "Name",
                content: user.firstName + " " + user.lastName,
              },
            ]);
          }
        }, 100);
      };
    };
    if (secretKey && JIVOCHAT_WIDGET_ID) {
      loadJivoChatScript();
    }

    return () => {
      const script = document.querySelector(
        `script[src="//code.jivosite.com/widget/${JIVOCHAT_WIDGET_ID}"]`
      );
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [secretKey, user, JIVOCHAT_WIDGET_ID]);

  return null;
};

export default JivoChat;