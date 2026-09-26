export const knowledgeBase = [
  {
    topic: "Machine Learning",
    content:
      "Machine Learning is a branch of AI that allows computers to learn patterns from data and make predictions without being explicitly programmed for every rule.",
  },
  {
    topic: "Python",
    content:
      "Python is a high-level programming language commonly used for web development, automation, data science, machine learning, and AI.",
  },
  {
    topic: "SQL",
    content:
      "SQL is used to store, retrieve, update, and manage data in relational databases. Common commands include SELECT, INSERT, UPDATE, and DELETE.",
  },
  {
    topic: "Data Science",
    content:
      "Data Science combines statistics, programming, machine learning, and data analysis to discover useful insights from data.",
  },
  {
    topic: "Cloud Computing",
    content:
      "Cloud computing provides computing resources such as servers, storage, databases, and software over the internet.",
  },
];

export function retrieveContext(query: string) {
  const words = query.toLowerCase().split(/\W+/);

  return knowledgeBase
    .map((item) => {
      const text = `${item.topic} ${item.content}`.toLowerCase();
      const score = words.filter((word) => word.length > 2 && text.includes(word)).length;

      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}