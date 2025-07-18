import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

const CareerSuggestionCard = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white dark:bg-[#1f1f1f] shadow-md rounded-lg p-5 flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-semibold text-indigo-700 mb-2">{data.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{data.short}</p>
            </div>

            <button
                onClick={() => setIsOpen(true)}
                className="mt-4 text-indigo-600 hover:underline text-sm font-medium"
            >
                Read More →
            </button>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white dark:bg-[#1f1f1f] rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <Dialog.Title className="text-xl font-bold mb-4 text-indigo-700">
                            {data.title}
                        </Dialog.Title>
                        <pre className="text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                            {data.full}
                        </pre>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                            Close
                        </button>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default CareerSuggestionCard;