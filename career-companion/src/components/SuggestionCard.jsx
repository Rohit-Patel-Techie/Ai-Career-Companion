export default function SuggestionCard({ suggestions }) {
  const cards = suggestions
    .split(/\n\s*\n/)
    .filter(Boolean)
    .slice(0, 2)
    .map((text, index) => (
      <div
        key={index}
        className="bg-blue-950 dark:bg-gray-800 shadow-lg rounded-xl p-6 flex flex-col justify-between"
      >
        <h3 className="text-xl font-bold text-blue-600 mb-2">Career Path {index + 1}</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap flex-grow">{text}</p>
        <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition">
          View Roadmap
        </button>
      </div>
    ));

  return <>{cards}</>;
}