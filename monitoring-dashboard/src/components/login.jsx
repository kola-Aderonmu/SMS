import React, { useState, useEffect } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);
  const [isTypingEmail, setIsTypingEmail] = useState(false);

  // Effect to handle email typing animation
  useEffect(() => {
    if (email !== "") {
      setIsTypingEmail(true);
    } else {
      setIsTypingEmail(false);
    }
  }, [email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-center mb-4">
          <div
            className={`relative h-24 w-24 transition-transform duration-500 ${
              isPasswordFocus ? "animate-close-eyes" : ""
            } ${isTypingEmail ? "animate-look-around" : ""}`}
          >
            <img
              src="/Login.png"
              alt="Character Animation"
              className="h-full w-full"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="youremail@example.com"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onFocus={() => setIsPasswordFocus(true)}
            onBlur={() => setIsPasswordFocus(false)}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="******************"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
