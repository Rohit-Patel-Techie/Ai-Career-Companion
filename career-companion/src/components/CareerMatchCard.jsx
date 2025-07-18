const CareerMatchCard = ({ suggestions }) => (
    <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-2">Career Suggestions</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{suggestions}</p>
    </div>
);

export default CareerMatchCard;