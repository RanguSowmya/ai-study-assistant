"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim() && !image) return;

    setLoading(true);
    setReply("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          image: image || null,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setReply(data.error);
      } else {
        setReply(data.reply);
      }
    } catch {
      setReply("Something went wrong. Please try again.");
    }

    setLoading(false);
    setText("");
    setImage("");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white shadow-lg">

        <header className="bg-blue-600 p-6 text-white">
          <h1 className="text-3xl font-bold">AI Study Assistant</h1>
          <p>Ask questions and learn with AI</p>
        </header>

        <div className="min-h-[500px] p-6">

          <div className="mb-6 rounded-xl bg-gray-100 p-4">
            <p className="font-semibold text-gray-800">
              AI Assistant
            </p>
            <p className="text-gray-700">
              Hello! 👋 Ask a study question or upload an image.
            </p>
          </div>

          {image && (
            <div className="mb-4">
              <p className="mb-2 font-semibold text-gray-800">
                Selected image:
              </p>
              <img
                src={image}
                alt="Selected"
                className="max-h-60 rounded-xl border"
              />
            </div>
          )}

          {reply && (
            <div className="mb-6 rounded-xl bg-gray-100 p-4">
              <p className="mb-2 font-semibold text-gray-800">
                AI Assistant
              </p>
              <p className="whitespace-pre-wrap text-gray-800">
                {reply}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="border-t pt-4">

            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ask something..."
              className="mb-3 w-full rounded-xl border bg-white p-3 text-black outline-none"
            />

            <div className="mb-3">
              <label className="font-semibold text-gray-800">
                Upload an image:
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="mt-2 block w-full text-sm text-gray-700"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
            >
              {loading ? "Thinking..." : "Send"}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}